import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { 
  Menu, X, User, LogOut, Settings, Search, MapPin, Calendar,
  ChevronDown, Bell, Phone, Mail, Globe
} from 'lucide-react'

const VeXeReNavbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext)
  const { notifications, unreadCount } = useContext(NotificationContext)
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const userMenuRef = useRef(null)
  const notificationsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const quickLinks = [
    { label: 'Vé xe', path: '/search-trips', icon: '🚌' },
    { label: 'Thuê xe', path: '/car-rental', icon: '🚗' },
    { label: 'Đưa đón sân bay', path: '/airport-transfer', icon: '✈️' },
    { label: 'Tour', path: '/tours', icon: '🏖️' },
  ]

  return (
    <>
      {/* Top Bar - Info */}
      <div className="bg-[#1861c5] text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:1900969681" className="flex items-center gap-2 hover:text-[#ffc600] transition-colors">
              <Phone className="w-4 h-4" />
              <span>1900 969 681</span>
            </a>
            <a href="mailto:hotro@vexere.com" className="flex items-center gap-2 hover:text-[#ffc600] transition-colors">
              <Mail className="w-4 h-4" />
              <span>hotro@vexere.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-[#ffc600] transition-colors">
              <Globe className="w-4 h-4" />
              <span>Tiếng Việt</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/vexere-logo.svg" 
                alt="VeXeRe" 
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <div className="text-[#1861c5] font-bold text-xl leading-tight">BusTicket</div>
                <div className="text-[#ffc600] text-xs font-medium">Đặt vé dễ dàng</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#1861c5] transition-colors font-medium"
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              {isAuthenticated && (
                <div ref={notificationsRef} className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-gray-600 hover:text-[#1861c5] rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto animate-fade-in-up">
                      <div className="sticky top-0 px-4 py-3 bg-gradient-to-r from-[#1861c5] to-[#2474E5] text-white border-b border-blue-700 flex items-center justify-between rounded-t-xl">
                        <h3 className="font-bold">Thông báo</h3>
                        {unreadCount > 0 && (
                          <button className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                            Đánh dấu đã đọc
                          </button>
                        )}
                      </div>
                      {notifications && notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div key={notif.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                            <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Không có thông báo mới</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* User Menu or Login/Register */}
              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#1861c5] to-[#2474E5] rounded-full flex items-center justify-center text-white font-bold">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:inline font-medium text-gray-900">
                      {user?.full_name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <p className="font-bold text-gray-900">{user?.full_name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full bg-[#ffc600] text-[#1861c5]">
                          {user?.role === 'admin' ? 'Quản trị' : user?.role === 'bus_company' ? 'Nhà xe' : 'Khách hàng'}
                        </span>
                      </div>

                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="w-5 h-5 text-[#1861c5]" />
                        <span className="font-medium">Tài khoản của tôi</span>
                      </Link>
                      <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <Calendar className="w-5 h-5 text-[#ffc600]" />
                        <span className="font-medium">Quản lý đơn hàng</span>
                      </Link>
                      <Link to="/profile/edit" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Cài đặt</span>
                      </Link>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-[#1861c5] hover:bg-blue-50 rounded-lg transition-all font-medium"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1861c5] to-[#2474E5] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-[#1861c5] rounded-lg hover:bg-gray-100 transition-all"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in-down">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default VeXeReNavbar
