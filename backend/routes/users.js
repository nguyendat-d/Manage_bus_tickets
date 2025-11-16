const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Tất cả routes đều yêu cầu authentication
router.use(auth.authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('avatar'), handleUploadError, userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

module.exports = router;