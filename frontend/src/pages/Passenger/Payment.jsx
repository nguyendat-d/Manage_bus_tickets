import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import authService from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';
import '../../styles/payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: showError, warning } = useNotification();
  
  const [booking, setBooking] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: ''
  });

  useEffect(() => {
    // Kiểm tra user đã login chưa
    const user = authService.getCurrentUser();
    if (!user) {
      warning('Vui lòng đăng nhập để thanh toán!');
      navigate('/login');
      return;
    }

    // Lấy thông tin từ state hoặc bookingId
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setCustomerInfo({
        fullName: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        note: ''
      });
      loadTripDetails(location.state.booking.trip_id);
      setLoading(false);
    } else if (location.state?.bookingId) {
      loadBookingDetail(location.state.bookingId);
    } else {
      warning('Không tìm thấy thông tin đặt vé!');
      navigate('/search');
    }
  }, [location.state]);

  const loadBookingDetail = async (bookingId) => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${bookingId}`);
      const bookingData = response.data.data || response.data;
      setBooking(bookingData);
      
      // Load thông tin chuyến xe
      if (bookingData.trip_id) {
        await loadTripDetails(bookingData.trip_id);
      }
      
      // Load thông tin user
      const user = authService.getCurrentUser();
      setCustomerInfo({
        fullName: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        note: ''
      });
    } catch (error) {
      console.error('Error loading booking:', error);
      showError('Không thể tải thông tin đặt vé');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const loadTripDetails = async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}`);
      setTripDetails(response.data.data || response.data);
    } catch (error) {
      console.error('Error loading trip details:', error);
    }
  };

  const handlePayment = async () => {
    // Validate customer info
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.email) {
      warning('Vui lòng điền đầy đủ thông tin khách hàng!');
      return;
    }

    if (!paymentMethod) {
      warning('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await api.post('/payments', {
        booking_id: booking.id,
        payment_method: paymentMethod,
        amount: booking.total_amount,
        customer_info: customerInfo
      });

      success('Đã tạo yêu cầu thanh toán thành công!');
      setTimeout(() => navigate('/passenger/dashboard'), 2000);
    } catch (error) {
      console.error('Error processing payment:', error);
      showError(error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <div className="container">
          <button className="btn-back" onClick={handleGoBack}>
            ← Quay lại
          </button>
          <h1>🎫 Thanh Toán Vé Xe</h1>
        </div>
      </div>

      <div className="payment-container">
        <div className="payment-content">
          {/* Booking Information */}
          <div className="payment-card booking-info-card">
            <h2>📋 Thông Tin Đặt Vé</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Mã đặt vé:</span>
                <span className="info-value booking-code">{booking.booking_code}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tuyến xe:</span>
                <span className="info-value">{booking.departure_city} → {booking.arrival_city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nhà xe:</span>
                <span className="info-value">{booking.company_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Loại xe:</span>
                <span className="info-value">{booking.bus_type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngày khởi hành:</span>
                <span className="info-value">
                  {new Date(booking.departure_time).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Giờ khởi hành:</span>
                <span className="info-value">
                  {new Date(booking.departure_time).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Ghế đã chọn:</span>
                <span className="info-value seats-display">
                  {Array.isArray(booking.seat_numbers) 
                    ? booking.seat_numbers.join(', ') 
                    : booking.seats || 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Số lượng ghế:</span>
                <span className="info-value">
                  {Array.isArray(booking.seat_numbers) 
                    ? booking.seat_numbers.length 
                    : (booking.seats ? booking.seats.split(',').length : 0)} ghế
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="payment-card customer-info-card">
            <h2>👤 Thông Tin Khách Hàng</h2>
            <div className="customer-form">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  value={customerInfo.fullName}
                  onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={customerInfo.note}
                  onChange={(e) => setCustomerInfo({...customerInfo, note: e.target.value})}
                  placeholder="Ghi chú đặc biệt (nếu có)"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="payment-card payment-method-card">
            <h2>💳 Phương Thức Thanh Toán</h2>
            <div className="payment-methods">
              <div 
                className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="payment-option-icon">💵</div>
                <div className="payment-option-content">
                  <h3>Tiền Mặt</h3>
                  <p>Thanh toán trực tiếp khi lên xe</p>
                </div>
                <div className="payment-option-check">
                  {paymentMethod === 'cash' && '✓'}
                </div>
              </div>

              <div 
                className={`payment-option ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <div className="payment-option-icon">🏦</div>
                <div className="payment-option-content">
                  <h3>Chuyển Khoản</h3>
                  <p>Chuyển khoản ngân hàng và đợi xác nhận</p>
                </div>
                <div className="payment-option-check">
                  {paymentMethod === 'bank_transfer' && '✓'}
                </div>
              </div>

              <div 
                className={`payment-option ${paymentMethod === 'vnpay' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('vnpay')}
              >
                <div className="payment-option-icon">💳</div>
                <div className="payment-option-content">
                  <h3>VNPay</h3>
                  <p>Thanh toán qua cổng VNPay (Sắp ra mắt)</p>
                </div>
                <div className="payment-option-check">
                  {paymentMethod === 'vnpay' && '✓'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="payment-card payment-summary-card">
            <h2>💰 Tổng Thanh Toán</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Giá vé ({Array.isArray(booking.seat_numbers) 
                  ? booking.seat_numbers.length 
                  : (booking.seats ? booking.seats.split(',').length : 0)} ghế)</span>
                <span>{booking.total_amount.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="summary-row">
                <span>Phí dịch vụ</span>
                <span>0 ₫</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Tổng cộng</span>
                <span className="total-amount">{booking.total_amount.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <button 
              className="btn-pay"
              onClick={handlePayment}
              disabled={isProcessing || !paymentMethod}
            >
              {isProcessing ? (
                <>
                  <span className="btn-spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                <>💳 Xác Nhận Thanh Toán</>
              )}
            </button>

            <div className="payment-note">
              <p>📝 <strong>Lưu ý:</strong> Vé của bạn sẽ được xác nhận sau khi Admin kiểm tra thanh toán.</p>
              <p>🔔 Bạn có thể theo dõi trạng thái thanh toán trong trang <strong>Quản Lý Vé</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
