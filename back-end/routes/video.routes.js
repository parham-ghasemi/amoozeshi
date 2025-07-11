const express = require('express');
const router = express.Router();

const {
  uploadVideo,
  uploadVideoMiddleware,
  getAllVideos,
} = require('../controllers/video.controller');

// Upload + Create a video entry
router.post('/videos', uploadVideoMiddleware, uploadVideo);

router.get('/vidoes', getAllVideos);

module.exports = router;
