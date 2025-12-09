# 📮 HƯỚNG DẪN TEST API VỚI POSTMAN

## 🚀 Bước 1: Import Collection vào Postman

1. Mở **Postman**
2. Click **Import** (góc trên bên trái)
3. Chọn file `Bus_Ticket_API.postman_collection.json`
4. Click **Import**

## ⚙️ Bước 2: Cấu hình Environment Variables

Collection đã có sẵn các biến:
- `base_url`: http://localhost:5000/api
- `token`: (sẽ tự động set sau khi login)
- `user_id`: (sẽ tự động set sau khi login)
- `trip_id`: (sẽ tự động set sau khi search trips)
- `booking_id`: (sẽ tự động set sau khi tạo booking)

## 📝 Bước 3: Khởi động Backend

```powershell
# Di chuyển vào thư mục backend
cd f:\cacduan\Manage_bus_tickets\backend

# Cài đặt dependencies (nếu chưa cài)
npm install

# Tạo file .env (copy từ .env.example)
Copy-Item .env.example .env

# Chỉnh sửa file .env với thông tin của bạn
notepad .env

# Khởi động server
npm start
```

Server sẽ chạy tại: http://localhost:5000

## 🧪 Bước 4: Test API theo thứ tự

### **A. AUTHENTICATION (Bắt buộc test đầu tiên)**

#### 1. Register - Passenger
```
POST /api/auth/register
Body:
{
  "email": "passenger@example.com",
  "password": "Password123!",
  "full_name": "Nguyen Van A",
  "phone": "0901234567",
  "role": "passenger"
}
```

#### 2. Register - Bus Company
```
POST /api/auth/register
Body:
{
  "email": "buscompany@example.com",
  "password": "Password123!",
  "full_name": "Phuong Trang Express",
  "phone": "0287654321",
  "role": "bus_company"
}
```

#### 3. Login ⭐ QUAN TRỌNG
```
POST /api/auth/login
Body:
{
  "email": "passenger@example.com",
  "password": "Password123!"
}

✅ Response sẽ trả về token → Tự động lưu vào biến {{token}}
```

#### 4. Verify Token
```
GET /api/auth/verify?token={{token}}
```

#### 5. Forgot Password
```
POST /api/auth/forgot-password
Body:
{
  "email": "passenger@example.com"
}
```

#### 6. Logout
```
POST /api/auth/logout
Headers:
Authorization: Bearer {{token}}
```

---

### **B. USER MANAGEMENT**

#### 1. Get Profile
```
GET /api/users/profile
Headers:
Authorization: Bearer {{token}}
```

#### 2. Update Profile
```
PUT /api/users/profile
Headers:
Authorization: Bearer {{token}}
Content-Type: application/json

Body:
{
  "full_name": "Nguyen Van A Updated",
  "phone": "0901234568"
}
```

#### 3. Update Profile with Avatar
```
PUT /api/users/profile
Headers:
Authorization: Bearer {{token}}

Body: form-data
- full_name: Nguyen Van A
- phone: 0901234567
- avatar: [chọn file ảnh]
```

#### 4. Change Password
```
PUT /api/users/change-password
Headers:
Authorization: Bearer {{token}}

Body:
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

---

### **C. TRIPS (Public + Protected)**

#### 1. Search Trips (Public - Không cần token)
```
GET /api/trips/search?from=Ho Chi Minh&to=Da Lat&date=2025-12-15&page=1&limit=10

✅ Response sẽ trả về danh sách trips
→ trip_id tự động lưu vào biến {{trip_id}}
```

#### 2. Get Trip Detail
```
GET /api/trips/{{trip_id}}
```

#### 3. Get Seat Map
```
GET /api/trips/{{trip_id}}/seat-map
```

#### 4. Create Trip (Bus Company Only)
```
POST /api/trips
Headers:
Authorization: Bearer {{token}}

Body:
{
  "route_id": 1,
  "bus_id": 1,
  "departure_time": "2025-12-15 08:00:00",
  "arrival_time": "2025-12-15 14:00:00",
  "price": 250000
}
```

---

### **D. BOOKINGS**

#### 1. Create Booking
```
POST /api/bookings
Headers:
Authorization: Bearer {{token}}

Body:
{
  "trip_id": {{trip_id}},
  "seat_numbers": ["A1", "A2"],
  "passenger_info": {
    "name": "Nguyen Van A",
    "phone": "0901234567",
    "email": "passenger@example.com"
  },
  "payment_method": "vnpay"
}

