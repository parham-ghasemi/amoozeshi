const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');

const Counsel = require('../models/Counsel');
const Category = require('../models/Category');
const Course = require('../models/Course'); // Add this import

// Multer setup
const storage = multer.diskStorage({
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

const upload = multer({ storage });

exports.uploadMiddleware = upload.single('image');

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/images/${req.file.filename}`;

  res.status(200).json({
    success: 1,
    file: {
      url: fileUrl,
    },
  });
};

exports.addCounsel = async (req, res) => {
  try {
    const { title, description, content, category, related, thumbnail } = req.body;

    if (!title || !description || !content || !category || !thumbnail) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const parsedRelated = (related || []).map(id => new mongoose.Types.ObjectId(id));

    const newCounsel = new Counsel({
      title,
      description,
      content: JSON.parse(content),
      category,
      related: parsedRelated,
      thumbnail,
      visits: 0,
    });

    await newCounsel.save();

    res.status(201).json({ message: 'Counsel created successfully', counsel: newCounsel });
  } catch (error) {
    console.error('Add counsel error:', error);
    res.status(500).json({ message: 'Failed to create counsel' });
  }
};

exports.getCounselById = async (req, res) => {
  try {
    const counsel = await Counsel.findByIdAndUpdate(
      req.params.id,
      { $inc: { visits: 1 } },
      { new: true }
    ).populate("category");

    if (!counsel) return res.status(404).json({ message: 'Counsel not found' });

    res.json({ counsel });
  } catch (error) {
    console.error('Error incrementing visits:', error);
    res.status(500).json({ message: 'Failed to fetch counsel' });
  }
};

exports.getShortCounselById = async (req, res) => {
  try {
    const counsel = await Counsel.find({ _id: req.params.id }, { id: 1, thumbnail: 1, title: 1, description: 1 });

    if (!counsel) return res.status(404).json({ message: 'Counsel not found' });

    const counselObject = counsel.shift();

    res.json({ counselObject });
  } catch (error) {
    console.error('Error getting short counsel:', error);
    res.status(500).json({ message: 'Failed to fetch counsel' });
  }
};

exports.getAllCounsels = async (req, res) => {
  try {
    const counsels = await Counsel.find({}, { id: 1, thumbnail: 1, title: 1, description: 1 });
    res.status(200).json(counsels);
  } catch (error) {
    console.error('Fetch counsels error:', error);
    res.status(500).json({ message: 'Failed to fetch counsels' });
  }
};

exports.searchedCounsels = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await Counsel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCounselsByCategory = async (req, res) => {
  const { category } = req.params;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const counsels = await Counsel.find(
      { category: new mongoose.Types.ObjectId(category) },
      { _id: 1, thumbnail: 1, title: 1, description: 1 }
    );
    res.status(200).json(counsels);
  } catch (error) {
    console.error('Error fetching category counsels:', error);
    res.status(500).json({ message: 'Failed to fetch category counsels' });
  }
};

exports.getMostViewedCounsels = async (req, res) => {
  try {
    const counsels = await Counsel.find({}, { id: 1, thumbnail: 1, title: 1, description: 1, visits: 1 })
      .sort({ visits: -1 })
      .limit(20);

    res.status(200).json(counsels);
  } catch (error) {
    console.error('Error fetching most viewed counsels:', error);
    res.status(500).json({ message: 'Failed to fetch most viewed counsels' });
  }
};

exports.getNewestCounsels = async (req, res) => {
  try {
    const counsels = await Counsel.find({}, { id: 1, thumbnail: 1, title: 1, description: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(counsels);
  } catch (error) {
    console.error('Error fetching newest counsels:', error);
    res.status(500).json({ message: 'Failed to fetch newest counsels' });
  }
};

exports.editCounsel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid counsel ID" });
    }

    const { title, description, content, category, related, thumbnail } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (content) {
      try {
        updateData.content = typeof content === "string" ? JSON.parse(content) : content;
      } catch {
        return res.status(400).json({ message: "Invalid content format" });
      }
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Category not found" });
      }
      updateData.category = category;
    }

    if (related) {
      if (!Array.isArray(related)) {
        return res.status(400).json({ message: "Related must be an array" });
      }
      updateData.related = related.map(id => new mongoose.Types.ObjectId(id));
    }

    const updatedCounsel = await Counsel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCounsel) {
      return res.status(404).json({ message: "Counsel not found" });
    }

    res.status(200).json({
      message: "Counsel updated successfully",
      counsel: updatedCounsel,
    });

  } catch (error) {
    console.error("Edit counsel error:", error);
    res.status(500).json({ message: "Failed to update counsel" });
  }
};

exports.deleteCounsel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid counsel ID' });
    }

    const counsel = await Counsel.findById(id);
    if (!counsel) {
      return res.status(404).json({ message: 'Counsel not found' });
    }

    // Delete associated thumbnail file
    if (counsel.thumbnail) {
      const thumbnailPath = path.join(__dirname, '../', counsel.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Remove counsel from related fields in other counsels
    await Counsel.updateMany(
      { related: id },
      { $pull: { related: id } }
    );

    // Remove counsel from courses' content
    await Course.updateMany(
      { 'content.itemId': id },
      { $pull: { content: { itemId: id } } }
    );

    await Counsel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Counsel deleted successfully' });
  } catch (error) {
    console.error('Delete counsel error:', error);
    res.status(500).json({ message: 'Failed to delete counsel' });
  }
};