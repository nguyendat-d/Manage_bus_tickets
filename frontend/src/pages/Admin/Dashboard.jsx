import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useNotification } from '../../contexts/NotificationContext';

const Dashboard = () => {
  const { success: showSuccess, error: showError } = useNotification();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAnalytics();
      console.log('Analytics response:', response);
      if (response.success) {
        setAnalytics(response.data);
      } else {
        showError('Không thể tải dữ liệu thống kê');
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      showError(err.response?.data?.message || 'Có lỗi xảy ra khi tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="content-header">
        <div>
          <h1>📊 Dashboard & Analytics</h1>
          <p className="text-muted">Tổng quan hệ thống quản lý vé xe khách</p>
        </div>
        <button className="btn-refresh" onClick={loadAnalytics}>
          🔄 Làm mới
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <div className="stat-value">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(analytics?.revenue_stats?.total_revenue || 0)}
            </div>
            <div className="stat-label">Tổng doanh thu</div>
            <div className="stat-sublabel">
              {analytics?.revenue_stats?.total_bookings || 0} vé đã bán
            </div>
          </div>
        </div>

        <div className="stat-card bookings">
          <div className="stat-icon">🎫</div>
          <div className="stat-details">
            <div className="stat-value">
              {analytics?.revenue_stats?.total_bookings || 0}
            </div>
            <div className="stat-label">Tổng số vé</div>
            <div className="stat-sublabel">
              TB: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact'
              }).format(analytics?.revenue_stats?.average_booking || 0)}/vé
            </div>
          </div>
        </div>

        <div className="stat-card companies">
          <div className="stat-icon">🚌</div>
          <div className="stat-details">
            <div className="stat-value">
              {analytics?.company_stats?.approved_companies || 0}
            </div>
            <div className="stat-label">Nhà xe hoạt động</div>
            <div className="stat-sublabel">
              {analytics?.company_stats?.pending_approval || 0} chờ duyệt
            </div>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <div className="stat-value">
              {analytics?.user_stats?.total_users || 0}
            </div>
            <div className="stat-label">Người dùng</div>
            <div className="stat-sublabel">
              {analytics?.user_stats?.passengers || 0} hành khách
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Popular Routes */}
        <div className="chart-card">
          <div className="card-header">
            <h3>🔥 Tuyến đường phổ biến</h3>
          </div>
          <div className="card-content">
            {analytics?.popular_routes && analytics.popular_routes.length > 0 ? (
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Tuyến đường</th>
                    <th className="text-center">Số chuyến</th>
                    <th className="text-center">Vé bán</th>
                    <th className="text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.popular_routes.map((route, index) => (
                    <tr key={index}>
                      <td>
                        <div className="route-label">
                          <strong>{route.departure_city}</strong> → <strong>{route.arrival_city}</strong>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-primary">{route.trip_count}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-success">{route.booking_count}</span>
                      </td>
                      <td className="text-right">
                        <strong>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            notation: 'compact',
                            maximumFractionDigits: 1
                          }).format(route.total_revenue)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu tuyến đường</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="chart-card">
          <div className="card-header">
            <h3>📈 Doanh thu 6 tháng gần nhất</h3>
          </div>
          <div className="card-content">
            {analytics?.monthly_revenue && analytics.monthly_revenue.length > 0 ? (
              <div className="revenue-chart">
                {analytics.monthly_revenue.map((month, index) => {
                  const maxRevenue = Math.max(...analytics.monthly_revenue.map(m => m.revenue));
                  const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="chart-item">
                      <div className="chart-label">{month.month}</div>
                      <div className="chart-bar-container">
                        <div
                          className="chart-bar"
                          style={{ width: `${percentage}%` }}
                          title={`${month.booking_count} vé`}
                        ></div>
                      </div>
                      <div className="chart-value">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(month.revenue)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="additional-stats">
        {/* Payment Methods */}
        <div className="stat-card-small">
          <div className="card-header">
            <h4>💳 Phương thức thanh toán</h4>
          </div>
          <div className="card-content">
            {analytics?.payment_stats && analytics.payment_stats.length > 0 ? (
              <div className="payment-methods">
                {analytics.payment_stats.map((stat, index) => (
                  <div key={index} className="payment-item">
                    <div className="payment-method">
                      {stat.payment_method === 'vnpay' && '💳 VNPay'}
                      {stat.payment_method === 'cash' && '💵 Tiền mặt'}
                      {stat.payment_method === 'credit_card' && '💳 Thẻ'}
                      {stat.payment_method === 'bank_transfer' && '🏦 Chuyển khoản'}
                    </div>
                    <div className="payment-stats">
                      <div className="payment-count">{stat.count} giao dịch</div>
                      <div className="payment-amount">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          notation: 'compact'
                        }).format(stat.total_amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">Chưa có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Booking Status */}
        <div className="stat-card-small">
          <div className="card-header">
            <h4>📋 Trạng thái đặt vé</h4>
          </div>
          <div className="card-content">
            {analytics?.booking_status_stats && analytics.booking_status_stats.length > 0 ? (
              <div className="status-list">
                {analytics.booking_status_stats.map((stat, index) => (
                  <div key={index} className="status-item">
                    <div className="status-label">
                      {stat.status === 'confirmed' && '✅ Đã xác nhận'}
                      {stat.status === 'cancelled' && '❌ Đã hủy'}
                      {stat.status === 'completed' && '✔️ Hoàn thành'}
                    </div>
                    <div className="status-count">
                      <strong>{stat.count}</strong> vé
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
