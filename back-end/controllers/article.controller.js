const path = require('path');
const fs = require('fs');
const multer = require('multer');

const Article = require('../models/Article');

exports.addArticle = async (req, res) => {
  try {
    const { title, content, category, related } = req.body;
    console.log('Trying to add article...')
    console.log(`title: ${title}, category: ${category}`)

    // Basic validation
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const newArticle = new Article({
      title,
      content,
      category,
      related: related || [],
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
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
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


// Get
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ article });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch article' });
  }
};
