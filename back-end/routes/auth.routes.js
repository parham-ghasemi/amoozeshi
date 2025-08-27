const express = require('express');
const router = express.Router();
const {
  login,
  signup,
  verifyOTP,
  resendOTP,
  requestPasswordReset,
  resetPassword
} = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
