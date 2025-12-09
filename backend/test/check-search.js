const pool = require('../config/database');

(async () => {
  try {
    console.log('🔍 Checking search trips...\n');
    
    // Test 1: Tìm tất cả routes từ HCM
    const [routes] = await pool.query(`
      SELECT id, departure_city, arrival_city, departure_station, arrival_station
      FROM routes
      WHERE departure_city LIKE '%Ho Chi Minh%' OR departure_city LIKE '%HCM%' OR departure_city LIKE '%Hồ Chí Minh%'
    `);
    
    console.log('📍 Routes from HCM:', JSON.stringify(routes, null, 2));
    
    // Test 2: Tìm tất cả trips ngày 2025-12-15
    const [trips] = await pool.query(`
      SELECT t.id, t.departure_time, r.departure_city, r.arrival_city, t.status
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      WHERE DATE(t.departure_time) = '2025-12-15'
    `);
    
    console.log('\n🚌 Trips on 2025-12-15:', JSON.stringify(trips, null, 2));
    
    // Test 3: Full search query như API
    const [searchResult] = await pool.query(`
      SELECT 
        t.id, t.departure_time, t.price, t.status,
        r.departure_city, r.arrival_city,
        bc.company_name, bc.status as bc_status
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
    
    console.log('\n🎯 Full Search Result:', JSON.stringify(searchResult, null, 2));
    
    if (searchResult.length === 0) {
      console.log('\n⚠️  Không tìm thấy kết quả. Kiểm tra:');
      console.log('- departure_city có chứa "Ho Chi Minh"?');
      console.log('- arrival_city có chứa "Da Lat"?');
      console.log('- departure_time có đúng ngày 2025-12-15?');
      console.log('- trip status = "scheduled"?');
      console.log('- bus_company status = "approved"?');
    }
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
})();
