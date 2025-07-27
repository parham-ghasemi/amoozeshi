const express = require('express');
const router = express.Router();

const {
  uploadVideo,
  uploadVideoMiddleware,
  uploadImage,
  uploadVideoThumbnail,
  getAllVideos,
  getVideoById,
  getShortVideoById,
  getVideosByCategory,
  getMostViewedVideos,
  getNewestVideos,
  searchedVideos
} = require('../controllers/video.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

// Upload a video file and create entry
router.post('/videos', authenticate, authorizeAdmin, uploadVideoMiddleware, uploadVideo);

// EditorJS-compatible image upload (thumbnail, etc.)
router.post('/videos/upload', authenticate, authorizeAdmin, uploadVideoThumbnail, uploadImage);

// Fetch videos
router.get('/videos', getAllVideos);
router.get('/video/:id', getVideoById);
router.get('/video/short/:id', getShortVideoById);

// Filter & search
router.get('/videos/category/:category', getVideosByCategory);
router.get('/videos/most-viewed', getMostViewedVideos);
router.get('/videos/newest', getNewestVideos);
router.get('/videos/search', searchedVideos);

module.exports = router;
