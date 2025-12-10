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
         LIMIT ${parseInt(limit)} OFFSET ${offset}`,
        [user_id]
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
  },

  // Tạo payment mới (cho cash/bank_transfer)
  createPayment: async (req, res) => {
    try {
      const { booking_id, payment_method, amount } = req.body;
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
      const [result] = await pool.execute(
        `INSERT INTO payments (booking_id, payment_method, amount, payment_status)
         VALUES (?, ?, ?, 'pending')`,
        [booking_id, payment_method, amount]
      );

      res.json({
        success: true,
        data: {
          id: result.insertId,
          booking_id,
          payment_method,
          amount,
          payment_status: 'pending'
        }
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Admin: Lấy tất cả payments
  getAllPayments: async (req, res) => {
    try {
      console.log('📊 getAllPayments called with query:', req.query);
      
      const { status, payment_method, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      console.log('📊 Pagination:', { page, limit, offset });

      let query = `
        SELECT 
          p.id,
          p.booking_id,
          p.payment_method,
          p.amount,
          p.transaction_id,
          p.payment_status,
          p.payment_date,
          p.created_at,
          b.booking_code,
          b.user_id,
          b.booking_status,
          u.full_name as customer_name,
          u.email as customer_email,
          IFNULL(r.departure_city, 'N/A') as departure_city,
          IFNULL(r.arrival_city, 'N/A') as arrival_city
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.id
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN trips t ON b.trip_id = t.id
        LEFT JOIN routes r ON t.route_id = r.id
        WHERE 1=1
      `;

      const params = [];

      if (status) {
        query += ' AND p.payment_status = ?';
        params.push(status);
      }

      if (payment_method) {
        query += ' AND p.payment_method = ?';
        params.push(payment_method);
      }

      // Add ordering and pagination
      query += ` ORDER BY p.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;

      console.log('📊 Executing query with params:', params);

      const [payments] = await pool.execute(query, params);

      console.log('📊 Found payments:', payments.length);

      // Count total
      let countQuery = `
        SELECT COUNT(*) as total
        FROM payments p
        WHERE 1=1
      `;
      const countParams = [];

      if (status) {
        countQuery += ' AND p.payment_status = ?';
        countParams.push(status);
      }

      if (payment_method) {
        countQuery += ' AND p.payment_method = ?';
        countParams.push(payment_method);
      }

      const [countRows] = await pool.execute(countQuery, countParams);
      const total = countRows[0].total;

      console.log('📊 Total payments:', total);

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
      console.error('❌ Get all payments error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Admin: Xác nhận thanh toán
  confirmPayment: async (req, res) => {
    try {
      const { id } = req.params;

      // Update payment status
      await pool.execute(
        'UPDATE payments SET payment_status = ? WHERE id = ?',
        ['success', id]
      );

      // Get booking_id
      const [payments] = await pool.execute('SELECT booking_id FROM payments WHERE id = ?', [id]);
      if (payments.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      const booking_id = payments[0].booking_id;

      // Update booking payment_status
      await pool.execute(
        'UPDATE bookings SET payment_status = ? WHERE id = ?',
        ['paid', booking_id]
      );

      res.json({
        success: true,
        message: 'Payment confirmed successfully'
      });
    } catch (error) {
      console.error('Confirm payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Admin: Từ chối thanh toán
  rejectPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      await pool.execute(
        'UPDATE payments SET payment_status = ? WHERE id = ?',
        ['failed', id]
      );

      res.json({
        success: true,
        message: 'Payment rejected'
      });
    } catch (error) {
      console.error('Reject payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = paymentController;