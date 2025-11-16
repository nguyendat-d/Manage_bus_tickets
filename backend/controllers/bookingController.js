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

      const { trip_id, passenger_info, seat_numbers, payment_method } = req.body;
      const user_id = req.user.id;

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
      if (trip.available_seats < seat_numbers.length) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Not enough available seats'
        });
      }

      // Kiểm tra ghế có bị đặt trước không
      const placeholders = seat_numbers.map(() => '?').join(',');
      const [existingBookings] = await connection.execute(
        `SELECT id FROM bookings 
         WHERE trip_id = ? AND booking_status = 'confirmed' 
         AND JSON_OVERLAPS(seat_numbers, JSON_ARRAY(${placeholders}))`,
        [trip_id, ...seat_numbers]
      );

      if (existingBookings.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Some seats are already booked'
        });
      }

      // Tạo booking code
      const booking_code = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

      // Tính tổng tiền
      const total_amount = trip.price * seat_numbers.length;

      // Tạo booking
      const [bookingResult] = await connection.execute(
        `INSERT INTO bookings 
         (user_id, trip_id, booking_code, passenger_info, seat_numbers, total_amount, payment_method) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, trip_id, booking_code, JSON.stringify(passenger_info), JSON.stringify(seat_numbers), total_amount, payment_method]
      );

      // Cập nhật số ghế còn lại
      await connection.execute(
        'UPDATE trips SET available_seats = available_seats - ? WHERE id = ?',
        [seat_numbers.length, trip_id]
      );

      // Tạo QR Code
      const qrCodeUrl = await generateQRCode(booking_code);
      await connection.execute(
        'UPDATE bookings SET qr_code_url = ? WHERE id = ?',
        [qrCodeUrl, bookingResult.insertId]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          bookingId: bookingResult.insertId,
          bookingCode: booking_code,
          totalAmount: total_amount,
          qrCodeUrl: qrCodeUrl,
          paymentMethod: payment_method
        }
      });

    } catch (error) {
      await connection.rollback();
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
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

      query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

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

  // Hủy vé
  cancelBooking: async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { reason } = req.body;
      const user_id = req.user.id;

      // Kiểm tra booking
      const [bookings] = await connection.execute(
        `SELECT b.*, t.departure_time 
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

      // Kiểm tra thời gian hủy vé (trước 2 giờ)
      const departureTime = new Date(booking.departure_time);
      const now = new Date();
      const timeDiff = departureTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 2) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel booking less than 2 hours before departure'
        });
      }

      // Cập nhật trạng thái booking
      await connection.execute(
        `UPDATE bookings 
         SET booking_status = 'cancelled', cancellation_reason = ?
         WHERE id = ?`,
        [reason, id]
      );

      // Cập nhật số ghế available
      const seatCount = JSON.parse(booking.seat_numbers).length;
      await connection.execute(
        'UPDATE trips SET available_seats = available_seats + ? WHERE id = ?',
        [seatCount, booking.trip_id]
      );

      // Hoàn tiền nếu đã thanh toán
      if (booking.payment_status === 'paid') {
        await connection.execute(
          `UPDATE bookings 
           SET payment_status = 'refunded' 
           WHERE id = ?`,
          [id]
        );

        // Ghi log hoàn tiền
        await connection.execute(
          `INSERT INTO payments 
           (booking_id, payment_method, amount, payment_status, payment_date) 
           VALUES (?, ?, ?, 'refunded', NOW())`,
          [id, booking.payment_method, booking.total_amount]
        );
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Booking cancelled successfully'
      });

    } catch (error) {
      await connection.rollback();
      console.error('Cancel booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
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
  }
};

module.exports = bookingController;