✅ Response trả về booking_id → Tự động lưu vào {{booking_id}}
```

#### 2. Get User Bookings
```
GET /api/bookings?page=1&limit=10&status=confirmed
Headers:
Authorization: Bearer {{token}}
```

#### 3. Get Booking QR Code
```
GET /api/bookings/{{booking_id}}/qr
Headers:
Authorization: Bearer {{token}}
```

#### 4. Cancel Booking
```
PUT /api/bookings/{{booking_id}}/cancel
Headers:
Authorization: Bearer {{token}}

Body:
{
  "cancellation_reason": "Thay doi ke hoach"
}
```

---

### **E. BUS COMPANIES**

⚠️ **Chú ý:** Phải login bằng tài khoản `bus_company` role

#### 1. Register Bus Company
```
POST /api/bus-companies/register
Headers:
Authorization: Bearer {{token}}

Body:
{
  "company_name": "Phuong Trang Express",
  "tax_code": "0123456789",
  "address": "272 De Tham, Quan 1, TP.HCM",
  "phone": "0287654321",
  "email": "contact@phuongtrang.com"
}
```

#### 2. Add Bus
```
POST /api/bus-companies/buses
Headers:
Authorization: Bearer {{token}}

Body:
{
  "license_plate": "51B-12345",
  "bus_type": "limousine",
  "total_seats": 22,
  "amenities": ["wifi", "ac", "water", "blanket"]
}
```

#### 3. Get Statistics
```
GET /api/bus-companies/stats
Headers:
Authorization: Bearer {{token}}
```

---

### **F. PAYMENTS**

#### 1. Create VNPay Payment
```
POST /api/payments/vnpay
Headers:
Authorization: Bearer {{token}}

Body:
{
  "booking_id": {{booking_id}},
  "amount": 500000
}

✅ Response trả về payment_url → Mở link để thanh toán
```

#### 2. Get Payment History
```
GET /api/payments/history?page=1&limit=10
Headers:
Authorization: Bearer {{token}}
```

---

### **G. ADMIN**

⚠️ **Chú ý:** Phải login bằng tài khoản `admin` role

#### 1. Get All Users
```
GET /api/admin/users?page=1&limit=10&role=passenger
Headers:
Authorization: Bearer {{token}}
```

#### 2. Approve Bus Company
```
PUT /api/admin/bus-companies/:id/status
Headers:
Authorization: Bearer {{token}}

Body:
{
  "status": "approved"
}
```

#### 3. Create Route
```
POST /api/admin/routes
Headers:
Authorization: Bearer {{token}}

Body:
{
  "departure_city": "Ho Chi Minh",
  "departure_station": "Ben Xe Mien Dong",
  "arrival_city": "Da Lat",
  "arrival_station": "Ben Xe Da Lat",
  "distance_km": 308,
  "estimated_duration_minutes": 360
}
```

#### 4. Get Analytics
```
GET /api/admin/analytics
Headers:
Authorization: Bearer {{token}}
```

---

## 🎯 Flow Test Chuẩn

### **Scenario 1: User đặt vé**
1. ✅ Register → Login (Passenger)
2. ✅ Search Trips
3. ✅ Get Trip Detail + Seat Map
4. ✅ Create Booking
5. ✅ Create VNPay Payment
6. ✅ Get Booking QR Code

### **Scenario 2: Bus Company quản lý**
1. ✅ Register → Login (Bus Company)
2. ✅ Register Company Info
3. ✅ Add Bus
4. ✅ Create Trip
5. ✅ Get Bookings
6. ✅ Get Statistics

### **Scenario 3: Admin quản trị**
1. ✅ Login (Admin)
2. ✅ Get All Users
3. ✅ Approve Bus Company
4. ✅ Create Route
5. ✅ Get Analytics

---

## 🔧 Troubleshooting

### ❌ Lỗi 401 Unauthorized
- Kiểm tra token đã được set chưa
- Token có thể hết hạn → Login lại

### ❌ Lỗi 403 Forbidden
- Kiểm tra role của user
- Admin routes chỉ dành cho admin
- Bus company routes chỉ dành cho bus_company

### ❌ Lỗi 404 Not Found
- Kiểm tra base_url đúng chưa
- Server có đang chạy không

### ❌ Lỗi 500 Internal Server Error
- Kiểm tra database đã được tạo chưa
- Kiểm tra file .env có đầy đủ thông tin chưa
- Xem logs ở terminal backend

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "error": { ... }
}
```

---

## 🎓 Tips

1. **Test theo thứ tự**: Authentication → Users → Trips → Bookings
2. **Lưu token**: Token tự động lưu sau khi login
3. **Check Console**: Xem response và status code
4. **Save Examples**: Lưu response làm example cho lần sau
5. **Environment**: Có thể tạo nhiều environment (dev, staging, production)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra backend logs
2. Kiểm tra database connection
3. Verify .env configuration
4. Check Postman console (View → Show Postman Console)

Happy Testing! 🎉
