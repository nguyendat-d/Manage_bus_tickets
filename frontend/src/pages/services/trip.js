import api, { apiHelper } from './api'

const tripService = {
  // Trip Search & Discovery
  searchTrips: async (filters = {}) => {
    try {
      const response = await api.get('/trips/search', { 
        params: {
          page: 1,
          limit: 12,
          sort: 'departure_time',
          order: 'asc',
          ...filters
        }
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getTripDetail: async (id) => {
    try {
      const response = await api.get(`/trips/${id}`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getSeatMap: async (id) => {
    try {
      const response = await api.get(`/trips/${id}/seat-map`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Creation & Management
  createTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getCompanyTrips: async (filters = {}) => {
    try {
      const response = await api.get('/bus-companies/trips', { 
        params: {
          page: 1,
          limit: 10,
          ...filters
        }
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  updateTrip: async (id, tripData) => {
    try {
      const response = await api.put(`/trips/${id}`, tripData)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  deleteTrip: async (id) => {
    try {
      const response = await api.delete(`/trips/${id}`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Availability & Pricing
  checkAvailability: async (tripId, date, passengers = 1) => {
    try {
      const response = await api.get(`/trips/${tripId}/availability`, {
        params: { date, passengers }
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getPriceBreakdown: async (tripId, passengers, extras = {}) => {
    try {
      const response = await api.post(`/trips/${tripId}/price`, {
        passengers,
        extras
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Popular & Recommended Trips
  getPopularTrips: async (limit = 6) => {
    try {
      const response = await api.get('/trips/popular', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getRecommendedTrips: async (filters = {}) => {
    try {
      const response = await api.get('/trips/recommended', { params: filters })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Reviews & Ratings
  getTripReviews: async (tripId, params = {}) => {
    try {
      const response = await api.get(`/trips/${tripId}/reviews`, { 
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
      throw this.handleTripError(error)
    }
  },

  createReview: async (tripId, reviewData) => {
    try {
      const response = await api.post(`/trips/${tripId}/reviews`, reviewData)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getCompanyRating: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/rating`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Amenities & Features
  getTripAmenities: async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}/amenities`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getAvailableAmenities: async () => {
    try {
      const response = await api.get('/trips/amenities')
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Categories & Types
  getTripCategories: async () => {
    try {
      const response = await api.get('/trips/categories')
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getTripsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/trips/category/${category}`, { params })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Schedule & Timetable
  getTripSchedule: async (routeId, date) => {
    try {
      const response = await api.get(`/routes/${routeId}/schedule`, {
        params: { date }
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getWeeklySchedule: async (routeId, weekStart) => {
    try {
      const response = await api.get(`/routes/${routeId}/weekly-schedule`, {
        params: { week_start: weekStart }
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Route Information
  getRouteDetails: async (routeId) => {
    try {
      const response = await api.get(`/routes/${routeId}`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  getPopularRoutes: async (limit = 8) => {
    try {
      const response = await api.get('/routes/popular', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Notifications
  subscribeToTripUpdates: async (tripId) => {
    try {
      const response = await api.post(`/trips/${tripId}/subscribe`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  unsubscribeFromTripUpdates: async (tripId) => {
    try {
      const response = await api.delete(`/trips/${tripId}/subscribe`)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Utility Methods
  handleTripError: (error) => {
    const errorMap = {
      'TRIP_NOT_FOUND': 'Không tìm thấy thông tin chuyến xe',
      'TRIP_CANCELLED': 'Chuyến xe đã bị hủy',
      'TRIP_FULL': 'Chuyến xe đã hết chỗ',
      'INVALID_DATE': 'Ngày không hợp lệ',
      'ROUTE_NOT_FOUND': 'Tuyến đường không tồn tại',
      'COMPANY_NOT_FOUND': 'Nhà xe không tồn tại',
      'SEAT_MAP_UNAVAILABLE': 'Sơ đồ ghế không khả dụng',
      'PRICE_CALCULATION_ERROR': 'Lỗi tính giá vé'
    }

    const errorCode = error.data?.code || error.code
    const defaultMessage = 'Có lỗi xảy ra khi tải thông tin chuyến xe. Vui lòng thử lại.'
    
    return {
      ...error,
      message: errorMap[errorCode] || error.message || defaultMessage,
      code: errorCode
    }
  },

  // Advanced Search
  advancedSearch: async (searchCriteria) => {
    try {
      const response = await api.post('/trips/advanced-search', searchCriteria)
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  },

  // Trip Comparison
  compareTrips: async (tripIds) => {
    try {
      const response = await api.post('/trips/compare', { trip_ids: tripIds })
      return response.data
    } catch (error) {
      throw this.handleTripError(error)
    }
  }
}

export { tripService }
export default tripService