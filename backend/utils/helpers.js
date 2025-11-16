const moment = require('moment');

const helpers = {
  // Format tiền tệ
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  // Format ngày giờ
  formatDateTime: (date, format = 'DD/MM/YYYY HH:mm') => {
    return moment(date).format(format);
  },

  // Tính khoảng cách thời gian
  calculateDuration: (start, end) => {
    const startMoment = moment(start);
    const endMoment = moment(end);
    const duration = moment.duration(endMoment.diff(startMoment));
    
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    
    return `${hours}h${minutes > 0 ? ` ${minutes}p` : ''}`;
  },

  // Tạo mã ngẫu nhiên
  generateRandomCode: (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  },

  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Vietnam)
  isValidPhone: (phone) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
  },

  // Pagination helper
  getPagination: (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
      current: page,
      next: hasNext ? page + 1 : null,
      prev: hasPrev ? page - 1 : null,
      total: totalPages,
      hasNext,
      hasPrev
    };
  },

  // Xử lý lỗi
  handleError: (error, defaultMessage = 'Something went wrong') => {
    console.error('Error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return 'Duplicate entry found';
    }
    
    if (error.code === 'ER_NO_REFERENCED_ROW') {
      return 'Referenced record not found';
    }
    
    return defaultMessage;
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (typeof input === 'string') {
      return input.trim().replace(/[<>]/g, '');
    }
    return input;
  },

  // Generate seat numbers
  generateSeatNumbers: (totalSeats, prefix = 'A') => {
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push(`${prefix}${i}`);
    }
    return seats;
  }
};

module.exports = helpers;