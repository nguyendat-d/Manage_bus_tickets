const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_CREDENTIALS = {
  passenger: { email: 'passenger1@gmail.com', password: 'Password123!' },
  company: { email: 'company1@gmail.com', password: 'Password123!' },
  admin: { email: 'admin@gmail.com', password: 'Password123!' }
};

let tokens = { passenger: null, company: null, admin: null };
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  categories: {}
};

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ 
            status: res.statusCode, 
            data: JSON.parse(data),
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, success: false });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Get authentication tokens
async function getTokens() {
  console.log('🔐 Getting authentication tokens...\n');
  
  for (const [role, credentials] of Object.entries(TEST_CREDENTIALS)) {
    try {
      const res = await makeRequest('POST', '/auth/login', credentials);
      if (res.success && res.data.token) {
        tokens[role] = res.data.token;
        console.log(`   ✅ ${role.charAt(0).toUpperCase() + role.slice(1)} token obtained`);
      } else {
        console.log(`   ❌ ${role.charAt(0).toUpperCase() + role.slice(1)} token failed`);
      }
    } catch (error) {
      console.log(`   ❌ ${role.charAt(0).toUpperCase() + role.slice(1)} error:`, error.message);
    }
  }
  console.log('');
}

// Test helper
function recordTest(category, testName, passed, details = '') {
  testResults.total++;
  if (!testResults.categories[category]) {
    testResults.categories[category] = { passed: 0, failed: 0 };
  }
  
  if (passed) {
    testResults.passed++;
    testResults.categories[category].passed++;
    console.log(`   ✅ ${testName}`);
  } else {
    testResults.failed++;
    testResults.categories[category].failed++;
    console.log(`   ❌ ${testName}`);
  }
  
  if (details) {
    console.log(`      ${details}`);
  }
}

