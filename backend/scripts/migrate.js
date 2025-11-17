// scripts/migrate-smart.js
require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

console.log('🚀 Starting smart database migrations...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ MySQL Database connected successfully');

  const sqlFile = path.join(__dirname, '../database/schema.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  console.log('📝 Executing SQL schema...');

  // Chạy toàn bộ SQL, bỏ qua lỗi "table already exists"
  connection.query(sql, (error, results) => {
    if (error) {
      // Kiểm tra nếu lỗi là "table already exists" thì bỏ qua
      if (error.message.includes('already exists') || error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('⚠️  Tables already exist, continuing...');
        console.log('✅ Database schema is ready');
        connection.end();
        process.exit(0);
      } else {
        console.error('❌ Migration failed:', error.message);
        connection.end();
        process.exit(1);
      }
    } else {
      console.log('🎉 Database migrations completed successfully!');
      console.log('📊 Database is ready for use');
      connection.end();
      process.exit(0);
    }
  });
});