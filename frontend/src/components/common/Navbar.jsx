import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { 
  Menu, X, User, LogOut, Settings, Ticket, Building, Shield,
  Bell, Search, MapPin, Calendar, ChevronDown, CreditCard,
  HelpCircle, Star, MessageCircle, Phone, Mail,
  Moon, Sun, Languages, Sparkles, Zap, Award, TrendingUp
} from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext)
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const userMenuRef = useRef(null)
  const notificationsRef = useRef(null)
  const searchRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && isSearchExpanded) {
        setIsSearchExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchExpanded])

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const isActiveRoute = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchExpanded(false)
      setIsMenuOpen(false)
    }
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: { 
        color: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
        label: 'Quản trị', 
        icon: Shield 
      },
      bus_company: { 
        color: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
        label: 'Nhà xe', 
        icon: Building 
      },
      user: { 
        color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-300',
        label: 'Thành viên', 
        icon: User 
      }
    }
    const config = badges[role] || badges.user
    const Icon = config.icon
    return { ...config, icon: Icon }
  }

  const quickDestinations = [
    { name: 'Hà Nội → Sài Gòn', path: '/search?from=Hà Nội&to=TP. Hồ Chí Minh' },
    { name: 'Đà Nẵng → Nha Trang', path: '/search?from=Đà Nẵng&to=Nha Trang' },
    { name: 'Hải Phòng → Huế', path: '/search?from=Hải Phòng&to=Huế' },
    { name: 'Cần Thơ → Vũng Tàu', path: '/search?from=Cần Thơ&to=Vũng Tàu' }
  ]

  const NotificationItem = ({ notification }) => {
    const getNotificationIcon = () => {
      switch (notification.type) {
        case 'success': return '✅'
        case 'warning': return '⚠️'
        case 'error': return '❌'
        case 'promo': return '🎁'
        case 'booking': return '🎫'
        default: return '🔔'
      }
    }

    const getNotificationColor = () => {
      switch (notification.type) {
        case 'success': return 'bg-green-100 text-green-800'
        case 'warning': return 'bg-yellow-100 text-yellow-800'
        case 'error': return 'bg-red-100 text-red-800'
        case 'promo': return 'bg-purple-100 text-purple-800'
        case 'booking': return 'bg-blue-100 text-blue-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    return (
      <div 
        className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${
          !notification.read ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' : ''
        }`}
        onClick={() => markAsRead(notification.id)}
      >
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getNotificationColor()}`}>
            {getNotificationIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
              {!notification.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const UserAvatar = () => (
    <div className="relative group">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
    </div>
  )

  const QuickSearchButton = () => (
    <button
      onClick={() => setIsSearchExpanded(!isSearchExpanded)}
      className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-xl transition-all duration-300 group"
    >
      <Search className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
      <span className="text-sm text-gray-700">Tìm chuyến xe...</span>
      <kbd className="hidden xl:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-500 bg-white border border-gray-300 rounded">
        ⌘K
      </kbd>
    </button>
  )

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg' 
        : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white fill-current" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  BusTicket
                </span>
                <div className="text-xs text-gray-600 dark:text-gray-400 -mt-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Đặt vé dễ dàng
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActiveRoute('/') 
                  ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>Trang chủ</span>
            </Link>
            
            <Link 
              to="/search" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActiveRoute('/search') 
                  ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Search size={16} />
              <span>Tìm chuyến xe</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/my-bookings" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActiveRoute('/my-bookings') 
                      ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Ticket size={16} />
                  <span>Vé của tôi</span>
                </Link>
                
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActiveRoute('/admin') 
                        ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Shield size={16} />
                    <span>Quản lý</span>
                  </Link>
                )}
                
                {user?.role === 'bus_company' && (
                  <Link 
                    to="/bus-company" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActiveRoute('/bus-company') 
                        ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Building size={16} />
                    <span>Nhà xe</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
              title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Quick Search Button */}
            <div className="hidden lg:block" ref={searchRef}>
              <QuickSearchButton />
            </div>

            {/* Mobile Search Button */}
            <button 
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              onClick={() => navigate('/search')}
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notificationsRef}>
                <button 
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200 group"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-scale-in">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Thông báo</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <NotificationItem key={notification.id} notification={notification} />
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={24} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">Không có thông báo</p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                            Tất cả thông báo sẽ hiển thị ở đây
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                      <Link
                        to="/notifications"
                        className="block text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        Xem tất cả thông báo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white text-left">
                      {user?.full_name || user?.email}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(user?.role).color}`}>
                        {getRoleBadge(user?.role).label}
                      </span>
                    </div>
                  </div>
                  <UserAvatar />
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-scale-in">
                    {/* User Info */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30">
                      <div className="flex items-center space-x-4">
                        <UserAvatar />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {user?.full_name || user?.email}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(user?.role).color}`}>
                              {getRoleBadge(user?.role).label}
                            </span>
                            {user?.is_verified && (
                              <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2 py-1 rounded-full border border-green-300">
                                ✅ Đã xác thực
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={18} className="mr-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <div>
                          <div className="font-medium">Hồ sơ cá nhân</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Quản lý thông tin tài khoản</div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Ticket size={18} className="mr-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <div>
                          <div className="font-medium">Vé của tôi</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Lịch sử đặt vé</div>
                        </div>
                      </Link>

                      <Link
                        to="/payment-methods"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CreditCard size={18} className="mr-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <div>
                          <div className="font-medium">Phương thức thanh toán</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Quản lý thẻ và ví</div>
                        </div>
                      </Link>

                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings size={18} className="mr-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          <div>
                            <div className="font-medium">Cài đặt</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Tùy chỉnh tài khoản</div>
                          </div>
                        </Link>

                        <Link
                          to="/help"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HelpCircle size={18} className="mr-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          <div>
                            <div className="font-medium">Trợ giúp</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Hỗ trợ và hướng dẫn</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200 group"
                      >
                        <LogOut size={18} className="mr-3" />
                        <div>
                          <div className="font-medium">Đăng xuất</div>
                          <div className="text-xs text-red-500 dark:text-red-400">Kết thúc phiên làm việc</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Expanded Search Bar */}
        {isSearchExpanded && (
          <div className="py-4 animate-fade-in-down" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm chuyến xe, điểm đến, nhà xe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-500 transition-all duration-300"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
              >
                Tìm kiếm
              </button>
            </form>
            
            {/* Quick destinations */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickDestinations.map((dest, index) => (
                <Link
                  key={index}
                  to={dest.path}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  onClick={() => setIsSearchExpanded(false)}
                >
                  <MapPin size={14} className="text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-700">{dest.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg rounded-b-2xl overflow-hidden animate-fade-in-down">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm chuyến xe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </form>
            </div>

            {/* Mobile Menu Items */}
            <div className="py-2">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Trang chủ</span>
              </Link>
              <Link
                to="/search"
                className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={18} className="mr-3" />
                <span>Tìm chuyến xe</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-bookings"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Ticket size={18} className="mr-3" />
                    <span>Vé của tôi</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield size={18} className="mr-3" />
                      <span>Quản lý hệ thống</span>
                    </Link>
                  )}
                  
                  {user?.role === 'bus_company' && (
                    <Link
                      to="/bus-company"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Building size={18} className="mr-3" />
                      <span>Quản lý nhà xe</span>
                    </Link>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} className="mr-3" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Auth Buttons for Mobile */}
            {!isAuthenticated && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar