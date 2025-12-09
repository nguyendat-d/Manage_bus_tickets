import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { 
  Users, 
  MapPin, 
  Building, 
  BarChart3, 
  Home,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Search,
  TrendingUp,
  DollarSign,
  Calendar,
  UserCheck
} from 'lucide-react'

// SỬA LẠI CÁC IMPORT - đường dẫn chính xác
import UserManagement from '../../components/admin/UserManagement'
import RouteManagement from '../../components/admin/RouteManagement'
import CompanyManagement from '../../components/admin/CompanyManagement'
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard'

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Mock user data - replace with actual auth check
    setUser({
      name: 'Admin User',
      email: 'admin@busticket.com',
      role: 'Super Admin',
      avatar: '/avatars/admin.jpg'
    })
  }, [])

  const navigation = [
    { name: 'Tổng quan', href: '/admin', icon: Home, badge: null },
    { name: 'Quản lý người dùng', href: '/admin/users', icon: Users, badge: '12' },
    { name: 'Quản lý tuyến đường', href: '/admin/routes', icon: MapPin, badge: '45' },
    { name: 'Quản lý nhà xe', href: '/admin/companies', icon: Building, badge: '23' },
    { name: 'Thống kê & Báo cáo', href: '/admin/analytics', icon: BarChart3, badge: null },
  ]

  const quickStats = [
    { label: 'Doanh thu hôm nay', value: '12.5M', change: '+12%', icon: DollarSign, color: 'green' },
    { label: 'Đơn đặt mới', value: '156', change: '+8%', icon: UserCheck, color: 'blue' },
    { label: 'Chuyến xe hôm nay', value: '89', change: '+5%', icon: Calendar, color: 'purple' },
    { label: 'Tỷ lệ thành công', value: '98.2%', change: '+2%', icon: TrendingUp, color: 'orange' },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">A</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">BusTicket</span>
                <div className="text-xs text-blue-200">Admin Panel</div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-blue-200 truncate">{user.email}</p>
                <p className="text-xs text-blue-300">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative
                    ${isActive(item.href)
                      ? 'bg-white text-blue-700 shadow-lg'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} className="mr-3 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  
                  {item.badge && (
                    <span className={`
                      inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-6
                      ${isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-blue-600 text-white'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
            <div className="space-y-2">
              <Link
                to="/admin/settings"
                className="flex items-center px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Settings size={16} className="mr-3" />
                Cài đặt
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <LogOut size={16} className="mr-3" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0 min-h-screen">
          {/* Top Bar - Desktop */}
          <div className="hidden lg:flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-6 ml-6">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                        <Icon size={16} className={`text-${stat.color}-600`} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
                        <div className={`text-xs text-${stat.color}-600`}>{stat.change}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route index element={<AnalyticsDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="routes" element={<RouteManagement />} />
              <Route path="companies" element={<CompanyManagement />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default AdminDashboard