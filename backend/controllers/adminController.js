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

  // Cập nhật vai trò user
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['passenger', 'bus_company', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
      }

      const [result] = await pool.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
      );

      if (result.affectedRows > 0) {
        res.json({
          success: true,
          message: 'User role updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Update user role error:', error);
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

      console.log('📊 Bus companies fetched:', {
        total: result.companies.length,
        page: result.pagination.page,
        totalPages: result.pagination.pages,
        status: status || 'all'
      });

      res.json({
        success: true,
        data: {
          companies: result.companies,
          pagination: result.pagination,
          // Add aliases for frontend compatibility
          totalPages: result.pagination.pages,
          total: result.pagination.total
        }
      });
    } catch (error) {
      console.error('❌ Get bus companies error:', error);
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

      // Lấy thông tin nhà xe và user trước khi cập nhật
      const [companyInfo] = await pool.execute(
        `SELECT bc.*, u.email, u.full_name 
         FROM bus_companies bc 
         JOIN users u ON bc.user_id = u.id 
         WHERE bc.id = ?`,
        [id]
      );

      if (companyInfo.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      const updated = await BusCompany.updateStatus(id, status);

      if (updated) {
        // Gửi email thông báo
        const company = companyInfo[0];
        const { sendEmail } = require('../utils/emailService');
        
        if (status === 'approved') {
          await sendEmail({
            to: company.email,
            subject: 'Tài khoản nhà xe đã được phê duyệt',
            html: `
              <h2>Chúc mừng ${company.full_name}!</h2>
              <p>Tài khoản nhà xe <strong>${company.company_name}</strong> của bạn đã được Admin phê duyệt.</p>
              <p>Bạn có thể đăng nhập và sử dụng đầy đủ các chức năng của hệ thống.</p>
              <p>Trân trọng,<br>Bus Ticket Management System</p>
            `
          });
        } else if (status === 'rejected') {
          await sendEmail({
            to: company.email,
            subject: 'Tài khoản nhà xe bị từ chối',
            html: `
              <h2>Xin chào ${company.full_name},</h2>
              <p>Rất tiếc, tài khoản nhà xe <strong>${company.company_name}</strong> của bạn đã bị từ chối.</p>
              <p>Vui lòng liên hệ với Admin để biết thêm chi tiết.</p>
              <p>Trân trọng,<br>Bus Ticket Management System</p>
            `
          });
        }

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
      console.log('📊 Loading analytics...');

      // 1. Tổng doanh thu và bookings
      const [revenueStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_bookings,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as average_booking,
          COUNT(DISTINCT user_id) as unique_customers
         FROM bookings 
         WHERE payment_status = 'paid'`
      );
      console.log('✅ Revenue stats:', revenueStats[0]);

      // 2. Thống kê nhà xe
      const [companyStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_companies,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_companies,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_approval,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_companies
         FROM bus_companies`
      );
      console.log('✅ Company stats:', companyStats[0]);

      // 3. Thống kê user
      const [userStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'passenger' THEN 1 ELSE 0 END) as passengers,
          SUM(CASE WHEN role = 'bus_company' THEN 1 ELSE 0 END) as bus_companies,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
         FROM users`
      );
      console.log('✅ User stats:', userStats[0]);

      // 4. Tuyến đường phổ biến
      const [popularRoutes] = await pool.query(
        `SELECT 
          r.departure_city,
          r.arrival_city,
          COUNT(DISTINCT t.id) as trip_count,
          COUNT(b.id) as booking_count,
          COALESCE(SUM(b.total_amount), 0) as total_revenue
         FROM routes r
         INNER JOIN trips t ON r.id = t.route_id
         INNER JOIN bookings b ON t.id = b.trip_id
         WHERE b.payment_status = 'paid'
         GROUP BY r.id, r.departure_city, r.arrival_city
         ORDER BY total_revenue DESC
         LIMIT 5`
      );
      console.log('✅ Popular routes:', popularRoutes.length);

      // 5. Doanh thu theo tháng
      const [monthlyRevenue] = await pool.execute(
        `SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          DATE_FORMAT(created_at, '%m/%Y') as month_label,
          COALESCE(SUM(total_amount), 0) as revenue,
          COUNT(*) as booking_count
         FROM bookings 
         WHERE payment_status = 'paid'
           AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY month, month_label
         ORDER BY month DESC
         LIMIT 6`
      );
      monthlyRevenue.reverse();
      console.log('✅ Monthly revenue:', monthlyRevenue.length);

      // 6. Thống kê thanh toán
      const [paymentStats] = await pool.execute(
        `SELECT 
          COALESCE(payment_method, 'Unknown') as payment_method,
          COUNT(*) as count,
          COALESCE(SUM(amount), 0) as total_amount
         FROM payments 
         WHERE payment_status = 'success'
         GROUP BY payment_method`
      );
      console.log('✅ Payment stats:', paymentStats.length);

      // 7. Thống kê booking theo trạng thái
      const [bookingStatusStats] = await pool.execute(
        `SELECT 
          COALESCE(booking_status, 'confirmed') as booking_status,
          COUNT(*) as count
         FROM bookings
         GROUP BY booking_status`
      );
      console.log('✅ Booking status stats:', bookingStatusStats.length);

      console.log('✅ All analytics queries completed successfully');

      res.json({
        success: true,
        data: {
          revenue_stats: {
            total_bookings: revenueStats[0]?.total_bookings || 0,
            total_revenue: parseFloat(revenueStats[0]?.total_revenue || 0),
            average_booking: parseFloat(revenueStats[0]?.average_booking || 0),
            unique_customers: revenueStats[0]?.unique_customers || 0
          },
          company_stats: {
            total_companies: companyStats[0]?.total_companies || 0,
            approved_companies: companyStats[0]?.approved_companies || 0,
            pending_approval: companyStats[0]?.pending_approval || 0,
            rejected_companies: companyStats[0]?.rejected_companies || 0
          },
          user_stats: {
            total_users: userStats[0]?.total_users || 0,
            passengers: userStats[0]?.passengers || 0,
            bus_companies: userStats[0]?.bus_companies || 0,
            admins: userStats[0]?.admins || 0
          },
          popular_routes: popularRoutes.map(route => ({
            departure_city: route.departure_city,
            arrival_city: route.arrival_city,
            trip_count: route.trip_count,
            booking_count: route.booking_count,
            total_revenue: parseFloat(route.total_revenue || 0)
          })),
          monthly_revenue: monthlyRevenue.map(month => ({
            month: month.month_label,
            revenue: parseFloat(month.revenue || 0),
            booking_count: month.booking_count || 0
          })),
          payment_stats: paymentStats.map(stat => ({
            payment_method: stat.payment_method || 'Unknown',
            count: stat.count || 0,
            total_amount: parseFloat(stat.total_amount || 0)
          })),
          booking_status_stats: bookingStatusStats.map(stat => ({
            status: stat.booking_status || 'confirmed',
            count: stat.count || 0
          }))
        }
      });
    } catch (error) {
      console.error('❌ Get analytics error:', error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error message:', error.message);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tải dữ liệu thống kê',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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