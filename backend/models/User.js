const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, email, full_name, phone, avatar_url, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(userData) {
    const { email, password_hash, full_name, phone, role } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, password_hash, full_name, phone, role]
    );
    return result.insertId;
  }

  static async updateProfile(userId, updateData) {
    const { full_name, phone, avatar_url } = updateData;
    const [result] = await pool.execute(
      'UPDATE users SET full_name = ?, phone = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, phone, avatar_url, userId]
    );
    return result.affectedRows > 0;
  }

  static async updatePassword(userId, newPasswordHash) {
    const [result] = await pool.execute(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, userId]
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(userId, status) {
    const [result] = await pool.execute(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, userId]
    );
    return result.affectedRows > 0;
  }

  static async getAllUsers(page = 1, limit = 10, role = null) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT id, email, full_name, phone, avatar_url, role, status, created_at 
      FROM users 
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];
    
    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0].total;

    return {
      users: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = User;