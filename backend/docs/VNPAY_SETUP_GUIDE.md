# 🔐 Hướng dẫn cấu hình VNPay cho Payment System

## 📋 Tổng quan

VNPay là cổng thanh toán điện tử tại Việt Nam. Để sử dụng VNPay trong dự án, bạn cần đăng ký tài khoản và lấy thông tin xác thực.

---

## 🚀 Cách đăng ký VNPay Sandbox (Môi trường test)

### Bước 1: Đăng ký tài khoản sandbox

1. Truy cập: **https://sandbox.vnpayment.vn/devreg/**
2. Điền thông tin đăng ký (email, tên công ty, số điện thoại)
3. Xác nhận email
4. Đăng nhập vào dashboard

### Bước 2: Lấy thông tin xác thực

Sau khi đăng nhập, bạn sẽ nhận được:

- **TMN Code** (Terminal Code): Mã định danh merchant
- **Hash Secret**: Khóa bí mật dùng để mã hóa dữ liệu
- **API URL**: URL endpoint của VNPay

### Bước 3: Cấu hình trong file .env

```env
# VNPay Configuration
VNP_TMNCODE=YOUR_TMN_CODE_HERE
VNP_HASHSECRET=YOUR_HASH_SECRET_HERE
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5000/api/payments/vnpay-return
VNP_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

---

## 🧪 Thông tin test (nếu chưa có tài khoản)

**Tạm thời**, bạn có thể dùng thông tin demo (không thanh toán thật):

```env
VNP_TMNCODE=DEMO01
VNP_HASHSECRET=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456
```

⚠️ **Lưu ý**: Thông tin demo trên có thể không hoạt động. Bạn cần đăng ký tài khoản sandbox thật để test đầy đủ.

---

## 📝 Thông tin thẻ test (VNPay Sandbox)

Khi test thanh toán trên sandbox, dùng các thẻ test sau:

### Thẻ ATM nội địa (thành công)
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### Thẻ Visa/MasterCard (thành công)
```
Số thẻ: 4111111111111111
Ngày hết hạn: 12/25
CVV: 123
```

---

## 🔄 Quy trình thanh toán VNPay

```
1. User tạo booking
   ↓
2. Backend gọi createVNPayPayment()
   ↓
3. Tạo payment record trong DB
   ↓
4. Generate payment URL với chữ ký SHA512
   ↓
5. Frontend redirect user đến VNPay
   ↓
6. User nhập thông tin thẻ
   ↓
7. VNPay xử lý thanh toán
   ↓
8. VNPay redirect về returnUrl
   ↓
9. Backend verify chữ ký từ VNPay
   ↓
10. Cập nhật payment status trong DB
    ↓
11. Thông báo kết quả cho user
```

---

## 🧪 Test Payment API

### 1. Tạo booking trước
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trip_id": 34,
    "passenger_info": {
      "name": "Nguyen Van A",
      "phone": "0123456789",
      "email": "test@example.com"
    },
    "seat_numbers": [1, 2],
    "payment_method": "vnpay"
  }'
```

### 2. Tạo payment URL
```bash
curl -X POST http://localhost:5000/api/payments/vnpay \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": BOOKING_ID_FROM_STEP_1,
    "amount": 500000
  }'
```

Response sẽ trả về `paymentUrl`:
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=..."
  }
}
```

### 3. Test payment flow

1. Copy `paymentUrl` và mở trong browser
2. Chọn ngân hàng NCB
3. Nhập thông tin thẻ test (xem phía trên)
4. Nhập mã OTP: `123456`
5. VNPay sẽ redirect về returnUrl với kết quả

---

## 🔍 Kiểm tra kết quả

### Xem payment history
```bash
curl -X GET "http://localhost:5000/api/payments/history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Kiểm tra payment status trong DB
```sql
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
SELECT * FROM bookings WHERE id = YOUR_BOOKING_ID;
```

---

## ⚙️ Production Setup

Khi deploy lên production:

1. **Đăng ký VNPay thật**: https://vnpay.vn/dang-ky/
2. **Cập nhật .env**:
   ```env
   NODE_ENV=production
   VNP_TMNCODE=YOUR_PRODUCTION_TMNCODE
   VNP_HASHSECRET=YOUR_PRODUCTION_HASHSECRET
   VNP_URL=https://pay.vnpay.vn/paymentv2/vpcpay.html
   VNP_RETURN_URL=https://yourdomain.com/api/payments/vnpay-return
   ```
3. **Bảo mật**:
   - Không commit file `.env` vào git
   - Dùng environment variables trên server
   - Enable HTTPS cho returnUrl

---

## 🐛 Troubleshooting

### Lỗi: "Invalid signature"
- Kiểm tra `VNP_HASHSECRET` có đúng không
- Đảm bảo params được sort theo alphabet trước khi hash

### Lỗi: "Invalid TMN Code"
- Kiểm tra `VNP_TMNCODE` có đúng không
- Đảm bảo đang dùng đúng môi trường (sandbox/production)

### Payment URL không hoạt động
- Kiểm tra `VNP_URL` có đúng không
- Restart server sau khi sửa .env

### Return URL không được gọi
- Kiểm tra `VNP_RETURN_URL` có accessible không
- Nếu test local, dùng ngrok: `ngrok http 5000`

---

## 📚 Tài liệu tham khảo

- **VNPay API Docs**: https://sandbox.vnpayment.vn/apis/
- **Integration Guide**: https://sandbox.vnpayment.vn/apis/vnpay-integration-guide.pdf
- **Support**: support@vnpay.vn

---

## ✅ Checklist

- [ ] Đã đăng ký VNPay sandbox
- [ ] Đã cấu hình TMN Code và Hash Secret trong .env
- [ ] Đã test tạo payment URL
- [ ] Đã test payment flow với thẻ test
- [ ] Đã verify payment status được cập nhật đúng
- [ ] Đã test returnUrl callback
- [ ] Đã kiểm tra payment history API

---

**Nếu chỉ test backend API mà không cần thanh toán thật, API create payment đã hoạt động (tạo payment URL). Chỉ cần VNPay credentials thật để test full flow thanh toán!**
