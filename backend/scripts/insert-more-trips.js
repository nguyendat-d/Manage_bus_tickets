// Insert more trips with future dates
require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function insertMoreTrips() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'thanhdat12345',
    database: process.env.DB_NAME || 'bus_ticket_management'
  });

  try {
    console.log('✅ Connected to database');

    // Get approved companies and buses
    const [companies] = await connection.execute('SELECT id FROM bus_companies WHERE status = "approved"');
    const [buses] = await connection.execute('SELECT id FROM buses');
    const [routeList] = await connection.execute('SELECT id FROM routes WHERE status = "active"');

    if (companies.length === 0 || buses.length === 0) {
      console.log('❌ No companies or buses found. Please add them first.');
      return;
    }

    console.log(`Found ${companies.length} companies, ${buses.length} buses, ${routeList.length} routes`);

    // Delete old trips
    await connection.execute('DELETE FROM trips WHERE departure_time < NOW()');
    console.log('🗑️ Deleted old trips');

    // Generate trips for next 7 days
    const today = new Date();
    let totalInserted = 0;

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      const dateStr = currentDate.toISOString().split('T')[0];

      for (let route of routeList) {
        // Random company and bus
        const company = companies[Math.floor(Math.random() * companies.length)];
        const bus = buses[Math.floor(Math.random() * buses.length)];

        // Create 4 trips per route per day (morning, noon, afternoon, evening)
        const times = [
          { dep: `${dateStr} 06:00:00`, arr: `${dateStr} 12:00:00` },
          { dep: `${dateStr} 10:00:00`, arr: `${dateStr} 16:00:00` },
          { dep: `${dateStr} 14:00:00`, arr: `${dateStr} 20:00:00` },
          { dep: `${dateStr} 20:00:00`, arr: `${dateStr} 02:00:00` }
        ];

        for (let time of times) {
          const price = 150000 + Math.floor(Math.random() * 350000);
          await connection.execute(`
            INSERT INTO trips (route_id, bus_company_id, bus_id, departure_time, arrival_time, price, available_seats, status)
            VALUES (?, ?, ?, ?, ?, ?, 40, 'scheduled')
          `, [route.id, company.id, bus.id, time.dep, time.arr, price]);
          totalInserted++;
        }
      }
    }

    console.log(`✅ Inserted ${totalInserted} trips for next 7 days`);

    // Show summary
    const [tripCount] = await connection.execute('SELECT COUNT(*) as count FROM trips WHERE status = "scheduled"');
    console.log(`\n📊 Total scheduled trips: ${tripCount[0].count}`);

    // Show sample trips
    console.log('\n🚌 Sample Trips:');
    const [sampleTrips] = await connection.execute(`
      SELECT 
        t.departure_time,
        r.departure_city,
        r.arrival_city,
        t.price,
        bc.company_name
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN bus_companies bc ON t.bus_company_id = bc.id
      WHERE t.status = 'scheduled'
      ORDER BY t.departure_time
      LIMIT 10
    `);

    sampleTrips.forEach(trip => {
      const date = new Date(trip.departure_time).toLocaleString('vi-VN');
      console.log(`   ${date}: ${trip.departure_city} → ${trip.arrival_city} (${trip.price.toLocaleString()}đ) - ${trip.company_name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

insertMoreTrips();
