// Test trực tiếp query analytics
require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');

async function testDirectQuery() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bus_ticket_management',
    waitForConnections: true,
    connectionLimit: 10
  });

  try {
    console.log('🔍 Testing Popular Routes Query...\n');
    
    // Test query đơn giản trước
    const [simpleTest] = await pool.query(`
      SELECT r.id, r.departure_city, r.arrival_city
      FROM routes r
      LIMIT 3
    `);
    console.log('✅ Simple routes query works:', simpleTest.length);

    // Test với JOIN
    const [withTrips] = await pool.query(`
      SELECT 
        r.id,
        r.departure_city,
        r.arrival_city,
        COUNT(DISTINCT t.id) as trip_count
      FROM routes r
      LEFT JOIN trips t ON r.id = t.route_id
      GROUP BY r.id, r.departure_city, r.arrival_city
      LIMIT 3
    `);
    console.log('✅ Routes with trips:', withTrips);

    // Test với bookings
    const [withBookings] = await pool.query(`
      SELECT 
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
      LIMIT 5
    `);
    console.log('\n✅ Popular routes query result:', withBookings);

    if (withBookings.length === 0) {
      console.log('\n⚠️ Không có dữ liệu! Checking database...');
      
      const [bookingCount] = await pool.query(`SELECT COUNT(*) as count FROM bookings WHERE payment_status = 'paid'`);
      console.log('Paid bookings:', bookingCount[0].count);
      
      const [tripCount] = await pool.query(`SELECT COUNT(*) as count FROM trips`);
      console.log('Total trips:', tripCount[0].count);
      
      const [routeCount] = await pool.query(`SELECT COUNT(*) as count FROM routes`);
      console.log('Total routes:', routeCount[0].count);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testDirectQuery();
