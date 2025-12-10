# 🎨 Hướng dẫn chạy Frontend Bus Ticket Management

## 📋 Tổng quan

Frontend được xây dựng với:
- ⚛️ **React 18** - UI Library
- 🚀 **Vite** - Build tool & Dev server
- 🎨 **CSS3** - Custom styling (không dùng Tailwind)
- 🔄 **React Router** - Client-side routing
- 📡 **Axios** - HTTP client

## 🏗️ Cấu trúc dự án

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx         # Form đăng nhập
│   │   │   └── RegisterForm.jsx      # Form đăng ký
│   │   └── admin/
│   │       └── AdminLayout.jsx       # Layout admin với sidebar
│   ├── pages/
│   │   └── Admin/
│   │       ├── Dashboard.jsx         # Trang dashboard với analytics
│   │       ├── UserManagement.jsx    # Quản lý users
│   │       ├── BusCompanyManagement.jsx # Quản lý nhà xe
│   │       └── RouteManagement.jsx   # Quản lý tuyến đường
│   ├── services/
│   │   ├── api.js                    # Axios config + interceptors
│   │   ├── authService.js            # Auth API calls
│   │   └── adminService.js           # Admin API calls
│   ├── styles/
│   │   ├── auth.css                  # Auth page styles
│   │   └── admin.css                 # Admin panel styles
│   ├── App.jsx                       # Main app với routing
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── .env                              # Environment variables
├── package.json
├── vite.config.js
└── index.html
```

## 🚀 Cài đặt và chạy

### 1️⃣ Cài đặt dependencies

```powershell
cd F:\cacduan\Manage_bus_tickets\frontend
npm install
```

### 2️⃣ Kiểm tra file .env

File `.env` đã được tạo với cấu hình:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Khởi động Backend (Terminal 1)

```powershell
cd F:\cacduan\Manage_bus_tickets\backend
npm start
```

Backend sẽ chạy trên: **http://localhost:5000**

### 4️⃣ Khởi động Frontend (Terminal 2)

```powershell
cd F:\cacduan\Manage_bus_tickets\frontend
npm run dev
```

Frontend sẽ chạy trên: **http://localhost:3000**

## 🎯 Các trang đã xây dựng

### 🔐 Authentication Pages

#### 1. Login Page (`/login`)
- Form đăng nhập với email & password
- Validation client-side
- Quick login buttons cho testing (Admin, Passenger)
- Auto redirect dựa theo role:
  - Admin → `/admin/dashboard`
  - Bus Company → `/company/dashboard`
  - Passenger → `/`

**Test Accounts:**
- **Admin:** admin@busticketsystem.com / Admin123456
- **Passenger:** passenger1@gmail.com / Password123!

#### 2. Register Page (`/register`)
- Form đăng ký với validation
- Chọn role: Passenger hoặc Bus Company
- Password confirmation
- Phone number validation (10 chữ số)

### 👨‍💼 Admin Panel (`/admin`)

#### 1. Dashboard (`/admin/dashboard`)
**Features:**
- 📊 4 stat cards:
  - Tổng doanh thu
  - Tổng số vé đã bán
  - Nhà xe đang hoạt động
  - Chờ duyệt
- 🔥 Bảng tuyến đường phổ biến
- 📈 Biểu đồ doanh thu theo tháng

**API:** `GET /api/admin/analytics`

#### 2. User Management (`/admin/users`)
**Features:**
- 📋 Danh sách users với pagination
- 🔍 Lọc theo role (Admin/Bus Company/Passenger)
- ✅ Kích hoạt/Khóa user
- 🏷️ Badge hiển thị role và status

**API:** 
- `GET /api/admin/users?page=1&limit=10&role=passenger`
- `PUT /api/admin/users/:id/status`

#### 3. Bus Company Management (`/admin/companies`)
**Features:**
- 📋 Danh sách nhà xe với pagination
- 🔍 Lọc theo trạng thái (Pending/Approved/Rejected)
- ✅ Duyệt nhà xe
- ❌ Từ chối nhà xe
- 🔒 Khóa nhà xe đã duyệt
- 🏷️ Badge trạng thái với icon

**API:**
- `GET /api/admin/bus-companies?page=1&limit=10&status=pending`
- `PUT /api/admin/bus-companies/:id/status`

#### 4. Route Management (`/admin/routes`)
**Features:**
- 📋 Danh sách tuyến đường
- ➕ Thêm tuyến đường mới (Modal)
- ✏️ Sửa tuyến đường (Modal)
- 🗑️ Xóa tuyến đường
- Form fields:
  - Thành phố xuất phát/đến
  - Bến xuất phát/đến
  - Khoảng cách (km)
  - Thời gian (giờ)

**API:**
- `GET /api/admin/routes?page=1&limit=10`
- `POST /api/admin/routes`
- `PUT /api/admin/routes/:id`
- `DELETE /api/admin/routes/:id`

### 🎨 UI Components

**AdminLayout:**
- Sidebar có thể thu gọn/mở rộng
- Navigation với icons & descriptions
- Header với user info & logout button
- Active state highlighting

**Styling:**
- Modern gradient backgrounds
- Smooth animations & transitions
- Responsive design
- Hover effects
- Loading spinners
- Modal dialogs
- Badge components
- Table với hover state
- Custom buttons (Primary, Success, Danger, Warning)

## 🔒 Security Features

### Protected Routes
- Kiểm tra authentication trước khi truy cập
- Admin routes yêu cầu role = 'admin'
- Auto redirect về login nếu chưa đăng nhập
- Auto redirect về dashboard nếu đã đăng nhập

### API Security
- JWT token trong localStorage
- Auto attach token vào headers
- Interceptor xử lý 401 (unauthorized)
- Auto logout khi token expired

## 🎯 API Integration

### Base URL Configuration
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Axios Interceptors
**Request:**
- Tự động thêm `Authorization: Bearer <token>`

**Response:**
- Xử lý 401 → logout & redirect về login
- Return response.data trực tiếp

### Service Layer
```javascript
// authService.js
login(email, password)
register(userData)
logout()
getCurrentUser()
isAuthenticated()
isAdmin()

