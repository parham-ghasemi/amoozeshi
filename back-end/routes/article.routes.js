
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
  getMostViewedArticles,
  editArticle
} = require('../controllers/article.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/articles', authenticate, authorizeAdmin, addArticle);
router.patch('/article/:id', authenticate, authorizeAdmin, editArticle);
router.post('/upload', authenticate, authorizeAdmin, uploadMiddleware, uploadImage);

router.get('/article/:id', getArticleById);
router.get('/articles/short/:id', getShortArticleById)
router.get('/articles', getAllArticles);
router.get('/articles/search', searchedArticles)

router.get('/articles/category/:category', getArticlesByCategory);
router.get('/articles/most-viewed', getMostViewedArticles);
router.get('/articles/newest', getNewestArticles);


module.exports = router;
