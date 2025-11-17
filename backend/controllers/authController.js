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

      // Kiểm tra xem email service có sẵn sàng không
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('📧 Email service not configured - returning token directly');
        return res.json({
          success: true,
          message: 'Password reset token generated (email service not configured)',
          data: {
            resetToken: resetToken,
            note: 'Use this token with the reset password API'
          }
        });
      }

      // Gửi email reset password
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      
      const emailSent = await sendEmail({
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
          <p>If you didn't request this, please ignore this email.</p>
        `
      });

      if (emailSent) {
        res.json({
          success: true,
          message: 'Password reset link sent to your email'
        });
      } else {
        // Nếu gửi email thất bại, trả về token trực tiếp
        console.log('📧 Email sending failed - returning token directly');
        res.json({
          success: true,
          message: 'Password reset token generated (email sending failed)',
          data: {
            resetToken: resetToken,
            note: 'Use this token with the reset password API'
          }
        });
      }
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

      // Validate input
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

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
      const [result] = await pool.execute(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [password_hash, decoded.userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'Reset token has expired'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
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
  },

  // Verify token (cho client-side checking)
  verifyToken: async (req, res) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
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

      const user = users[0];

      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is suspended'
        });
      }

      res.json({
        success: true,
        data: {
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
      console.error('Verify token error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = authController;