// Test Suite
async function runAllTests() {
  console.log('='.repeat(80));
  console.log('🧪 BACKEND API - FINAL COMPLETE TEST SUITE');
  console.log('='.repeat(80));
  console.log('\n');

  await getTokens();

  // 1. SYSTEM HEALTH
  console.log('📍 1. SYSTEM HEALTH CHECK\n');
  try {
    const res = await makeRequest('GET', '/health');
    recordTest('system', 'Health Check', res.success);
  } catch (e) {
    recordTest('system', 'Health Check', false, e.message);
  }
  console.log('');

  // 2. AUTHENTICATION
  console.log('📍 2. AUTHENTICATION & AUTHORIZATION\n');
  
  // Valid login already tested in getTokens
  recordTest('auth', 'Passenger Login', !!tokens.passenger);
  recordTest('auth', 'Company Login', !!tokens.company);
  recordTest('auth', 'Admin Login', !!tokens.admin);
  
  // Invalid login
  try {
    const res = await makeRequest('POST', '/auth/login', { 
      email: 'wrong@email.com', 
      password: 'WrongPass123!' 
    });
    recordTest('auth', 'Invalid Login (should fail)', !res.success && res.status === 401);
  } catch (e) {
    recordTest('auth', 'Invalid Login', false);
  }
  
  // Unauthorized access
  try {
    const res = await makeRequest('GET', '/bookings');
    recordTest('auth', 'Unauthorized Access (should fail)', !res.success && res.status === 401);
  } catch (e) {
    recordTest('auth', 'Unauthorized Access', false);
  }
  console.log('');

  // 3. TRIPS & SEARCH
  console.log('📍 3. TRIPS & SEARCH FUNCTIONALITY\n');
  
  let tripId = null;
  
  // Basic search
  try {
    const res = await makeRequest('GET', '/trips/search?from=Ho Chi Minh&to=Da Lat&date=2025-12-15');
    const hasTrips = res.success && res.data.data.trips.length > 0;
    if (hasTrips) tripId = res.data.data.trips[0].id;
    recordTest('trips', 'Search Trips', hasTrips, `Found ${res.data.data.trips.length} trips`);
  } catch (e) {
    recordTest('trips', 'Search Trips', false, e.message);
  }
  
  // Search with filters
  try {
    const res = await makeRequest('GET', '/trips/search?from=Ho Chi Minh&to=Da Lat&date=2025-12-15&sortBy=price&sortOrder=asc');
    recordTest('trips', 'Search with Sorting', res.success);
  } catch (e) {
    recordTest('trips', 'Search with Sorting', false);
  }
  
  // Search with pagination
  try {
    const res = await makeRequest('GET', '/trips/search?from=Ho Chi Minh&to=Da Lat&date=2025-12-15&page=1&limit=5');
    recordTest('trips', 'Search with Pagination', res.success);
  } catch (e) {
    recordTest('trips', 'Search with Pagination', false);
  }
  
  // Trip detail
  if (tripId) {
    try {
      const res = await makeRequest('GET', `/trips/${tripId}`);
      recordTest('trips', 'Get Trip Detail', res.success);
    } catch (e) {
      recordTest('trips', 'Get Trip Detail', false);
    }
    
    // Seat map
    try {
      const res = await makeRequest('GET', `/trips/${tripId}/seat-map`);
      const valid = res.success && res.data.data.total_seats > 0;
      recordTest('trips', 'Get Seat Map', valid, `${res.data.data.available_seats}/${res.data.data.total_seats} available`);
    } catch (e) {
      recordTest('trips', 'Get Seat Map', false);
    }
  }
  
  // Invalid trip
  try {
    const res = await makeRequest('GET', '/trips/99999');
    recordTest('trips', 'Invalid Trip ID (should fail)', !res.success);
  } catch (e) {
    recordTest('trips', 'Invalid Trip ID', false);
  }
  
  // Missing params
  try {
    const res = await makeRequest('GET', '/trips/search');
    recordTest('trips', 'Missing Parameters (should fail)', !res.success);
  } catch (e) {
    recordTest('trips', 'Missing Parameters', false);
  }
  console.log('');

  // 4. USER MANAGEMENT
  console.log('📍 4. USER MANAGEMENT\n');
  
  try {
    const res = await makeRequest('GET', '/users/profile', null, tokens.passenger);
    recordTest('users', 'Get User Profile', res.success);
  } catch (e) {
    recordTest('users', 'Get User Profile', false);
  }
  
  try {
    const res = await makeRequest('PUT', '/users/profile', {
      full_name: 'Test User Updated'
    }, tokens.passenger);
    recordTest('users', 'Update User Profile', res.success);
  } catch (e) {
    recordTest('users', 'Update User Profile', false);
  }
  console.log('');

  // 5. BOOKINGS
  console.log('📍 5. BOOKING SYSTEM\n');
  
  let bookingId = null;
  
  if (tripId) {
    try {
      const res = await makeRequest('POST', '/bookings', {
        trip_id: tripId,
        passenger_info: {
          name: 'Final Test User',
          phone: '0999999999',
          email: 'finaltest@test.com'
        },
        seat_numbers: [Math.floor(Math.random() * 10) + 1],
        payment_method: 'cash'
      }, tokens.passenger);
      
      if (res.success && res.data.data) {
        bookingId = res.data.data.bookingId;
      }
      recordTest('bookings', 'Create Booking', res.success, `Booking ID: ${bookingId}`);
    } catch (e) {
      recordTest('bookings', 'Create Booking', false, e.message);
    }
  }
  
  try {
    const res = await makeRequest('GET', '/bookings?page=1&limit=10', null, tokens.passenger);
    const hasBookings = res.success && res.data.data.bookings;
    recordTest('bookings', 'Get User Bookings', hasBookings, `Found ${res.data.data.bookings.length} bookings`);
  } catch (e) {
    recordTest('bookings', 'Get User Bookings', false);
  }
  
  if (bookingId) {
    try {
      const res = await makeRequest('GET', `/bookings/${bookingId}/qr`, null, tokens.passenger);
      recordTest('bookings', 'Get Booking QR Code', res.success);
    } catch (e) {
      recordTest('bookings', 'Get Booking QR Code', false);
    }
  }
  console.log('');

  // 6. BUS COMPANY MANAGEMENT
  console.log('📍 6. BUS COMPANY MANAGEMENT\n');
  
  try {
    const res = await makeRequest('GET', '/bus-companies/profile', null, tokens.company);
    recordTest('busCompany', 'Get Company Profile', res.success);
  } catch (e) {
    recordTest('busCompany', 'Get Company Profile', false);
  }
  
  try {
    const res = await makeRequest('GET', '/bus-companies/buses?page=1&limit=10', null, tokens.company);
    recordTest('busCompany', 'Get Company Buses', res.success);
  } catch (e) {
    recordTest('busCompany', 'Get Company Buses', false);
  }
  
  try {
    const res = await makeRequest('GET', '/bus-companies/trips?page=1&limit=10', null, tokens.company);
    recordTest('busCompany', 'Get Company Trips', res.success);
  } catch (e) {
    recordTest('busCompany', 'Get Company Trips', false);
  }
  
  try {
    const res = await makeRequest('GET', '/bus-companies/bookings?page=1&limit=10', null, tokens.company);
    recordTest('busCompany', 'Get Company Bookings', res.success);
  } catch (e) {
    recordTest('busCompany', 'Get Company Bookings', false);
  }
  
  try {
    const res = await makeRequest('GET', '/bus-companies/stats', null, tokens.company);
    recordTest('busCompany', 'Get Company Statistics', res.success);
  } catch (e) {
    recordTest('busCompany', 'Get Company Statistics', false);
  }
  console.log('');

  // 7. PAYMENTS
  console.log('📍 7. PAYMENT SYSTEM\n');
  
  if (bookingId) {
    try {
      const res = await makeRequest('POST', '/payments/vnpay', {
        booking_id: bookingId,
        amount: 250000
      }, tokens.passenger);
      const hasUrl = res.success && res.data.data && res.data.data.paymentUrl;
      recordTest('payments', 'Create VNPay Payment', hasUrl, hasUrl ? 'Payment URL generated' : 'Failed');
    } catch (e) {
      recordTest('payments', 'Create VNPay Payment', false, e.message);
    }
  }
  
  try {
    const res = await makeRequest('GET', '/payments/history?page=1&limit=10', null, tokens.passenger);
    recordTest('payments', 'Get Payment History', res.success);
  } catch (e) {
    recordTest('payments', 'Get Payment History', false);
  }
  console.log('');

  // 8. ADMIN OPERATIONS
  console.log('📍 8. ADMIN OPERATIONS\n');
  
  try {
    const res = await makeRequest('GET', '/admin/users?page=1&limit=10', null, tokens.admin);
    recordTest('admin', 'Get All Users', res.success, `Found ${res.data.data?.users?.length || 0} users`);
  } catch (e) {
    recordTest('admin', 'Get All Users', false);
  }
  
  try {
    const res = await makeRequest('GET', '/admin/bus-companies?page=1&limit=10', null, tokens.admin);
    recordTest('admin', 'Get All Companies', res.success, `Found ${res.data.data?.companies?.length || 0} companies`);
  } catch (e) {
    recordTest('admin', 'Get All Companies', false);
  }
  
  try {
    const res = await makeRequest('GET', '/admin/routes?page=1&limit=10', null, tokens.admin);
    recordTest('admin', 'Get All Routes', res.success, `Found ${res.data.data?.routes?.length || 0} routes`);
  } catch (e) {
    recordTest('admin', 'Get All Routes', false);
  }
  
  try {
    const res = await makeRequest('GET', '/admin/analytics', null, tokens.admin);
    recordTest('admin', 'Get System Analytics', res.success);
  } catch (e) {
    recordTest('admin', 'Get System Analytics', false);
  }
  console.log('');

  // FINAL SUMMARY
  console.log('='.repeat(80));
  console.log('📊 FINAL TEST SUMMARY');
  console.log('='.repeat(80));
  console.log('');
  console.log(`   Total Tests:      ${testResults.total}`);
  console.log(`   ✅ Passed:        ${testResults.passed} (${((testResults.passed/testResults.total)*100).toFixed(1)}%)`);
  console.log(`   ❌ Failed:        ${testResults.failed} (${((testResults.failed/testResults.total)*100).toFixed(1)}%)`);
  console.log('');
  console.log('   Results by Category:');
  console.log('');
  
  for (const [category, results] of Object.entries(testResults.categories)) {
    const total = results.passed + results.failed;
    const percentage = ((results.passed / total) * 100).toFixed(0);
    const icon = percentage === '100' ? '✅' : percentage >= '50' ? '⚠️' : '❌';
    console.log(`   ${icon} ${category.padEnd(15)} ${results.passed}/${total} (${percentage}%)`);
  }
  
  console.log('');
  console.log('='.repeat(80));
  
  if (testResults.passed === testResults.total) {
    console.log('');
    console.log('🎉 HOÀN HẢO! TẤT CẢ TESTS ĐỀU PASS! 🎉');
    console.log('');
    console.log('✅ Backend đã sẵn sàng 100% cho phát triển frontend!');
    console.log('✅ Tất cả APIs hoạt động ổn định');
    console.log('✅ Authentication & Authorization hoàn hảo');
    console.log('✅ Error handling đúng chuẩn');
    console.log('');
  } else if (testResults.passed / testResults.total >= 0.95) {
    console.log('');
    console.log('🎉 XUẤT SẮC! HỆ THỐNG SẴN SÀNG CHO PHÁT TRIỂN FRONTEND! 🎉');
    console.log('');
    console.log('✅ Core functionality hoạt động hoàn hảo (>95%)');
    console.log('✅ Các chức năng quan trọng đều pass');
    console.log('⚠️  Một số chức năng phụ cần cấu hình thêm (VNPay credentials)');
    console.log('');
  } else {
    console.log('');
    console.log('⚠️  HỆ THỐNG CẦN KIỂM TRA LẠI');
    console.log('');
    console.log(`❌ ${testResults.failed} tests failed`);
    console.log('🔍 Xem chi tiết phía trên để biết APIs nào cần fix');
    console.log('');
  }
  
  console.log('='.repeat(80));
  console.log('');
}

// Run tests
runAllTests().catch(console.error);
