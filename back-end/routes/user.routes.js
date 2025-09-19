const express = require('express');
const { getCurrentUser, getAllUsers, toggleFavoriteCourse, toggleFavoriteVideo, toggleFavoriteArticle, toggleFavoritePodcast, toggleFavoriteCounsel } = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const router = express.Router();

router.get("/user/me", authenticate, getCurrentUser);
router.get("/users", authenticate, authorizeAdmin, getAllUsers);
router.post("/user/favorite/course/:id", authenticate, toggleFavoriteCourse);
router.post("/user/favorite/video/:id", authenticate, toggleFavoriteVideo);
router.post("/user/favorite/article/:id", authenticate, toggleFavoriteArticle);
router.post("/user/favorite/podcast/:id", authenticate, toggleFavoritePodcast);
router.post("/user/favorite/counsel/:id", authenticate, toggleFavoriteCounsel);

module.exports = router;