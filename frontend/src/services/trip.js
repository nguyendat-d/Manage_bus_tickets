import api from './api'

export const tripService = {
  searchTrips: (filters) => {
    return api.get('/trips/search', { params: filters })
  },

  getTripDetail: (id) => {
    return api.get(`/trips/${id}`)
  },

  getSeatMap: (id) => {
    return api.get(`/trips/${id}/seat-map`)
  },

  createTrip: (tripData) => {
    return api.post('/trips', tripData)
  },

  getCompanyTrips: (filters = {}) => {
    return api.get('/bus-companies/trips', { params: filters })
  }
}