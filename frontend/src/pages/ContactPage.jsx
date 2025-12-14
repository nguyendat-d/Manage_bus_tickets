import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNotification } from '../contexts/NotificationContext';
import '../styles/contact.css';

const ContactPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.full_name || '',
        email: currentUser.email || ''
      }));
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setShowAccountMenu(false);
  };

  const handleGoToDashboard = () => {
    if (user?.role === 'passenger') {
      navigate('/passenger/dashboard');
    } else if (user?.role === 'bus_company') {
      navigate('/bus-company/dashboard');
    }
  };

  const handleGoToProfile = () => {
    if (user?.role === 'passenger') {
      navigate('/passenger/profile');
    } else if (user?.role === 'bus_company') {
      navigate('/bus-company/profile');
    }
    setShowAccountMenu(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      showError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    
    // Simulate sending (trong thực tế sẽ gọi API)
    setTimeout(() => {
      success('Gửi thành công! Chúng tôi sẽ phản hồi trong 24h.');
      setFormData({
        name: user?.full_name || '',
        email: user?.email || '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="contact-header">
        <div className="container">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🎫</span>
            <span className="logo-text">VeXeOnline</span>
          </div>
          <nav className="main-nav">
            <Link to="/" className="nav-link">🏠 Trang chủ</Link>
            <Link to="/about" className="nav-link">ℹ️ Giới thiệu</Link>
            <Link to="/contact" className="nav-link active">📞 Liên hệ</Link>
            
            {user && user.role !== 'admin' ? (
              <div className="account-menu">
                <button 
                  className="account-btn" 
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  👤 {user.full_name}
                  <span className="dropdown-arrow">{showAccountMenu ? '▲' : '▼'}</span>
                </button>
                {showAccountMenu && (
                  <div className="account-dropdown">
                    <button onClick={handleGoToDashboard} className="dropdown-item">
                      🏠 Trang chủ của tôi
                    </button>
                    <button onClick={handleGoToProfile} className="dropdown-item">
                      👤 Tài khoản
                    </button>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link btn-login">Đăng nhập</Link>
                <Link to="/register" className="nav-link btn-register">Đăng ký</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Liên Hệ Với Chúng Tôi</h1>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Thông Tin Liên Hệ</h2>
              <p className="contact-intro">
                Đội ngũ VeXeOnline luôn sẵn sàng lắng nghe và hỗ trợ bạn. 
                Hãy liên hệ với chúng tôi qua các kênh dưới đây:
              </p>

              <div className="info-section">
                <h3>🏢 Trụ Sở Chính</h3>
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div className="info-text">
                    <strong>Địa chỉ:</strong><br />
                    Tầng 12, Tòa nhà VTC Online<br />
                    18 Tam Trinh, Hai Bà Trưng<br />
                    Hà Nội, Việt Nam
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>📞 Hotline & Email</h3>
                <div className="info-item">
                  <span className="info-icon">☎️</span>
                  <div className="info-text">
                    <strong>Hotline:</strong> <a href="tel:19001234">1900 1234</a><br />
                    <small>(Miễn phí từ 8:00 - 22:00 hàng ngày)</small>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📱</span>
                  <div className="info-text">
                    <strong>Di động:</strong> <a href="tel:0901234567">090 123 4567</a><br />
                    <small>(Hỗ trợ khẩn cấp 24/7)</small>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">✉️</span>
                  <div className="info-text">
                    <strong>Email:</strong><br />
                    Hỗ trợ: <a href="mailto:support@vexeonline.vn">support@vexeonline.vn</a><br />
                    Hợp tác: <a href="mailto:partnership@vexeonline.vn">partnership@vexeonline.vn</a><br />
                    Khiếu nại: <a href="mailto:complaint@vexeonline.vn">complaint@vexeonline.vn</a>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>💼 Dành Cho Nhà Xe</h3>
                <div className="info-item">
                  <span className="info-icon">🚌</span>
                  <div className="info-text">
                    <strong>Phòng Quan Hệ Đối Tác</strong><br />
                    Hotline: <a href="tel:19001235">1900 1235</a><br />
                    Email: <a href="mailto:business@vexeonline.vn">business@vexeonline.vn</a>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>🕐 Giờ Làm Việc</h3>
                <div className="info-item">
                  <span className="info-icon">⏰</span>
                  <div className="info-text">
                    <strong>Văn phòng:</strong> 8:00 - 18:00 (Thứ 2 - Thứ 6)<br />
                    <strong>Hotline:</strong> 24/7 (Cả tuần)<br />
                    <strong>Chat online:</strong> 8:00 - 22:00 (Hàng ngày)
                  </div>
                </div>
              </div>

              <div className="info-section social">
                <h3>🌐 Kết Nối Với Chúng Tôi</h3>
                <div className="social-links">
                  <a href="https://www.facebook.com/nguyen.at.907346/" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                    📘 Facebook
                  </a>
                  <a href="https://zalo.me/vexeonline" target="_blank" rel="noopener noreferrer" className="social-btn zalo">
                    💬 Zalo
                  </a>
                  <a href="https://instagram.com/vexeonline" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                    📷 Instagram
                  </a>
                  <a href="https://youtube.com/vexeonline" target="_blank" rel="noopener noreferrer" className="social-btn youtube">
                    📺 YouTube
                  </a>
                </div>
              </div>

              <div className="info-section emergency">
                <div className="emergency-box">
                  <h4>🚨 Hỗ Trợ Khẩn Cấp</h4>
                  <p>
                    Nếu bạn gặp vấn đề khẩn cấp trong chuyến đi 
                    (xe chậm, hỏng, sự cố...), vui lòng gọi ngay:
                  </p>
                  <a href="tel:0901234567" className="emergency-number">090 123 4567</a>
                  <small>Hỗ trợ 24/7 - Phản hồi trong 5 phút</small>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-card">
                <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
                <p className="form-description">
                  Có câu hỏi, góp ý hoặc cần hỗ trợ? Điền form bên dưới 
                  và chúng tôi sẽ phản hồi trong vòng 24 giờ.
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        Họ và tên <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">
                        Số điện thoại <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0901234567"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      Chủ đề <span className="required">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn chủ đề --</option>
                      <option value="support">Hỗ trợ đặt vé</option>
                      <option value="payment">Vấn đề thanh toán</option>
                      <option value="refund">Hoàn tiền / Đổi vé</option>
                      <option value="complaint">Khiếu nại</option>
                      <option value="partnership">Hợp tác kinh doanh</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      Nội dung <span className="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang gửi...' : '📤 Gửi tin nhắn'}
                  </button>

                  <p className="form-note">
                    <small>
                      Bằng việc gửi form này, bạn đồng ý với 
                      <Link to="/terms"> Điều khoản sử dụng </Link>
                      và 
                      <Link to="/privacy"> Chính sách bảo mật </Link>
                      của chúng tôi.
                    </small>
                  </p>
                </form>
              </div>

              {/* FAQ Quick Links */}
              <div className="faq-box">
                <h3>❓ Câu Hỏi Thường Gặp</h3>
                <ul className="faq-links">
                  <li><a href="/faq#booking">Làm thế nào để đặt vé?</a></li>
                  <li><a href="/faq#payment">Có những hình thức thanh toán nào?</a></li>
                  <li><a href="/faq#cancel">Chính sách hủy vé như thế nào?</a></li>
                  <li><a href="/faq#refund">Bao lâu thì được hoàn tiền?</a></li>
                  <li><a href="/faq#ticket">Vé điện tử sử dụng như thế nào?</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>📍 Vị Trí Văn Phòng</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4967192773157!2d105.85354931476355!3d21.013012793736184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86cece72cd%3A0x617a16b3c0dd51f!2zMTggVGFtIFRyaW5oLCBWxKluaCBUw7lsLCBIYWkgQsOgIFRyxrBuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1639234567890!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="VeXeOnline Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="container">
          <p>© 2025 VeXeOnline. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
