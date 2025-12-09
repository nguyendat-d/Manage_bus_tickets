const pool = require('../config/database');

(async () => {
  try {
    // Check routes
    const [routes] = await pool.query('SELECT id, departure_city, arrival_city FROM routes WHERE departure_city LIKE "%Ho Chi Minh%" AND arrival_city LIKE "%Da Lat%"');
    console.log('HCM -> Da Lat Routes:');
    console.log(JSON.stringify(routes, null, 2));
    
    if (routes.length > 0) {
      const routeId = routes[0].id;
      const [trips] = await pool.query('SELECT id, route_id, bus_company_id, departure_time FROM trips WHERE route_id = ?', [routeId]);
      console.log(`\nTrips for route ${routeId}:`);
      console.log(JSON.stringify(trips, null, 2));
    }
    
    // Check all trips by route
    const [tripsByRoute] = await pool.query('SELECT route_id, COUNT(*) as cnt FROM trips GROUP BY route_id');
    console.log('\nTrips count by route_id:');
    console.log(JSON.stringify(tripsByRoute, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
