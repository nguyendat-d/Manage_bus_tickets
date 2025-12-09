import api, { apiHelper } from './api'

const busCompanyService = {
  // Trip Management
  getTrips: async (params = {}) => {
    try {
      const response = await api.get('/bus-company/trips', { 
        params: {
          page: 1,
          limit: 10,
          sort: 'departure_time',
          order: 'asc',
          ...params
        }
      })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getCompanyTrips: async () => {
    try {
      const response = await api.get('/bus-company/trips')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getTripDetails: async (id) => {
    try {
      const response = await api.get(`/bus-company/trips/${id}`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  createTrip: async (data) => {
    try {
      const response = await api.post('/bus-company/trips', data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  updateTrip: async (id, data) => {
    try {
      const response = await api.put(`/bus-company/trips/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  deleteTrip: async (id) => {
    try {
      const response = await api.delete(`/bus-company/trips/${id}`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getUpcomingTrips: async () => {
    try {
      const response = await api.get('/bus-company/trips/upcoming')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  cancelTrip: async (id, reason) => {
    try {
      const response = await api.post(`/bus-company/trips/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Bus Management
  getBuses: async () => {
    try {
      const response = await api.get('/bus-company/buses')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getBusDetails: async (id) => {
    try {
      const response = await api.get(`/bus-company/buses/${id}`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  createBus: async (data) => {
    try {
      const response = await api.post('/bus-company/buses', data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  updateBus: async (id, data) => {
    try {
      const response = await api.put(`/bus-company/buses/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  deleteBus: async (id) => {
    try {
      const response = await api.delete(`/bus-company/buses/${id}`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getBusStats: async () => {
    try {
      const response = await api.get('/bus-company/buses/stats')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  setBusMaintenance: async (id, maintenanceData) => {
    try {
      const response = await api.post(`/bus-company/buses/${id}/maintenance`, maintenanceData)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Booking Management
  getBookings: async (params = {}) => {
    try {
      const response = await api.get('/bus-company/bookings', { 
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
      throw this.handleCompanyError(error)
    }
  },

  getBookingDetails: async (id) => {
    try {
      const response = await api.get(`/bus-company/bookings/${id}`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getRecentBookings: async () => {
    try {
      const response = await api.get('/bus-company/bookings/recent')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  confirmBooking: async (id) => {
    try {
      const response = await api.post(`/bus-company/bookings/${id}/confirm`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  cancelBooking: async (id, reason = '') => {
    try {
      const response = await api.post(`/bus-company/bookings/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Statistics & Analytics
  getStats: async (dateRange = 'month') => {
    try {
      const response = await api.get('/bus-company/stats', { 
        params: { range: dateRange } 
      })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getCompanyStats: async () => {
    try {
      const response = await api.get('/bus-company/stats/company')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getRevenueStats: async (dateRange = 'month') => {
    try {
      const response = await api.get('/bus-company/stats/revenue', { 
        params: { range: dateRange } 
      })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  getOccupancyStats: async (dateRange = 'month') => {
    try {
      const response = await api.get('/bus-company/stats/occupancy', { 
        params: { range: dateRange } 
      })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Company Information
  getCompanyInfo: async () => {
    try {
      const response = await api.get('/bus-company/info')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  updateCompanyInfo: async (data) => {
    try {
      const response = await api.put('/bus-company/info', data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  uploadCompanyLogo: async (logoFile, onProgress) => {
    try {
      const formData = new FormData()
      formData.append('logo', logoFile)
      
      const response = await apiHelper.upload('/bus-company/logo', formData, onProgress)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Driver Management
  getDrivers: async () => {
    try {
      const response = await api.get('/bus-company/drivers')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  createDriver: async (data) => {
    try {
      const response = await api.post('/bus-company/drivers', data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  updateDriver: async (id, data) => {
    try {
      const response = await api.put(`/bus-company/drivers/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  deleteDriver: async (id) => {
    try {
      const response = await api.delete(`/bus-company/drivers/${id}`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Route Management
  getCompanyRoutes: async () => {
    try {
      const response = await api.get('/bus-company/routes')
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  createRoute: async (data) => {
    try {
      const response = await api.post('/bus-company/routes', data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  updateRoute: async (id, data) => {
    try {
      const response = await api.put(`/bus-company/routes/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  deleteRoute: async (id) => {
    try {
      const response = await api.delete(`/bus-company/routes/${id}`)
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Reports
  generateBookingReport: async (params = {}) => {
    try {
      const response = await api.get('/bus-company/reports/bookings', { params })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  downloadRevenueReport: async (params = {}) => {
    try {
      const response = await apiHelper.download('/bus-company/reports/revenue', params)
      return response
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  // Utility Methods
  handleCompanyError: (error) => {
    const errorMap = {
      'COMPANY_NOT_APPROVED': 'Công ty chưa được phê duyệt',
      'TRIP_CONFLICT': 'Lịch trình bị trùng với chuyến khác',
      'BUS_UNAVAILABLE': 'Xe không khả dụng',
      'DRIVER_UNAVAILABLE': 'Tài xế không khả dụng',
      'INSUFFICIENT_PERMISSIONS': 'Không đủ quyền thực hiện thao tác',
      'COMPANY_SUSPENDED': 'Công ty đã bị tạm ngưng hoạt động',
      'ROUTE_NOT_FOUND': 'Tuyến đường không tồn tại'
    }

    const errorCode = error.data?.code || error.code
    const defaultMessage = 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại.'
    
    return {
      ...error,
      message: errorMap[errorCode] || error.message || defaultMessage,
      code: errorCode
    }
  },

  // Bulk Operations
  bulkUpdateTrips: async (tripIds, updateData) => {
    try {
      const response = await api.put('/bus-company/trips/bulk-update', {
        trip_ids: tripIds,
        ...updateData
      })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  },

  bulkCancelTrips: async (tripIds, reason) => {
    try {
      const response = await api.post('/bus-company/trips/bulk-cancel', {
        trip_ids: tripIds,
        reason
      })
      return response.data
    } catch (error) {
      throw this.handleCompanyError(error)
    }
  }
}

export { busCompanyService }
export default busCompanyService