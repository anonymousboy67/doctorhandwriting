import { useState } from "react";
import axios from "axios";

const OCRUploader = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError("");
    setText("");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.text) {
        setText(response.data.text);
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
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">OCR Image Uploader</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" className="mb-4 border p-2 rounded" />
      <button 
        onClick={handleUpload} 
        disabled={loading} 
        className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : "Upload & Extract Text"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {text && (
        <div className="mt-6 bg-white p-4 rounded shadow-md w-3/4">
          <h3 className="text-lg font-semibold">Extracted Text:</h3>
          <p className="mt-2 text-gray-700">{text}</p>
        </div>
      )}
    </div>
  );
};

export default OCRUploader;
