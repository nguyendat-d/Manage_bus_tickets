const Joi = require('joi');

const validation = {
  // Validation cho đăng ký
  register: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/)
        .required()
        .messages({
          'string.pattern.base': 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm: chữ in hoa, chữ in thường, số và ký tự đặc biệt',
          'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
        }),
      full_name: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
      role: Joi.string().valid('passenger', 'bus_company', 'admin').default('passenger'),
      company_name: Joi.when('role', {
        is: 'bus_company',
        then: Joi.string().min(2).max(255).required(),
        otherwise: Joi.optional()
      }),
      address: Joi.when('role', {
        is: 'bus_company',
        then: Joi.string().min(5).max(500).required(),
        otherwise: Joi.optional()
      }),
      tax_code: Joi.when('role', {
        is: 'bus_company',
        then: Joi.string().min(5).max(50).optional(),
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
      seats: Joi.string().required(),
      total_amount: Joi.number().min(0).required()
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