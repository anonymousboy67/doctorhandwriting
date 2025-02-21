// src/components/ImageUploader.jsx
import React from 'react';
import './ImageUploader.css'; // ✅ Import CSS file

const ImageUploader = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-uploader-container"> 
      <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" /> {/* ✅ Apply CSS class */}
    </div>
  );
};

export default ImageUploader;
