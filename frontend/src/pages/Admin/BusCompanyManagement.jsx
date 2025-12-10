import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const BusCompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    status: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCompanies();
  }, [filter]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBusCompanies(
        filter.page,
        filter.limit,
        filter.status || null
      );
      if (response.success) {
        setCompanies(response.data.companies);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Không thể tải danh sách nhà xe');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId) => {
    if (!confirm('Bạn có chắc muốn duyệt nhà xe này?')) return;

    try {
      const response = await adminService.approveBusCompany(companyId, 'approved');
      if (response.success) {
        alert('Duyệt nhà xe thành công!');
        loadCompanies();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleReject = async (companyId) => {
    if (!confirm('Bạn có chắc muốn từ chối nhà xe này?')) return;

    try {
      const response = await adminService.approveBusCompany(companyId, 'rejected');
      if (response.success) {
        alert('Từ chối nhà xe thành công!');
        loadCompanies();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Chờ duyệt', icon: '⏳' },
      approved: { class: 'badge-success', text: 'Đã duyệt', icon: '✅' },
      rejected: { class: 'badge-danger', text: 'Từ chối', icon: '❌' },
      suspended: { class: 'badge-danger', text: 'Đã khóa', icon: '🔒' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`badge ${badge.class}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  return (
    <div className="company-management">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý nhà xe</h2>
          <p className="page-description">Duyệt và quản lý các nhà xe đăng ký</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filters">
          <div className="filter-group">
            <label>Lọc theo trạng thái:</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="suspended">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
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
                  <th>Tên nhà xe</th>
                  <th>Người liên hệ</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng ký</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.id}</td>
                    <td><strong>{company.company_name}</strong></td>
                    <td>{company.contact_name}</td>
                    <td>{company.email}</td>
                    <td>{company.phone}</td>
                    <td>{company.address}</td>
                    <td>{getStatusBadge(company.status)}</td>
                    <td>{new Date(company.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="action-buttons">
                        {company.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(company.id)}
                            >
                              ✅ Duyệt
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(company.id)}
                            >
                              ❌ Từ chối
                            </button>
                          </>
                        )}
                        {company.status === 'approved' && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleReject(company.id)}
                          >
                            🔒 Khóa
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

export default BusCompanyManagement;
