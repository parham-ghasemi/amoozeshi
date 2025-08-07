const express = require('express');
const { getCurrentUser, toggleFavoriteCourse, toggleFavoriteVideo, toggleFavoriteArticle } = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const router = express.Router();

router.get("/user/me", authenticate, getCurrentUser);
router.post("/user/favorite/course/:id", authenticate, toggleFavoriteCourse);
router.post("/user/favorite/video/:id", authenticate, toggleFavoriteVideo);
router.post("/user/favorite/article/:id", authenticate, toggleFavoriteArticle);

module.exports = router;