const pool = require('../config/database');
const User = require('../models/User');
const BusCompany = require('../models/BusCompany');
const Route = require('../models/Route');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

const adminController = {
  // Quản lý users
  getUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, role } = req.query;
      const result = await User.getAllUsers(page, limit, role);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Quản lý nhà xe
  getBusCompanies: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await BusCompany.getAllCompanies(page, limit, status);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get bus companies error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Duyệt nhà xe
  approveBusCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const updated = await BusCompany.updateStatus(id, status);

      if (updated) {
        res.json({
          success: true,
          message: `Bus company ${status} successfully`
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }
    } catch (error) {
      console.error('Approve bus company error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Quản lý tuyến đường
  getRoutes: async (req, res) => {
    try {
      const { page = 1, limit = 10, departure_city, arrival_city, status } = req.query;
      const result = await Route.findAll(page, limit, {
        departure_city,
        arrival_city,
        status
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get routes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Thêm tuyến đường
  createRoute: async (req, res) => {
    try {
      const { departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes } = req.body;

      const routeId = await Route.create({
        departure_city,
        departure_station,
        arrival_city,
        arrival_station,
        distance_km,
        estimated_duration_minutes
      });

      res.status(201).json({
        success: true,
        message: 'Route created successfully',
        data: {
          routeId
        }
      });
    } catch (error) {
      console.error('Create route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Cập nhật tuyến đường
  updateRoute: async (req, res) => {
    try {
      const { id } = req.params;
      const routeData = req.body;

      const updated = await Route.update(id, routeData);

      if (updated) {
        res.json({
          success: true,
          message: 'Route updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Route not found'
        });
      }
    } catch (error) {
      console.error('Update route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Xóa tuyến đường
  deleteRoute: async (req, res) => {
    try {
      const { id } = req.params;

      // Kiểm tra xem tuyến đường có đang được sử dụng không
      const [trips] = await pool.execute(
        'SELECT id FROM trips WHERE route_id = ? AND status = "scheduled"',
        [id]
      );

      if (trips.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete route that has scheduled trips'
        });
      }

      const deleted = await Route.delete(id);

      if (deleted) {
        res.json({
          success: true,
          message: 'Route deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Route not found'
        });
      }
    } catch (error) {
      console.error('Delete route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Thống kê tổng quan
  getAnalytics: async (req, res) => {
    try {
      // Tổng doanh thu
      const [revenueStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_bookings,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as average_booking,
          COUNT(DISTINCT user_id) as unique_customers
         FROM bookings 
         WHERE payment_status = 'paid' 
           AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
      );

      // Thống kê nhà xe
      const [companyStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_companies,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_companies,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_companies
         FROM bus_companies`
      );

      // Tuyến đường phổ biến
      const popularRoutes = await Route.getPopularRoutes(5);

      // Doanh thu theo tháng
      const [monthlyRevenue] = await pool.execute(
        `SELECT 
          YEAR(created_at) as year,
          MONTH(created_at) as month,
          SUM(total_amount) as monthly_revenue,
          COUNT(*) as booking_count
         FROM bookings 
         WHERE payment_status = 'paid'
         GROUP BY YEAR(created_at), MONTH(created_at)
         ORDER BY year DESC, month DESC
         LIMIT 6`
      );

      res.json({
        success: true,
        data: {
          revenue: revenueStats[0],
          companies: companyStats[0],
          popularRoutes,
          monthlyRevenue
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Quản lý trạng thái user
  updateUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'inactive', 'suspended'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const updated = await User.updateStatus(id, status);

      if (updated) {
        res.json({
          success: true,
          message: `User status updated to ${status}`
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = adminController;