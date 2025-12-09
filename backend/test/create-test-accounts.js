const bcrypt = require('bcryptjs');
const pool = require('../config/database');

(async () => {
  try {
    const hash = await bcrypt.hash('Password123!', 10);
    
    // Create bus company user
    await pool.query(`
      INSERT IGNORE INTO users (email, password_hash, full_name, phone, role, status) 
      VALUES ('company1@gmail.com', ?, 'Test Bus Company', '0287654321', 'bus_company', 'active')
    `, [hash]);
    
    // Create admin user
    await pool.query(`
      INSERT IGNORE INTO users (email, password_hash, full_name, phone, role, status) 
      VALUES ('admin@gmail.com', ?, 'Admin User', '0909999999', 'admin', 'active')
    `, [hash]);
    
    // Get company user id
    const [companyUsers] = await pool.query(`SELECT id FROM users WHERE email = 'company1@gmail.com'`);
    if (companyUsers.length > 0) {
      const companyUserId = companyUsers[0].id;
      
      // Create bus company profile
      await pool.query(`
        INSERT IGNORE INTO bus_companies (user_id, company_name, tax_code, address, phone, email, status)
        VALUES (?, 'Test Bus Company', '0123456789', 'Test Address', '0287654321', 'company1@gmail.com', 'approved')
      `, [companyUserId]);
    }
    
    console.log('✅ Created test accounts:');
    console.log('   - company1@gmail.com (bus_company role)');
    console.log('   - admin@gmail.com (admin role)');
    console.log('   Password for both: Password123!');
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
})();
