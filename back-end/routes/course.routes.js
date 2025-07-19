const express = require('express');
const router = express.Router();

const {
  addCourse,
  getAllCourses,
  getCourseById,
  getShortCourseById,
  getCoursesByCategory,
  getNewestCourses,
  searchCourses,
} = require('../controllers/CourseController');

// Add a new course
router.post('/courses', addCourse);

// Fetch courses
router.get('/courses', getAllCourses);
router.get('/course/:id', getCourseById);
router.get('/course/short/:id', getShortCourseById);

// Filter & search
router.get('/courses/category/:category', getCoursesByCategory);
router.get('/courses/newest', getNewestCourses);
router.get('/courses/search', searchCourses);

module.exports = router;
