import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';
import '../styles/home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
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

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">🎫</span>
            <span className="logo-text">VeXeOnline</span>
          </div>
          <nav className="main-nav">
            <Link to="/search" className="nav-link">🔍 Tìm chuyến xe</Link>
            <Link to="/about" className="nav-link">ℹ️ Giới thiệu</Link>
            <Link to="/contact" className="nav-link">📞 Liên hệ</Link>
            
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
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Đặt vé xe khách <br />
              <span className="highlight">Nhanh chóng & Tiện lợi</span>
            </h1>
            <p className="hero-description">
              Hệ thống đặt vé xe trực tuyến hàng đầu Việt Nam. 
              Kết nối hành khách với hơn 100+ nhà xe uy tín trên toàn quốc.
            </p>
            <div className="hero-buttons">
              <Link to="/search" className="btn btn-primary btn-large">
                🔍 Tìm chuyến xe ngay
              </Link>
              <Link to="/register" className="btn btn-outline btn-large">
                🚌 Đăng ký nhà xe
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="bus-illustration">🚌</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Đặt vé nhanh chóng</h3>
              <p>Chỉ với 3 bước đơn giản: Tìm kiếm → Chọn chỗ → Thanh toán</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Giá cả minh bạch</h3>
              <p>Không phụ thu, không phí ẩn. Giá vé rõ ràng, thanh toán an toàn</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Vé điện tử</h3>
              <p>Vé có mã QR, dễ dàng check-in tại bến xe mà không cần in</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Bảo mật tuyệt đối</h3>
              <p>Thông tin cá nhân và thanh toán được mã hóa an toàn</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Hỗ trợ 24/7</h3>
              <p>Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚌</div>
              <h3>Nhiều nhà xe</h3>
              <p>Hợp tác với hơn 100+ nhà xe uy tín khắp cả nước</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Cách đặt vé</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">🔍</div>
              <h3>Tìm chuyến xe</h3>
              <p>Nhập điểm đi, điểm đến và ngày khởi hành</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">🪑</div>
              <h3>Chọn chỗ ngồi</h3>
              <p>Xem sơ đồ ghế và chọn vị trí yêu thích</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">💳</div>
              <h3>Thanh toán</h3>
              <p>Thanh toán online qua VNPay nhanh chóng</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">🎫</div>
              <h3>Nhận vé</h3>
              <p>Nhận vé điện tử qua email và SMS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="popular-routes">
        <div className="container">
          <h2 className="section-title">Tuyến đường phổ biến</h2>
          <div className="routes-grid">
            <div className="route-card">
              <h3>TP.HCM → Đà Lạt</h3>
              <p className="route-info">~300km • 6 giờ</p>
              <p className="route-price">Từ 250.000đ</p>
              <Link to="/search?from=HCM&to=DaLat" className="btn btn-sm">Đặt vé</Link>
            </div>
            <div className="route-card">
              <h3>TP.HCM → Cần Thơ</h3>
              <p className="route-info">~170km • 3.5 giờ</p>
              <p className="route-price">Từ 120.000đ</p>
              <Link to="/search?from=HCM&to=CanTho" className="btn btn-sm">Đặt vé</Link>
            </div>
            <div className="route-card">
              <h3>Hà Nội → Hải Phòng</h3>
              <p className="route-info">~120km • 2.5 giờ</p>
              <p className="route-price">Từ 100.000đ</p>
              <Link to="/search?from=HaNoi&to=HaiPhong" className="btn btn-sm">Đặt vé</Link>
            </div>
            <div className="route-card">
              <h3>TP.HCM → Nha Trang</h3>
              <p className="route-info">~450km • 8 giờ</p>
              <p className="route-price">Từ 300.000đ</p>
              <Link to="/search?from=HCM&to=NhaTrang" className="btn btn-sm">Đặt vé</Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Bus Companies */}
      <section className="for-companies">
        <div className="container">
          <div className="company-content">
            <div className="company-text">
              <h2>Dành cho nhà xe</h2>
              <p>
                Tham gia nền tảng của chúng tôi để mở rộng kinh doanh và 
                tiếp cận hàng triệu khách hàng tiềm năng.
              </p>
              <ul className="company-benefits">
                <li>✅ Quản lý chuyến xe dễ dàng</li>
                <li>✅ Hệ thống đặt vé tự động</li>
                <li>✅ Báo cáo doanh thu chi tiết</li>
                <li>✅ Hỗ trợ marketing miễn phí</li>
              </ul>
              <Link to="/register?type=company" className="btn btn-primary btn-large">
                Đăng ký nhà xe ngay
              </Link>
            </div>
            <div className="company-image">
              <div className="company-illustration">🚌💼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>VeXeOnline</h4>
              <p>Nền tảng đặt vé xe khách trực tuyến hàng đầu Việt Nam</p>
            </div>
            <div className="footer-section">
              <h4>Liên kết</h4>
              <Link to="/search">Tìm chuyến xe</Link>
              <Link to="/about">Giới thiệu</Link>
              <Link to="/contact">Liên hệ</Link>
              <Link to="/terms">Điều khoản</Link>
            </div>
            <div className="footer-section">
              <h4>Hỗ trợ</h4>
              <p>📞 Hotline: 1900 1234</p>
              <p>📧 Email: support@vexeonline.vn</p>
              <p>🕐 24/7 Support</p>
            </div>
            <div className="footer-section">
              <h4>Kết nối với chúng tôi</h4>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Zalo</a>
                <a href="#" className="social-link">Instagram</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 VeXeOnline. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
