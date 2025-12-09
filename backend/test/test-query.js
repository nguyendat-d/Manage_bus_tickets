// Test database query
const pool = require('../config/database');

(async () => {
  try {
    console.log('Testing database queries...\n');
    
    // Test 1: Check routes
    const [routes] = await pool.query(
      `SELECT * FROM routes WHERE departure_city LIKE ? AND arrival_city LIKE ?`,
      ['%Ho Chi Minh%', '%Da Lat%']
    );
    console.log(`✅ Routes found: ${routes.length}`);
    if (routes.length > 0) {
      console.log('Route sample:', routes[0]);
    }
    
    // Test 2: Check trips for that route
    if (routes.length > 0) {
      const [trips] = await pool.query(
        `SELECT * FROM trips WHERE route_id = ? AND DATE(departure_time) = ?`,
        [routes[0].id, '2025-12-15']
      );
      console.log(`\n✅ Trips found: ${trips.length}`);
      if (trips.length > 0) {
        console.log('Trip sample:', trips[0]);
      }
    }
    
    // Test 3: Full join query
    const [fullResult] = await pool.query(`
      SELECT 
        t.*,
        r.departure_city, r.arrival_city,
        bc.company_name,
        b.bus_type
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN bus_companies bc ON t.bus_company_id = bc.id
      JOIN buses b ON t.bus_id = b.id
      WHERE r.departure_city LIKE ? 
      AND r.arrival_city LIKE ?
      AND DATE(t.departure_time) = ?
      AND t.status = 'scheduled'
      AND bc.status = 'approved'
    `, ['%Ho Chi Minh%', '%Da Lat%', '2025-12-15']);
    
    console.log(`\n✅ Full query result: ${fullResult.length} trips`);
    if (fullResult.length > 0) {
      console.log('\nTrips details:');
      fullResult.forEach(trip => {
        console.log(`- ${trip.company_name}: ${trip.departure_city} → ${trip.arrival_city} at ${trip.departure_time}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
})();
