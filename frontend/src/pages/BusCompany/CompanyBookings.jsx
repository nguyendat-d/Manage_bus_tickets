import React from 'react'
import BookingList from '../../components/bus-company/BookingList'
import { ArrowLeft, Filter, Download, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const CompanyBookings = () => {
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
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Quản Lý Đặt Vé
                </h1>
                <p className="text-gray-600">
                  Theo dõi và quản lý tất cả các đặt vé của công ty bạn
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="flex items-center justify-center space-x-2 btn-secondary px-4 py-2">
                  <Filter size={20} />
                  <span>Bộ Lọc</span>
                </button>
                <button className="flex items-center justify-center space-x-2 btn-secondary px-4 py-2">
                  <Download size={20} />
                  <span>Xuất Excel</span>
                </button>
                <button className="btn-primary px-6 py-2">
                  Tạo Vé Mới
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng Vé Hôm Nay', value: '24', color: 'blue', change: '+4' },
            { label: 'Đã Xác Nhận', value: '18', color: 'green', change: '+3' },
            { label: 'Chờ Xác Nhận', value: '4', color: 'yellow', change: '-1' },
            { label: 'Đã Hủy', value: '2', color: 'red', change: '+1' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  stat.color === 'green' ? 'bg-green-100 text-green-800' :
                  stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
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
                  placeholder="Tìm kiếm theo mã vé, tên khách hàng..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select className="input text-sm">
                <option value="">Tất cả trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="cancelled">Đã hủy</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
              
              <select className="input text-sm">
                <option value="">Tất cả tuyến đường</option>
                <option value="hanoi-haiphong">Hà Nội - Hải Phòng</option>
                <option value="hanoi-danang">Hà Nội - Đà Nẵng</option>
                <option value="hanoi-saigon">Hà Nội - Sài Gòn</option>
              </select>
              
              <input
                type="date"
                className="input text-sm"
              />
            </div>
          </div>
        </div>

        {/* Booking List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <BookingList />
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
            <div className="space-y-3">
              {[
                { label: 'Tỷ lệ lấp đầy trung bình', value: '78%', color: 'green' },
                { label: 'Doanh thu hôm nay', value: '8.450.000đ', color: 'blue' },
                { label: 'Vé hủy trong tháng', value: '12 vé', color: 'red' },
                { label: 'Khách hàng mới', value: '45 người', color: 'purple' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={`font-medium ${
                    item.color === 'green' ? 'text-green-600' :
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'red' ? 'text-red-600' :
                    'text-purple-600'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hỗ trợ nhanh</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
                <div className="font-medium text-gray-900">Hướng dẫn quản lý vé</div>
                <div className="text-sm text-gray-600">Xem hướng dẫn chi tiết về quản lý đặt vé</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200">
                <div className="font-medium text-gray-900">Báo cáo sự cố</div>
                <div className="text-sm text-gray-600">Báo cáo sự cố kỹ thuật hoặc vấn đề với vé</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200">
                <div className="font-medium text-gray-900">Liên hệ hỗ trợ</div>
                <div className="text-sm text-gray-600">Đội ngũ hỗ trợ 24/7 sẵn sàng giúp đỡ</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyBookings