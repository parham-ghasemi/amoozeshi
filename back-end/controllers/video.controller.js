const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

// === Multer setup for video files ===
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/videos');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only video files are allowed'));
    }
    cb(null, true);
  },
});

exports.uploadVideoMiddleware = videoUpload.single('video');

// === Controller to add a new video ===
exports.uploadVideo = async (req, res) => {
  try {
    const { title, shortDesc, thumbnail, category, related } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoUrl = `http://localhost:3000/uploads/videos/${req.file.filename}`;

    const newVideo = new Video({
      title,
      shortDesc,
      thumbnail,
      category,
      related: related ? JSON.parse(related) : [],
      visits: 0,
      content: videoUrl,
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (err) {
    console.error('Upload video error:', err);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};
