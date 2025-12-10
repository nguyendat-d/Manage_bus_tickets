// Test Analytics API
const axios = require('axios');

async function testAnalytics() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@bus.com',
      password: 'Admin123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    console.log('\n📊 Fetching analytics...');
    const analyticsResponse = await axios.get('http://localhost:5000/api/admin/analytics', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = analyticsResponse.data.data;
    
    console.log('\n📈 ANALYTICS RESULTS:');
    console.log('====================');
    console.log('\n💰 REVENUE STATS:');
    console.log(`  - Total Bookings: ${data.revenue_stats.total_bookings}`);
    console.log(`  - Total Revenue: ${data.revenue_stats.total_revenue.toLocaleString('vi-VN')} VNĐ`);
    console.log(`  - Average Booking: ${data.revenue_stats.average_booking.toLocaleString('vi-VN')} VNĐ`);
    console.log(`  - Unique Customers: ${data.revenue_stats.unique_customers}`);
    
    console.log('\n🚌 COMPANY STATS:');
    console.log(`  - Total Companies: ${data.company_stats.total_companies}`);
    console.log(`  - Approved: ${data.company_stats.approved_companies}`);
    console.log(`  - Pending: ${data.company_stats.pending_approval}`);
    console.log(`  - Rejected: ${data.company_stats.rejected_companies}`);
    
    console.log('\n👥 USER STATS:');
    console.log(`  - Total Users: ${data.user_stats.total_users}`);
    console.log(`  - Passengers: ${data.user_stats.passengers}`);
    console.log(`  - Bus Companies: ${data.user_stats.bus_companies}`);
    console.log(`  - Admins: ${data.user_stats.admins}`);
    
    console.log('\n🔝 POPULAR ROUTES:');
    data.popular_routes.forEach((route, idx) => {
      console.log(`  ${idx + 1}. ${route.departure_city} → ${route.arrival_city}`);
      console.log(`     Bookings: ${route.booking_count}, Revenue: ${route.total_revenue.toLocaleString('vi-VN')} VNĐ`);
    });
    
    console.log('\n📅 MONTHLY REVENUE:');
    data.monthly_revenue.forEach(month => {
      console.log(`  ${month.month}: ${month.revenue.toLocaleString('vi-VN')} VNĐ (${month.booking_count} bookings)`);
    });
    
    console.log('\n💳 PAYMENT METHODS:');
    data.payment_stats.forEach(stat => {
      console.log(`  ${stat.payment_method}: ${stat.count} payments, ${stat.total_amount.toLocaleString('vi-VN')} VNĐ`);
    });
    
    console.log('\n📊 BOOKING STATUS:');
    data.booking_status_stats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat.count} bookings`);
    });
    
    console.log('\n✅ ANALYTICS API IS WORKING PERFECTLY!');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAnalytics();
