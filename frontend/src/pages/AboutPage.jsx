import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';
import '../styles/about.css';

const AboutPage = () => {
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
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="container">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🎫</span>
            <span className="logo-text">VeXeOnline</span>
          </div>
          <nav className="main-nav">
            <Link to="/" className="nav-link">🏠 Trang chủ</Link>
            <Link to="/about" className="nav-link active">ℹ️ Giới thiệu</Link>
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
      <section className="about-hero">
        <div className="container">
          <h1>Về Chúng Tôi</h1>
          <p>Nền tảng đặt vé xe khách trực tuyến hàng đầu Việt Nam</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-content">
        <div className="container">
          {/* Company Overview */}
          <div className="content-section">
            <h2 className="section-title">🚌 VeXeOnline - Đồng hành cùng mọi hành trình</h2>
            <div className="section-body">
              <p>
                <strong>VeXeOnline</strong> là nền tảng đặt vé xe khách trực tuyến hàng đầu tại Việt Nam, 
                được thành lập với sứ mệnh mang đến trải nghiệm đặt vé hiện đại, tiện lợi và an toàn cho 
                hàng triệu hành khách trên toàn quốc.
              </p>
              <p>
                Chúng tôi kết nối hành khách với hơn <strong>100+ nhà xe uy tín</strong>, cung cấp 
                <strong> 500+ tuyến đường</strong> và <strong>10,000+ chuyến xe mỗi ngày</strong>, 
                phủ sóng khắp 63 tỉnh thành Việt Nam.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="content-section mission-vision">
            <div className="mission-box">
              <div className="box-icon">🎯</div>
              <h3>Sứ Mệnh</h3>
              <p>
                Số hóa ngành vận tải hành khách, mang đến trải nghiệm đặt vé hiện đại, 
                thuận tiện và an toàn cho mọi người dân Việt Nam. Kết nối hành khách với 
                các nhà xe uy tín, tạo ra hệ sinh thái vận tải bền vững và phát triển.
              </p>
            </div>
            <div className="vision-box">
              <div className="box-icon">🌟</div>
              <h3>Tầm Nhìn</h3>
              <p>
                Trở thành nền tảng đặt vé xe khách số 1 Việt Nam, tiên phong trong việc 
                ứng dụng công nghệ vào ngành vận tải, đồng thời mở rộng sang các dịch vụ 
                du lịch và logistics, phục vụ 10 triệu khách hàng vào năm 2030.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="content-section">
            <h2 className="section-title">💎 Giá Trị Cốt Lõi</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h4>Tin Cậy</h4>
                <p>Cam kết minh bạch về giá cả, chất lượng dịch vụ và thông tin chuyến xe</p>
              </div>
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h4>Nhanh Chóng</h4>
                <p>Đặt vé chỉ trong 2 phút với giao diện thân thiện và quy trình tối ưu</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔒</div>
                <h4>An Toàn</h4>
                <p>Bảo mật thông tin tuyệt đối với chuẩn mã hóa quốc tế PCI DSS</p>
              </div>
              <div className="value-card">
                <div className="value-icon">❤️</div>
                <h4>Tận Tâm</h4>
                <p>Đội ngũ hỗ trợ 24/7, luôn lắng nghe và giải quyết mọi thắc mắc của khách hàng</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h4>Đổi Mới</h4>
                <p>Không ngừng cải tiến công nghệ để mang đến trải nghiệm tốt nhất</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h4>Phát Triển Bền Vững</h4>
                <p>Hỗ trợ nhà xe chuyển đổi số và phát triển kinh doanh hiệu quả</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="content-section achievements">
            <h2 className="section-title">🏆 Thành Tựu Nổi Bật</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Vé đã đặt thành công</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100+</div>
                <div className="stat-label">Nhà xe đối tác</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Tuyến đường</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.8/5</div>
                <div className="stat-label">Đánh giá từ khách hàng</div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="content-section">
            <h2 className="section-title">✨ Tại Sao Chọn VeXeOnline?</h2>
            <div className="reasons-list">
              <div className="reason-item">
                <span className="reason-number">01</span>
                <div className="reason-content">
                  <h4>Đặt vé dễ dàng mọi lúc mọi nơi</h4>
                  <p>Giao diện thân thiện, hỗ trợ đa nền tảng (web, mobile). Tìm kiếm thông minh, so sánh giá nhanh chóng.</p>
                </div>
              </div>
              <div className="reason-item">
                <span className="reason-number">02</span>
                <div className="reason-content">
                  <h4>Thanh toán an toàn, linh hoạt</h4>
                  <p>Tích hợp cổng thanh toán VNPay uy tín. Hỗ trợ đa dạng phương thức: thẻ ATM, Visa, MasterCard, QR Code.</p>
                </div>
              </div>
              <div className="reason-item">
                <span className="reason-number">03</span>
                <div className="reason-content">
                  <h4>Vé điện tử hiện đại</h4>
                  <p>Vé có mã QR độc quyền, gửi ngay qua email và SMS. Không cần in vé giấy, check-in nhanh chóng tại bến.</p>
                </div>
              </div>
              <div className="reason-item">
                <span className="reason-number">04</span>
                <div className="reason-content">
                  <h4>Hỗ trợ khách hàng tận tình</h4>
                  <p>Đội ngũ CSKH chuyên nghiệp, nhiệt tình, làm việc 24/7. Hotline: 1900 1234 • Email: support@vexeonline.vn</p>
                </div>
              </div>
              <div className="reason-item">
                <span className="reason-number">05</span>
                <div className="reason-content">
                  <h4>Chính sách đổi trả linh hoạt</h4>
                  <p>Hỗ trợ đổi, hủy vé theo quy định nhà xe. Hoàn tiền nhanh chóng trong 3-5 ngày làm việc.</p>
                </div>
              </div>
              <div className="reason-item">
                <span className="reason-number">06</span>
                <div className="reason-content">
                  <h4>Ưu đãi và khuyến mãi hấp dẫn</h4>
                  <p>Chương trình tích điểm thành viên, voucher giảm giá định kỳ. Giá vé luôn cạnh tranh nhất thị trường.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Partners */}
          <div className="content-section partners">
            <h2 className="section-title">🤝 Đối Tác Của Chúng Tôi</h2>
            <p className="partners-intro">
              VeXeOnline tự hào hợp tác với các nhà xe uy tín hàng đầu Việt Nam:
            </p>
            <div className="partners-list">
              <div className="partner-tag">Phương Trang</div>
              <div className="partner-tag">Thành Bưởi</div>
              <div className="partner-tag">Mai Linh</div>
              <div className="partner-tag">Hoàng Long</div>
              <div className="partner-tag">Hải Vân</div>
              <div className="partner-tag">Kumho Samco</div>
              <div className="partner-tag">Hà Lan</div>
              <div className="partner-tag">Sao Việt</div>
              <div className="partner-tag">Thanh Hương</div>
              <div className="partner-tag">Đức Hoàng</div>
              <div className="partner-tag">Hưng Thành</div>
              <div className="partner-tag">Minh Quốc</div>
              <div className="partner-tag">và 90+ nhà xe khác</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="content-section cta-section">
            <div className="cta-box">
              <h3>Bắt đầu hành trình của bạn với VeXeOnline</h3>
              <p>Đặt vé ngay hôm nay để trải nghiệm dịch vụ chuyên nghiệp!</p>
              <div className="cta-buttons">
                <Link to="/search" className="btn btn-primary">Tìm chuyến xe</Link>
                <Link to="/contact" className="btn btn-outline">Liên hệ với chúng tôi</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <p>© 2025 VeXeOnline. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
