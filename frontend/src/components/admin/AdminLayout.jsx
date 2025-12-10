import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      authService.logout();
    }
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: '📊',
      label: 'Dashboard',
      description: 'Tổng quan hệ thống'
    },
    {
      path: '/admin/users',
      icon: '👥',
      label: 'Quản lý Users',
      description: 'Quản lý người dùng'
    },
    {
      path: '/admin/companies',
      icon: '🚌',
      label: 'Quản lý Nhà xe',
      description: 'Duyệt và quản lý nhà xe'
    },
    {
      path: '/admin/routes',
      icon: '🛣️',
      label: 'Quản lý Tuyến đường',
      description: 'CRUD tuyến đường'
    },
    {
      path: '/admin/payments',
      icon: '💳',
      label: 'Quản lý Thanh toán',
      description: 'Xác nhận thanh toán'
    }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎫</span>
            {isSidebarOpen && <span className="logo-text">Bus Ticket Admin</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && (
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '⬅️' : '➡️'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1>
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>

          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {user?.full_name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.full_name || 'Admin'}</span>
                <span className="user-role">{user?.role || 'Administrator'}</span>
              </div>
            </div>

            <button className="btn-logout" onClick={handleLogout}>
              🚪 Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
