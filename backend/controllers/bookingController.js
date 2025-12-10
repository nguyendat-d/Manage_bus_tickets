// controllers/bookingController.js
const pool = require('../config/database');
const { generateQRCode } = require('../utils/generateQR');
const { createVNPayPayment } = require('../utils/paymentGateway');

const bookingController = {
  // Tạo booking
  createBooking: async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { trip_id, seats, total_amount, passenger_info } = req.body;
      const user_id = req.user.id;

      console.log('Creating booking - Request body:', { trip_id, seats, total_amount, user_id });

      // Validate input
      if (!trip_id || !seats || !total_amount) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: trip_id, seats, total_amount'
        });
      }

      // Parse seats string to array
      const seatArray = Array.isArray(seats) ? seats : seats.split(',').map(s => s.trim());
      const seatNumbers = JSON.stringify(seatArray);
      
      // Prepare passenger info - use provided data or create default from user
      let passengerInfoJson;
      if (passenger_info) {
        passengerInfoJson = typeof passenger_info === 'string' ? passenger_info : JSON.stringify(passenger_info);
      } else {
        // Get user info for default passenger data
        const [users] = await connection.execute(
          'SELECT full_name, phone, email FROM users WHERE id = ?',
          [user_id]
        );
        const user = users[0];
        passengerInfoJson = JSON.stringify({
          name: user.full_name || '',
          phone: user.phone || '',
          email: user.email || ''
        });
      }

      // Kiểm tra chuyến xe
      const [trips] = await connection.execute(
        'SELECT * FROM trips WHERE id = ? AND status = "scheduled"',
        [trip_id]
      );

      if (trips.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Trip not found or not available'
        });
      }

      const trip = trips[0];

      // Kiểm tra số ghế còn trống
      if (trip.available_seats < seatArray.length) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Not enough available seats'
        });
      }

      // Tạo booking code
      const booking_code = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

      // Tạo booking
      const [bookingResult] = await connection.execute(
        `INSERT INTO bookings 
         (user_id, trip_id, booking_code, seat_numbers, passenger_info, total_amount, booking_status, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?, 'confirmed', 'pending')`,
        [user_id, trip_id, booking_code, seatNumbers, passengerInfoJson, total_amount]
      );

      console.log('Booking created with ID:', bookingResult.insertId);

      // Cập nhật số ghế còn lại
      await connection.execute(
        'UPDATE trips SET available_seats = available_seats - ? WHERE id = ?',
        [seatArray.length, trip_id]
      );

      // Tạo QR Code (optional - không làm fail transaction)
      let qrCodeUrl = null;
      try {
        qrCodeUrl = await generateQRCode(booking_code);
        await connection.execute(
          'UPDATE bookings SET qr_code_url = ? WHERE id = ?',
          [qrCodeUrl, bookingResult.insertId]
        );
      } catch (qrError) {
        console.error('QR Code generation failed:', qrError.message);
        // Continue without QR code - it's not critical
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          id: bookingResult.insertId,
          booking_code: booking_code,
          trip_id: trip_id,
          seat_numbers: seatArray,
          passenger_info: JSON.parse(passengerInfoJson),
          total_amount: total_amount,
          booking_status: 'confirmed',
          payment_status: 'pending',
          qr_code_url: qrCodeUrl
        }
      });

    } catch (error) {
      await connection.rollback();
      console.error('Create booking error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      connection.release();
    }
  },

  // Lấy lịch sử đặt vé
  getUserBookings: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          b.*,
          t.departure_time, t.arrival_time, t.price,
          r.departure_city, r.departure_station,
          r.arrival_city, r.arrival_station,
          bc.company_name
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        JOIN routes r ON t.route_id = r.id
        JOIN bus_companies bc ON t.bus_company_id = bc.id
        WHERE b.user_id = ?
      `;

      let countQuery = `
        SELECT COUNT(*) as total
        FROM bookings b
        WHERE b.user_id = ?
      `;

      const params = [user_id];
      const countParams = [user_id];

      if (status) {
        query += ' AND b.booking_status = ?';
        countQuery += ' AND b.booking_status = ?';
        params.push(status);
        countParams.push(status);
      }

      query += ` ORDER BY b.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;

      const [bookings] = await pool.execute(query, params);
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Hoàn thành chuyến đi
  completeBooking: async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const user_id = req.user.id;

      // Kiểm tra booking
      const [bookings] = await connection.execute(
        `SELECT b.*, t.departure_time, t.arrival_time 
         FROM bookings b
         JOIN trips t ON b.trip_id = t.id
         WHERE b.id = ? AND b.user_id = ?`,
        [id, user_id]
      );

      if (bookings.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const booking = bookings[0];

      // Kiểm tra chỉ cho phép hoàn thành vé đã xác nhận
      if (booking.booking_status !== 'confirmed') {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Only confirmed bookings can be completed'
        });
      }

      // Kiểm tra đã qua giờ khởi hành chưa
      const departureTime = new Date(booking.departure_time);
      const now = new Date();

      if (now < departureTime) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Cannot complete booking before departure time'
        });
      }

      // Cập nhật trạng thái booking thành completed
      await connection.execute(
        `UPDATE bookings 
         SET booking_status = 'completed'
         WHERE id = ?`,
        [id]
      );

      await connection.commit();

      res.json({
        success: true,
        message: 'Booking completed successfully'
      });

    } catch (error) {
      await connection.rollback();
      console.error('Complete booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
    }
  },

  // Hủy vé
  cancelBooking: async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { cancellation_reason } = req.body;
      const user_id = req.user.id;

      console.log(`🎫 Cancel booking request - ID: ${id}, User: ${user_id}, Reason: ${cancellation_reason}`);

      // Kiểm tra booking
      const [bookings] = await connection.execute(
        `SELECT b.*, t.departure_time 
         FROM bookings b
         JOIN trips t ON b.trip_id = t.id
         WHERE b.id = ? AND b.user_id = ?`,
        [id, user_id]
      );

      if (bookings.length === 0) {
        console.log(`❌ Booking ${id} not found for user ${user_id}`);
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const booking = bookings[0];
      console.log(`📋 Found booking:`, {
        id: booking.id,
        booking_code: booking.booking_code,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        seat_numbers: booking.seat_numbers,
        trip_id: booking.trip_id
      });

      // Kiểm tra booking đã bị cancel chưa
      if (booking.booking_status === 'cancelled') {
        console.log(`⚠️ Booking ${id} already cancelled`);
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Booking has already been cancelled'
        });
      }

      // Kiểm tra thời gian hủy vé (trước 2 giờ)
      const departureTime = new Date(booking.departure_time);
      const now = new Date();
      const timeDiff = departureTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      console.log(`⏰ Time check - Departure: ${departureTime}, Now: ${now}, Hours diff: ${hoursDiff.toFixed(2)}`);

      if (hoursDiff < 2) {
        console.log(`❌ Cannot cancel - less than 2 hours before departure`);
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel booking less than 2 hours before departure'
        });
      }

      // Cập nhật trạng thái booking
      console.log(`🔄 Updating booking status to cancelled...`);
      const [updateResult] = await connection.execute(
        `UPDATE bookings 
         SET booking_status = 'cancelled', cancellation_reason = ?
         WHERE id = ?`,
        [cancellation_reason, id]
      );
      console.log(`✅ Booking status updated, affected rows: ${updateResult.affectedRows}`);

      // Cập nhật số ghế available
      let seatNumbers;
      if (typeof booking.seat_numbers === 'string') {
        try {
          seatNumbers = JSON.parse(booking.seat_numbers);
        } catch (e) {
          // Nếu parse lỗi, thử split bằng comma
          seatNumbers = booking.seat_numbers.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(booking.seat_numbers)) {
        seatNumbers = booking.seat_numbers;
      } else {
        seatNumbers = [];
      }
      
      const seatCount = seatNumbers.length;
      console.log(`💺 Releasing ${seatCount} seats (${seatNumbers.join(', ')}) for trip ${booking.trip_id}...`);
      await connection.execute(
        'UPDATE trips SET available_seats = available_seats + ? WHERE id = ?',
        [seatCount, booking.trip_id]
      );
      console.log(`✅ Seats released successfully`);

      // Hoàn tiền nếu đã thanh toán
      if (booking.payment_status === 'paid') {
        console.log(`💰 Processing refund for booking ${id}, amount: ${booking.total_amount}đ...`);
        await connection.execute(
          `UPDATE bookings 
           SET payment_status = 'refunded' 
           WHERE id = ?`,
          [id]
        );
        console.log(`✅ Refund status updated in bookings table`);
      }

      await connection.commit();
      console.log(`✅ Transaction committed successfully - Booking ${id} cancelled`);

      res.json({
        success: true,
        message: 'Booking cancelled successfully'
      });

    } catch (error) {
      await connection.rollback();
      console.error('❌ Cancel booking error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    } finally {
      connection.release();
    }
  },

  // Lấy QR Code vé
  getBookingQR: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const [bookings] = await pool.execute(
        `SELECT b.booking_code, b.qr_code_url, b.seat_numbers,
                t.departure_time, t.arrival_time,
                r.departure_station, r.arrival_station,
                bc.company_name
         FROM bookings b
         JOIN trips t ON b.trip_id = t.id
         JOIN routes r ON t.route_id = r.id
         JOIN bus_companies bc ON t.bus_company_id = bc.id
         WHERE b.id = ? AND b.user_id = ? AND b.booking_status = 'confirmed'`,
        [id, user_id]
      );

      if (bookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const booking = bookings[0];

      res.json({
        success: true,
        data: {
          bookingCode: booking.booking_code,
          qrCodeUrl: booking.qr_code_url,
          companyName: booking.company_name,
          departureStation: booking.departure_station,
          arrivalStation: booking.arrival_station,
          departureTime: booking.departure_time,
          arrivalTime: booking.arrival_time,
          seatNumbers: JSON.parse(booking.seat_numbers)
        }
      });
    } catch (error) {
      console.error('Get booking QR error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Lấy chi tiết 1 booking
  getBookingDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const [bookings] = await pool.execute(
        `SELECT 
          b.*,
          t.departure_time, t.arrival_time, t.price as base_price,
          r.departure_city, r.departure_station,
          r.arrival_city, r.arrival_station,
          bc.company_name,
          bus.bus_type
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        JOIN routes r ON t.route_id = r.id
        JOIN bus_companies bc ON t.bus_company_id = bc.id
        JOIN buses bus ON t.bus_id = bus.id
        WHERE b.id = ? AND b.user_id = ?`,
        [id, user_id]
      );

      if (bookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const booking = bookings[0];

      res.json({
        success: true,
        data: {
          id: booking.id,
          booking_code: booking.booking_code,
          trip_id: booking.trip_id,
          seat_numbers: JSON.parse(booking.seat_numbers || '[]'),
          passenger_info: JSON.parse(booking.passenger_info || '{}'),
          total_amount: booking.total_amount,
          booking_status: booking.booking_status,
          payment_status: booking.payment_status,
          payment_method: booking.payment_method,
          departure_time: booking.departure_time,
          arrival_time: booking.arrival_time,
          base_price: booking.base_price,
          departure_city: booking.departure_city,
          departure_station: booking.departure_station,
          arrival_city: booking.arrival_city,
          arrival_station: booking.arrival_station,
          company_name: booking.company_name,
          bus_type: booking.bus_type,
          qr_code_url: booking.qr_code_url,
          created_at: booking.created_at
        }
      });
    } catch (error) {
      console.error('Get booking detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = bookingController;