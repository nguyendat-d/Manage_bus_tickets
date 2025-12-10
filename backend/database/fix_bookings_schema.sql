-- Fix database schema - Run this SQL script
-- This adds the updated_at column to bookings table and ensures data consistency

USE bus_ticket_management;

-- 1. Add updated_at column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- 2. Verify the bookings table structure
DESCRIBE bookings;

-- 3. Check for any existing bookings with invalid data
SELECT id, booking_code, seat_numbers, passenger_info 
FROM bookings 
WHERE seat_numbers IS NULL OR passenger_info IS NULL
LIMIT 10;

-- 4. If there are test bookings with old 'seats' column, you may need to clean them
-- Uncomment the next line only if you want to delete test bookings
-- DELETE FROM bookings WHERE id > 0;

-- 5. Verify the structure is correct
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bus_ticket_management' 
AND TABLE_NAME = 'bookings'
ORDER BY ORDINAL_POSITION;
