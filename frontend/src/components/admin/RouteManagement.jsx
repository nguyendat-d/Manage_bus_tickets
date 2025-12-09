import React, { useState, useEffect } from 'react'
import { adminService } from '../../pages/services/admin'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Modal from '../../components/common/Modal'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Filter,
  Download,
  Clock,
  Navigation,
  TrendingUp,
  MoreVertical,
  Eye,
  // SỬ DỤNG CÁC ICON CÓ SẴN
  Map,
  Compass,
  Globe
} from 'lucide-react'

const RouteManagement = () => {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 10
  })

  const [formData, setFormData] = useState({
    departure_city: '',
    departure_station: '',
    arrival_city: '',
    arrival_station: '',
    distance_km: '',
    estimated_duration_minutes: '',
    base_price: '',
    status: 'active'
  })

  useEffect(() => {
    fetchRoutes()
  }, [filters])

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const response = await adminService.getRoutes(filters)
      setRoutes(response.data.routes || [])
    } catch (error) {
      console.error('Failed to fetch routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingRoute) {
        await adminService.updateRoute(editingRoute.id, formData)
      } else {
        await adminService.createRoute(formData)
      }
      setShowModal(false)
      setEditingRoute(null)
      resetForm()
      fetchRoutes()
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu tuyến đường')
    }
  }

  const handleEdit = (route) => {
    setEditingRoute(route)
    setFormData({
      departure_city: route.departure_city,
      departure_station: route.departure_station,
      arrival_city: route.arrival_city,
      arrival_station: route.arrival_station,
      distance_km: route.distance_km,
      estimated_duration_minutes: route.estimated_duration_minutes,
      base_price: route.base_price || '',
      status: route.status
    })
    setShowModal(true)
  }

  const handleDelete = async (routeId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này? Tất cả chuyến xe liên quan sẽ bị ảnh hưởng.')) return

    try {
      await adminService.deleteRoute(routeId)
      fetchRoutes()
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa tuyến đường')
    }
  }

  const handleStatusChange = async (routeId, newStatus) => {
    try {
      await adminService.updateRouteStatus(routeId, { status: newStatus })
      fetchRoutes()
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingRoute(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      departure_city: '',
      departure_station: '',
      arrival_city: '',
      arrival_station: '',
      distance_km: '',
      estimated_duration_minutes: '',
      base_price: '',
      status: 'active'
    })
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h${mins > 0 ? `${mins}p` : ''}` : `${minutes}p`
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Hoạt động' },
      inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Ngừng hoạt động' },
      maintenance: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Bảo trì' }
    }
    const config = statusConfig[status] || statusConfig.inactive
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const stats = {
    total: routes.length,
    active: routes.filter(r => r.status === 'active').length,
    popular: routes.filter(r => r.trip_count > 10).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Tuyến Đường</h1>
          <p className="text-gray-600 mt-2">Quản lý toàn bộ tuyến đường vận chuyển trên hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={18} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span>Thêm Tuyến Đường</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tổng Tuyến Đường', value: stats.total, icon: Map, color: 'blue' },
          { label: 'Đang Hoạt Động', value: stats.active, icon: TrendingUp, color: 'green' },
          { label: 'Tuyến Phổ Biến', value: stats.popular, icon: Navigation, color: 'purple' }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo thành phố, bến xe..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                  className="bg-transparent border-none focus:outline-none focus:ring-0"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Đang tải danh sách tuyến đường..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tuyến Đường</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thông Tin</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {routes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      {/* SỬ DỤNG MAP THAY VÌ ROUTES */}
                      <Map className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">Không tìm thấy tuyến đường nào</p>
                      <p className="text-gray-400 mt-1">
                        {filters.search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm tuyến đường đầu tiên'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  routes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                              {route.departure_city} → {route.arrival_city}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {route.departure_station} - {route.arrival_station}
                            </div>
                            {route.trip_count > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {route.trip_count} chuyến/ngày
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Navigation size={16} />
                            <span>{route.distance_km} km</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={16} />
                            <span>{formatDuration(route.estimated_duration_minutes)}</span>
                          </div>
                          {route.base_price && (
                            <div className="text-sm font-semibold text-green-600">
                              {new Intl.NumberFormat('vi-VN').format(route.base_price)} VND
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {getStatusBadge(route.status)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(route)}
                            className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          
                          {route.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(route.id, 'inactive')}
                              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Tạm ngừng"
                            >
                              <Eye size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(route.id, 'active')}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                              title="Kích hoạt"
                            >
                              <TrendingUp size={18} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(route.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Route Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        size="lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            {/* SỬ DỤNG MAP THAY VÌ ROUTES */}
            <Map className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingRoute ? 'Chỉnh Sửa Tuyến Đường' : 'Thêm Tuyến Đường Mới'}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {editingRoute ? 'Cập nhật thông tin tuyến đường' : 'Điền đầy đủ thông tin tuyến đường mới'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thành Phố Đi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.departure_city}
                onChange={(e) => setFormData(prev => ({ ...prev, departure_city: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ví dụ: Hà Nội"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bến Xe Đi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.departure_station}
                onChange={(e) => setFormData(prev => ({ ...prev, departure_station: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ví dụ: Bến xe Mỹ Đình"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thành Phố Đến <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.arrival_city}
                onChange={(e) => setFormData(prev => ({ ...prev, arrival_city: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ví dụ: Hải Phòng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bến Xe Đến <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.arrival_station}
                onChange={(e) => setFormData(prev => ({ ...prev, arrival_station: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ví dụ: Bến xe Hải Phòng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng Cách (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.distance_km}
                onChange={(e) => setFormData(prev => ({ ...prev, distance_km: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ví dụ: 120.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời Gian Dự Kiến (phút) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimated_duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration_minutes: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ví dụ: 180"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá Cơ Bản (VND)
              </label>
              <input
                type="number"
                min="0"
                value={formData.base_price}
                onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ví dụ: 120000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng Thái <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              {editingRoute ? 'Cập Nhật' : 'Thêm Mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default RouteManagement