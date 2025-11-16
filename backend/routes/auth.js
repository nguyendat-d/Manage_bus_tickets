const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');
const rateLimit = require('../middleware/rateLimit');

// Apply rate limiting
router.use(rateLimit.general);

// Public routes
router.post('/register', rateLimit.register, validation.register, authController.register);
router.post('/login', rateLimit.login, validation.login, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.post('/logout', authController.logout);

module.exports = router;