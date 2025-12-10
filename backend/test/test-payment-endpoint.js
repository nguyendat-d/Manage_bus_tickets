// Test payment endpoint
require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Admin credentials (use actual admin credentials from your database)
const adminCredentials = {
  email: 'admin@bus.com',
  password: 'Admin123456'
};

async function testPaymentEndpoint() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login as admin
    const loginResponse = await axios.post(`${API_URL}/auth/login`, adminCredentials);
    const token = loginResponse.data.token;
    
    if (!token) {
      console.error('❌ Failed to get token');
      return;
    }
    
    console.log('✅ Login successful');
    console.log('📡 Fetching payments...');
    
    // Get all payments
    const paymentsResponse = await axios.get(`${API_URL}/payments/admin/all?page=1&limit=20`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Payment endpoint working!');
    console.log('📊 Response:', JSON.stringify(paymentsResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testPaymentEndpoint();
