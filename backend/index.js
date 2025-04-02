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
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// Connect to MongoDB
try {
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../frontend/public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });


app.get('/', async (req, res) => {
    res.json("Backend work for react app");
});


// API Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { name } = req.body;
        const filePath = `/uploads/${req.file.filename}`;

        const newFile = new FileModel({ name, imagePath: filePath });
        await newFile.save();

        res.json({ success: true, message: 'File uploaded successfully', data: newFile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Fetch all images
app.get('/images', async (req, res) => {
    try {
        const files = await FileModel.find();
        res.json({ success: true, images: files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Fetch all images with a particular name
app.get('/images/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const files = await FileModel.find({ name });

        if (!files.length) {
            return res.status(404).json({ success: false, message: 'No images found' });
        }

        res.json({ success: true, images: files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



app.listen(5000, () => console.log('Server running on port 5000'));
