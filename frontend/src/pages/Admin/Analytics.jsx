import React from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  TrendingUp, 
  Download, 
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react'
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard'
import { useNotification } from '../../contexts/NotificationContext'

const Analytics = () => {
  const { showNotification } = useNotification()
  const [dateRange, setDateRange] = useState('month')
  const [isLoading, setIsLoading] = useState(false)

  const handleExportReport = async (format = 'pdf') => {
    try {
      setIsLoading(true)
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      showNotification(`Đã xuất báo cáo ${format.toUpperCase()} thành công`, 'success')
    } catch (error) {
      showNotification('Xuất báo cáo thất bại', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    showNotification('Đang làm mới dữ liệu...', 'info')
    // Refresh logic would be handled by the AnalyticsDashboard component
  }

  return (
    <>
      <Helmet>
        <title>Thống Kê & Phân Tích | Hệ Thống Quản Trị</title>
        <meta name="description" content="Dashboard thống kê và phân tích hiệu suất hệ thống đặt vé xe" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Thống Kê & Phân Tích
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Theo dõi hiệu suất và xu hướng hệ thống
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Date Range Filter */}
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                    <option value="year">Năm nay</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới
                </button>

                {/* Export Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => handleExportReport('pdf')}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Đang xuất...' : 'Xuất báo cáo'}
                  </button>
                  
                  {/* Export options dropdown would go here */}
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Tổng Doanh Thu', value: '125.4M', change: '+12.5%', trend: 'up' },
                { label: 'Đơn Đặt Mới', value: '2,847', change: '+8.2%', trend: 'up' },
                { label: 'Tỷ Lệ Lấp Đầy', value: '78.3%', change: '+3.1%', trend: 'up' },
                { label: 'Đánh Giá TB', value: '4.7/5', change: '+0.2', trend: 'up' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <AnalyticsDashboard 
              dateRange={dateRange}
              onExport={handleExportReport}
            />
          </div>

          {/* Additional Insights Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gợi ý Cải Thiện
              </h3>
              <div className="space-y-3">
                {[
                  'Tối ưu hóa các tuyến đường có tỷ lệ lấp đầy thấp',
                  'Tăng cường khuyến mãi cho các chuyến giờ thấp điểm',
                  'Cải thiện trải nghiệm đặt vé trên mobile',
                  'Phân tích phản hồi khách hàng để nâng cao chất lượng'
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trạng Thái Hệ Thống
              </h3>
              <div className="space-y-4">
                {[
                  { service: 'API Services', status: 'operational', latency: '45ms' },
                  { service: 'Database', status: 'operational', latency: '12ms' },
                  { service: 'Payment Gateway', status: 'operational', latency: '89ms' },
                  { service: 'Email Service', status: 'degraded', latency: '230ms' }
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        system.status === 'operational' ? 'bg-green-500' : 
                        system.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">{system.service}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        system.status === 'operational' ? 'bg-green-100 text-green-800' : 
                        system.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {system.status === 'operational' ? 'Hoạt động' : 
                         system.status === 'degraded' ? 'Giảm hiệu suất' : 'Lỗi'}
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">Độ trễ: {system.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Analytics