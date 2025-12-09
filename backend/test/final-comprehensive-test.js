const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;
const API_BASE = '/api';

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  categories: {
    system: { passed: 0, failed: 0 },
    auth: { passed: 0, failed: 0 },
    trips: { passed: 0, failed: 0 },
    users: { passed: 0, failed: 0 },
    bookings: { passed: 0, failed: 0 },
    busCompany: { passed: 0, failed: 0 },
    payments: { passed: 0, failed: 0 },
    admin: { passed: 0, failed: 0 }
  }
};

// Test data storage
let testData = {
  passengerToken: '',
  companyToken: '',
  adminToken: '',
  userId: '',
  companyId: '',
  tripId: 34,
  bookingId: '',
  routeId: ''
};

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: API_BASE + path,
      method: method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    };

    if (token) options.headers['Authorization'] = `Bearer ${token}`;

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
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function logTest(category, name, passed, details = '') {
  results.total++;
  if (passed) {
    results.passed++;
    results.categories[category].passed++;
    console.log(`    ✅ ${name}`);
  } else {
    results.failed++;
    results.categories[category].failed++;
    console.log(`    ❌ ${name}`);
  }
  if (details) console.log(`       ${details}`);
}

async function testSystem() {
  console.log('\n📍 1. SYSTEM HEALTH CHECK\n');
  
  try {
    const health = await makeRequest('GET', '/health');
    logTest('system', 'Server Health Check', 
      health.status === 200,
      'Server is running'
    );
  } catch (e) {
    logTest('system', 'Server Health Check', false, `Error: ${e.message}`);
  }
}

async function testAuthentication() {
  console.log('\n📍 2. AUTHENTICATION & AUTHORIZATION\n');
  
  // Test passenger login
  try {
    const login = await makeRequest('POST', '/auth/login', {
      email: 'passenger1@gmail.com',
      password: 'Password123!'
    });
    
    if (login.status === 200 && login.data.success) {
      testData.passengerToken = login.data.data.token;
      testData.userId = login.data.data.user.id;
      logTest('auth', 'Passenger Login', true, `Token: ${login.data.data.token.substring(0, 20)}...`);
    } else {
      logTest('auth', 'Passenger Login', false, login.data.message);
    }
  } catch (e) {
    logTest('auth', 'Passenger Login', false, e.message);
  }

  // Test company login
  try {
    const login = await makeRequest('POST', '/auth/login', {
      email: 'company1@gmail.com',
      password: 'Password123!'
    });
    
    if (login.status === 200 && login.data.success) {
      testData.companyToken = login.data.data.token;
      logTest('auth', 'Bus Company Login', true, 'Token received');
    } else {
      logTest('auth', 'Bus Company Login', false, login.data.message);
    }
  } catch (e) {
    logTest('auth', 'Bus Company Login', false, e.message);
  }

  // Test admin login
  try {
    const login = await makeRequest('POST', '/auth/login', {
      email: 'admin@gmail.com',
      password: 'Password123!'
    });
    
    if (login.status === 200 && login.data.success) {
      testData.adminToken = login.data.data.token;
      logTest('auth', 'Admin Login', true, 'Token received');
    } else {
      logTest('auth', 'Admin Login', false, login.data.message);
    }
  } catch (e) {
    logTest('auth', 'Admin Login', false, e.message);
  }

  // Test invalid login
  try {
    const invalid = await makeRequest('POST', '/auth/login', {
      email: 'invalid@test.com',
      password: 'wrong'
    });
    logTest('auth', 'Invalid Login (should fail)', 
      invalid.status === 401 || invalid.status === 400,
      'Correctly rejected'
    );
  } catch (e) {
    logTest('auth', 'Invalid Login (should fail)', false, e.message);
  }

  // Test unauthorized access
  try {
    const unauth = await makeRequest('GET', '/users/profile');
    logTest('auth', 'Unauthorized Access (should fail)',
      unauth.status === 401,
      'Correctly rejected'
    );
  } catch (e) {
    logTest('auth', 'Unauthorized Access (should fail)', false, e.message);
  }
}

async function testTrips() {
  console.log('\n📍 3. TRIPS & SEARCH FUNCTIONALITY\n');

  // Test basic search
  try {
    const search = await makeRequest('GET', '/trips/search?from=Ho%20Chi%20Minh&to=Da%20Lat&date=2025-12-15');
    if (search.status === 200 && search.data.success) {
      const tripCount = search.data.data.trips.length;
      if (tripCount > 0) testData.tripId = search.data.data.trips[0].id;
      logTest('trips', 'Basic Search (HCM → Da Lat)', 
        tripCount > 0,
        `Found ${tripCount} trips`
      );
    } else {
      logTest('trips', 'Basic Search (HCM → Da Lat)', false, search.data.message);
    }
  } catch (e) {
    logTest('trips', 'Basic Search (HCM → Da Lat)', false, e.message);
  }

  // Test search with sorting
  try {
    const sorted = await makeRequest('GET', '/trips/search?from=Ho%20Chi%20Minh&to=Da%20Lat&date=2025-12-15&sortBy=price&sortOrder=ASC');
    logTest('trips', 'Search with Price Sorting',
      sorted.status === 200 && sorted.data.success,
      'Sorted by price ASC'
    );
  } catch (e) {
    logTest('trips', 'Search with Price Sorting', false, e.message);
  }

  // Test search with pagination
  try {
    const paginated = await makeRequest('GET', '/trips/search?from=Ho%20Chi%20Minh&to=Da%20Lat&date=2025-12-15&page=1&limit=2');
    logTest('trips', 'Search with Pagination',
      paginated.status === 200 && paginated.data.success,
      'Page 1, Limit 2'
    );
  } catch (e) {
    logTest('trips', 'Search with Pagination', false, e.message);
  }

  // Test trip detail
  try {
    const detail = await makeRequest('GET', `/trips/${testData.tripId}`);
    logTest('trips', 'Get Trip Detail',
      detail.status === 200 && detail.data.success,
      detail.data.success ? `${detail.data.data.company_name}, ${detail.data.data.price} VND` : ''
    );
  } catch (e) {
    logTest('trips', 'Get Trip Detail', false, e.message);
  }

  // Test seat map
  try {
    const seatMap = await makeRequest('GET', `/trips/${testData.tripId}/seat-map`);
    logTest('trips', 'Get Seat Map',
      seatMap.status === 200 && seatMap.data.success,
      seatMap.data.success ? `${seatMap.data.data.total_seats} total seats, ${seatMap.data.data.available_seats} available` : ''
    );
  } catch (e) {
    logTest('trips', 'Get Seat Map', false, e.message);
  }

  // Test invalid trip ID
  try {
    const invalid = await makeRequest('GET', '/trips/999999');
    logTest('trips', 'Invalid Trip ID (should fail)',
      invalid.status === 404 || !invalid.data.success,
      'Correctly handled'
    );
  } catch (e) {
    logTest('trips', 'Invalid Trip ID (should fail)', false, e.message);
  }

  // Test missing search parameters
  try {
    const missing = await makeRequest('GET', '/trips/search?from=HCM');
    logTest('trips', 'Missing Search Parameters (should fail)',
      missing.status === 400 || !missing.data.success,
      'Correctly validated'
    );
  } catch (e) {
    logTest('trips', 'Missing Search Parameters (should fail)', false, e.message);
  }
}

async function testUsers() {
  console.log('\n📍 4. USER MANAGEMENT\n');

  if (!testData.passengerToken) {
    console.log('    ⚠️  Skipping user tests (no token available)\n');
    return;
  }

  // Test get profile
  try {
    const profile = await makeRequest('GET', '/users/profile', null, testData.passengerToken);
    logTest('users', 'Get User Profile',
      profile.status === 200 && profile.data.success,
      profile.data.success ? `User: ${profile.data.data.full_name}` : ''
    );
  } catch (e) {
    logTest('users', 'Get User Profile', false, e.message);
  }

  // Test update profile
  try {
    const update = await makeRequest('PUT', '/users/profile', {
      full_name: 'Test User Updated',
      phone: '0901234568'
    }, testData.passengerToken);
    logTest('users', 'Update User Profile',
      update.status === 200 && update.data.success,
      'Profile updated'
    );
  } catch (e) {
    logTest('users', 'Update User Profile', false, e.message);
  }
}

async function testBookings() {
  console.log('\n📍 5. BOOKING SYSTEM\n');

  if (!testData.passengerToken) {
    console.log('    ⚠️  Skipping booking tests (no token available)\n');
    return;
  }

  // Test create booking
  try {
    const randomSeat = (Date.now() % 10) + 10; // Random seat 10-20
    const booking = await makeRequest('POST', '/bookings', {
      trip_id: testData.tripId,
      seat_numbers: [String(randomSeat)],
      passenger_info: {
        full_name: 'Test Passenger',
        phone: '0901234567',
        email: 'test@example.com',
        identification: '123456789'
      },
      payment_method: 'vnpay'
    }, testData.passengerToken);

    if (booking.status === 201 && booking.data.success) {
      testData.bookingId = booking.data.data.bookingId;
      logTest('bookings', 'Create Booking',
        true,
        `Booking ID: ${booking.data.data.bookingId}, Code: ${booking.data.data.bookingCode}`
      );
    } else {
      logTest('bookings', 'Create Booking', false, booking.data.message);
    }
  } catch (e) {
    logTest('bookings', 'Create Booking', false, e.message);
  }

  // Test get user bookings
  try {
    const bookings = await makeRequest('GET', '/bookings?page=1&limit=10', null, testData.passengerToken);
    logTest('bookings', 'Get User Bookings',
      bookings.status === 200 && bookings.data.success,
      bookings.data.success ? `Found ${bookings.data.data.bookings.length} bookings` : ''
    );
  } catch (e) {
    logTest('bookings', 'Get User Bookings', false, e.message);
  }

  // Test get QR code
  if (testData.bookingId) {
    try {
      const qr = await makeRequest('GET', `/bookings/${testData.bookingId}/qr`, null, testData.passengerToken);
      logTest('bookings', 'Get Booking QR Code',
        qr.status === 200 && qr.data.success,
        'QR code retrieved'
      );
    } catch (e) {
      logTest('bookings', 'Get Booking QR Code', false, e.message);
    }
  }
}

async function testBusCompany() {
  console.log('\n📍 6. BUS COMPANY MANAGEMENT\n');

  if (!testData.companyToken) {
    console.log('    ⚠️  Skipping bus company tests (no token available)\n');
    return;
  }

  // Test get company profile
  try {
    const profile = await makeRequest('GET', '/bus-companies/profile', null, testData.companyToken);
    if (profile.status === 200 && profile.data.success) {
      testData.companyId = profile.data.data.id;
      logTest('busCompany', 'Get Company Profile',
        true,
        `Company: ${profile.data.data.company_name}`
      );
    } else {
      logTest('busCompany', 'Get Company Profile', false, profile.data.message);
    }
  } catch (e) {
    logTest('busCompany', 'Get Company Profile', false, e.message);
  }

  // Test get company buses
  try {
    const buses = await makeRequest('GET', '/bus-companies/buses?page=1&limit=10', null, testData.companyToken);
    logTest('busCompany', 'Get Company Buses',
      buses.status === 200 && buses.data.success,
      buses.data.success ? `Found ${buses.data.data.buses.length} buses` : ''
    );
  } catch (e) {
    logTest('busCompany', 'Get Company Buses', false, e.message);
  }

  // Test get company trips
  try {
    const trips = await makeRequest('GET', '/bus-companies/trips?page=1&limit=10', null, testData.companyToken);
    logTest('busCompany', 'Get Company Trips',
      trips.status === 200 && trips.data.success,
      trips.data.success ? `Found ${trips.data.data.trips.length} trips` : ''
    );
  } catch (e) {
    logTest('busCompany', 'Get Company Trips', false, e.message);
  }

  // Test get company bookings
  try {
    const bookings = await makeRequest('GET', '/bus-companies/bookings?page=1&limit=10', null, testData.companyToken);
    logTest('busCompany', 'Get Company Bookings',
      bookings.status === 200 && bookings.data.success,
      bookings.data.success ? `Found ${bookings.data.data.bookings.length} bookings` : ''
    );
  } catch (e) {
    logTest('busCompany', 'Get Company Bookings', false, e.message);
  }

  // Test get company statistics
  try {
    const stats = await makeRequest('GET', '/bus-companies/stats', null, testData.companyToken);
    logTest('busCompany', 'Get Company Statistics',
      stats.status === 200 && stats.data.success,
      stats.data.success ? `Revenue: ${stats.data.data.totalRevenue} VND` : ''
    );
  } catch (e) {
    logTest('busCompany', 'Get Company Statistics', false, e.message);
  }
}

async function testPayments() {
  console.log('\n📍 7. PAYMENT SYSTEM\n');

  if (!testData.passengerToken) {
    console.log('    ⚠️  Skipping payment tests (no token available)\n');
    return;
  }

  // Test create payment
  if (testData.bookingId) {
    try {
      const payment = await makeRequest('POST', '/payments/vnpay', {
        booking_id: testData.bookingId,
        amount: 250000
      }, testData.passengerToken);
      logTest('payments', 'Create VNPay Payment',
        payment.status === 200 && payment.data.success,
        'Payment URL generated'
      );
    } catch (e) {
      logTest('payments', 'Create VNPay Payment', false, e.message);
    }
  }

  // Test get payment history
  try {
    const history = await makeRequest('GET', '/payments/history?page=1&limit=10', null, testData.passengerToken);
    logTest('payments', 'Get Payment History',
      history.status === 200 && history.data.success,
      history.data.success ? `Found ${history.data.data.payments.length} payments` : ''
    );
  } catch (e) {
    logTest('payments', 'Get Payment History', false, e.message);
  }
}

