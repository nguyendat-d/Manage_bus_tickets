import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../services/auth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { User, Mail, Phone, Calendar, Edit3, MapPin, Shield, CreditCard, Bell, Settings, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/helpers'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile()
      setProfile(response.data)
      setFormData({
        full_name: response.data.full_name || '',
        phone: response.data.phone || '',
        avatar_url: response.data.avatar_url || ''
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage('')
      
      const response = await authService.updateProfile(formData)
      setProfile(response.data)
      updateProfile(response.data)
      setEditing(false)
      setMessage('Cập nhật thông tin thành công!')
      
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      setMessage('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      avatar_url: profile.avatar_url || ''
    })
    setEditing(false)
    setMessage('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" text="Đang tải thông tin..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-blue-600" />
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {profile.full_name}
                </h2>
                
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {profile.role === 'passenger' && 'Hành khách'}
                  {profile.role === 'bus_company' && 'Nhà xe'}
                  {profile.role === 'admin' && 'Quản trị viên'}
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar size={16} />
                    <span>
                      Tham gia {formatDateTime(profile.created_at, { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { icon: User, label: 'Hồ sơ cá nhân', active: true },
                  { icon: CreditCard, label: 'Vé của tôi', href: '/my-bookings' },
                  { icon: Bell, label: 'Thông báo', href: '/notifications' },
                  { icon: Shield, label: 'Bảo mật', href: '/security' },
                  { icon: Settings, label: 'Cài đặt', href: '/settings' }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={index}
                      to={item.href || '#'}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      {item.href && <ArrowRight size={16} className="ml-auto" />}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                    <p className="text-gray-600 mt-1">Quản lý thông tin tài khoản của bạn</p>
                  </div>
                  
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <Edit3 size={16} />
                      <span>Chỉnh sửa</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Success Message */}
              {message && (
                <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {message}
                </div>
              )}

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Thông tin cá nhân
                    </h3>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Họ và tên
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          className="input"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <User size={20} className="text-gray-400" />
                          <span className="text-gray-900 font-medium">{profile.full_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Email
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Mail size={20} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">{profile.email}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Email không thể thay đổi
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Số điện thoại
                      </label>
                      {editing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="input"
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Phone size={20} className="text-gray-400" />
                          <span className="text-gray-900 font-medium">{profile.phone || 'Chưa cập nhật'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Thông tin tài khoản
                    </h3>

                    {/* Account Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Trạng thái tài khoản
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className={`w-3 h-3 rounded-full ${
                          profile.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-gray-900 font-medium capitalize">
                          {profile.status === 'active' ? 'Đang hoạt động' : profile.status}
                        </span>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vai trò
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Shield size={20} className="text-gray-400" />
                        <span className="text-gray-900 font-medium capitalize">
                          {profile.role === 'passenger' && 'Hành khách'}
                          {profile.role === 'bus_company' && 'Nhà xe'}
                          {profile.role === 'admin' && 'Quản trị viên'}
                        </span>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Ngày tham gia
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Calendar size={20} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">
                          {formatDateTime(profile.created_at, { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Hành động nhanh</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <Link
                          to="/change-password"
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          <span className="text-blue-700 font-medium">Đổi mật khẩu</span>
                          <ArrowRight size={16} className="text-blue-600" />
                        </Link>
                        <Link
                          to="/my-bookings"
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                        >
                          <span className="text-green-700 font-medium">Xem vé của tôi</span>
                          <ArrowRight size={16} className="text-green-600" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Actions */}
                {editing && (
                  <div className="flex space-x-3 pt-8 border-t border-gray-200 mt-8">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang lưu...</span>
                        </div>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile