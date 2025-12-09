import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Shield,
  Wifi,
  Zap,
  Coffee,
  Heart,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Battery,
  Wind,
  Tv,
  Package
} from 'lucide-react'
import { formatCurrency, formatTime, calculateDuration } from '../../utils/helpers'

const TripCard = ({ trip, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    onFavoriteToggle?.(trip.id, !isFavorite)
  }

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: { icon: Wifi, label: 'WiFi', color: 'text-blue-600' },
      charging: { icon: Zap, label: 'Sạc USB', color: 'text-green-600' },
      ac: { icon: Wind, label: 'Điều hòa', color: 'text-cyan-600' },
      water: { icon: Coffee, label: 'Nước uống', color: 'text-orange-600' },
      entertainment: { icon: Tv, label: 'Giải trí', color: 'text-purple-600' },
      luggage: { icon: Package, label: 'Hành lý', color: 'text-yellow-600' },
      insurance: { icon: Shield, label: 'Bảo hiểm', color: 'text-red-600' }
    }
    return icons[amenity] || { icon: CheckCircle, label: 'Tiện nghi', color: 'text-gray-600' }
  }

  const amenities = trip.amenities?.slice(0, 4) || ['wifi', 'ac', 'water']
  const discountPercentage = trip.originalPrice ? 
    Math.round((1 - trip.price / trip.originalPrice) * 100) : 0

  return (
    <div 
      className="trip-card-modern group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-blue-100">
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                <span className="text-white-force">-{discountPercentage}%</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
            </div>
          </div>
        )}

        {/* Company Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Company Logo */}
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                {trip.companyLogo ? (
                  <img 
                    src={trip.companyLogo} 
                    alt={trip.companyName}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-white-force font-bold text-lg">
                    {trip.companyName?.charAt(0) || 'B'}
                  </span>
                )}
              </div>
              {trip.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white-force" />
                </div>
              )}
            </div>

            {/* Company Details */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {trip.companyName || 'Nhà xe uy tín'}
              </h3>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">
                    {trip.rating || '4.5'}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {trip.reviews || '1247'} đánh giá
                </span>
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-50 text-red-500' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-red-400'
            }`}
            title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite ? 'fill-current scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Bus Type & Features */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 bg-blue-100 px-3 py-1 rounded-full">
              {trip.busType || 'Giường nằm VIP'}
            </span>
            <span className="text-sm text-gray-600 flex items-center">
              <Shield className="w-4 h-4 text-green-500 mr-1" />
              An toàn 5 sao
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Mã chuyến: <span className="font-mono font-bold">{trip.id || 'ML2024'}</span>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          {/* Departure */}
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatTime(trip.departureTime) || '08:00'}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {new Date(trip.departureDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit'
              })}
            </div>
            <div className="flex items-center justify-center gap-1 text-gray-700">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{trip.departureStation || 'Bến xe Mỹ Đình'}</span>
            </div>
          </div>

          {/* Duration & Route */}
          <div className="flex flex-col items-center flex-1 px-4">
            <div className="flex items-center w-full mb-2">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              <div className="mx-4 flex flex-col items-center">
                <div className="relative">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 mt-1">
                  {calculateDuration(trip.departureTime, trip.arrivalTime) || '3h30m'}
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              {trip.distance || '120'} km
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatTime(trip.arrivalTime) || '11:30'}
            </div>
            <div className="text-sm text-gray-600 mb-2">Dự kiến</div>
            <div className="flex items-center justify-center gap-1 text-gray-700">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{trip.arrivalStation || 'Bến xe Hải Phòng'}</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {amenities.map((amenity, index) => {
            const amenityData = getAmenityIcon(amenity)
            const Icon = amenityData.icon
            return (
              <div 
                key={index}
                className="flex flex-col items-center group/amenity"
                title={amenityData.label}
              >
                <div className={`p-2 rounded-lg bg-gray-50 group-hover/amenity:bg-blue-50 transition-colors duration-300 ${amenityData.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-500 mt-1">{amenityData.label}</span>
              </div>
            )
          })}
          {trip.amenities?.length > 4 && (
            <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              +{trip.amenities.length - 4} tiện nghi
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex-1">
            <div className="text-sm text-gray-600 font-medium mb-1">Giá vé từ</div>
            <div className="flex items-baseline space-x-2">
              {trip.originalPrice && (
                <span className="text-lg text-gray-400 line-through font-semibold">
                  {formatCurrency(trip.originalPrice)}
                </span>
              )}
              <span className="text-3xl font-bold text-blue-600">
                {formatCurrency(trip.price || 120000)}
              </span>
              <span className="text-sm text-gray-600 font-medium">/người</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Đã bao gồm VAT & phí dịch vụ
            </div>
          </div>

          <div className="flex flex-col items-end space-y-3">
            {/* Available Seats */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Ghế trống</div>
              <div className="flex items-center justify-end space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mx-0.5 transition-all duration-300 ${
                        i < Math.min(trip.availableSeats || 15, 5)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-lg font-bold ${
                  (trip.availableSeats || 15) < 5 
                    ? 'text-orange-600' 
                    : 'text-green-600'
                }`}>
                  {trip.availableSeats || 15} ghế
                </span>
              </div>
            </div>

            {/* Book Button */}
            <Link
              to={`/trips/${trip.id}`}
              className="group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 group-hover/btn:from-blue-700 group-hover/btn:to-cyan-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform group-hover/btn:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span className="text-white-force">Chọn chuyến này</span>
                <ArrowRight className="w-5 h-5 text-white-force group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Xác nhận tức thì</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Đúng giờ 98%</span>
            </div>
          </div>
          <div className="text-gray-500 text-xs">
            <span className="font-medium">Chính sách hủy:</span> Hoàn 100% trước 2h
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripCard