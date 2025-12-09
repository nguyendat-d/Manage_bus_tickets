import React, { useState, useEffect } from 'react'
import { adminService } from '../../pages/services/admin'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'
import Modal from '../../components/common/Modal'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Download,
  Users,
  Shield,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  Eye
} from 'lucide-react'
import { formatDateTime } from '../../utils/helpers'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminService.getUsers(filters)
      setUsers(response.data.users || [])
      setPagination(response.data.pagination || {})
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminService.updateUserStatus(userId, { status: newStatus })
      fetchUsers()
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Tất cả dữ liệu liên quan sẽ bị mất.')) return

    try {
      await adminService.deleteUser(userId)
      fetchUsers()
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa người dùng')
    }
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { icon: Shield, color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Quản trị viên' },
      bus_company: { icon: Building, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Nhà xe' },
      passenger: { icon: User, color: 'bg-green-100 text-green-800 border-green-200', label: 'Hành khách' }
    }
    const config = roleConfig[role] || roleConfig.passenger
    const Icon = config.icon
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon size={14} />
        <span>{config.label}</span>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Hoạt động' },
      inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Không hoạt động' },
      suspended: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Đã khóa' },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Chờ xác thực' }
    }
    const config = statusConfig[status] || statusConfig.inactive
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getRoleIcon = (role) => {
    const icons = {
      admin: Shield,
      bus_company: Building,
      passenger: User
    }
    return icons[role] || User
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    companies: users.filter(u => u.role === 'bus_company').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
          <p className="text-gray-600 mt-2">Quản lý toàn bộ người dùng và phân quyền trên hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={18} />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng Người Dùng', value: stats.total, icon: Users, color: 'blue' },
          { label: 'Đang Hoạt Động', value: stats.active, icon: UserCheck, color: 'green' },
          { label: 'Quản Trị Viên', value: stats.admins, icon: Shield, color: 'purple' },
          { label: 'Nhà Xe', value: stats.companies, icon: Building, color: 'orange' }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm Kiếm</label>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vai Trò</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="bus_company">Nhà xe</option>
              <option value="passenger">Hành khách</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Đã khóa</option>
              <option value="pending">Chờ xác thực</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ search: '', role: '', status: '', page: 1, limit: 10 })}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <Filter size={18} />
              Đặt Lại
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Đang tải danh sách người dùng..." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Người Dùng</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thông Tin</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vai Trò</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">Không tìm thấy người dùng nào</p>
                        <p className="text-gray-400 mt-1">Thử thay đổi bộ lọc để tìm kiếm</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const RoleIcon = getRoleIcon(user.role)
                      
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                                  {user.full_name || 'Chưa cập nhật'}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {user.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone size={14} />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar size={14} />
                                <span>{formatDateTime(user.created_at)}</span>
                              </div>
                              {user.last_login && (
                                <div className="text-xs text-gray-500">
                                  Đăng nhập: {formatDateTime(user.last_login)}
                                </div>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            {getRoleBadge(user.role)}
                          </td>
                          
                          <td className="px-6 py-4">
                            {getStatusBadge(user.status)}
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} />
                              </button>
                              
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleStatusChange(user.id, 'suspended')}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Khóa tài khoản"
                                >
                                  <UserX size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(user.id, 'active')}
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Kích hoạt tài khoản"
                                >
                                  <UserCheck size={18} />
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa người dùng"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          size="lg"
        >
          <UserDetailModal 
            user={selectedUser} 
            onClose={() => setShowUserModal(false)}
            onStatusChange={handleStatusChange}
          />
        </Modal>
      )}
    </div>
  )
}

// User Detail Modal Component
const UserDetailModal = ({ user, onClose, onStatusChange }) => {
  const RoleIcon = getRoleIcon(user.role)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{user.full_name || 'Chưa cập nhật'}</h3>
          <p className="text-gray-600">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            {getRoleBadge(user.role)}
            {getStatusBadge(user.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thông Tin Liên Hệ</label>
            <div className="space-y-3">
              {user.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Số điện thoại</div>
                    <div className="text-sm text-gray-600">{user.phone}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Ngày tham gia</div>
                  <div className="text-sm text-gray-600">{formatDateTime(user.created_at)}</div>
                </div>
              </div>

              {user.last_login && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <UserCheck size={18} className="text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Đăng nhập cuối</div>
                    <div className="text-sm text-gray-600">{formatDateTime(user.last_login)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thống Kê</label>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <User size={18} className="text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Tổng đơn hàng</div>
                  <div className="text-sm text-gray-600">{user.booking_count || 0} đơn</div>
                </div>
              </div>

              {user.role === 'bus_company' && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Building size={18} className="text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Chuyến xe đang vận hành</div>
                    <div className="text-sm text-gray-600">{user.active_trips || 0} chuyến</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        {user.status === 'active' ? (
          <button
            onClick={() => {
              onStatusChange(user.id, 'suspended')
              onClose()
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Khóa Tài Khoản
          </button>
        ) : (
          <button
            onClick={() => {
              onStatusChange(user.id, 'active')
              onClose()
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            Kích Hoạt
          </button>
        )}
        <button
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}

// Helper function to get role icon
function getRoleIcon(role) {
  const icons = {
    admin: Shield,
    bus_company: Building,
    passenger: User
  }
  return icons[role] || User
}

export default UserManagement