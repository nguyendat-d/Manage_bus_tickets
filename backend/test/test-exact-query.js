const pool = require('../config/database');

(async () => {
  try {
    console.log('🧪 Testing exact query from tripController...\n');
    
    const from = 'Ho Chi Minh';
    const to = 'Da Lat';
    const date = '2025-12-15';
    const limit = 10;
    const offset = 0;
    
    const query = `
      SELECT 
        t.*,
        r.departure_city, r.departure_station,
        r.arrival_city, r.arrival_station,
        r.distance_km, r.estimated_duration_minutes,
        bc.company_name, bc.rating as company_rating,
        b.bus_type, b.amenities, b.total_seats
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN bus_companies bc ON t.bus_company_id = bc.id
      JOIN buses b ON t.bus_id = b.id
      WHERE r.departure_city LIKE ? AND r.arrival_city LIKE ?
      AND DATE(t.departure_time) = ?
      AND t.status = 'scheduled'
      AND bc.status = 'approved'
      ORDER BY departure_time ASC
      LIMIT ? OFFSET ?
    `;
    
    const queryParams = [
      `%${from}%`, 
      `%${to}%`, 
      date,
      parseInt(limit),
      offset
    ];
    
    console.log('📝 Query params:', queryParams);
    
    const [trips] = await pool.execute(query, queryParams);
    
    console.log('\n✅ Query executed successfully!');
    console.log(`Found ${trips.length} trips\n`);
    
    trips.forEach((trip, index) => {
      console.log(`Trip ${index + 1}:`);
      console.log(`  ID: ${trip.id}`);
      console.log(`  Company: ${trip.company_name}`);
      console.log(`  Route: ${trip.departure_city} → ${trip.arrival_city}`);
      console.log(`  Price: ${trip.price}`);
      console.log(`  Amenities type: ${typeof trip.amenities}`);
      console.log(`  Amenities value: ${JSON.stringify(trip.amenities)}`);
      console.log('');
    });
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
})();
