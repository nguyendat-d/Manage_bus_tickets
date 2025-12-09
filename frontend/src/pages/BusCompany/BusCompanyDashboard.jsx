import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { BarChart3, Users, MapPin, DollarSign, Calendar, Settings, Bell, HelpCircle } from 'lucide-react'
import TripManagement from '../../components/bus-company/TripManagement'
import CompanyStats from '../../components/bus-company/CompanyStats'

const BusCompanyDashboard = () => {
  const { user } = useAuth()

  // Redirect to login if not authenticated or not bus company admin
  if (!user || user.userType !== 'company_admin') {
    return <Navigate to="/login" replace />
  }

  const [activeTab, setActiveTab] = React.useState('stats')

  const quickStats = [
    { label: 'Chuyến hôm nay', value: '12', change: '+2', color: 'blue' },
    { label: 'Vé đã bán', value: '45', change: '+8', color: 'green' },
    { label: 'Doanh thu', value: '12.5tr', change: '+1.2tr', color: 'purple' },
    { label: 'Tỷ lệ lấp đầy', value: '78%', change: '+5%', color: 'orange' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{user?.companyName?.charAt(0) || 'C'}</span>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Bảng Điều Khiển</h1>
                  <p className="text-gray-600">Chào mừng trở lại, {user?.companyName || 'Nhà xe'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <HelpCircle size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  stat.color === 'green' ? 'bg-green-100 text-green-800' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                <div className={`h-1 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-500' :
                  stat.color === 'green' ? 'bg-green-500' :
                  stat.color === 'purple' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`} style={{ width: '75%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'stats', label: 'Thống Kê', icon: BarChart3, description: 'Tổng quan hiệu suất' },
              { id: 'trips', label: 'Quản Lý Chuyến', icon: MapPin, description: 'Lịch trình & tuyến đường' },
              { id: 'buses', label: 'Xe Buýt', icon: Users, description: 'Đội xe & phương tiện' },
              { id: 'bookings', label: 'Đặt Vé', icon: DollarSign, description: 'Quản lý đặt chỗ' },
              { id: 'schedule', label: 'Lịch Trình', icon: Calendar, description: 'Lập kế hoạch chuyến' }
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center p-4 rounded-lg min-w-[120px] transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 border-2 border-blue-200 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <Icon size={24} className="mb-2" />
                  <span className={`font-medium text-sm ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                    {tab.label}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">{tab.description}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === 'stats' && 'Tổng Quan Hiệu Suất'}
            {activeTab === 'trips' && 'Quản Lý Chuyến Đi'}
            {activeTab === 'buses' && 'Quản Lý Đội Xe'}
            {activeTab === 'bookings' && 'Quản Lý Đặt Vé'}
            {activeTab === 'schedule' && 'Lịch Trình Chuyến Đi'}
          </h2>
          <p className="text-gray-600">
            {activeTab === 'stats' && 'Theo dõi hiệu suất và doanh thu của công ty'}
            {activeTab === 'trips' && 'Quản lý tất cả các chuyến đi và lịch trình'}
            {activeTab === 'buses' && 'Quản lý đội xe và phương tiện của bạn'}
            {activeTab === 'bookings' && 'Xem và quản lý tất cả đặt vé'}
            {activeTab === 'schedule' && 'Lập kế hoạch và quản lý lịch trình'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'stats' && <CompanyStats />}
          {activeTab === 'trips' && <TripManagement />}
          {activeTab === 'buses' && (
            <div className="text-center py-16">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý xe buýt</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tính năng quản lý đội xe sẽ sớm được cập nhật. Bạn có thể theo dõi và quản lý phương tiện của mình tại đây.
              </p>
              <button className="btn-primary">
                Thêm Xe Mới
              </button>
            </div>
          )}
          {activeTab === 'bookings' && (
            <div className="text-center py-16">
              <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý đặt vé</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tính năng quản lý đặt vé chi tiết sẽ sớm được cập nhật. Hiện tại bạn có thể xem thống kê tại tab Thống Kê.
              </p>
              <button className="btn-primary">
                Xem Báo Cáo Vé
              </button>
            </div>
          )}
          {activeTab === 'schedule' && (
            <div className="text-center py-16">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lịch trình chuyến đi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tính năng lập lịch trình chuyến đi sẽ sớm được cập nhật. Bạn có thể quản lý chuyến đi tại tab Quản Lý Chuyến.
              </p>
              <button className="btn-primary">
                Tạo Lịch Trình
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BusCompanyDashboard