import React, { useState } from 'react'
import { 
  User, 
  Phone, 
  Mail, 
  IdCard, 
  MapPin,
  Calendar,
  Shield,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const PassengerForm = ({ 
  passengers = [], 
  onChange,
  seatCount = 1,
  isEditing = false
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const updatePassenger = (index, field, value) => {
    const updatedPassengers = [...passengers]
    if (!updatedPassengers[index]) {
      updatedPassengers[index] = {}
    }
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    }
    onChange(updatedPassengers)
  }

  const copyFromFirstPassenger = (index) => {
    if (index > 0 && passengers[0]) {
      const updatedPassengers = [...passengers]
      updatedPassengers[index] = { ...passengers[0] }
      onChange(updatedPassengers)
      
      // Show copied feedback
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const validatePhone = (phone) => {
    return /^\d{10,11}$/.test(phone.replace(/\D/g, ''))
  }

  const getValidationStatus = (passenger, field) => {
    if (!passenger[field]) return 'empty'
    
    switch (field) {
      case 'email':
        return validateEmail(passenger.email) ? 'valid' : 'invalid'
      case 'phone':
        return validatePhone(passenger.phone) ? 'valid' : 'invalid'
      case 'full_name':
        return passenger.full_name.length >= 2 ? 'valid' : 'invalid'
      default:
        return 'valid'
    }
  }

  const getValidationIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle size={16} className="text-green-500" />
      case 'invalid':
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Thông Tin Hành Khách</h3>
            <p className="text-blue-700 text-sm mt-1">
              Vui lòng nhập đầy đủ thông tin cho {seatCount} hành khách
              {!isEditing && " để hoàn tất đặt vé"}
            </p>
          </div>
        </div>
      </div>

      {Array.from({ length: seatCount }).map((_, index) => {
        const passenger = passengers[index] || {}
        const isFirstPassenger = index === 0
        
        return (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Passenger Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    Hành khách {index + 1}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Ghế {passengers[index]?.seatNumber || `#${index + 1}`}
                  </p>
                </div>
              </div>

              {/* Copy Button for additional passengers */}
              {!isFirstPassenger && passengers[0] && (
                <button
                  type="button"
                  onClick={() => copyFromFirstPassenger(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    copiedIndex === index
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {copiedIndex === index ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                  {copiedIndex === index ? 'Đã sao chép' : 'Sao chép từ HK1'}
                </button>
              )}
            </div>
            
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={passenger.full_name || ''}
                    onChange={(e) => updatePassenger(index, 'full_name', e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon(getValidationStatus(passenger, 'full_name'))}
                  </div>
                </div>
                {getValidationStatus(passenger, 'full_name') === 'invalid' && passenger.full_name && (
                  <p className="text-red-500 text-xs mt-2">Tên phải có ít nhất 2 ký tự</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={passenger.phone || ''}
                    onChange={(e) => updatePassenger(index, 'phone', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="0901234567"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon(getValidationStatus(passenger, 'phone'))}
                  </div>
                </div>
                {getValidationStatus(passenger, 'phone') === 'invalid' && passenger.phone && (
                  <p className="text-red-500 text-xs mt-2">Số điện thoại không hợp lệ</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={passenger.email || ''}
                    onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="your@email.com"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon(getValidationStatus(passenger, 'email'))}
                  </div>
                </div>
                {getValidationStatus(passenger, 'email') === 'invalid' && passenger.email && (
                  <p className="text-red-500 text-xs mt-2">Email không hợp lệ</p>
                )}
              </div>

              {/* Identification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  CMND/CCCD <span className="text-gray-500 text-sm">(Tùy chọn)</span>
                </label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={passenger.identification || ''}
                    onChange={(e) => updatePassenger(index, 'identification', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="123456789012"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">Giúp làm thủ tục nhanh hơn</p>
              </div>
            </div>

            {/* Address (Optional) */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Địa chỉ liên hệ <span className="text-gray-500 text-sm">(Tùy chọn)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="text"
                  value={passenger.address || ''}
                  onChange={(e) => updatePassenger(index, 'address', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ghi chú đặc biệt <span className="text-gray-500 text-sm">(Tùy chọn)</span>
              </label>
              <textarea
                value={passenger.notes || ''}
                onChange={(e) => updatePassenger(index, 'notes', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                placeholder="Ví dụ: Hành khách cao tuổi, trẻ em, yêu cầu đặc biệt..."
              />
            </div>

            {/* Validation Status */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Trạng thái thông tin</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {getValidationStatus(passenger, 'full_name') === 'valid' &&
                     getValidationStatus(passenger, 'email') === 'valid' &&
                     getValidationStatus(passenger, 'phone') === 'valid'
                      ? '✅ Đã đủ thông tin bắt buộc'
                      : '⚠️ Thiếu thông tin bắt buộc'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-900 text-sm mb-2">Lưu ý quan trọng</h4>
            <ul className="text-yellow-800 text-sm space-y-2">
              <li>• Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
              <li>• Thông tin sẽ được sử dụng để làm thủ tục lên xe và liên hệ khi cần</li>
              <li>• Đảm bảo số điện thoại chính xác để nhận thông báo quan trọng</li>
              <li>• Email sẽ nhận được vé điện tử và hóa đơn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PassengerForm