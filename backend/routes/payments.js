const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Public routes (callback từ VNPay)
router.get('/vnpay-return', paymentController.vnpayReturn);
router.get('/vnpay-ipn', paymentController.vnpayIPN);

// Protected routes
router.use(auth.authenticate);

router.post('/', paymentController.createPayment);
router.post('/vnpay', paymentController.createVNPayPayment);
router.get('/history', paymentController.getPaymentHistory);

// Admin routes
router.get('/admin/all', auth.authorizeAdmin, paymentController.getAllPayments);
router.put('/:id/confirm', auth.authorizeAdmin, paymentController.confirmPayment);
router.put('/:id/reject', auth.authorizeAdmin, paymentController.rejectPayment);

module.exports = router;