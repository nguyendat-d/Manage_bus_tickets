// controllers/tripController.js
const pool = require('../config/database');
const moment = require('moment');

const tripController = {
  // Tìm kiếm chuyến xe
  searchTrips: async (req, res) => {
    try {
      const { from, to, date, page = 1, limit = 10 } = req.query;
      
      // Validate required params
      if (!from || !to || !date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: from, to, date'
        });
      }

      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          t.*,
          r.departure_city, r.departure_station,
          r.arrival_city, r.arrival_station,
          r.distance_km, r.estimated_duration_minutes,
          bc.company_name, bc.rating as company_rating,
          b.bus_type, b.amenities, b.total_seats
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

      // Thêm sorting
      const sortBy = req.query.sortBy || 'departure_time';
      const sortOrder = req.query.sortOrder || 'ASC';
      
      const validSortColumns = ['departure_time', 'price', 'estimated_duration_minutes'];
      if (validSortColumns.includes(sortBy)) {
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      }

      // Thêm pagination - LIMIT và OFFSET phải là literal numbers, không dùng placeholder
      query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

      // Prepare params for main query (3 params only - không có limit/offset)
      const queryParams = [
        `%${from}%`, 
        `%${to}%`, 
        date
      ];

      // Prepare params for count query (3 params)
      const countParams = [`%${from}%`, `%${to}%`, date];

      const [trips] = await pool.execute(query, queryParams);
      const [countResult] = await pool.execute(countQuery, countParams);
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

      let bookedSeatNumbers = [];
      try {
        bookedSeatNumbers = bookedSeats.flatMap(booking => {
          const seats = booking.seat_numbers;
          return Array.isArray(seats) ? seats : JSON.parse(seats);
        });
      } catch (e) {
        console.error('Error parsing booked seats:', e.message);
        bookedSeatNumbers = [];
      }

      const trip = trips[0];
      let seatMap = [];
      
      try {
        seatMap = typeof trip.seat_map === 'string' ? JSON.parse(trip.seat_map) : trip.seat_map;
      } catch (e) {
        // If seat_map is not valid JSON, create a simple seat map
        seatMap = Array.from({length: trip.total_seats}, (_, i) => ({
          number: `A${i+1}`,
          type: 'standard',
          available: true
        }));
      }

      // Đánh dấu ghế đã đặt
      const seatsWithStatus = seatMap.map(row => {
        if (row.row && row.seats) {
          // Format có row và seats
          return {
            ...row,
            seats: row.seats.map(seat => ({
              ...seat,
              available: !bookedSeatNumbers.includes(seat.number)
            }))
          };
        } else {
          // Format đơn giản
          return {
            ...row,
            available: !bookedSeatNumbers.includes(row.number)
          };
        }
      });

      res.json({
        success: true,
        data: {
          trip_id: trip.id,
          company_name: trip.company_name,
          total_seats: trip.total_seats,
          available_seats: trip.available_seats,
          booked_seats: bookedSeatNumbers,
          seat_map: seatsWithStatus
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