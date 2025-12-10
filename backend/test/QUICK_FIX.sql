-- MANUAL FIX: Copy and paste this into MySQL Workbench or command line
-- This will fix the bookings table to work with the updated code

USE bus_ticket_management;

-- Step 1: Add updated_at column
ALTER TABLE bookings 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Step 2: Verify the structure
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bus_ticket_management' 
AND TABLE_NAME = 'bookings'
ORDER BY ORDINAL_POSITION;

-- Step 3: Show current bookings (if any)
SELECT COUNT(*) as total_bookings FROM bookings;

-- Optional: Clean test data
-- DELETE FROM bookings WHERE id > 0;

-- Confirmation message
SELECT '✅ Database schema updated successfully! You can now test booking.' as status;
