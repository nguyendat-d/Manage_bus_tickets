# 📢 Hệ Thống Thông Báo Thân Thiện

## 🎯 Mục đích
Thay thế các thông báo lỗi kỹ thuật (localhost, error codes, stack traces) bằng thông báo thân thiện, dễ hiểu cho người dùng.

## 🚀 Cách sử dụng

### 1. Import các utilities cần thiết

```javascript
import { handleError, handleSuccess } from '../utils/messageHandler';
import { useNotification } from '../contexts/NotificationContext';
```

### 2. Sử dụng trong component

#### Cách cũ (❌ Không nên):
```javascript
try {
  const response = await api.get('/trips');
  setTrips(response.data);
} catch (error) {
  console.error('Error:', error);
  showError(error.response?.data?.message || 'Error occurred');
}
```

#### Cách mới (✅ Nên dùng):
```javascript
try {
  const response = await api.get('/trips');
  setTrips(response.data);
} catch (error) {
  const errorMsg = error.friendlyMessage || handleError(error);
  showError(errorMsg);
}
```

### 3. Sử dụng với API Helper (Advanced)

```javascript
import { handleApiCall } from '../utils/apiHelper';

const handleSubmit = async () => {
  await handleApiCall(
    () => api.post('/bookings', formData),
    setLoading,
    success,
    showError,
    {
      successMessage: 'Đặt vé thành công!',
      onSuccess: (data) => {
        navigate('/payment', { state: { bookingId: data.id } });
      }
    }
  );
};
```

## 📋 Danh sách thông báo được chuyển đổi

### Lỗi Mạng (Network Errors)
| Lỗi kỹ thuật | Thông báo thân thiện |
|-------------|---------------------|
| `Network Error` | "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn." |
| `ECONNREFUSED` | "Không thể kết nối đến máy chủ. Vui lòng thử lại sau." |
| `timeout` | "Yêu cầu quá lâu. Vui lòng thử lại." |

### Lỗi Xác thực (Authentication)
| Lỗi kỹ thuật | Thông báo thân thiện |
|-------------|---------------------|
| `Invalid credentials` | "Email hoặc mật khẩu không đúng." |
| `Unauthorized` | "Bạn không có quyền truy cập. Vui lòng đăng nhập lại." |
| `Token expired` | "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." |

### Lỗi Validation
| Lỗi kỹ thuật | Thông báo thân thiện |
|-------------|---------------------|
| `Email already exists` | "Email này đã được đăng ký." |
| `Phone number already exists` | "Số điện thoại này đã được sử dụng." |
| `Invalid email format` | "Email không đúng định dạng." |

### Lỗi Đặt vé (Booking)
| Lỗi kỹ thuật | Thông báo thân thiện |
|-------------|---------------------|
| `Seat already booked` | "Ghế này đã được đặt. Vui lòng chọn ghế khác." |
| `Trip not found` | "Không tìm thấy chuyến xe này." |
| `No available seats` | "Chuyến xe đã hết chỗ." |

### Lỗi Thanh toán (Payment)
| Lỗi kỹ thuật | Thông báo thân thiện |
|-------------|---------------------|
| `Payment failed` | "Thanh toán thất bại. Vui lòng thử lại." |
| `Insufficient balance` | "Số dư không đủ để thực hiện giao dịch." |
| `Payment timeout` | "Thanh toán quá hạn. Vui lòng đặt vé lại." |

### Lỗi Server
| Status Code | Thông báo thân thiện |
|------------|---------------------|
| `400` | "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại." |
| `401` | "Bạn không có quyền truy cập. Vui lòng đăng nhập lại." |
| `403` | "Bạn không có quyền thực hiện thao tác này." |
| `404` | "Không tìm thấy dữ liệu yêu cầu." |
| `409` | "Dữ liệu đã tồn tại." |
| `500` | "Lỗi máy chủ. Vui lòng thử lại sau." |
| `503` | "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau." |

## 🛠️ Các hàm tiện ích

### `handleError(error)`
Chuyển đổi error object thành thông báo thân thiện.

