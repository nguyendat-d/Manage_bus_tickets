import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { ArrowLeft, AlertCircle } from 'lucide-react'

const BookingPage = () => {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTripDetails()
  }, [tripId])

  const fetchTripDetails = async () => {
    try {
      setLoading(true)
      const seatCount = parseInt(searchParams.get('seats')) || 1
      // Sửa: Giả lập API call thay vì gọi service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Tạo dữ liệu giả cho trip
      const mockTrip = {
        id: tripId,
        departure_station: 'Hà Nội',
        arrival_station: 'Hải Phòng',
        departure_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        price: 150000,
        available_seats: 20
      }
      
      setTrip(mockTrip)
    } catch (err) {
      setError('Có lỗi xảy ra khi tải thông tin chuyến xe')
      console.error('Fetch trip error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleBooking = async () => {
    try {
      // Giả lập đặt vé thành công
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate(`/booking-confirmation/temp-${Date.now()}`)
    } catch (err) {
      setError('Có lỗi xảy ra khi đặt vé')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Đang tải thông tin chuyến xe..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy chuyến xe</h2>
          <p className="text-gray-600 mb-6">Chuyến xe bạn tìm kiếm không tồn tại hoặc đã bị hủy</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đặt vé xe
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  {trip.departure_station} → {trip.arrival_station}
                </p>
                <p className="text-gray-600">
                  {new Date(trip.departure_time).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(trip.price)}
                </span>
                <span className="text-gray-600 ml-2">/ vé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin đặt vé</h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Lưu ý:</strong> Tính năng đặt vé đang được phát triển. Đây là giao diện demo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chuyến đi</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Tuyến:</strong> {trip.departure_station} → {trip.arrival_station}</p>
                    <p><strong>Thời gian:</strong> {new Date(trip.departure_time).toLocaleString('vi-VN')}</p>
                    <p><strong>Giá vé:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(trip.price)}</p>
                    <p><strong>Ghế còn trống:</strong> {trip.available_seats}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đặt vé</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng ghế
                      </label>
                      <input
                        type="number"
                        value={parseInt(searchParams.get('seats')) || 1}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tổng tiền
                      </label>
                      <p className="text-xl font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          trip.price * (parseInt(searchParams.get('seats')) || 1)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBooking}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Xác nhận đặt vé
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900">Đảm bảo chỗ ngồi</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Chỗ ngồi của bạn được xác nhận ngay khi thanh toán thành công
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">🔄</span>
              </div>
              <h3 className="font-semibold text-gray-900">Hỗ trợ 24/7</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">🛡️</span>
              </div>
              <h3 className="font-semibold text-gray-900">Bảo mật thanh toán</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Thông tin thanh toán được mã hóa và bảo vệ an toàn
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage