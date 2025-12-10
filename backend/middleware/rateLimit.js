const rateLimit = require('express-rate-limit');

const limiter = {
  // Giới hạn chung
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    }
  }),

  // Giới hạn đăng nhập
  login: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 login attempts per windowMs (increased for testing)
    message: {
      success: false,
      message: 'Too many login attempts from this IP, please try again later.'
    }
  }),

  // Giới hạn đăng ký
  register: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes (giảm từ 1 giờ)
    max: 20, // limit each IP to 20 registration attempts per windowMs (tăng từ 3)
    message: {
      success: false,
      message: 'Too many registration attempts from this IP, please try again later.'
    }
  }),

  // Giới hạn API
  api: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per minute
    message: {
      success: false,
      message: 'Too many API requests, please slow down.'
    }
  })
};

module.exports = limiter;