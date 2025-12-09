import api, { apiHelper } from './api'

const adminService = {
  // Company Management
  getCompanies: async (params = {}) => {
    try {
      const response = await api.get('/admin/companies', { 
        params: {
          page: 1,
          limit: 10,
          ...params
        }
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getCompany: async (id) => {
    try {
      const response = await api.get(`/admin/companies/${id}`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  createCompany: async (data) => {
    try {
      const response = await api.post('/admin/companies', data)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  updateCompany: async (id, data) => {
    try {
      const response = await api.put(`/admin/companies/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await api.delete(`/admin/companies/${id}`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  approveCompany: async (id) => {
    try {
      const response = await api.post(`/admin/companies/${id}/approve`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  rejectCompany: async (id, reason) => {
    try {
      const response = await api.post(`/admin/companies/${id}/reject`, { reason })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  suspendCompany: async (id, reason) => {
    try {
      const response = await api.post(`/admin/companies/${id}/suspend`, { reason })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // Route Management
  getRoutes: async (params = {}) => {
    try {
      const response = await api.get('/admin/routes', {
        params: {
          page: 1,
          limit: 10,
          ...params
        }
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getRoute: async (id) => {
    try {
      const response = await api.get(`/admin/routes/${id}`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  createRoute: async (data) => {
    try {
      const response = await api.post('/admin/routes', data)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  updateRoute: async (id, data) => {
    try {
      const response = await api.put(`/admin/routes/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  deleteRoute: async (id) => {
    try {
      const response = await api.delete(`/admin/routes/${id}`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // User Management
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          page: 1,
          limit: 10,
          ...params
        }
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getUser: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  suspendUser: async (id, reason) => {
    try {
      const response = await api.post(`/admin/users/${id}/suspend`, { reason })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // Statistics & Analytics
  getStats: async (dateRange = 'month') => {
    try {
      const response = await api.get('/admin/stats', { 
        params: { range: dateRange } 
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getRecentBookings: async (limit = 10) => {
    try {
      const response = await api.get('/admin/bookings/recent', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getTopRoutes: async (limit = 5) => {
    try {
      const response = await api.get('/admin/routes/top', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getRevenueStats: async (period = 'monthly') => {
    try {
      const response = await api.get('/admin/stats/revenue', {
        params: { period }
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // Reports
  generateReport: async (type, params = {}) => {
    try {
      const response = await api.get(`/admin/reports/${type}`, { params })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  downloadReport: async (type, params = {}) => {
    try {
      const response = await apiHelper.download(`/admin/reports/${type}/download`, params)
      return response
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // System Settings
  getSystemSettings: async () => {
    try {
      const response = await api.get('/admin/settings')
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  updateSystemSettings: async (settings) => {
    try {
      const response = await api.put('/admin/settings', settings)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // Audit Logs
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/audit-logs', {
        params: {
          page: 1,
          limit: 10,
          ...params
        }
      })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // Backup & Maintenance
  createBackup: async () => {
    try {
      const response = await api.post('/admin/backup')
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  getBackups: async () => {
    try {
      const response = await api.get('/admin/backups')
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  restoreBackup: async (backupId) => {
    try {
      const response = await api.post(`/admin/backups/${backupId}/restore`)
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  // Utility Methods
  handleAdminError: (error) => {
    const errorMap = {
      'UNAUTHORIZED': 'Bạn không có quyền truy cập tính năng này',
      'COMPANY_NOT_FOUND': 'Công ty không tồn tại',
      'USER_NOT_FOUND': 'Người dùng không tồn tại',
      'ROUTE_NOT_FOUND': 'Tuyến đường không tồn tại',
      'INVALID_DATA': 'Dữ liệu không hợp lệ',
      'OPERATION_NOT_ALLOWED': 'Thao tác không được phép'
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
  bulkApproveCompanies: async (companyIds) => {
    try {
      const response = await api.post('/admin/companies/bulk-approve', { companyIds })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  },

  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await api.post('/admin/users/bulk-delete', { userIds })
      return response.data
    } catch (error) {
      throw this.handleAdminError(error)
    }
  }
}

export { adminService }
export default adminService