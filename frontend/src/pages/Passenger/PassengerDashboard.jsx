import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import authService from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';
import '../../styles/passenger.css';

const PassengerDashboard = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [allBookings, setAllBookings] = useState([]); // Lưu tất cả bookings cho stats
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null); // Vé được chọn để xem
  const [showTicketModal, setShowTicketModal] = useState(false); // Hiển thị modal
  const user = authService.getCurrentUser();

  useEffect(() => {
    console.log('🚀 PassengerDashboard mounted, loading bookings...');
    console.log('👤 Current user:', user);
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showError('Vui lòng đăng nhập để xem vé');
        navigate('/login');
        return;
      }
      
      // Load tất cả bookings - không truyền status parameter để lấy tất cả
      const response = await api.get('/bookings', {
        params: { limit: 100 } // Tăng limit để lấy nhiều bookings hơn
      });
      
      console.log('📋 Bookings API Response:', response.data);
      
      if (response.data.success) {
        const bookingsList = response.data.data.bookings || [];
        console.log('✅ Loaded bookings:', bookingsList.length, 'bookings');
        setAllBookings(bookingsList);
      } else {
        console.error('❌ API returned success=false');
        showError('Không thể tải danh sách vé');
      }
    } catch (error) {
      console.error('❌ Error loading bookings:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showError(`Không thể tải danh sách vé: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function để format seat numbers
  const formatSeats = (seatNumbers) => {
    try {
      if (!seatNumbers) return 'N/A';
      const seats = typeof seatNumbers === 'string' 
        ? JSON.parse(seatNumbers) 
        : seatNumbers;
      return Array.isArray(seats) ? seats.join(', ') : seats.toString();
    } catch (error) {
      console.error('Error parsing seats:', error);
      return seatNumbers?.toString() || 'N/A';
    }
  };

  // Filter bookings theo tab
  const bookings = useMemo(() => {
    if (!allBookings || allBookings.length === 0) {
      console.log('⚠️ No bookings to filter');
      return [];
    }
    
    console.log(`🔍 Filtering ${allBookings.length} bookings for tab: ${activeTab}`);
    
    if (activeTab === 'upcoming') {
      const filtered = allBookings.filter(b => b.booking_status === 'confirmed');
      console.log(`✅ Found ${filtered.length} upcoming bookings`);
      return filtered;
    } else if (activeTab === 'completed') {
      const filtered = allBookings.filter(b => b.booking_status === 'completed');
      console.log(`✅ Found ${filtered.length} completed bookings`);
      return filtered;
    } else if (activeTab === 'cancelled') {
      const filtered = allBookings.filter(b => b.booking_status === 'cancelled');
      console.log(`✅ Found ${filtered.length} cancelled bookings`);
      return filtered;
    }
    
    console.log(`✅ Showing all ${allBookings.length} bookings`);
    return allBookings; // 'all' tab
  }, [allBookings, activeTab]);

  const handleCancelBooking = async (bookingId, bookingCode) => {
    // Tạo modal xác nhận đẹp hơn
    const confirmMessage = `Bạn có chắc muốn hủy vé ${bookingCode}?\n\n⚠️ Lưu ý:\n- Chỉ được hủy vé trước 2 giờ khởi hành\n- Số tiền sẽ được hoàn lại trong 3-5 ngày làm việc`;
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await api.put(
        `/bookings/${bookingId}/cancel`,
        { cancellation_reason: 'Khách hàng yêu cầu hủy' }
      );

      if (response.data.success) {
        success('✅ Hủy vé thành công! Số tiền sẽ được hoàn lại trong 3-5 ngày làm việc.');
        loadBookings(); // Reload danh sách booking
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi hủy vé';
      showError(`❌ ${errorMsg}`);
    }
  };

  const handleCompleteBooking = async (bookingId, bookingCode) => {
    const confirmMessage = `Xác nhận hoàn thành chuyến đi ${bookingCode}?\n\n✅ Điều này cho biết bạn đã hoàn thành chuyến đi này.`;
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await api.put(
        `/bookings/${bookingId}/complete`,
        {}
      );

      if (response.data.success) {
        success('✅ Đã đánh dấu hoàn thành chuyến đi!');
        loadBookings(); // Reload danh sách booking
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra';
      showError(`❌ ${errorMsg}`);
    }
  };

  // Kiểm tra xem chuyến đi đã khởi hành chưa
  const isDeparted = (departureTime) => {
    return new Date(departureTime) < new Date();
  };

  // Xem chi tiết vé
  const handleViewTicket = async (booking) => {
    try {
      setSelectedBooking(booking);
      setShowTicketModal(true);
    } catch (error) {
      console.error('Error viewing ticket:', error);
      showError('Không thể xem vé');
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowTicketModal(false);
    setSelectedBooking(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Chờ thanh toán' },
      confirmed: { class: 'badge-success', text: 'Đã xác nhận' },
      cancelled: { class: 'badge-danger', text: 'Đã hủy' },
      completed: { class: 'badge-info', text: 'Hoàn thành' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="passenger-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-left">
            <h1>🎫 VeXeOnline</h1>
          </div>
          <nav className="header-nav">
            <button onClick={() => navigate('/')} className="nav-btn">
              🏠 Trang chủ
            </button>
            <button onClick={() => navigate('/search')} className="nav-btn">
              🔍 Tìm chuyến xe
            </button>
            <button onClick={() => navigate('/passenger/bookings')} className="nav-btn active">
              📋 Vé của tôi
            </button>
            <button onClick={() => navigate('/passenger/profile')} className="nav-btn">
              👤 Tài khoản
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="container">
          {/* Welcome Card */}
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>Xin chào, {user?.full_name}! 👋</h2>
              <p>Chúc bạn có chuyến đi vui vẻ!</p>
            </div>
            <button onClick={() => navigate('/search')} className="btn btn-primary">
              🔍 Đặt vé mới
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <div className="stat-value">{allBookings.length}</div>
                <div className="stat-label">Tổng vé</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🎫</div>
              <div className="stat-info">
                <div className="stat-value">{allBookings.filter(b => b.booking_status === 'confirmed').length}</div>
                <div className="stat-label">Vé sắp đi</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-value">{allBookings.filter(b => b.booking_status === 'completed').length}</div>
                <div className="stat-label">Đã hoàn thành</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <div className="stat-value">{allBookings.filter(b => b.booking_status === 'pending').length}</div>
                <div className="stat-label">Chờ thanh toán</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">❌</div>
              <div className="stat-info">
                <div className="stat-value">{allBookings.filter(b => b.booking_status === 'cancelled').length}</div>
                <div className="stat-label">Đã hủy</div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bookings-section">
            <div className="section-header">
              <h3>Danh sách vé</h3>
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Tất cả ({allBookings.length})
                </button>
                <button
                  className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Sắp đi ({allBookings.filter(b => b.booking_status === 'confirmed').length})
                </button>
                <button
                  className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Đã hoàn thành ({allBookings.filter(b => b.booking_status === 'completed').length})
                </button>
                <button
                  className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cancelled')}
                >
                  Đã hủy ({allBookings.filter(b => b.booking_status === 'cancelled').length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎫</div>
                <h3>Chưa có vé nào</h3>
                <p>Hãy đặt vé cho chuyến đi của bạn!</p>
                <button onClick={() => navigate('/search')} className="btn btn-primary">
                  Tìm chuyến xe
                </button>
              </div>
            ) : (
              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <span className="booking-code">#{booking.booking_code}</span>
                      {getStatusBadge(booking.booking_status)}
                    </div>
                    
                    <div className="booking-route">
                      <div className="route-point">
                        <div className="route-city">{booking.departure_city}</div>
                        <div className="route-time">
                          {new Date(booking.departure_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="route-arrow">→</div>
                      <div className="route-point">
                        <div className="route-city">{booking.arrival_city}</div>
                        <div className="route-time">
                          {new Date(booking.arrival_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="detail-label">🚌 Nhà xe:</span>
                        <span className="detail-value">{booking.company_name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📅 Ngày đi:</span>
                        <span className="detail-value">
                          {new Date(booking.departure_time).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🪑 Ghế:</span>
                        <span className="detail-value">{formatSeats(booking.seat_numbers)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">💰 Giá:</span>
                        <span className="detail-value price">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_amount)}
                        </span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      {booking.booking_status === 'confirmed' && (
                        <>
                          <button 
                            onClick={() => handleViewTicket(booking)}
                            className="btn btn-outline btn-sm"
                          >
                            📱 Xem vé
                          </button>
                          {isDeparted(booking.departure_time) ? (
                            <button
                              onClick={() => handleCompleteBooking(booking.id, booking.booking_code)}
                              className="btn btn-primary btn-sm"
                              title="Đánh dấu đã hoàn thành chuyến đi"
                            >
                              ✅ Hoàn thành
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCancelBooking(booking.id, booking.booking_code)}
                              className="btn btn-danger btn-sm"
                              title="Hủy vé (chỉ được hủy trước 2 giờ khởi hành)"
                            >
                              ❌ Hủy vé
                            </button>
                          )}
                        </>
                      )}
                      {booking.booking_status === 'pending' && (
                        <>
                          <button 
                            onClick={() => navigate(`/passenger/payment/${booking.id}`)}
                            className="btn btn-primary btn-sm"
                          >
                            💳 Thanh toán
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id, booking.booking_code)}
                            className="btn btn-outline-danger btn-sm"
                            title="Hủy vé"
                          >
                            ❌ Hủy
                          </button>
                        </>
                      )}
                      {booking.booking_status === 'cancelled' && (
                        <>
                          <button 
                            onClick={() => handleViewTicket(booking)}
                            className="btn btn-outline btn-sm"
                          >
                            📱 Xem vé
                          </button>
                          <div className="cancelled-note">
                            <span>🚫 Đã hủy</span>
                            {booking.cancellation_reason && (
                              <small className="cancel-reason">Lý do: {booking.cancellation_reason}</small>
                            )}
                          </div>
                        </>
                      )}
                      {booking.booking_status === 'completed' && (
                        <>
                          <button 
                            onClick={() => handleViewTicket(booking)}
                            className="btn btn-outline btn-sm"
                          >
                            📱 Xem vé
                          </button>
                          <div className="completed-note">
                            <span>✅ Đã hoàn thành</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal xem chi tiết vé */}
      {showTicketModal && selectedBooking && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎫 Thông tin vé xe</h2>
              <button className="btn-close" onClick={handleCloseModal}>✕</button>
            </div>

            <div className="modal-body">
              {/* Mã vé và QR */}
              <div className="ticket-code-section">
                <div className="ticket-code-box">
                  <span className="code-label">Mã vé:</span>
                  <span className="code-value">#{selectedBooking.booking_code}</span>
                </div>
                {selectedBooking.qr_code_url && (
                  <div className="qr-code-box">
                    <img src={selectedBooking.qr_code_url} alt="QR Code" />
                    <p className="qr-note">Quét mã QR khi lên xe</p>
                  </div>
                )}
              </div>

              {/* Thông tin hành trình */}
              <div className="ticket-section">
                <h3>🚌 Thông tin hành trình</h3>
                <div className="ticket-route">
                  <div className="route-detail">
                    <div className="route-label">Điểm đi</div>
                    <div className="route-location">{selectedBooking.departure_city}</div>
                    <div className="route-station">{selectedBooking.departure_station}</div>
                    <div className="route-datetime">
                      {new Date(selectedBooking.departure_time).toLocaleString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="route-arrow">→</div>
                  
                  <div className="route-detail">
                    <div className="route-label">Điểm đến</div>
                    <div className="route-location">{selectedBooking.arrival_city}</div>
                    <div className="route-station">{selectedBooking.arrival_station}</div>
                    <div className="route-datetime">
                      {new Date(selectedBooking.arrival_time).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin nhà xe và ghế */}
              <div className="ticket-section">
                <h3>📋 Chi tiết vé</h3>
                <div className="ticket-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">🏢 Nhà xe:</span>
                    <span className="detail-value">{selectedBooking.company_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🪑 Số ghế:</span>
                    <span className="detail-value seats">{formatSeats(selectedBooking.seat_numbers)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">💰 Tổng tiền:</span>
                    <span className="detail-value price">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.total_amount)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📊 Trạng thái:</span>
                    {getStatusBadge(selectedBooking.booking_status)}
                  </div>
                </div>
              </div>

              {/* Thông tin thanh toán */}
              {selectedBooking.payment_status && (
                <div className="ticket-section">
                  <h3>💳 Thông tin thanh toán</h3>
                  <div className="ticket-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Trạng thái thanh toán:</span>
                      <span className={`payment-status ${selectedBooking.payment_status}`}>
                        {selectedBooking.payment_status === 'paid' ? '✅ Đã thanh toán' : 
                         selectedBooking.payment_status === 'pending' ? '⏳ Chờ thanh toán' : 
                         selectedBooking.payment_status === 'refunded' ? '💸 Đã hoàn tiền' : 
                         selectedBooking.payment_status}
                      </span>
                    </div>
                    {selectedBooking.payment_method && (
                      <div className="detail-item">
                        <span className="detail-label">Phương thức:</span>
                        <span className="detail-value">{selectedBooking.payment_method}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lưu ý quan trọng */}
              <div className="ticket-section notice-section">
                <h3>⚠️ Lưu ý quan trọng</h3>
                <ul className="notice-list">
                  <li>✓ Vui lòng có mặt tại bến xe trước 15 phút</li>
                  <li>✓ Mang theo CMND/CCCD để đối chiếu thông tin</li>
                  <li>✓ Xuất trình mã QR hoặc mã vé khi lên xe</li>
                  <li>✓ Chỉ được hủy vé trước 2 giờ khởi hành</li>
                  <li>✓ Liên hệ nhà xe nếu cần hỗ trợ</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => window.print()}>
                🖨️ In vé
              </button>
              <button className="btn btn-outline" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
