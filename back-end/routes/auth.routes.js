// Modified Auth Routes
const express = require('express');
const router = express.Router();
const { login, signup, verifyOTP } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);

module.exports = router;
