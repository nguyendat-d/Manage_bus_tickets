import React from 'react'
import CompanyStatsComponent from '../../components/bus-company/CompanyStats'
import { ArrowLeft, Download, Filter, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

const CompanyStats = () => {
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
                  Thống Kê & Báo Cáo
                </h1>
                <p className="text-gray-600">
                  Phân tích hiệu suất và doanh thu của công ty bạn
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <Calendar size={20} className="text-gray-600" />
                  <select className="bg-transparent border-none focus:ring-0 text-gray-700">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                    <option>3 tháng qua</option>
                    <option>Năm nay</option>
                    <option>Tùy chỉnh</option>
                  </select>
                </div>
                <button className="flex items-center justify-center space-x-2 btn-secondary px-4 py-2">
                  <Filter size={20} />
                  <span>Bộ Lọc</span>
                </button>
                <button className="flex items-center justify-center space-x-2 btn-primary px-4 py-2">
                  <Download size={20} />
                  <span>Xuất Báo Cáo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Tổng Doanh Thu', 
              value: '245.8M', 
              change: '+12.5%', 
              isPositive: true,
              color: 'green',
              description: 'So với tháng trước'
            },
            { 
              label: 'Tổng Vé Bán', 
              value: '1,248', 
              change: '+8.2%', 
              isPositive: true,
              color: 'blue',
              description: 'Tăng so với kỳ trước'
            },
            { 
              label: 'Tỷ Lệ Lấp Đầy', 
              value: '78.5%', 
              change: '+5.3%', 
              isPositive: true,
              color: 'purple',
              description: 'Trung bình các chuyến'
            },
            { 
              label: 'Vé Hủy', 
              value: '45', 
              change: '-2.1%', 
              isPositive: false,
              color: 'red',
              description: 'Giảm so với kỳ trước'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.isPositive 
                    ? stat.color === 'green' ? 'bg-green-100 text-green-800' :
                      stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${
                  stat.color === 'green' ? 'bg-green-500' :
                  stat.color === 'blue' ? 'bg-blue-500' :
                  stat.color === 'purple' ? 'bg-purple-500' :
                  'bg-red-500'
                }`} style={{ width: stat.color === 'red' ? '15%' : '75%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Stats Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <CompanyStatsComponent />
        </div>

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuyến Đường Phổ Biến</h3>
            <div className="space-y-4">
              {[
                { route: 'Hà Nội - Hải Phòng', revenue: '45.2M', bookings: 324, growth: '+15%' },
                { route: 'Hà Nội - Đà Nẵng', revenue: '38.7M', bookings: 287, growth: '+8%' },
                { route: 'Hà Nội - Sài Gòn', revenue: '32.1M', bookings: 198, growth: '+12%' },
                { route: 'Hải Phòng - Quảng Ninh', revenue: '28.5M', bookings: 156, growth: '+5%' }
              ].map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{route.route}</p>
                    <p className="text-sm text-gray-600">{route.bookings} vé • {route.revenue}</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">{route.growth}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu Suất Theo Giờ</h3>
            <div className="space-y-3">
              {[
                { time: 'Sáng (5h-12h)', bookings: '45%', revenue: '52M' },
                { time: 'Chiều (12h-18h)', bookings: '32%', revenue: '38M' },
                { time: 'Tối (18h-24h)', bookings: '18%', revenue: '25M' },
                { time: 'Đêm (0h-5h)', bookings: '5%', revenue: '8M' }
              ].map((period, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{period.time}</span>
                    <span className="text-sm text-gray-600">{period.bookings} • {period.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500" 
                      style={{ width: period.bookings }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyStats