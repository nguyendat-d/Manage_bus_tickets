const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { upload } = require('../middleware/upload');

const userController = {
  // Lấy thông tin user
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Cập nhật thông tin user
  updateProfile: async (req, res) => {
    try {
      const { full_name, phone } = req.body;
      let avatar_url = req.user.avatar_url;

      // Xử lý upload avatar nếu có
      if (req.file) {
        avatar_url = req.file.path;
      }

      const updated = await User.updateProfile(req.user.id, {
        full_name,
        phone,
        avatar_url
      });

      if (updated) {
        // Lấy thông tin user mới
        const user = await User.findById(req.user.id);
        
        res.json({
          success: true,
          message: 'Profile updated successfully',
          data: user
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to update profile'
        });
      }
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { current_password, new_password } = req.body;

      // Lấy thông tin user với password
      const pool = require('../config/database');
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      // Kiểm tra mật khẩu hiện tại
      const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash mật khẩu mới
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

      // Cập nhật mật khẩu
      const updated = await User.updatePassword(req.user.id, newPasswordHash);

      if (updated) {
        res.json({
          success: true,
          message: 'Password changed successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to change password'
        });
      }
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Xóa tài khoản
  deleteAccount: async (req, res) => {
    try {
      const { password } = req.body;

      // Lấy thông tin user với password
      const pool = require('../config/database');
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Password is incorrect'
        });
      }

      // Kiểm tra xem user có booking đang active không
      const [activeBookings] = await pool.execute(
        `SELECT id FROM bookings 
         WHERE user_id = ? AND booking_status = 'confirmed' 
         AND payment_status = 'paid'`,
        [req.user.id]
      );

      if (activeBookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete account with active bookings'
        });
      }

      // Vô hiệu hóa tài khoản thay vì xóa
      const updated = await User.updateStatus(req.user.id, 'inactive');

      if (updated) {
        res.json({
          success: true,
          message: 'Account deleted successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to delete account'
        });
      }
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = userController;