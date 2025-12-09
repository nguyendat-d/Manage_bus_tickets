import React from 'react'
import BusManagement from '../../components/bus-company/BusManagement'
import { ArrowLeft, Plus, Search, Filter, Wifi, Snowflake, Zap, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const MyBuses = () => {
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
                  Quản Lý Đội Xe
                </h1>
                <p className="text-gray-600">
                  Quản lý và theo dõi tất cả phương tiện của công ty bạn
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="flex items-center justify-center space-x-2 btn-secondary px-4 py-2">
                  <Filter size={20} />
                  <span>Bộ Lọc</span>
                </button>
                <button className="flex items-center justify-center space-x-2 btn-primary px-4 py-2">
                  <Plus size={20} />
                  <span>Thêm Xe Mới</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Tổng Số Xe', 
              value: '24', 
              change: '+3', 
              color: 'blue',
              description: 'Đang hoạt động'
            },
            { 
              label: 'Xe Đang Chạy', 
              value: '18', 
              change: '+2', 
              color: 'green',
              description: 'Trên đường'
            },
            { 
              label: 'Xe Bảo Trì', 
              value: '4', 
              change: '-1', 
              color: 'yellow',
              description: 'Đang sửa chữa'
            },
            { 
              label: 'Xe Trống', 
              value: '2', 
              change: '0', 
              color: 'gray',
              description: 'Sẵn sàng'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  stat.color === 'green' ? 'bg-green-100 text-green-800' :
                  stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-500' :
                  stat.color === 'green' ? 'bg-green-500' :
                  stat.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`} style={{ width: '85%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm xe theo biển số, loại xe..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select className="input text-sm">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="available">Sẵn sàng</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
              
              <select className="input text-sm">
                <option value="">Tất cả loại xe</option>
                <option value="sleeper">Giường nằm</option>
                <option value="seater">Ghế ngồi</option>
                <option value="limousine">Limousine</option>
                <option value="van">Xe van</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bus Management Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <BusManagement />
        </div>

        {/* Amenities Overview */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Tiện Nghi Đội Xe</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Wifi, label: 'WiFi', count: '22/24', color: 'blue' },
              { icon: Snowflake, label: 'Điều Hòa', count: '24/24', color: 'green' },
              { icon: Zap, label: 'Sạc USB', count: '20/24', color: 'purple' },
              { icon: Users, label: 'TV Giải Trí', count: '18/24', color: 'orange' }
            ].map((amenity, index) => {
              const Icon = amenity.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    amenity.color === 'blue' ? 'bg-blue-100' :
                    amenity.color === 'green' ? 'bg-green-100' :
                    amenity.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon size={24} className={
                      amenity.color === 'blue' ? 'text-blue-600' :
                      amenity.color === 'green' ? 'text-green-600' :
                      amenity.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    } />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{amenity.label}</h4>
                  <p className="text-sm text-gray-600">{amenity.count} xe</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      amenity.color === 'blue' ? 'bg-blue-500' :
                      amenity.color === 'green' ? 'bg-green-500' :
                      amenity.color === 'purple' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} style={{ width: '85%' }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Bảo Trì Định Kỳ</h4>
            <p className="text-blue-700 text-sm mb-4">3 xe cần bảo trì trong tuần tới</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Xem lịch bảo trì →
            </button>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-green-900 mb-2">Bảo Hiểm</h4>
            <p className="text-green-700 text-sm mb-4">5 xe cần gia hạn bảo hiểm</p>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Quản lý bảo hiểm →
            </button>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h4 className="font-semibold text-purple-900 mb-2">Báo Cáo Hiệu Suất</h4>
            <p className="text-purple-700 text-sm mb-4">Xem hiệu suất từng xe</p>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Xem báo cáo →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyBuses