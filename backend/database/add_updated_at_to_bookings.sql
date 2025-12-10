-- Add updated_at column to bookings table if it doesn't exist
USE bus_ticket_management;

-- Check if updated_at column exists, if not add it
SET @dbname = DATABASE();
SET @tablename = "bookings";
SET @columnname = "updated_at";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE table_schema = @dbname
     AND table_name = @tablename
     AND column_name = @columnname) > 0,
  "SELECT 'Column updated_at already exists in bookings table'",
  "ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
