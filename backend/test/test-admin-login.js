const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function testAdminLogin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'thanhdat12345',
    database: 'bus_ticket_management'
  });

  try {
    // 1. Kiểm tra tài khoản admin có tồn tại không
    const [users] = await connection.execute(
      'SELECT id, email, password_hash, full_name, role FROM users WHERE email = ?',
      ['admin@busticketsystem.com']
    );

    console.log('\n=== KIỂM TRA TÀI KHOẢN ADMIN ===\n');

    if (users.length === 0) {
      console.log('❌ Không tìm thấy tài khoản admin@busticketsystem.com');
      console.log('\n🔧 Đang tạo tài khoản admin mới...\n');

      // Tạo password hash
      const hashedPassword = await bcrypt.hash('Admin123456', 10);

      // Tạo tài khoản admin
      await connection.execute(
        `INSERT INTO users (email, password_hash, full_name, phone, role, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        ['admin@busticketsystem.com', hashedPassword, 'System Administrator', '0987654321', 'admin']
      );

      console.log('✅ Đã tạo tài khoản admin thành công!');
      console.log('   Email: admin@busticketsystem.com');
      console.log('   Password: Admin123456');
    } else {
      const admin = users[0];
      console.log('✅ Tìm thấy tài khoản admin:');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.full_name}`);
      console.log(`   Role: ${admin.role}`);

      // 2. Kiểm tra password có đúng không
      const passwordMatch = await bcrypt.compare('Admin123456', admin.password_hash);
      
      console.log(`\n🔐 Kiểm tra password "Admin123456": ${passwordMatch ? '✅ ĐÚNG' : '❌ SAI'}`);

      if (!passwordMatch) {
        console.log('\n🔧 Password không khớp. Đang cập nhật password mới...\n');
        const newHashedPassword = await bcrypt.hash('Admin123456', 10);
        
        await connection.execute(
          'UPDATE users SET password_hash = ? WHERE email = ?',
          [newHashedPassword, 'admin@busticketsystem.com']
        );

        console.log('✅ Đã cập nhật password thành công!');
        console.log('   Email: admin@busticketsystem.com');
        console.log('   Password: Admin123456');
      }
    }

    console.log('\n=== TEST ĐĂNG NHẬP ===\n');
    console.log('Bạn có thể đăng nhập với:');
    console.log('  URL: POST http://localhost:5000/api/auth/login');
    console.log('  Body: {');
    console.log('    "email": "admin@busticketsystem.com",');
    console.log('    "password": "Admin123456"');
    console.log('  }\n');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await connection.end();
  }
}

testAdminLogin();
