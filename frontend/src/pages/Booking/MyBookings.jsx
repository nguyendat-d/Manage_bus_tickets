import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { bookingService } from '../services/booking'
import { 
  Eye, 
  XCircle, 
  Download, 
  Calendar,
  MapPin,
  Clock,
  Users,
  Receipt,
  X
} from 'lucide-react'
import { formatCurrency, formatDateTime, getStatusBadgeClass, formatDate } from '../../utils/helpers'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    date_from: '',
    date_to: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(null)
  const [downloadLoading, setDownloadLoading] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // Sync filters with URL
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page')) || 1
    const dateFrom = searchParams.get('date_from') || ''
    const dateTo = searchParams.get('date_to') || ''
    
    setFilters(prev => ({
      ...prev,
      status,
      page,
      date_from: dateFrom,
      date_to: dateTo
    }))
  }, [searchParams])

  useEffect(() => {
    fetchBookings()
  }, [filters])

  const updateURL = (newFilters) => {
    const params = new URLSearchParams()
    if (newFilters.status) params.set('status', newFilters.status)
    if (newFilters.page > 1) params.set('page', newFilters.page.toString())
    if (newFilters.date_from) params.set('date_from', newFilters.date_from)
    if (newFilters.date_to) params.set('date_to', newFilters.date_to)
    setSearchParams(params)
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getUserBookings(filters)
      if (response.success) {
        setBookings(response.data.bookings)
        setPagination(response.data.pagination)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)
    updateURL(updatedFilters)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé này? Phí hủy vé có thể được áp dụng theo chính sách của nhà xe.')) return

    try {
      setCancelLoading(bookingId)
      const response = await bookingService.cancelBooking(bookingId, 'Người dùng yêu cầu hủy')
      
      if (response.success) {
        await fetchBookings()
        alert('Hủy vé thành công!')
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Cancel booking error:', error)
      alert(error.message || 'Có lỗi xảy ra khi hủy vé. Vui lòng thử lại.')
    } finally {
      setCancelLoading(null)
    }
  }

  const handleDownloadTicket = async (bookingId) => {
    try {
      setDownloadLoading(bookingId)
      const response = await bookingService.downloadTicket(bookingId)
      
      if (response.success) {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `ve-xe-${bookingId}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Download ticket error:', error)
      alert(error.message || 'Có lỗi xảy ra khi tải vé. Vui lòng thử lại.')
    } finally {
      setDownloadLoading(null)
    }
  }

  const handlePageChange = (page) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)
    updateURL(updatedFilters)
  }

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'completed', label: 'Đã hoàn thành' }
  ]

  // Loading Spinner Component
  const LoadingSpinner = ({ size = 'md', text = 'Đang tải...' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    }
    
    return (
      <div className="flex flex-col items-center justify-center">
        <div className={`${sizeClasses[size]} border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin`}></div>
        {text && <p className="mt-2 text-gray-600">{text}</p>}
      </div>
    )
  }

  // Simple Modal Component
  const BookingModal = ({ booking, isOpen, onClose }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-6 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Chi tiết đặt chỗ</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Thông tin chuyến đi</h4>
              <div className="space-y-2">
                <p><strong>Mã đặt chỗ:</strong> {booking.booking_code}</p>
                <p><strong>Tuyến đường:</strong> {booking.departure_station} → {booking.arrival_station}</p>
                <p><strong>Ngày đi:</strong> {formatDate(booking.departure_time)}</p>
                <p><strong>Giờ đi:</strong> {new Date(booking.departure_time).toLocaleTimeString('vi-VN')}</p>
                <p><strong>Nhà xe:</strong> {booking.company_name}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Thông tin hành khách</h4>
              <div className="space-y-2">
                <p><strong>Hành khách:</strong> {booking.passenger_name}</p>
                <p><strong>Số ghế:</strong> {Array.isArray(booking.seat_numbers) ? booking.seat_numbers.join(', ') : booking.seat_numbers}</p>
                <p><strong>Tổng tiền:</strong> {formatCurrency(booking.total_amount)}</p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  <span className={getStatusBadgeClass(booking.booking_status)}>
                    {booking.booking_status === 'pending' && 'Chờ xác nhận'}
                    {booking.booking_status === 'confirmed' && 'Đã xác nhận'}
                    {booking.booking_status === 'cancelled' && 'Đã hủy'}
                    {booking.booking_status === 'completed' && 'Đã hoàn thành'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Đang tải danh sách vé..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vé của tôi
              </h1>
              <p className="text-gray-600">
                Quản lý và theo dõi các vé xe bạn đã đặt
              </p>
            </div>
            <Link
              to="/search"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đặt vé mới
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange({ date_from: e.target.value })}
                className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange({ date_to: e.target.value })}
                className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                const resetFilters = { status: '', date_from: '', date_to: '', page: 1 }
                setFilters(resetFilters)
                updateURL(resetFilters)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.status || filters.date_from || filters.date_to ? "Không tìm thấy vé phù hợp" : "Chưa có vé nào"}
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.status || filters.date_from || filters.date_to 
                ? 'Hãy thử điều chỉnh bộ lọc để xem kết quả khác'
                : 'Hãy đặt vé đầu tiên của bạn để bắt đầu hành trình!'
              }
            </p>
            {!filters.status && !filters.date_from && !filters.date_to ? (
              <Link 
                to="/search" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đặt vé ngay
              </Link>
            ) : (
              <button 
                onClick={() => {
                  const resetFilters = { status: '', date_from: '', date_to: '', page: 1 }
                  setFilters(resetFilters)
                  updateURL(resetFilters)
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {booking.departure_station} → {booking.arrival_station}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar size={16} />
                              <span>{formatDate(booking.departure_time)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={16} />
                              <span>{new Date(booking.departure_time).toLocaleTimeString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users size={16} />
                              <span>{booking.company_name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <span className={getStatusBadgeClass(booking.booking_status)}>
                            {booking.booking_status === 'pending' && 'Chờ xác nhận'}
                            {booking.booking_status === 'confirmed' && 'Đã xác nhận'}
                            {booking.booking_status === 'cancelled' && 'Đã hủy'}
                            {booking.booking_status === 'completed' && 'Đã hoàn thành'}
                          </span>
                          
                          <span className={getStatusBadgeClass(booking.payment_status)}>
                            {booking.payment_status === 'paid' && 'Đã thanh toán'}
                            {booking.payment_status === 'pending' && 'Chờ thanh toán'}
                            {booking.payment_status === 'failed' && 'Thanh toán lỗi'}
                            {booking.payment_status === 'refunded' && 'Đã hoàn tiền'}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Receipt size={16} className="text-gray-400" />
                          <div>
                            <div className="text-gray-600">Mã đặt chỗ:</div>
                            <div className="font-medium text-gray-900">{booking.booking_code}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} className="text-gray-400" />
                          <div>
                            <div className="text-gray-600">Số ghế:</div>
                            <div className="font-medium text-gray-900">
                              {Array.isArray(booking.seat_numbers) 
                                ? booking.seat_numbers.join(', ')
                                : booking.seat_numbers
                              }
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-gray-600">Hành khách:</div>
                          <div className="font-medium text-gray-900">{booking.passenger_name}</div>
                        </div>
                        
                        <div>
                          <div className="text-gray-600">Tổng tiền:</div>
                          <div className="font-medium text-blue-600">
                            {formatCurrency(booking.total_amount)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-4">
                      {booking.booking_status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleDownloadTicket(booking.id)}
                            disabled={downloadLoading === booking.id}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            {downloadLoading === booking.id ? (
                              <LoadingSpinner size="sm" text="" />
                            ) : (
                              <Download size={16} />
                            )}
                            <span>Tải vé</span>
                          </button>
                          
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelLoading === booking.id}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                          >
                            {cancelLoading === booking.id ? (
                              <LoadingSpinner size="sm" text="" />
                            ) : (
                              <XCircle size={16} />
                            )}
                            <span>Hủy vé</span>
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <Eye size={16} />
                        <span>Chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-700">
                  Hiển thị {(pagination.page - 1) * filters.limit + 1} đến{' '}
                  {Math.min(pagination.page * filters.limit, pagination.total)} trong tổng số{' '}
                  {pagination.total} kết quả
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Booking Detail Modal */}
        <BookingModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      </div>
    </div>
  )
}

export default MyBookings