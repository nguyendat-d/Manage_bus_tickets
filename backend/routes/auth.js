// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');
const rateLimit = require('../middleware/rateLimit');
const auth = require('../middleware/auth');

// Apply rate limiting
router.use(rateLimit.general);

// Public routes
router.post('/register', rateLimit.register, validation.register, authController.register);
router.post('/login', rateLimit.login, validation.login, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.post('/logout', auth.authenticate, authController.logout);
router.get('/verify', authController.verifyToken); // Thêm route verify token

module.exports = router;