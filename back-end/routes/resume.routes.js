const express = require('express');
const router = express.Router();
const { upload, uploadResume, getResume } = require("../controllers/resume.controller.js");
const authorizeAdmin = require('../middleware/authorizeAdmin.js');
const authenticate = require('../middleware/auth.middleware.js');

router.post("/resume/upload", authenticate, authorizeAdmin, upload.single("resume"), uploadResume);
router.get("/resume", getResume);

module.exports = router;