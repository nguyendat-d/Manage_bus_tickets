const pool = require('../config/database');

async function testAnalytics() {
  try {
    console.log('Testing analytics queries...\n');
    
    // Test 1: Revenue stats
    try {
      const [revenueStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_bookings,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as average_booking,
          COUNT(DISTINCT user_id) as unique_customers
         FROM bookings 
         WHERE payment_status = 'paid' 
           AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
      );
      console.log('✅ Revenue stats OK:', revenueStats[0]);
    } catch (e) {
      console.log('❌ Revenue stats ERROR:', e.message);
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
    
    // Test 3: Popular routes
    try {
      const [rows] = await pool.execute(
        `SELECT 
          r.*,
          COUNT(b.id) as booking_count,
          AVG(t.price) as average_price
         FROM routes r
         JOIN trips t ON r.id = t.route_id
         JOIN bookings b ON t.id = b.trip_id
         WHERE b.payment_status = 'paid'
         GROUP BY r.id
         ORDER BY booking_count DESC
         LIMIT ?`,
        [5]
      );
      console.log('✅ Popular routes OK:', rows.length, 'routes');
    } catch (e) {
      console.log('❌ Popular routes ERROR:', e.message);
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
