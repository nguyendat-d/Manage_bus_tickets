import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    role: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(
        filter.page,
        filter.limit,
        filter.role || null
      );
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Không thể tải danh sách người dùng');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (!confirm(`Bạn có chắc muốn ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} người dùng này?`)) {
      return;
    }

    try {
      const response = await adminService.updateUserStatus(userId, newStatus);
      if (response.success) {
        alert('Cập nhật trạng thái thành công!');
        loadUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`Bạn có chắc muốn đổi vai trò người dùng này thành ${newRole}?`)) {
      return;
    }

    try {
      const response = await adminService.updateUserRole(userId, newRole);
      if (response.success) {
        alert('Cập nhật vai trò thành công!');
        loadUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { class: 'badge-danger', text: 'Admin' },
      bus_company: { class: 'badge-warning', text: 'Nhà xe' },
      passenger: { class: 'badge-info', text: 'Hành khách' }
    };
    const badge = badges[role] || badges.passenger;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'badge-success', text: 'Hoạt động' },
      inactive: { class: 'badge-warning', text: 'Tạm khóa' },
      suspended: { class: 'badge-danger', text: 'Đã khóa' }
    };
    const badge = badges[status] || badges.active;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý người dùng</h2>
          <p className="page-description">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filters">
          <div className="filter-group">
            <label>Lọc theo vai trò:</label>
            <select
              value={filter.role}
              onChange={(e) => setFilter({ ...filter, role: e.target.value, page: 1 })}
            >
              <option value="">Tất cả</option>
              <option value="passenger">Hành khách</option>
              <option value="bus_company">Nhà xe</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><strong>{user.full_name}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="action-buttons">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="role-select"
                          disabled={user.role === 'admin'}
                        >
                          <option value="passenger">Hành khách</option>
                          <option value="bus_company">Nhà xe</option>
                          <option value="admin">Admin</option>
                        </select>
                        {user.status === 'active' ? (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleStatusChange(user.id, 'inactive')}
                          >
                            🔒 Khóa
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(user.id, 'active')}
                          >
                            ✅ Kích hoạt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="btn btn-sm"
                disabled={filter.page === 1}
                onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
              >
                ← Trước
              </button>
              <span>Trang {filter.page} / {totalPages}</span>
              <button
                className="btn btn-sm"
                disabled={filter.page === totalPages}
                onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
              >
                Sau →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
