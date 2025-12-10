# 🚌 Bus Ticket Management System

> **Hệ thống quản lý và đặt vé xe khách trực tuyến toàn diện**  
> Được xây dựng với kiến trúc RESTful API, hỗ trợ đa vai trò (Admin, Nhà xe, Hành khách)

[![Node.js](https://img.shields.io/badge/Node.js-20.17.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📑 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Chi Tiết](#-tính-năng-chi-tiết)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [Database Schema](#-database-schema)
- [Cài Đặt & Triển Khai](#-cài-đặt--triển-khai)
- [API Documentation](#-api-documentation)
- [Bảo Mật](#-bảo-mật)
- [Testing & Quality](#-testing--quality)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Giới Thiệu

**Bus Ticket Management System** là một nền tảng quản lý vé xe khách trực tuyến hoàn chỉnh, được thiết kế để phục vụ ba nhóm người dùng chính:

- **🎫 Hành khách (Passengers)**: Tìm kiếm, đặt vé, thanh toán trực tuyến, quản lý booking
- **🚌 Nhà xe (Bus Companies)**: Quản lý chuyến xe, xe khách, doanh thu, booking
- **👨‍💼 Quản trị viên (Admins)**: Giám sát toàn hệ thống, phê duyệt nhà xe, analytics

### 🌟 Điểm Nổi Bật

- ✅ **Đặt vé realtime** với chọn ghế tương tác (interactive seat selection)
- ✅ **Thanh toán đa kênh**: VNPay, Credit/Debit Card, Cash
- ✅ **QR Code vé điện tử** tự động sinh ra sau khi đặt vé
- ✅ **Email notifications** cho tất cả giao dịch quan trọng
- ✅ **Multi-role authentication** với JWT và phân quyền chi tiết
- ✅ **Responsive UI** hoạt động mượt mà trên mọi thiết bị
- ✅ **RESTful API** với documentation đầy đủ
- ✅ **Real-time seat availability** cập nhật trực tiếp khi có booking
- ✅ **Advanced search** với filter theo tuyến, ngày, giá, loại xe
- ✅ **Analytics dashboard** với biểu đồ doanh thu, booking trends

---

## ✨ Tính Năng Chi Tiết

### 👤 Hành Khách (Passengers)

#### Tìm Kiếm & Đặt Vé
- 🔍 **Tìm kiếm chuyến xe nâng cao**
  - Filter theo điểm đi, điểm đến, ngày khởi hành
  - Lọc theo khoảng giá (min-max)
  - Lọc theo loại xe (limousine, sleeper, seater, van)
  - Sắp xếp theo giá, thời gian, rating
  - Hiển thị số ghế còn trống realtime
  
- 🪑 **Chọn ghế tương tác (Interactive Seat Selection)**
  - Hiển thị sơ đồ ghế trực quan của từng xe
  - Phân biệt ghế trống/đã đặt/đang chọn bằng màu sắc
  - Hỗ trợ chọn nhiều ghế cùng lúc
  - Tự động tính tổng tiền theo số ghế đã chọn
  - Ngăn chặn double booking bằng database transaction

- 💳 **Thanh toán đa kênh**
  - **VNPay** - Cổng thanh toán phổ biến nhất VN
  - **Credit/Debit Card** - Visa, Mastercard, JCB
  - **Cash** - Thanh toán khi lên xe (COD)
  - Xử lý callback từ payment gateway
  - Auto-rollback nếu thanh toán thất bại

#### Quản Lý Vé & Profile
- 📱 **Quản lý booking**
  - Xem danh sách vé đã đặt (confirmed, cancelled, completed)
  - Filter theo trạng thái thanh toán
  - Hủy vé với điều kiện (trước 2 giờ khởi hành)
  - Auto-refund về tài khoản khi hủy vé
  - Download QR code vé điện tử
  
- 📧 **Email notifications**
  - Xác nhận đặt vé thành công
  - Thông báo thanh toán
  - Nhắc nhở trước giờ khởi hành
  - Thông báo hủy vé/hoàn tiền

- 👤 **Profile management**
  - Cập nhật thông tin cá nhân (tên, SĐT, email)
  - Upload avatar lên Cloudinary
  - Đổi mật khẩu với validation mạnh
  - Yêu cầu mật khẩu: tối thiểu 6 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt
  - View lịch sử giao dịch

---

### 🚌 Nhà Xe (Bus Companies)

#### Dashboard Tổng Quan
- 📊 **Thống kê realtime**
  - Tổng doanh thu theo ngày/tuần/tháng
  - Số lượng booking mới
  - Tỷ lệ lấp đầy ghế (occupancy rate)
  - Top 5 tuyến đường có doanh thu cao nhất
  - Biểu đồ xu hướng booking

#### Quản Lý Chuyến Xe
- 🚍 **CRUD Operations cho Trips**
  - Tạo chuyến mới với thông tin đầy đủ
    - Chọn tuyến đường (route)
    - Chọn xe (bus) đã đăng ký
    - Thiết lập giờ đi, giờ đến
    - Đặt giá vé
  - Cập nhật thông tin chuyến xe
  - Hủy chuyến với lý do
  - Tự động update số ghế available khi có booking
  - View danh sách booking của từng chuyến

#### Quản Lý Đội Xe
- 🚐 **Quản lý Buses (Xe khách)**
  - Thêm xe mới với thông tin chi tiết
    - Biển số xe (license plate)
    - Loại xe (limousine/sleeper/seater/van)
    - Số ghế (16-45 ghế tùy loại)
    - Tiện nghi (WiFi, AC, WC, TV, etc.)
  - Upload ảnh xe lên Cloudinary
  - Cấu hình sơ đồ ghế (seat map) dạng JSON
  - Quản lý trạng thái xe (active/maintenance/inactive)
  - View lịch sử hoạt động của từng xe

#### Quản Lý Tuyến Đường
- 🗺️ **Routes Management**
  - Đăng ký tuyến đường mới
  - Thông tin chi tiết: điểm đi/đến, bến xe, khoảng cách
  - Ước tính thời gian di chuyển
  - Enable/disable tuyến theo mùa

#### Booking & Revenue
- 💰 **Quản lý Booking**
  - View tất cả booking của nhà xe
  - Filter theo trạng thái (confirmed/cancelled/completed)
  - Export báo cáo Excel/PDF
  - Thống kê theo tuyến đường
  - Thống kê theo xe

---

### 👨‍💼 Quản Trị Viên (Admin)

#### Quản Lý Người Dùng
- 👥 **User Management**
  - View danh sách tất cả users (phân trang)
  - Filter theo role (passenger/bus_company/admin)
  - Search theo email, tên, SĐT
  - Disable/Enable user account
  - View chi tiết hoạt động của user
  - Xóa user (soft delete với cascade)

#### Quản Lý Nhà Xe
- 🚌 **Bus Company Approval System**
  - Xem danh sách nhà xe đăng ký mới (pending)
  - Review hồ sơ: giấy phép kinh doanh, mã số thuế
  - Phê duyệt (approve) hoặc từ chối (reject) với lý do
  - View profile chi tiết của nhà xe
  - Suspend/Unsuspend nhà xe vi phạm
  - Rating management

#### Analytics & Reports
- 📈 **Dashboard Analytics**
  - **Tổng quan hệ thống**
    - Tổng số users theo role
    - Tổng doanh thu toàn hệ thống
    - Số lượng booking theo ngày/tuần/tháng
    - Growth rate (tỷ lệ tăng trưởng)
  
  - **Biểu đồ trực quan**
    - Revenue chart (Line/Bar chart)
    - Booking trends (Area chart)
    - Top performing bus companies
    - Most popular routes
    - Payment method distribution
  
  - **Real-time statistics**
    - Active users online
    - Ongoing trips
    - Pending payments
    - Cancellation rate

#### System Management
- ⚙️ **Quản lý Routes toàn hệ thống**
  - Tạo tuyến đường mới cho toàn hệ thống
  - Cập nhật thông tin tuyến
  - Disable tuyến không hoạt động
  - Gộp/tách tuyến đường

- 💳 **Payment Management**
  - View tất cả giao dịch thanh toán
  - Filter theo phương thức thanh toán
  - Xử lý các giao dịch lỗi (failed transactions)
  - Refund management
  - Export payment reports

---

## 🛠️ Công Nghệ Sử Dụng

### Backend Technologies

#### Core Framework & Runtime
- **Node.js v20.17.0** - JavaScript runtime environment
- **Express.js v4.18.2** - Web application framework
  - Fast, unopinionated, minimalist framework
  - Middleware architecture
  - Robust routing system

#### Database & ORM
- **MySQL v8.0** - Relational database management system
  - ACID transactions support
  - Foreign key constraints
  - Index optimization
- **mysql2 v3.6.5** - MySQL client for Node.js
  - Promise wrapper support
  - Prepared statements
  - Connection pooling

#### Authentication & Security
- **jsonwebtoken v9.0.2** - JWT token generation & verification
  - Stateless authentication
  - Token expiration & refresh
  - Role-based access control (RBAC)
- **bcryptjs v2.4.3** - Password hashing
  - Salt rounds: 10
  - One-way encryption
  - Brute-force resistant
- **helmet v7.1.0** - Security headers middleware
  - XSS protection
  - Content Security Policy
  - Clickjacking prevention
- **express-rate-limit v7.1.5** - Rate limiting
  - Prevent brute force attacks
  - DDoS protection
  - Configurable time windows & limits

#### Validation & Data Processing
- **Joi v17.11.0** - Schema validation
  - Request body validation
  - Query parameter validation
  - Custom validation rules
  - Detailed error messages

#### File Upload & Storage
- **Multer v1.4.5** - Multipart/form-data handling
  - File size limits
  - File type filtering
  - Memory/disk storage
- **Cloudinary v1.41.0** - Cloud image & video management
  - Image optimization
  - Automatic format conversion
  - CDN delivery
  - Transformations (resize, crop, effects)
- **multer-storage-cloudinary v4.0.0** - Multer + Cloudinary integration

#### Email Service
- **Nodemailer v6.9.7** - Email sending
  - SMTP transport
  - HTML email templates
  - Attachment support
  - Gmail/SendGrid/AWS SES compatible

#### Payment Integration
- **Axios v1.6.0** - HTTP client
  - VNPay API integration
  - Retry mechanism
  - Interceptors for logging
- **Custom VNPay Gateway** - Vietnamese payment processor
  - HMAC-SHA512 signature verification
  - IPN (Instant Payment Notification)
  - Return URL handling

#### QR Code Generation
- **qrcode v1.5.3** - QR code generator
  - SVG/PNG/Base64 output
  - Error correction levels
  - Booking code embedding

#### Utilities & Helpers
- **moment v2.29.4** - Date/time manipulation
  - Timezone handling
  - Date formatting
  - Duration calculations
- **cors v2.8.5** - Cross-Origin Resource Sharing
  - Configurable origins
  - Credentials support
- **compression v1.7.4** - Response compression
  - Gzip compression
  - Bandwidth reduction
- **morgan v1.10.0** - HTTP request logger
  - Detailed request logs
  - Custom log formats
- **dotenv v16.3.1** - Environment variables management

#### Development Tools
- **nodemon v3.0.2** - Auto-reload development server
- **jest v29.7.0** - Testing framework
- **supertest v6.3.3** - HTTP assertion library

---

### Frontend Technologies

#### Core Libraries
- **React v18.2.0** - UI library
  - Component-based architecture
  - Virtual DOM
  - Hooks (useState, useEffect, useContext, useMemo, useCallback)
  - React.StrictMode for development
- **React DOM v18.2.0** - React renderer for web
- **React Router DOM v6.20.0** - Client-side routing
  - Nested routes
  - Protected routes
  - URL parameters
  - Navigation guards

#### Build Tool
- **Vite v5.0.8** - Next-generation build tool
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ES modules support
  - Tree-shaking
  - Code splitting
- **@vitejs/plugin-react v4.2.1** - React plugin for Vite
  - Fast Refresh support
  - JSX transformation

#### HTTP Client & State Management
- **Axios v1.6.2** - Promise-based HTTP client
  - Request/response interceptors
  - Automatic JSON transformation
  - Timeout handling
  - Error handling
  - Base URL configuration
  - Token injection

#### Styling
- **Pure CSS3** - No framework dependencies
  - Custom CSS modules
  - Responsive design with media queries
  - CSS Grid & Flexbox
  - CSS Variables for theming
  - Animations & transitions

#### Context API
- **NotificationContext** - Toast notifications
  - Success/error/info messages
  - Auto-dismiss
  - Queue management

---

### Database Architecture

#### Tables (8 main tables)
1. **users** - Người dùng (passenger, bus_company, admin)
2. **bus_companies** - Thông tin nhà xe
3. **routes** - Tuyến đường (HN → HP, HCM → VT, etc.)
4. **buses** - Xe khách (biển số, loại xe, sơ đồ ghế)
5. **trips** - Chuyến xe cụ thể (route + bus + thời gian)
6. **bookings** - Đặt vé của khách hàng
7. **payments** - Giao dịch thanh toán
8. **reviews** (Optional) - Đánh giá của khách hàng

#### Relationships
- **users** → **bus_companies** (1:1)
- **bus_companies** → **buses** (1:n)
- **buses** → **trips** (1:n)
- **routes** → **trips** (1:n)
- **trips** → **bookings** (1:n)
- **users** (passengers) → **bookings** (1:n)
- **bookings** → **payments** (1:1)

#### Data Types Used
- **INT** - Primary keys, Foreign keys
- **VARCHAR** - Strings (email, phone, names)
- **TEXT** - Long text (addresses, reasons)
- **DECIMAL** - Money amounts (prices, revenue)
- **ENUM** - Fixed choices (status, role, payment_method)
- **JSON** - Complex objects (seat_map, passenger_info, amenities)
- **TIMESTAMP** - Dates & times
- **BOOLEAN** - True/false flags

#### Indexes
- `idx_users_email` - Fast email lookup
- `idx_users_role` - Role-based queries
- `idx_bookings_code` - Booking code search
- `idx_trips_departure` - Departure time queries
- Composite indexes on foreign keys

---

### DevOps & Deployment

#### Containerization
- **Docker** - Container platform
- **Docker Compose v3.8** - Multi-container orchestration
  - Backend service
  - Frontend service
  - MySQL service
  - Adminer (Database GUI)
  - Shared network
  - Volume persistence

#### Version Control
- **Git** - Distributed version control
- **GitHub** - Repository hosting
  - Branch protection
  - Pull request reviews
  - CI/CD workflows

#### Environment Management
- **Development** - Local development with hot-reload
- **Staging** - Pre-production testing
- **Production** - Live environment
  - Environment-specific configs
  - Secrets management via .env files

---

## 🏗️ Kiến Trúc Hệ Thống

### Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  │   (React)    │  │  (Responsive)│  │ (Responsive) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Port 5000)                    │
│                      Express.js                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Rate Limiter │ CORS │ Helmet │ Compression │ Morgan │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE LAYER                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Auth     │  │ Validation │  │   Upload   │           │
│  │   (JWT)    │  │   (Joi)    │  │  (Multer)  │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   Auth   │ │ Booking  │ │   Trip   │ │  Admin   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Payment  │ │BusCompany│ │   User   │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     MODEL LAYER (ORM)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   User   │ │ Booking  │ │   Trip   │ │   Bus    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Payment  │ │  Route   │ │BusCompany│                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│                     MySQL 8.0                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Connection Pool (max: 10) │ Transactions │ Indexes  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Cloudinary│ │  VNPay   │ │   SMTP   │ │   QR     │      │
│  │  (CDN)   │ │(Payment) │ │ (Email)  │ │ Generator│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Cấu Trúc Thư Mục Chi Tiết

```
Manage_bus_tickets/
├── backend/                          # Backend API Server
│   ├── app.js                        # Express app entry point
│   ├── package.json                  # Dependencies & scripts
│   ├── .env                          # Environment variables (gitignored)
│   ├── .env.example                  # Environment template
│   │
│   ├── config/                       # Configuration files
│   │   ├── database.js              # MySQL connection pool
│   │   └── cloudinary.js            # Cloudinary config
│   │
│   ├── controllers/                  # Business logic handlers
│   │   ├── authController.js        # Login, register, reset password
│   │   ├── userController.js        # User profile, change password
│   │   ├── bookingController.js     # Create, cancel, view bookings
│   │   ├── tripController.js        # Search, view trips
│   │   ├── busCompanyController.js  # Bus company CRUD, trips management
│   │   ├── paymentController.js     # VNPay integration, IPN handling
│   │   └── adminController.js       # User management, analytics, approval
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                  # JWT verification, role checking
│   │   ├── validation.js            # Joi schema validation
│   │   ├── upload.js                # Multer file upload config
│   │   └── rateLimit.js             # Rate limiting rules
│   │
│   ├── models/                       # Database models (ORM-like)
│   │   ├── User.js                  # User CRUD operations
│   │   ├── Booking.js               # Booking operations
│   │   ├── Trip.js                  # Trip queries
│   │   ├── Bus.js                   # Bus management
│   │   ├── BusCompany.js            # Company operations
│   │   ├── Route.js                 # Route management
│   │   └── Payment.js               # Payment operations
│   │
│   ├── routes/                       # API route definitions
│   │   ├── auth.js                  # /api/auth/*
│   │   ├── users.js                 # /api/users/*
│   │   ├── bookings.js              # /api/bookings/*
│   │   ├── trips.js                 # /api/trips/*
│   │   ├── busCompanies.js          # /api/bus-companies/*
│   │   ├── payments.js              # /api/payments/*
│   │   └── admin.js                 # /api/admin/*
│   │
│   ├── utils/                        # Helper utilities
│   │   ├── emailService.js          # Nodemailer wrapper
│   │   ├── generateQR.js            # QR code generation
│   │   ├── paymentGateway.js        # VNPay helpers
│   │   └── helpers.js               # Common utilities
│   │
│   ├── database/                     # SQL files
│   │   ├── schema.sql               # Database schema
│   │   ├── sample_data.sql          # Seed data
│   │   ├── insert_trips.sql         # Trip samples
│   │   └── fix_*.sql                # Migration scripts
│   │
│   ├── test/                         # Test files
│   │   ├── test-all-api.js          # Integration tests
│   │   ├── final-complete-test.js   # E2E tests
│   │   └── *.md                     # Test reports
│   │
│   └── scripts/                      # Utility scripts
│       ├── migrate.js               # Run migrations
│       └── check-and-insert-data.js # Data seeding
│
├── frontend/                         # React Frontend
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── .env                         # Frontend env vars
│   │
│   └── src/                         # Source code
│       ├── main.jsx                 # React app entry
│       ├── App.jsx                  # Root component with routing
│       ├── index.css                # Global styles
│       │
│       ├── components/              # Reusable components
│       │   ├── auth/
│       │   │   ├── LoginForm.jsx
│       │   │   └── RegisterForm.jsx
│       │   └── admin/
│       │       └── AdminLayout.jsx
│       │
│       ├── pages/                   # Page components
│       │   ├── HomePage.jsx
│       │   ├── Passenger/
│       │   │   ├── PassengerDashboard.jsx
│       │   │   ├── TripSearch.jsx
│       │   │   ├── Payment.jsx
│       │   │   └── Profile.jsx
│       │   ├── BusCompany/
│       │   │   ├── BusCompanyDashboard.jsx
│       │   │   └── BusCompanyProfile.jsx
│       │   └── Admin/
│       │       ├── Dashboard.jsx
│       │       ├── UserManagement.jsx
│       │       ├── BusCompanyManagement.jsx
│       │       ├── RouteManagement.jsx
│       │       └── PaymentManagement.jsx
│       │
│       ├── services/                # API communication
│       │   ├── api.js              # Axios instance with interceptors
│       │   ├── authService.js      # Auth API calls
│       │   └── adminService.js     # Admin API calls
│       │
│       ├── contexts/                # React Context API
│       │   └── NotificationContext.jsx # Toast notifications
│       │
│       └── styles/                  # CSS stylesheets
│           ├── admin.css
│           ├── auth.css
│           ├── passenger.css
│           ├── bus-company.css
│           ├── home.css
│           └── *.css
│
├── scripts/                          # Setup scripts
│   ├── create_database.ps1          # PowerShell DB setup
│   ├── create_database.sql          # SQL setup
│   └── fix-booking-database.ps1     # Migration script
│
├── docker-compose.yml                # Docker orchestration
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
└── BOOKING_CANCELLATION_FIX.md       # Bug fix documentation
```

---

## 📊 Database Schema

### ER Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ full_name       │
│ phone           │
│ avatar_url      │
│ role (ENUM)     │ ──────┐
│ email_verified  │       │
│ status          │       │
│ created_at      │       │
└─────────────────┘       │
         │                │
         │ 1:1            │ 1:n
         ▼                ▼
┌─────────────────┐  ┌─────────────────┐
│ bus_companies   │  │    bookings     │
├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │
│ user_id (FK)    │  │ user_id (FK)    │
│ company_name    │  │ trip_id (FK)    │──┐
│ tax_code        │  │ booking_code    │  │
│ address         │  │ passenger_info  │  │
│ phone           │  │ seat_numbers    │  │
│ documents (JSON)│  │ total_amount    │  │
│ status (ENUM)   │  │ payment_method  │  │
│ rating          │  │ payment_status  │  │
└─────────────────┘  │ booking_status  │  │
         │           │ qr_code_url     │  │
         │ 1:n       │ cancellation    │  │
         ▼           └─────────────────┘  │
┌─────────────────┐           │           │
│      buses      │           │ 1:1       │
├─────────────────┤           ▼           │
│ id (PK)         │  ┌─────────────────┐  │
│ bus_company_id  │  │    payments     │  │
│ license_plate   │  ├─────────────────┤  │
│ bus_type (ENUM) │  │ id (PK)         │  │
│ total_seats     │  │ booking_id (FK) │  │
│ amenities (JSON)│  │ payment_method  │  │
│ seat_map (JSON) │  │ amount          │  │
│ status          │  │ transaction_id  │  │
└─────────────────┘  │ payment_status  │  │
         │           │ payment_date    │  │
         │ 1:n       │ vnpay_response  │  │
         ▼           └─────────────────┘  │
┌─────────────────┐                      │
│      trips      │◄─────────────────────┘
├─────────────────┤           1:n
│ id (PK)         │
│ bus_company_id  │
│ route_id (FK)   │──┐
│ bus_id (FK)     │  │
│ departure_time  │  │
│ arrival_time    │  │
│ price           │  │
│ available_seats │  │
│ status (ENUM)   │  │
└─────────────────┘  │
                     │ n:1
                     ▼
            ┌─────────────────┐
            │     routes      │
            ├─────────────────┤
            │ id (PK)         │
            │ departure_city  │
            │ departure_station│
            │ arrival_city    │
            │ arrival_station │
            │ distance_km     │
            │ estimated_duration│
            │ status          │
            └─────────────────┘
```

### Tables Chi Tiết

#### 1. users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role ENUM('passenger', 'bus_company', 'admin') NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

#### 2. bus_companies
```sql
CREATE TABLE bus_companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(50) UNIQUE,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    documents JSON,  -- {business_license, insurance, etc.}
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status)
);
```

#### 3. routes
```sql
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure_city VARCHAR(100) NOT NULL,
    departure_station VARCHAR(255) NOT NULL,
    arrival_city VARCHAR(100) NOT NULL,
    arrival_station VARCHAR(255) NOT NULL,
    distance_km DECIMAL(8,2),
    estimated_duration_minutes INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_departure (departure_city),
    INDEX idx_arrival (arrival_city)
);
```

#### 4. buses
```sql
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_company_id INT,
    license_plate VARCHAR(20) NOT NULL,
    bus_type ENUM('limousine', 'sleeper', 'seater', 'van') NOT NULL,
    total_seats INT NOT NULL,
    amenities JSON,  -- ["WiFi", "AC", "WC", "TV", "Blanket"]
    seat_map JSON NOT NULL,  -- Seat configuration
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bus_company_id) REFERENCES bus_companies(id) ON DELETE CASCADE,
    INDEX idx_company (bus_company_id)
);
```

#### 5. trips
```sql
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_company_id INT,
    route_id INT,
    bus_id INT,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('scheduled', 'departed', 'arrived', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bus_company_id) REFERENCES bus_companies(id),
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    
    INDEX idx_departure (departure_time),
    INDEX idx_status (status),
    INDEX idx_route (route_id)
);
```

#### 6. bookings
```sql
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    trip_id INT,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    passenger_info JSON NOT NULL,  -- {name, phone, email, id_number}
    seat_numbers JSON NOT NULL,     -- ["A1", "A2", "B3"]
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('vnpay', 'credit_card', 'debit_card', 'cash'),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    booking_status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    qr_code_url VARCHAR(500),
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    
    INDEX idx_code (booking_code),
    INDEX idx_user (user_id),
    INDEX idx_status (booking_status)
);
```

#### 7. payments
```sql
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100),
    payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    vnpay_response JSON,  -- Full response from VNPay
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    INDEX idx_booking (booking_id),
    INDEX idx_transaction (transaction_id)
);
```

---

## 🚀 Cài Đặt & Triển Khai

### Yêu Cầu Hệ Thống

- **Node.js**: >= 20.17.0 (LTS recommended)
- **npm**: >= 10.0.0 hoặc yarn >= 1.22.0
- **MySQL**: >= 8.0 (hoặc Docker)
- **RAM**: Minimum 2GB, Recommended 4GB
- **Disk Space**: 500MB cho dependencies
- **OS**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+

### Option 1: Setup Script (Khuyến Nghị)

#### Windows (PowerShell)
```powershell
# Run với quyền Administrator
powershell -ExecutionPolicy Bypass -File setup.ps1
```

Script sẽ tự động:
- ✅ Kiểm tra Node.js & MySQL
- ✅ Tạo database & import schema
- ✅ Cài đặt dependencies (backend & frontend)
- ✅ Copy file .env từ .env.example
- ✅ Chạy migrations
- ✅ Seed dữ liệu mẫu
- ✅ Start cả backend & frontend

#### macOS/Linux (Bash)
```bash
chmod +x setup.sh
./setup.sh
```

---

### Option 2: Manual Setup (Step by Step)

#### Bước 1: Clone Repository
```bash
git clone https://github.com/nguyendat-d/Manage_bus_tickets.git
cd Manage_bus_tickets
```

#### Bước 2: Setup Database

**A. Sử dụng MySQL Command Line**
```bash
# Login vào MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE bus_ticket_management;
USE bus_ticket_management;

