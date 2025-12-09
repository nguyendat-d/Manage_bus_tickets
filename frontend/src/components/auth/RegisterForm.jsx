import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle,
  UserPlus,
  Building,
  Shield,
  Bus,
  ArrowLeft,
  Check,
  X
} from 'lucide-react'

// SỬA: Thêm prop success
const RegisterForm = ({ onSubmit, loading = false, error = '', success = '' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'passenger'
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    setPasswordStrength((strength / 5) * 100)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500'
    if (passwordStrength < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Rất yếu'
    if (passwordStrength < 70) return 'Trung bình'
    return 'Mạnh'
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên'
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu'
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không trùng khớp'
    }

    if (!acceptedTerms) {
      errors.terms = 'Vui lòng chấp nhận điều khoản sử dụng'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Prepare data for parent component
    let role = 'passenger'
    if (formData.userType === 'company_admin') {
      role = 'bus_company'
    } else if (formData.userType === 'driver') {
      role = 'driver'
    }

    const userData = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.replace(/\D/g, ''),
      password: formData.password,
      role: role
    }

    // Call parent onSubmit
    onSubmit(userData)
  }

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`
    if (numbers.length <= 10) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData(prev => ({ ...prev, phone: formatted }))
  }

  const getUserTypeConfig = (type) => {
    const configs = {
      passenger: {
        icon: User,
        title: 'Hành Khách',
        description: 'Đặt vé và quản lý hành trình',
        color: 'blue'
      },
      driver: {
        icon: Bus,
        title: 'Tài Xế',
        description: 'Quản lý chuyến xe và lịch trình',
        color: 'green'
      },
      company_admin: {
        icon: Building,
        title: 'Quản Lý Nhà Xe',
        description: 'Quản lý đội xe và hoạt động',
        color: 'purple'
      }
    }
    return configs[type] || configs.passenger
  }

  // XÓA PHẦN success state và condition rendering ở đây
  // Thay vào đó hiển thị success message từ parent

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Registration Form */}
        <div className="p-8 lg:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tạo Tài Khoản</h2>
              <p className="text-gray-600 mt-1">Bắt đầu hành trình của bạn</p>
            </div>
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Đăng nhập</span>
            </Link>
          </div>

          {/* Success Message from parent */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Thành công!</p>
                <p className="mt-1">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message from parent */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <X size={12} className="text-red-500" />
              </div>
              <div>
                <p className="font-medium">Không thể đăng ký</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Loại Tài Khoản
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['passenger', 'driver', 'company_admin'].map((type) => {
                  const config = getUserTypeConfig(type)
                  const Icon = config.icon
                  const isSelected = formData.userType === type
                  
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: type }))}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        isSelected 
                          ? `border-${config.color}-500 bg-${config.color}-50` 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? `bg-${config.color}-100` : 'bg-gray-100'
                        }`}>
                          <Icon size={20} className={isSelected ? `text-${config.color}-600` : 'text-gray-600'} />
                        </div>
                        <div>
                          <div className={`font-medium text-sm ${
                            isSelected ? `text-${config.color}-900` : 'text-gray-900'
                          }`}>
                            {config.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {config.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Họ Và Tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      fieldErrors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      fieldErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="090 123 4567"
                    maxLength={15}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      fieldErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Empty column for grid alignment */}
              <div></div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mật Khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    fieldErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Độ mạnh mật khẩu:</span>
                    <span className={`font-medium ${
                      passwordStrength < 40 ? 'text-red-600' :
                      passwordStrength < 70 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    fieldErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className={`flex items-center gap-2 mt-2 text-sm ${
                  formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    formData.password === formData.confirmPassword ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <X size={12} className="text-red-500" />
                    )}
                  </div>
                  <span>
                    {formData.password === formData.confirmPassword ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                  </span>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <label className="text-sm text-gray-600 cursor-pointer">
                Tôi đồng ý với{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                  điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  chính sách bảo mật
                </a>
              </label>
            </div>
            {fieldErrors.terms && (
              <p className="text-xs text-red-600">{fieldErrors.terms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <UserPlus size={20} />
              )}
              <span>{loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}</span>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="hidden lg:block bg-gradient-to-br from-blue-700 to-purple-800 p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Tham Gia Cộng Đồng BusTicket</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Kết nối với hàng ngàn hành khách và nhà xe uy tín. 
                Trải nghiệm dịch vụ đặt vé thông minh và an toàn.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 mt-8">
              {[
                { text: 'Đặt vé nhanh chóng trong 3 phút' },
                { text: 'Hỗ trợ 24/7 mọi lúc mọi nơi' },
                { text: 'Thanh toán an toàn, đa dạng' },
                { text: 'Tích lũy điểm thưởng hấp dẫn' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-blue-100">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-blue-500 border-opacity-30">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-blue-200 text-sm">Thành viên</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-blue-200 text-sm">Đối tác</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-blue-200 text-sm">Hài lòng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-blue-200 text-sm">Hỗ trợ</div>
              </div>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -mr-32 -mb-32"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -ml-16 -mt-16"></div>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm