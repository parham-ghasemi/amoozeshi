const express = require('express');
const router = express.Router();

const {
  addCounsel,
  uploadImage,
  uploadMiddleware,
  getCounselById,
  getShortCounselById,
  getAllCounsels,
  searchedCounsels,
  getCounselsByCategory,
  getNewestCounsels,
  getMostViewedCounsels,
  editCounsel,
  deleteCounsel
} = require('../controllers/counsel.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/counsels', authenticate, authorizeAdmin, addCounsel);
router.patch('/counsel/:id', authenticate, authorizeAdmin, editCounsel);
router.delete('/counsel/:id', authenticate, authorizeAdmin, deleteCounsel);
router.post('/upload', authenticate, authorizeAdmin, uploadMiddleware, uploadImage);

router.get('/counsel/:id', getCounselById);
router.get('/counsels/short/:id', getShortCounselById);
router.get('/counsels', getAllCounsels);
router.get('/counsels/search', searchedCounsels);

router.get('/counsels/category/:category', getCounselsByCategory);
router.get('/counsels/most-viewed', getMostViewedCounsels);
router.get('/counsels/newest', getNewestCounsels);

module.exports = router;