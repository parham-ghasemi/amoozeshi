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
  joinCourse,
  getMostPopularCourses,
  checkIsJoined,
  editCourse
} = require('../controllers/course.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

// Add a new course
router.post('/courses', authenticate, authorizeAdmin, addCourse);

// Fetch courses
router.get('/courses', getAllCourses);
router.get('/course/:id', getCourseById);
router.get('/course/content/:id', getCourseContentById)

// Filter & search
router.get('/courses/category/:category', getCoursesByCategory);
router.get('/courses/newest', getNewestCourses);
router.get('/courses/search', searchCourses);
router.get('/courses/most-popular', getMostPopularCourses)

// joing course
router.post("/courses/join/:id", authenticate, joinCourse);
router.get("/courses/is-joined/:id", authenticate, checkIsJoined);

router.patch('/course/:id', authenticate, authorizeAdmin, editCourse);

module.exports = router;
