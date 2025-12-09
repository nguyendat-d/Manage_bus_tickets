import React from 'react'
import { Loader2, Bus, Clock, MapPin } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Đang tải...', 
  className = '',
  type = 'default',
  overlay = false,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const containerClasses = `
    flex flex-col items-center justify-center p-6 
    ${overlay ? 'absolute inset-0 bg-white bg-opacity-80 z-50 rounded-lg' : ''}
    ${fullScreen ? 'fixed inset-0 bg-white z-50' : ''}
    ${className}
  `

  const getSpinnerContent = () => {
    switch (type) {
      case 'search':
        return (
          <>
            <div className="relative">
              <MapPin className={`text-blue-600 animate-pulse ${sizeClasses[size]}`} />
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 border-2 border-white border-t-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className={`mt-3 text-gray-600 ${textSizes[size]} font-medium`}>
              Đang tìm kiếm chuyến xe...
            </p>
          </>
        )
      
      case 'booking':
        return (
          <>
            <div className="relative">
              <Bus className={`text-green-600 animate-bounce ${sizeClasses[size]}`} />
              <div className="absolute -bottom-1 -right-1">
                <Clock className="w-4 h-4 text-orange-500 animate-pulse" />
              </div>
            </div>
            <p className={`mt-3 text-gray-600 ${textSizes[size]} font-medium`}>
              Đang xử lý đặt vé...
            </p>
          </>
        )
      
      case 'map':
        return (
          <>
            <div className="relative">
              <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
              <MapPin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
            </div>
            <p className={`mt-3 text-gray-600 ${textSizes[size]} font-medium`}>
              Đang tải bản đồ...
            </p>
          </>
        )
      
      case 'payment':
        return (
          <>
            <div className="relative">
              <div className={`${sizeClasses[size]} bg-gradient-to-r from-green-400 to-blue-500 rounded-lg animate-pulse`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
            </div>
            <p className={`mt-3 text-gray-600 ${textSizes[size]} font-medium`}>
              Đang xử lý thanh toán...
            </p>
            <p className="text-gray-500 text-sm mt-1">Vui lòng không đóng trang</p>
          </>
        )
      
      default:
        return (
          <>
            <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
            {text && (
              <p className={`mt-3 text-gray-600 ${textSizes[size]} font-medium`}>
                {text}
              </p>
            )}
          </>
        )
    }
  }

  const getProgressBar = () => {
    if (type === 'progress') {
      return (
        <div className="w-48 bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full animate-pulse"
            style={{ width: '65%' }}
          ></div>
        </div>
      )
    }
    return null
  }

  const getDots = () => {
    if (type === 'dots') {
      return (
        <div className="flex space-x-1 mt-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {getSpinnerContent()}
        {getProgressBar()}
        {getDots()}
      </div>
      
      {/* Additional loading tips */}
      {(type === 'booking' || type === 'payment') && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg max-w-xs">
          <p className="text-blue-800 text-xs text-center">
            ⏳ Quá trình này có thể mất vài giây. Vui lòng chờ trong giây lát...
          </p>
        </div>
      )}
    </div>
  )
}

// Additional specialized loading components
export const PageLoader = () => (
  <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">B</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">BusTicket</span>
    </div>
    <LoadingSpinner size="lg" text="Đang tải trang..." />
    <p className="text-gray-500 text-sm mt-4">Hệ thống đặt vé xe khách trực tuyến</p>
  </div>
)

export const SearchLoader = ({ destination }) => (
  <LoadingSpinner 
    type="search" 
    size="lg" 
    text={destination ? `Đang tìm chuyến đến ${destination}...` : 'Đang tìm kiếm chuyến xe...'}
    overlay
  />
)

export const BookingLoader = () => (
  <LoadingSpinner 
    type="booking" 
    size="lg" 
    text="Đang hoàn tất đặt vé..."
    overlay
  />
)

export const PaymentLoader = () => (
  <LoadingSpinner 
    type="payment" 
    size="lg" 
    text="Đang xử lý thanh toán..."
    fullScreen
  />
)

export default LoadingSpinner