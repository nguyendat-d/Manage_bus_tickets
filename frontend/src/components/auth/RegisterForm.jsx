import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';
import '../../styles/auth.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'passenger',
    // For bus company
    company_name: '',
    address: '',
    tax_code: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!hasUpperCase) {
      return 'Mật khẩu phải có ít nhất 1 chữ in hoa';
    }
    if (!hasLowerCase) {
      return 'Mật khẩu phải có ít nhất 1 chữ in thường';
    }
    if (!hasNumber) {
      return 'Mật khẩu phải có ít nhất 1 số';
    }
    if (!hasSpecialChar) {
      return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    const error = validatePassword(newPassword);
    setPasswordError(error);
  };

  const validateForm = () => {
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) {
      setError(passwordValidation);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Số điện thoại phải có 10 chữ số');
      return false;
    }
    if (formData.role === 'bus_company') {
      if (!formData.company_name || !formData.address) {
        setError('Vui lòng điền đầy đủ thông tin nhà xe');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      
      if (response.success) {
        // Kiểm tra nếu là nhà xe cần phê duyệt
        if (response.data?.requiresApproval) {
          success('Đăng ký thành công! Tài khoản nhà xe của bạn đang chờ Admin phê duyệt. Bạn sẽ nhận được email thông báo khi tài khoản được kích hoạt.');
          setTimeout(() => navigate('/login'), 4000);
        } else {
          success('Đăng ký thành công! Vui lòng đăng nhập.');
          setTimeout(() => navigate('/login'), 1500);
        }
      } else {
        const errorMsg = response.message || 'Đăng ký thất bại';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng Ký</h2>
          <p>Tạo tài khoản mới để bắt đầu</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="full_name">Họ và tên</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
              disabled={loading}
            />
          </div>

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
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Loại tài khoản</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="passenger">Hành khách</option>
              <option value="bus_company">Nhà xe</option>
            </select>
          </div>

          {/* Bus Company Fields */}
          {formData.role === 'bus_company' && (
            <>
              <div className="alert alert-info" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '4px', color: '#0d47a1' }}>
                ℹ️ <strong>Lưu ý:</strong> Tài khoản nhà xe cần được Admin phê duyệt trước khi có thể sử dụng đầy đủ chức năng.
              </div>
              
              <div className="form-group">
                <label htmlFor="company_name">Tên nhà xe *</label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Công ty TNHH Vận tải ABC"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ trụ sở *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tax_code">Mã số thuế</label>
                <input
                  type="text"
                  id="tax_code"
                  name="tax_code"
                  value={formData.tax_code}
                  onChange={handleChange}
                  placeholder="0123456789"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
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
            <small style={{ 
              color: passwordError ? '#e74c3c' : '#7f8c8d', 
              display: 'block', 
              marginTop: '5px', 
              fontSize: '12px' 
            }}>
              {passwordError || '⚠️ Mật khẩu phải có ít nhất 6 ký tự, bao gồm: chữ in hoa, chữ in thường, số và ký tự đặc biệt'}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>

          <div className="auth-switch">
            <p>
              Đã có tài khoản? {' '}
              <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