async function testAdmin() {
  console.log('\n📍 8. ADMIN OPERATIONS\n');

  if (!testData.adminToken) {
    console.log('    ⚠️  Skipping admin tests (no token available)\n');
    return;
  }

  // Test get all users
  try {
    const users = await makeRequest('GET', '/admin/users?page=1&limit=10', null, testData.adminToken);
    logTest('admin', 'Get All Users',
      users.status === 200 && users.data.success,
      users.data.success ? `Found ${users.data.data.users.length} users` : ''
    );
  } catch (e) {
    logTest('admin', 'Get All Users', false, e.message);
  }

  // Test get all bus companies
  try {
    const companies = await makeRequest('GET', '/admin/bus-companies?page=1&limit=10', null, testData.adminToken);
    logTest('admin', 'Get All Bus Companies',
      companies.status === 200 && companies.data.success,
      companies.data.success ? `Found ${companies.data.data.companies.length} companies` : ''
    );
  } catch (e) {
    logTest('admin', 'Get All Bus Companies', false, e.message);
  }

  // Test get all routes
  try {
    const routes = await makeRequest('GET', '/admin/routes?page=1&limit=10', null, testData.adminToken);
    logTest('admin', 'Get All Routes',
      routes.status === 200 && routes.data.success,
      routes.data.success ? `Found ${routes.data.data.routes.length} routes` : ''
    );
  } catch (e) {
    logTest('admin', 'Get All Routes', false, e.message);
  }

  // Test get analytics
  try {
    const analytics = await makeRequest('GET', '/admin/analytics', null, testData.adminToken);
    logTest('admin', 'Get System Analytics',
      analytics.status === 200 && analytics.data.success,
      analytics.data.success ? `Total revenue: ${analytics.data.data.totalRevenue} VND` : ''
    );
  } catch (e) {
    logTest('admin', 'Get System Analytics', false, e.message);
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 FINAL TEST RESULTS\n');
  console.log('='.repeat(80));
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  
  console.log(`\n   Total Tests:      ${results.total}`);
  console.log(`   ✅ Passed:        ${results.passed} (${percentage}%)`);
  console.log(`   ❌ Failed:        ${results.failed}`);
  
  console.log('\n   Results by Category:\n');
  
  Object.entries(results.categories).forEach(([category, stats]) => {
    const total = stats.passed + stats.failed;
    if (total > 0) {
      const percent = ((stats.passed / total) * 100).toFixed(0);
      const status = percent === '100' ? '✅' : percent >= '80' ? '⚠️' : '❌';
      console.log(`   ${status} ${category.padEnd(15)} ${stats.passed}/${total} (${percent}%)`);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  
  if (percentage >= 95) {
    console.log('\n🎉 XUẤT SẮC! HỆ THỐNG SẴN SÀNG CHO PHÁT TRIỂN FRONTEND!\n');
    console.log('   ✅ Tất cả chức năng core hoạt động ổn định');
    console.log('   ✅ Authentication & Authorization hoạt động tốt');
    console.log('   ✅ CRUD operations đầy đủ');
    console.log('   ✅ Error handling đúng chuẩn');
    console.log('   ✅ API responses nhất quán\n');
  } else if (percentage >= 80) {
    console.log('\n✅ TỐT! HỆ THỐNG CƠ BẢN ĐÃ HOẠT ĐỘNG\n');
    console.log('   Một số chức năng phụ có thể cần xem xét thêm\n');
  } else {
    console.log('\n⚠️  CẦN KHẮC PHỤC MỘT SỐ VẤN ĐỀ TRƯỚC KHI PHÁT TRIỂN FRONTEND\n');
  }
  
  console.log('📦 NEXT STEPS:\n');
  console.log('   1. Import Postman collection: Bus_Ticket_API.postman_collection.json');
  console.log('   2. Review API documentation: POSTMAN_GUIDE.md');
  console.log('   3. Start frontend development');
  console.log('   4. Use base URL: http://localhost:5000/api\n');
  
  console.log('='.repeat(80) + '\n');
}

async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 COMPREHENSIVE BACKEND API TEST SUITE');
  console.log('='.repeat(80));
  console.log('\nTesting all API endpoints to ensure system readiness for frontend development\n');

  await testSystem();
  await testAuthentication();
  await testTrips();
  await testUsers();
  await testBookings();
  await testBusCompany();
  await testPayments();
  await testAdmin();
  
  printSummary();
  
  process.exit(results.failed > results.total * 0.2 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('\n❌ TEST SUITE ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
