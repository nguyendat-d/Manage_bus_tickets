import React, { createContext, useContext, useState } from 'react'

// THÊM EXPORT CHO CONTEXT
export const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = 'info', options = {}) => {
    const {
      title = '',
      duration = 5000,
      autoClose = true,
      actions = [],
      persistent = false
    } = options

    const id = Date.now() + Math.random()
    const notification = { 
      id, 
      message, 
      type, 
      title,
      duration,
      autoClose,
      actions,
      persistent,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    setNotifications(prev => [notification, ...prev])
    
    if (autoClose && !persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Convenience methods for different notification types
  const showNotification = (message, type = 'info', options = {}) => {
    return addNotification(message, type, options)
  }

  const showSuccess = (message, options = {}) => {
    return addNotification(message, 'success', options)
  }

  const showError = (message, options = {}) => {
    return addNotification(message, 'error', options)
  }

  const showWarning = (message, options = {}) => {
    return addNotification(message, 'warning', options)
  }

  const showInfo = (message, options = {}) => {
    return addNotification(message, 'info', options)
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length
  }

  const value = {
    // State
    notifications,
    
    // Core methods
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
    
    // Convenience methods
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Utility functions
    unreadCount: getUnreadCount()
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// THÊM EXPORT DEFAULT NẾU CẦN
export default NotificationContext