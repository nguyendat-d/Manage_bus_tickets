-- create_database.sql
-- Creates the booking database and the app user used by the project
-- Usage: run this SQL as a MySQL root user (or another user with CREATE/GRANT privileges)

CREATE DATABASE IF NOT EXISTS `bookingdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user for local connections
CREATE USER IF NOT EXISTS 'appuser'@'localhost' IDENTIFIED BY 'apppassword';
GRANT ALL PRIVILEGES ON `bookingdb`.* TO 'appuser'@'localhost';

-- Also allow connections from other hosts (optional). Uncomment if needed:
-- CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'apppassword';
-- GRANT ALL PRIVILEGES ON `bookingdb`.* TO 'appuser'@'%';

FLUSH PRIVILEGES;
