# 🚀 HƯỚNG DẪN KHỞI ĐỘNG VÀ TEST API

## ✅ ĐÃ SỬA:
1. ✅ Sửa lỗi query trong `tripController.js` (bỏ bảng reviews không tồn tại)
2. ✅ Thêm file `sample_data.sql` với dữ liệu mẫu
3. ✅ Import 33 chuyến xe, 17 tuyến đường, 12 xe bus

## 📝 BƯỚC KHỞI ĐỘNG:

### 1. Tạo file .env
```powershell
cd F:\cacduan\Manage_bus_tickets\backend
Copy-Item .env.example .env
```

Chỉnh sửa file .env:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=thanhdat12345
DB_NAME=bus_ticket_management
JWT_SECRET=your_super_secret_jwt_key_here_123456789
```

### 2. Khởi động server
```powershell
npm start
```

Hoặc với nodemon (tự động restart):
```powershell
npm install -g nodemon
nodemon app.js
```

## 🧪 TEST API NGAY:

### Test 1: Health Check
```
GET http://localhost:5000/api/health
```
Expected: `{ "status": "OK" }`

### Test 2: Search Trips (ĐÃ SỬA)
```
GET http://localhost:5000/api/trips/search?from=Ho Chi Minh&to=Da Lat&date=2025-12-15&page=1&limit=10
```
Expected: Danh sách 3 chuyến xe HCM → Đà Lạt

### Test 3: Search với kết quả khác
```
GET http://localhost:5000/api/trips/search?from=Ho Chi Minh&to=Can Tho&date=2025-12-16
```
Expected: 2 chuyến xe HCM → Cần Thơ

### Test 4: Search Nha Trang
```
GET http://localhost:5000/api/trips/search?from=Ho Chi Minh&to=Nha Trang&date=2025-12-18
```
Expected: 2 chuyến xe HCM → Nha Trang (xe giường nằm chạy đêm)

## 📊 DỮ LIỆU MẪU ĐÃ CÓ:

### Users (5 người):
- admin@busticket.com (Admin)
- phuongtrang@buscompany.com (Nhà xe)
- mailinh@buscompany.com (Nhà xe)
- passenger1@gmail.com (Khách hàng)
- passenger2@gmail.com (Khách hàng)

**Password cho tất cả:** `Password123!`

### Bus Companies (2 nhà xe):
- Phuong Trang FUTA (Rating: 4.5⭐)
- Mai Linh Express (Rating: 4.3⭐)

### Routes (5 tuyến):
1. HCM → Đà Lạt (308km)
2. HCM → Cần Thơ (169km)
3. Hà Nội → Hải Phòng (102km)
4. HCM → Nha Trang (448km)
5. HCM → Vũng Tàu (125km)

### Trips (11 chuyến):
- 3 chuyến HCM → Đà Lạt (15/12/2025)
- 2 chuyến HCM → Cần Thơ (16/12/2025)
- 2 chuyến Hà Nội → Hải Phòng (17/12/2025)
- 2 chuyến HCM → Nha Trang (18/12/2025)
- 2 chuyến HCM → Vũng Tàu (20/12/2025)

## 🐛 NẾU VẪN LỖI:

### Lỗi: "Internal server error"
1. Kiểm tra console log backend
2. Verify database connection
3. Check .env file có đầy đủ không

### Lỗi: "Cannot find module"
```powershell
npm install
```

### Lỗi: Database connection
```powershell
# Test connection
node -e "const pool=require('./config/database');"
```

### Lỗi: Port đã được sử dụng
Đổi PORT trong .env thành 3001, 3002, etc.

## 📮 TEST VỚI POSTMAN:

1. Import file: `Bus_Ticket_API.postman_collection.json`
2. Test theo thứ tự trong `POSTMAN_GUIDE.md`
3. Các API Public (không cần login):
   - Health Check
   - Search Trips
   - Get Trip Detail
   - Get Seat Map

## ✨ NEXT STEPS:

1. ✅ Test Search API
2. ✅ Register & Login
3. ✅ Create Booking
4. ✅ Test Payment flow

Chúc bạn test thành công! 🎉
