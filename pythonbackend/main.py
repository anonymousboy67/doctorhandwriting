from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import torch
from PIL import Image
import pytesseract
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load TrOCR Model and Processor
def load_trocr_model():
    try:
        processor = TrOCRProcessor.from_pretrained("microsoft/trocr-large-handwritten")
        model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-large-handwritten")
        return processor, model
    except Exception as e:
        print(f"Error loading model: {e}")
        exit()

processor, model = load_trocr_model()

# Apply Gaussian Blur for Noise Reduction
def apply_gaussian_blur(image):
    return cv2.GaussianBlur(image, (5, 5), 0)

# Adjust Image Contrast
def adjust_contrast(image):
    return cv2.convertScaleAbs(image, alpha=1.5, beta=0)  # Increased contrast

# Preprocess Image
def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = apply_gaussian_blur(gray)
    gray = adjust_contrast(gray)
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 15, 10)
    return gray, binary

# Detect Text Lines
def detect_text_lines(binary):
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 5))
    dilated = cv2.dilate(binary, kernel, iterations=2)
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    valid_contours = [ctr for ctr in contours if cv2.boundingRect(ctr)[3] > 15]
    return sorted(valid_contours, key=lambda ctr: cv2.boundingRect(ctr)[1])

# Perform OCR with TrOCR
def recognize_text(gray, contours):
    recognized_text = []
    for ctr in contours:
        x, y, w, h = cv2.boundingRect(ctr)
        line_img = Image.fromarray(cv2.cvtColor(gray[y:y+h, x:x+w], cv2.COLOR_GRAY2RGB))
        line_img = line_img.resize((line_img.width * 2, line_img.height * 2), Image.BICUBIC)
        
        pixel_values = processor(line_img, return_tensors="pt").pixel_values
        with torch.no_grad():
            generated_ids = model.generate(pixel_values)
        text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        recognized_text.append(text)
    
    return "\n".join(recognized_text)

# Tesseract OCR Fallback
def recognize_full_image_with_tesseract(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = apply_gaussian_blur(gray)
    gray = adjust_contrast(gray)
    _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    return pytesseract.image_to_string(binary)

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read and preprocess image
        image = Image.open(file.stream)
        image = np.array(image)
        gray, binary = preprocess_image(image)

        # Perform OCR
        contours = detect_text_lines(binary)
        extracted_text = recognize_text(gray, contours)

        # Fallback to Tesseract if no text is detected
        if not extracted_text.strip():
            extracted_text = recognize_full_image_with_tesseract(image)

        return jsonify({"text": extracted_text.strip() or "No text detected."})

    except Exception as e:
        return jsonify({"error": f"Error processing image: {e}"}), 500

if __name__ == '__main__':  
    app.run(host='0.0.0.0', port=5000, debug=True)  # ✅ Allow external access
