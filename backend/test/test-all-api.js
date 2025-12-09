const http = require('http');

// Hàm gọi API
function callAPI(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test suite
(async () => {
  console.log('\n🧪 BẮT ĐẦU TEST API...\n');
  console.log('='.repeat(70));
  
  let passCount = 0;
  let failCount = 0;
  let token = '';

  // Test 1: Health Check
  try {
    console.log('\n📍 TEST 1: Health Check');
    const result = await callAPI('GET', '/api/health');
    if (result.status === 200 && result.data.status === 'OK') {
      console.log('✅ PASS - Server đang hoạt động');
      passCount++;
    } else {
      console.log('❌ FAIL - Server không response đúng');
      failCount++;
    }
  } catch (e) {
    console.log('❌ FAIL - Server không khởi động:', e.message);
    failCount++;
  }

  // Test 2: Search Trips
  try {
    console.log('\n📍 TEST 2: Search Trips (HCM -> Da Lat)');
    const result = await callAPI('GET', '/api/trips/search?from=Ho%20Chi%20Minh&to=Da%20Lat&date=2025-12-15');
    if (result.status === 200 && result.data.success && result.data.data.trips.length > 0) {
      console.log(`✅ PASS - Tìm thấy ${result.data.data.trips.length} chuyến xe`);
      result.data.data.trips.forEach(trip => {
        console.log(`   - ${trip.company_name}: ${trip.price.toLocaleString('vi-VN')} VNĐ, ${trip.departure_time}`);
      });
      passCount++;
    } else {
      console.log('❌ FAIL - Không tìm thấy chuyến xe');
      console.log('Response:', result.data);
      failCount++;
    }
  } catch (e) {
    console.log('❌ FAIL - Lỗi:', e.message);
    failCount++;
  }

  // Test 3: Get Trip Detail
  try {
    console.log('\n📍 TEST 3: Get Trip Detail (#34)');
    const result = await callAPI('GET', '/api/trips/34');
    if (result.status === 200 && result.data.success) {
      console.log('✅ PASS - Lấy thông tin chi tiết thành công');
      const trip = result.data.data;
      console.log(`   - Nhà xe: ${trip.company_name}`);
      console.log(`   - Tuyến: ${trip.departure_city} → ${trip.arrival_city}`);
      console.log(`   - Giá: ${parseInt(trip.price).toLocaleString('vi-VN')} VNĐ`);
      passCount++;
    } else {
      console.log('❌ FAIL - Không lấy được thông tin');
      failCount++;
    }
  } catch (e) {
    console.log('❌ FAIL - Lỗi:', e.message);
    failCount++;
  }

  // Test 4: Get Seat Map
  try {
    console.log('\n📍 TEST 4: Get Seat Map (#34)');
    const result = await callAPI('GET', '/api/trips/34/seat-map');
    if (result.status === 200 && result.data.success) {
      console.log('✅ PASS - Lấy sơ đồ ghế thành công');
      console.log(`   - Tổng ghế: ${result.data.data.total_seats}`);
      console.log(`   - Ghế trống: ${result.data.data.available_seats}`);
      console.log(`   - Ghế đã đặt: ${result.data.data.booked_seats.length}`);
      passCount++;
    } else {
      console.log('❌ FAIL - Không lấy được sơ đồ ghế');
      failCount++;
    }
  } catch (e) {
    console.log('❌ FAIL - Lỗi:', e.message);
    failCount++;
  }

  // Test 5: Register User
  try {
    console.log('\n📍 TEST 5: Register User');
    const randomEmail = `test${Date.now()}@example.com`;
    const result = await callAPI('POST', '/api/auth/register', {
      email: randomEmail,
      password: 'Password123!',
      full_name: 'Test User',
      phone: '0901234567',
      role: 'passenger'
    });
    if (result.status === 201 && result.data.success) {
      console.log('✅ PASS - Đăng ký thành công');
      console.log(`   - Email: ${randomEmail}`);
      passCount++;
    } else {
      console.log('❌ FAIL - Đăng ký thất bại');
      console.log('Response:', result.data);
      failCount++;
    }
  } catch (e) {
    console.log('❌ FAIL - Lỗi:', e.message);
    failCount++;
  }

  // Test 6: Login
  try {
    console.log('\n📍 TEST 6: Login');
    const result = await callAPI('POST', '/api/auth/login', {
      email: 'passenger1@gmail.com',
      password: 'Password123!'
    });
    if (result.status === 200 && result.data.success && result.data.data.token) {
      console.log('✅ PASS - Đăng nhập thành công');
      token = result.data.data.token;
      console.log(`   - Token: ${token.substring(0, 20)}...`);
      console.log(`   - User: ${result.data.data.user.full_name}`);
      passCount++;
    } else {
      console.log('❌ FAIL - Đăng nhập thất bại');
      console.log('Response:', result.data);
      failCount++;
    }
  } catch (e) {
    console.log('❌ FAIL - Lỗi:', e.message);
    failCount++;
  }

  // Test 7: Get Profile (with token)
  if (token) {
    try {
      console.log('\n📍 TEST 7: Get Profile (Authenticated)');
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/users/profile',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const result = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, data: data });
            }
          });
        });
        req.on('error', reject);
        req.end();
      });

      if (result.status === 200 && result.data.success) {
        console.log('✅ PASS - Lấy profile thành công');
        console.log(`   - Tên: ${result.data.data.full_name}`);
        console.log(`   - Email: ${result.data.data.email}`);
        console.log(`   - Role: ${result.data.data.role}`);
        passCount++;
      } else {
        console.log('❌ FAIL - Không lấy được profile');
        failCount++;
      }
    } catch (e) {
      console.log('❌ FAIL - Lỗi:', e.message);
      failCount++;
    }
  }

  // Test 8: Create Booking (with token)
  if (token) {
    try {
      console.log('\n📍 TEST 8: Create Booking');
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/bookings',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const bookingData = {
        trip_id: 34,
        seat_numbers: [`${Date.now() % 20 + 1}`, `${Date.now() % 20 + 2}`],
        passenger_info: {
          full_name: 'Test Passenger',
          phone: '0901234567',
          email: 'test@example.com',
          identification: '123456789'
        },
        payment_method: 'vnpay'
      };

      const result = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, data: data });
            }
          });
        });
        req.on('error', reject);
        req.write(JSON.stringify(bookingData));
        req.end();
      });

      if (result.status === 201 && result.data.success) {
        console.log('✅ PASS - Đặt vé thành công');
        console.log(`   - Mã booking: ${result.data.data.bookingCode}`);
        console.log(`   - ID booking: ${result.data.data.bookingId}`);
        console.log(`   - Tổng tiền: ${parseInt(result.data.data.totalAmount).toLocaleString('vi-VN')} VNĐ`);
        passCount++;
      } else {
        console.log('❌ FAIL - Đặt vé thất bại');
        console.log('Response:', result.data);
        failCount++;
      }
    } catch (e) {
      console.log('❌ FAIL - Lỗi:', e.message);
      failCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 KẾT QUẢ TEST:\n');
  console.log(`   ✅ PASS: ${passCount}`);
  console.log(`   ❌ FAIL: ${failCount}`);
  console.log(`   📈 Success Rate: ${((passCount/(passCount+failCount))*100).toFixed(1)}%`);
  console.log('\n' + '='.repeat(70) + '\n');

  process.exit(failCount > 0 ? 1 : 0);
})();
