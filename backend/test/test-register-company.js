// Test Bus Company Registration
// Run with: node test-register-company.js

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBusCompanyRegistration() {
  console.log('🧪 Testing Bus Company Registration\n');
  console.log('=' .repeat(60));

  try {
    // Generate unique email with timestamp
    const timestamp = Date.now();
    const testData = {
      email: `testcompany${timestamp}@test.com`,
      password: 'Test123456',
      full_name: 'Test Company Owner',
      phone: '0123456789',
      role: 'bus_company',
      company_name: `Test Bus Company ${timestamp}`,
      address: '123 Test Street, Test City, Vietnam',
      tax_code: '' // Empty tax code to test null handling
    };

    console.log('📝 Test Data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n' + '='.repeat(60));

    console.log('\n🚀 Sending registration request...\n');

    const response = await axios.post(`${API_URL}/auth/register`, testData);

    console.log('✅ Registration Successful!\n');
    console.log('📊 Response:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log('\n' + '='.repeat(60));
      console.log('✅ TEST PASSED!');
      console.log('=' .repeat(60));
      console.log('\n📋 Next Steps:');
      console.log('1. Login as admin: admin@bus.com / Admin123456');
      console.log('2. Go to Admin > Quản lý nhà xe');
      console.log('3. Filter by "Chờ duyệt"');
      console.log('4. You should see:', testData.company_name);
      console.log('5. Approve or reject the company');
      console.log('\n🔑 Test Account Created:');
      console.log('   Email:', testData.email);
      console.log('   Password:', testData.password);
    }

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ TEST FAILED!');
    console.log('=' .repeat(60));
    
    if (error.response) {
      console.log('\n📊 Error Response:');
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
      console.log('\nFull Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('\n🔌 Connection Error:');
      console.log('Cannot connect to server at', API_URL);
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend');
      console.log('   node app.js');
    } else {
      console.log('\n⚠️ Unexpected Error:');
      console.log(error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
}

// Run the test
testBusCompanyRegistration();
