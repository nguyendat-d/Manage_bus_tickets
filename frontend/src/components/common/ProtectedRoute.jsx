import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'
import { Shield, AlertCircle, Lock } from 'lucide-react'

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermissions = [],
  fallbackPath = null,
  showUnauthorized = true 
}) => {
  const { isAuthenticated, loading, user, hasPermission } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Đang kiểm tra quyền truy cập..." 
        />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Store the attempted URL for redirecting after login
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole) {
    if (showUnauthorized) {
      return <UnauthorizedPage 
        message="Bạn không có quyền truy cập trang này" 
        requiredRole={requiredRole}
        userRole={user?.role}
      />
    }
    return <Navigate to={fallbackPath || '/'} replace />
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    )
    
    if (!hasRequiredPermissions) {
      if (showUnauthorized) {
        return <UnauthorizedPage 
          message="Bạn không có đủ quyền để thực hiện hành động này"
          requiredPermissions={requiredPermissions}
        />
      }
      return <Navigate to={fallbackPath || '/'} replace />
    }
  }

  // Check if email is verified for sensitive operations
  if (location.pathname.includes('/payment') || location.pathname.includes('/booking')) {
    if (user && !user.isVerified) {
      return <Navigate to="/verify-email" replace state={{ from: location }} />
    }
  }

  return children
}

// Unauthorized Page Component
const UnauthorizedPage = ({ 
  message = "Bạn không có quyền truy cập trang này",
  requiredRole = null,
  userRole = null,
  requiredPermissions = []
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-red-600" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Truy Cập Bị Từ Chối
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Role Information */}
        {requiredRole && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <Shield size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Yêu cầu vai trò:</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-yellow-700">Vai trò cần thiết:</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                {getRoleLabel(requiredRole)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-yellow-700">Vai trò hiện tại:</span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                {getRoleLabel(userRole)}
              </span>
            </div>
          </div>
        )}

        {/* Permissions Information */}
        {requiredPermissions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Quyền cần thiết:</span>
            </div>
            <div className="space-y-1">
              {requiredPermissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-blue-700">{getPermissionLabel(permission)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Quay lại
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>

        {/* Contact Support */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Nếu bạn nghĩ đây là lỗi, vui lòng{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
              liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper functions
const getRoleLabel = (role) => {
  const roles = {
    'admin': 'Quản trị viên',
    'bus_company': 'Nhà xe',
    'user': 'Người dùng',
    'moderator': 'Điều hành viên'
  }
  return roles[role] || role
}

const getPermissionLabel = (permission) => {
  const permissions = {
    'read:users': 'Xem người dùng',
    'write:users': 'Quản lý người dùng',
    'read:bookings': 'Xem đơn đặt vé',
    'write:bookings': 'Quản lý đơn đặt vé',
    'read:companies': 'Xem nhà xe',
    'write:companies': 'Quản lý nhà xe',
    'read:analytics': 'Xem thống kê',
    'write:analytics': 'Quản lý thống kê'
  }
  return permissions[permission] || permission
}

// Higher-order component for role-based protection
export const withRole = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  )
}

// Higher-order component for permission-based protection
export const withPermission = (Component, requiredPermissions) => {
  return (props) => (
    <ProtectedRoute requiredPermissions={requiredPermissions}>
      <Component {...props} />
    </ProtectedRoute>
  )
}

// Route guard for specific conditions
export const RouteGuard = ({ 
  condition, 
  fallback, 
  children 
}) => {
  return condition ? children : fallback
}

export default ProtectedRoute