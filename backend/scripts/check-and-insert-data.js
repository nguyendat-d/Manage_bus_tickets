// Check and insert sample data
require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function checkAndInsertData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'thanhdat12345',
    database: process.env.DB_NAME || 'bus_ticket_management'
  });

  try {
    console.log('✅ Connected to database');

    // Check routes
    const [routes] = await connection.execute('SELECT COUNT(*) as count FROM routes');
    console.log(`📍 Routes: ${routes[0].count}`);

    // Check trips
    const [trips] = await connection.execute('SELECT COUNT(*) as count FROM trips');
    console.log(`🚌 Trips: ${trips[0].count}`);

    // Check bus companies
    const [companies] = await connection.execute('SELECT COUNT(*) as count FROM bus_companies WHERE status = "approved"');
    console.log(`🏢 Approved Companies: ${companies[0].count}`);

    // Check buses
    const [buses] = await connection.execute('SELECT COUNT(*) as count FROM buses');
    console.log(`🚐 Buses: ${buses[0].count}`);

    // If no routes, insert sample routes
    if (routes[0].count === 0) {
      console.log('\n📍 Inserting sample routes...');
      await connection.execute(`
        INSERT INTO routes (departure_city, departure_station, arrival_city, arrival_station, distance_km, estimated_duration_minutes, status)
        VALUES 
        ('Hồ Chí Minh', 'Bến xe Miền Đông', 'Đà Lạt', 'Bến xe Đà Lạt', 308, 390, 'active'),
        ('Hồ Chí Minh', 'Bến xe Miền Đông', 'Vũng Tàu', 'Bến xe Vũng Tàu', 125, 150, 'active'),
        ('Hồ Chí Minh', 'Bến xe Miền Tây', 'Cần Thơ', 'Bến xe Cần Thơ', 169, 210, 'active'),
        ('Hà Nội', 'Bến xe Mỹ Đình', 'Hải Phòng', 'Bến xe Hải Phòng', 102, 120, 'active'),
        ('Hà Nội', 'Bến xe Giáp Bát', 'Ninh Bình', 'Bến xe Ninh Bình', 95, 150, 'active'),
        ('Đà Nẵng', 'Bến xe Đà Nẵng', 'Huế', 'Bến xe Huế', 96, 180, 'active')
      `);
      console.log('✅ Sample routes inserted');
    }

    // Get first approved company and bus for sample trips
    const [company] = await connection.execute('SELECT id FROM bus_companies WHERE status = "approved" LIMIT 1');
    const [bus] = await connection.execute('SELECT id FROM buses LIMIT 1');

    if (company.length > 0 && bus.length > 0 && trips[0].count === 0) {
      console.log('\n🚌 Inserting sample trips...');
      
      const [routeList] = await connection.execute('SELECT id FROM routes LIMIT 6');
      
      for (let route of routeList) {
        // Insert 3 trips per route with different times
        const times = [
          { dep: '2025-12-15 08:00:00', arr: '2025-12-15 14:00:00' },
          { dep: '2025-12-15 13:00:00', arr: '2025-12-15 19:00:00' },
          { dep: '2025-12-15 18:00:00', arr: '2025-12-16 00:00:00' }
        ];

        for (let time of times) {
          await connection.execute(`
            INSERT INTO trips (route_id, bus_company_id, bus_id, departure_time, arrival_time, price, available_seats, status)
            VALUES (?, ?, ?, ?, ?, ?, 40, 'scheduled')
          `, [route.id, company[0].id, bus[0].id, time.dep, time.arr, 250000 + Math.floor(Math.random() * 200000)]);
        }
      }
      
      console.log('✅ Sample trips inserted');
    }

    // Show current data
    console.log('\n📊 Current Data Summary:');
    const [finalRoutes] = await connection.execute('SELECT COUNT(*) as count FROM routes WHERE status = "active"');
    const [finalTrips] = await connection.execute('SELECT COUNT(*) as count FROM trips WHERE status = "scheduled"');
    console.log(`   Routes: ${finalRoutes[0].count}`);
    console.log(`   Trips: ${finalTrips[0].count}`);

    // Show some sample routes
    console.log('\n📍 Sample Routes:');
    const [sampleRoutes] = await connection.execute('SELECT departure_city, arrival_city FROM routes LIMIT 5');
    sampleRoutes.forEach(r => {
      console.log(`   ${r.departure_city} → ${r.arrival_city}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkAndInsertData();
