import { useContext, useCallback } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    isAuthenticated,
    isAdmin,
    isBusCompany,
    isPassenger,
    isVerified,
    hasPermission,
    hasRole,
    getUserStatus
  } = context

  // Enhanced login with remember me
  const loginWithRemember = useCallback(async (email, password, rememberMe = false) => {
    return login(email, password, rememberMe)
  }, [login])

  // Quick role check methods
  const canAccess = useCallback((requiredRole, requiredPermissions = []) => {
    if (requiredRole && !hasRole(requiredRole)) {
      return false
    }
    
    if (requiredPermissions.length > 0) {
      return requiredPermissions.every(permission => hasPermission(permission))
    }
    
    return true
  }, [hasRole, hasPermission])

  // Check if user can perform action
  const can = useCallback((action, resource) => {
    const permission = `${action}:${resource}`
    return hasPermission(permission)
  }, [hasPermission])

  // Get user display name
  const getDisplayName = useCallback(() => {
    return user?.fullName || user?.email?.split('@')[0] || 'Người dùng'
  }, [user])

  // Get user avatar
  const getAvatar = useCallback(() => {
    if (user?.avatar) return user.avatar
    
    // Generate initial avatar as fallback
    const initial = getDisplayName().charAt(0).toUpperCase()
    return `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff&bold=true`
  }, [user, getDisplayName])

  // Check if user profile is complete
  const isProfileComplete = useCallback(() => {
    if (!user) return false
    
    const requiredFields = ['fullName', 'email', 'phone']
    return requiredFields.every(field => user[field] && user[field].trim())
  }, [user])

  // Get user role display name
  const getRoleDisplayName = useCallback(() => {
    const roles = {
      'admin': 'Quản trị viên',
      'bus_company': 'Nhà xe',
      'passenger': 'Hành khách',
      'user': 'Người dùng'
    }
    return roles[user?.role] || user?.role || 'Người dùng'
  }, [user])

  // Check if user needs to complete profile
  const needsProfileCompletion = useCallback(() => {
    return isAuthenticated && !isProfileComplete()
  }, [isAuthenticated, isProfileComplete])

  // Enhanced logout with confirmation
  const logoutWithConfirmation = useCallback(async (showConfirmation = true) => {
    if (showConfirmation) {
      const confirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất?')
      if (!confirmed) return
    }
    
    return logout(false) // Don't show notification in context
  }, [logout])

  return {
    // Core state
    user,
    token,
    loading,
    
    // Authentication methods
    login: loginWithRemember,
    register,
    logout: logoutWithConfirmation,
    
    // Profile management
    updateProfile,
    changePassword,
    
    // Password reset
    requestPasswordReset,
    resetPassword,
    
    // Email verification
    verifyEmail,
    resendVerificationEmail,
    
    // Status checks
    isAuthenticated,
    isAdmin,
    isBusCompany,
    isPassenger,
    isVerified,
    
    // Permission checks
    hasPermission,
    hasRole,
    canAccess,
    can,
    
    // User info utilities
    getDisplayName,
    getAvatar,
    getRoleDisplayName,
    isProfileComplete,
    needsProfileCompletion,
    getUserStatus,
    
    // User data shortcuts
    userId: user?.id,
    userEmail: user?.email,
    userPhone: user?.phone,
    userRole: user?.role,
    userCreatedAt: user?.createdAt,
    
    // Quick status checks
    isAnonymous: !isAuthenticated,
    isPendingVerification: isAuthenticated && !isVerified,
    isActive: isAuthenticated && isVerified,
    
    // Feature flags based on role/permissions
    canManageUsers: can('manage', 'users'),
    canManageBookings: can('manage', 'bookings'),
    canManageCompanies: can('manage', 'companies'),
    canViewAnalytics: can('view', 'analytics')
  }
}

// Hook for role-based access control
export const useRole = (requiredRole) => {
  const { hasRole, isAuthenticated } = useAuth()
  
  return isAuthenticated && hasRole(requiredRole)
}

// Hook for permission-based access control
export const usePermission = (requiredPermission) => {
  const { hasPermission, isAuthenticated } = useAuth()
  
  return isAuthenticated && hasPermission(requiredPermission)
}

// Hook for feature flags
export const useFeature = (feature) => {
  const { user } = useAuth()
  
  const features = user?.features || []
  return features.includes(feature)
}