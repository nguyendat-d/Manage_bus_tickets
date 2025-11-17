import api from './api'

export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  logout: () => {
    return api.post('/auth/logout')
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email })
  },

  resetPassword: (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword })
  },

  verifyToken: () => {
    return api.get('/auth/verify')
  },

  getProfile: () => {
    return api.get('/users/profile')
  },

  updateProfile: (userData) => {
    return api.put('/users/profile', userData)
  },

  changePassword: (currentPassword, newPassword) => {
    return api.put('/users/change-password', { currentPassword, newPassword })
  }
}