import api, { apiHelper } from './api'

// ĐỊNH NGHĨA HÀM handleAuthError TRƯỚC
const handleAuthError = (error) => {
  // Map specific error codes to user-friendly messages
  const errorMap = {
    'INVALID_CREDENTIALS': 'Email hoặc mật khẩu không chính xác',
    'USER_NOT_FOUND': 'Tài khoản không tồn tại',
    'USER_DISABLED': 'Tài khoản đã bị vô hiệu hóa',
    'EMAIL_EXISTS': 'Email đã được sử dụng',
    'INVALID_TOKEN': 'Phiên đăng nhập đã hết hạn',
    'WEAK_PASSWORD': 'Mật khẩu quá yếu',
    'PASSWORD_MISMATCH': 'Mật khẩu hiện tại không chính xác',
    'TOO_MANY_REQUESTS': 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
  }

  const errorCode = error.response?.data?.code || error.code
  const defaultMessage = 'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.'
  
  const friendlyError = new Error(errorMap[errorCode] || error.response?.data?.message || error.message || defaultMessage)
  friendlyError.code = errorCode
  friendlyError.status = error.response?.status
  friendlyError.originalError = error
  
  return friendlyError
}

// ĐỊNH NGHĨA HÀM clearAuthData
const clearAuthData = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete api.defaults.headers.common['Authorization']
}

const authService = {
  // Authentication
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { token, user } = response.data.data
        
        // Store token and user data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      return response.data
    } catch (error) {
      throw handleAuthError(error) // SỬA: dùng hàm trực tiếp
    }
  },

  register: async (userData) => {
    try {
      console.log('📤 Sending register request:', userData)
      
      // TẠM THỜI: Dùng mock để test UI
      // BỎ COMMENT DÒNG NÀY ĐỂ TEST VỚI MOCK
      return await mockRegister(userData)
      
      /*
      // COMMENT CODE THẬT TẠM THỜI
      const response = await api.post('/auth/register', userData)
      console.log('✅ Register response:', response.data)
      return response.data
      */
    } catch (error) {
      console.error('❌ Register error:', error)
      throw handleAuthError(error) // SỬA: dùng hàm trực tiếp
    }
  },

  logout: async () => {
    try {
      // Call logout API
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error) {
      console.error('Logout error:', error)
      // Vẫn trả về success để tiếp tục logout local
      return { success: true, message: 'Logout completed locally' }
    } finally {
      // Always clear local storage
      clearAuthData() // SỬA: dùng hàm trực tiếp
    }
  },

  verifyEmail: async (verificationToken) => {
    try {
      const response = await api.post('/auth/verify-email', { token: verificationToken })
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  resendVerificationEmail: async () => {
    try {
      const response = await api.post('/auth/resend-verification')
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await api.get('/auth/verify')
      return response.data
    } catch (error) {
      clearAuthData()
      throw handleAuthError(error)
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh')
      
      if (response.data.success) {
        const { token } = response.data.data
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      return response.data
    } catch (error) {
      clearAuthData()
      throw handleAuthError(error)
    }
  },

  // Profile Management
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData)
      
      // Update local user data if successful
      if (response.data.success) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, ...response.data.data }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  updateAvatar: async (avatarFile, onProgress) => {
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      
      const response = await apiHelper.upload('/users/avatar', formData, onProgress)
      
      // Update local user data
      if (response.data.success) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, avatar_url: response.data.data.avatar_url }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/users/change-password', { 
        currentPassword, 
        newPassword 
      })
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  // Social Auth
  socialLogin: async (provider, accessToken) => {
    try {
      const response = await api.post('/auth/social', { provider, accessToken })
      
      if (response.data.success) {
        const { token, user } = response.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  // Two-Factor Authentication
  enable2FA: async () => {
    try {
      const response = await api.post('/auth/2fa/enable')
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  verify2FA: async (code) => {
    try {
      const response = await api.post('/auth/2fa/verify', { code })
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  disable2FA: async () => {
    try {
      const response = await api.post('/auth/2fa/disable')
      return response.data
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  // Utility Methods - SỬA: dùng hàm đã định nghĩa
  clearAuthData: clearAuthData,

  getStoredUser: () => {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Thêm method để test
  handleAuthError: handleAuthError
}

// THÊM HÀM MOCK ĐỂ TEST
const mockRegister = async (userData) => {
  console.log('🔄 Mock register called with:', {
    email: userData.email,
    role: userData.role,
    name: userData.full_name
  })
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock SUCCESS để test flow
  // Hoặc mock ERROR để test error handling (đổi thành false)
  const shouldSucceed = true
  
  if (shouldSucceed) {
    return {
      success: true,
      message: 'Đăng ký thành công! Vui lòng đăng nhập.',
      data: null
    }
  } else {
    // Mock các lỗi khác nhau để test
    const errors = [
      'Email đã được sử dụng',
      'Số điện thoại đã tồn tại',
      'Mật khẩu không đủ mạnh',
      'Thông tin không hợp lệ'
    ]
    const randomError = errors[Math.floor(Math.random() * errors.length)]
    
    return {
      success: false,
      message: randomError,
      data: null
    }
  }
}

export { authService }
export default authService