# Import schema
source backend/database/schema.sql;

# Import sample data (optional)
source backend/database/sample_data.sql;
```

**B. Sử dụng MySQL Workbench**
1. Mở MySQL Workbench
2. Connect vào MySQL server
3. File → Run SQL Script → Chọn `backend/database/schema.sql`
4. Execute
5. Repeat với `backend/database/sample_data.sql`

#### Bước 3: Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Copy environment file
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
nano .env  # hoặc notepad .env trên Windows
```

**File .env:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3001

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bus_ticket_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# VNPay Configuration
VNP_TMN_CODE=your_vnpay_terminal_code
VNP_HASH_SECRET=your_vnpay_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5000/api/payments/vnpay-return
VNP_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

**Chạy Backend:**
```bash
# Development mode (với hot-reload)
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

#### Bước 4: Setup Frontend

**Terminal mới:**
```bash
cd frontend

# Cài đặt dependencies
npm install

# Copy environment file
cp .env.example .env

# Chỉnh sửa .env
nano .env
```

**File .env:**
```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

**Chạy Frontend:**
```bash
# Development mode (với hot-reload)
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

Frontend sẽ chạy tại: **http://localhost:3001**

---

### Option 3: Docker Compose (Containerized)

#### Yêu Cầu
- Docker Desktop >= 20.10
- Docker Compose >= 2.0

#### Chạy Tất Cả Services
```bash
# Build và start tất cả containers
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop tất cả containers
docker-compose down

# Stop và xóa volumes (data)
docker-compose down -v
```

#### Services Available
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Adminer** (DB GUI): http://localhost:8080
  - System: MySQL
  - Server: db
  - Username: root
  - Password: thanhdat12345
  - Database: bus_ticket_management

#### Docker Compose Configuration
```yaml
version: "3.8"
services:
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: thanhdat12345
      MYSQL_DATABASE: bus_ticket_management
    volumes:
      - db_data:/var/lib/mysql
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./backend/database/sample_data.sql:/docker-entrypoint-initdb.d/2-data.sql
    
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_USER: root
      DB_PASSWORD: thanhdat12345
      DB_NAME: bus_ticket_management
    
  frontend:
    build: ./frontend
    ports:
      - "3001:3001"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:5000/api

volumes:
  db_data:
```

---

### Kiểm Tra Cài Đặt

#### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Response should be:
# {"status": "OK", "message": "Server is running"}
```

#### 2. Test Database Connection
```bash
# Login to MySQL
mysql -u root -p bus_ticket_management

# Check tables
SHOW TABLES;

# Should show: users, bus_companies, routes, buses, trips, bookings, payments
```

#### 3. Test Frontend
- Mở browser: http://localhost:3001
- Trang homepage phải load không lỗi
- Click "Đăng nhập" → Form login phải hiện

---

### Tạo Admin Account

```bash
cd backend
node create-admin.js
```

Hoặc manual:
```sql
INSERT INTO users (email, password_hash, full_name, role, email_verified, status)
VALUES (
  'admin@bus.com',
  '$2a$10$ExampleHashForTesting',  -- Thay bằng hash thật
  'System Administrator',
  'admin',
  TRUE,
  'active'
);
```

**Default Admin Credentials** (nếu dùng sample_data.sql):
- Email: `admin@bus.com`
- Password: `Admin123456`

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication
Tất cả protected routes yêu cầu JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Đăng ký user mới | ❌ |
| POST | `/login` | Đăng nhập | ❌ |
| POST | `/logout` | Đăng xuất | ✅ |
| POST | `/forgot-password` | Quên mật khẩu | ❌ |
| POST | `/reset-password` | Reset mật khẩu | ❌ |
| GET | `/verify` | Verify JWT token | ✅ |
| POST | `/register-bus-company` | Đăng ký nhà xe | ❌ |

**Example: Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "passenger"
}

Response 201:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "role": "passenger"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 🚌 Trips (`/api/trips`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/search` | Tìm kiếm chuyến xe | ❌ |
| GET | `/routes` | Danh sách tuyến đường | ❌ |
| GET | `/featured` | Chuyến xe nổi bật | ❌ |
| GET | `/:id` | Chi tiết chuyến xe | ❌ |
| POST | `/` | Tạo chuyến mới | ✅ (Bus Company) |
| PUT | `/:id` | Cập nhật chuyến | ✅ (Bus Company) |
| DELETE | `/:id` | Xóa chuyến | ✅ (Bus Company) |

**Example: Search Trips**
```http
GET /api/trips/search?from=Hà Nội&to=Hải Phòng&date=2025-12-15&sort=price

Response 200:
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": 34,
        "departure_city": "Hà Nội",
        "arrival_city": "Hải Phòng",
        "departure_time": "2025-12-15T07:00:00",
        "arrival_time": "2025-12-15T09:00:00",
        "price": 150000,
        "available_seats": 25,
        "bus_type": "limousine",
        "company_name": "Hoàng Long",
        "rating": 4.5
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10
  }
}
```

#### 🎫 Bookings (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Danh sách booking của user | ✅ (Passenger) |
| GET | `/:id` | Chi tiết booking | ✅ |
| POST | `/` | Tạo booking mới | ✅ (Passenger) |
| PUT | `/:id/cancel` | Hủy booking | ✅ (Passenger) |
| PUT | `/:id/complete` | Hoàn thành chuyến | ✅ (Passenger) |
| GET | `/:id/qr` | Download QR code | ✅ |

**Example: Create Booking**
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "trip_id": 34,
  "seat_numbers": ["A1", "A2"],
  "passenger_info": {
    "name": "Nguyễn Văn A",
    "phone": "0123456789",
    "email": "user@example.com",
    "id_number": "001234567890"
  },
  "payment_method": "vnpay"
}

Response 201:
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "id": 25,
      "booking_code": "BK17653586558702XCIS",
      "total_amount": 300000,
      "payment_status": "pending",
      "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
    }
  }
}
```

**Example: Cancel Booking**
```http
PUT /api/bookings/25/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancellation_reason": "Thay đổi lịch trình"
}

Response 200:
{
  "success": true,
  "message": "Hủy vé thành công. Tiền sẽ được hoàn lại trong 3-5 ngày.",
  "data": {
    "refund_amount": 240000,  // 80% hoàn tiền (nếu hủy trước 24h)
    "cancellation_fee": 60000
  }
}

Error 400:
{
  "success": false,
  "message": "Chỉ được hủy vé trước 24 giờ khởi hành"
}
```

#### 💳 Payments (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/vnpay-callback` | VNPay callback sau thanh toán | ❌ |
| POST | `/process` | Xử lý thanh toán | ✅ |
| GET | `/:bookingId` | Thông tin thanh toán | ✅ |
| POST | `/refund` | Hoàn tiền | ✅ (Admin) |

**Example: VNPay Callback**
```http
GET /api/payments/vnpay-callback?vnp_Amount=30000000&vnp_BankCode=NCB&vnp_ResponseCode=00&vnp_TxnRef=BK25&vnp_SecureHash=...

Response: Redirect to
- Success: http://localhost:3001/payment/success?booking_id=25
- Failed: http://localhost:3001/payment/failed?booking_id=25
```

#### 👤 Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Thông tin profile | ✅ |
| PUT | `/profile` | Cập nhật profile | ✅ |
| PUT | `/change-password` | Đổi mật khẩu | ✅ |
| POST | `/avatar` | Upload avatar | ✅ |
| GET | `/bookings` | Lịch sử đặt vé | ✅ |

**Example: Update Profile**
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "full_name": "Nguyễn Văn B",
  "phone": "0987654321",
  "avatar": <file>
}

Response 200:
{
  "success": true,
  "message": "Cập nhật thành công",
  "data": {
    "id": 1,
    "full_name": "Nguyễn Văn B",
    "phone": "0987654321",
    "avatar_url": "https://res.cloudinary.com/.../avatar.jpg"
  }
}
```

#### 🚍 Bus Companies (`/api/bus-companies`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Đăng ký nhà xe | ✅ (User) |
| GET | `/profile` | Thông tin nhà xe | ✅ (Bus Company) |
| PUT | `/profile` | Cập nhật profile | ✅ (Bus Company) |
| POST | `/buses` | Thêm xe mới | ✅ (Bus Company) |
| GET | `/buses` | Danh sách xe | ✅ (Bus Company) |
| POST | `/routes` | Thêm tuyến đường | ✅ (Bus Company) |
| GET | `/trips` | Danh sách chuyến xe | ✅ (Bus Company) |
| POST | `/trips` | Tạo chuyến mới | ✅ (Bus Company) |
| PUT | `/trips/:id` | Cập nhật chuyến | ✅ (Bus Company) |
| GET | `/bookings` | Danh sách booking | ✅ (Bus Company) |
| GET | `/analytics` | Thống kê doanh thu | ✅ (Bus Company) |

**Example: Register Bus Company**
```http
POST /api/bus-companies/register
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "company_name": "Nhà Xe Hoàng Long",
  "tax_code": "0123456789",
  "phone": "0901234567",
  "email": "contact@hoanglong.com",
  "address": "123 Phố Huế, Hà Nội",
  "description": "Nhà xe uy tín 20 năm",
  "business_license": <file>,      // Giấy phép KD
  "vehicle_registration": <file>   // Đăng ký xe
}

Response 201:
{
  "success": true,
  "message": "Đăng ký thành công. Vui lòng chờ admin phê duyệt.",
  "data": {
    "id": 1,
    "company_name": "Nhà Xe Hoàng Long",
    "status": "pending"
  }
}
```

**Example: Create Trip**
```http
POST /api/bus-companies/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "route_id": 1,
  "bus_id": 5,
  "departure_time": "2024-12-15T08:00:00",
  "arrival_time": "2024-12-15T10:00:00",
  "price": 250000
}

Response 201:
{
  "success": true,
  "message": "Tạo chuyến xe thành công",
  "data": {
    "id": 100,
    "departure_time": "2024-12-15T08:00:00",
    "price": 250000,
    "available_seats": 30
  }
}
```

#### 👨‍💼 Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Danh sách users | ✅ (Admin) |
| PUT | `/users/:id/status` | Cập nhật trạng thái user | ✅ (Admin) |
| DELETE | `/users/:id` | Xóa user | ✅ (Admin) |
| GET | `/bus-companies` | Danh sách nhà xe | ✅ (Admin) |
| GET | `/bus-companies/pending` | Nhà xe chờ duyệt | ✅ (Admin) |
| PUT | `/bus-companies/:id/approve` | Phê duyệt nhà xe | ✅ (Admin) |
| PUT | `/bus-companies/:id/reject` | Từ chối nhà xe | ✅ (Admin) |
| GET | `/bookings` | Tất cả bookings | ✅ (Admin) |
| GET | `/analytics` | Thống kê hệ thống | ✅ (Admin) |
| GET | `/revenue` | Báo cáo doanh thu | ✅ (Admin) |

**Example: Approve Bus Company**
```http
PUT /api/admin/bus-companies/1/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "note": "Đủ điều kiện hoạt động"
}

Response 200:
{
  "success": true,
  "message": "Phê duyệt nhà xe thành công"
}
```

**Example: System Analytics**
```http
GET /api/admin/analytics?from_date=2024-01-01&to_date=2024-12-31
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "total_users": 1500,
    "total_bus_companies": 50,
    "total_trips": 5000,
    "total_bookings": 12000,
    "total_revenue": 60000000000,
    "bookings_by_status": {
      "confirmed": 10000,
      "cancelled": 1500,
      "completed": 500
    },
    "revenue_by_month": [
      {"month": "2024-01", "revenue": 5000000000},
      {"month": "2024-02", "revenue": 5500000000}
    ],
    "top_routes": [
      {"route": "Hà Nội - Hải Phòng", "bookings": 1200},
      {"route": "TP.HCM - Vũng Tàu", "bookings": 1000}
    ]
  }
}
```

---

### Error Responses

All API errors follow this format:
```json
{
  "success": false,
  "message": "Human-readable error message in Vietnamese",
  "error": "Technical error details (only in development mode)"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input / Validation error
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions (wrong role)
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (email, booking code, etc.)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

**Example Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Mật khẩu phải có ít nhất 6 ký tự, bao gồm: chữ in hoa, chữ in thường, số và ký tự đặc biệt"
    },
    {
      "field": "phone",
      "message": "Số điện thoại không hợp lệ"
    }
  ]
}
```


| GET | `/payments` | Tất cả payments | ✅ (Admin) |

**Example: Analytics**
```http
GET /api/admin/analytics
Authorization: Bearer <admin_token>

Response 200:
{
  "success": true,
  "data": {
    "overview": {
      "total_users": 1250,
      "total_bookings": 3480,
      "total_revenue": 523500000,
      "active_trips": 45
    },
    "revenue_by_month": [
      {"month": "2025-01", "revenue": 45000000},
      {"month": "2025-02", "revenue": 52000000}
    ],
    "top_routes": [
      {"route": "Hà Nội - Hải Phòng", "bookings": 320},
      {"route": "HCM - Vũng Tàu", "bookings": 280}
    ],
    "booking_trends": {
      "this_week": 156,
      "last_week": 142,
      "growth": "+9.8%"
    }
  }
}
```

---

## 🔐 Bảo Mật

### Authentication & Authorization

#### JWT (JSON Web Tokens)
- **Algorithm**: HS256
- **Expiration**: 7 days (configurable)
- **Refresh Token**: Tự động renew khi còn > 1 ngày
- **Storage**: LocalStorage (frontend), Memory (backend)
- **Stateless**: Không lưu session trên server

```javascript
// JWT Payload Structure
{
  "id": 123,
  "email": "user@example.com",
  "role": "passenger",
  "iat": 1701936000,
  "exp": 1702540800
}
```

#### Password Security
- **Hashing Algorithm**: bcryptjs
- **Salt Rounds**: 10
- **Password Requirements**:
  - Minimum 6 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&*(),.?":{}|<>)
- **Regex Pattern**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/`

#### Role-Based Access Control (RBAC)
```javascript
// 3 Roles trong hệ thống
const ROLES = {
  PASSENGER: 'passenger',      // Hành khách
  BUS_COMPANY: 'bus_company',  // Nhà xe
  ADMIN: 'admin'               // Quản trị viên
};

// Middleware kiểm tra role
router.get('/admin/users', 
  auth.authenticate,           // Kiểm tra token
  auth.authorizeAdmin,         // Chỉ admin
  adminController.getUsers
);

router.post('/bus-companies/trips',
  auth.authenticate,
  auth.authorizeBusCompanyOrAdmin,  // Nhà xe hoặc admin
  busCompanyController.createTrip
);
```

---

### Input Validation

#### Joi Schema Validation
```javascript
// Validation cho register
const registerSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .required()
    .messages({
      'string.pattern.base': 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm: chữ in hoa, chữ in thường, số và ký tự đặc biệt',
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
    }),
  full_name: Joi.string().min(2).max(255).required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  role: Joi.string().valid('passenger', 'bus_company').required()
});
```

**Validated Fields:**
- Email format
- Phone number (10-11 digits)
- Seat numbers (JSON array)
- Payment methods (ENUM values)
- Price ranges (min, max)
- Dates (ISO 8601 format)

---

### Rate Limiting

#### Configuration
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 500,                   // Limit: 500 requests per windowMs
  message: 'Quá nhiều requests từ IP này, vui lòng thử lại sau',
  standardHeaders: true,      // Return rate limit info in headers
  legacyHeaders: false
});

// Specific limits cho login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true // Không đếm request thành công
});
```

**Rate Limits:**
- General API: 500 requests / 15 minutes
- Login endpoint: 5 attempts / 15 minutes
- Register endpoint: 3 attempts / hour
- Payment endpoint: 10 requests / minute

---

### SQL Injection Prevention

#### Parameterized Queries
```javascript
// ❌ UNSAFE - Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ SAFE - Parameterized query
const query = `SELECT * FROM users WHERE email = ?`;
const [rows] = await connection.execute(query, [email]);
```

**All queries use:**
- Prepared statements
- Parameter binding
- No string concatenation
- mysql2 library với built-in protection

---

### CORS Configuration

```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
```

---

### Security Headers (Helmet)

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"]
    }
  },
  hsts: {
    maxAge: 31536000,           // 1 year
    includeSubDomains: true,
    preload: true
  }
}));
```

**Headers Added:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: ...`

---

### XSS Protection

#### Frontend
```javascript
// Sanitize user input
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// React automatically escapes JSX
<div>{userInput}</div>  // Safe - Auto-escaped
```

#### Backend
```javascript
// HTML entities encoding
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

---

### File Upload Security

```javascript
const upload = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép ảnh
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ chấp nhận file ảnh'), false);
    }
    
    // Kiểm tra extension
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Extension không được phép'), false);
    }
    
    cb(null, true);
  }
});
```

**Upload Restrictions:**
- File size: Max 5MB
- File types: Images only (jpg, jpeg, png, gif, webp)
- Virus scan: Cloudinary built-in
- Storage: Cloudinary CDN (không lưu local)

---

### Environment Variables

```bash
# .env file - NEVER commit to git
NODE_ENV=production
JWT_SECRET=super_random_secret_key_at_least_32_chars
DB_PASSWORD=strong_database_password_here
CLOUDINARY_API_SECRET=cloudinary_secret_key
VNP_HASH_SECRET=vnpay_hash_secret_key
```

**Best Practices:**
- ✅ Use strong random secrets
- ✅ Different secrets per environment
- ✅ Never hardcode secrets
- ✅ Rotate secrets regularly
- ✅ Use environment-specific .env files
- ✅ Add .env to .gitignore

---

### Payment Security (VNPay)

#### HMAC-SHA512 Signature
```javascript
// Sign request
const signData = Object.keys(params)
  .sort()
  .map(key => `${key}=${params[key]}`)
  .join('&');

const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET);
const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

// Verify response
const vnpSecureHash = req.query.vnp_SecureHash;
const calculatedHash = calculateHash(req.query);

if (vnpSecureHash !== calculatedHash) {
  throw new Error('Invalid signature');
}
```

---

### Database Security

#### Connection Pooling
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,        // Max 10 connections
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
```

#### Transaction Safety
```javascript
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();
  
  // Multiple queries...
  await connection.execute(query1, params1);
  await connection.execute(query2, params2);
  
  await connection.commit();
} catch (error) {
  await connection.rollback();  // Rollback on error
  throw error;
} finally {
  connection.release();         // Always release connection
}
```

---

### Security Checklist

#### Đã Implement
- ✅ JWT authentication với expiration
- ✅ Password hashing với bcrypt (10 rounds)
- ✅ Input validation với Joi
- ✅ Rate limiting (general & endpoint-specific)
- ✅ CORS configuration
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (input sanitization)
- ✅ Security headers (Helmet)
- ✅ File upload restrictions
- ✅ HTTPS ready (production)
- ✅ Environment variables management
- ✅ Payment signature verification
- ✅ Database transactions
- ✅ Connection pooling
- ✅ Error handling (không expose stack traces)
- ✅ Logging (Morgan for access logs)

#### Recommended for Production
- 🔄 Enable HTTPS/TLS
- 🔄 Use Redis for rate limiting
- 🔄 Implement 2FA (Two-Factor Authentication)
- 🔄 Add API versioning (/api/v1/...)
- 🔄 Setup monitoring (Sentry, LogRocket)
- 🔄 Regular security audits
- 🔄 Dependency vulnerability scanning
- 🔄 OWASP compliance testing

---

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

---

## 🗄️ Database Schema

### Database: `bus_ticket_management`

#### ER Diagram Relationships
```
users (1) ----< (N) bookings
users (1) ----< (1) bus_companies
bus_companies (1) ----< (N) buses
bus_companies (1) ----< (N) routes
routes (1) ----< (N) trips
buses (1) ----< (N) trips
trips (1) ----< (N) bookings
bookings (1) ----< (1) payments
```

---

### 📋 Table: `users`

**Description:** Quản lý tất cả người dùng (Passenger, Bus Company, Admin)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | User ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu đã hash (bcrypt) |
| `full_name` | VARCHAR(255) | NOT NULL | Họ tên đầy đủ |
| `phone` | VARCHAR(20) | NULL | Số điện thoại |
| `avatar_url` | TEXT | NULL | Link ảnh đại diện (Cloudinary) |
| `role` | ENUM | 'passenger', 'bus_company', 'admin' | Vai trò |
| `status` | ENUM | 'active', 'inactive', 'suspended' | Trạng thái tài khoản |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

**Indexes:**
- `idx_users_email` ON (email)
- `idx_users_role` ON (role)

**Sample Data:**
```sql
-- Admin account
INSERT INTO users VALUES (1, 'admin@bus.com', '$2a$10$...', 'Admin System', '0901234567', NULL, 'admin', 'active', NOW(), NOW());

-- Test passenger
INSERT INTO users VALUES (2, 'test@gmail.com', '$2a$10$...', 'Nguyễn Văn A', '0912345678', NULL, 'passenger', 'active', NOW(), NOW());
```

---

### 🏢 Table: `bus_companies`

**Description:** Thông tin các nhà xe đã đăng ký

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Company ID |
| `user_id` | INT | FOREIGN KEY → users(id), UNIQUE | User tạo company |
| `company_name` | VARCHAR(255) | NOT NULL | Tên nhà xe |
| `tax_code` | VARCHAR(50) | UNIQUE, NOT NULL | Mã số thuế |
| `phone` | VARCHAR(20) | NOT NULL | Hotline |
| `email` | VARCHAR(255) | NULL | Email liên hệ |
| `address` | TEXT | NULL | Địa chỉ trụ sở |
| `description` | TEXT | NULL | Mô tả nhà xe |
| `logo_url` | TEXT | NULL | Link logo (Cloudinary) |
| `documents` | JSON | NULL | Giấy tờ (business_license, vehicle_registration) |
| `status` | ENUM | 'pending', 'approved', 'rejected' | Trạng thái phê duyệt |
| `rating` | DECIMAL(3,2) | DEFAULT 0.00 | Đánh giá trung bình (0-5) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày đăng ký |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### 🛣️ Table: `routes`

**Description:** Các tuyến đường xe chạy

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Route ID |
| `bus_company_id` | INT | FOREIGN KEY → bus_companies(id) | Nhà xe quản lý |
| `departure_city` | VARCHAR(100) | NOT NULL | Thành phố đi |
| `departure_station` | VARCHAR(255) | NOT NULL | Bến xe đi |
| `arrival_city` | VARCHAR(100) | NOT NULL | Thành phố đến |
| `arrival_station` | VARCHAR(255) | NOT NULL | Bến xe đến |
| `distance_km` | INT | NOT NULL | Khoảng cách (km) |
| `estimated_duration_hours` | DECIMAL(4,2) | NULL | Thời gian dự kiến (giờ) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |

**Foreign Keys:**
- `bus_company_id` REFERENCES `bus_companies(id)` ON DELETE CASCADE

**Example:**
```sql
INSERT INTO routes VALUES (1, 1, 'Hà Nội', 'Bến Xe Mỹ Đình', 'Hải Phòng', 'Bến Xe Lạch Tray', 120, 2.5, NOW());
```

---

### 🚌 Table: `buses`

**Description:** Danh sách xe của nhà xe

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Bus ID |
| `bus_company_id` | INT | FOREIGN KEY → bus_companies(id) | Nhà xe sở hữu |
| `license_plate` | VARCHAR(20) | UNIQUE, NOT NULL | Biển số xe |
| `bus_type` | ENUM | 'limousine', 'giường nằm', 'ghế ngồi' | Loại xe |
| `total_seats` | INT | NOT NULL | Tổng số ghế |
| `seat_map` | JSON | NULL | Sơ đồ ghế |
| `amenities` | JSON | NULL | Tiện ích ['wifi', 'ac', 'blanket', 'usb'] |
| `year_of_manufacture` | YEAR | NULL | Năm sản xuất |
| `status` | ENUM | 'active', 'maintenance', 'inactive' | Trạng thái |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày thêm |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

**Foreign Keys:**
- `bus_company_id` REFERENCES `bus_companies(id)` ON DELETE CASCADE

**Seat Map Example:**
```json
{
  "rows": 5,
  "cols": 6,
  "seats": [
    {"id": "A1", "row": 1, "col": 1, "type": "normal"},
    {"id": "A2", "row": 1, "col": 2, "type": "vip"},
    {"id": "D", "row": 0, "col": 0, "type": "driver"}
  ]
}
```

---

### 🚍 Table: `trips`

**Description:** Chuyến xe cụ thể (instance của route + bus + time)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Trip ID |
| `bus_company_id` | INT | FOREIGN KEY → bus_companies(id) | Nhà xe |
| `route_id` | INT | FOREIGN KEY → routes(id) | Tuyến đường |
| `bus_id` | INT | FOREIGN KEY → buses(id) | Xe chạy |
| `departure_time` | DATETIME | NOT NULL | Giờ khởi hành |
| `arrival_time` | DATETIME | NOT NULL | Giờ đến (dự kiến) |
| `price` | DECIMAL(10,2) | NOT NULL | Giá vé (VNĐ) |
| `available_seats` | INT | NOT NULL | Số ghế còn trống |
| `status` | ENUM | 'scheduled', 'departed', 'arrived', 'cancelled' | Trạng thái chuyến |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

**Foreign Keys:**
- `bus_company_id` REFERENCES `bus_companies(id)` ON DELETE CASCADE
- `route_id` REFERENCES `routes(id)` ON DELETE CASCADE
- `bus_id` REFERENCES `buses(id)` ON DELETE CASCADE

**Indexes:**
- `idx_trips_departure_time` ON (departure_time)
- `idx_trips_status` ON (status)

---

### 🎫 Table: `bookings`

**Description:** Đặt vé của khách hàng

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Booking ID |
| `user_id` | INT | FOREIGN KEY → users(id) | Người đặt vé |
| `trip_id` | INT | FOREIGN KEY → trips(id) | Chuyến xe |
| `booking_code` | VARCHAR(50) | UNIQUE, NOT NULL | Mã đặt vé (BK...) |
| `passenger_info` | JSON | NOT NULL | Thông tin hành khách |
| `seat_numbers` | JSON | NOT NULL | Ghế đã đặt ['A1', 'A2'] |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Tổng tiền (VNĐ) |
| `payment_status` | ENUM | 'pending', 'paid', 'failed', 'refunded' | Trạng thái thanh toán |
| `booking_status` | ENUM | 'confirmed', 'cancelled', 'completed' | Trạng thái booking |
| `qr_code_url` | TEXT | NULL | Link QR code (Cloudinary) |
| `cancellation_reason` | TEXT | NULL | Lý do hủy |
| `cancelled_at` | TIMESTAMP | NULL | Thời gian hủy |
| `completed_at` | TIMESTAMP | NULL | Thời gian hoàn thành |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày đặt |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- `trip_id` REFERENCES `trips(id)` ON DELETE CASCADE

**Indexes:**
- `idx_bookings_booking_code` ON (booking_code)
- `idx_bookings_user_id` ON (user_id)
- `idx_bookings_payment_status` ON (payment_status)

**Passenger Info JSON:**
```json
{
  "full_name": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "user@example.com",
  "id_card": "001234567890"
}
```

**Cancellation Rules:**
- Hủy trước 24h: Hoàn 80% tiền vé
- Hủy trước 12h: Hoàn 50% tiền vé
- Hủy trong 12h: Không hoàn tiền

---

### 💳 Table: `payments`

**Description:** Lịch sử thanh toán

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Payment ID |
| `booking_id` | INT | FOREIGN KEY → bookings(id), UNIQUE | Booking được thanh toán |
| `payment_method` | ENUM | 'vnpay', 'momo', 'cash' | Phương thức thanh toán |
| `amount` | DECIMAL(10,2) | NOT NULL | Số tiền (VNĐ) |
| `transaction_id` | VARCHAR(255) | NULL | ID giao dịch từ gateway |
| `payment_status` | ENUM | 'pending', 'success', 'failed' | Trạng thái thanh toán |
| `vnpay_response` | JSON | NULL | Response từ VNPay |
| `paid_at` | TIMESTAMP | NULL | Thời gian thanh toán thành công |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

**Foreign Keys:**
- `booking_id` REFERENCES `bookings(id)` ON DELETE CASCADE

**VNPay Response JSON:**
```json
{
  "vnp_Amount": "30000000",
  "vnp_BankCode": "NCB",
  "vnp_CardType": "ATM",
  "vnp_ResponseCode": "00",
  "vnp_TxnRef": "BK25",
  "vnp_TransactionNo": "14368566",
  "vnp_PayDate": "20240115103000"
}
```

---

### 🔑 Database Constraints Summary

**Primary Keys:** All tables have `id` as PRIMARY KEY with AUTO_INCREMENT

**Foreign Keys (Cascade Delete):**
```sql
bus_companies.user_id → users.id
routes.bus_company_id → bus_companies.id
buses.bus_company_id → bus_companies.id
trips.bus_company_id → bus_companies.id
trips.route_id → routes.id
trips.bus_id → buses.id
bookings.user_id → users.id
bookings.trip_id → trips.id
payments.booking_id → bookings.id
```

**Unique Constraints:**
- users.email
- bus_companies.user_id
- bus_companies.tax_code
- buses.license_plate
- bookings.booking_code
- payments.booking_id

**ENUM Constraints:**
```sql
users.role: ('passenger', 'bus_company', 'admin')
users.status: ('active', 'inactive', 'suspended')
bus_companies.status: ('pending', 'approved', 'rejected')
buses.bus_type: ('limousine', 'giường nằm', 'ghế ngồi')
buses.status: ('active', 'maintenance', 'inactive')
trips.status: ('scheduled', 'departed', 'arrived', 'cancelled')
bookings.payment_status: ('pending', 'paid', 'failed', 'refunded')
bookings.booking_status: ('confirmed', 'cancelled', 'completed')
payments.payment_method: ('vnpay', 'momo', 'cash')
payments.payment_status: ('pending', 'success', 'failed')
```

---

### 📊 Database Statistics

**Total Tables:** 7
**Total Indexes:** 5
**Total Foreign Keys:** 9
**Total ENUM Types:** 9

**Storage Engine:** InnoDB (supports transactions, foreign keys)
**Character Set:** utf8mb4 (supports emojis, Vietnamese characters)
**Collation:** utf8mb4_unicode_ci

---

## 🚀 Deployment

### Deployment Options

Project này có thể deploy lên nhiều nền tảng khác nhau:

---

### 🐳 Docker Deployment (Recommended)

#### 1. Build Docker Images

**Backend:**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "app.js"]
```

**Frontend:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Docker Compose (Full Stack)

```bash
# Build và start tất cả services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: bus_ticket_management
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root_password
      DB_NAME: bus_ticket_management
      JWT_SECRET: your_jwt_secret
      NODE_ENV: production
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "3001:80"
    environment:
      VITE_API_URL: http://localhost:5000/api
    depends_on:
      - backend

volumes:
  mysql_data:
```

---

### ☁️ Heroku Deployment

#### 1. Prepare Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create bus-ticket-backend
heroku create bus-ticket-frontend
```

#### 2. Add MySQL Database

```bash
# Add ClearDB MySQL addon
heroku addons:create cleardb:ignite -a bus-ticket-backend

# Get database URL
heroku config:get CLEARDB_DATABASE_URL -a bus-ticket-backend
```

#### 3. Configure Environment Variables

```bash
heroku config:set JWT_SECRET="your_secret_key" -a bus-ticket-backend
heroku config:set NODE_ENV=production -a bus-ticket-backend
heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud" -a bus-ticket-backend
heroku config:set CLOUDINARY_API_KEY="your_key" -a bus-ticket-backend
heroku config:set CLOUDINARY_API_SECRET="your_secret" -a bus-ticket-backend
heroku config:set VNP_TMN_CODE="your_vnpay_code" -a bus-ticket-backend
heroku config:set VNP_HASH_SECRET="your_vnpay_secret" -a bus-ticket-backend
```

#### 4. Deploy Backend

```bash
cd backend
git init
heroku git:remote -a bus-ticket-backend
git add .
git commit -m "Deploy backend"
git push heroku main
```

#### 5. Deploy Frontend

```bash
cd frontend

# Update .env.production
echo "VITE_API_URL=https://bus-ticket-backend.herokuapp.com/api" > .env.production

heroku git:remote -a bus-ticket-frontend
git add .
git commit -m "Deploy frontend"
git push heroku main
```

#### 6. Initialize Database

```bash
# Connect to MySQL and run schema.sql
heroku run bash -a bus-ticket-backend
mysql -h hostname -u username -p database_name < database/schema.sql
```

---

### 🌐 AWS Deployment

#### Architecture:
- **Frontend:** S3 + CloudFront
- **Backend:** EC2 / ECS / Lambda
- **Database:** RDS MySQL
- **File Storage:** S3 (replace Cloudinary)

#### 1. Setup RDS MySQL

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier bus-ticket-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourPassword123 \
  --allocated-storage 20
```

#### 2. Deploy Backend to EC2

```bash
# SSH vào EC2 instance
ssh -i key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repo
git clone https://github.com/your-repo/bus-ticket.git
cd bus-ticket/backend

# Install dependencies
npm ci --only=production

# Configure .env
cat > .env << EOF
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=YourPassword123
DB_NAME=bus_ticket_management
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production
EOF

# Start with PM2
npm install -g pm2
pm2 start app.js --name bus-ticket-backend
pm2 startup
pm2 save
```

#### 3. Deploy Frontend to S3 + CloudFront

```bash
cd frontend

# Build production
npm run build

# Upload to S3
aws s3 sync dist/ s3://bus-ticket-frontend --delete

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name bus-ticket-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

---

### 🔵 Azure Deployment

#### 1. Create Azure Resources

```bash
# Install Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name bus-ticket-rg --location eastasia

# Create MySQL database
az mysql server create \
  --resource-group bus-ticket-rg \
  --name bus-ticket-mysql \
  --admin-user adminuser \
  --admin-password YourPassword123! \
  --sku-name B_Gen5_1

# Create database
az mysql db create \
  --resource-group bus-ticket-rg \
  --server-name bus-ticket-mysql \
  --name bus_ticket_management
```

#### 2. Deploy Backend to Azure App Service

```bash
# Create App Service plan
az appservice plan create \
  --name bus-ticket-plan \
  --resource-group bus-ticket-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group bus-ticket-rg \
  --plan bus-ticket-plan \
  --name bus-ticket-backend \
  --runtime "NODE|18-lts"

# Configure environment
az webapp config appsettings set \
  --resource-group bus-ticket-rg \
  --name bus-ticket-backend \
  --settings DB_HOST=bus-ticket-mysql.mysql.database.azure.com \
             DB_USER=adminuser@bus-ticket-mysql \
             DB_PASSWORD=YourPassword123! \
             JWT_SECRET=your_jwt_secret \
             NODE_ENV=production

# Deploy code
cd backend
zip -r backend.zip .
az webapp deployment source config-zip \
  --resource-group bus-ticket-rg \
  --name bus-ticket-backend \
  --src backend.zip
```

#### 3. Deploy Frontend to Azure Static Web Apps

```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build frontend
cd frontend
npm run build

# Deploy
swa deploy ./dist \
  --app-name bus-ticket-frontend \
  --resource-group bus-ticket-rg \
  --env production
```

---

### 🔧 Production Checklist

#### Security
- [ ] Đổi tất cả passwords/secrets mặc định
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS cho production domain
- [ ] Enable rate limiting
- [ ] Setup firewall rules
- [ ] Disable debug mode (NODE_ENV=production)
- [ ] Remove console.log statements

#### Database
- [ ] Import schema.sql vào production database
- [ ] Create admin account
- [ ] Setup database backups (daily)
- [ ] Configure connection pooling
- [ ] Enable slow query log
- [ ] Create database indexes

#### Monitoring
- [ ] Setup application monitoring (New Relic, Datadog)
- [ ] Configure error tracking (Sentry)
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Enable access logs
- [ ] Configure CloudWatch/Application Insights

#### Performance
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Optimize images (Cloudinary auto-optimization)
- [ ] Enable browser caching
- [ ] Minify JS/CSS (Vite build)

#### Backup
- [ ] Database backup strategy
- [ ] Code repository backup
- [ ] Environment variables backup
- [ ] SSL certificates backup

---

### 📊 Post-Deployment Testing

```bash
# Test backend health
curl https://your-backend-url/api/health

# Test frontend
curl https://your-frontend-url

# Test database connection
curl https://your-backend-url/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","full_name":"Test User","role":"passenger"}'

# Test VNPay integration
# Tạo booking và test payment flow end-to-end
```

---

### 🔄 CI/CD Pipeline (GitHub Actions)

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd backend && npm ci && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "bus-ticket-backend"
          heroku_email: "your-email@example.com"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: cd frontend && npm ci && npm run build
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{secrets.AWS_ACCESS_KEY_ID}}
          aws-secret-access-key: ${{secrets.AWS_SECRET_ACCESS_KEY}}
          aws-region: ap-southeast-1
      - run: aws s3 sync frontend/dist/ s3://bus-ticket-frontend --delete
```

---

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Backend không kết nối được database

**Lỗi:** `ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'`

**Giải pháp:**
```bash
# Kiểm tra MySQL service đang chạy
# Windows:
Get-Service MySQL80

# Linux/Mac:
sudo systemctl status mysql

# Kiểm tra credentials trong .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password  # Đảm bảo password đúng
DB_NAME=bus_ticket_management

# Test connection
mysql -u root -p
```

---

#### 2. Port 5000 đã được sử dụng

**Lỗi:** `Error: listen EADDRINUSE: address already in use :::5000`

**Giải pháp:**
```powershell
# Windows PowerShell - Tìm process đang dùng port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property State, OwningProcess
taskkill /PID <process_id> /F

# Hoặc đổi port trong backend/.env
PORT=5001
```

---

#### 3. Frontend không gọi được API

**Lỗi:** `NetworkError: Failed to fetch` hoặc CORS error

**Giải pháp:**
```javascript
// 1. Kiểm tra VITE_API_URL trong frontend/.env
VITE_API_URL=http://localhost:5000/api

// 2. Kiểm tra CORS trong backend/app.js
const corsOptions = {
  origin: 'http://localhost:3001',  // Frontend URL
  credentials: true
};
app.use(cors(corsOptions));

// 3. Restart cả backend và frontend
```

---

#### 4. Database schema chưa được tạo

**Lỗi:** `ER_NO_SUCH_TABLE: Table 'bus_ticket_management.users' doesn't exist`

**Giải pháp:**
```bash
# Import schema vào database
mysql -u root -p bus_ticket_management < backend/database/schema.sql

# Hoặc dùng script PowerShell
cd scripts
.\create_database.ps1
```

---

#### 5. VNPay payment không hoạt động

**Lỗi:** `Payment failed` hoặc invalid signature

**Giải pháp:**
```bash
# 1. Kiểm tra VNPay credentials trong backend/.env
VNP_TMN_CODE=your_vnpay_merchant_code
VNP_HASH_SECRET=your_vnpay_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html  # Sandbox
VNP_RETURN_URL=http://localhost:5000/api/payments/vnpay-callback

# 2. Đảm bảo đang dùng sandbox environment
# 3. Test với test card: 9704198526191432198
# 4. Kiểm tra logs trong backend console
```

---

#### 6. Upload ảnh thất bại (Cloudinary)

**Lỗi:** `Cloudinary upload failed` hoặc 401 Unauthorized

**Giải pháp:**
```bash
# Kiểm tra Cloudinary config trong backend/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Test Cloudinary connection
curl -X POST "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload" \
  -F "file=@test.jpg" \
  -F "api_key=your_api_key" \
  -F "timestamp=$(date +%s)" \
  -F "signature=generated_signature"
```

---

#### 7. JWT Token expired

**Lỗi:** `401 Unauthorized - Token expired`

**Giải pháp:**
```javascript
// Frontend tự động logout khi token expire
// User cần đăng nhập lại

// Để tăng token expiration (backend/middleware/auth.js):
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }  // Đổi từ 1d sang 7d
);
```

---

#### 8. Email service không gửi được

**Lỗi:** `Invalid login: 535-5.7.8 Username and Password not accepted`

**Giải pháp:**
```bash
# 1. Enable "Less secure app access" trong Gmail
# Hoặc dùng App Password: https://myaccount.google.com/apppasswords

# 2. Update backend/.env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # App password, không phải password thường

# 3. Nếu không cần email, comment out email service trong code
# backend/controllers/authController.js - Line 50-55
```

---

#### 9. Booking cancellation thất bại

**Lỗi:** `Error: Chỉ được hủy vé trước 24 giờ khởi hành`

**Giải pháp:**
```javascript
// Kiểm tra thời gian khởi hành của trip
// Chỉ cho phép hủy vé trước 24 giờ

// Nếu cần test trong development, thay đổi logic:
// backend/controllers/bookingController.js - Line 298
const hoursDiff = moment(trip.departure_time).diff(moment(), 'hours');
if (hoursDiff < 1) {  // Đổi từ 24 sang 1 giờ cho testing
  return res.status(400).json({
    success: false,
    message: 'Chỉ được hủy vé trước 1 giờ khởi hành'
  });
}
```

---

#### 10. React hot reload không hoạt động

**Giải pháp:**
```bash
# 1. Restart Vite dev server
cd frontend
npm run dev

# 2. Clear browser cache: Ctrl + Shift + Delete

# 3. Nếu vẫn không work, delete node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Performance Issues

#### Backend chậm khi search trips

**Giải pháp:**
```sql
-- Thêm indexes vào database
CREATE INDEX idx_trips_departure_time ON trips(departure_time);
CREATE INDEX idx_trips_route_id ON trips(route_id);
CREATE INDEX idx_routes_cities ON routes(departure_city, arrival_city);

-- Tối ưu query trong tripController.js
-- Sử dụng LEFT JOIN thay vì multiple queries
```

#### Frontend load chậm

**Giải pháp:**
```javascript
// 1. Enable code splitting trong Vite
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          axios: ['axios']
        }
      }
    }
  }
});

// 2. Lazy load components
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const PassengerDashboard = lazy(() => import('./pages/Passenger/PassengerDashboard'));

// 3. Optimize images với Cloudinary transformations
<img src={`${avatar_url}?w=200&h=200&c=fill`} />
```

---

### Debug Tips

#### Enable debug logging

**Backend:**
```javascript
// backend/app.js - Thêm morgan để log requests
const morgan = require('morgan');
app.use(morgan('dev'));  // Đã có sẵn trong code

// Thêm custom logger
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend:**
```javascript
// src/services/api.js - Log all API calls
api.interceptors.request.use(config => {
  console.log('🚀 API Request:', config.method.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

---

### Database Debugging

```sql
-- Check all tables
SHOW TABLES;

-- Check table structure
DESCRIBE users;
DESCRIBE bookings;

-- Check data
SELECT * FROM users LIMIT 10;
SELECT * FROM trips WHERE departure_time > NOW() LIMIT 5;

-- Check booking status distribution
SELECT booking_status, COUNT(*) as count 
FROM bookings 
GROUP BY booking_status;

-- Find bookings with issues
SELECT b.id, b.booking_code, b.payment_status, b.booking_status, t.departure_time
FROM bookings b
JOIN trips t ON b.trip_id = t.id
WHERE b.payment_status = 'paid' AND b.booking_status = 'cancelled';

-- Check orphaned records
SELECT COUNT(*) FROM bookings WHERE trip_id NOT IN (SELECT id FROM trips);
SELECT COUNT(*) FROM trips WHERE bus_id NOT IN (SELECT id FROM buses);
```

---

### Testing Commands

```bash
# Backend unit tests (nếu có Jest setup)
cd backend
npm test

# Test specific API endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"Test123!"}'

# Test với token
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer your_jwt_token_here"

# Frontend build test
cd frontend
npm run build
npm run preview  # Test production build locally
```

---

### Logs Location

**Backend logs:**
- Console output: Terminal đang chạy `node app.js`
- Error logs: `backend/logs/error.log` (nếu setup Winston)

**Frontend logs:**
- Browser Console: F12 → Console tab
- Network tab: F12 → Network tab (xem API requests)

**Database logs:**
- MySQL error log: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
- Slow query log: Enable trong MySQL config

---

### Get Help

**Khi cần support, cung cấp thông tin:**
1. **Lỗi gì?** - Full error message và stack trace
2. **Đang làm gì?** - Steps to reproduce
3. **Environment:** OS, Node version, MySQL version
4. **Logs:** Console output từ backend và frontend
5. **Screenshots:** Nếu có lỗi UI

**Example bug report:**
```
**Issue:** Cannot create booking

**Steps:**
1. Login as passenger
2. Search trip: Hà Nội → Hải Phòng
3. Select seats A1, A2
4. Click "Đặt vé"
5. Error appears

**Error message:**
500 Internal Server Error
{
  "success": false,
  "message": "Cannot read property 'id' of undefined"
}

**Environment:**
- OS: Windows 11
- Node: v18.17.0
- MySQL: 8.0.34
- Browser: Chrome 120

**Backend console log:**
[Error log here]
```

---

## 📚 Tài Liệu Bổ Sung

### Project Documentation
- [Demo Guide](./DEMO_GUIDE.md) - Chi tiết hướng dẫn demo hệ thống
- [Quality Report](./QUALITY_REPORT.md) - Báo cáo kiểm tra chất lượng
- [Backend Readiness](./backend/test/BACKEND_READINESS_REPORT.md) - Báo cáo backend
- [Bus Company Registration](./BUS_COMPANY_REGISTRATION_GUIDE.md) - Hướng dẫn đăng ký nhà xe
- [Postman Guide](./backend/test/POSTMAN_GUIDE.md) - Test API với Postman

### External Resources
- [VNPay Integration](./backend/docs/VNPAY_SETUP_GUIDE.md) - Setup VNPay payment
- [Cloudinary Docs](https://cloudinary.com/documentation) - Image upload & optimization
- [React Router Docs](https://reactrouter.com/) - Frontend routing
- [Express.js Docs](https://expressjs.com/) - Backend framework
- [MySQL Docs](https://dev.mysql.com/doc/) - Database reference

---

## 🧪 Testing

### Unit Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run specific test file
npm test -- bookingController.test.js
```

### Integration Tests

```bash
# Test toàn bộ API flow
cd backend/test
node final-comprehensive-test.js

# Test specific features
node test-bookings.html  # Open in browser
node test-auth.html      # Open in browser
```

### Manual Testing Checklist

#### User Authentication
- [ ] Register với email mới
- [ ] Register với email đã tồn tại (expect error)
- [ ] Login với credentials đúng
- [ ] Login với credentials sai (expect error)
- [ ] Access protected routes without token (expect 401)
- [ ] Token expiration handling

#### Booking Flow
- [ ] Search trips với valid parameters
- [ ] Select seats và create booking
- [ ] Payment với VNPay
- [ ] View booking details với QR code
- [ ] Cancel booking (trước 24h)
- [ ] Complete booking sau khi đi xong

#### Bus Company Features
- [ ] Register nhà xe với documents
- [ ] Wait for admin approval
- [ ] Create new trip
- [ ] View bookings của chuyến xe
- [ ] Analytics và revenue reports

#### Admin Features
- [ ] View all users
- [ ] Approve/Reject bus companies
- [ ] View system analytics
- [ ] Manage all bookings

---

## 🎯 Roadmap & Future Enhancements

### Phase 1 - Current (Completed ✅)
- [x] User authentication với 3 roles
- [x] Trip search và booking
- [x] VNPay payment integration
- [x] QR code generation
- [x] Booking cancellation với refund policy
- [x] Bus company registration
- [x] Admin approval system
- [x] Basic analytics dashboard

### Phase 2 - Short Term (3-6 months)
- [ ] **Mobile App** - React Native cho iOS & Android
- [ ] **Real-time notifications** - Socket.io cho booking updates
- [ ] **Rating & Review system** - Khách hàng đánh giá nhà xe
- [ ] **Loyalty Program** - Điểm thưởng, vouchers
- [ ] **Multi-language support** - English, Vietnamese
- [ ] **Advanced analytics** - Detailed reports, charts
- [ ] **Email notifications** - Booking confirmations, reminders
- [ ] **SMS notifications** - OTP verification

### Phase 3 - Medium Term (6-12 months)
- [ ] **Seat selection UI** - Interactive seat map
- [ ] **Dynamic pricing** - Giá theo demand
- [ ] **Multi-payment methods** - Momo, ZaloPay, Credit Cards
- [ ] **Bus tracking** - Real-time GPS location
- [ ] **Chat support** - Customer service chatbot
- [ ] **Promotional campaigns** - Flash sales, discounts
- [ ] **API for partners** - White-label integration
- [ ] **Advanced search filters** - Amenities, ratings, price ranges

### Phase 4 - Long Term (12+ months)
- [ ] **AI recommendations** - Personalized trip suggestions
- [ ] **Route optimization** - ML-based route planning
- [ ] **Blockchain ticketing** - NFT-based tickets
- [ ] **Carbon footprint tracking** - Eco-friendly options
- [ ] **Multi-modal transport** - Integrate trains, flights
- [ ] **International routes** - Cross-border bookings
- [ ] **Insurance integration** - Travel insurance
- [ ] **B2B portal** - Corporate booking accounts

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/bus-ticket.git
   cd bus-ticket
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow coding conventions
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create PR
   - Describe your changes
   - Link related issues

### Coding Standards

#### JavaScript/React
```javascript
// Use ES6+ features
const arrow = () => {};

// Destructuring
const { email, password } = req.body;

// Async/await instead of promises
const data = await fetchData();

// Meaningful variable names
const userBookings = await getUserBookings(userId);

// Add comments for complex logic
// Calculate refund amount based on cancellation time
const refundPercentage = hoursDiff >= 24 ? 0.8 : 0.5;
```

#### Git Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 👥 Team & Contributors

### Core Team
- **Full Stack Developer:** Nguyễn Đạt
  - Backend Architecture & API Development
  - Database Design & Optimization
  - Frontend Development
  - DevOps & Deployment

### Special Thanks
- VNPay for payment gateway integration
- Cloudinary for image hosting
- All open-source contributors

---

## 📄 License

**MIT License**

Copyright (c) 2024 Bus Ticket Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📧 Contact & Support

### Get in Touch

**For Business Inquiries:**
- 📧 Email: business@busticket.vn
- 📱 Phone: +84 901 234 567
- 🏢 Office: 123 Phố Huế, Hai Bà Trưng, Hà Nội

**For Technical Support:**
- 📧 Email: support@busticket.vn
- 💬 Live Chat: https://chat.busticket.vn
- 📞 Hotline: 1900-xxxx (24/7)

**For Developers:**
- 💻 GitHub: https://github.com/yourusername/bus-ticket
- 📖 API Docs: https://api.busticket.vn/docs
- 🐛 Report Bug: https://github.com/yourusername/bus-ticket/issues
- 💡 Feature Request: https://github.com/yourusername/bus-ticket/discussions

### Social Media
- 🌐 Website: https://busticket.vn
- 👔 LinkedIn: https://linkedin.com/company/busticket
- 📘 Facebook: https://facebook.com/busticket.vn
- 🐦 Twitter: @busticket_vn

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/bus-ticket?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/bus-ticket?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/bus-ticket)
![GitHub license](https://img.shields.io/github/license/yourusername/bus-ticket)
![Last commit](https://img.shields.io/github/last-commit/yourusername/bus-ticket)

**Project Statistics:**
- Lines of Code: ~15,000+
- Contributors: 1
- Commits: 200+
- Stars: ⭐ (Be the first!)
- License: MIT

---

## ⚠️ Disclaimer

This is a **demo/portfolio project** for educational purposes. While fully functional, it is recommended to:
- Perform thorough security audits before production use
- Update all dependencies regularly
- Use strong secrets and passwords
- Enable additional security measures (2FA, HTTPS, etc.)
- Comply with local laws and regulations for payment processing
- Have proper insurance and legal documentation for commercial use

**Payment Gateway Notice:**
- Currently configured for VNPay Sandbox environment
- Switch to production VNPay credentials for real transactions
- Ensure PCI-DSS compliance for handling payment data

---

<div align="center">

## 🎉 Thank You!

**Cảm ơn bạn đã quan tâm đến Bus Ticket Management System!**

If you find this project useful, please consider:
- ⭐ Giving it a star on GitHub
- 🐛 Reporting bugs or suggesting features
- 🤝 Contributing to the project
- 📢 Sharing with your friends and colleagues

---

**Made with ❤️ and ☕ by Nguyễn Đạt**

*"Connecting people through seamless travel experiences"*

</div>
