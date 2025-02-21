/* eslint-disable react/prop-types */
// src/components/Camera.jsx
import  { useRef } from 'react';
import Webcam from 'react-webcam';
import './Camera.css'; // ✅ Import the CSS file
import axios from 'axios';

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = async () => {  // ✅ Make async
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);

    try {
      await axios.post('http://localhost:5000/upload', { image: imageSrc });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (  // ✅ Keep return inside the function
    <div className="camera-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="webcam"
      />
      <button className="capture-button" onClick={capture}>Capture</button>
    </div>
  );
};
export default Camera;