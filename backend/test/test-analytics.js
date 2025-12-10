const pool = require('../config/database');

async function testAnalytics() {
  try {
    console.log('🧪 Testing Analytics Queries (Full Test)\n');
    console.log('==========================================\n');
    
    // Test 1: Revenue stats
    try {
      const [revenueStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_bookings,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as average_booking,
          COUNT(DISTINCT user_id) as unique_customers
         FROM bookings 
         WHERE payment_status = 'paid'`
      );
      console.log('✅ Revenue stats OK:', revenueStats[0]);
    } catch (e) {
      console.log('❌ Revenue stats ERROR:', e.message);
      console.log('   Stack:', e.stack);
    }
    
    // Test 2: Company stats
    try {
      const [companyStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_companies,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_companies,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_companies
         FROM bus_companies`
      );
      console.log('✅ Company stats OK:', companyStats[0]);
    } catch (e) {
      console.log('❌ Company stats ERROR:', e.message);
    }
    
    // Test 3: Popular routes (using query instead of execute)
    try {
      const [rows] = await pool.query(
        `SELECT 
          r.departure_city,
          r.arrival_city,
          COUNT(DISTINCT t.id) as trip_count,
          COUNT(b.id) as booking_count,
          COALESCE(SUM(b.total_amount), 0) as total_revenue
         FROM routes r
         INNER JOIN trips t ON r.id = t.route_id
         INNER JOIN bookings b ON t.id = b.trip_id
         WHERE b.payment_status = 'paid'
         GROUP BY r.id, r.departure_city, r.arrival_city
         ORDER BY total_revenue DESC
         LIMIT 5`
      );
      console.log('✅ Popular routes OK:', rows.length, 'routes');
      if (rows.length > 0) {
        console.log('   Sample:', rows[0]);
      } else {
        console.log('   ⚠️ No routes found - checking data...');
        const [check] = await pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM routes) as routes,
            (SELECT COUNT(*) FROM trips) as trips,
            (SELECT COUNT(*) FROM bookings WHERE payment_status='paid') as paid_bookings
        `);
        console.log('   Data check:', check[0]);
      }
    } catch (e) {
      console.log('❌ Popular routes ERROR:', e.message);
      console.log('   Stack:', e.stack);
    }
    
    // Test 4: Monthly revenue
    try {
      const [monthlyRevenue] = await pool.execute(
        `SELECT 
          YEAR(created_at) as year,
          MONTH(created_at) as month,
          SUM(total_amount) as monthly_revenue,
          COUNT(*) as booking_count
         FROM bookings 
         WHERE payment_status = 'paid'
         GROUP BY YEAR(created_at), MONTH(created_at)
         ORDER BY year DESC, month DESC
         LIMIT 6`
      );
      console.log('✅ Monthly revenue OK:', monthlyRevenue.length, 'months');
    } catch (e) {
      console.log('❌ Monthly revenue ERROR:', e.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await pool.end();
  }
}

testAnalytics();
