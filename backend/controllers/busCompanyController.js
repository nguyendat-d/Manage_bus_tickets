const pool = require('../config/database');
const BusCompany = require('../models/BusCompany');
const Bus = require('../models/Bus');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

const busCompanyController = {
  // Đăng ký nhà xe
  register: async (req, res) => {
    try {
      const { company_name, tax_code, address, phone, email, documents } = req.body;
      const user_id = req.user.id;

      // Kiểm tra tax code đã tồn tại
      const [existingCompanies] = await pool.execute(
        'SELECT id FROM bus_companies WHERE tax_code = ?',
        [tax_code]
      );

      if (existingCompanies.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Tax code already exists'
        });
      }

      // Tạo nhà xe
      const companyId = await BusCompany.create({
        user_id,
        company_name,
        tax_code,
        address,
        phone,
        email,
        documents
      });

      res.status(201).json({
        success: true,
        message: 'Bus company registered successfully. Waiting for admin approval.',
        data: {
          companyId
        }
      });
    } catch (error) {
      console.error('Bus company register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Lấy thông tin nhà xe
  getProfile: async (req, res) => {
    try {
      const user_id = req.user.id;
      const company = await BusCompany.findByUserId(user_id);

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      res.json({
        success: true,
        data: company
      });
    } catch (error) {
      console.error('Get bus company profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Cập nhật thông tin nhà xe
  updateProfile: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { company_name, address, phone, email, documents } = req.body;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      const updated = await BusCompany.update(company.id, {
        company_name,
        address,
        phone,
        email,
        documents
      });

      if (updated) {
        res.json({
          success: true,
          message: 'Profile updated successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to update profile'
        });
      }
    } catch (error) {
      console.error('Update bus company profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Thêm xe mới
  addBus: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { license_plate, bus_type, total_seats, amenities } = req.body;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      // Kiểm tra biển số xe đã tồn tại
      const licenseExists = await Bus.checkLicensePlateExists(license_plate);
      if (licenseExists) {
        return res.status(400).json({
          success: false,
          message: 'License plate already exists'
        });
      }

      // Tạo seat map tự động
      const seat_map = await Bus.generateSeatMap(total_seats, bus_type);

      const busId = await Bus.create({
        bus_company_id: company.id,
        license_plate,
        bus_type,
        total_seats,
        amenities: amenities || {},
        seat_map
      });

      res.status(201).json({
        success: true,
        message: 'Bus added successfully',
        data: {
          busId
        }
      });
    } catch (error) {
      console.error('Add bus error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Lấy danh sách xe
  getBuses: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      const result = await Bus.findByCompanyId(company.id, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get buses error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Lấy danh sách chuyến xe của nhà xe
  getTrips: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      const result = await Trip.getBusCompanyTrips(company.id, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get bus company trips error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Lấy danh sách đặt vé của nhà xe
  getBookings: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      const result = await Booking.getBusCompanyBookings(company.id, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get bus company bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Thống kê doanh thu
  getStats: async (req, res) => {
    try {
      const user_id = req.user.id;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      const stats = await BusCompany.getStats(company.id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get bus company stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = busCompanyController;