// Test Bus Company Stats API
require('dotenv').config({ path: '../.env' });
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBusCompanyStats() {
  try {
    console.log('🧪 Testing Bus Company Stats API...\n');

    // Step 1: Login as bus company
    console.log('Step 1: Login as bus company owner...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'buscompany@example.com', // Change this to your actual bus company email
      password: 'password123'
    });

    const token = loginRes.data.data.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 20) + '...\n');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Step 2: Get bus company stats
    console.log('Step 2: Get bus company stats...');
    const statsRes = await axios.get(`${API_URL}/bus-companies/stats`, config);
    
    console.log('✅ Stats fetched successfully:');
    console.log(JSON.stringify(statsRes.data, null, 2));
    console.log('\n📊 Summary:');
    console.log(`- Total Trips: ${statsRes.data.data.totalTrips}`);
    console.log(`- Total Buses: ${statsRes.data.data.totalBuses}`);
    console.log(`- Total Bookings: ${statsRes.data.data.totalBookings}`);
    console.log(`- Revenue: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(statsRes.data.data.revenue)}`);

    // Step 3: Get trips
    console.log('\nStep 3: Get trips...');
    const tripsRes = await axios.get(`${API_URL}/bus-companies/trips`, config);
    console.log(`✅ Trips count: ${tripsRes.data.data?.trips?.length || tripsRes.data.data?.length || 0}`);

    // Step 4: Get buses
    console.log('\nStep 4: Get buses...');
    const busesRes = await axios.get(`${API_URL}/bus-companies/buses`, config);
    console.log(`✅ Buses count: ${busesRes.data.data?.buses?.length || busesRes.data.data?.length || 0}`);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      console.log('\n💡 Tip: Make sure you have a bus company account. You can create one by:');
      console.log('   1. Register a new account at http://localhost:3001/register');
      console.log('   2. Login and go to /bus-company/register to register as a bus company');
      console.log('   3. Wait for admin approval or approve it manually in database');
      console.log('   4. Update the email/password in this test script');
    }
  }
}

testBusCompanyStats();
