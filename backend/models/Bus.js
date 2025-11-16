const pool = require('../config/database');

class Bus {
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, bc.company_name
       FROM buses b
       JOIN bus_companies bc ON b.bus_company_id = bc.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByCompanyId(busCompanyId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
      `SELECT b.*, 
              COUNT(t.id) as total_trips,
              SUM(CASE WHEN bk.payment_status = 'paid' THEN bk.total_amount ELSE 0 END) as total_revenue
       FROM buses b
       LEFT JOIN trips t ON b.id = t.bus_id
       LEFT JOIN bookings bk ON t.id = bk.trip_id
       WHERE b.bus_company_id = ?
       GROUP BY b.id
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [busCompanyId, limit, offset]
    );

    const [countRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM buses WHERE bus_company_id = ?',
      [busCompanyId]
    );

    const total = countRows[0].total;

    return {
      buses: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async create(busData) {
    const { bus_company_id, license_plate, bus_type, total_seats, amenities, seat_map } = busData;
    const [result] = await pool.execute(
      `INSERT INTO buses (bus_company_id, license_plate, bus_type, total_seats, amenities, seat_map)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bus_company_id, license_plate, bus_type, total_seats, JSON.stringify(amenities), JSON.stringify(seat_map)]
    );
    return result.insertId;
  }

  static async update(id, busData) {
    const { license_plate, bus_type, total_seats, amenities, seat_map, status } = busData;
    const [result] = await pool.execute(
      `UPDATE buses 
       SET license_plate = ?, bus_type = ?, total_seats = ?, amenities = ?, seat_map = ?, status = ?
       WHERE id = ?`,
      [license_plate, bus_type, total_seats, JSON.stringify(amenities), JSON.stringify(seat_map), status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM buses WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async checkLicensePlateExists(license_plate, excludeId = null) {
    let query = 'SELECT id FROM buses WHERE license_plate = ?';
    const params = [license_plate];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await pool.execute(query, params);
    return rows.length > 0;
  }

  static async getAvailableBuses(busCompanyId, departureTime, arrivalTime, excludeBusId = null) {
    let query = `
      SELECT b.* 
      FROM buses b
      WHERE b.bus_company_id = ? 
      AND b.status = 'active'
      AND b.id NOT IN (
        SELECT t.bus_id 
        FROM trips t 
        WHERE t.status = 'scheduled'
        AND (
          (t.departure_time BETWEEN ? AND ?) OR
          (t.arrival_time BETWEEN ? AND ?) OR
          (? BETWEEN t.departure_time AND t.arrival_time) OR
          (? BETWEEN t.departure_time AND t.arrival_time)
        )
      )
    `;

    const params = [busCompanyId, departureTime, arrivalTime, departureTime, arrivalTime, departureTime, arrivalTime];

    if (excludeBusId) {
      query += ' AND b.id != ?';
      params.push(excludeBusId);
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async generateSeatMap(totalSeats, busType) {
    const seatMap = [];
    const rows = Math.ceil(totalSeats / 4);
    let seatNumber = 1;

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= 4; col++) {
        if (seatNumber > totalSeats) break;

        const seat = {
          number: `A${seatNumber}`,
          row: row,
          column: col,
          type: 'normal',
          price_multiplier: 1.0,
          isAvailable: true
        };

        // Ghế cửa sổ
        if (col === 1 || col === 4) {
          seat.type = 'window';
        }

        // Ghế giường nằm
        if (busType === 'sleeper') {
          seat.type = 'sleeper';
          seat.price_multiplier = 1.2;
        }

        // Ghế limousine
        if (busType === 'limousine') {
          seat.type = 'luxury';
          seat.price_multiplier = 1.5;
        }

        seatMap.push(seat);
        seatNumber++;
      }
    }

    return seatMap;
  }
}

module.exports = Bus;