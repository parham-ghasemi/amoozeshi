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
  searchedVideos,
  editVideo,
  deleteVideo
} = require('../controllers/video.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/videos', authenticate, authorizeAdmin, uploadVideoMiddleware, uploadVideo);
router.patch('/videos/:id', authenticate, authorizeAdmin, uploadVideoMiddleware, editVideo);
router.delete('/videos/:id', authenticate, authorizeAdmin, deleteVideo);
router.post('/videos/upload', authenticate, authorizeAdmin, uploadVideoThumbnail, uploadImage);

router.get('/videos', getAllVideos);
router.get('/video/:id', getVideoById);
router.get('/video/short/:id', getShortVideoById);

router.get('/videos/category/:category', getVideosByCategory);
router.get('/videos/most-viewed', getMostViewedVideos);
router.get('/videos/newest', getNewestVideos);
router.get('/videos/search', searchedVideos);

module.exports = router;