const pool = require('../config/database');

class Trip {
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT t.*, r.departure_city, r.departure_station, r.arrival_city, r.arrival_station,
              bc.company_name, b.bus_type, b.license_plate
       FROM trips t
       JOIN routes r ON t.route_id = r.id
       JOIN bus_companies bc ON t.bus_company_id = bc.id
       JOIN buses b ON t.bus_id = b.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async searchTrips(filters) {
    const { from, to, date, page = 1, limit = 10, sortBy = 'departure_time', sortOrder = 'ASC' } = filters;
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

    const params = [`%${from}%`, `%${to}%`, date];

    // Add sorting
    const validSortColumns = ['departure_time', 'price', 'estimated_duration_minutes'];
    if (validSortColumns.includes(sortBy)) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);

    // Get total count
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

    const [countRows] = await pool.execute(countQuery, params.slice(0, 3));
    const total = countRows[0].total;

    return {
      trips: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async create(tripData) {
    const { bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats } = tripData;
    const [result] = await pool.execute(
      `INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats]
    );
    return result.insertId;
  }

  static async updateAvailableSeats(tripId, seatChange) {
    const [result] = await pool.execute(
      'UPDATE trips SET available_seats = available_seats + ? WHERE id = ?',
      [seatChange, tripId]
    );
    return result.affectedRows > 0;
  }

  static async getBusCompanyTrips(busCompanyId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.execute(
      `SELECT t.*, r.departure_city, r.departure_station, r.arrival_city, r.arrival_station,
              b.license_plate, b.bus_type,
              COUNT(bk.id) as total_bookings
       FROM trips t
       JOIN routes r ON t.route_id = r.id
       JOIN buses b ON t.bus_id = b.id
       LEFT JOIN bookings bk ON t.id = bk.trip_id AND bk.booking_status = 'confirmed'
       WHERE t.bus_company_id = ?
       GROUP BY t.id
       ORDER BY t.departure_time DESC
       LIMIT ? OFFSET ?`,
      [busCompanyId, limit, offset]
    );

    const [countRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM trips WHERE bus_company_id = ?',
      [busCompanyId]
    );

    const total = countRows[0].total;

    return {
      trips: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = Trip;