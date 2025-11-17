// Format tiền tệ
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Format ngày giờ
export const formatDateTime = (dateString, options = {}) => {
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
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Tính thời gian di chuyển
export const calculateDuration = (start, end) => {
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Vietnam)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
  return phoneRegex.test(phone)
}

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    confirmed: 'badge-success',
    pending: 'badge-warning',
    paid: 'badge-success',
    failed: 'badge-error',
    cancelled: 'badge-error',
    scheduled: 'badge-info',
    departed: 'badge-warning',
    arrived: 'badge-success'
  }
  return statusClasses[status] || 'badge-info'
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