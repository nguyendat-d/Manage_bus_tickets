const http = require('http');

function testLogin() {
  const data = JSON.stringify({
    email: 'admin@busticketsystem.com',
    password: 'Admin123456'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('\n=== TEST ĐĂNG NHẬP API ===\n');
  console.log('Đang gửi request...\n');

  const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}\n`);
      
      try {
        const jsonData = JSON.parse(responseData);
        
        if (res.statusCode === 200) {
          console.log('✅ ĐĂNG NHẬP THÀNH CÔNG!\n');
          console.log('📋 Thông tin user:');
          console.log(JSON.stringify(jsonData.user, null, 2));
          console.log('\n🔑 Token:');
          console.log(jsonData.token.substring(0, 50) + '...');
        } else {
          console.log('❌ ĐĂNG NHẬP THẤT BẠI!\n');
          console.log('Lỗi:', JSON.stringify(jsonData, null, 2));
        }
      } catch (e) {
        console.log('❌ Lỗi parse JSON:', e.message);
        console.log('Response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Lỗi kết nối:', error.message);
    console.log('\n💡 Đảm bảo backend server đang chạy trên port 5000');
  });

  req.write(data);
  req.end();
}

testLogin();
