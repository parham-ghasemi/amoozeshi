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
  editPodcast,
  deletePodcast
} = require('../controllers/podcast.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/podcasts', authenticate, authorizeAdmin, uploadPodcastMiddleware, uploadPodcast);
router.patch('/podcasts/:id', authenticate, authorizeAdmin, uploadPodcastMiddleware, editPodcast);
router.delete('/podcasts/:id', authenticate, authorizeAdmin, deletePodcast);
router.post('/podcasts/upload', authenticate, authorizeAdmin, uploadPodcastThumbnail, uploadImage);

router.get('/podcasts', getAllPodcasts);
router.get('/podcast/:id', getPodcastById);
router.get('/podcast/short/:id', getShortPodcastById);

router.get('/podcasts/category/:category', getPodcastsByCategory);
router.get('/podcasts/most-listened', getMostListenedPodcasts);
router.get('/podcasts/newest', getNewestPodcasts);
router.get('/podcasts/search', searchedPodcasts);

module.exports = router;