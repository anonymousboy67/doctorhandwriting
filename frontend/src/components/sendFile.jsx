import React, { useState } from "react";
import axios from "axios";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an image");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setText(response.data.text);
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>Extracted Text: {text}</p>
        </div>
    );
};

export default UploadFile;
