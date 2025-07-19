const mongoose = require('mongoose');
const Course = require('../models/Course');

// === Get all courses (short version) ===
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// === Get course by ID (and increment visits) ===
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('content.itemId') // dynamically loads article or video
      .populate('related', '_id title shortDesc thumbnail');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ course });
  } catch (err) {
    console.error('Get course by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};

// === Get short course by ID ===
exports.getShortCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 });

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ course });
  } catch (err) {
    console.error('Get short course error:', err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};

// === Get courses by category (short version) ===
exports.getCoursesByCategory = async (req, res) => {
  const { category } = req.params;
  if (!category) return res.status(400).json({ message: 'Category is required' });

  try {
    const courses = await Course.find({ category }, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Fetch category courses error:', err);
    res.status(500).json({ message: 'Failed to fetch category courses' });
  }
};

// === Get newest courses (short version) ===
exports.getNewestCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(courses);
  } catch (err) {
    console.error('Fetch newest courses error:', err);
    res.status(500).json({ message: 'Failed to fetch newest courses' });
  }
};

// === Search courses by title or shortDesc (short version) ===
exports.searchCourses = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const results = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { shortDesc: { $regex: query, $options: 'i' } },
      ],
    }, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 });

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
