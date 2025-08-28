const express = require('express');
const router = express.Router();
const { upload, uploadResume, getResume } = require("../controllers/resume.controller.js");

router.post("/resume/upload", upload.single("resume"), uploadResume);
router.get("/resume", getResume);

module.exports = router;