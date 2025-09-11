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
  editCourse,
  deleteCourse
} = require('../controllers/course.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/courses', authenticate, authorizeAdmin, addCourse);
router.patch('/course/:id', authenticate, authorizeAdmin, editCourse);
router.delete('/course/:id', authenticate, authorizeAdmin, deleteCourse);

router.get('/courses', getAllCourses);
router.get('/course/:id', getCourseById);
router.get('/course/content/:id', getCourseContentById);

router.get('/courses/category/:category', getCoursesByCategory);
router.get('/courses/newest', getNewestCourses);
router.get('/courses/search', searchCourses);
router.get('/courses/most-popular', getMostPopularCourses);

router.post('/courses/join/:id', authenticate, joinCourse);
router.get('/courses/is-joined/:id', authenticate, checkIsJoined);

module.exports = router;