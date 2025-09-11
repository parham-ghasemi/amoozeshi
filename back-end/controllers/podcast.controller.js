const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Podcast = require('../models/Podcast');
const Category = require('../models/Category');

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/podcasts');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp3', '.wav', '.ogg', '.aac', '.m4a'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Only audio files are allowed'));
    cb(null, true);
  },
});

exports.uploadPodcastMiddleware = audioUpload.single('audio');

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
exports.uploadPodcastThumbnail = imageUpload.single('image');

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: 'No file uploaded' });

  const fileUrl = `/uploads/images/${req.file.filename}`;
  res.status(200).json({ success: 1, file: { url: fileUrl } });
};

exports.uploadPodcast = async (req, res) => {
  try {
    const { title, shortDesc, longDesc, thumbnail, category, related } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const audioUrl = `/uploads/podcasts/${req.file.filename}`;
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

    const newPodcast = new Podcast({
      title,
      shortDesc,
      longDesc: JSON.parse(longDesc),
      thumbnail,
      category,
      related: parsedRelated,
      listens: 0,
      content: audioUrl,
    });

    await newPodcast.save();

    res.status(201).json({ message: 'Podcast uploaded successfully', podcast: newPodcast });
  } catch (err) {
    console.error('Upload podcast error:', err);
    res.status(500).json({ message: 'Failed to upload podcast' });
  }
};

exports.getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find({}, { id: 1, thumbnail: 1, title: 1, listens: 1, createdAt: 1 });
    res.status(200).json(podcasts);
  } catch (error) {
    console.error('Fetch podcast error:', error);
    res.status(500).json({ message: 'Failed to fetch podcast' });
  }
};

exports.getPodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndUpdate(
      req.params.id,
      { $inc: { listens: 1 } },
      { new: true }
    ).populate("category", "name");

    if (!podcast) return res.status(404).json({ message: 'Podcast not found' });

    res.json({ podcast });
  } catch (error) {
    console.error('Error incrementing listens:', error);
    res.status(500).json({ message: 'Failed to fetch podcast' });
  }
};

exports.getShortPodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.find({ _id: req.params.id }, { id: 1, thumbnail: 1, title: 1, listens: 1, createdAt: 1 });

    if (!podcast.length) return res.status(404).json({ message: 'Podcast not found' });

    res.json({ podcastObject: podcast[0] });
  } catch (error) {
    console.error('Error getting short podcast:', error);
    res.status(500).json({ message: 'Failed to fetch podcast' });
  }
};

exports.getPodcastsByCategory = async (req, res) => {
  const { category } = req.params;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const podcasts = await Podcast.find(
      { category: new mongoose.Types.ObjectId(category) },
      { _id: 1, thumbnail: 1, title: 1, listens: 1, createdAt: 1 }
    );

    res.status(200).json(podcasts);
  } catch (error) {
    console.error('Error fetching podcasts by category:', error);
    res.status(500).json({ message: 'Failed to fetch category podcasts' });
  }
};

exports.getMostListenedPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find({}, { id: 1, thumbnail: 1, title: 1, listens: 1, createdAt: 1 })
      .sort({ listens: -1 })
      .limit(20);

    res.status(200).json(podcasts);
  } catch (error) {
    console.error('Error fetching most listened podcasts:', error);
    res.status(500).json({ message: 'Failed to fetch most listened podcasts' });
  }
};

exports.getNewestPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find({}, { id: 1, thumbnail: 1, title: 1, createdAt: 1, listens: 1 })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(podcasts);
  } catch (error) {
    console.error('Error fetching newest podcasts:', error);
    res.status(500).json({ message: 'Failed to fetch newest podcasts' });
  }
};

exports.searchedPodcasts = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const results = await Podcast.find({
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

exports.editPodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDesc, longDesc, thumbnail, category, related } = req.body;

    const existingPodcast = await Podcast.findById(id);
    if (!existingPodcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    if (category && category.toString() !== existingPodcast.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      existingPodcast.category = category;
    }

    if (req.file) {
      const audioUrl = `/uploads/podcasts/${req.file.filename}`;
      existingPodcast.content = audioUrl;
    }

    if (title) existingPodcast.title = title;
    if (shortDesc) existingPodcast.shortDesc = shortDesc;
    if (longDesc) {
      try {
        existingPodcast.longDesc = typeof longDesc === "string" ? JSON.parse(longDesc) : longDesc;
      } catch (e) {
        return res.status(400).json({ message: 'Invalid longDesc JSON format' });
      }
    }
    if (thumbnail) existingPodcast.thumbnail = thumbnail;

    if (related !== undefined) {
      try {
        let parsedRelated = Array.isArray(related)
          ? related
          : JSON.parse(related || '[]');
        parsedRelated = parsedRelated.map(id => new mongoose.Types.ObjectId(id));
        existingPodcast.related = parsedRelated;
      } catch (e) {
        console.warn('Failed to parse related:', related);
        existingPodcast.related = [];
      }
    }

    await existingPodcast.save();

    res.status(200).json({ message: 'Podcast updated successfully', podcast: existingPodcast });
  } catch (err) {
    console.error('Edit podcast error:', err);
    res.status(500).json({ message: 'Failed to edit podcast' });
  }
};

exports.deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid podcast ID' });
    }

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    // Delete associated audio and thumbnail files
    if (podcast.content) {
      const audioPath = path.join(__dirname, '../', podcast.content);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }
    if (podcast.thumbnail) {
      const thumbnailPath = path.join(__dirname, '../', podcast.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Remove podcast from related fields in other podcasts
    await Podcast.updateMany(
      { related: id },
      { $pull: { related: id } }
    );

    await Podcast.findByIdAndDelete(id);

    res.status(200).json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    console.error('Delete podcast error:', error);
    res.status(500).json({ message: 'Failed to delete podcast' });
  }
};