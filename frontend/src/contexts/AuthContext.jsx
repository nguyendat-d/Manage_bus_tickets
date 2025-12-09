import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../pages/services/auth'

const AuthContext = createContext()

export { AuthContext }

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [refreshTimeout, setRefreshTimeout] = useState(null)
  const [lastRegisterTime, setLastRegisterTime] = useState(0)
  const [isRegistering, setIsRegistering] = useState(false)

  const showAuthNotification = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}]: ${message}`)
  }

  useEffect(() => {
    if (token) {
      verifyToken()
      scheduleTokenRefresh()
    } else {
      setLoading(false)
    }

    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
    }
  }, [token])

  const scheduleTokenRefresh = () => {
    const refreshTime = 25 * 60 * 1000
    
    const timeout = setTimeout(() => {
      refreshToken()
    }, refreshTime)
    
    setRefreshTimeout(timeout)
  }

  const verifyToken = async () => {
    try {
      setLoading(true)
      const response = await authService.verifyToken()
      setUser(response.data.user)
    } catch (error) {
      console.error('Token verification failed:', error)
      if (error.response?.status === 401) {
        logout(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      const { token: newToken } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      scheduleTokenRefresh()
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout(false)
    }
  }

  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      const { token: newToken, user } = response.data
      
      if (rememberMe) {
        localStorage.setItem('token', newToken)
      } else {
        sessionStorage.setItem('token', newToken)
      }
      
      setToken(newToken)
      setUser(user)
      scheduleTokenRefresh()
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Đăng nhập thất bại'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    // Kiểm tra nếu đang trong quá trình đăng ký
    if (isRegistering) {
      return { success: false, message: 'Đang xử lý đăng ký, vui lòng đợi...' }
    }

    // Kiểm tra rate limiting - ít nhất 10 giây giữa các lần đăng ký
    const now = Date.now()
    const timeSinceLastRegister = now - lastRegisterTime
    
    if (timeSinceLastRegister < 10000) {
      const waitTime = Math.ceil((10000 - timeSinceLastRegister) / 1000)
      return { 
        success: false, 
        message: `Vui lòng đợi ${waitTime} giây trước khi thử đăng ký lại` 
      }
    }

    try {
      setIsRegistering(true)
      setLastRegisterTime(now)
      setLoading(true)
      
      console.log('📤 Đang gửi dữ liệu đăng ký:', userData)
      
      // THÊM: Đợi 2 giây để tránh spam
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // SỬA: Dùng try-catch ở đây để bắt lỗi từ authService
      const response = await authService.register(userData)
      
      console.log('✅ Phản hồi từ authService:', response)
      
      // Kiểm tra nếu response là error object (từ mock)
      if (response && typeof response === 'object') {
        if (response.success === false) {
          return { 
            success: false, 
            message: response.message || 'Đăng ký thất bại'
          }
        }
        
        if (response.success === true) {
          return { 
            success: true,
            message: response.message || 'Đăng ký thành công',
            data: response.data
          }
        }
      }
      
      // Nếu response có cấu trúc API thật
      return { 
        success: response.success,
        message: response.message || 'Đăng ký thành công',
        data: response.data
      }
    } catch (error) {
      console.error('❌ Lỗi đăng ký trong AuthContext:', error)
      
      // Xử lý lỗi rate limiting
      if (error.status === 429 || error.code === 'TOO_MANY_REQUESTS' || error.message?.includes('429')) {
        return { 
          success: false, 
          message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi 10 phút trước khi thử lại.' 
        }
      }
      
      // Xử lý lỗi khác
      const message = error.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      return { success: false, message }
    } finally {
      setLoading(false)
      // Reset sau 3 giây
      setTimeout(() => {
        setIsRegistering(false)
      }, 3000)
    }
  }

  const logout = async (shouldShowNotification = true) => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      setToken(null)
      setUser(null)
      
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
        setRefreshTimeout(null)
      }
      
      if (shouldShowNotification) {
        showAuthNotification('Đã đăng xuất thành công', 'info')
      }
    }
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      setUser(prev => ({ ...prev, ...response.data.user }))
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật thất bại'
      return { success: false, message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Đổi mật khẩu thất bại'
      return { success: false, message }
    }
  }

  const requestPasswordReset = async (email) => {
    try {
      await authService.forgotPassword(email)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Gửi email thất bại'
      return { success: false, message }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Đặt lại mật khẩu thất bại'
      return { success: false, message }
    }
  }

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await authService.verifyEmail(verificationToken)
      setUser(prev => ({ ...prev, isVerified: true }))
      return { success: true, user: response.data.user }
    } catch (error) {
      const message = error.response?.data?.message || 'Xác thực email thất bại'
      return { success: false, message }
    }
  }

  const resendVerificationEmail = async () => {
    try {
      await authService.resendVerificationEmail()
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Gửi email thất bại'
      return { success: false, message }
    }
  }

  const hasPermission = (permission) => {
    if (!user?.permissions) return false
    return user.permissions.includes(permission)
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const value = {
    // State
    user,
    token,
    loading,
    
    // Authentication methods
    login,
    register,
    logout,
    
    // Profile management
    updateProfile,
    changePassword,
    
    // Password reset
    requestPasswordReset,
    resetPassword,
    
    // Email verification
    verifyEmail,
    resendVerificationEmail,
    
    // Utility functions
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBusCompany: user?.role === 'bus_company',
    isPassenger: user?.role === 'passenger',
    isVerified: user?.isVerified,
    
    // Role and permission checks
    hasPermission,
    hasRole,
    
    // User status
    getUserStatus: () => {
      if (!user) return 'anonymous'
      if (!user.isVerified) return 'unverified'
      return 'active'
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}