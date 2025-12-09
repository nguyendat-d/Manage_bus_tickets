import api, { apiHelper } from './api'

const userService = {
  // Profile Management
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/users/profile', data)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/users/change-password', { 
        currentPassword, 
        newPassword 
      })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  uploadAvatar: async (file, onProgress) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await apiHelper.upload('/users/avatar', formData, onProgress)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  deleteAvatar: async () => {
    try {
      const response = await api.delete('/users/avatar')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Booking Management
  getMyBookings: async (params = {}) => {
    try {
      const response = await api.get('/users/bookings', { 
        params: {
          page: 1,
          limit: 10,
          sort: 'created_at',
          order: 'desc',
          ...params
        }
      })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  getBookingDetails: async (id) => {
    try {
      const response = await api.get(`/users/bookings/${id}`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  cancelBooking: async (id, reason = '') => {
    try {
      const response = await api.post(`/users/bookings/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  downloadTicket: async (id) => {
    try {
      const response = await apiHelper.download(`/users/bookings/${id}/ticket`)
      return response
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  sendTicketToEmail: async (id) => {
    try {
      const response = await api.post(`/users/bookings/${id}/send-ticket`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Favorites & Saved Trips
  getSavedTrips: async () => {
    try {
      const response = await api.get('/users/saved-trips')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  saveTrip: async (tripId) => {
    try {
      const response = await api.post('/users/saved-trips', { tripId })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  removeSavedTrip: async (tripId) => {
    try {
      const response = await api.delete(`/users/saved-trips/${tripId}`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  checkTripSaved: async (tripId) => {
    try {
      const response = await api.get(`/users/saved-trips/${tripId}/check`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Preferences
  getPreferences: async () => {
    try {
      const response = await api.get('/users/preferences')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  updatePreferences: async (data) => {
    try {
      const response = await api.put('/users/preferences', data)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/users/notifications', { 
        params: {
          page: 1,
          limit: 20,
          ...params
        }
      })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/users/notifications/unread')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      const response = await api.put(`/users/notifications/${id}/read`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const response = await api.put('/users/notifications/read-all')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/users/notifications/${id}`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/users/notification-settings', settings)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Loyalty & Rewards
  getLoyaltyPoints: async () => {
    try {
      const response = await api.get('/users/loyalty/points')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  getLoyaltyHistory: async (params = {}) => {
    try {
      const response = await api.get('/users/loyalty/history', { params })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  getRewards: async () => {
    try {
      const response = await api.get('/users/rewards')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  claimReward: async (rewardId) => {
    try {
      const response = await api.post(`/users/rewards/${rewardId}/claim`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Payment Methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/users/payment-methods')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  addPaymentMethod: async (paymentData) => {
    try {
      const response = await api.post('/users/payment-methods', paymentData)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  removePaymentMethod: async (methodId) => {
    try {
      const response = await api.delete(`/users/payment-methods/${methodId}`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  setDefaultPaymentMethod: async (methodId) => {
    try {
      const response = await api.put(`/users/payment-methods/${methodId}/default`)
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Travel History & Statistics
  getTravelHistory: async (params = {}) => {
    try {
      const response = await api.get('/users/travel-history', { params })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  getTravelStats: async () => {
    try {
      const response = await api.get('/users/travel-stats')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Account Management
  deactivateAccount: async (reason) => {
    try {
      const response = await api.post('/users/deactivate', { reason })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  exportData: async () => {
    try {
      const response = await apiHelper.download('/users/export-data')
      return response
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Utility Methods
  handleUserError: (error) => {
    const errorMap = {
      'USER_NOT_FOUND': 'Không tìm thấy thông tin người dùng',
      'INVALID_PASSWORD': 'Mật khẩu hiện tại không chính xác',
      'EMAIL_EXISTS': 'Email đã được sử dụng',
      'PHONE_EXISTS': 'Số điện thoại đã được sử dụng',
      'INVALID_AVATAR': 'Ảnh đại diện không hợp lệ',
      'BOOKING_NOT_FOUND': 'Không tìm thấy thông tin đặt chỗ',
      'NOTIFICATION_NOT_FOUND': 'Không tìm thấy thông báo',
      'REWARD_ALREADY_CLAIMED': 'Phần thưởng đã được nhận'
    }

    const errorCode = error.data?.code || error.code
    const defaultMessage = 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại.'
    
    return {
      ...error,
      message: errorMap[errorCode] || error.message || defaultMessage,
      code: errorCode
    }
  },

  // Quick Actions
  getQuickStats: async () => {
    try {
      const response = await api.get('/users/quick-stats')
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  },

  // Recent Activity
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get('/users/recent-activity', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw this.handleUserError(error)
    }
  }
}

export default userService