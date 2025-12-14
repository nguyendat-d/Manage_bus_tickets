// Message Handler - Chuyển đổi lỗi kỹ thuật thành thông báo thân thiện

// Bản đồ thông báo lỗi thân thiện
const ERROR_MESSAGES = {
  // Network Errors
  'Network Error': 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.',
  'ECONNREFUSED': 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
  'ERR_NETWORK': 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.',
  'timeout': 'Yêu cầu quá lâu. Vui lòng thử lại.',
  
  // Authentication Errors
  'Invalid credentials': 'Email hoặc mật khẩu không đúng.',
  'Unauthorized': 'Bạn không có quyền truy cập. Vui lòng đăng nhập lại.',
  'Token expired': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  'Invalid token': 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
  
  // Validation Errors
  'Email already exists': 'Email này đã được đăng ký.',
  'Phone number already exists': 'Số điện thoại này đã được sử dụng.',
  'Tax code already exists': 'Mã số thuế này đã được đăng ký.',
  'Invalid email format': 'Email không đúng định dạng.',
  'Password too weak': 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.',
  
  // Booking Errors
  'Seat already booked': 'Ghế này đã được đặt. Vui lòng chọn ghế khác.',
  'Trip not found': 'Không tìm thấy chuyến xe này.',
  'No available seats': 'Chuyến xe đã hết chỗ.',
  'Booking not found': 'Không tìm thấy vé đặt này.',
  
  // Payment Errors
  'Payment failed': 'Thanh toán thất bại. Vui lòng thử lại.',
  'Insufficient balance': 'Số dư không đủ để thực hiện giao dịch.',
  'Payment timeout': 'Thanh toán quá hạn. Vui lòng đặt vé lại.',
  
  // Server Errors
  '500': 'Lỗi máy chủ. Vui lòng thử lại sau.',
  '503': 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
  '404': 'Không tìm thấy dữ liệu yêu cầu.',
  
  // Default
  'default': 'Đã có lỗi xảy ra. Vui lòng thử lại.'
};

// Thông báo thành công thân thiện
const SUCCESS_MESSAGES = {
  'Login successful': 'Đăng nhập thành công!',
  'Registration successful': 'Đăng ký thành công!',
  'Booking successful': 'Đặt vé thành công!',
  'Payment successful': 'Thanh toán thành công!',
  'Update successful': 'Cập nhật thông tin thành công!',
  'Delete successful': 'Xóa thành công!',
  'Created successfully': 'Tạo mới thành công!',
  'Approved successfully': 'Phê duyệt thành công!',
  'Rejected successfully': 'Từ chối thành công!',
  'Cancelled successfully': 'Hủy thành công!'
};

/**
 * Xử lý lỗi từ API response và trả về thông báo thân thiện
 * @param {Error} error - Error object từ axios
 * @returns {string} - Thông báo lỗi thân thiện
 */
export const handleError = (error) => {
  // Kiểm tra nếu không có response (network error)
  if (!error.response) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return ERROR_MESSAGES['Network Error'];
    }
    if (error.message.toLowerCase().includes('timeout')) {
      return ERROR_MESSAGES['timeout'];
    }
    if (error.message.toLowerCase().includes('network error')) {
      return ERROR_MESSAGES['Network Error'];
    }
    return ERROR_MESSAGES['default'];
  }

  const { status, data } = error.response;

  // Kiểm tra message từ server
  if (data?.message) {
    const message = data.message;
    
    // Tìm kiếm message trong ERROR_MESSAGES
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Nếu message đã là tiếng Việt và không có localhost/technical terms
    if (!hasEnglishTechnicalTerms(message)) {
      return message;
    }
  }

  // Xử lý theo status code
  switch (status) {
    case 400:
      return data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
    case 401:
      return ERROR_MESSAGES['Unauthorized'];
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này.';
    case 404:
      return ERROR_MESSAGES['404'];
    case 409:
      return data?.message || 'Dữ liệu đã tồn tại.';
    case 422:
      return data?.message || 'Dữ liệu không hợp lệ.';
    case 500:
      return ERROR_MESSAGES['500'];
    case 503:
      return ERROR_MESSAGES['503'];
    default:
      return ERROR_MESSAGES['default'];
  }
};

/**
 * Xử lý thông báo thành công
 * @param {string} message - Message từ server
 * @returns {string} - Thông báo thành công thân thiện
 */
export const handleSuccess = (message) => {
  if (!message) return 'Thao tác thành công!';
  
  // Tìm kiếm message trong SUCCESS_MESSAGES
  for (const [key, value] of Object.entries(SUCCESS_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Nếu message đã là tiếng Việt và không có localhost/technical terms
  if (!hasEnglishTechnicalTerms(message)) {
    return message;
  }
  
  return 'Thao tác thành công!';
};

/**
 * Kiểm tra xem message có chứa các thuật ngữ kỹ thuật tiếng Anh không
 * @param {string} message
 * @returns {boolean}
 */
const hasEnglishTechnicalTerms = (message) => {
  const technicalTerms = [
    'localhost',
    'server',
    'database',
    'error',
    'failed',
    'invalid',
    'unauthorized',
    'forbidden',
    'not found',
    'bad request',
    'internal',
    'timeout',
    'connection',
    'api',
    'endpoint',
    'http',
    'https',
    'status',
    'code'
  ];
  
  const lowerMessage = message.toLowerCase();
  return technicalTerms.some(term => lowerMessage.includes(term));
};

/**
 * Làm sạch thông báo - Xóa các thông tin kỹ thuật
 * @param {string} message
 * @returns {string}
 */
export const sanitizeMessage = (message) => {
  if (!message) return '';
  
  // Xóa localhost và port
  message = message.replace(/localhost:\d+/g, 'máy chủ');
  message = message.replace(/http:\/\/localhost/g, 'máy chủ');
  message = message.replace(/https:\/\/localhost/g, 'máy chủ');
  
  // Xóa URL paths
  message = message.replace(/\/api\/\w+/g, '');
  
  // Xóa stack traces
  message = message.split('\n')[0];
  
  // Xóa status codes trong ngoặc
  message = message.replace(/\s*\(\d{3}\)/g, '');
  
  return message.trim();
};

/**
 * Format validation errors từ server
 * @param {Array|Object} errors - Validation errors
 * @returns {string}
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return 'Dữ liệu không hợp lệ.';
  
  if (Array.isArray(errors)) {
    return errors.map(err => {
      if (typeof err === 'string') return sanitizeMessage(err);
      if (err.msg) return sanitizeMessage(err.msg);
      if (err.message) return sanitizeMessage(err.message);
      return 'Dữ liệu không hợp lệ.';
    }).join('\n');
  }
  
  if (typeof errors === 'object') {
    return Object.values(errors)
      .map(err => sanitizeMessage(String(err)))
      .join('\n');
  }
  
  return sanitizeMessage(String(errors));
};

export default {
  handleError,
  handleSuccess,
  sanitizeMessage,
  formatValidationErrors
};
