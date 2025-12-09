import api from './api'

const bookingService = {
  // Booking Management
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  getUserBookings: async (filters = {}) => {
    try {
      const response = await api.get('/bookings', { 
        params: {
          page: 1,
          limit: 10,
          sort: 'created_at',
          order: 'desc',
          ...filters
        }
      })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  getBookingDetails: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  getBookingQR: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}/qr`)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  cancelBooking: async (id, reason = '') => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  modifyBooking: async (id, updateData) => {
    try {
      const response = await api.put(`/bookings/${id}`, updateData)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Seat Selection
  getAvailableSeats: async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}/seats`)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  reserveSeats: async (tripId, seats) => {
    try {
      const response = await api.post(`/trips/${tripId}/reserve-seats`, { seats })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  releaseSeats: async (tripId, seats) => {
    try {
      const response = await api.post(`/trips/${tripId}/release-seats`, { seats })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Payment Integration
  createVNPayPayment: async (bookingId, amount) => {
    try {
      const response = await api.post('/payments/vnpay', { 
        booking_id: bookingId, 
        amount 
      })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  createMomoPayment: async (bookingId, amount) => {
    try {
      const response = await api.post('/payments/momo', { 
        booking_id: bookingId, 
        amount 
      })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  createZaloPayPayment: async (bookingId, amount) => {
    try {
      const response = await api.post('/payments/zalopay', { 
        booking_id: bookingId, 
        amount 
      })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  checkPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/status`)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Payment History
  getPaymentHistory: async (filters = {}) => {
    try {
      const response = await api.get('/payments/history', { 
        params: {
          page: 1,
          limit: 10,
          sort: 'created_at',
          order: 'desc',
          ...filters
        }
      })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  getPaymentDetails: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Ticket Management
  downloadTicket: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/ticket`, {
        responseType: 'blob'
      })
      return response
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  sendTicketEmail: async (bookingId) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/send-ticket`)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Booking Analytics
  getBookingStats: async (period = 'month') => {
    try {
      const response = await api.get('/bookings/stats', {
        params: { period }
      })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Refund Management
  requestRefund: async (bookingId, reason) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/refund`, { reason })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  getRefundStatus: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/refund-status`)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Utility Methods
  handleBookingError: (error) => {
    const errorCode = error.response?.data?.code || error.code
    const errorMessage = error.response?.data?.message || error.message
    
    const errorMap = {
      'SEAT_UNAVAILABLE': 'Ghế đã được đặt bởi người khác',
      'TRIP_FULL': 'Chuyến xe đã hết chỗ',
      'TRIP_CANCELLED': 'Chuyến xe đã bị hủy',
      'INVALID_SEAT': 'Ghế không hợp lệ',
      'BOOKING_EXPIRED': 'Đặt chỗ đã hết hạn',
      'PAYMENT_FAILED': 'Thanh toán thất bại',
      'INSUFFICIENT_BALANCE': 'Số dư không đủ',
      'REFUND_NOT_ALLOWED': 'Không thể hoàn tiền cho đặt chỗ này',
      'BOOKING_NOT_FOUND': 'Không tìm thấy thông tin đặt chỗ'
    }

    const defaultMessage = 'Có lỗi xảy ra trong quá trình đặt vé. Vui lòng thử lại.'
    
    return {
      message: errorMap[errorCode] || errorMessage || defaultMessage,
      code: errorCode
    }
  },

  // Quick Booking (One-click)
  quickBook: async (tripId, seatNumbers, passengerInfo) => {
    try {
      const response = await api.post('/bookings/quick', {
        trip_id: tripId,
        seat_numbers: seatNumbers,
        passenger_info: passengerInfo
      })
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  },

  // Group Booking
  createGroupBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings/group', bookingData)
      return response.data
    } catch (error) {
      throw bookingService.handleBookingError(error)
    }
  }
}

export { bookingService }
export default bookingService