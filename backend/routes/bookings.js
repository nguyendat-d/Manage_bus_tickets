const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// Tất cả routes đều yêu cầu authentication
router.use(auth.authenticate);

router.post('/', validation.createBooking, bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.get('/:id/qr', bookingController.getBookingQR);
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;