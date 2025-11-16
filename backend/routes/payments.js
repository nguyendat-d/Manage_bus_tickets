const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Public routes (callback từ VNPay)
router.get('/vnpay-return', paymentController.vnpayReturn);
router.get('/vnpay-ipn', paymentController.vnpayIPN);

// Protected routes
router.use(auth.authenticate);

router.post('/vnpay', paymentController.createVNPayPayment);
router.get('/history', paymentController.getPaymentHistory);

module.exports = router;