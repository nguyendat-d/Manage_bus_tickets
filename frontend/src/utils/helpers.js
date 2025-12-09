// src/utils/helpers.js

// Format tiền tệ
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Format ngày
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  
  return new Date(dateString).toLocaleDateString('vi-VN', {
    ...defaultOptions,
    ...options
  })
}

// Format ngày giờ
export const formatDateTime = (dateString, options = {}) => {
  if (!dateString) return ''
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Date(dateString).toLocaleDateString('vi-VN', {
    ...defaultOptions,
    ...options
  })
}

// Format thời gian
export const formatTime = (dateString) => {
  if (!dateString) return ''
  
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Tính thời gian di chuyển
export const calculateDuration = (start, end) => {
  if (!start || !end) return ''
  
  const startTime = new Date(start)
  const endTime = new Date(end)
  const duration = endTime - startTime
  
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}p` : ''}`
  }
  return `${minutes}p`
}

// Validate email
export const isValidEmail = (email) => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Vietnam)
export const isValidPhone = (phone) => {
  if (!phone) return false
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
  return phoneRegex.test(phone)
}

// Get status badge class - SỬA LẠI: Dùng Tailwind CSS classes
export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    // Booking status
    confirmed: 'bg-green-100 text-green-800 border border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border border-red-200',
    completed: 'bg-blue-100 text-blue-800 border border-blue-200',
    
    // Payment status
    paid: 'bg-green-100 text-green-800 border border-green-200',
    failed: 'bg-red-100 text-red-800 border border-red-200',
    refunded: 'bg-purple-100 text-purple-800 border border-purple-200',
    
    // Trip status
    scheduled: 'bg-blue-100 text-blue-800 border border-blue-200',
    departed: 'bg-orange-100 text-orange-800 border border-orange-200',
    arrived: 'bg-green-100 text-green-800 border border-green-200',
    cancelled: 'bg-red-100 text-red-800 border border-red-200'
  }
  
  const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full inline-flex items-center'
  return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`
}

// Get status text in Vietnamese
export const getStatusText = (status) => {
  const statusTexts = {
    // Booking status
    confirmed: 'Đã xác nhận',
    pending: 'Chờ xác nhận',
    cancelled: 'Đã hủy',
    completed: 'Đã hoàn thành',
    
    // Payment status
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền',
    
    // Trip status
    scheduled: 'Đã lên lịch',
    departed: 'Đã khởi hành',
    arrived: 'Đã đến nơi',
    cancelled: 'Đã hủy'
  }
  
  return statusTexts[status] || status
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Format số điện thoại
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  // Chuyển 0123456789 thành 0123 456 789
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}

// Chuyển đổi tiếng Việt không dấu
export const removeAccents = (str) => {
  if (!str) return ''
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
}

// Tạo mã màu ngẫu nhiên
export const generateRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Format số với dấu phân cách
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

// Tính phần trăm giảm giá
export const calculateDiscountPercent = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// Kiểm tra xem ngày có phải là hôm nay không
export const isToday = (dateString) => {
  if (!dateString) return false
  const today = new Date()
  const checkDate = new Date(dateString)
  return today.toDateString() === checkDate.toDateString()
}

// Kiểm tra xem ngày có phải là ngày mai không
export const isTomorrow = (dateString) => {
  if (!dateString) return false
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const checkDate = new Date(dateString)
  return tomorrow.toDateString() === checkDate.toDateString()
}

// Lấy tên ngày trong tuần
export const getDayName = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  return days[date.getDay()]
}

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

// Parse query string từ URL
export const parseQueryString = (search) => {
  const params = new URLSearchParams(search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

// Tạo query string từ object
export const createQueryString = (params) => {
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key])
    }
  })
  return searchParams.toString()
}

// Lấy initials từ tên
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format khoảng cách
export const formatDistance = (distanceInKm) => {
  if (!distanceInKm) return ''
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`
  }
  return `${distanceInKm.toFixed(1)} km`
}

// Kiểm tra object rỗng
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

// Delay function
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  calculateDuration,
  isValidEmail,
  isValidPhone,
  getStatusBadgeClass,
  getStatusText,
  debounce,
  formatPhoneNumber,
  removeAccents,
  generateRandomColor,
  formatNumber,
  calculateDiscountPercent,
  isToday,
  isTomorrow,
  getDayName,
  copyToClipboard,
  parseQueryString,
  createQueryString,
  getInitials,
  formatDistance,
  isEmptyObject,
  delay
}