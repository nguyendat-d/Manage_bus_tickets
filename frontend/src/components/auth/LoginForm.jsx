import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext' // SỬA IMPORT NÀY
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  Shield,
  Building,
  Bus,
  CheckCircle
} from 'lucide-react'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user, isAuthenticated } = useAuth() // SỬA: THÊM isAuthenticated

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message)
      // Clear the state to avoid showing the message again on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      const result = await login(email, password, rememberMe)
      
      if (result.success) {
        // Show success message briefly before redirect
        setSuccess('Đăng nhập thành công! Đang chuyển hướng...')
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/'
          navigate(from, { replace: true })
        }, 1000)
      } else {
        setError(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      passenger: { email: 'hanhkhach@demo.com', password: '123456' },
      company: { email: 'nhaxe@demo.com', password: '123456' },
      admin: { email: 'admin@demo.com', password: '123456' }
    }

    const account = demoAccounts[role]
    if (account) {
      setEmail(account.email)
      setPassword(account.password)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Login Form */}
          <div className="p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900">BusTicket</h1>
                  <p className="text-sm text-gray-600">Đặt vé xe thông minh</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Chào Mừng Trở Lại</h2>
              <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục trải nghiệm</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Thành công!</p>
                  <p className="mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div>
                  <p className="font-medium">Có lỗi xảy ra</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mật Khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-gray-700 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
                  />
                  <span className="group-hover:text-gray-900 transition-colors">Ghi nhớ đăng nhập</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogIn size={20} />
                )}
                <span>{loading ? 'Đang xử lý...' : 'Đăng Nhập'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Hoặc tiếp tục với</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-3 mb-8">
              <p className="text-sm text-gray-600 text-center mb-4">Tài khoản demo (click để điền):</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleDemoLogin('passenger')}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <UserPlus size={16} className="text-blue-600 group-hover:text-blue-700" />
                  <span className="text-sm font-medium text-gray-700">Hành khách</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('company')}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <Building size={16} className="text-green-600 group-hover:text-green-700" />
                  <span className="text-sm font-medium text-gray-700">Nhà xe</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <Shield size={16} className="text-purple-600 group-hover:text-purple-700" />
                  <span className="text-sm font-medium text-gray-700">Quản trị</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <UserPlus size={16} />
                  <span>Đăng ký ngay</span>
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
                  <Bus className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Hệ Thống Đặt Vé Xe Thông Minh</h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Trải nghiệm dịch vụ đặt vé xe hiện đại, nhanh chóng và tiện lợi. 
                  Kết nối mọi hành trình của bạn.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mt-8">
                {[
                  { icon: Shield, text: 'Bảo mật tuyệt đối' },
                  { icon: CheckCircle, text: 'Thanh toán an toàn' },
                  { icon: Building, text: '100+ nhà xe đối tác' },
                  { icon: UserPlus, text: 'Hỗ trợ 24/7' }
                ].map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-center gap-3 text-blue-100">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Icon size={16} className="text-white" />
                      </div>
                      <span>{feature.text}</span>
                    </div>
                  )
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-blue-500 border-opacity-30">
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-blue-200 text-sm">Hành khách</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-blue-200 text-sm">Nhà xe</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-blue-200 text-sm">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -mr-32 -mb-32"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -ml-16 -mt-16"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm