const http = require('http');

// Get tokens
async function getTokens() {
  const tokens = {};
  
  // Get passenger token
  const passengerLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'passenger1@gmail.com',
    password: 'Password123!'
  });
  if (passengerLogin.data.success) {
    tokens.passenger = passengerLogin.data.data.token;
  }
  
  // Get company token
  const companyLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'company1@gmail.com',
    password: 'Password123!'
  });
  if (companyLogin.data.success) {
    tokens.company = companyLogin.data.data.token;
  }
  
  // Get admin token
  const adminLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@gmail.com',
    password: 'Password123!'
  });
  if (adminLogin.data.success) {
    tokens.admin = adminLogin.data.data.token;
  }
  
  return tokens;
}

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testFailedAPIs() {
  console.log('🔍 DEBUGGING FAILED APIS\n');
  console.log('Getting authentication tokens...\n');
  
  const tokens = await getTokens();
  console.log(`✅ Passenger token: ${tokens.passenger ? 'OK' : 'FAIL'}`);
  console.log(`✅ Company token: ${tokens.company ? 'OK' : 'FAIL'}`);
  console.log(`✅ Admin token: ${tokens.admin ? 'OK' : 'FAIL'}\n`);
  
  console.log('='.repeat(70) + '\n');
  
  // Test Booking APIs
  console.log('📍 BOOKING SYSTEM\n');
  
  const bookings = await makeRequest('GET', '/api/bookings?page=1&limit=10', null, tokens.passenger);
  console.log(`1. Get User Bookings: ${bookings.status}`);
  console.log(`   Success: ${bookings.data.success}`);
  console.log(`   Message: ${bookings.data.message || 'No message'}`);
  if (bookings.status === 500) {
    console.log(`   ⚠️  Internal server error - check server logs\n`);
  } else {
    console.log('');
  }
  
  // Test Bus Company APIs
  console.log('📍 BUS COMPANY APIS\n');
  
  const buses = await makeRequest('GET', '/api/bus-companies/buses?page=1&limit=10', null, tokens.company);
  console.log(`2. Get Company Buses: ${buses.status}`);
  console.log(`   Success: ${buses.data.success}`);
  console.log(`   Message: ${buses.data.message || 'No message'}\n`);
  
  const trips = await makeRequest('GET', '/api/bus-companies/trips?page=1&limit=10', null, tokens.company);
  console.log(`3. Get Company Trips: ${trips.status}`);
  console.log(`   Success: ${trips.data.success}`);
  console.log(`   Message: ${trips.data.message || 'No message'}\n`);
  
  const companyBookings = await makeRequest('GET', '/api/bus-companies/bookings?page=1&limit=10', null, tokens.company);
  console.log(`4. Get Company Bookings: ${companyBookings.status}`);
  console.log(`   Success: ${companyBookings.data.success}`);
  console.log(`   Message: ${companyBookings.data.message || 'No message'}\n`);
  
  // Test Payment APIs
  console.log('📍 PAYMENT SYSTEM\n');
  
  const paymentHistory = await makeRequest('GET', '/api/payments/history?page=1&limit=10', null, tokens.passenger);
  console.log(`5. Get Payment History: ${paymentHistory.status}`);
  console.log(`   Success: ${paymentHistory.data.success}`);
  console.log(`   Message: ${paymentHistory.data.message || 'No message'}\n`);
  
  // Test Admin APIs
  console.log('📍 ADMIN OPERATIONS\n');
  
  const users = await makeRequest('GET', '/api/admin/users?page=1&limit=10', null, tokens.admin);
  console.log(`6. Get All Users: ${users.status}`);
  console.log(`   Success: ${users.data.success}`);
  console.log(`   Message: ${users.data.message || 'No message'}\n`);
  
  const companies = await makeRequest('GET', '/api/admin/bus-companies?page=1&limit=10', null, tokens.admin);
  console.log(`7. Get All Companies: ${companies.status}`);
  console.log(`   Success: ${companies.data.success}`);
  console.log(`   Message: ${companies.data.message || 'No message'}\n`);
  
  const routes = await makeRequest('GET', '/api/admin/routes?page=1&limit=10', null, tokens.admin);
  console.log(`8. Get All Routes: ${routes.status}`);
  console.log(`   Success: ${routes.data.success}`);
  console.log(`   Message: ${routes.data.message || 'No message'}\n`);
  
  const analytics = await makeRequest('GET', '/api/admin/analytics', null, tokens.admin);
  console.log(`9. Get Analytics: ${analytics.status}`);
  console.log(`   Success: ${analytics.data.success}`);
  console.log(`   Message: ${analytics.data.message || 'No message'}\n`);
  
  console.log('='.repeat(70));
}

testFailedAPIs().catch(console.error);
