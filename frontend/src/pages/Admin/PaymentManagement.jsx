import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

const PaymentManagement = () => {
  const { success, error: showError } = useNotification();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    payment_method: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.payment_method) params.append('payment_method', filter.payment_method);
      params.append('page', filter.page);
      params.append('limit', filter.limit);

      const response = await api.get(`/payments/admin/all?${params}`);
      setPayments(response.data.data.payments || []);
      setPagination(response.data.data.pagination || {});
    } catch (error) {
      console.error('Error loading payments:', error);
      showError('Không thể tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    if (!window.confirm('Xác nhận đã nhận được thanh toán?')) {
      return;
    }

    try {
      await api.put(`/payments/${paymentId}/confirm`);
      success('Đã xác nhận thanh toán thành công!');
      loadPayments();
    } catch (error) {
      console.error('Error confirming payment:', error);
      showError(error.response?.data?.message || 'Không thể xác nhận thanh toán');
    }
  };

  const handleRejectPayment = async (paymentId) => {
    const reason = window.prompt('Lý do từ chối thanh toán:');
    if (!reason) return;

    try {
      await api.put(`/payments/${paymentId}/reject`, { reason });
      success('Đã từ chối thanh toán');
      loadPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      showError(error.response?.data?.message || 'Không thể từ chối thanh toán');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Chờ xác nhận', class: 'status-pending' },
      success: { text: 'Đã thanh toán', class: 'status-success' },
      completed: { text: 'Đã thanh toán', class: 'status-success' },
      failed: { text: 'Thất bại', class: 'status-failed' },
      refunded: { text: 'Đã hoàn tiền', class: 'status-refunded' }
    };
    const badge = badges[status] || { text: status, class: '' };
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cash: '💵 Tiền mặt',
      bank_transfer: '🏦 Chuyển khoản',
      vnpay: '💳 VNPay',
      credit_card: '💳 Thẻ tín dụng'
    };
    return methods[method] || method;
  };

  if (loading && payments.length === 0) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>💳 Quản Lý Thanh Toán</h1>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="filters">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="success">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Phương thức:</label>
            <select
              value={filter.payment_method}
              onChange={(e) => setFilter({ ...filter, payment_method: e.target.value, page: 1 })}
            >
              <option value="">Tất cả</option>
              <option value="cash">Tiền mặt</option>
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="vnpay">VNPay</option>
              <option value="credit_card">Thẻ tín dụng</option>
            </select>
          </div>

          <button className="btn-refresh" onClick={loadPayments}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-card">
        {payments.length === 0 ? (
          <div className="empty-state">
            <p>📭 Không có thanh toán nào</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đặt vé</th>
                  <th>Khách hàng</th>
                  <th>Tuyến xe</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>
                      <strong className="booking-code-cell">{payment.booking_code}</strong>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-name">{payment.customer_name}</div>
                        <div className="user-email">{payment.customer_email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="route-cell">
                        {payment.departure_city} → {payment.arrival_city}
                      </div>
                    </td>
                    <td>
                      <strong className="amount-cell">
                        {payment.amount.toLocaleString('vi-VN')} ₫
                      </strong>
                    </td>
                    <td>{getPaymentMethodText(payment.payment_method)}</td>
                    <td>{getStatusBadge(payment.payment_status)}</td>
                    <td>
                      {new Date(payment.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {payment.payment_status === 'pending' && (
                          <>
                            <button
                              className="btn-action btn-confirm"
                              onClick={() => handleConfirmPayment(payment.id)}
                              title="Xác nhận đã thanh toán"
                            >
                              ✓ Xác nhận
                            </button>
                            <button
                              className="btn-action btn-reject"
                              onClick={() => handleRejectPayment(payment.id)}
                              title="Từ chối thanh toán"
                            >
                              ✕ Từ chối
                            </button>
                          </>
                        )}
                        {payment.payment_status === 'success' && (
                          <span className="status-text success">✓ Đã xác nhận</span>
                        )}
                        {payment.payment_status === 'failed' && (
                          <span className="status-text failed">✕ Đã từ chối</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              disabled={filter.page === 1}
              onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
            >
              ← Trước
            </button>
            <span>
              Trang {pagination.page} / {pagination.pages}
            </span>
            <button
              disabled={filter.page === pagination.pages}
              onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
