const Joi = require('joi');

const validation = {
  // Validation cho đăng ký
  register: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      full_name: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
      role: Joi.string().valid('passenger', 'bus_company', 'admin').default('passenger'),
      company_name: Joi.when('role', {
        is: 'bus_company',
        then: Joi.string().min(2).max(255).required(),
        otherwise: Joi.optional()
      }),
      tax_code: Joi.when('role', {
        is: 'bus_company',
        then: Joi.string().min(5).max(50).required(),
        otherwise: Joi.optional()
      })
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  },

  // Validation cho đăng nhập
  login: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  },

  // Validation cho tạo chuyến xe
  createTrip: (req, res, next) => {
    const schema = Joi.object({
      route_id: Joi.number().integer().required(),
      bus_id: Joi.number().integer().required(),
      departure_time: Joi.date().greater('now').required(),
      arrival_time: Joi.date().greater(Joi.ref('departure_time')).required(),
      price: Joi.number().min(0).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  },

  // Validation cho đặt vé
  createBooking: (req, res, next) => {
    const schema = Joi.object({
      trip_id: Joi.number().integer().required(),
      passenger_info: Joi.object({
        full_name: Joi.string().required(),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
        email: Joi.string().email().required(),
        identification: Joi.string().optional()
      }).required(),
      seat_numbers: Joi.array().items(Joi.string()).min(1).required(),
      payment_method: Joi.string().valid('vnpay', 'credit_card', 'debit_card', 'cash').required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  }
};

module.exports = validation;