const express = require('express');
const router = express.Router();
const {
  addCategory,
  deleteCategory,
  getAllCategories
} = require('../controllers/category.controller');

router.post('/categories', addCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories', getAllCategories);

module.exports = router;
