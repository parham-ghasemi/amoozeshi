const express = require('express');
const { getCurrentUser } = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const router = express.Router();

router.get("/user/me", authenticate, getCurrentUser);

module.exports = router;