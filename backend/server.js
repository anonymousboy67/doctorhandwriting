const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Allow large images

// Endpoint to handle image upload
app.post('/upload', (req, res) => {
    const { image } = req.body; // Base64 image

    if (!image) {
        return res.status(400).json({ error: 'No image provided' });
    }

    // Convert base64 to binary data
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const filePath = path.join(__dirname, '../public/captured-image.jpg'); // Save in the public folder

    // Save the image to the public folder
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save image' });
        }
        res.json({ message: 'Image saved successfully!', filePath: '/captured-image.jpg' });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
