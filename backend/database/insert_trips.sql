-- Insert only trips data
USE bus_ticket_management;

-- Xóa dữ liệu cũ
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM trips;

-- Lấy IDs
SET @route_hcm_dalat = (SELECT id FROM routes WHERE departure_city = 'Ho Chi Minh' AND arrival_city = 'Da Lat' LIMIT 1);
SET @route_hcm_cantho = (SELECT id FROM routes WHERE departure_city = 'Ho Chi Minh' AND arrival_city = 'Can Tho' LIMIT 1);
SET @route_hn_haiphong = (SELECT id FROM routes WHERE departure_city = 'Ha Noi' AND arrival_city = 'Hai Phong' LIMIT 1);
SET @route_hcm_nhatrang = (SELECT id FROM routes WHERE departure_city = 'Ho Chi Minh' AND arrival_city = 'Nha Trang' LIMIT 1);
SET @route_hcm_vungtau = (SELECT id FROM routes WHERE departure_city = 'Ho Chi Minh' AND arrival_city = 'Vung Tau' LIMIT 1);

SET @company1 = (SELECT id FROM bus_companies WHERE company_name LIKE '%Phuong Trang%' LIMIT 1);
SET @company2 = (SELECT id FROM bus_companies WHERE company_name LIKE '%Mai Linh%' LIMIT 1);

SET @bus1 = (SELECT id FROM buses WHERE license_plate = '51B-12345' LIMIT 1);
SET @bus2 = (SELECT id FROM buses WHERE license_plate = '51B-67890' LIMIT 1);
SET @bus3 = (SELECT id FROM buses WHERE license_plate = '51C-11111' LIMIT 1);
SET @bus4 = (SELECT id FROM buses WHERE license_plate = '51C-22222' LIMIT 1);

-- Insert Trips
-- HCM -> Da Lat (3 trips on 2025-12-15)
INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES
(@company1, @route_hcm_dalat, @bus1, '2025-12-15 08:00:00', '2025-12-15 14:00:00', 250000, 22, 'scheduled'),
(@company1, @route_hcm_dalat, @bus2, '2025-12-15 14:00:00', '2025-12-15 20:00:00', 220000, 40, 'scheduled'),
(@company2, @route_hcm_dalat, @bus4, '2025-12-15 09:00:00', '2025-12-15 15:00:00', 280000, 24, 'scheduled');

-- HCM -> Can Tho (2 trips on 2025-12-16)
INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES
(@company1, @route_hcm_cantho, @bus1, '2025-12-16 06:00:00', '2025-12-16 09:00:00', 150000, 22, 'scheduled'),
(@company2, @route_hcm_cantho, @bus3, '2025-12-16 08:00:00', '2025-12-16 11:00:00', 140000, 45, 'scheduled');

-- Ha Noi -> Hai Phong (2 trips on 2025-12-17)
INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES
(@company2, @route_hn_haiphong, @bus3, '2025-12-17 07:00:00', '2025-12-17 09:00:00', 120000, 45, 'scheduled'),
(@company2, @route_hn_haiphong, @bus4, '2025-12-17 15:00:00', '2025-12-17 17:00:00', 150000, 24, 'scheduled');

-- HCM -> Nha Trang (2 trips on 2025-12-18)
INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES
(@company1, @route_hcm_nhatrang, @bus2, '2025-12-18 22:00:00', '2025-12-19 06:00:00', 300000, 40, 'scheduled'),
(@company2, @route_hcm_nhatrang, @bus4, '2025-12-18 23:00:00', '2025-12-19 07:00:00', 320000, 24, 'scheduled');

-- HCM -> Vung Tau (2 trips on 2025-12-20)
INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES
(@company1, @route_hcm_vungtau, @bus1, '2025-12-20 08:00:00', '2025-12-20 10:30:00', 100000, 22, 'scheduled'),
(@company2, @route_hcm_vungtau, @bus3, '2025-12-20 10:00:00', '2025-12-20 12:30:00', 95000, 45, 'scheduled');

SELECT 'Trips inserted successfully!' as message;
SELECT COUNT(*) as total_trips FROM trips;
