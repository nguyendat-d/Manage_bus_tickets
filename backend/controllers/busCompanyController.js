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

  // Cập nhật thông tin xe
  updateBus: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { license_plate, bus_type, total_seats, amenities, status } = req.body;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      // Kiểm tra xe có thuộc nhà xe này không
      const [buses] = await pool.execute(
        'SELECT id FROM buses WHERE id = ? AND bus_company_id = ?',
        [id, company.id]
      );

      if (buses.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bus not found'
        });
      }

      await pool.execute(
        'UPDATE buses SET license_plate = ?, bus_type = ?, total_seats = ?, amenities = ?, status = ? WHERE id = ?',
        [license_plate, bus_type, total_seats, amenities || '', status || 'active', id]
      );

      res.json({
        success: true,
        message: 'Bus updated successfully'
      });
    } catch (error) {
      console.error('Update bus error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Xóa xe
  deleteBus: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      // Kiểm tra xe có thuộc nhà xe này không
      const [buses] = await pool.execute(
        'SELECT id FROM buses WHERE id = ? AND bus_company_id = ?',
        [id, company.id]
      );

      if (buses.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bus not found'
        });
      }

      // Kiểm tra xe có chuyến đi nào đang hoạt động không
      const [activeTrips] = await pool.execute(
        'SELECT id FROM trips WHERE bus_id = ? AND status = "scheduled" AND departure_time > NOW()',
        [id]
      );

      if (activeTrips.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete bus with active trips'
        });
      }

      await pool.execute('DELETE FROM buses WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Bus deleted successfully'
      });
    } catch (error) {
      console.error('Delete bus error:', error);
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

  // Tạo chuyến xe mới
  createTrip: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { route_id, bus_id, departure_time, arrival_time, base_price, available_seats } = req.body;

      console.log('🚌 CREATE TRIP REQUEST:', {
        user_id,
        route_id,
        bus_id,
        departure_time,
        arrival_time,
        base_price,
        available_seats
      });

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        console.error('❌ Bus company not found for user:', user_id);
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      console.log('✅ Found company:', { id: company.id, status: company.status });

      // Kiểm tra nhà xe đã được duyệt chưa
      if (company.status !== 'approved') {
        console.error('❌ Bus company not approved yet:', { id: company.id, status: company.status });
        return res.status(403).json({
          success: false,
          message: 'Nhà xe chưa được phê duyệt. Vui lòng chờ admin duyệt.'
        });
      }

      // Kiểm tra xe có thuộc nhà xe này không
      const [buses] = await pool.execute(
        'SELECT id, total_seats FROM buses WHERE id = ? AND bus_company_id = ?',
        [bus_id, company.id]
      );

      if (buses.length === 0) {
        console.error('❌ Bus not found or does not belong to company:', { bus_id, company_id: company.id });
        return res.status(404).json({
          success: false,
          message: 'Bus not found'
        });
      }

      console.log('✅ Found bus:', buses[0]);

      // Kiểm tra số ghế khả dụng
      if (available_seats > buses[0].total_seats) {
        console.error('❌ Available seats exceed total seats:', { available_seats, total_seats: buses[0].total_seats });
        return res.status(400).json({
          success: false,
          message: 'Available seats cannot exceed total bus seats'
        });
      }

      console.log('💾 Inserting trip into database...');
      
      // Lấy company_id để insert
      const [result] = await pool.execute(
        'INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [company.id, route_id, bus_id, departure_time, arrival_time, base_price, available_seats, 'scheduled']
      );

      console.log('✅ Trip created successfully with ID:', result.insertId);

      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: {
          tripId: result.insertId
        }
      });
    } catch (error) {
      console.error('❌ CREATE TRIP ERROR:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('SQL State:', error.sqlState);
      console.error('SQL Message:', error.sqlMessage);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Cập nhật chuyến xe
  updateTrip: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { route_id, bus_id, departure_time, arrival_time, base_price, available_seats } = req.body;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      // Kiểm tra chuyến xe có thuộc nhà xe này không
      const [trips] = await pool.execute(
        `SELECT t.id FROM trips t 
         JOIN buses b ON t.bus_id = b.id 
         WHERE t.id = ? AND b.bus_company_id = ?`,
        [id, company.id]
      );

      if (trips.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      await pool.execute(
        'UPDATE trips SET route_id = ?, bus_id = ?, departure_time = ?, arrival_time = ?, base_price = ?, available_seats = ? WHERE id = ?',
        [route_id, bus_id, departure_time, arrival_time, base_price, available_seats, id]
      );

      res.json({
        success: true,
        message: 'Trip updated successfully'
      });
    } catch (error) {
      console.error('Update trip error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Xóa chuyến xe
  deleteTrip: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;

      const company = await BusCompany.findByUserId(user_id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Bus company not found'
        });
      }

      // Kiểm tra chuyến xe có thuộc nhà xe này không
      const [trips] = await pool.execute(
        `SELECT t.id FROM trips t 
         JOIN buses b ON t.bus_id = b.id 
         WHERE t.id = ? AND b.bus_company_id = ?`,
        [id, company.id]
      );

      if (trips.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      // Kiểm tra có booking nào không
      const [bookings] = await pool.execute(
        'SELECT id FROM bookings WHERE trip_id = ? AND status != "cancelled"',
        [id]
      );

      if (bookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete trip with active bookings'
        });
      }

      await pool.execute('DELETE FROM trips WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      console.error('Delete trip error:', error);
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