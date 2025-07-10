
const express = require('express');
const router = express.Router();

const {
  addArticle,
  uploadImage,
  uploadMiddleware,
  getArticleById,
  getShortArticleById,
  getAllArticles,
  searchedArticles,
  getArticlesByCategory,
  getNewestArticles,
  getMostViewedArticles
} = require('../controllers/article.controller');

router.post('/articles', addArticle);
router.post('/upload', uploadMiddleware, uploadImage);

router.get('/article/:id', getArticleById);
router.get('/articles/short/:id', getShortArticleById)
router.get('/articles', getAllArticles);
router.get('/articles/search', searchedArticles)

router.get('/articles/category/:category', getArticlesByCategory);
router.get('/articles/most-viewed', getMostViewedArticles);
router.get('/articles/newest', getNewestArticles);


module.exports = router;
