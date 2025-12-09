import React, { useState, useEffect, useMemo } from 'react'
import { busCompanyService } from '../../pages/services/busCompany'
import LoadingSpinner from '../common/LoadingSpinner'
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { formatCurrency, formatDateTime, formatDate } from '../../utils/helpers'

const CompanyStats = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    totalBuses: 0,
    occupancyRate: 0,
    averageRating: 0,
    revenueChange: 0,
    bookingChange: 0,
    tripChange: 0
  })

  const [upcomingTrips, setUpcomingTrips] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [busStats, setBusStats] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchCompanyStats()
  }, [dateRange])

  const fetchCompanyStats = async () => {
    try {
      setLoading(true)
      const [statsRes, tripsRes, bookingsRes, busesRes, revenueRes] = await Promise.all([
        busCompanyService.getStats(dateRange),
        busCompanyService.getUpcomingTrips(),
        busCompanyService.getRecentBookings(),
        busCompanyService.getBusStats(),
        busCompanyService.getRevenueData(dateRange)
      ])

      if (statsRes.data) {
        setStats(statsRes.data)
      }
      if (tripsRes.data) {
        setUpcomingTrips(tripsRes.data.trips || [])
      }
      if (bookingsRes.data) {
        setRecentBookings(bookingsRes.data.bookings || [])
      }
      if (busesRes.data) {
        setBusStats(busesRes.data.buses || [])
      }
      if (revenueRes.data) {
        setRevenueData(revenueRes.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch company stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchCompanyStats()
  }

  const handleExportReport = async () => {
    try {
      const response = await busCompanyService.exportStatsReport(dateRange)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `bao-cao-thong-ke-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit = '', 
    change = 0,
    changeType = 'neutral'
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' && value > 1000000 
                ? (value / 1000000).toFixed(1) + 'M' 
                : typeof value === 'number' && value > 1000
                ? (value / 1000).toFixed(1) + 'K'
                : value}
            </p>
            {unit && (
              <span className="text-base font-normal text-gray-600 mb-1">{unit}</span>
            )}
          </div>
          
          {change !== 0 && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {changeType === 'positive' ? <ArrowUp size={16} /> : 
               changeType === 'negative' ? <ArrowDown size={16} /> : null}
              <span>{Math.abs(change)}% so với kỳ trước</span>
            </div>
          )}
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <Icon className="text-blue-600" size={24} />
        </div>
      </div>
    </div>
  )

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'Chờ XN', icon: Clock },
      confirmed: { color: 'green', text: 'Đã XN', icon: CheckCircle },
      completed: { color: 'blue', text: 'Hoàn Tất', icon: CheckCircle },
      cancelled: { color: 'red', text: 'Đã Hủy', icon: XCircle }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`flex items-center gap-1 bg-${config.color}-100 text-${config.color}-800 px-2 py-1 rounded-full text-xs font-medium`}>
        <Icon size={12} />
        <span>{config.text}</span>
      </div>
    )
  }

  const revenueChartData = useMemo(() => {
    return revenueData.map(item => ({
      ...item,
      formattedDate: formatDate(item.date),
      formattedRevenue: formatCurrency(item.revenue)
    }))
  }, [revenueData])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Thống Kê Công Ty</h2>
          <p className="text-gray-600 mt-1">Tổng quan hoạt động kinh doanh</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['week', 'month', 'year'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  dateRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === 'week' && 'Tuần này'}
                {range === 'month' && 'Tháng này'}
                {range === 'year' && 'Năm nay'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            <Download size={20} />
            Xuất PDF
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          label="Tổng Chuyến Đi"
          value={stats.totalTrips}
          change={stats.tripChange}
          changeType={stats.tripChange > 0 ? 'positive' : stats.tripChange < 0 ? 'negative' : 'neutral'}
        />
        <StatCard
          icon={TrendingUp}
          label="Chuyến Đang Chạy"
          value={stats.activeTrips}
        />
        <StatCard
          icon={Users}
          label="Đơn Đặt Vé"
          value={stats.totalBookings}
          change={stats.bookingChange}
          changeType={stats.bookingChange > 0 ? 'positive' : stats.bookingChange < 0 ? 'negative' : 'neutral'}
        />
        <StatCard
          icon={DollarSign}
          label="Doanh Thu"
          value={stats.totalRevenue}
          unit="VND"
          change={stats.revenueChange}
          changeType={stats.revenueChange > 0 ? 'positive' : stats.revenueChange < 0 ? 'negative' : 'neutral'}
        />
      </div>

      {/* Secondary Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-orange-600" size={24} />
            <div>
              <p className="text-gray-600 text-sm font-medium">Tỷ Lệ Lấp Đầy Xe</p>
              <p className="text-2xl font-bold text-orange-600">{stats.occupancyRate}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.occupancyRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            {stats.occupancyRate >= 80 ? 'Tuyệt vời!' : 
             stats.occupancyRate >= 60 ? 'Khá tốt' : 
             'Cần cải thiện'}
          </p>
        </div>

        {/* Total Buses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="text-green-600" size={24} />
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng Xe Buýt</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalBuses}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-700">{Math.round(stats.totalBuses * 0.7)}</p>
              <p className="text-green-600">Đang hoạt động</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-700">{Math.round(stats.totalBuses * 0.3)}</p>
              <p className="text-blue-600">Còn lại</p>
            </div>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-blue-600" size={24} />
            <div>
              <p className="text-gray-600 text-sm font-medium">Đơn Xác Nhận</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmedBookings}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Tỷ lệ xác nhận</span>
              <span>{stats.totalBookings > 0 ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ 
                  width: `${stats.totalBookings > 0 ? (stats.confirmedBookings / stats.totalBookings) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {revenueChartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Doanh Thu Theo Thời Gian</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Doanh thu</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <div className="flex items-end justify-between h-48 gap-2">
              {revenueChartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer"
                    style={{ height: `${(item.revenue / Math.max(...revenueChartData.map(r => r.revenue))) * 100}%` }}
                    title={`${item.formattedDate}: ${item.formattedRevenue}`}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    {item.formattedDate.split('/').slice(0, 2).join('/')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Upcoming Trips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Chuyến Đi Sắp Tới</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {upcomingTrips.length} chuyến
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {upcomingTrips.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <Calendar className="mx-auto text-gray-400 mb-3" size={32} />
                <p>Không có chuyến đi sắp tới</p>
              </div>
            ) : (
              upcomingTrips.slice(0, 6).map((trip) => (
                <div key={trip.id} className="px-6 py-4 hover:bg-gray-50 transition group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        {trip.route?.departure} → {trip.route?.destination}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Clock size={14} />
                        {formatDateTime(trip.departureTime)}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-blue-600 text-lg">
                        {trip.availableSeats}/{trip.bus?.capacity} ghế
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatCurrency(trip.price)}/vé
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      Xe: {trip.bus?.licensePlate}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trip.availableSeats < 10 
                        ? 'bg-red-100 text-red-800'
                        : trip.availableSeats < 20
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {trip.availableSeats < 10 ? 'Sắp hết' : 
                       trip.availableSeats < 20 ? 'Còn ít' : 'Còn nhiều'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Đơn Đặt Vé Gần Đây</h3>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {recentBookings.length} đơn
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <Users className="mx-auto text-gray-400 mb-3" size={32} />
                <p>Không có đơn đặt vé mới</p>
              </div>
            ) : (
              recentBookings.slice(0, 6).map((booking) => (
                <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                          {booking.user?.fullName}
                        </p>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {booking.trip?.route?.departure} → {booking.trip?.route?.destination}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDateTime(booking.createdAt)}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-green-600 text-lg">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.seatNumbers?.length || 0} ghế
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {booking.seatNumbers?.slice(0, 5).map(seat => (
                      <span key={seat} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {seat}
                      </span>
                    ))}
                    {booking.seatNumbers?.length > 5 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{booking.seatNumbers.length - 5} ghế
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bus Usage Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Hiệu Suất Xe Buýt</h3>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
              {busStats.length} xe
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          {busStats.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <MapPin className="mx-auto text-gray-400 mb-3" size={32} />
              <p>Không có dữ liệu xe buýt</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Biển Số</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Model</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Chuyến Đi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Đơn Đặt</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Doanh Thu</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hiệu Suất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {busStats.map((bus) => (
                  <tr key={bus.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-blue-600">{bus.licensePlate}</p>
                        <p className="text-xs text-gray-500 mt-1">{bus.registrationNumber || 'Chưa có SĐK'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{bus.model}</p>
                      <p className="text-xs text-gray-500">{bus.capacity} ghế</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{bus.tripCount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{bus.bookingCount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-600">
                        {formatCurrency(bus.revenue)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${bus.occupancyRate}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className={`text-sm font-medium min-w-12 ${
                          bus.occupancyRate >= 80 ? 'text-green-600' :
                          bus.occupancyRate >= 60 ? 'text-blue-600' :
                          bus.occupancyRate >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {bus.occupancyRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyStats