// middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = {
  // Xác thực cho tất cả users
  authenticate: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Lấy thông tin user từ database
      const [users] = await pool.execute(
        'SELECT id, email, full_name, phone, avatar_url, role, status FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = users[0];
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  },

  // Chỉ cho admin
  authorizeAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    next();
  },

  // Cho nhà xe và admin
  authorizeBusCompanyOrAdmin: (req, res, next) => {
    if (req.user.role !== 'bus_company' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Bus company or admin role required.'
      });
    }
    next();
  }
};

module.exports = auth;