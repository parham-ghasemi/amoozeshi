const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Video = require('../models/Video');
const Category = require('../models/Category');

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
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Only video files are allowed'));
    cb(null, true);
  },
});

exports.uploadVideoMiddleware = videoUpload.single('video');

// === EditorJS-compatible image upload ===
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const imageUpload = multer({ storage: imageStorage });
exports.uploadVideoThumbnail = imageUpload.single('image');

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: 'No file uploaded' });

  const fileUrl = `http://localhost:3000/uploads/images/${req.file.filename}`;
  res.status(200).json({ success: 1, file: { url: fileUrl } });
};

// === Upload and save video ===
exports.uploadVideo = async (req, res) => {
  try {
    const { title, shortDesc, longDesc, thumbnail, category, related } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const videoUrl = `http://localhost:3000/uploads/videos/${req.file.filename}`;
    let parsedRelated = [];
    try {
      parsedRelated = Array.isArray(related)
        ? related
        : JSON.parse(related || '[]');
      parsedRelated = parsedRelated.map(id => new mongoose.Types.ObjectId(id));
    } catch (e) {
      console.warn('Failed to parse related:', related);
      parsedRelated = [];
    }


    const newVideo = new Video({
      title,
      shortDesc,
      longDesc: JSON.parse(longDesc),
      thumbnail,
      category,
      related: parsedRelated,
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
    ).populate("category", "name"); // ✅ Populate category name

    if (!video) return res.status(404).json({ message: 'Video not found' });

    res.json({ video });
  } catch (error) {
    console.error('Error incrementing visits:', error);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};


exports.getShortVideoById = async (req, res) => {
  try {
    const video = await Video.find({ _id: req.params.id }, { id: 1, thumbnail: 1, title: 1, visits: 1, createdAt: 1 });

    if (!video.length) return res.status(404).json({ message: 'Video not found' });

    res.json({ videoObject: video[0] });
  } catch (error) {
    console.error('Error getting short video:', error);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};

exports.getVideosByCategory = async (req, res) => {
  const { category } = req.params;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const videos = await Video.find(
      { category: new mongoose.Types.ObjectId(category) },
      { _id: 1, thumbnail: 1, title: 1, visits: 1, createdAt: 1 }
    );

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    res.status(500).json({ message: 'Failed to fetch category videos' });
  }
};


exports.getMostViewedVideos = async (req, res) => {
  try {
    const videos = await Video.find({}, { id: 1, thumbnail: 1, title: 1, visits: 1, createdAt: 1 })
      .sort({ visits: -1 })
      .limit(20);

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching most viewed videos:', error);
    res.status(500).json({ message: 'Failed to fetch most viewed videos' });
  }
};

exports.getNewestVideos = async (req, res) => {
  try {
    const videos = await Video.find({}, { id: 1, thumbnail: 1, title: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching newest videos:', error);
    res.status(500).json({ message: 'Failed to fetch newest videos' });
  }
};

exports.searchedVideos = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const results = await Video.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { shortDesc: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
