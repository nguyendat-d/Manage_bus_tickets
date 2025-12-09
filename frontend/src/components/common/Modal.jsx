import React, { useEffect, useRef } from 'react'
import { X, Maximize2, Minimize2, Download, Printer, Share2 } from 'lucide-react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  showHeader = true,
  footer,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isLoading = false,
  isFullscreen = false,
  onFullscreenToggle,
  showActions = false,
  customActions,
  overlayClassName = '',
  contentClassName = '',
  closeOnEscape = true,
  preventScroll = true
}) => {
  const modalRef = useRef(null)

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4 h-[95vh]',
    auto: 'max-w-max'
  }

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    if (preventScroll) {
      document.body.style.overflow = 'hidden'
    }

    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (preventScroll) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, closeOnEscape, preventScroll, onClose])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: title,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You might want to show a toast notification here
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className={`flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ${overlayClassName}`}
        onClick={handleOverlayClick}
      >
        {/* Backdrop with animation */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity duration-300 ease-in-out"
          style={{ animation: 'fadeIn 0.3s ease-in-out' }}
        ></div>

        {/* Modal panel with animation */}
        <div 
          ref={modalRef}
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full ${
            sizeClasses[isFullscreen ? 'full' : size]
          }`}
          style={{ 
            animation: 'slideIn 0.3s ease-out',
            maxHeight: isFullscreen ? '95vh' : '90vh'
          }}
        >
          {/* Header */}
          {showHeader && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                {isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Action Buttons */}
                {onFullscreenToggle && (
                  <button
                    onClick={onFullscreenToggle}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    title={isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
                  >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                )}
                
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Chia sẻ"
                >
                  <Share2 size={18} />
                </button>
                
                <button
                  onClick={handlePrint}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="In"
                >
                  <Printer size={18} />
                </button>

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Đóng"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Content */}
          <div 
            className={`bg-white px-6 py-4 overflow-y-auto ${contentClassName}`}
            style={{ 
              maxHeight: isFullscreen ? 'calc(95vh - 140px)' : 'calc(90vh - 140px)',
              minHeight: '200px'
            }}
          >
            {children}
          </div>

          {/* Footer */}
          {(footer || showActions || customActions) && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex-1">
                {footer}
              </div>
              
              <div className="flex items-center space-x-3">
                {customActions ? (
                  customActions
                ) : showActions ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelText}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang xử lý...</span>
                        </div>
                      ) : (
                        confirmText
                      )}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

// Specialized Modal Components
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  title = "Xác nhận hành động",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  type = "warning", // 'warning', 'danger', 'info', 'success'
  isLoading = false
}) => {
  const typeConfig = {
    warning: { icon: "⚠️", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    danger: { icon: "🚫", color: "text-red-600", bgColor: "bg-red-50" },
    info: { icon: "ℹ️", color: "text-blue-600", bgColor: "bg-blue-50" },
    success: { icon: "✅", color: "text-green-600", bgColor: "bg-green-50" }
  }

  const config = typeConfig[type] || typeConfig.warning

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showActions={true}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onClose}
      isLoading={isLoading}
    >
      <div className={`p-4 rounded-xl ${config.bgColor} mb-4`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{config.icon}</span>
          <p className={`font-medium ${config.color}`}>{message}</p>
        </div>
      </div>
    </Modal>
  )
}

export const LoadingModal = ({ isOpen, title = "Đang xử lý", message = "Vui lòng chờ trong giây lát..." }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title={title}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-center">{message}</p>
      </div>
    </Modal>
  )
}

export const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Thành công!", 
  message,
  buttonText = "Đóng",
  autoClose = 3000 
}) => {
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showActions={true}
      confirmText={buttonText}
      onConfirm={onClose}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center justify-center py-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <p className="text-gray-600 text-center text-lg">{message}</p>
      </div>
    </Modal>
  )
}

export default Modal