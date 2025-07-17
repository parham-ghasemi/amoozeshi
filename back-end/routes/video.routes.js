const express = require('express');
const router = express.Router();

const {
  uploadVideo,
  uploadVideoMiddleware,
  getAllVideos,
  getVideoById,
  getShortVideoById,
} = require('../controllers/video.controller');

// Upload + Create a video entry
router.post('/videos', uploadVideoMiddleware, uploadVideo);

router.get('/vidoes', getAllVideos);
router.get('/video/:id', getVideoById);
router.get('/video/short/:id', getShortVideoById);

module.exports = router;
