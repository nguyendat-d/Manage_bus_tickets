import React, { useState, useEffect, useMemo } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'
import Modal from '../common/Modal'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Zap, 
  AlertTriangle, 
  Car,
  Calendar,
  Users,
  Wrench,
  BarChart3,
  Upload,
  X
} from 'lucide-react'

const BusManagement = () => {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      setLoading(true)
      // Giả lập dữ liệu thay vì gọi API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockBuses = [
        {
          id: 1,
          licensePlate: '29A-12345',
          model: 'Thaco Kinglong',
          capacity: 45,
          manufacturingYear: 2022,
          type: 'standard',
          registrationNumber: '0123456789',
          status: 'active',
          lastMaintenanceDate: '2024-01-15'
        },
        {
          id: 2,
          licensePlate: '30A-67890',
          model: 'Toyota Coaster',
          capacity: 30,
          manufacturingYear: 2023,
          type: 'vip',
          registrationNumber: '0987654321',
          status: 'maintenance',
          lastMaintenanceDate: '2024-02-20'
        }
      ]
      
      setBuses(mockBuses)
    } catch (error) {
      console.error('Failed to fetch buses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (bus = null) => {
    setEditingBus(bus)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setEditingBus(null)
    setShowModal(false)
  }

  const handleSaveBus = async (busData) => {
    try {
      // Giả lập lưu dữ liệu
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (editingBus) {
        // Cập nhật xe
        setBuses(prev => prev.map(bus => 
          bus.id === editingBus.id ? { ...bus, ...busData } : bus
        ))
      } else {
        // Thêm xe mới
        const newBus = {
          id: Date.now(),
          ...busData
        }
        setBuses(prev => [...prev, newBus])
      }
      
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save bus:', error)
      throw error
    }
  }

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      try {
        setBuses(prev => prev.filter(bus => bus.id !== busId))
      } catch (error) {
        console.error('Failed to delete bus:', error)
        alert('Không thể xóa xe.')
      }
    }
  }

  const handleMaintenance = async (busId) => {
    try {
      setBuses(prev => prev.map(bus => 
        bus.id === busId ? { ...bus, status: 'maintenance' } : bus
      ))
    } catch (error) {
      console.error('Failed to set maintenance:', error)
    }
  }

  const handleActivate = async (busId) => {
    try {
      setBuses(prev => prev.map(bus => 
        bus.id === busId ? { ...bus, status: 'active' } : bus
      ))
    } catch (error) {
      console.error('Failed to activate bus:', error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'green', text: 'Đang Hoạt Động', icon: Zap },
      inactive: { color: 'gray', text: 'Không Hoạt Động', icon: AlertTriangle },
      maintenance: { color: 'yellow', text: 'Bảo Trì', icon: Wrench }
    }

    const config = statusConfig[status] || statusConfig.inactive
    const Icon = config.icon

    const colorClasses = {
      green: 'bg-green-100 text-green-800 border-green-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }

    return (
      <div className={`flex items-center gap-2 ${colorClasses[config.color]} px-3 py-1 rounded-full w-fit border`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    )
  }

  const filteredBuses = useMemo(() => {
    return buses.filter(bus => {
      const matchSearch = 
        bus.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bus.registrationNumber && bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchStatus = filterStatus === 'all' || bus.status === filterStatus
      const matchType = filterType === 'all' || bus.type === filterType
      
      return matchSearch && matchStatus && matchType
    })
  }, [buses, searchTerm, filterStatus, filterType])

  const stats = useMemo(() => {
    const total = buses.length
    const active = buses.filter(bus => bus.status === 'active').length
    const maintenance = buses.filter(bus => bus.status === 'maintenance').length
    const inactive = buses.filter(bus => bus.status === 'inactive').length
    
    return { total, active, maintenance, inactive }
  }, [buses])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Xe Buýt</h2>
          <p className="text-gray-600 mt-1">Tổng cộng: {buses.length} xe</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            <BarChart3 size={20} />
            {viewMode === 'grid' ? 'Dạng Bảng' : 'Dạng Lưới'}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Thêm Xe Mới
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Số Xe', value: stats.total, color: 'blue', icon: Car },
          { label: 'Đang Hoạt Động', value: stats.active, color: 'green', icon: Zap },
          { label: 'Đang Bảo Trì', value: stats.maintenance, color: 'yellow', icon: Wrench },
          { label: 'Không Hoạt Động', value: stats.inactive, color: 'gray', icon: AlertTriangle }
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{label}</p>
                <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
              </div>
              <div className={`p-3 bg-${color}-100 rounded-lg`}>
                <Icon className={`text-${color}-600`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo biển số, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang Hoạt Động</option>
          <option value="inactive">Không Hoạt Động</option>
          <option value="maintenance">Bảo Trì</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả loại xe</option>
          <option value="standard">Tiêu Chuẩn</option>
          <option value="sleeping">Giường Nằm</option>
          <option value="vip">VIP</option>
          <option value="luxury">Cao Cấp</option>
        </select>

        <button
          onClick={fetchBuses}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Làm Mới
        </button>
      </div>

      {/* Buses Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBuses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
              <Car className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">Không có xe buýt nào phù hợp</p>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <BusCard 
                key={bus.id} 
                bus={bus} 
                onEdit={handleOpenModal}
                onDelete={handleDeleteBus}
                onMaintenance={handleMaintenance}
                onActivate={handleActivate}
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </div>
      ) : (
        <BusTableView 
          buses={filteredBuses}
          onEdit={handleOpenModal}
          onDelete={handleDeleteBus}
          onMaintenance={handleMaintenance}
          onActivate={handleActivate}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal} size="lg">
          <BusForm
            bus={editingBus}
            onSave={handleSaveBus}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  )
}

// Bus Card Component for Grid View
const BusCard = ({ bus, onEdit, onDelete, onMaintenance, onActivate, getStatusBadge }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      {/* License Plate Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 mb-4 text-center text-white">
        <p className="text-2xl font-bold tracking-wider">{bus.licensePlate}</p>
        <p className="text-blue-100 text-sm mt-1">{bus.model}</p>
      </div>

      {/* Bus Info */}
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="mx-auto text-gray-600 mb-2" size={20} />
            <p className="text-sm text-gray-600">Số Ghế</p>
            <p className="font-bold text-gray-900 text-lg">{bus.capacity}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="mx-auto text-gray-600 mb-2" size={20} />
            <p className="text-sm text-gray-600">Năm SX</p>
            <p className="font-bold text-gray-900 text-lg">{bus.manufacturingYear}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Loại xe:</span>
            <span className="font-medium">{getBusTypeLabel(bus.type)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số đăng ký:</span>
            <span className="font-medium">{bus.registrationNumber || '-'}</span>
          </div>
          {bus.lastMaintenanceDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Bảo trì cuối:</span>
              <span className="font-medium text-sm">
                {new Date(bus.lastMaintenanceDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        {getStatusBadge(bus.status)}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(bus)}
          className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
        >
          <Edit size={16} />
          Sửa
        </button>
        
        {bus.status === 'active' ? (
          <button
            onClick={() => onMaintenance(bus.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium"
          >
            <Wrench size={16} />
            Bảo Trì
          </button>
        ) : (
          <button
            onClick={() => onActivate(bus.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium"
          >
            <Zap size={16} />
            Kích Hoạt
          </button>
        )}
        
        <button
          onClick={() => onDelete(bus.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
        >
          <Trash2 size={16} />
          Xóa
        </button>
      </div>
    </div>
  )
}

// Bus Table View Component
const BusTableView = ({ buses, onEdit, onDelete, onMaintenance, onActivate, getStatusBadge }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Biển Số</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Model</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Loại Xe</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Số Ghế</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Năm SX</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-blue-600 text-lg">{bus.licensePlate}</p>
                    <p className="text-sm text-gray-500">{bus.registrationNumber || 'Chưa có số ĐK'}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{bus.model}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {getBusTypeLabel(bus.type)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{bus.capacity}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900">{bus.manufacturingYear}</p>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(bus.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(bus)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Sửa thông tin"
                    >
                      <Edit size={16} />
                    </button>
                    {bus.status === 'active' ? (
                      <button
                        onClick={() => onMaintenance(bus.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Chuyển sang bảo trì"
                      >
                        <Wrench size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(bus.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Kích hoạt xe"
                      >
                        <Zap size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(bus.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Xóa xe"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Bus Form Component
const BusForm = ({ bus, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    licensePlate: bus?.licensePlate || '',
    model: bus?.model || '',
    capacity: bus?.capacity || 45,
    manufacturingYear: bus?.manufacturingYear || new Date().getFullYear(),
    type: bus?.type || 'standard',
    registrationNumber: bus?.registrationNumber || '',
    status: bus?.status || 'active',
    lastMaintenanceDate: bus?.lastMaintenanceDate || ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'manufacturingYear' 
        ? parseInt(value) || 0
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const busTypes = [
    { value: 'standard', label: 'Tiêu Chuẩn' },
    { value: 'sleeping', label: 'Giường Nằm' },
    { value: 'vip', label: 'VIP' },
    { value: 'luxury', label: 'Cao Cấp' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-900">
          {bus ? 'Sửa Thông Tin Xe' : 'Thêm Xe Mới'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* License Plate */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biển Số Xe (*)
          </label>
          <input
            type="text"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            placeholder="29A-12345"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model Xe (*)
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="VD: Thaco Kinglong, Toyota Coaster..."
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số Đăng Ký
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="Số đăng ký xe"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số Ghế (*)
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            max="100"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Manufacturing Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Năm Sản Xuất (*)
          </label>
          <input
            type="number"
            name="manufacturingYear"
            value={formData.manufacturingYear}
            onChange={handleChange}
            min="2000"
            max={new Date().getFullYear()}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại Xe
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {busTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng Thái
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Đang Hoạt Động</option>
            <option value="inactive">Không Hoạt Động</option>
            <option value="maintenance">Bảo Trì</option>
          </select>
        </div>

        {/* Last Maintenance Date */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày Bảo Trì Cuối
          </label>
          <input
            type="date"
            name="lastMaintenanceDate"
            value={formData.lastMaintenanceDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang xử lý...' : (bus ? 'Cập Nhật' : 'Thêm Mới')}
        </button>
      </div>
    </form>
  )
}

// Helper function
const getBusTypeLabel = (type) => {
  const types = {
    standard: 'Tiêu Chuẩn',
    sleeping: 'Giường Nằm',
    vip: 'VIP',
    luxury: 'Cao Cấp'
  }
  return types[type] || type
}

export default BusManagement