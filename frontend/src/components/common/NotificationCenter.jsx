import React, { useState, useEffect } from 'react'
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Bell,
  Settings,
  CheckCheck
} from 'lucide-react'
import { useNotification } from '../../contexts/NotificationContext'

const NotificationCenter = ({ 
  position = 'top-right',
  maxNotifications = 5,
  autoClose = 5000,
  showProgress = true
}) => {
  const { notifications, removeNotification, clearAllNotifications, markAllAsRead } = useNotification()
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState({})

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  const typeConfig = {
    info: {
      icon: Info,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-500',
      progressColor: 'bg-blue-500'
    },
    success: {
      icon: CheckCircle,
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-500',
      progressColor: 'bg-green-500'
    },
    error: {
      icon: AlertCircle,
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500',
      progressColor: 'bg-red-500'
    },
    warning: {
      icon: AlertTriangle,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-500',
      progressColor: 'bg-yellow-500'
    }
  }

  // Auto-close notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoClose !== false && autoClose > 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id)
        }, notification.duration || autoClose)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications, autoClose, removeNotification])

  // Progress bar animation
  useEffect(() => {
    notifications.forEach(notification => {
      if (showProgress && (notification.autoClose !== false) && autoClose > 0) {
        const duration = notification.duration || autoClose
        const startTime = Date.now()
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, duration - elapsed)
          const percentage = (remaining / duration) * 100
          
          setProgress(prev => ({
            ...prev,
            [notification.id]: percentage
          }))

          if (remaining > 0) {
            requestAnimationFrame(updateProgress)
          }
        }
        
        requestAnimationFrame(updateProgress)
      }
    })
  }, [notifications, showProgress, autoClose])

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return 'Vừa xong'
  }

  const NotificationIcon = ({ type }) => {
    const config = typeConfig[type] || typeConfig.info
    const Icon = config.icon
    return <Icon size={20} className={config.iconColor} />
  }

  const displayedNotifications = isOpen ? notifications : notifications.slice(0, maxNotifications)

  if (notifications.length === 0) return null

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-3`}>
      {/* Notification Bell (Optional) */}
      {notifications.length > maxNotifications && !isOpen && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 group"
          >
            <Bell size={20} className="text-gray-600 group-hover:text-blue-600" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Notifications */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayedNotifications.map(notification => {
          const config = typeConfig[notification.type] || typeConfig.info
          
          return (
            <div
              key={notification.id}
              className={`relative border rounded-xl p-4 shadow-lg transform transition-all duration-300 animate-in slide-in-from-right ${
                config.color
              } ${notification.read ? 'opacity-80' : ''}`}
              style={{ animationDelay: '0.1s' }}
            >
              {/* Progress Bar */}
              {showProgress && progress[notification.id] !== undefined && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-xl">
                  <div
                    className={`h-full rounded-t-xl transition-all duration-100 ${config.progressColor}`}
                    style={{ width: `${progress[notification.id]}%` }}
                  />
                </div>
              )}

              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 pt-0.5">
                  <NotificationIcon type={notification.type} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm leading-relaxed break-words">
                        {notification.message}
                      </p>
                      
                      {/* Action Buttons */}
                      {notification.actions && (
                        <div className="flex space-x-2 mt-2">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                action.onClick?.()
                                if (action.dismiss) {
                                  removeNotification(notification.id)
                                }
                              }}
                              className="text-xs font-medium px-3 py-1 rounded-lg border border-current hover:bg-white hover:bg-opacity-20 transition-colors"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="flex-shrink-0 ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>{getTimeAgo(notification.timestamp)}</span>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      {isOpen && notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between space-x-2">
            <div className="text-sm text-gray-600">
              {notifications.length} thông báo
            </div>
            <div className="flex space-x-1">
              <button
                onClick={markAllAsRead}
                disabled={notifications.every(n => n.read)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Đánh dấu tất cả đã đọc"
              >
                <CheckCheck size={16} />
              </button>
              <button
                onClick={clearAllNotifications}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa tất cả"
              >
                <X size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show More/Less Button */}
      {notifications.length > maxNotifications && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium bg-white px-4 py-2 rounded-lg shadow border border-gray-200 hover:shadow-md transition-all"
          >
            {isOpen ? 'Ẩn bớt' : `Hiển thị thêm (${notifications.length - maxNotifications})`}
          </button>
        </div>
      )}
    </div>
  )
}

// Hook for using notifications
export const useNotificationHook = () => {
  const { addNotification } = useNotification()

  const showNotification = (options) => {
    const defaultOptions = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      autoClose: true,
      read: false,
      timestamp: new Date().toISOString(),
      actions: []
    }

    addNotification({ ...defaultOptions, ...options })
  }

  return {
    showInfo: (message, title = 'Thông tin') => 
      showNotification({ type: 'info', title, message }),
    
    showSuccess: (message, title = 'Thành công') => 
      showNotification({ type: 'success', title, message }),
    
    showError: (message, title = 'Lỗi') => 
      showNotification({ type: 'error', title, message }),
    
    showWarning: (message, title = 'Cảnh báo') => 
      showNotification({ type: 'warning', title, message }),
    
    showNotification
  }
}

export default NotificationCenter