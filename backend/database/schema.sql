-- database/schema.sql

-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS bus_ticket_management;
USE bus_ticket_management;

-- Bảng Users
CREATE TABLE IF NOT EXISTS users (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Bus Companies
CREATE TABLE IF NOT EXISTS bus_companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(50) UNIQUE,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    documents JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Routes
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure_city VARCHAR(100) NOT NULL,
    departure_station VARCHAR(255) NOT NULL,
    arrival_city VARCHAR(100) NOT NULL,
    arrival_station VARCHAR(255) NOT NULL,
    distance_km DECIMAL(8,2),
    estimated_duration_minutes INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Buses
CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_company_id INT,
    license_plate VARCHAR(20) NOT NULL,
    bus_type ENUM('limousine', 'sleeper', 'seater', 'van') NOT NULL,
    total_seats INT NOT NULL,
    amenities JSON,
    seat_map JSON NOT NULL,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_company_id) REFERENCES bus_companies(id) ON DELETE CASCADE
);

-- Bảng Trips
CREATE TABLE IF NOT EXISTS trips (
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
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Bảng Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    trip_id INT,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    passenger_info JSON NOT NULL,
    seat_numbers JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('vnpay', 'credit_card', 'debit_card', 'cash'),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    booking_status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    qr_code_url VARCHAR(500),
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- Bảng Payments
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100),
    payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    vnpay_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Thêm dữ liệu mẫu (chỉ thêm nếu chưa tồn tại)
INSERT IGNORE INTO users (id, email, password_hash, full_name, phone, role) VALUES 
(1, 'admin@bus.com', '$2a$10$ExampleHashForTesting', 'System Admin', '0123456789', 'admin'),
(2, 'passenger@test.com', '$2a$10$ExampleHashForTesting', 'Test Passenger', '0987654321', 'passenger');

INSERT IGNORE INTO routes (id, departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes) VALUES 
(1, 'Hà Nội', 'Bến xe Mỹ Đình', 'Hải Phòng', 'Bến xe Lạch Tray', 105, 120),
(2, 'Hà Nội', 'Bến xe Mỹ Đình', 'Quảng Ninh', 'Bến xe Móng Cái', 150, 180);

-- Tạo indexes (bỏ qua nếu đã tồn tại)
SET @dbname = DATABASE();
SET @tablename = "users";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = @dbname AND table_name = @tablename AND index_name = "idx_users_email") > 0,
  "SELECT 'Index idx_users_email already exists'",
  "CREATE INDEX idx_users_email ON users(email)"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = @dbname AND table_name = @tablename AND index_name = "idx_users_role") > 0,
  "SELECT 'Index idx_users_role already exists'",
  "CREATE INDEX idx_users_role ON users(role)"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;