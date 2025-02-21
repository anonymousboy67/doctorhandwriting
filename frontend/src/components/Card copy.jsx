/* HeroSection.jsx */
/* HeroSection.jsx */
import './Card.css';
import { motion } from 'framer-motion';

import { useState } from 'react';
import Camera from './Camera';
import ImageUploader from './ImageUploader'
import {extractText} from "../utils/ocr"

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

  const[OcrResult, setOcrResult]=useState('');
  const[showCamera, setShowCamera]=useState(false);
  const[showUploader, setShowUploader]=useState(false);

  const handleCapture=async(imageSrc)=>{
    const text=await extractText(imageSrc);
    setOcrResult(text);
  };

  const handleUpload=async(imageSrc)=>{
    const text=await extractText(imageSrc);
    setOcrResult(text);
  }



  return (
    <div>   
      <HeroSection />
      <div className="card-container">
        <Card>
          <h2 className="card-title">Open Camera</h2>
          <button className="button-blue" onClick={()=>setShowCamera(true)}>Open Camera</button>
        </Card>

       

        <Card>
          <h2 className="card-title">Upload File</h2>
          <button className="button-green" onClick={()=>setShowUploader(true)}>Upload File</button>
          
        </Card>


        <div className='input-container'>
          {showCamera && <Camera onCapture={handleCapture}/>}
          {showUploader && <ImageUploader onUpload={handleUpload}/>}
        </div>


        <div className="ocr-box">
          <pre className="ocr-text">{OcrResult || "No text extracted yet."}</pre>
        </div>
      </div>
    </div>
  );
}
