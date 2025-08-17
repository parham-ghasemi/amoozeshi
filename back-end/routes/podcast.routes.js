const express = require('express');
const router = express.Router();

const {
  uploadPodcast,
  uploadPodcastMiddleware,
  uploadImage,
  uploadPodcastThumbnail,
  getAllPodcasts,
  getPodcastById,
  getShortPodcastById,
  getPodcastsByCategory,
  getMostListenedPodcasts,
  getNewestPodcasts,
  searchedPodcasts,
  editPodcast
} = require('../controllers/podcast.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

// Upload an audio file and create entry
router.post('/podcasts', authenticate, authorizeAdmin, uploadPodcastMiddleware, uploadPodcast);
router.patch('/podcasts/:id', authenticate, authorizeAdmin, uploadPodcastMiddleware, editPodcast);

// EditorJS-compatible image upload (thumbnail, etc.)
router.post('/podcasts/upload', authenticate, authorizeAdmin, uploadPodcastThumbnail, uploadImage);

// Fetch podcasts
router.get('/podcasts', getAllPodcasts);
router.get('/podcast/:id', getPodcastById);
router.get('/podcast/short/:id', getShortPodcastById);

// Filter & search
router.get('/podcasts/category/:category', getPodcastsByCategory);
router.get('/podcasts/most-listened', getMostListenedPodcasts);
router.get('/podcasts/newest', getNewestPodcasts);
router.get('/podcasts/search', searchedPodcasts);

module.exports = router;