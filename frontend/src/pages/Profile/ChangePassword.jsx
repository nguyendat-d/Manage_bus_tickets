import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Shield, Key, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const ChangePassword = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (error) setError('')
  }

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validatePassword = (password) => {
    const minLength = password.length >= 6
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    const passwordValidation = validatePassword(formData.newPassword)
    if (!passwordValidation.isValid) {
      setError('Mật khẩu mới không đủ mạnh')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại')
      return
    }

    setLoading(true)

    try {
      // Simulate API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = validatePassword(formData.newPassword)

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/profile" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại hồ sơ
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Key className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Thay Đổi Mật Khẩu</h1>
                <p className="text-gray-600 mt-1">Cập nhật mật khẩu của tài khoản {user.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-green-700 font-medium">Mật khẩu đã được thay đổi thành công!</p>
                    <p className="text-green-600 text-sm mt-1">Bạn có thể sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mật Khẩu Hiện Tại
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('current')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mật Khẩu Mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('new')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Độ mạnh mật khẩu:</span>
                        <span className={`font-medium ${
                          passwordStrength.isValid ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {passwordStrength.isValid ? 'Mạnh' : 'Trung bình'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            passwordStrength.minLength ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={passwordStrength.minLength ? 'text-green-600' : 'text-gray-500'}>
                            Ít nhất 6 ký tự
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            passwordStrength.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                            Chữ hoa (A-Z)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            passwordStrength.hasLowerCase ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                            Chữ thường (a-z)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            passwordStrength.hasNumbers ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={passwordStrength.hasNumbers ? 'text-green-600' : 'text-gray-500'}>
                            Số (0-9)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            passwordStrength.hasSpecialChar ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                            Ký tự đặc biệt
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Xác Nhận Mật Khẩu Mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('confirm')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        formData.newPassword === formData.confirmPassword ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={
                        formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                      }>
                        {formData.newPassword === formData.confirmPassword ? 'Mật khẩu trùng khớp' : 'Mật khẩu không trùng khớp'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      'Cập Nhật Mật Khẩu'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-blue-600" size={24} />
            <h3 className="font-bold text-gray-900 text-lg">Mẹo Bảo Mật Mật Khẩu</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Sử dụng mật khẩu dài ít nhất 12 ký tự kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Không sử dụng thông tin cá nhân như tên, ngày sinh, số điện thoại trong mật khẩu</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Sử dụng mật khẩu khác nhau cho các tài khoản quan trọng</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Thay đổi mật khẩu định kỳ 3-6 tháng một lần</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword