// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { sendEmail } = require('../utils/emailService');

const authController = {
  // Đăng ký user
  register: async (req, res) => {
    try {
      const { email, password, full_name, phone, role = 'passenger' } = req.body;

      // Kiểm tra email đã tồn tại
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Tạo user
      const [result] = await pool.execute(
        'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
        [email, password_hash, full_name, phone, role]
      );

      // Nếu là nhà xe, tạo bản ghi trong bus_companies
      if (role === 'bus_company') {
        const { company_name, tax_code, address } = req.body;
        await pool.execute(
          'INSERT INTO bus_companies (user_id, company_name, tax_code, address) VALUES (?, ?, ?, ?)',
          [result.insertId, company_name, tax_code, address]
        );
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: result.insertId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: result.insertId,
            email,
            full_name,
            phone,
            role
          }
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Tìm user
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = users[0];

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Kiểm tra trạng thái tài khoản
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is suspended'
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            phone: user.phone,
            avatar_url: user.avatar_url,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Quên mật khẩu
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const [users] = await pool.execute(
        'SELECT id, email, full_name FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Email not found'
        });
      }

      const user = users[0];
      const resetToken = jwt.sign(
        { userId: user.id, type: 'password_reset' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      // Gửi email reset password
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      
      await sendEmail({
        to: email,
        subject: 'Reset Your Password - Bus Ticket System',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hello ${user.full_name},</p>
          <p>You requested to reset your password. Click the link below:</p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
        `
      });

      res.json({
        success: true,
        message: 'Password reset link sent to your email'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      }

      // Hash password mới
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);

      // Cập nhật password
      await pool.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [password_hash, decoded.userId]
      );

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
  },

  // Đăng xuất
  logout: async (req, res) => {
    // Với JWT, client side sẽ xóa token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
};

module.exports = authController;