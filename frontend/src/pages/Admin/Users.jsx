import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  Download,
  Shield,
  Building,
  User
} from 'lucide-react'
import UserManagement from '../../components/admin/UserManagement'
import { useNotification } from '../../contexts/NotificationContext'

const UsersPage = () => {
  const { showNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)

  const handleAddUser = () => {
    setShowAddUser(true)
  }

  const handleUserAdded = (user) => {
    setShowAddUser(false)
    showNotification(`Đã thêm người dùng ${user.name} thành công`, 'success')
  }

  const userStats = [
    { label: 'Tổng người dùng', value: '12,847', icon: Users, color: 'blue', change: '+5.2%' },
    { label: 'Hành khách', value: '11,234', icon: User, color: 'green', change: '+4.8%' },
    { label: 'Nhà xe', value: '47', icon: Building, color: 'purple', change: '+2.1%' },
    { label: 'Quản trị viên', value: '8', icon: Shield, color: 'red', change: '+0%' }
  ]

  const recentActivities = [
    { user: 'Nguyễn Văn A', action: 'Đăng ký tài khoản', time: '5 phút trước', type: 'success' },
    { user: 'Nhà Xe Phương Trang', action: 'Cập nhật thông tin', time: '12 phút trước', type: 'info' },
    { user: 'Trần Thị B', action: 'Xác thực email', time: '25 phút trước', type: 'success' },
    { user: 'Lê Văn C', action: 'Đặt vé thành công', time: '1 giờ trước', type: 'success' }
  ]

  return (
    <>
      <Helmet>
        <title>Quản Lý Người Dùng | Hệ Thống Quản Trị</title>
        <meta name="description" content="Quản lý người dùng hệ thống và phân quyền truy cập" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Quản Lý Người Dùng
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý người dùng hệ thống và phân quyền truy cập
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium text-gray-700"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="bus_company">Nhà xe</option>
                  <option value="passenger">Hành khách</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium text-gray-700"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="pending">Chờ xác thực</option>
                  <option value="banned">Đã khóa</option>
                </select>

                {/* Add User Button */}
                <button
                  onClick={handleAddUser}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Thêm Người Dùng
                </button>

                {/* Export Button */}
                <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {userStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-xs font-medium ${
                          stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change} so với tháng trước
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                        <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity & User Distribution */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hoạt Động Gần Đây
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                Xem tất cả hoạt động
              </button>
            </div>

            {/* User Distribution */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Phân Phối Người Dùng
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { role: 'Hành khách', count: '11,234', percentage: '87.4%', color: 'bg-green-500' },
                  { role: 'Nhà xe', count: '47', percentage: '0.4%', color: 'bg-purple-500' },
                  { role: 'Quản trị viên', count: '8', percentage: '0.1%', color: 'bg-red-500' },
                  { role: 'Chờ xác thực', count: '1,558', percentage: '12.1%', color: 'bg-yellow-500' }
                ].map((dist, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-3 h-3 ${dist.color} rounded-full mx-auto mb-2`}></div>
                    <p className="text-sm font-medium text-gray-900">{dist.role}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{dist.count}</p>
                    <p className="text-xs text-gray-600 mt-1">{dist.percentage}</p>
                  </div>
                ))}
              </div>
              
              {/* User Growth Chart Placeholder */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Tăng trưởng người dùng</span>
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                </div>
                <div className="w-full bg-white rounded-lg h-32 flex items-end justify-between p-2">
                  {[65, 80, 45, 90, 75, 85, 95].map((height, index) => (
                    <div
                      key={index}
                      className="w-8 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-700"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span>T7</span>
                  <span>CN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <UserManagement 
              searchQuery={searchQuery}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              onAddUser={handleAddUser}
              showAddForm={showAddUser}
              onUserAdded={handleUserAdded}
              onCancelAdd={() => setShowAddUser(false)}
            />
          </div>

          {/* User Management Tips */}
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mẹo Quản Lý Người Dùng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Xác Thực Nhanh',
                  description: 'Duyệt các tài khoản nhà xe chờ xác thực để kích hoạt nhanh dịch vụ',
                  count: '3 tài khoản'
                },
                {
                  title: 'Hỗ Trợ Người Dùng',
                  description: 'Kiểm tra và giải quyết các yêu cầu hỗ trợ từ người dùng',
                  count: '12 yêu cầu'
                },
                {
                  title: 'Bảo Mật Tài Khoản',
                  description: 'Theo dõi các hoạt động đăng nhập bất thường và bảo mật',
                  count: '0 cảnh báo'
                },
                {
                  title: 'Phân Tích Xu Hướng',
                  description: 'Phân tích xu hướng đăng ký và hoạt động người dùng',
                  count: 'Báo cáo'
                }
              ].map((tip, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {tip.count}
                    </span>
                    <button className="text-xs text-green-600 hover:text-green-700 font-medium">
                      Xử lý →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UsersPage