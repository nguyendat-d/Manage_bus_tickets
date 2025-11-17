const LoadingSpinner = ({ size = 'md', text = 'Đang tải...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
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

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}
      ></div>
      {text && (
        <p className={`mt-2 text-gray-600 animate-pulse ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner