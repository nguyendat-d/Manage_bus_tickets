# 🚌 Bus Ticket Management System

Hệ thống quản lý bán vé xe khách online toàn chức năng, xây dựng bằng **React 18** + **Node.js Express** + **MySQL 8.0**.

## ✨ Tính Năng Chính

### 👤 Người Dùng (Passenger)
- ✅ Đăng ký/Đăng nhập JWT
- ✅ Tìm kiếm chuyến xe theo tuyến + ngày
- ✅ Xem chi tiết chuyến xe
- ✅ Đặt vé với chọn ghế interactively
- ✅ Thanh toán qua VNPay/Credit Card
- ✅ Quản lý booking của mình
- ✅ Cập nhật profile
- ✅ Đổi mật khẩu
- ✅ QR code vé

### 🚌 Nhà Xe (Bus Company)
- ✅ Dashboard quản lý chuyến xe
- ✅ Quản lý xe khách (CRUD)
- ✅ Tạo chuyến mới
- ✅ Xem booking của nhà xe
- ✅ Thống kê doanh thu
- ✅ Quản lý tuyến đường

### 👨‍💼 Admin
- ✅ Quản lý users (tất cả roles)
- ✅ Phê duyệt/Reject nhà xe
- ✅ Quản lý routes
- ✅ Analytics dashboard
- ✅ Disable/Enable users
- ✅ Xem tất cả bookings

## 🏗️ Kiến Trúc

```
Manage_bus_tickets/
├── backend/                 # Express.js API
│   ├── app.js              # Entry point
│   ├── config/             # Database, Cloudinary config
│   ├── controllers/        # Business logic (7 files)
│   ├── middleware/         # Auth, validation, rate-limit
│   ├── models/             # Database models (7 classes)
│   ├── routes/             # API endpoints (7 route files)
│   ├── database/           # SQL schema
│   └── utils/              # Helpers, email, payment
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── App.jsx         # Main routing
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # Auth, Booking context
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Helpers, validators
│   │   └── styles/         # CSS (Tailwind)
│   └── public/             # Static files
├── scripts/                # Database setup scripts
├── docker-compose.yml      # Multi-container orchestration
└── README.md
```

## 🚀 Quick Start

### Yêu Cầu
- Node.js 18+
- MySQL 8.0+ (hoặc Docker)
- npm/yarn

### Option 1: Setup Script (Recommended)

**Windows:**
```bash
powershell -ExecutionPolicy Bypass -File setup.ps1
```

**macOS/Linux:**
```bash
bash setup.sh
chmod +x setup.sh
```

### Option 2: Manual Setup

#### 1. Setup Database
```bash
# Tạo database
mysql -u root -p < backend/database/schema.sql
```

#### 2. Backend
```bash
cd backend
npm install
npm run dev
# Server chạy tại: http://localhost:5000
```

#### 3. Frontend (terminal khác)
```bash
cd frontend
npm install
npm run dev
# UI chạy tại: http://localhost:5173
```

### Option 3: Docker Compose

```bash
docker-compose up -d
# Frontend: http://localhost:5173
# Backend: http://localhost:5000/api
# Adminer: http://localhost:8080
```

## 📖 Hướng Dẫn Sử Dụng

Xem chi tiết tại: [DEMO_GUIDE.md](./DEMO_GUIDE.md)

### Demo Workflow:
1. **Đăng ký** - Tạo tài khoản passenger/bus company
2. **Tìm kiếm** - Search chuyến xe
3. **Đặt vé** - Chọn ghế, điền thông tin hành khách
4. **Thanh toán** - Thanh toán vé
5. **Admin** - Quản lý hệ thống

## 🔐 Bảo Mật

- ✅ **JWT Authentication** - Token-based auth
- ✅ **Password Hashing** - bcryptjs (10 rounds)
- ✅ **Input Validation** - Joi schema validation
- ✅ **Rate Limiting** - Prevent brute force
- ✅ **CORS** - Configured security
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **Role-based Access** - Admin/Bus Company/Passenger

## 📊 Database Schema

### Main Tables:
- `users` - Người dùng (passenger, bus_company, admin)
- `bus_companies` - Công ty xe khách
- `buses` - Xe khách
- `routes` - Tuyến đường (Hà Nội → Hải Phòng, etc)
- `trips` - Chuyến xe (Route + Bus + Departure time)
- `bookings` - Đặt vé của khách hàng
- `payments` - Thanh toán
- `reviews` - Đánh giá (optional)

## 🛠️ Tech Stack

### Backend
- **Framework:** Express.js 4.18
- **Database:** MySQL 8.0 + mysql2
- **Authentication:** JWT + bcryptjs
- **Validation:** Joi
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Payment:** VNPay API ready
- **Security:** Rate Limit, Helmet, CORS
- **Others:** Moment.js, QR Code

### Frontend
- **UI Framework:** React 18.2
- **Build Tool:** Vite 4.5
- **Styling:** Tailwind CSS 3.3
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **State:** Context API

## 📱 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `GET /api/auth/verify` - Verify token

### Trips
- `GET /api/trips/search` - Tìm chuyến xe
- `GET /api/trips/:id` - Chi tiết chuyến xe
- `POST /api/trips` - Tạo chuyến (nhà xe)
- `PUT /api/trips/:id` - Cập nhật chuyến
- `DELETE /api/trips/:id` - Xóa chuyến

### Bookings
- `GET /api/bookings` - Danh sách booking của user
- `POST /api/bookings` - Tạo booking mới
- `GET /api/bookings/:id` - Chi tiết booking
- `PUT /api/bookings/:id/cancel` - Hủy booking
- `GET /api/bookings/:id/qr` - Download QR code

### Payments
- `POST /api/payments/vnpay` - Khởi tạo VNPay
- `GET /api/payments/vnpay-return` - VNPay callback
- `GET /api/payments/:id` - Chi tiết payment

### Admin
- `GET /api/admin/users` - Danh sách users
- `POST /api/admin/users/:id/disable` - Disable user
- `GET /api/admin/bus-companies` - Danh sách nhà xe
- `PUT /api/admin/bus-companies/:id/approve` - Phê duyệt
- `GET /api/admin/analytics` - Analytics dashboard

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend linting
cd frontend
npm run lint
```

## 📋 Kiểm Tra Chất Lượng

Xem chi tiết tại: [QUALITY_REPORT.md](./QUALITY_REPORT.md)

**Overall Score:** 7.7/10 ✅
- Backend: 9/10
- Frontend: 8/10
- Security: 8/10
- Database: 9/10

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### MySQL connection error
- Chắc chắn MySQL running
- Check `.env` credentials
- Verify database created

### Frontend API connection failed
- Backend đang chạy (port 5000)?
- Check `.env.local` có `VITE_API_URL`?
- Check DevTools Network tab

## 📝 Environment Variables

```bash
# Backend (.env)
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=thanhdat12345
DB_NAME=bus_ticket_management
JWT_SECRET=your_super_secret_jwt_key

# Frontend (.env.local)
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Heroku
```bash
git push heroku main
```

### Docker
```bash
docker build -t bus-ticket:1.0 .
docker run -p 5000:5000 bus-ticket:1.0
```

### AWS/GCP
1. Build Docker images
2. Push to ECR/GCR
3. Deploy to ECS/GKE

## 📚 Tài Liệu Bổ Sung

- [Demo Guide](./DEMO_GUIDE.md) - Chi tiết hướng dẫn demo
- [Quality Report](./QUALITY_REPORT.md) - Báo cáo kiểm tra
- [API Documentation](./docs/API.md) - Chi tiết API

## 👥 Đội Ngũ

- **Developer:** Nguyễn Đạt
- **PM:** [Your Name]
- **Design:** [Design Team]

## 📄 License

MIT License - Sử dụng tự do cho mục đích cá nhân & thương mại

## 📧 Support

- 📧 Email: support@busticket.vn
- 📱 Phone: +84 90 XXX XXXX
- 💬 Chat: https://chat.busticket.vn

---

**Cảm ơn bạn sử dụng Bus Ticket Management System! 🙏**

Made with ❤️ by Nguyễn Đạt
