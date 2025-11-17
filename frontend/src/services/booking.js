import api from './api'

export const bookingService = {
  createBooking: (bookingData) => {
    return api.post('/bookings', bookingData)
  },

  getUserBookings: (filters = {}) => {
    return api.get('/bookings', { params: filters })
  },

  getBookingQR: (id) => {
    return api.get(`/bookings/${id}/qr`)
  },

  cancelBooking: (id, reason) => {
    return api.put(`/bookings/${id}/cancel`, { reason })
  },

  createVNPayPayment: (bookingId, amount) => {
    return api.post('/payments/vnpay', { booking_id: bookingId, amount })
  },

  getPaymentHistory: (filters = {}) => {
    return api.get('/payments/history', { params: filters })
  }
}