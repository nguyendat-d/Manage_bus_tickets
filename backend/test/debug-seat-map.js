const pool = require('../config/database');

(async () => {
  try {
    console.log('Testing seat map query...\n');
    
    const [trips] = await pool.execute(
      `SELECT 
        t.id, t.available_seats,
        b.seat_map, b.total_seats,
        bc.company_name
      FROM trips t
      JOIN buses b ON t.bus_id = b.id
      JOIN bus_companies bc ON t.bus_company_id = bc.id
      WHERE t.id = ?`,
      [34]
    );
    
    console.log('Query successful!');
    console.log('Trip found:', trips.length > 0);
    
    if (trips.length > 0) {
      const trip = trips[0];
      console.log('\nTrip data:');
      console.log('  ID:', trip.id);
      console.log('  Company:', trip.company_name);
      console.log('  Total seats:', trip.total_seats);
      console.log('  Available seats:', trip.available_seats);
      console.log('  Seat map type:', typeof trip.seat_map);
      console.log('  Seat map value:', trip.seat_map);
    }
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
})();
