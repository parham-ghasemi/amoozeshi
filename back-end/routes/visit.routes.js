const express = require('express');
const router = express.Router();
const { getVisitStats, trackVisit } = require('../controllers/visits.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require("../middleware/authorizeAdmin");


router.get('/admin/visits', authenticate, authorizeAdmin, getVisitStats);
router.post('/track', trackVisit);


module.exports = router;
