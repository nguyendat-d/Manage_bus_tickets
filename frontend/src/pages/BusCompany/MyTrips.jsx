import React from 'react'
import TripManagement from '../../components/bus-company/TripManagement'
import { ArrowLeft, Plus, Search, Filter, Calendar, MapPin, Users, Clock, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

const MyTrips = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/company/dashboard" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại Dashboard
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Quản Lý Chuyến Đi
                </h1>
                <p className="text-gray-600">
                  Quản lý lịch trình và các chuyến xe của công ty bạn
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="flex items-center justify-center space-x-2 btn-secondary px-4 py-2">
                  <Calendar size={20} />
                  <span>Lịch Trình</span>
                </button>
                <button className="flex items-center justify-center space-x-2 btn-secondary px-4 py-2">
                  <Download size={20} />
                  <span>Xuất DS</span>
                </button>
                <button className="flex items-center justify-center space-x-2 btn-primary px-4 py-2">
                  <Plus size={20} />
                  <span>Tạo Chuyến Mới</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Chuyến Hôm Nay', 
              value: '12', 
              change: '+2', 
              color: 'blue',
              description: 'Đang hoạt động',
              icon: Clock
            },
            { 
              label: 'Chuyến Đang Chạy', 
              value: '8', 
              change: '+1', 
              color: 'green',
              description: 'Trên đường',
              icon: MapPin
            },
            { 
              label: 'Chuyến Sắp Tới', 
              value: '15', 
              change: '+3', 
              color: 'purple',
              description: '24h tới',
              icon: Calendar
            },
            { 
              label: 'Chuyến Hoàn Thành', 
              value: '45', 
              change: '+12', 
              color: 'orange',
              description: 'Tuần này',
              icon: Users
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <Icon size={20} className={
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      } />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
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
                <p className="text-xs text-gray-500">{stat.description}</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${
                    stat.color === 'blue' ? 'bg-blue-500' :
                    stat.color === 'green' ? 'bg-green-500' :
                    stat.color === 'purple' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} style={{ width: '75%' }}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm chuyến theo tuyến đường, biển số..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select className="input text-sm">
                <option value="">Tất cả trạng thái</option>
                <option value="scheduled">Đã lên lịch</option>
                <option value="active">Đang chạy</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              
              <select className="input text-sm">
                <option value="">Tất cả tuyến đường</option>
                <option value="hanoi-haiphong">Hà Nội - Hải Phòng</option>
                <option value="hanoi-danang">Hà Nội - Đà Nẵng</option>
                <option value="hanoi-saigon">Hà Nội - Sài Gòn</option>
                <option value="haiphong-quangninh">Hải Phòng - Quảng Ninh</option>
              </select>

              <input
                type="date"
                className="input text-sm"
                placeholder="Chọn ngày"
              />

              <button className="flex items-center justify-center space-x-2 btn-secondary px-4 py-2">
                <Filter size={20} />
                <span>Thêm Bộ Lọc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Trips Alert */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Chuyến sắp khởi hành</h4>
                  <p className="text-blue-700 text-sm">3 chuyến sẽ khởi hành trong 2 giờ tới</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem chi tiết →
              </button>
            </div>
          </div>
        </div>

        {/* Trip Management Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <TripManagement />
        </div>

        {/* Popular Routes & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Routes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuyến Đường Phổ Biến</h3>
            <div className="space-y-4">
              {[
                { 
                  route: 'Hà Nội - Hải Phòng', 
                  trips: 24, 
                  occupancy: '82%', 
                  revenue: '45.2M',
                  trend: 'up'
                },
                { 
                  route: 'Hà Nội - Đà Nẵng', 
                  trips: 18, 
                  occupancy: '76%', 
                  revenue: '38.7M',
                  trend: 'up'
                },
                { 
                  route: 'Hà Nội - Sài Gòn', 
                  trips: 12, 
                  occupancy: '88%', 
                  revenue: '52.1M',
                  trend: 'up'
                },
                { 
                  route: 'Hải Phòng - Quảng Ninh', 
                  trips: 15, 
                  occupancy: '71%', 
                  revenue: '28.5M',
                  trend: 'down'
                }
              ].map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900">{route.route}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        route.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {route.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{route.trips} chuyến</span>
                      <span>•</span>
                      <span>{route.occupancy} lấp đầy</span>
                      <span>•</span>
                      <span>{route.revenue}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Schedule Planning */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lập Lịch Nhanh</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
                  <div className="font-medium text-gray-900">Tạo chuyến lặp lại</div>
                  <div className="text-sm text-gray-600">Lập lịch chuyến đi định kỳ hàng ngày/tuần</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200">
                  <div className="font-medium text-gray-900">Sao chép lịch trình</div>
                  <div className="text-sm text-gray-600">Sao chép lịch trình từ ngày khác</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200">
                  <div className="font-medium text-gray-900">Import từ Excel</div>
                  <div className="text-sm text-gray-600">Tải lên lịch trình từ file Excel</div>
                </button>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">Thông Báo Hệ Thống</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">2 chuyến cần xác nhận</p>
                    <p className="text-xs text-orange-700">Cần xác nhận trước 1 giờ khởi hành</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">1 xe cần bảo trì</p>
                    <p className="text-xs text-orange-700">Xe 29B-123.45 cần kiểm tra định kỳ</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium text-center">
                Xem tất cả thông báo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyTrips