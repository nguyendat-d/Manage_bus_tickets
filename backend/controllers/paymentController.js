const pool = require('../config/database');
const { createVNPayPaymentURL, verifyVNPayPayment } = require('../utils/paymentGateway');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const paymentController = {
  // Tạo URL thanh toán VNPay
  createVNPayPayment: async (req, res) => {
    try {
      const { booking_id, amount } = req.body;
      const user_id = req.user.id;

      // Kiểm tra booking
      const [bookings] = await pool.execute(
        'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
        [booking_id, user_id]
      );

      if (bookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const booking = bookings[0];

      if (booking.payment_status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Booking already paid'
        });
      }

      // Tạo payment record
      const paymentId = await Payment.create({
        booking_id,
        payment_method: 'vnpay',
        amount: booking.total_amount
      });

      // Tạo URL thanh toán VNPay
      const paymentUrl = await createVNPayPaymentURL({
        amount: booking.total_amount,
        booking_id: booking.id,
        payment_id: paymentId,
        customer_email: req.user.email
      });

      res.json({
        success: true,
        data: {
          paymentUrl,
          paymentId
        }
      });
    } catch (error) {
      console.error('Create VNPay payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Xử lý callback từ VNPay
  vnpayReturn: async (req, res) => {
    try {
      const query = req.query;
      const isValid = verifyVNPayPayment(query);

      if (!isValid) {
        return res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Invalid signature`);
      }

      const paymentId = query.vnp_TxnRef;
      const transactionId = query.vnp_TransactionNo;
      const amount = parseInt(query.vnp_Amount) / 100;
      const responseCode = query.vnp_ResponseCode;

      // Tìm payment record
      const [payments] = await pool.execute(
        'SELECT * FROM payments WHERE id = ?',
        [paymentId]
      );

      if (payments.length === 0) {
        return res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Payment not found`);
      }

      const payment = payments[0];

      if (responseCode === '00') {
        // Thanh toán thành công
        await Payment.updateStatus(paymentId, 'success', transactionId);
        await Booking.updatePaymentStatus(payment.booking_id, 'paid');

        return res.redirect(`${process.env.CLIENT_URL}/payment/success?booking_id=${payment.booking_id}`);
      } else {
        // Thanh toán thất bại
        await Payment.updateStatus(paymentId, 'failed');
        await Booking.updatePaymentStatus(payment.booking_id, 'failed');

        return res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Payment failed`);
      }
    } catch (error) {
      console.error('VNPay return error:', error);
      res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Internal server error`);
    }
  },

  // IPN (Instant Payment Notification) từ VNPay
  vnpayIPN: async (req, res) => {
    try {
      const query = req.query;
      const isValid = verifyVNPayPayment(query);

      if (!isValid) {
        return res.status(400).json({ RspCode: '97', Message: 'Invalid signature' });
      }

      const paymentId = query.vnp_TxnRef;
      const transactionId = query.vnp_TransactionNo;
      const responseCode = query.vnp_ResponseCode;

      const [payments] = await pool.execute(
        'SELECT * FROM payments WHERE id = ?',
        [paymentId]
      );

      if (payments.length === 0) {
        return res.status(404).json({ RspCode: '01', Message: 'Payment not found' });
      }

      const payment = payments[0];

      if (responseCode === '00') {
        if (payment.payment_status !== 'success') {
          await Payment.updateStatus(paymentId, 'success', transactionId);
          await Booking.updatePaymentStatus(payment.booking_id, 'paid');
        }
        return res.json({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        await Payment.updateStatus(paymentId, 'failed');
        await Booking.updatePaymentStatus(payment.booking_id, 'failed');
        return res.json({ RspCode: '00', Message: 'Confirm Success' });
      }
    } catch (error) {
      console.error('VNPay IPN error:', error);
      return res.status(500).json({ RspCode: '99', Message: 'Internal error' });
    }
  },

  // Lấy lịch sử thanh toán
  getPaymentHistory: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;

      const [payments] = await pool.execute(
        `SELECT p.*, b.booking_code, b.total_amount, b.booking_status
         FROM payments p
         JOIN bookings b ON p.booking_id = b.id
         WHERE b.user_id = ?
         ORDER BY p.created_at DESC
         LIMIT ? OFFSET ?`,
        [user_id, limit, offset]
      );

      const [countRows] = await pool.execute(
        `SELECT COUNT(*) as total 
         FROM payments p
         JOIN bookings b ON p.booking_id = b.id
         WHERE b.user_id = ?`,
        [user_id]
      );

      const total = countRows[0].total;

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = paymentController;