```javascript
const errorMsg = handleError(error);
showError(errorMsg);
```

### `handleSuccess(message)`
Chuyển đổi success message thành thông báo thân thiện.

```javascript
const successMsg = handleSuccess(response.data.message);
showSuccess(successMsg);
```

### `sanitizeMessage(message)`
Làm sạch thông báo, xóa các thông tin kỹ thuật như localhost, URLs, status codes.

```javascript
const cleanMsg = sanitizeMessage('Error at localhost:5000/api/trips (404)');
// Kết quả: "Error at máy chủ"
```

### `formatValidationErrors(errors)`
Format validation errors từ server thành dạng dễ đọc.

```javascript
const errors = [
  { msg: 'Email is required' },
  { msg: 'Password must be at least 8 characters' }
];
const formattedMsg = formatValidationErrors(errors);
showError(formattedMsg);
```

## 🎨 Best Practices

### ✅ DO:
- Luôn sử dụng `handleError()` khi xử lý lỗi
- Xóa tất cả `console.error()` và `console.log()` trong production code
- Sử dụng thông báo tiếng Việt cho người dùng Việt Nam
- Kiểm tra `error.friendlyMessage` trước khi gọi `handleError()`

### ❌ DON'T:
- Không hiển thị thông báo kỹ thuật trực tiếp cho user
- Không để lộ thông tin về server (localhost, port, endpoints)
- Không hiển thị stack traces cho user
- Không dùng English error messages cho user Việt

## 📝 Ví dụ thực tế

### Login Form
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await authService.login(email, password);
    success('Đăng nhập thành công!');
    navigate('/dashboard');
  } catch (err) {
    const errorMsg = err.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
    showError(errorMsg);
  } finally {
    setLoading(false);
  }
};
```

### Fetch Data
```javascript
const fetchTrips = async () => {
  try {
    const response = await api.get('/trips');
    setTrips(response.data.data || []);
  } catch (error) {
    const errorMsg = error.friendlyMessage || handleError(error);
    showError(errorMsg);
  }
};
```

### Create Booking
```javascript
const handleBooking = async () => {
  setLoading(true);
  
  try {
    const response = await api.post('/bookings', bookingData);
    success('Đặt vé thành công!');
    navigate('/payment', { state: { bookingId: response.data.id } });
  } catch (error) {
    const errorMsg = error.friendlyMessage || handleError(error);
    showError(errorMsg);
  } finally {
    setLoading(false);
  }
};
```

## 🔧 Cấu hình

Để thêm thông báo lỗi mới, chỉnh sửa `ERROR_MESSAGES` trong `messageHandler.js`:

```javascript
const ERROR_MESSAGES = {
  'Your custom error': 'Thông báo thân thiện của bạn',
  // ... thêm các message khác
};
```

## 📊 Kết quả

### Trước khi cải thiện:
```
❌ "Error: connect ECONNREFUSED 127.0.0.1:5000 at localhost:5000/api/trips"
❌ "Network Error: Failed to fetch http://localhost:5000/api/bookings"
❌ "Error 500: Internal Server Error"
```

### Sau khi cải thiện:
```
✅ "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn."
✅ "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
✅ "Lỗi máy chủ. Vui lòng thử lại sau."
```

## 🎯 Checklist Migration

Khi migrate code cũ sang hệ thống mới:

- [ ] Import `handleError` và `handleSuccess` từ `messageHandler.js`
- [ ] Thay thế tất cả `error.response?.data?.message` bằng `handleError(error)`
- [ ] Xóa tất cả `console.error()` và `console.log()` 
- [ ] Kiểm tra `error.friendlyMessage` trước khi gọi `handleError()`
- [ ] Đảm bảo tất cả thông báo đều là tiếng Việt
- [ ] Test các trường hợp lỗi khác nhau
- [ ] Verify không còn thông tin kỹ thuật nào bị lộ

---

**Người tạo:** Hệ thống đã được cải thiện vào ngày 10/12/2025  
**Mục đích:** Nâng cao trải nghiệm người dùng với thông báo thân thiện và chuyên nghiệp
