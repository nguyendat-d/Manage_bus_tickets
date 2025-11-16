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
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
      success: false,
      message: 'Too many login attempts from this IP, please try again later.'
    }
  }),

  // Giới hạn đăng ký
  register: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 registration attempts per windowMs
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