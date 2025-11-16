// controllers/tripController.js
const pool = require('../config/database');
const moment = require('moment');

const tripController = {
  // Tìm kiếm chuyến xe
  searchTrips: async (req, res) => {
    try {
      const { from, to, date, page = 1, limit = 10 } = req.query;
      
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          t.*,
          r.departure_city, r.departure_station,
          r.arrival_city, r.arrival_station,
          r.distance_km, r.estimated_duration_minutes,
          bc.company_name,
          b.bus_type, b.amenities, b.total_seats,
          (SELECT AVG(rating) FROM reviews WHERE bus_company_id = bc.id) as company_rating
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN bus_companies bc ON t.bus_company_id = bc.id
        JOIN buses b ON t.bus_id = b.id
        WHERE r.departure_city LIKE ? AND r.arrival_city LIKE ?
        AND DATE(t.departure_time) = ?
        AND t.status = 'scheduled'
        AND bc.status = 'approved'
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN bus_companies bc ON t.bus_company_id = bc.id
        WHERE r.departure_city LIKE ? AND r.arrival_city LIKE ?
        AND DATE(t.departure_time) = ?
        AND t.status = 'scheduled'
        AND bc.status = 'approved'
      `;

      const params = [`%${from}%`, `%${to}%`, date];

      // Thêm sorting
      const sortBy = req.query.sortBy || 'departure_time';
      const sortOrder = req.query.sortOrder || 'ASC';
      
      const validSortColumns = ['departure_time', 'price', 'estimated_duration_minutes'];
      if (validSortColumns.includes(sortBy)) {
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      }

      // Thêm pagination
      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), offset);

      const [trips] = await pool.execute(query, params);
      const [countResult] = await pool.execute(countQuery, params.slice(0, 3));
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          trips,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Search trips error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Lấy chi tiết chuyến xe
  getTripDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const [trips] = await pool.execute(
        `SELECT 
          t.*,
          r.departure_city, r.departure_station,
          r.arrival_city, r.arrival_station,
          r.distance_km, r.estimated_duration_minutes,
          bc.company_name, bc.rating as company_rating,
          b.bus_type, b.license_plate, b.amenities, b.total_seats, b.seat_map
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN bus_companies bc ON t.bus_company_id = bc.id
        JOIN buses b ON t.bus_id = b.id
        WHERE t.id = ? AND t.status = 'scheduled'`,
        [id]
      );

      if (trips.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      res.json({
        success: true,
        data: trips[0]
      });
    } catch (error) {
      console.error('Get trip detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Lấy sơ đồ ghế
  getSeatMap: async (req, res) => {
    try {
      const { id } = req.params;

      const [trips] = await pool.execute(
        `SELECT 
          t.id, t.available_seats,
          b.seat_map, b.total_seats,
          bc.company_name
        FROM trips t
        JOIN buses b ON t.bus_id = b.id
        JOIN bus_companies bc ON t.bus_company_id = bc.id
        WHERE t.id = ?`,
        [id]
      );

      if (trips.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      // Lấy danh sách ghế đã đặt
      const [bookedSeats] = await pool.execute(
        `SELECT seat_numbers 
         FROM bookings 
         WHERE trip_id = ? AND booking_status = 'confirmed'`,
        [id]
      );

      const bookedSeatNumbers = bookedSeats.flatMap(booking => 
        JSON.parse(booking.seat_numbers)
      );

      const trip = trips[0];
      const seatMap = JSON.parse(trip.seat_map);

      // Đánh dấu ghế đã đặt
      const seatsWithStatus = seatMap.map(seat => ({
        ...seat,
        isAvailable: !bookedSeatNumbers.includes(seat.number),
        isSelected: false
      }));

      res.json({
        success: true,
        data: {
          tripId: trip.id,
          companyName: trip.company_name,
          totalSeats: trip.total_seats,
          availableSeats: trip.available_seats,
          seats: seatsWithStatus
        }
      });
    } catch (error) {
      console.error('Get seat map error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Tạo chuyến xe (Nhà xe)
  createTrip: async (req, res) => {
    try {
      const { route_id, bus_id, departure_time, arrival_time, price } = req.body;
      const bus_company_id = req.user.id;

      // Kiểm tra nhà xe có quyền sử dụng bus này không
      const [buses] = await pool.execute(
        'SELECT id FROM buses WHERE id = ? AND bus_company_id = ?',
        [bus_id, bus_company_id]
      );

      if (buses.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to use this bus'
        });
      }

      // Lấy total_seats từ bus
      const [busInfo] = await pool.execute(
        'SELECT total_seats FROM buses WHERE id = ?',
        [bus_id]
      );

      const total_seats = busInfo[0].total_seats;

      // Tạo chuyến xe
      const [result] = await pool.execute(
        `INSERT INTO trips 
         (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [bus_company_id, route_id, bus_id, departure_time, arrival_time, price, total_seats]
      );

      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: {
          tripId: result.insertId
        }
      });
    } catch (error) {
      console.error('Create trip error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = tripController;