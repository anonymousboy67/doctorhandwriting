import './Card.css';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Camera from './Camera';
import ImageUploader from './ImageUploader';
import axios from 'axios';

const Card = ({ children }) => (
  <motion.div className="card" whileHover={{ scale: 1.05 }}>
    {children}
  </motion.div>
);

const HeroSection = () => {
  return (
    <section className="hero">
      <h1>Welcome to Our Platform</h1>
      <p>Empower your creativity with seamless uploads and real-time camera access.</p>
      <img src="/public/medical.png" alt="Hero Image" />
      <button className="hero-button">Get Started</button>
    </section>
  );
};

export default function CameraUploadCards() {
  const [OcrResult, setOcrResult] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCapture = async (imageSrc) => {
    const formData = new FormData();
    formData.append("file", imageSrc); // Assuming imageSrc is a File object

    try {
      const response = await axios.post("http://127.0.0.1:5000/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.text) {
        setOcrResult(response.data.text);
      } else {
        setOcrResult("No text detected in the image.");
      }
    } catch (err) {
      setOcrResult("Error processing image. Please try again.");
      console.error(err);
    } finally {
      setShowModal(false); // Close modal after processing
    }
  };

  const handleUpload = async (imageSrc) => {
    const formData = new FormData();
    formData.append("file", imageSrc); // Assuming imageSrc is a File object

    try {
      const response = await axios.post("http://127.0.0.1:5000/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.text) {
        setOcrResult(response.data.text);
      } else {
        setOcrResult("No text detected in the image.");
      }
    } catch (err) {
      setOcrResult("Error processing image. Please try again.");
      console.error(err);
    } finally {
      setShowModal(false); // Close modal after processing
    }
  };

  const openCamera = () => {
    setShowCamera(true);
    setShowUploader(false);
    setShowModal(true);
  };

  const openUploader = () => {
    setShowUploader(true);
    setShowCamera(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowCamera(false);
    setShowUploader(false);
  };

  return (
    <div>
      <HeroSection />
      <div className="card-container">
        <Card>
          <h2 className="card-title">Open Camera</h2>
          <button className="button-blue" onClick={openCamera}>Open Camera</button>
        </Card>

        <Card>
          <h2 className="card-title">Upload File</h2>
          <button className="button-green" onClick={openUploader}>Upload File</button>
        </Card>

        {/* Modal for Camera and Uploader */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              {showCamera && <Camera onCapture={handleCapture} />}
              {showUploader && <ImageUploader onUpload={handleUpload} />}
            </div>
          </div>
        )}

        <div className="ocr-box">
          <pre className="ocr-text">{OcrResult || "No text extracted yet."}</ pre>
        </div>
      </div>

      
    </div>
  );
}