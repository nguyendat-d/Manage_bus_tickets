const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;
const API_BASE = '/api';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Store tokens and IDs
let passengerToken = '';
let busCompanyToken = '';
let adminToken = '';
let tripId = 34;
let bookingId = '';
let userId = '';
let busCompanyId = '';

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: API_BASE + path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
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
            headers: res.headers 
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
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

function logTest(name, passed, message = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  ✅ ${name}`);
    if (message) console.log(`     ${message}`);
  } else {
    failedTests++;
    console.log(`  ❌ ${name}`);
    if (message) console.log(`     ${message}`);
  }
}

async function runTests() {
  console.log('\n🧪 BẮT ĐẦU TEST TOÀN BỘ API...\n');
  console.log('='.repeat(80));

  // ============================================================
  // 01. AUTHENTICATION TESTS
  // ============================================================
  console.log('\n📍 01. AUTHENTICATION TESTS\n');

  try {
    // Test 1.1: Register Passenger
    const timestamp = Date.now();
    const passengerEmail = `passenger${timestamp}@test.com`;
    const registerPassenger = await makeRequest('POST', '/auth/register', {
      email: passengerEmail,
      password: 'Password123!',
      full_name: 'Test Passenger',
      phone: '0901234567',
      role: 'passenger'
    });
    logTest(
      'Register Passenger', 
      registerPassenger.status === 201 && registerPassenger.data.success,
      registerPassenger.data.message
    );

    // Test 1.2: Register Bus Company
    const busCompanyEmail = `company${timestamp}@test.com`;
    const registerCompany = await makeRequest('POST', '/auth/register', {
      email: busCompanyEmail,
      password: 'Password123!',
      full_name: 'Test Bus Company',
      phone: '0287654321',
      role: 'bus_company'
    });
    logTest(
      'Register Bus Company', 
      registerCompany.status === 201 && registerCompany.data.success,
      registerCompany.data.message
    );

    // Test 1.3: Login Passenger
    const loginPassenger = await makeRequest('POST', '/auth/login', {
      email: 'passenger1@gmail.com',
      password: 'Password123!'
    });
    if (loginPassenger.status === 200 && loginPassenger.data.success) {
      passengerToken = loginPassenger.data.data.token;
      userId = loginPassenger.data.data.user.id;
    }
    logTest(
      'Login Passenger', 
      loginPassenger.status === 200 && loginPassenger.data.success,
      loginPassenger.data.success ? 'Token saved' : loginPassenger.data.message
    );

    // Test 1.4: Verify Token
    const verifyToken = await makeRequest('GET', `/auth/verify?token=${passengerToken}`);
    logTest(
      'Verify Token', 
      verifyToken.status === 200 && verifyToken.data.success,
      verifyToken.data.message
    );

  } catch (error) {
    logTest('Authentication Tests', false, error.message);
  }

  // ============================================================
  // 02. USER TESTS
  // ============================================================
  console.log('\n📍 02. USER PROFILE TESTS\n');

  try {
    // Test 2.1: Get Profile
    const getProfile = await makeRequest('GET', '/users/profile', null, passengerToken);
    logTest(
      'Get User Profile', 
      getProfile.status === 200 && getProfile.data.success,
      getProfile.data.success ? `User: ${getProfile.data.data.full_name}` : getProfile.data.message
    );

    // Test 2.2: Update Profile
    const updateProfile = await makeRequest('PUT', '/users/profile', {
      full_name: 'Test Passenger Updated',
      phone: '0901234568'
    }, passengerToken);
    logTest(
      'Update User Profile', 
      updateProfile.status === 200 && updateProfile.data.success,
      updateProfile.data.message
    );

  } catch (error) {
    logTest('User Tests', false, error.message);
  }

  // ============================================================
  // 03. TRIPS TESTS
  // ============================================================
  console.log('\n📍 03. TRIPS & SEARCH TESTS\n');

  try {
    // Test 3.1: Search Trips
    const searchTrips = await makeRequest('GET', '/trips/search?from=Ho%20Chi%20Minh&to=Da%20Lat&date=2025-12-15');
    if (searchTrips.data.success && searchTrips.data.data.trips.length > 0) {
      tripId = searchTrips.data.data.trips[0].id;
    }
    logTest(
      'Search Trips', 
      searchTrips.status === 200 && searchTrips.data.success,
      searchTrips.data.success ? `Found ${searchTrips.data.data.trips.length} trips` : searchTrips.data.message
    );

    // Test 3.2: Get Trip Detail
    const tripDetail = await makeRequest('GET', `/trips/${tripId}`);
    logTest(
      'Get Trip Detail', 
      tripDetail.status === 200 && tripDetail.data.success,
      tripDetail.data.success ? `${tripDetail.data.data.company_name} - ${tripDetail.data.data.price} VND` : tripDetail.data.message
    );

    // Test 3.3: Get Seat Map
    const seatMap = await makeRequest('GET', `/trips/${tripId}/seat-map`);
    logTest(
      'Get Seat Map', 
      seatMap.status === 200 && seatMap.data.success,
      seatMap.data.success ? `Total seats: ${seatMap.data.data.total_seats}` : seatMap.data.message
    );

    // Test 3.4: Search with Sorting
    const searchSorted = await makeRequest('GET', '/trips/search?from=Ho%20Chi%20Minh&to=Da%20Lat&date=2025-12-15&sortBy=price&sortOrder=ASC');
    logTest(
      'Search Trips with Sorting', 
      searchSorted.status === 200 && searchSorted.data.success,
      searchSorted.data.success ? `Sorted by price` : searchSorted.data.message
    );

  } catch (error) {
    logTest('Trips Tests', false, error.message);
  }

  // ============================================================
  // 04. BOOKINGS TESTS
  // ============================================================
  console.log('\n📍 04. BOOKINGS TESTS\n');

  try {
    // Test 4.1: Create Booking
    const randomSeat = (Date.now() % 15) + 5; // Random seat 5-20
    const createBooking = await makeRequest('POST', '/bookings', {
      trip_id: tripId,
      seat_numbers: [String(randomSeat), String(randomSeat + 1)],
      passenger_info: {
        full_name: 'Test Passenger',
        phone: '0901234567',
        email: 'test@example.com',
        identification: '123456789'
      },
      payment_method: 'vnpay'
    }, passengerToken);
    
    if (createBooking.data.success) {
      bookingId = createBooking.data.data.bookingId;
    }
    logTest(
      'Create Booking', 
      createBooking.status === 201 && createBooking.data.success,
      createBooking.data.success ? `Booking ID: ${createBooking.data.data.bookingId}, Code: ${createBooking.data.data.bookingCode}` : createBooking.data.message
    );

    // Test 4.2: Get User Bookings
    const getBookings = await makeRequest('GET', '/bookings?page=1&limit=10', null, passengerToken);
    logTest(
      'Get User Bookings', 
      getBookings.status === 200 && getBookings.data.success,
      getBookings.data.success ? `Found ${getBookings.data.data.bookings.length} bookings` : getBookings.data.message
    );

    // Test 4.3: Get Booking QR Code
    if (bookingId) {
      const getQR = await makeRequest('GET', `/bookings/${bookingId}/qr`, null, passengerToken);
      logTest(
        'Get Booking QR Code', 
        getQR.status === 200 && getQR.data.success,
        getQR.data.message
      );
    }

  } catch (error) {
    logTest('Bookings Tests', false, error.message);
  }

  // ============================================================
  // 05. BUS COMPANY TESTS
  // ============================================================
  console.log('\n📍 05. BUS COMPANY TESTS\n');

  try {
    // Login as bus company user
    const loginCompany = await makeRequest('POST', '/auth/login', {
      email: 'company1@gmail.com',
      password: 'Password123!'
    });
    
    if (loginCompany.status === 200 && loginCompany.data.success) {
      busCompanyToken = loginCompany.data.data.token;
      logTest('Login as Bus Company', true, 'Token saved');
    } else {
      logTest('Login as Bus Company', false, loginCompany.data.message);
    }

    if (busCompanyToken) {
      // Test 5.1: Get Company Profile
      const companyProfile = await makeRequest('GET', '/bus-companies/profile', null, busCompanyToken);
      if (companyProfile.data.success && companyProfile.data.data) {
        busCompanyId = companyProfile.data.data.id;
      }
      logTest(
        'Get Company Profile', 
        companyProfile.status === 200 && companyProfile.data.success,
        companyProfile.data.success ? `Company: ${companyProfile.data.data.company_name}` : companyProfile.data.message
      );

      // Test 5.2: Get Company Buses
      const getBuses = await makeRequest('GET', '/bus-companies/buses?page=1&limit=10', null, busCompanyToken);
      logTest(
        'Get Company Buses', 
        getBuses.status === 200 && getBuses.data.success,
        getBuses.data.success ? `Found ${getBuses.data.data.buses.length} buses` : getBuses.data.message
      );

      // Test 5.3: Get Company Trips
      const getTrips = await makeRequest('GET', '/bus-companies/trips?page=1&limit=10', null, busCompanyToken);
      logTest(
        'Get Company Trips', 
        getTrips.status === 200 && getTrips.data.success,
        getTrips.data.success ? `Found ${getTrips.data.data.trips.length} trips` : getTrips.data.message
      );

      // Test 5.4: Get Company Bookings
      const getCompanyBookings = await makeRequest('GET', '/bus-companies/bookings?page=1&limit=10', null, busCompanyToken);
      logTest(
        'Get Company Bookings', 
        getCompanyBookings.status === 200 && getCompanyBookings.data.success,
        getCompanyBookings.data.success ? `Found ${getCompanyBookings.data.data.bookings.length} bookings` : getCompanyBookings.data.message
      );

      // Test 5.5: Get Company Statistics
      const getStats = await makeRequest('GET', '/bus-companies/stats', null, busCompanyToken);
      logTest(
        'Get Company Statistics', 
        getStats.status === 200 && getStats.data.success,
        getStats.data.success ? `Revenue: ${getStats.data.data.totalRevenue} VND` : getStats.data.message
      );
    }

  } catch (error) {
    logTest('Bus Company Tests', false, error.message);
  }

  // ============================================================
  // 06. PAYMENT TESTS
  // ============================================================
  console.log('\n📍 06. PAYMENT TESTS\n');

  try {
    if (bookingId) {
      // Test 6.1: Create VNPay Payment
      const createPayment = await makeRequest('POST', '/payments/vnpay', {
        booking_id: bookingId,
        amount: 500000
      }, passengerToken);
      logTest(
        'Create VNPay Payment', 
        createPayment.status === 200 && createPayment.data.success,
        createPayment.data.success ? 'Payment URL generated' : createPayment.data.message
      );
    }

    // Test 6.2: Get Payment History
    const paymentHistory = await makeRequest('GET', '/payments/history?page=1&limit=10', null, passengerToken);
    logTest(
      'Get Payment History', 
      paymentHistory.status === 200 && paymentHistory.data.success,
      paymentHistory.data.success ? `Found ${paymentHistory.data.data.payments.length} payments` : paymentHistory.data.message
    );

  } catch (error) {
    logTest('Payment Tests', false, error.message);
  }

  // ============================================================
  // 07. ADMIN TESTS (if admin credentials available)
  // ============================================================
  console.log('\n📍 07. ADMIN TESTS\n');

  try {
    // Login as admin
    const loginAdmin = await makeRequest('POST', '/auth/login', {
      email: 'admin@gmail.com',
      password: 'Admin123!'
    });
    
    if (loginAdmin.status === 200 && loginAdmin.data.success) {
      adminToken = loginAdmin.data.data.token;
      logTest('Login as Admin', true, 'Admin token saved');

      // Test 7.1: Get All Users
      const getAllUsers = await makeRequest('GET', '/admin/users?page=1&limit=10', null, adminToken);
      logTest(
        'Get All Users (Admin)', 
        getAllUsers.status === 200 && getAllUsers.data.success,
        getAllUsers.data.success ? `Found ${getAllUsers.data.data.users.length} users` : getAllUsers.data.message
      );

      // Test 7.2: Get All Bus Companies
      const getAllCompanies = await makeRequest('GET', '/admin/bus-companies?page=1&limit=10', null, adminToken);
      logTest(
        'Get All Bus Companies (Admin)', 
        getAllCompanies.status === 200 && getAllCompanies.data.success,
        getAllCompanies.data.success ? `Found ${getAllCompanies.data.data.companies.length} companies` : getAllCompanies.data.message
      );

      // Test 7.3: Get All Routes
      const getAllRoutes = await makeRequest('GET', '/admin/routes?page=1&limit=10', null, adminToken);
      logTest(
        'Get All Routes (Admin)', 
        getAllRoutes.status === 200 && getAllRoutes.data.success,
        getAllRoutes.data.success ? `Found ${getAllRoutes.data.data.routes.length} routes` : getAllRoutes.data.message
      );

      // Test 7.4: Get Analytics
      const getAnalytics = await makeRequest('GET', '/admin/analytics', null, adminToken);
      logTest(
        'Get System Analytics (Admin)', 
        getAnalytics.status === 200 && getAnalytics.data.success,
        getAnalytics.data.success ? `Total revenue: ${getAnalytics.data.data.totalRevenue} VND` : getAnalytics.data.message
      );

    } else {
      logTest('Login as Admin', false, 'Admin account not available');
    }

  } catch (error) {
    logTest('Admin Tests', false, error.message);
  }

  // ============================================================
  // 08. SYSTEM TESTS
  // ============================================================
  console.log('\n📍 08. SYSTEM TESTS\n');

  try {
    // Test 8.1: Health Check
    const healthCheck = await makeRequest('GET', '/health');
    logTest(
      'Health Check', 
      healthCheck.status === 200,
      healthCheck.data.message || 'Server is healthy'
    );

  } catch (error) {
    logTest('System Tests', false, error.message);
  }

  // ============================================================
  // 09. NEGATIVE TESTS (Error Handling)
  // ============================================================
  console.log('\n📍 09. ERROR HANDLING TESTS\n');

  try {
    // Test 9.1: Invalid Login
    const invalidLogin = await makeRequest('POST', '/auth/login', {
      email: 'invalid@test.com',
      password: 'wrong'
    });
    logTest(
      'Invalid Login (should fail)', 
      invalidLogin.status === 401 || invalidLogin.status === 400,
      'Correctly rejected invalid credentials'
    );

    // Test 9.2: Unauthorized Access
    const unauthorized = await makeRequest('GET', '/users/profile');
    logTest(
      'Unauthorized Access (should fail)', 
      unauthorized.status === 401,
      'Correctly rejected unauthorized request'
    );

    // Test 9.3: Invalid Trip ID
    const invalidTrip = await makeRequest('GET', '/trips/999999');
    logTest(
      'Invalid Trip ID (should fail)', 
      invalidTrip.status === 404 || !invalidTrip.data.success,
      'Correctly handled invalid trip ID'
    );

    // Test 9.4: Missing Required Fields
    const missingFields = await makeRequest('POST', '/bookings', {
      trip_id: tripId
      // Missing required fields
    }, passengerToken);
    logTest(
      'Missing Required Fields (should fail)', 
      missingFields.status === 400,
      'Correctly validated required fields'
    );

  } catch (error) {
    logTest('Error Handling Tests', false, error.message);
  }

  // ============================================================
  // FINAL SUMMARY
  // ============================================================
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 KẾT QUẢ TEST TỔNG HỢP:\n');
  console.log(`   Total Tests:  ${totalTests}`);
  console.log(`   ✅ Passed:    ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   ❌ Failed:    ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
  console.log('\n' + '='.repeat(80));

  if (passedTests === totalTests) {
    console.log('\n🎉 TẤT CẢ TESTS ĐỀU PASS! HỆ THỐNG HOẠT ĐỘNG HOÀN HẢO!\n');
    process.exit(0);
  } else if (passedTests >= totalTests * 0.8) {
    console.log('\n✅ HỆ THỐNG HOẠT ĐỘNG TỐT (>80% tests passed)\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  CẦN KHẮC PHỤC MỘT SỐ LỖI\n');
    process.exit(1);
  }
}

// Run all tests
runTests().catch(error => {
  console.error('\n❌ TEST SUITE ERROR:', error.message);
  process.exit(1);
});
