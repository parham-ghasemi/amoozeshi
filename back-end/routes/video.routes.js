const express = require('express');
const router = express.Router();

const {
  uploadVideo,
  uploadVideoMiddleware,
} = require('../controllers/video.controller');

// Upload + Create a video entry
router.post('/videos', uploadVideoMiddleware, uploadVideo);

module.exports = router;
