const express = require('express');
const router = express.Router();
const busCompanyController = require('../controllers/busCompanyController');
const auth = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Tất cả routes đều yêu cầu authentication
router.use(auth.authenticate);

// Chỉ nhà xe mới có thể truy cập các routes này
router.post('/register', busCompanyController.register);
router.get('/profile', busCompanyController.getProfile);
router.put('/profile', upload.single('documents'), handleUploadError, busCompanyController.updateProfile);
router.post('/buses', busCompanyController.addBus);
router.get('/buses', busCompanyController.getBuses);
router.get('/trips', busCompanyController.getTrips);
router.get('/bookings', busCompanyController.getBookings);
router.get('/stats', busCompanyController.getStats);

module.exports = router;