// adminService.js
getUsers(page, limit, role)
updateUserStatus(userId, status)
getBusCompanies(page, limit, status)
approveBusCompany(companyId, status)
getRoutes(page, limit)
createRoute(routeData)
updateRoute(routeId, routeData)
deleteRoute(routeId)
getAnalytics()
```

## 🎨 Style Guide

### Colors
- Primary: `#667eea` → `#764ba2` (Gradient)
- Success: `#10b981`
- Warning: `#f59e0b`
- Danger: `#ef4444`
- Background: `#f5f7fa`
- Dark: `#1e293b`

### Typography
- Headings: System fonts (SF Pro, Segoe UI, Roboto)
- Font weights: 400, 600, 700

### Spacing
- Base unit: 8px
- Small: 4px, 8px
- Medium: 12px, 16px, 20px, 24px
- Large: 32px, 40px

## 📱 Responsive Design

- Desktop: Full sidebar (280px)
- Mobile: Sidebar 100% width when open
- Tables: Horizontal scroll on small screens
- Forms: Single column on mobile

## 🧪 Testing Flow

### 1. Test Login
1. Mở http://localhost:3000
2. Click "Admin" quick login button
3. Hoặc nhập: admin@busticketsystem.com / Admin123456
4. Kiểm tra redirect về `/admin/dashboard`

### 2. Test Dashboard
1. Xem 4 stat cards
2. Xem bảng popular routes
3. Xem biểu đồ monthly revenue

### 3. Test User Management
1. Vào `/admin/users`
2. Lọc theo role
3. Thử khóa/kích hoạt một user
4. Test pagination

### 4. Test Bus Company Management
1. Vào `/admin/companies`
2. Lọc "Chờ duyệt"
3. Thử duyệt một nhà xe
4. Kiểm tra status badge thay đổi

### 5. Test Route Management
1. Vào `/admin/routes`
2. Click "Thêm tuyến đường"
3. Điền form và submit
4. Thử sửa một route
5. Thử xóa một route

## 🐛 Troubleshooting

### Port đã được sử dụng
```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F
```

### Backend không kết nối được
- Kiểm tra backend đang chạy: http://localhost:5000
- Kiểm tra VITE_API_URL trong .env
- Mở DevTools → Network tab để xem request

### Token expired
- Tự động logout và redirect về login
- Đăng nhập lại

### CORS Error
- Vite proxy đã được cấu hình trong vite.config.js
- Backend đã enable CORS

## 🚀 Build Production

```powershell
npm run build
```

Files sẽ được build vào thư mục `dist/`

## 📦 Deployment

### Option 1: Serve tĩnh
```powershell
npm run preview
```

### Option 2: Deploy lên hosting
- Upload folder `dist/` lên hosting
- Cấu hình VITE_API_URL trỏ về backend production

## ✅ Checklist hoàn thành

- [x] Login/Register pages
- [x] Admin Layout với sidebar
- [x] Dashboard với analytics
- [x] User Management (CRUD)
- [x] Bus Company Management (Approve/Reject)
- [x] Route Management (CRUD với Modal)
- [x] API Service layer
- [x] Protected routes
- [x] Responsive design
- [x] Custom CSS styling
- [x] Loading states
- [x] Error handling

## 🎉 Kết luận

Frontend đã hoàn thiện với đầy đủ tính năng:
- ✅ Authentication (Login/Register)
- ✅ Admin Panel với 4 trang chính
- ✅ API integration hoàn chỉnh
- ✅ Modern UI/UX
- ✅ Security với protected routes
- ✅ Responsive design

**Sẵn sàng để phát triển thêm các tính năng:**
- Passenger dashboard
- Bus company dashboard
- Trip search & booking
- Payment integration
- Profile management
