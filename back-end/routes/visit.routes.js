const express = require('express');
const router = express.Router();
const { getVisitStats, trackVisit } = require('../controllers/visits.controller');

router.get('/admin/visits', getVisitStats);
router.post('/track', trackVisit);


module.exports = router;
