const pool = require('../config/database');

class Booking {
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, t.departure_time, t.arrival_time, t.price,
              r.departure_city, r.departure_station, r.arrival_city, r.arrival_station,
              bc.company_name
       FROM bookings b
       JOIN trips t ON b.trip_id = t.id
       JOIN routes r ON t.route_id = r.id
       JOIN bus_companies bc ON t.bus_company_id = bc.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    const { page = 1, limit = 10, status } = filters;
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

    const params = [userId];

    if (status) {
      query += ' AND b.booking_status = ?';
      params.push(status);
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE user_id = ?';
    const countParams = [userId];

    if (status) {
      countQuery += ' AND booking_status = ?';
      countParams.push(status);
    }

    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0].total;

    return {
      bookings: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async create(bookingData) {
    const { user_id, trip_id, booking_code, passenger_info, seat_numbers, total_amount, payment_method } = bookingData;
    const [result] = await pool.execute(
      `INSERT INTO bookings (user_id, trip_id, booking_code, passenger_info, seat_numbers, total_amount, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, trip_id, booking_code, JSON.stringify(passenger_info), JSON.stringify(seat_numbers), total_amount, payment_method]
    );
    return result.insertId;
  }

  static async updateStatus(bookingId, status, cancellationReason = null) {
    let query = 'UPDATE bookings SET booking_status = ?';
    const params = [status];

    if (cancellationReason) {
      query += ', cancellation_reason = ?';
      params.push(cancellationReason);
    }

    query += ' WHERE id = ?';
    params.push(bookingId);

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  static async updatePaymentStatus(bookingId, paymentStatus) {
    const [result] = await pool.execute(
      'UPDATE bookings SET payment_status = ? WHERE id = ?',
      [paymentStatus, bookingId]
    );
    return result.affectedRows > 0;
  }

  static async updateQRCode(bookingId, qrCodeUrl) {
    const [result] = await pool.execute(
      'UPDATE bookings SET qr_code_url = ? WHERE id = ?',
      [qrCodeUrl, bookingId]
    );
    return result.affectedRows > 0;
  }

  static async getBookedSeats(tripId) {
    const [rows] = await pool.execute(
      `SELECT seat_numbers 
       FROM bookings 
       WHERE trip_id = ? AND booking_status = 'confirmed'`,
      [tripId]
    );

    return rows.flatMap(booking => JSON.parse(booking.seat_numbers));
  }

  static async getBusCompanyBookings(busCompanyId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
      `SELECT b.*, t.departure_time, t.arrival_time,
              r.departure_station, r.arrival_station,
              u.full_name as passenger_name, u.phone as passenger_phone
       FROM bookings b
       JOIN trips t ON b.trip_id = t.id
       JOIN routes r ON t.route_id = r.id
       JOIN users u ON b.user_id = u.id
       WHERE t.bus_company_id = ?
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [busCompanyId, limit, offset]
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM bookings b
       JOIN trips t ON b.trip_id = t.id
       WHERE t.bus_company_id = ?`,
      [busCompanyId]
    );

    const total = countRows[0].total;

    return {
      bookings: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = Booking;