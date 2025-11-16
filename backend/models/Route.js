const pool = require('../config/database');

class Route {
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM routes WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM routes WHERE 1=1';
    const params = [];

    if (filters.departure_city) {
      query += ' AND departure_city LIKE ?';
      params.push(`%${filters.departure_city}%`);
    }

    if (filters.arrival_city) {
      query += ' AND arrival_city LIKE ?';
      params.push(`%${filters.arrival_city}%`);
    }

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY departure_city, arrival_city LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM routes WHERE 1=1';
    const countParams = [];

    if (filters.departure_city) {
      countQuery += ' AND departure_city LIKE ?';
      countParams.push(`%${filters.departure_city}%`);
    }

    if (filters.arrival_city) {
      countQuery += ' AND arrival_city LIKE ?';
      countParams.push(`%${filters.arrival_city}%`);
    }

    if (filters.status) {
      countQuery += ' AND status = ?';
      countParams.push(filters.status);
    }

    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0].total;

    return {
      routes: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async create(routeData) {
    const { departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes } = routeData;
    const [result] = await pool.execute(
      `INSERT INTO routes (departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes]
    );
    return result.insertId;
  }

  static async update(id, routeData) {
    const { departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes, status } = routeData;
    const [result] = await pool.execute(
      `UPDATE routes 
       SET departure_city = ?, departure_station = ?, arrival_city = ?, arrival_station = ?, 
           distance_km = ?, estimated_duration_minutes = ?, status = ?
       WHERE id = ?`,
      [departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes, status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM routes WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getPopularRoutes(limit = 10) {
    const [rows] = await pool.execute(
      `SELECT 
        r.*,
        COUNT(b.id) as booking_count,
        AVG(t.price) as average_price
       FROM routes r
       JOIN trips t ON r.id = t.route_id
       JOIN bookings b ON t.id = b.trip_id
       WHERE b.payment_status = 'paid'
       GROUP BY r.id
       ORDER BY booking_count DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  static async getCities() {
    const [departureCities] = await pool.execute(
      'SELECT DISTINCT departure_city as city FROM routes WHERE status = "active" ORDER BY departure_city'
    );
    
    const [arrivalCities] = await pool.execute(
      'SELECT DISTINCT arrival_city as city FROM routes WHERE status = "active" ORDER BY arrival_city'
    );

    const allCities = [...new Set([
      ...departureCities.map(item => item.city),
      ...arrivalCities.map(item => item.city)
    ])].sort();

    return allCities;
  }
}

module.exports = Route;