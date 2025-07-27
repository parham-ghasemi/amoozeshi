const express = require('express');
const router = express.Router();
const {
  addCategory,
  deleteCategory,
  getAllCategories
} = require('../controllers/category.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/categories', authenticate, authorizeAdmin, addCategory);
router.delete('/categories/:id', authenticate, authorizeAdmin, deleteCategory);
router.get('/categories', getAllCategories);

module.exports = router;
