-- Sample Data for Bus Ticket Management System
USE bus_ticket_management;

-- 1. Insert Sample Users
INSERT INTO users (email, password_hash, full_name, phone, role, status, email_verified) VALUES
-- Password for all: Password123! (hashed with bcrypt)
('admin@busticket.com', '$2a$10$xQHj5OZj3qZvqK5WFhNdW.rCnOZcvqXZ5rOQZj3qZvqK5WFhNdW.r', 'System Admin', '0901111111', 'admin', 'active', TRUE),
('phuongtrang@buscompany.com', '$2a$10$xQHj5OZj3qZvqK5WFhNdW.rCnOZcvqXZ5rOQZj3qZvqK5WFhNdW.r', 'Phuong Trang', '0902222222', 'bus_company', 'active', TRUE),
('mailinh@buscompany.com', '$2a$10$xQHj5OZj3qZvqK5WFhNdW.rCnOZcvqXZ5rOQZj3qZvqK5WFhNdW.r', 'Mai Linh', '0903333333', 'bus_company', 'active', TRUE),
('passenger1@gmail.com', '$2a$10$xQHj5OZj3qZvqK5WFhNdW.rCnOZcvqXZ5rOQZj3qZvqK5WFhNdW.r', 'Nguyen Van A', '0904444444', 'passenger', 'active', TRUE),
('passenger2@gmail.com', '$2a$10$xQHj5OZj3qZvqK5WFhNdW.rCnOZcvqXZ5rOQZj3qZvqK5WFhNdW.r', 'Tran Thi B', '0905555555', 'passenger', 'active', TRUE)
ON DUPLICATE KEY UPDATE email=email;

-- 2. Insert Bus Companies
INSERT INTO bus_companies (user_id, company_name, tax_code, address, phone, email, status, rating) VALUES
(2, 'Phuong Trang FUTA Bus Lines', '0301506427', '272 De Tham, Phuong Pham Ngu Lao, Quan 1, TP.HCM', '0902222222', 'phuongtrang@buscompany.com', 'approved', 4.5),
(3, 'Mai Linh Express', '0302468135', '18 Cong Quynh, Quan 1, TP.HCM', '0903333333', 'mailinh@buscompany.com', 'approved', 4.3)
ON DUPLICATE KEY UPDATE company_name=company_name;

-- 3. Insert Routes
INSERT INTO routes (departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes, status) VALUES
('Ho Chi Minh', 'Ben Xe Mien Dong', 'Da Lat', 'Ben Xe Da Lat', 308, 360, 'active'),
('Ho Chi Minh', 'Ben Xe Mien Tay', 'Can Tho', 'Ben Xe Can Tho', 169, 180, 'active'),
('Ha Noi', 'Ben Xe My Dinh', 'Hai Phong', 'Ben Xe Tam Bac', 102, 120, 'active'),
('Ho Chi Minh', 'Ben Xe Mien Dong', 'Nha Trang', 'Ben Xe Phuong Mai', 448, 480, 'active'),
('Ho Chi Minh', 'Ben Xe Mien Dong', 'Vung Tau', 'Ben Xe Vung Tau', 125, 150, 'active')
ON DUPLICATE KEY UPDATE departure_city=departure_city;

-- 4. Insert Buses
INSERT INTO buses (bus_company_id, license_plate, bus_type, total_seats, amenities, seat_map, status) VALUES
-- Phuong Trang buses
(1, '51B-12345', 'limousine', 22, '["wifi", "ac", "water", "blanket", "usb-charging"]', 
'[{"row":1,"seats":[{"number":"A1","type":"vip","available":true},{"number":"A2","type":"vip","available":true}]},{"row":2,"seats":[{"number":"B1","type":"vip","available":true},{"number":"B2","type":"vip","available":true}]}]', 'active'),

(1, '51B-67890', 'sleeper', 40, '["wifi", "ac", "water"]',
'[{"row":1,"seats":[{"number":"A1","type":"standard","available":true},{"number":"A2","type":"standard","available":true}]}]', 'active'),

-- Mai Linh buses
(2, '51C-11111', 'seater', 45, '["wifi", "ac"]',
'[{"row":1,"seats":[{"number":"1A","type":"standard","available":true},{"number":"1B","type":"standard","available":true}]}]', 'active'),

(2, '51C-22222', 'limousine', 24, '["wifi", "ac", "water", "massage", "entertainment"]',
'[{"row":1,"seats":[{"number":"A1","type":"vip","available":true},{"number":"A2","type":"vip","available":true}]}]', 'active')
ON DUPLICATE KEY UPDATE license_plate=license_plate;

-- 5. Insert Trips (Chuyến xe trong tương lai)
INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES
-- HCM -> Da Lat
(1, 1, 1, '2025-12-15 08:00:00', '2025-12-15 14:00:00', 250000, 22, 'scheduled'),
(1, 1, 2, '2025-12-15 14:00:00', '2025-12-15 20:00:00', 220000, 40, 'scheduled'),
(2, 1, 4, '2025-12-15 09:00:00', '2025-12-15 15:00:00', 280000, 24, 'scheduled'),

-- HCM -> Can Tho
(1, 2, 1, '2025-12-16 06:00:00', '2025-12-16 09:00:00', 150000, 22, 'scheduled'),
(2, 2, 3, '2025-12-16 08:00:00', '2025-12-16 11:00:00', 140000, 45, 'scheduled'),

-- Ha Noi -> Hai Phong
(2, 3, 3, '2025-12-17 07:00:00', '2025-12-17 09:00:00', 120000, 45, 'scheduled'),
(2, 3, 4, '2025-12-17 15:00:00', '2025-12-17 17:00:00', 150000, 24, 'scheduled'),

-- HCM -> Nha Trang
(1, 4, 2, '2025-12-18 22:00:00', '2025-12-19 06:00:00', 300000, 40, 'scheduled'),
(2, 4, 4, '2025-12-18 23:00:00', '2025-12-19 07:00:00', 320000, 24, 'scheduled'),

-- HCM -> Vung Tau
(1, 5, 1, '2025-12-20 08:00:00', '2025-12-20 10:30:00', 100000, 22, 'scheduled'),
(2, 5, 3, '2025-12-20 10:00:00', '2025-12-20 12:30:00', 95000, 45, 'scheduled')
ON DUPLICATE KEY UPDATE bus_company_id=bus_company_id;

-- 6. Insert Sample Bookings
INSERT INTO bookings (user_id, trip_id, booking_code, passenger_info, seat_numbers, total_amount, payment_method, payment_status, booking_status) VALUES
(4, 1, 'BK2025120900001', '{"name":"Nguyen Van A","phone":"0904444444","email":"passenger1@gmail.com"}', '["A1","A2"]', 500000, 'vnpay', 'paid', 'confirmed'),
(5, 2, 'BK2025120900002', '{"name":"Tran Thi B","phone":"0905555555","email":"passenger2@gmail.com"}', '["A3"]', 220000, 'vnpay', 'paid', 'confirmed')
ON DUPLICATE KEY UPDATE booking_code=booking_code;

-- 7. Insert Sample Payments
INSERT INTO payments (booking_id, payment_method, amount, payment_status, transaction_id) VALUES
(1, 'vnpay', 500000, 'success', 'VNP20251209000001'),
(2, 'vnpay', 220000, 'success', 'VNP20251209000002')
ON DUPLICATE KEY UPDATE booking_id=booking_id;

SELECT 'Sample data inserted successfully!' as message;
