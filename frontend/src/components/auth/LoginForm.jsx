import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';
import '../../styles/auth.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCodeInput, setShowAdminCodeInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        const user = response.data.user;
        
        // Nếu là admin, yêu cầu nhập mã xác thực
        if (user.role === 'admin') {
          if (!showAdminCodeInput) {
            setShowAdminCodeInput(true);
            setLoading(false);
            return;
          }
          
          // Kiểm tra mã admin
          if (adminCode !== '246123') {
            setError('Mã xác thực không chính xác!');
            showError('Mã xác thực không chính xác!');
            setLoading(false);
            return;
          }
        }
        
        success(`Chào mừng ${user.full_name}!`);
        
        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (user.role === 'bus_company') {
            navigate('/bus-company/dashboard');
          } else {
            navigate('/passenger/dashboard');
          }
        }, 500);
      } else {
        setError(response.message || 'Đăng nhập thất bại');
        showError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      const errorMsg = err.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🎫</span>
          <span className="logo-text">VeXeOnline</span>
        </div>
        <div className="auth-header">
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#666',
                  padding: '0 5px'
                }}
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {showAdminCodeInput && (
            <div className="form-group">
              <label htmlFor="adminCode">Mã xác thực Admin (6 số)</label>
              <input
                type="text"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Nhập mã 6 số"
                maxLength={6}
                required
                disabled={loading}
                className="admin-code-input"
              />
              <small style={{color: '#999', fontSize: '12px'}}>Vui lòng nhập mã xác thực 6 số để truy cập tài khoản Admin</small>
            </div>
          )}

          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-link">
              Quên mật khẩu?
            </Link>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>

          <div className="auth-switch">
            <p>
              Chưa có tài khoản? {' '}
              <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
