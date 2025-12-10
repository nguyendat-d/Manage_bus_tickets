import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    departure_city: '',
    arrival_city: '',
    departure_station: '',
    arrival_station: '',
    distance_km: '',
    estimated_duration_minutes: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRoutes();
  }, [page]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const response = await adminService.getRoutes(page, 10);
      if (response.success) {
        setRoutes(response.data.routes);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Không thể tải danh sách tuyến đường');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingRoute) {
        response = await adminService.updateRoute(editingRoute.id, formData);
      } else {
        response = await adminService.createRoute(formData);
      }

      if (response.success) {
        alert(editingRoute ? 'Cập nhật tuyến đường thành công!' : 'Thêm tuyến đường thành công!');
        setShowModal(false);
        resetForm();
        loadRoutes();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      departure_city: route.departure_city || '',
      arrival_city: route.arrival_city || '',
      departure_station: route.departure_station || '',
      arrival_station: route.arrival_station || '',
      distance_km: route.distance_km || route.distance || '',
      estimated_duration_minutes: route.estimated_duration_minutes || (route.duration * 60) || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (routeId) => {
    if (!confirm('Bạn có chắc muốn xóa tuyến đường này?')) return;

    try {
      const response = await adminService.deleteRoute(routeId);
      if (response.success) {
        alert('Xóa tuyến đường thành công!');
        loadRoutes();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      departure_city: '',
      arrival_city: '',
      departure_station: '',
      arrival_station: '',
      distance_km: '',
      estimated_duration_minutes: ''
    });
    setEditingRoute(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="route-management">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý tuyến đường</h2>
          <p className="page-description">Thêm, sửa, xóa tuyến đường</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Thêm tuyến đường
        </button>
      </div>

      {/* Routes Table */}
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
                  <th>Tuyến đường</th>
                  <th>Bến xuất phát</th>
                  <th>Bến đến</th>
                  <th>Khoảng cách</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id}>
                    <td>{route.id}</td>
                    <td>
                      <strong>{route.departure_city}</strong> → <strong>{route.arrival_city}</strong>
                    </td>
                    <td>{route.departure_station}</td>
                    <td>{route.arrival_station}</td>
                    <td>{route.distance_km || route.distance || 0} km</td>
                    <td>{Math.round((route.estimated_duration_minutes || route.duration * 60 || 0) / 60 * 10) / 10} giờ</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(route)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(route.id)}
                        >
                          🗑️ Xóa
                        </button>
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
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Trước
              </button>
              <span>Trang {page} / {totalPages}</span>
              <button
                className="btn btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Sau →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoute ? 'Sửa tuyến đường' : 'Thêm tuyến đường mới'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Thành phố xuất phát</label>
                  <input
                    type="text"
                    value={formData.departure_city}
                    onChange={(e) => setFormData({ ...formData, departure_city: e.target.value })}
                    required
                    placeholder="Ví dụ: Ho Chi Minh"
                  />
                </div>
                <div className="form-group">
                  <label>Thành phố đến</label>
                  <input
                    type="text"
                    value={formData.arrival_city}
                    onChange={(e) => setFormData({ ...formData, arrival_city: e.target.value })}
                    required
                    placeholder="Ví dụ: Da Lat"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bến xuất phát</label>
                  <input
                    type="text"
                    value={formData.departure_station}
                    onChange={(e) => setFormData({ ...formData, departure_station: e.target.value })}
                    required
                    placeholder="Ví dụ: Bến xe Miền Đông"
                  />
                </div>
                <div className="form-group">
                  <label>Bến đến</label>
                  <input
                    type="text"
                    value={formData.arrival_station}
                    onChange={(e) => setFormData({ ...formData, arrival_station: e.target.value })}
                    required
                    placeholder="Ví dụ: Bến xe Đà Lạt"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Khoảng cách (km)</label>
                  <input
                    type="number"
                    value={formData.distance_km}
                    onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                    required
                    placeholder="300"
                  />
                </div>
                <div className="form-group">
                  <label>Thời gian (phút)</label>
                  <input
                    type="number"
                    value={formData.estimated_duration_minutes}
                    onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: e.target.value })}
                    required
                    placeholder="360"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoute ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
