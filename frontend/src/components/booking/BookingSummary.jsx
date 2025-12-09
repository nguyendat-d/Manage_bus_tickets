import React from 'react'
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  CreditCard, 
  Shield,
  CheckCircle,
  Bus,
  Tag,
  Info
} from 'lucide-react'
import { formatCurrency, formatDateTime, formatTime, calculateDuration } from '../../utils/helpers'

const BookingSummary = ({ 
  trip, 
  selectedSeats = [], 
  passengers = [],
  paymentMethod = 'credit_card',
  discounts = [],
  insurance = false
}) => {
  const baseAmount = selectedSeats.length * (trip?.price || 0)
  const discountAmount = discounts.reduce((sum, discount) => sum + discount.amount, 0)
  const insuranceFee = insurance ? 10000 : 0 // 10,000 VND insurance fee
  const serviceFee = Math.round(baseAmount * 0.02) // 2% service fee
  const totalAmount = baseAmount - discountAmount + insuranceFee + serviceFee

  const getPaymentMethodIcon = (method) => {
    const icons = {
      vnpay: CreditCard,
      credit_card: CreditCard,
      debit_card: CreditCard,
      cash: '💵',
      momo: '📱',
      zalopay: '📱'
    }
    return icons[method] || CreditCard
  }

  const getPaymentMethodText = (method) => {
    const texts = {
      vnpay: 'VNPay',
      credit_card: 'Thẻ tín dụng',
      debit_card: 'Thẻ ghi nợ',
      cash: 'Tiền mặt',
      momo: 'Ví MoMo',
      zalopay: 'ZaloPay'
    }
    return texts[method] || 'Thẻ tín dụng'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Tóm Tắt Đơn Hàng</h3>
          <p className="text-gray-600 text-sm">Chi tiết chuyến đi của bạn</p>
        </div>
      </div>

      {/* Trip Information */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">Hành Trình</h4>
            <p className="text-gray-900 font-medium mt-1">
              {trip?.departure_station} → {trip?.arrival_station}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {trip?.departure_city} - {trip?.arrival_city}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Ngày Đi</h4>
              <p className="text-gray-600 text-sm mt-1">
                {trip?.departure_time ? formatDateTime(trip.departure_time, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : '--'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Thời Gian</h4>
              <p className="text-gray-600 text-sm mt-1">
                {trip?.departure_time ? formatTime(trip.departure_time) : '--'} - {trip?.arrival_time ? formatTime(trip.arrival_time) : '--'}
              </p>
              {trip?.departure_time && trip?.arrival_time && (
                <p className="text-gray-500 text-xs mt-1">
                  {calculateDuration(trip.departure_time, trip.arrival_time)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Bus className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Nhà Xe & Loại Xe</h4>
            <p className="text-gray-600 text-sm mt-1">{trip?.company_name || '--'}</p>
            {trip?.bus_type && (
              <p className="text-gray-500 text-xs mt-1 capitalize">
                {trip.bus_type}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Seats */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Ghế Đã Chọn ({selectedSeats.length})
        </h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSeats.map(seat => (
            <span 
              key={seat.number}
              className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200"
            >
              Ghế {seat.number}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{selectedSeats.length} ghế × {formatCurrency(trip?.price || 0)}</span>
          <span className="font-semibold text-gray-900">{formatCurrency(baseAmount)}</span>
        </div>
      </div>

      {/* Passengers */}
      {passengers.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Hành Khách</h4>
          <div className="space-y-3">
            {passengers.map((passenger, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {passenger.full_name || `Hành khách ${index + 1}`}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Ghế {selectedSeats[index]?.number} • {passenger.phone || 'Chưa cập nhật'}
                  </p>
                </div>
                {passenger.identification && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Đã xác thực
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          Phương Thức Thanh Toán
        </h4>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          {typeof getPaymentMethodIcon(paymentMethod) === 'string' ? (
            <span className="text-lg">{getPaymentMethodIcon(paymentMethod)}</span>
          ) : (
            <CreditCard className="w-5 h-5 text-gray-600" />
          )}
          <span className="font-medium text-gray-900 text-sm">
            {getPaymentMethodText(paymentMethod)}
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Giá vé</span>
          <span className="text-gray-900">{formatCurrency(baseAmount)}</span>
        </div>

        {/* Discounts */}
        {discounts.map((discount, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {discount.name}
            </span>
            <span className="text-green-600">-{formatCurrency(discount.amount)}</span>
          </div>
        ))}

        {/* Insurance */}
        {insurance && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Bảo hiểm hành trình
            </span>
            <span className="text-gray-900">{formatCurrency(insuranceFee)}</span>
          </div>
        )}

        {/* Service Fee */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí dịch vụ (2%)</span>
          <span className="text-gray-900">{formatCurrency(serviceFee)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="font-semibold text-gray-900 text-lg">Tổng cộng:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-800 text-sm font-medium">Đã bao gồm:</p>
            <ul className="text-green-700 text-xs mt-1 space-y-1">
              <li>• Thuế VAT 10%</li>
              <li>• Phí dịch vụ hệ thống</li>
              {insurance && <li>• Bảo hiểm hành trình</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <Shield className="w-3 h-3" />
        <span>Giao dịch được bảo mật và mã hóa</span>
      </div>
    </div>
  )
}

export default BookingSummary