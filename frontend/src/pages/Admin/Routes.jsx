import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  MapPin, 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react'
import RouteManagement from '../../components/admin/RouteManagement'
import { useNotification } from '../../contexts/NotificationContext'

const Routes = () => {
  const { showNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState('')
  const [popularityFilter, setPopularityFilter] = useState('all')
  const [showAddRoute, setShowAddRoute] = useState(false)

  const handleAddRoute = () => {
    setShowAddRoute(true)
  }

  const handleRouteAdded = (route) => {
    setShowAddRoute(false)
    showNotification(`Đã thêm tuyến đường ${route.from} - ${route.to} thành công`, 'success')
  }

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Sài Gòn', trips: 48, occupancy: 92, revenue: '125M' },
    { from: 'Đà Nẵng', to: 'Nha Trang', trips: 32, occupancy: 88, revenue: '78M' },
    { from: 'Hải Phòng', to: 'Huế', trips: 28, occupancy: 85, revenue: '64M' },
    { from: 'Cần Thơ', to: 'Vũng Tàu', trips: 24, occupancy: 82, revenue: '53M' }
  ]

  return (
    <>
      <Helmet>
        <title>Quản Lý Tuyến Đường | Hệ Thống Quản Trị</title>
        <meta name="description" content="Quản lý hệ thống tuyến đường và lộ trình xe khách" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Quản Lý Tuyến Đường
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý hệ thống tuyến đường và lộ trình xe khách
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tuyến đường..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                </div>

                {/* Popularity Filter */}
                <select
                  value={popularityFilter}
                  onChange={(e) => setPopularityFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm font-medium text-gray-700"
                >
                  <option value="all">Tất cả độ phổ biến</option>
                  <option value="high">Rất phổ biến</option>
                  <option value="medium">Phổ biến</option>
                  <option value="low">Ít phổ biến</option>
                </select>

                {/* Add Route Button */}
                <button
                  onClick={handleAddRoute}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Tuyến Đường
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Tổng số tuyến', value: '156', icon: MapPin, color: 'purple' },
                { label: 'Tuyến đang hoạt động', value: '142', icon: TrendingUp, color: 'green' },
                { label: 'Tuyến mới tháng', value: '8', icon: Clock, color: 'blue' },
                { label: 'Nhà xe hợp tác', value: '47', icon: Users, color: 'orange' }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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

          {/* Popular Routes Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tuyến Đường Phổ Biến</h2>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Xem tất cả
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRoutes.map((route, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {route.from} - {route.to}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{route.trips} chuyến/ngày</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Tỷ lệ lấp đầy</span>
                        <span className="font-medium text-green-600">{route.occupancy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${route.occupancy}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Doanh thu</span>
                      <span className="font-bold text-green-600">{route.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <RouteManagement 
              searchQuery={searchQuery}
              popularityFilter={popularityFilter}
              onAddRoute={handleAddRoute}
              showAddForm={showAddRoute}
              onRouteAdded={handleRouteAdded}
              onCancelAdd={() => setShowAddRoute(false)}
            />
          </div>

          {/* Route Optimization Tips */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gợi Ý Tối Ưu Tuyến Đường
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Phân Tích Giờ Cao Điểm',
                  description: 'Tăng tần suất chạy cho các tuyến có nhu cầu cao vào giờ cao điểm',
                  action: 'Xem báo cáo'
                },
                {
                  title: 'Tuyến Đường Mới Tiềm Năng',
                  description: 'Phân tích dữ liệu để phát hiện các tuyến đường mới có nhu cầu',
                  action: 'Đề xuất'
                },
                {
                  title: 'Tối Ưu Giá Vé',
                  description: 'Điều chỉnh giá vé dựa trên nhu cầu và đối thủ cạnh tranh',
                  action: 'Phân tích'
                },
                {
                  title: 'Cải Thiện Trải Nghiệm',
                  description: 'Thu thập phản hồi để cải thiện chất lượng dịch vụ',
                  action: 'Xem đánh giá'
                }
              ].map((tip, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {tip.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Routes