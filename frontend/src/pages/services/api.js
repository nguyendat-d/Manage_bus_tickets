import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to avoid caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    const originalRequest = error.config
    
    // Handle token expiration - 401 Unauthorized
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Clear auth data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      
      // Don't redirect if already on login page
      if (!window.location.pathname.includes('/login')) {
        // Store current location for redirect back after login
        const returnUrl = window.location.pathname + window.location.search
        sessionStorage.setItem('returnUrl', returnUrl)
        
        // Redirect to login
        window.location.href = '/login'
      }
      
      return Promise.reject({
        status: 401,
        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        code: 'TOKEN_EXPIRED'
      })
    }
    
    // Handle 403 Forbidden
    if (response?.status === 403) {
      return Promise.reject({
        status: 403,
        message: 'Bạn không có quyền truy cập tài nguyên này.',
        code: 'FORBIDDEN'
      })
    }
    
    // Handle 404 Not Found
    if (response?.status === 404) {
      return Promise.reject({
        status: 404,
        message: 'Tài nguyên không tồn tại.',
        code: 'NOT_FOUND'
      })
    }
    
    // Handle 500 Internal Server Error
    if (response?.status === 500) {
      return Promise.reject({
        status: 500,
        message: 'Lỗi máy chủ. Vui lòng thử lại sau.',
        code: 'SERVER_ERROR'
      })
    }
    
    // Handle network errors
    if (!response) {
      return Promise.reject({
        status: 0,
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
        code: 'NETWORK_ERROR'
      })
    }
    
    // Handle validation errors
    if (response?.status === 400) {
      return Promise.reject({
        status: 400,
        message: response.data?.message || 'Dữ liệu không hợp lệ.',
        data: response.data,
        code: response.data?.code || 'VALIDATION_ERROR'
      })
    }
    
    // Default error
    return Promise.reject({
      status: response?.status,
      message: response?.data?.message || error.message || 'Có lỗi xảy ra',
      data: response?.data,
      code: response?.data?.code
    })
  }
)

// Helper methods for common operations
export const apiHelper = {
  // File upload with progress
  upload: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
  },
  
  // Download file
  download: (url, params = {}) => {
    return api.get(url, {
      params,
      responseType: 'blob'
    })
  },
  
  // Cancel token for request cancellation
  createCancelToken: () => {
    return axios.CancelToken.source()
  }
}

export default api