import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

function HeroSection() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to open camera and capture image
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image URL
        const capturedImage = canvas.toDataURL("image/png");
        setImage(capturedImage);

        // Convert to Blob and send to backend
        canvas.toBlob((blob) => {
          const file = new File([blob], "captured_image.png", { type: "image/png" });
          uploadImage(file);
        });

        stream.getTracks().forEach((track) => track.stop());
      }, 3000); // Capture image after 3 seconds
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  // Function to send image to the backend
  const uploadImage = async (file) => {
    setLoading(true);
    setError("");
    setExtractedText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.text) {
        setExtractedText(response.data.text);
      } else {
        setError("No text detected in the image.");
      }
    } catch (err) {
      setError("Error processing image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Flex Container */}
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 px-6 md:px-12">
        
        {/* Left Side: Handwriting Card */}
        <div className="relative z-10 flex-1 p-8 bg-white/50 backdrop-blur-lg rounded-xl shadow-2xl space-y-6">
          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold text-black mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Detect Doctor Handwriting with Precision
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl mb-6 text-blue-900 opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Our cutting-edge AI technology transforms doctor’s handwritten notes into accurate, digital text. Streamline documentation and diagnosis with ease.
          </motion.p>

          {/* CTA Button to Open Camera */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <button
              onClick={openCamera}
              className="inline-block px-8 py-4 bg-yellow-500 text-black font-semibold text-lg rounded-full shadow-md transform hover:scale-105 hover:bg-yellow-400 transition-all duration-300 ease-in-out"
            >
              Try the Demo
            </button>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <div className="relative flex-1 h-[500px] rounded-xl overflow-hidden shadow-xl">
          {image ? (
            <img src={image} alt="Captured" className="w-full h-full object-cover object-center" />
          ) : (
            <img src="/medical3.png" alt="Medical Handwriting" className="w-full h-full object-cover object-center" />
          )}
        </div>
      </div>

      {/* Upload Buttons Section */}
      <div className="flex justify-center mt-10 space-x-6">
        {/* Upload Image Button */}
        <button
          onClick={openCamera}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-400 transform hover:scale-105 transition-all duration-300"
        >
          📸 Capture Image from Camera
        </button>

        {/* Upload File Button */}
        <label className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-400 transform hover:scale-105 transition-all duration-300 cursor-pointer">
          📂 Upload Your File Here
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Extracted Text Display */}
      {loading && <p className="text-center text-blue-500 mt-4">Processing image...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      {extractedText && (
        <div className="mt-6 bg-white p-4 rounded shadow-md w-3/4 mx-auto">
          <h3 className="text-lg font-semibold">Extracted Text:</h3>
          <p className="mt-2 text-gray-700">{extractedText}</p>
        </div>
      )}
    </section>
  );
}

export default HeroSection;
