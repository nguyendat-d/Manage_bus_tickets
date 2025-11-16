const pool = require('../config/database');

class BusCompany {
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT bc.*, u.email, u.full_name, u.phone
       FROM bus_companies bc
       JOIN users u ON bc.user_id = u.id
       WHERE bc.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT bc.*, u.email, u.full_name, u.phone
       FROM bus_companies bc
       JOIN users u ON bc.user_id = u.id
       WHERE bc.user_id = ?`,
      [userId]
    );
    return rows[0];
  }

  static async create(busCompanyData) {
    const { user_id, company_name, tax_code, address, phone, email, documents } = busCompanyData;
    const [result] = await pool.execute(
      `INSERT INTO bus_companies (user_id, company_name, tax_code, address, phone, email, documents)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, company_name, tax_code, address, phone, email, JSON.stringify(documents)]
    );
    return result.insertId;
  }

  static async updateStatus(companyId, status) {
    const [result] = await pool.execute(
      'UPDATE bus_companies SET status = ? WHERE id = ?',
      [status, companyId]
    );
    return result.affectedRows > 0;
  }

  static async update(companyId, updateData) {
    const { company_name, address, phone, email, documents } = updateData;
    const [result] = await pool.execute(
      `UPDATE bus_companies 
       SET company_name = ?, address = ?, phone = ?, email = ?, documents = ?
       WHERE id = ?`,
      [company_name, address, phone, email, JSON.stringify(documents), companyId]
    );
    return result.affectedRows > 0;
  }

  static async getAllCompanies(page = 1, limit = 10, status = null) {
    const offset = (page - 1) * limit;

    let query = `
      SELECT bc.*, u.email, u.full_name, u.phone,
             (SELECT COUNT(*) FROM trips t WHERE t.bus_company_id = bc.id) as total_trips,
             (SELECT COUNT(*) FROM buses b WHERE b.bus_company_id = bc.id) as total_buses
      FROM bus_companies bc
      JOIN users u ON bc.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND bc.status = ?';
      params.push(status);
    }

    query += ' ORDER BY bc.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bus_companies WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0].total;

    return {
      companies: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getStats(companyId) {
    const [revenueStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount ELSE 0 END) as total_revenue,
        AVG(b.total_amount) as average_booking_value,
        MONTH(b.created_at) as month,
        YEAR(b.created_at) as year
       FROM bookings b
       JOIN trips t ON b.trip_id = t.id
       WHERE t.bus_company_id = ?
       GROUP BY YEAR(b.created_at), MONTH(b.created_at)
       ORDER BY year DESC, month DESC
       LIMIT 6`,
      [companyId]
    );

    const [popularRoutes] = await pool.execute(
      `SELECT 
        r.departure_city, r.arrival_city,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as route_revenue
       FROM bookings b
       JOIN trips t ON b.trip_id = t.id
       JOIN routes r ON t.route_id = r.id
       WHERE t.bus_company_id = ? AND b.payment_status = 'paid'
       GROUP BY r.id
       ORDER BY booking_count DESC
       LIMIT 5`,
      [companyId]
    );

    const [busStats] = await pool.execute(
      `SELECT 
        b.license_plate, b.bus_type,
        COUNT(t.id) as trip_count,
        SUM(bk.total_amount) as bus_revenue
       FROM buses b
       LEFT JOIN trips t ON b.id = t.bus_id
       LEFT JOIN bookings bk ON t.id = bk.trip_id AND bk.payment_status = 'paid'
       WHERE b.bus_company_id = ?
       GROUP BY b.id
       ORDER BY bus_revenue DESC`,
      [companyId]
    );

    return {
      revenueStats,
      popularRoutes,
      busStats
    };
  }
}

module.exports = BusCompany;