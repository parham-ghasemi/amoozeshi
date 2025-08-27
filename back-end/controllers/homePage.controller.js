const path = require('path');
const fs = require('fs');
const multer = require('multer');
const HomePage = require('../models/HomePage');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Multer middleware for multiple image uploads
exports.uploadMiddleware = upload.fields([
  { name: 'mosaicImages1', maxCount: 6 }, // Aligned with frontend maxFiles
  { name: 'mosaicImages2', maxCount: 6 }, // Aligned with frontend maxFiles
  { name: 'sectionImage', maxCount: 1 },
]);

exports.getHomePageData = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();
    if (!homePage) {
      // If no document exists, create one with defaults
      const newHomePage = new HomePage();
      await newHomePage.save();
      return res.status(200).json(newHomePage);
    }
    res.status(200).json(homePage);
  } catch (error) {
    console.error('Fetch home page data error:', error);
    res.status(500).json({ message: 'Failed to fetch home page data' });
  }
};

exports.updateHomePageData = async (req, res) => {
  try {
    const {
      heroTitle,
      heroDescription,
      middleText,
      sectionTitle,
      sectionDescription,
      footerTitle,
      footerDescription,
      mosaicImages1: mosaicImages1Existing,
      mosaicImages2: mosaicImages2Existing,
      sectionImage: sectionImageExisting,
    } = req.body;

    const updateData = {};
    if (heroTitle) updateData.heroTitle = heroTitle;
    if (heroDescription) updateData.heroDescription = heroDescription;
    if (middleText) updateData.middleText = middleText;
    if (sectionTitle) updateData.sectionTitle = sectionTitle;
    if (sectionDescription) updateData.sectionDescription = sectionDescription;
    if (footerTitle) updateData.footerTitle = footerTitle;
    if (footerDescription) updateData.footerDescription = footerDescription;

    const baseUrl = '/uploads/images';

    // Process mosaicImages1
    if (req.files && req.files['mosaicImages1']) {
      updateData.mosaicImages1 = req.files['mosaicImages1'].map(file => `${baseUrl}/${file.filename}`);
    } else if (mosaicImages1Existing) {
      try {
        updateData.mosaicImages1 = Array.isArray(mosaicImages1Existing)
          ? mosaicImages1Existing
          : JSON.parse(mosaicImages1Existing);
        if (!Array.isArray(updateData.mosaicImages1)) {
          return res.status(400).json({ message: 'mosaicImages1 must be an array' });
        }
      } catch {
        return res.status(400).json({ message: 'Invalid mosaicImages1 format' });
      }
    }

    // Process mosaicImages2
    if (req.files && req.files['mosaicImages2']) {
      updateData.mosaicImages2 = req.files['mosaicImages2'].map(file => `${baseUrl}/${file.filename}`);
    } else if (mosaicImages2Existing) {
      try {
        updateData.mosaicImages2 = Array.isArray(mosaicImages2Existing)
          ? mosaicImages2Existing
          : JSON.parse(mosaicImages2Existing);
        if (!Array.isArray(updateData.mosaicImages2)) {
          return res.status(400).json({ message: 'mosaicImages2 must be an array' });
        }
      } catch {
        return res.status(400).json({ message: 'Invalid mosaicImages2 format' });
      }
    }

    // Process sectionImage
    if (req.files && req.files['sectionImage']) {
      updateData.sectionImage = `${baseUrl}/${req.files['sectionImage'][0].filename}`;
    } else if (sectionImageExisting) {
      updateData.sectionImage = sectionImageExisting;
    }

    const updatedHomePage = await HomePage.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Home page data updated successfully',
      homePage: updatedHomePage,
    });
  } catch (error) {
    console.error('Update home page data error:', error);
    // Clean up uploaded files on error
    if (req.files) {
      const filesToDelete = [
        ...(req.files['mosaicImages1'] || []),
        ...(req.files['mosaicImages2'] || []),
        ...(req.files['sectionImage'] || []),
      ];
      filesToDelete.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/images', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ message: 'Failed to update home page data', error: error.message });
  }
};