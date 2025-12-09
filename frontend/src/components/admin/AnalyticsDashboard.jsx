import React, { useState, useEffect } from 'react'
import { adminService } from '../../pages/services/admin'
import LoadingSpinner from '../common/LoadingSpinner'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Clock,
  Building,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '../../utils/helpers'

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeTrips: 0
  })
  
  const [recentBookings, setRecentBookings] = useState([])
  const [topRoutes, setTopRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month')
  const [chartData, setChartData] = useState({ revenue: [], bookings: [] })

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [statsRes, bookingsRes, routesRes] = await Promise.all([
        adminService.getStats(dateRange),
        adminService.getRecentBookings(),
        adminService.getTopRoutes()
      ])

      if (statsRes.data) {
        setStats(statsRes.data)
        // Mock chart data - replace with actual API
        setChartData({
          revenue: generateChartData(12, 1000000, 5000000),
          bookings: generateChartData(12, 100, 500)
        })
      }
      if (bookingsRes.data) {
        setRecentBookings(bookingsRes.data.bookings || [])
      }
      if (routesRes.data) {
        setTopRoutes(routesRes.data.routes || [])
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (count, min, max) => {
    return Array.from({ length: count }, (_, i) => ({
      label: `Tháng ${i + 1}`,
      value: Math.floor(Math.random() * (max - min + 1)) + min
    }))
  }

  const StatCard = ({ icon: Icon, label, value, trend, color = 'blue' }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? (
                <ArrowUpRight size={16} className="text-green-500" />
              ) : (
                <ArrowDownRight size={16} className="text-red-500" />
              )}
              <span>{Math.abs(trend)}% so với kỳ trước</span>
            </div>
          )}
        </div>
        <div className={`p-4 bg-${color}-50 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`text-${color}-600`} size={28} />
        </div>
      </div>
    </div>
  )

  const ChartContainer = ({ title, data, color = 'blue' }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Download size={16} />
          <span className="text-sm">Xuất báo cáo</span>
        </button>
      </div>
      <div className="h-64">
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full bg-${color}-100 rounded-t-lg transition-all duration-500 hover:bg-${color}-200`}
                style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
              >
                <div className={`bg-${color}-500 h-full rounded-t-lg opacity-80 hover:opacity-100 transition-opacity`}></div>
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Đang tải dữ liệu..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phân Tích & Thống Kê</h1>
          <p className="text-gray-600 mt-2">Theo dõi toàn diện hoạt động hệ thống</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="year">12 tháng qua</option>
            </select>
          </div>
          
          <button 
            onClick={fetchAnalytics}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          icon={Users}
          label="Tổng Người Dùng"
          value={stats.totalUsers.toLocaleString('vi-VN')}
          trend={12}
          color="blue"
        />
        <StatCard
          icon={Building}
          label="Nhà Xe"
          value={stats.totalCompanies.toLocaleString('vi-VN')}
          trend={8}
          color="purple"
        />
        <StatCard
          icon={MapPin}
          label="Tổng Chuyến Đi"
          value={stats.totalTrips.toLocaleString('vi-VN')}
          trend={15}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Chuyến Đang Chạy"
          value={stats.activeTrips.toLocaleString('vi-VN')}
          trend={-5}
          color="orange"
        />
        <StatCard
          icon={Ticket}
          label="Đơn Đặt Vé"
          value={stats.totalBookings.toLocaleString('vi-VN')}
          trend={20}
          color="red"
        />
        <StatCard
          icon={DollarSign}
          label="Tổng Doanh Thu"
          value={formatCurrency(stats.totalRevenue)}
          trend={18}
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChartContainer
          title="Doanh Thu Theo Thời Gian"
          data={chartData.revenue}
          color="blue"
        />
        <ChartContainer
          title="Đơn Đặt Vé Theo Thời Gian"
          data={chartData.bookings}
          color="green"
        />
      </div>

      {/* Recent Data Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Đơn Đặt Vé Gần Đây</h3>
              <span className="text-sm text-gray-500">{recentBookings.length} đơn</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Ticket className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>Chưa có đơn đặt vé nào</p>
              </div>
            ) : (
              recentBookings.slice(0, 8).map((booking) => (
                <div key={booking.id} className="px-6 py-4 hover:bg-blue-50 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                            {booking.user?.fullName || 'Khách hàng'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.trip?.route?.departure} → {booking.trip?.route?.destination}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(booking.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-lg">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Thành công' : 'Chờ xác nhận'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Tuyến Đường Phổ Biến</h3>
              <span className="text-sm text-gray-500">{topRoutes.length} tuyến</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {topRoutes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>Chưa có dữ liệu tuyến đường</p>
              </div>
            ) : (
              topRoutes.slice(0, 8).map((route, index) => (
                <div key={route.id} className="px-6 py-4 hover:bg-green-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-2xl font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-green-600 truncate">
                        {route.departure} → {route.destination}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{route.distance} km</span>
                        <span>•</span>
                        <span>{route.bookingCount} vé</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {formatCurrency(route.revenue)}
                      </p>
                      <p className="text-xs text-gray-500">Doanh thu</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Thông Tin Chi Tiết Hệ Thống</h3>
            <p className="text-blue-100 opacity-90">
              Tổng quan toàn diện về hiệu suất và hoạt động của nền tảng
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-blue-200 text-sm">Tỷ lệ thành công</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.8/5</div>
              <div className="text-blue-200 text-sm">Đánh giá người dùng</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-blue-200 text-sm">Thời gian hoạt động</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2.3s</div>
              <div className="text-blue-200 text-sm">Phản hồi trung bình</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard