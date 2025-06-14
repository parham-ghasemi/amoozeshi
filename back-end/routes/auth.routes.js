const express = require('express');
const router = express.Router();
const { login, seed } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/seed', seed);

module.exports = router;
