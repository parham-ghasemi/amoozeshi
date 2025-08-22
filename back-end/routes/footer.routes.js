const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footer.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.get('/footer', footerController.getFooterData);
router.put('/footer', authenticate, authorizeAdmin, footerController.updateFooterData);

module.exports = router;