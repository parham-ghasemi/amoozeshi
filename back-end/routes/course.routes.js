const express = require('express');
const router = express.Router();

const {
  addCourse,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getNewestCourses,
  searchCourses,
  getCourseContentById,
  joinCourse
} = require('../controllers/course.controller');

// Add a new course
router.post('/courses', addCourse);

// Fetch courses
router.get('/courses', getAllCourses);
router.get('/course/:id', getCourseById);
router.get('/course/content/:id', getCourseContentById)

// Filter & search
router.get('/courses/category/:category', getCoursesByCategory);
router.get('/courses/newest', getNewestCourses);
router.get('/courses/search', searchCourses);

// joing course
router.post("/courses/:id/join", joinCourse);

module.exports = router;
