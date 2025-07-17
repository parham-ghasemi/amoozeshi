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
    const { title, shortDesc, longDesc, thumbnail, category, related } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoUrl = `http://localhost:3000/uploads/videos/${req.file.filename}`;

    const newVideo = new Video({
      title,
      shortDesc,
      longDesc,
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

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({}, { id: 1, thumbnail: 1, title: 1, visits: 1, createdAt: 1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Fetch video error:', error);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { visits: 1 } },
      { new: true }
    );

    if (!video) return res.status(404).json({ message: 'video not found' });

    res.json({ video });
  } catch (error) {
    console.error('Error incrementing visits:', error);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};

exports.getShortVideoById = async (req, res) => {
  try {
    const video = await Video.find({ _id: req.params.id }, { id: 1, thumbnail: 1, title: 1, visits: 1, createdAt: 1 });

    if (!video) return res.status(404).json({ message: 'Video not found' });

    const videoObject = video.shift();

    res.json({ videoObject });
  } catch (error) {
    console.error('Error getting short video:', error);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
}