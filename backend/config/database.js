// config/database.js
require('dotenv').config();
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'thanhdat12345',
  database: process.env.DB_NAME || 'bus_ticket_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASSWORD);

// Test connection with better error handling
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('❌ Make sure MySQL is running and credentials are correct');
    // Không exit để server vẫn chạy, chỉ log warning
  });


module.exports = pool;