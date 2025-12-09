import React, { useState, useEffect, useMemo } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'
import Modal from '../common/Modal'
import { 
  Search, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download, 
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react'

const BookingList = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchData()
  }, [filterStatus])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Giả lập dữ liệu thay vì gọi API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockBookings = [
        {
          id: 1,
          bookingCode: 'BK001',
          user: {
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0123456789'
          },
          trip: {
            route: {
              departure: 'Hà Nội',
              destination: 'Hải Phòng'
            },
            departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          },
          seatNumbers: ['A1', 'A2'],
          totalPrice: 300000,
          status: 'pending',
          createdAt: new Date().toISOString(),
          paymentMethod: 'Chuyển khoản',
          paymentStatus: 'paid'
        },
        {
          id: 2,
          bookingCode: 'BK002',
          user: {
            fullName: 'Trần Thị B',
            email: 'tranthib@email.com',
            phone: '0987654321'
          },
          trip: {
            route: {
              departure: 'Hồ Chí Minh',
              destination: 'Đà Lạt'
            },
            departureTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
          },
          seatNumbers: ['B3'],
          totalPrice: 450000,
          status: 'confirmed',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'Thẻ tín dụng',
          paymentStatus: 'paid'
        }
      ]
      
      setBookings(mockBookings)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleConfirmBooking = async (bookingId) => {
    try {
      // Giả lập xác nhận đơn
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ))
    } catch (error) {
      console.error('Failed to confirm booking:', error)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn đặt vé này?')) {
      try {
        // Giả lập hủy đơn
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ))
      } catch (error) {
        console.error('Failed to cancel booking:', error)
      }
    }
  }

  const handleExportPDF = async (bookingId) => {
    try {
      // Giả lập xuất PDF
      alert(`Đang xuất PDF cho đơn hàng ${bookingId}...`)
    } catch (error) {
      console.error('Failed to export:', error)
    }
  }

  const handleSendConfirmation = async (bookingId) => {
    try {
      // Giả lập gửi email
      alert('Email xác nhận đã được gửi thành công!')
    } catch (error) {
      console.error('Failed to send email:', error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: Clock, text: 'Chờ Xác Nhận' },
      confirmed: { color: 'green', icon: CheckCircle, text: 'Đã Xác Nhận' },
      completed: { color: 'blue', icon: CheckCircle, text: 'Hoàn Tất' },
      cancelled: { color: 'red', icon: XCircle, text: 'Đã Hủy' }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    }

    return (
      <div className={`flex items-center gap-2 ${colorClasses[config.color]} px-3 py-1 rounded-full w-fit border`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    )
  }

  // Helper functions để thay thế import từ utils
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0)
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const sortedAndFilteredBookings = useMemo(() => {
    let filtered = bookings.filter(booking => {
      const matchSearch = 
        booking.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.user?.phone && booking.user.phone.includes(searchTerm))
      
      const matchDate = !filterDate || 
        formatDate(booking.createdAt) === filterDate

      const matchStatus = filterStatus === 'all' || booking.status === filterStatus

      return matchSearch && matchDate && matchStatus
    })

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [bookings, searchTerm, filterDate, filterStatus, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredBookings.length / itemsPerPage)
  const paginatedBookings = sortedAndFilteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown size={16} className="text-gray-400" />
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={16} className="text-blue-600" /> : 
      <ChevronDown size={16} className="text-blue-600" />
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Đặt Vé</h2>
          <p className="text-gray-600 mt-1">Tổng cộng: {bookings.length} đơn</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            Làm Mới
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, SĐT hoặc mã..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ Xác Nhận</option>
          <option value="confirmed">Đã Xác Nhận</option>
          <option value="completed">Hoàn Tất</option>
          <option value="cancelled">Đã Hủy</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Làm Mới
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { status: 'pending', label: 'Chờ Xác Nhận', color: 'yellow' },
          { status: 'confirmed', label: 'Đã Xác Nhận', color: 'green' },
          { status: 'completed', label: 'Hoàn Tất', color: 'blue' },
          { status: 'cancelled', label: 'Đã Hủy', color: 'red' }
        ].map(({ status, label, color }) => (
          <div key={status} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">{label}</p>
            <p className={`text-2xl font-bold text-${color}-600`}>
              {bookings.filter(b => b.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleSort('bookingCode')}
                >
                  <div className="flex items-center gap-2">
                    Mã Đơn
                    <SortIcon columnKey="bookingCode" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Hành Khách
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Chuyến Đi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Số Ghế
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleSort('totalPrice')}
                >
                  <div className="flex items-center gap-2">
                    Tổng Tiền
                    <SortIcon columnKey="totalPrice" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Trạng Thái
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Ngày Đặt
                    <SortIcon columnKey="createdAt" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-blue-600">{booking.bookingCode}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {booking.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <User size={16} />
                        {booking.user?.fullName}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Mail size={14} />
                        {booking.user?.email}
                      </p>
                      {booking.user?.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Phone size={14} />
                          {booking.user.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin size={16} />
                        {booking.trip?.route?.departure} → {booking.trip?.route?.destination}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        {formatDateTime(booking.trip?.departureTime)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {booking.seatNumbers?.map(seat => (
                        <span key={seat} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            title="Xác nhận đơn"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            title="Hủy đơn"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleSendConfirmation(booking.id)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            title="Gửi email xác nhận"
                          >
                            <Mail size={16} />
                          </button>
                          <button
                            onClick={() => handleExportPDF(booking.id)}
                            className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                            title="Xuất PDF"
                          >
                            <Download size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value={10}>10 / trang</option>
                <option value={25}>25 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
              <p className="text-sm text-gray-600">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedAndFilteredBookings.length)} của {sortedAndFilteredBookings.length} đơn
              </p>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-3 py-1">
                        ...
                      </span>
                    )
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} size="lg">
          <BookingDetailModal 
            booking={selectedBooking} 
            onClose={() => setShowDetailModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

// Booking Detail Modal Component
const BookingDetailModal = ({ booking, onClose }) => {
  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0)
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      confirmed: 'green',
      completed: 'blue',
      cancelled: 'red'
    }
    return colors[status] || 'gray'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ Xác Nhận',
      confirmed: 'Đã Xác Nhận',
      completed: 'Hoàn Tất',
      cancelled: 'Đã Hủy'
    }
    return texts[status] || status
  }

  const statusColor = getStatusColor(booking.status)
  const statusText = getStatusText(booking.status)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Chi Tiết Đơn Đặt Vé</h3>
          <p className="text-gray-600 mt-1">Mã: {booking.bookingCode}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passenger Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">Thông Tin Hành Khách</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Họ tên</label>
              <p className="font-medium">{booking.user?.fullName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium">{booking.user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Số điện thoại</label>
              <p className="font-medium">{booking.user?.phone || 'Chưa cung cấp'}</p>
            </div>
          </div>
        </div>

        {/* Trip Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">Thông Tin Chuyến Đi</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Tuyến đường</label>
              <p className="font-medium">
                {booking.trip?.route?.departure} → {booking.trip?.route?.destination}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Thời gian khởi hành</label>
              <p className="font-medium">{formatDateTime(booking.trip?.departureTime)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Số ghế</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {booking.seatNumbers?.map(seat => (
                  <span key={seat} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">Thông Tin Thanh Toán</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Tổng tiền</label>
              <p className="font-bold text-lg text-blue-600">{formatCurrency(booking.totalPrice)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Phương thức thanh toán</label>
              <p className="font-medium">{booking.paymentMethod || 'Chưa xác định'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Trạng thái thanh toán</label>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Booking Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">Thông Tin Đặt Vé</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Ngày đặt</label>
              <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Trạng thái</label>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                  {statusText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}

export default BookingList