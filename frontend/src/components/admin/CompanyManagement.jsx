import React, { useState, useEffect } from 'react'
import { adminService } from '../../pages/services/admin'
import LoadingSpinner from '../common/LoadingSpinner'
import Modal from '../common/Modal'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Download,
  MoreVertical,
  Building,
  Mail,
  Phone,
  MapPin,
  Eye
} from 'lucide-react'

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCompanies, setSelectedCompanies] = useState([])

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response = await adminService.getCompanies()
      setCompanies(response.data.companies || [])
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (company = null) => {
    setEditingCompany(company)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setEditingCompany(null)
    setShowModal(false)
  }

  const handleSaveCompany = async (companyData) => {
    try {
      if (editingCompany) {
        await adminService.updateCompany(editingCompany.id, companyData)
      } else {
        await adminService.createCompany(companyData)
      }
      handleCloseModal()
      fetchCompanies()
    } catch (error) {
      console.error('Failed to save company:', error)
      alert('Có lỗi xảy ra khi lưu thông tin công ty')
    }
  }

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công ty này? Hành động này không thể hoàn tác.')) {
      try {
        await adminService.deleteCompany(companyId)
        fetchCompanies()
      } catch (error) {
        console.error('Failed to delete company:', error)
        alert('Có lỗi xảy ra khi xóa công ty')
      }
    }
  }

  const handleApproveCompany = async (companyId) => {
    try {
      await adminService.approveCompany(companyId)
      fetchCompanies()
    } catch (error) {
      console.error('Failed to approve company:', error)
      alert('Có lỗi xảy ra khi duyệt công ty')
    }
  }

  const handleRejectCompany = async (companyId) => {
    const reason = prompt('Lý do từ chối:')
    if (reason) {
      try {
        await adminService.rejectCompany(companyId, reason)
        fetchCompanies()
      } catch (error) {
        console.error('Failed to reject company:', error)
        alert('Có lỗi xảy ra khi từ chối công ty')
      }
    }
  }

  const handleSelectCompany = (companyId) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  const handleSelectAll = () => {
    setSelectedCompanies(
      selectedCompanies.length === filteredCompanies.length 
        ? [] 
        : filteredCompanies.map(company => company.id)
    )
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: { icon: Clock, color: 'yellow', text: 'Chờ Duyệt', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
      approved: { icon: CheckCircle, color: 'green', text: 'Đã Duyệt', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
      rejected: { icon: AlertCircle, color: 'red', text: 'Từ Chối', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' }
    }
    return configs[status] || configs.pending
  }

  const filteredCompanies = companies.filter(company => {
    const matchSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (company.phone && company.phone.includes(searchTerm))
    const matchFilter = filterStatus === 'all' || company.status === filterStatus
    return matchSearch && matchFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Đang tải danh sách công ty..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Nhà Xe</h1>
          <p className="text-gray-600 mt-2">Quản lý toàn bộ đối tác vận tải trên hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={18} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span>Thêm Nhà Xe</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng Nhà Xe', value: companies.length, color: 'blue' },
          { label: 'Đã Duyệt', value: companies.filter(c => c.status === 'approved').length, color: 'green' },
          { label: 'Chờ Duyệt', value: companies.filter(c => c.status === 'pending').length, color: 'yellow' },
          { label: 'Từ Chối', value: companies.filter(c => c.status === 'rejected').length, color: 'red' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                <Building className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ Duyệt</option>
                  <option value="approved">Đã Duyệt</option>
                  <option value="rejected">Từ Chối</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedCompanies.length > 0 
                  ? `Đã chọn ${selectedCompanies.length} nhà xe`
                  : `Tổng cộng ${filteredCompanies.length} nhà xe`
                }
              </span>
            </div>
            
            {selectedCompanies.length > 0 && (
              <div className="flex items-center gap-3">
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Duyệt hàng loạt
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Từ chối hàng loạt
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thông Tin Nhà Xe</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Liên Hệ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Building className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-lg">Không tìm thấy nhà xe nào</p>
                    <p className="text-gray-400 mt-1">Thử thay đổi điều kiện tìm kiếm</p>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => {
                  const statusConfig = getStatusConfig(company.status)
                  const Icon = statusConfig.icon
                  
                  return (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company.id)}
                            onChange={() => handleSelectCompany(company.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                              {company.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                              <MapPin size={14} />
                              {company.address || 'Chưa cập nhật địa chỉ'}
                            </p>
                            {company.taxId && (
                              <p className="text-xs text-gray-500 mt-1">MST: {company.taxId}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={16} />
                            {company.email}
                          </div>
                          {company.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={16} />
                              {company.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} px-3 py-2 rounded-full`}>
                          <Icon size={16} />
                          <span className="text-sm font-medium">{statusConfig.text}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(company)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {company.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveCompany(company.id)}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                title="Duyệt nhà xe"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectCompany(company.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Từ chối"
                              >
                                <AlertCircle size={18} />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleOpenModal(company)}
                            className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteCompany(company.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
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
      </div>

      {/* Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal} size="lg">
          <CompanyForm
            company={editingCompany}
            onSave={handleSaveCompany}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  )
}

// Enhanced Company Form Component
const CompanyForm = ({ company, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || '',
    taxId: company?.taxId || '',
    description: company?.description || '',
    contactPerson: company?.contactPerson || '',
    website: company?.website || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Building className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {company ? 'Chỉnh Sửa Thông Tin Nhà Xe' : 'Thêm Nhà Xe Mới'}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {company ? 'Cập nhật thông tin nhà xe' : 'Điền đầy đủ thông tin nhà xe mới'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên Nhà Xe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Nhập tên nhà xe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="email@congty.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Điện Thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="0123 456 789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã Số Thuế
          </label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="1234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Người Liên Hệ
          </label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Họ tên người liên hệ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa Chỉ
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Địa chỉ đầy đủ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô Tả
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Mô tả về nhà xe, dịch vụ..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Hủy Bỏ
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          {company ? 'Cập Nhật' : 'Thêm Mới'}
        </button>
      </div>
    </form>
  )
}

export default CompanyManagement