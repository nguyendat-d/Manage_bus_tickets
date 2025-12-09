export const formatters = {
  // Format phone number for display
  formatPhone: (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/)
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`
    }
    return phone
  },

  // Format date to relative time
  formatRelativeTime: (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      return 'Vừa xong'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} ngày trước`
    } else {
      return date.toLocaleDateString('vi-VN')
    }
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Truncate text with ellipsis
  truncateText: (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
}