const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');

const Article = require('../models/Article');
const Category = require('../models/Category');
const Course = require('../models/Course'); // Add this import

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../Uploads/images');
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

  const fileUrl = `/Uploads/images/${req.file.filename}`;

  res.status(200).json({
    success: 1,
    file: {
      url: fileUrl,
    },
  });
};

exports.addArticle = async (req, res) => {
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

    const newArticle = new Article({
      title,
      description,
      content: JSON.parse(content),
      category,
      related: parsedRelated,
      thumbnail,
      visits: 0,
    });

    await newArticle.save();

    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (error) {
    console.error('Add article error:', error);
    res.status(500).json({ message: 'Failed to create article' });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { visits: 1 } },
      { new: true }
    ).populate("category");

    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.json({ article });
  } catch (error) {
    console.error('Error incrementing visits:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
};

exports.getShortArticleById = async (req, res) => {
  try {
    const article = await Article.find({ _id: req.params.id }, { id: 1, thumbnail: 1, title: 1, description: 1 });

    if (!article) return res.status(404).json({ message: 'Article not found' });

    const articleObject = article.shift();

    res.json({ articleObject });
  } catch (error) {
    console.error('Error getting short article:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({}, { id: 1, thumbnail: 1, title: 1, description: 1 });
    res.status(200).json(articles);
  } catch (error) {
    console.error('Fetch articles error:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
};

exports.searchedArticles = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await Article.find({
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

exports.getArticlesByCategory = async (req, res) => {
  const { category } = req.params;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const articles = await Article.find(
      { category: new mongoose.Types.ObjectId(category) },
      { _id: 1, thumbnail: 1, title: 1, description: 1 }
    );
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching category articles:', error);
    res.status(500).json({ message: 'Failed to fetch category articles' });
  }
};

exports.getMostViewedArticles = async (req, res) => {
  try {
    const articles = await Article.find({}, { id: 1, thumbnail: 1, title: 1, description: 1, visits: 1 })
      .sort({ visits: -1 })
      .limit(20);

    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching most viewed articles:', error);
    res.status(500).json({ message: 'Failed to fetch most viewed articles' });
  }
};

exports.getNewestArticles = async (req, res) => {
  try {
    const articles = await Article.find({}, { id: 1, thumbnail: 1, title: 1, description: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching newest articles:', error);
    res.status(500).json({ message: 'Failed to fetch newest articles' });
  }
};

exports.editArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid article ID" });
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

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "Article updated successfully",
      article: updatedArticle,
    });

  } catch (error) {
    console.error("Edit article error:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Delete associated thumbnail file
    if (article.thumbnail) {
      const thumbnailPath = path.join(__dirname, '../', article.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Remove article from related fields in other articles
    await Article.updateMany(
      { related: id },
      { $pull: { related: id } }
    );

    // Remove article from courses' content
    await Course.updateMany(
      { 'content.itemId': id },
      { $pull: { content: { itemId: id } } }
    );

    await Article.findByIdAndDelete(id);

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Failed to delete article' });
  }
};