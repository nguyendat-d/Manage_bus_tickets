import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Building, 
  Plus, 
  Search,
  Filter,
  Download,
  Users,
  Star
} from 'lucide-react'
import CompanyManagement from '../../components/admin/CompanyManagement'
import { useNotification } from '../../contexts/NotificationContext'

const Companies = () => {
  const { showNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddCompany, setShowAddCompany] = useState(false)

  const handleAddCompany = () => {
    setShowAddCompany(true)
  }

  const handleCompanyAdded = (company) => {
    setShowAddCompany(false)
    showNotification(`Đã thêm nhà xe ${company.name} thành công`, 'success')
  }

  const quickStats = [
    { label: 'Tổng số nhà xe', value: '47', icon: Building, color: 'blue' },
    { label: 'Đang hoạt động', value: '42', icon: Users, color: 'green' },
    { label: 'Đang chờ duyệt', value: '3', icon: Star, color: 'yellow' },
    { label: 'Đã bị khóa', value: '2', icon: Building, color: 'red' }
  ]

  return (
    <>
      <Helmet>
        <title>Quản Lý Nhà Xe | Hệ Thống Quản Trị</title>
        <meta name="description" content="Quản lý danh sách nhà xe và thông tin đối tác" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Quản Lý Nhà Xe
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý đối tác nhà xe và thông tin hợp tác
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhà xe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm font-medium text-gray-700"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="suspended">Tạm ngưng</option>
                  <option value="banned">Đã khóa</option>
                </select>

                {/* Add Company Button */}
                <button
                  onClick={handleAddCompany}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Nhà Xe
                </button>

                {/* Export Button */}
                <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {quickStats.map((stat, index) => {
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

          {/* Recent Activity */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Đang Chờ Duyệt
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Xe Khách Phương Trang', days: 2 },
                  { name: 'Nhà Xe Mai Linh', days: 1 },
                  { name: 'Xe An Phú', days: 3 }
                ].map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-100">
                    <span className="text-sm font-medium text-gray-700">{company.name}</span>
                    <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                      {company.days} ngày
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-yellow-700 hover:text-yellow-800 font-medium py-2 border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors">
                Xem tất cả yêu cầu
              </button>
            </div>

            {/* Top Performers */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nhà Xe Hoạt Động Tốt
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Xe Khách Phương Trang', rating: 4.8, trips: 1247, revenue: '45.2M' },
                  { name: 'Nhà Xe Mai Linh', rating: 4.7, trips: 987, revenue: '38.1M' },
                  { name: 'Xe Hoàng Long', rating: 4.6, trips: 856, revenue: '32.4M' },
                  { name: 'Xe Kumho', rating: 4.5, trips: 723, revenue: '28.9M' }
                ].map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{company.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-600">{company.trips} chuyến</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{company.revenue}</p>
                      <p className="text-xs text-gray-500">doanh thu</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <CompanyManagement 
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onAddCompany={handleAddCompany}
              showAddForm={showAddCompany}
              onCompanyAdded={handleCompanyAdded}
              onCancelAdd={() => setShowAddCompany(false)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Companies