import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import authService from '../../services/authService';
import '../../styles/profile.css';

const BusCompanyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/users/profile', formData);

      if (response.data.success) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        showNotification('Cập nhật thông tin thành công!', 'success');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Có lỗi xảy ra!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showNotification('Mật khẩu mới phải có ít nhất 8 ký tự!', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await api.put('/users/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });

      if (response.data.success) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        showNotification('Đổi mật khẩu thành công!', 'success');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Có lỗi xảy ra!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '', type: '' })}>✕</button>
        </div>
      )}

      <header className="profile-header">
        <div className="header-content">
          <h1>Thông tin nhà xe</h1>
          <button onClick={() => navigate('/bus-company/dashboard')} className="btn-back">
            ← Quay lại
          </button>
        </div>
      </header>

      <div className="profile-container">
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.full_name?.charAt(0).toUpperCase() || '🚌'}
            </div>
            <h2>{user?.full_name}</h2>
            <p className="user-email">{user?.email}</p>
            <span className="user-badge">
              {user?.role === 'bus_company' ? 'Nhà xe' : 'User'}
            </span>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab ${!isChangingPassword ? 'active' : ''}`}
              onClick={() => setIsChangingPassword(false)}
            >
              Thông tin cá nhân
            </button>
            <button 
              className={`tab ${isChangingPassword ? 'active' : ''}`}
              onClick={() => setIsChangingPassword(true)}
            >
              Đổi mật khẩu
            </button>
          </div>

          {!isChangingPassword ? (
            <div className="profile-content">
              {!isEditing ? (
                <div className="profile-info">
                  <div className="info-row">
                    <label>Tên nhà xe:</label>
                    <span>{user?.full_name}</span>
                  </div>
                  <div className="info-row">
                    <label>Email:</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-row">
                    <label>Số điện thoại:</label>
                    <span>{user?.phone}</span>
                  </div>
                  <div className="info-row">
                    <label>Vai trò:</label>
                    <span className="role-badge">Nhà xe</span>
                  </div>

                  <button 
                    className="btn-primary btn-block"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa thông tin
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="profile-form">
                  <div className="form-group">
                    <label>Tên nhà xe</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email (không thể thay đổi)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          full_name: user?.full_name || '',
                          phone: user?.phone || '',
                          email: user?.email || ''
                        });
                      }}
                      disabled={loading}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  >
                    {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu mới</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                    placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  >
                    {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                    placeholder="Nhập lại mật khẩu mới"
                    className={passwordData.confirmPassword && passwordData.newPassword ? 
                      (passwordData.confirmPassword === passwordData.newPassword ? 'input-match' : 'input-no-match') : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  >
                    {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword && (
                  <div className={`password-match-hint ${passwordData.confirmPassword === passwordData.newPassword ? 'match' : 'no-match'}`}>
                    {passwordData.confirmPassword === passwordData.newPassword ? 
                      '✓ Mật khẩu khớp' : '✗ Mật khẩu không khớp'}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusCompanyProfile;
