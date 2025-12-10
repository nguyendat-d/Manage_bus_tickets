// Create admin account
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function createAdmin() {
  try {
    const email = 'admin@bus.com';
    const password = 'Admin123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if admin exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      // Update password
      await pool.execute(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [hashedPassword, email]
      );
      console.log('✅ Admin password updated successfully');
    } else {
      // Insert new admin
      await pool.execute(
        `INSERT INTO users (email, password_hash, full_name, role, email_verified, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [email, hashedPassword, 'System Admin', 'admin', true, 'active']
      );
      console.log('✅ Admin account created successfully');
    }
    
    console.log('\n📧 Email: admin@bus.com');
    console.log('🔑 Password: Admin123456');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
