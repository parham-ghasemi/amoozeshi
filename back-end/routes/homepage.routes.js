const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homePage.controller');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const authenticate = require('../middleware/auth.middleware');

router.get('/homepage', homepageController.getHomePageData);
router.put('/homepage', authenticate, authorizeAdmin, homepageController.uploadMiddleware, homepageController.updateHomePageData);

module.exports = router;