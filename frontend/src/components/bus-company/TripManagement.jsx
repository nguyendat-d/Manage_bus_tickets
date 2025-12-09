import React, { useState, useEffect, useMemo } from 'react'
import { tripService } from '../../pages/services/trip'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Modal from '../../components/common/Modal'
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  Eye,
  Car,
  // THAY THẾ Route BẰNG Map
  Map,
  DollarSign,
  ChevronDown,
  ChevronUp,
  // THÊM CheckCircle VÀ CÁC ICON THIẾU
  CheckCircle
} from 'lucide-react'
import { formatCurrency, formatDateTime, formatTime } from '../../utils/helpers'

const TripManagement = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRoute, setFilterRoute] = useState('all')
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'departureTime', direction: 'desc' })
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tripsRes, routesRes, busesRes] = await Promise.all([
        tripService.getCompanyTrips(),
        tripService.getRoutes(),
        tripService.getAvailableBuses()
      ])

      setTrips(tripsRes.data.trips || [])
      setRoutes(routesRes.data.routes || [])
      setBuses(busesRes.data.buses || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getStatusBadge = (status, departureTime) => {
    const now = new Date()
    const departure = new Date(departureTime)
    
    if (status === 'cancelled') {
      return { color: 'red', text: 'Đã Hủy', icon: Trash2 }
    }
    if (status === 'arrived') {
      return { color: 'gray', text: 'Đã Đến', icon: CheckCircle }
    }
    if (status === 'departed') {
      return { color: 'blue', text: 'Đang Chạy', icon: Clock }
    }
    if (departure < now) {
      return { color: 'purple', text: 'Quá Hạn', icon: Clock }
    }
    return { color: 'green', text: 'Sẵn Sàng', icon: CheckCircle }
  }

  const StatusBadge = ({ status, departureTime }) => {
    const config = getStatusBadge(status, departureTime)
    const Icon = config.icon

    return (
      <div className={`flex items-center gap-2 bg-${config.color}-100 text-${config.color}-800 px-3 py-1 rounded-full w-fit border border-${config.color}-200`}>
        <Icon size={14} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    )
  }

  const handleOpenModal = (trip = null) => {
    setEditingTrip(trip)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setEditingTrip(null)
    setShowModal(false)
  }

  const handleSaveTrip = async (tripData) => {
    try {
      if (editingTrip) {
        await tripService.updateTrip(editingTrip.id, tripData)
      } else {
        await tripService.createTrip(tripData)
      }
      handleCloseModal()
      fetchData()
    } catch (error) {
      console.error('Failed to save trip:', error)
      throw error
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyến đi này? Tất cả đơn đặt liên quan cũng sẽ bị hủy.')) {
      try {
        await tripService.deleteTrip(tripId)
        fetchData()
      } catch (error) {
        console.error('Failed to delete trip:', error)
        alert('Không thể xóa chuyến đi. Có thể đang có đơn đặt liên quan.')
      }
    }
  }

  const handleDuplicateTrip = async (tripId) => {
    try {
      await tripService.duplicateTrip(tripId)
      fetchData()
    } catch (error) {
      console.error('Failed to duplicate trip:', error)
    }
  }

  const filteredAndSortedTrips = useMemo(() => {
    let filtered = trips.filter(trip => {
      const matchSearch = 
        trip.route?.departure?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.route?.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.bus?.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchStatus = filterStatus === 'all' || trip.status === filterStatus
      const matchRoute = filterRoute === 'all' || trip.routeId === filterRoute
      
      return matchSearch && matchStatus && matchRoute
    })

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [trips, searchTerm, filterStatus, filterRoute, sortConfig])

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown size={16} className="text-gray-400" />
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={16} className="text-blue-600" /> : 
      <ChevronDown size={16} className="text-blue-600" />
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Chuyến Đi</h2>
          <p className="text-gray-600 mt-1">Tổng cộng: {trips.length} chuyến</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            <Eye size={20} />
            {viewMode === 'grid' ? 'Dạng Bảng' : 'Dạng Lưới'}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Thêm Chuyến Mới
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tuyến đường, biển số xe..."
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
          <option value="scheduled">Sẵn sàng</option>
          <option value="departed">Đang chạy</option>
          <option value="arrived">Đã đến</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        <select
          value={filterRoute}
          onChange={(e) => setFilterRoute(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả tuyến đường</option>
          {routes.map(route => (
            <option key={route.id} value={route.id}>
              {route.departure} → {route.destination}
            </option>
          ))}
        </select>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Làm Mới
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Chuyến', value: trips.length, color: 'blue', icon: Map },
          { label: 'Đang Chạy', value: trips.filter(t => t.status === 'departed').length, color: 'green', icon: Clock },
          { label: 'Sẵn Sàng', value: trips.filter(t => t.status === 'scheduled').length, color: 'yellow', icon: CheckCircle },
          { label: 'Đã Hủy', value: trips.filter(t => t.status === 'cancelled').length, color: 'red', icon: Trash2 }
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

      {/* Trips Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredAndSortedTrips.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
              {/* THAY THẾ Route BẰNG Map */}
              <Map className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">Không tìm thấy chuyến đi nào</p>
            </div>
          ) : (
            filteredAndSortedTrips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onEdit={handleOpenModal}
                onDelete={handleDeleteTrip}
                onDuplicate={handleDuplicateTrip}
                StatusBadge={StatusBadge}
              />
            ))
          )}
        </div>
      ) : (
        <TripTableView 
          trips={filteredAndSortedTrips}
          onEdit={handleOpenModal}
          onDelete={handleDeleteTrip}
          onDuplicate={handleDuplicateTrip}
          StatusBadge={StatusBadge}
          onSort={handleSort}
          sortConfig={sortConfig}
          SortIcon={SortIcon}
        />
      )}

      {/* Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal} size="lg">
          <TripForm
            trip={editingTrip}
            onSave={handleSaveTrip}
            onClose={handleCloseModal}
            routes={routes}
            buses={buses}
          />
        </Modal>
      )}
    </div>
  )
}

// Trip Card Component for Grid View
const TripCard = ({ trip, onEdit, onDelete, onDuplicate, StatusBadge }) => {
  const isPastTrip = new Date(trip.departureTime) < new Date()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition">
                {trip.route?.departure} → {trip.route?.destination}
              </p>
              <p className="text-sm text-gray-600">Quãng đường: {trip.route?.distance} km</p>
            </div>
          </div>
        </div>
        <StatusBadge status={trip.status} departureTime={trip.departureTime} />
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-gray-600" />
          <span>{formatDateTime(trip.departureTime)}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={16} className="text-gray-600" />
          <span>{trip.estimatedDuration || 'N/A'} giờ</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Users size={16} className="text-gray-600" />
          <span>{trip.availableSeats}/{trip.bus?.capacity || 0} ghế</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Car size={16} className="text-gray-600" />
          <span>{trip.bus?.licensePlate || 'N/A'}</span>
        </div>
      </div>

      {/* Progress Bar for Seats */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Tỷ lệ lấp đầy</span>
          <span>
            {trip.bus?.capacity ? 
              Math.round(((trip.bus.capacity - trip.availableSeats) / trip.bus.capacity) * 100) 
              : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              trip.availableSeats < 10 ? 'bg-red-500' :
              trip.availableSeats < 20 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ 
              width: `${trip.bus?.capacity ? 
                ((trip.bus.capacity - trip.availableSeats) / trip.bus.capacity) * 100 
                : 0}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Giá vé</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(trip.price)}</p>
        </div>

        <div className="flex gap-2">
          {!isPastTrip && (
            <button
              onClick={() => onEdit(trip)}
              className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
            >
              <Edit size={16} />
              Sửa
            </button>
          )}
          <button
            onClick={() => onDuplicate(trip.id)}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
            disabled={isPastTrip}
          >
            <Plus size={16} />
            Nhân Bản
          </button>
          {!isPastTrip && (
            <button
              onClick={() => onDelete(trip.id)}
              className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              <Trash2 size={16} />
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Trip Table View Component
const TripTableView = ({ trips, onEdit, onDelete, onDuplicate, StatusBadge, onSort, sortConfig, SortIcon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => onSort('departureTime')}
              >
                <div className="flex items-center gap-2">
                  Thời Gian
                  <SortIcon columnKey="departureTime" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Tuyến Đường
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Xe Buýt
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Ghế
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center gap-2">
                  Giá Vé
                  <SortIcon columnKey="price" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Trạng Thái
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trips.map((trip) => {
              const isPastTrip = new Date(trip.departureTime) < new Date()
              
              return (
                <tr key={trip.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(trip.departureTime)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {trip.estimatedDuration || 'N/A'} giờ
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {trip.route?.departure} → {trip.route?.destination}
                      </p>
                      <p className="text-sm text-gray-600">
                        {trip.route?.distance} km
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {trip.bus?.licensePlate || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {trip.bus?.model || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {trip.availableSeats}/{trip.bus?.capacity || 0}
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ 
                            width: `${trip.bus?.capacity ? 
                              ((trip.bus.capacity - trip.availableSeats) / trip.bus.capacity) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrency(trip.price)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={trip.status} departureTime={trip.departureTime} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {!isPastTrip && (
                        <button
                          onClick={() => onEdit(trip)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="Sửa chuyến đi"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onDuplicate(trip.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Nhân bản chuyến đi"
                        disabled={isPastTrip}
                      >
                        <Plus size={16} />
                      </button>
                      {!isPastTrip && (
                        <button
                          onClick={() => onDelete(trip.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa chuyến đi"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Trip Form Component
const TripForm = ({ trip, onSave, onClose, routes, buses }) => {
  const [formData, setFormData] = useState({
    routeId: trip?.routeId || '',
    busId: trip?.busId || '',
    departureTime: trip?.departureTime ? 
      new Date(trip.departureTime).toISOString().slice(0, 16) : '',
    price: trip?.price || '',
    estimatedDuration: trip?.estimatedDuration || '',
    status: trip?.status || 'scheduled'
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.routeId) newErrors.routeId = 'Vui lòng chọn lộ trình'
    if (!formData.busId) newErrors.busId = 'Vui lòng chọn xe buýt'
    if (!formData.departureTime) newErrors.departureTime = 'Vui lòng chọn thời gian khởi hành'
    if (!formData.price || formData.price < 0) newErrors.price = 'Giá vé không hợp lệ'
    if (!formData.estimatedDuration || formData.estimatedDuration < 0) newErrors.estimatedDuration = 'Thời gian ước tính không hợp lệ'
    
    // Check if departure time is in the future
    if (formData.departureTime && new Date(formData.departureTime) <= new Date()) {
      newErrors.departureTime = 'Thời gian khởi hành phải trong tương lai'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Failed to save trip:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedBus = buses.find(bus => bus.id === formData.busId)
  const selectedRoute = routes.find(route => route.id === formData.routeId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-900">
          {trip ? 'Sửa Chuyến Đi' : 'Thêm Chuyến Mới'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <Trash2 size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Route Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lộ Trình *
          </label>
          <select
            name="routeId"
            value={formData.routeId}
            onChange={handleChange}
            required
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.routeId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn lộ trình...</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.departure} → {route.destination} ({route.distance}km)
              </option>
            ))}
          </select>
          {errors.routeId && (
            <p className="text-red-600 text-sm mt-1">{errors.routeId}</p>
          )}
        </div>

        {/* Bus Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xe Buýt *
          </label>
          <select
            name="busId"
            value={formData.busId}
            onChange={handleChange}
            required
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.busId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn xe buýt...</option>
            {buses.filter(bus => bus.status === 'active').map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.licensePlate} - {bus.model} ({bus.capacity} chỗ)
              </option>
            ))}
          </select>
          {errors.busId && (
            <p className="text-red-600 text-sm mt-1">{errors.busId}</p>
          )}
          {selectedBus && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm">
              <p>Model: {selectedBus.model}</p>
              <p>Số ghế: {selectedBus.capacity}</p>
              <p>Trạng thái: {selectedBus.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</p>
            </div>
          )}
        </div>

        {/* Departure Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời Gian Khởi Hành *
          </label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.departureTime ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.departureTime && (
            <p className="text-red-600 text-sm mt-1">{errors.departureTime}</p>
          )}
        </div>

        {/* Estimated Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời Gian Ước Tính (giờ) *
          </label>
          <input
            type="number"
            name="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={handleChange}
            required
            min="0.5"
            max="48"
            step="0.5"
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.estimatedDuration ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.estimatedDuration && (
            <p className="text-red-600 text-sm mt-1">{errors.estimatedDuration}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá Vé (VND) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="1000"
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price}</p>
          )}
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
            <option value="scheduled">Sẵn sàng</option>
            <option value="departed">Đã khởi hành</option>
            <option value="arrived">Đã đến</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      {(selectedBus || selectedRoute) && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">Tóm Tắt Chuyến Đi</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {selectedRoute && (
              <div>
                <p className="text-blue-700 font-medium">Tuyến đường:</p>
                <p>{selectedRoute.departure} → {selectedRoute.destination}</p>
                <p className="text-blue-600">Quãng đường: {selectedRoute.distance} km</p>
              </div>
            )}
            {selectedBus && (
              <div>
                <p className="text-blue-700 font-medium">Xe buýt:</p>
                <p>{selectedBus.licensePlate} - {selectedBus.model}</p>
                <p className="text-blue-600">Số ghế: {selectedBus.capacity}</p>
              </div>
            )}
            {formData.departureTime && (
              <div>
                <p className="text-blue-700 font-medium">Thời gian:</p>
                <p>{formatDateTime(formData.departureTime)}</p>
              </div>
            )}
            {formData.price && (
              <div>
                <p className="text-blue-700 font-medium">Giá vé:</p>
                <p className="text-green-600 font-bold">{formatCurrency(formData.price)}</p>
              </div>
            )}
          </div>
        </div>
      )}

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
          {loading ? 'Đang xử lý...' : (trip ? 'Cập Nhật' : 'Thêm Mới')}
        </button>
      </div>
    </form>
  )
}

export default TripManagement