import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { tripService } from '../services/trip'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Star, 
  ArrowLeft,
  Shield,
  Wifi,
  Coffee,
  Snowflake,
  Zap,
  Tv,
  UserCheck,
  Heart,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { formatCurrency, formatDateTime, formatTime, calculateDuration } from '../../utils/helpers'

const TripDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSeatCount, setSelectedSeatCount] = useState(1)

  useEffect(() => {
    fetchTripDetail()
  }, [id])

  const fetchTripDetail = async () => {
    try {
      setLoading(true)
      const response = await tripService.getTripDetail(id)
      setTrip(response.data)
    } catch (err) {
      setError('Không tìm thấy thông tin chuyến xe')
      console.error('Trip detail error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi size={20} className="text-blue-600" />,
      air_conditioner: <Snowflake size={20} className="text-blue-600" />,
      charging: <Zap size={20} className="text-green-600" />,
      water: <Coffee size={20} className="text-orange-600" />,
      entertainment: <Tv size={20} className="text-purple-600" />,
      blanket: <Shield size={20} className="text-indigo-600" />
    }
    return icons[amenity] || <Shield size={20} className="text-gray-600" />
  }

  const getAmenityName = (amenity) => {
    const names = {
      wifi: 'WiFi miễn phí',
      air_conditioner: 'Điều hòa',
      charging: 'Sạc USB',
      water: 'Nước uống',
      entertainment: 'Giải trí',
      blanket: 'Chăn đệm'
    }
    return names[amenity] || amenity.replace('_', ' ')
  }

  const handleSeatCountChange = (count) => {
    if (count > 0 && count <= trip.available_seats) {
      setSelectedSeatCount(count)
    }
  }

  const handleQuickBooking = () => {
    navigate(`/booking/${trip.id}?seats=${selectedSeatCount}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" text="Đang tải thông tin chuyến xe..." />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Chuyến xe không tồn tại'}</h1>
          <p className="text-gray-600 mb-6">Vui lòng kiểm tra lại hoặc chọn chuyến xe khác</p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/search')}
              className="w-full btn-primary py-3"
            >
              Tìm chuyến xe khác
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full btn-secondary py-3"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = trip.price * selectedSeatCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại
            </button>
            
            <div className="flex items-center space-x-2">
              {trip.is_promoted && (
                <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  🔥 Khuyến mãi
                </span>
              )}
              {trip.is_instant_confirmation && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Xác nhận ngay
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {trip.departure_station} → {trip.arrival_station}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {formatDateTime(trip.departure_time, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{calculateDuration(trip.departure_time, trip.arrival_time)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{trip.company_name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span>{trip.company_rating || '4.5'}</span>
                    <span className="text-gray-500">({trip.company_reviews || '1.2k'})</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 text-right">
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                  {formatCurrency(trip.price)}
                </p>
                <p className="text-sm text-gray-600">/ hành khách</p>
                {trip.original_price && trip.original_price > trip.price && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(trip.original_price)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Timeline */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Lộ trình chi tiết
              </h2>
              
              <div className="space-y-6">
                {/* Departure */}
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{trip.departure_station}</h3>
                        <p className="text-sm text-gray-600">{trip.departure_city}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatTime(trip.departure_time)}</p>
                        <p className="text-sm text-gray-600">Khởi hành</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                      📍 Địa chỉ: {trip.departure_address || 'Sẽ thông báo chi tiết sau khi đặt vé'}
                    </p>
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{trip.arrival_station}</h3>
                        <p className="text-sm text-gray-600">{trip.arrival_city}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatTime(trip.arrival_time)}</p>
                        <p className="text-sm text-gray-600">Dự kiến đến</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                      📍 Địa chỉ: {trip.arrival_address || 'Sẽ thông báo chi tiết sau khi đặt vé'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Amenities */}
            {trip.amenities && Object.keys(trip.amenities).length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Tiện nghi trên xe
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(trip.amenities).map(([amenity, available]) => (
                    available && (
                      <div key={amenity} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        {getAmenityIcon(amenity)}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {getAmenityName(amenity)}
                          </p>
                          <p className="text-xs text-gray-500">Có sẵn</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Bus & Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bus Information */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="mr-2" size={20} />
                  Thông tin xe
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biển số:</span>
                    <span className="font-medium">{trip.license_plate || '29B-123.45'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại xe:</span>
                    <span className="font-medium capitalize">{trip.bus_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số ghế:</span>
                    <span className="font-medium">{trip.total_seats || 45} ghế</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Năm sản xuất:</span>
                    <span className="font-medium">{trip.bus_year || 2023}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="font-medium text-green-600 flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      Sẵn sàng
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="mr-2" size={20} />
                  Nhà xe {trip.company_name}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đánh giá:</span>
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="font-medium">{trip.company_rating || '4.5'}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chuyến đã chạy:</span>
                    <span className="font-medium">{trip.company_trips || '1.2k'}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liên hệ:</span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Phone size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Mail size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chứng nhận:</span>
                    <span className="font-medium text-green-600 flex items-center">
                      <Shield size={16} className="mr-1" />
                      An toàn
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chính sách & Điều khoản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Hủy vé miễn phí</p>
                    <p className="text-gray-600">Trước 2 giờ khởi hành</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Đổi vé linh hoạt</p>
                    <p className="text-gray-600">Trước 1 giờ khởi hành</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Hoàn tiền 100%</p>
                    <p className="text-gray-600">Trong 24 giờ</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Bảo hiểm hành khách</p>
                    <p className="text-gray-600">Theo quy định nhà nước</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Action Sidebar */}
          <div className="space-y-6">
            <div className="card sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Đặt vé ngay
              </h3>
              
              <div className="space-y-4">
                {/* Seat Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng ghế
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleSeatCountChange(selectedSeatCount - 1)}
                      disabled={selectedSeatCount <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{selectedSeatCount}</span>
                    <button
                      onClick={() => handleSeatCountChange(selectedSeatCount + 1)}
                      disabled={selectedSeatCount >= trip.available_seats}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600 ml-2">
                      {trip.available_seats} ghế trống
                    </span>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{selectedSeatCount} vé x {formatCurrency(trip.price)}</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  {trip.service_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí dịch vụ</span>
                      <span className="font-medium">{formatCurrency(trip.service_fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">{formatCurrency(totalPrice + (trip.service_fee || 0))}</span>
                  </div>
                </div>

                {/* Availability Alert */}
                {trip.available_seats < 5 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700 text-center">
                      ⚠️ Chỉ còn {trip.available_seats} ghế trống!
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <button
                  onClick={handleQuickBooking}
                  className="w-full btn-primary py-3 text-center font-semibold text-lg"
                >
                  Chọn ghế & Đặt ngay
                </button>

                <button className="w-full btn-secondary py-3 text-center flex items-center justify-center space-x-2">
                  <Heart size={20} />
                  <span>Thêm vào yêu thích</span>
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hoặc{' '}
                    <button 
                      onClick={() => navigate('/search')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      tìm chuyến khác
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">Hỗ trợ 24/7</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-blue-600" />
                  <span className="text-gray-600">Hotline:</span>
                  <span className="font-medium">1900 1234</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-blue-600" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">support@vexere.com</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-700">
                    💬 Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDetail