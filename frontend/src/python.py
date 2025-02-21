import os
import logging
import cv2
import numpy as np
import torch
from PIL import Image
import pytesseract
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Suppress TensorFlow Warnings and Info Logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress all TensorFlow logs (set to '2' for warnings)

# Suppress warnings from other libraries
logging.getLogger("tensorflow").setLevel(logging.ERROR)
logging.getLogger("transformers").setLevel(logging.ERROR)

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
    alpha = 1.5  # Contrast control
    beta = 0  # Brightness control
    return cv2.convertScaleAbs(image, alpha=alpha, beta=beta)

# Preprocess Image (Adaptive Thresholding and Contrast Adjustment)
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        print("Error: Image not found!")
        exit()
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    gray = apply_gaussian_blur(gray)
    
    # Apply contrast adjustment
    gray = adjust_contrast(gray)
    
    # Adaptive thresholding
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 15, 10)
    
    return gray, binary

# Correct Skew in the Image
def correct_skew(image):
    coords = np.column_stack(np.where(image > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated_image = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    
    return rotated_image

# Detect Text Lines Using Improved Contour Filtering
def detect_text_lines(binary):
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 5))
    dilated = cv2.dilate(binary, kernel, iterations=2)
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    valid_contours = [ctr for ctr in contours if cv2.boundingRect(ctr)[3] > 15]  # Min height filter
    return sorted(valid_contours, key=lambda ctr: cv2.boundingRect(ctr)[1])  # Sort top-to-bottom

# Perform OCR with TrOCR on Each Text Line
def recognize_text(gray, contours):
    recognized_text = []
    for ctr in contours:
        x, y, w, h = cv2.boundingRect(ctr)
        line_img = Image.fromarray(cv2.cvtColor(gray[y:y+h, x:x+w], cv2.COLOR_GRAY2RGB))
        
        # Resize for better recognition (TrOCR performs better with larger images)
        line_img = line_img.resize((line_img.width * 2, line_img.height * 2), Image.BICUBIC)
        
        pixel_values = processor(line_img, return_tensors="pt").pixel_values
        with torch.no_grad():  
            generated_ids = model.generate(pixel_values)
        text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        recognized_text.append(text)
    
    return "\n".join(recognized_text)

# Perform OCR on Entire Image (Using Tesseract as fallback)
def recognize_full_image_with_tesseract(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur and contrast adjustment
    gray = apply_gaussian_blur(gray)
    gray = adjust_contrast(gray)
    
    # Apply adaptive thresholding
    _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    
    # Run Tesseract OCR
    text = pytesseract.image_to_string(binary)
    return text

# Main Function
def main(image_path, use_full_image=False):
    gray, binary = preprocess_image(image_path)
    
    if not use_full_image:
        contours = detect_text_lines(binary)
        full_text = recognize_text(gray, contours)
    else:
        full_text = recognize_full_image_with_tesseract(image_path)
    
    print("\nRecognized Text:\n", full_text)

# Run the OCR
image_path = "here.jpg"  # Replace with your image path
main(image_path, use_full_image=False)  # Set to False for line-by-line recognition, True for full image
