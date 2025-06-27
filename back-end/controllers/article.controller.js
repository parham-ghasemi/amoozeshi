const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');

const Article = require('../models/Article');

exports.addArticle = async (req, res) => {
  try {
    const { title, description, content, category, related, thumbnail } = req.body;
    console.log('Trying to add article...')
    console.log(`title: ${title}, category: ${category}`)

    // Basic validation
    if (!title || !description || !content || !category || !thumbnail) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const parsedRelated = (related || []).map(id => new mongoose.Types.ObjectId(id));

    // const newArticle = new Article({
    //   title,
    //   description,
    //   content,
    //   category,
    //   related: related || [],
    //   thumbnail,
    //   visits: 0,
    // });
    const newArticle = new Article({
      title,
      description,
      content: JSON.parse(content), // ⛏️ NOTE: Frontend is sending it stringified
      category,
      related: parsedRelated,
      thumbnail,
      visits: 0,
    });
    console.log('Article Added successfully: \n', newArticle);

    await newArticle.save();

    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (error) {
    console.error('Add article error:', error);
    res.status(500).json({ message: 'Failed to create article' });
  }
};

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

  const fileUrl = `http://localhost:3000/uploads/images/${req.file.filename}`;

  res.status(200).json({
    success: 1,
    file: {
      url: fileUrl,
    },
  });
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { visits: 1 } },
      { new: true }
    );

    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.json({ article });
  } catch (error) {
    console.error('Error incrementing visits:', error);
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