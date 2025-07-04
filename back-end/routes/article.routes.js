
const express = require('express');
const router = express.Router();

const {
  addArticle,
  uploadImage,
  uploadMiddleware,
  getArticleById,
  getShortArticleById,
  getAllArticles,
} = require('../controllers/article.controller');

router.post('/articles', addArticle);
router.post('/upload', uploadMiddleware, uploadImage);

router.get('/articles/:id', getArticleById);
router.get('/articles/short/:id', getShortArticleById)
router.get('/articles', getAllArticles);

module.exports = router;
