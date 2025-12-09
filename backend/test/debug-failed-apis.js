const http = require('http');

// Get token from login first
const loginData = JSON.stringify({
  email: 'passenger1@gmail.com',
  password: 'Password123!'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('🔐 Getting auth token...\n');

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.success && response.data.token) {
        const token = response.data.token;
        console.log(`✅ Token received: ${token.substring(0, 30)}...\n`);
        testAPIs(token);
      } else {
        console.error('❌ Login failed:', response.message);
      }
    } catch (e) {
      console.error('❌ Parse error:', e.message);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('❌ Login request error:', error.message);
});

loginReq.write(loginData);
loginReq.end();

function testAPIs(token) {
  console.log('Testing failed endpoints:\n');
  
  // Test 1: Get bookings
  testEndpoint('GET', '/api/bookings?page=1&limit=10', null, token, 'Get User Bookings');
  
  // Test 2: Get payment history
  setTimeout(() => {
    testEndpoint('GET', '/api/payments/history?page=1&limit=10', null, token, 'Get Payment History');
  }, 1000);
}

function testEndpoint(method, path, body, token, name) {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  console.log(`📍 Testing: ${name}`);
  console.log(`   ${method} ${path}`);

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`   Status: ${res.statusCode}`);
      try {
        const json = JSON.parse(data);
        console.log(`   Success: ${json.success}`);
        if (json.message) console.log(`   Message: ${json.message}`);
        if (json.success && json.data) {
          console.log(`   Data keys: ${Object.keys(json.data).join(', ')}`);
        }
      } catch (e) {
        console.log(`   Raw response: ${data.substring(0, 200)}`);
      }
      console.log('');
    });
  });

  req.on('error', (error) => {
    console.log(`   ❌ Error: ${error.message}\n`);
  });

  if (body) {
    req.write(JSON.stringify(body));
  }
  req.end();
}
