const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve images statically from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
try{
mongoose.connect('mongodb+srv://visweish:visweish03@cluster0.30sjeoa.mongodb.net/file_upload?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected!!!')
} catch (e) {
    console.log('MongoDB connection error: ', e)
}

// Define Schema
const fileSchema = new mongoose.Schema({
    name: String,
    imagePath: String
});
const FileModel = mongoose.model('File', fileSchema);

// Multer Storage
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Backend for React app" });
});

// Upload Image Route
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const { name } = req.body;
        const filePath = `/uploads/${req.file.filename}`;

        const newFile = new FileModel({ name, imagePath: filePath });
        await newFile.save();

        res.json({ success: true, message: 'File uploaded successfully', data: newFile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Fetch All Images
app.get('/images', async (req, res) => {
    try {
        const files = await FileModel.find();
        res.json({ success: true, images: files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Fetch Images by Name
app.get('/images/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const files = await FileModel.find({ name });

        if (!files.length) return res.status(404).json({ success: false, message: 'No images found' });

        res.json({ success: true, images: files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Serve Image from Database Path
app.get('/image/:filename', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.params.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
