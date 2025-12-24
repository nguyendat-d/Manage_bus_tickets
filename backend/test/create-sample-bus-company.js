// Create sample bus company data for testing
require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createSampleBusCompany() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bus_ticket_management'
    });
    console.log('✅ Connected to database\n');

    // Check if bus company already exists
    const [existingCompanies] = await connection.execute(
      'SELECT * FROM bus_companies LIMIT 1'
    );

    if (existingCompanies.length > 0) {
      console.log('✅ Bus company already exists:');
      console.log(`   Company: ${existingCompanies[0].company_name}`);
      console.log(`   Status: ${existingCompanies[0].status}`);
      
      // Get user info
      const [users] = await connection.execute(
        'SELECT email, role FROM users WHERE id = ?',
        [existingCompanies[0].user_id]
      );
      
      if (users.length > 0) {
        console.log(`   Email: ${users[0].email}`);
        console.log(`   Role: ${users[0].role}`);
        console.log('\n💡 You can use this account to test the bus company dashboard');
      }

      // Check stats
      const [buses] = await connection.execute(
        'SELECT COUNT(*) as count FROM buses WHERE bus_company_id = ?',
        [existingCompanies[0].id]
      );
      const [trips] = await connection.execute(
        'SELECT COUNT(*) as count FROM trips WHERE bus_company_id = ?',
        [existingCompanies[0].id]
      );
      const [bookings] = await connection.execute(
        `SELECT COUNT(*) as count, SUM(total_amount) as revenue 
         FROM bookings b 
         JOIN trips t ON b.trip_id = t.id 
         WHERE t.bus_company_id = ? AND b.payment_status = 'paid'`,
        [existingCompanies[0].id]
      );

      console.log('\n📊 Current Stats:');
      console.log(`   Buses: ${buses[0].count}`);
      console.log(`   Trips: ${trips[0].count}`);
      console.log(`   Bookings: ${bookings[0].count}`);
      console.log(`   Revenue: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookings[0].revenue || 0)}`);
      
      return;
    }

    console.log('📝 Creating sample bus company...\n');

    // Step 1: Create user for bus company
    console.log('Step 1: Creating user account...');
    const hashedPassword = await bcrypt.hash('buscompany123', 10);
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password, full_name, phone, role, email_verified) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['buscompany@example.com', hashedPassword, 'Sample Bus Company Owner', '0901234567', 'bus_company', true]
    );
    const userId = userResult.insertId;
    console.log(`✅ User created with ID: ${userId}`);

    // Step 2: Create bus company
    console.log('Step 2: Creating bus company...');
    const [companyResult] = await connection.execute(
      `INSERT INTO bus_companies (user_id, company_name, tax_code, address, phone, email, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, 'Nhà Xe Mẫu ABC', '0123456789', '123 Đường ABC, Quận 1, TP.HCM', '0281234567', 'buscompany@example.com', 'approved']
    );
    const companyId = companyResult.insertId;
    console.log(`✅ Bus company created with ID: ${companyId}`);

    // Step 3: Create sample buses
    console.log('Step 3: Creating sample buses...');
    const buses = [
      ['51A-12345', 'limousine', 40, 'WiFi, AC, TV'],
      ['51B-67890', 'sleeper', 32, 'WiFi, AC, Blanket, Pillow'],
      ['51C-11111', 'standard', 45, 'AC']
    ];

    for (const bus of buses) {
      await connection.execute(
        `INSERT INTO buses (bus_company_id, license_plate, bus_type, total_seats, amenities, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [companyId, ...bus, 'active']
      );
    }
    console.log(`✅ Created ${buses.length} buses`);

    // Step 4: Get some routes
    console.log('Step 4: Getting available routes...');
    const [routes] = await connection.execute('SELECT id FROM routes LIMIT 3');
    
    if (routes.length === 0) {
      console.log('⚠️  No routes found. Creating sample routes...');
      const sampleRoutes = [
        ['Hà Nội', 'Hải Phòng', 120, '02:30:00'],
        ['Hà Nội', 'Đà Nẵng', 760, '12:00:00'],
        ['TP.HCM', 'Đà Lạt', 300, '06:00:00']
      ];

      for (const route of sampleRoutes) {
        await connection.execute(
          `INSERT INTO routes (departure_city, arrival_city, distance_km, duration) 
           VALUES (?, ?, ?, ?)`,
          route
        );
      }
      console.log(`✅ Created ${sampleRoutes.length} routes`);
      
      // Re-fetch routes
      const [newRoutes] = await connection.execute('SELECT id FROM routes LIMIT 3');
      routes.push(...newRoutes);
    }

    // Step 5: Get bus IDs
    const [busIds] = await connection.execute(
      'SELECT id FROM buses WHERE bus_company_id = ?',
      [companyId]
    );

    // Step 6: Create sample trips
    console.log('Step 5: Creating sample trips...');
    const now = new Date();
    let tripCount = 0;

    for (let i = 0; i < 10; i++) {
      const departureDate = new Date(now);
      departureDate.setDate(now.getDate() + i);
      departureDate.setHours(8 + (i % 3) * 4, 0, 0, 0);

      const arrivalDate = new Date(departureDate);
      arrivalDate.setHours(arrivalDate.getHours() + 3);

      const routeId = routes[i % routes.length].id;
      const busId = busIds[i % busIds.length].id;

      await connection.execute(
        `INSERT INTO trips (bus_company_id, route_id, bus_id, departure_time, arrival_time, base_price, available_seats, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [companyId, routeId, busId, departureDate, arrivalDate, 250000 + (i * 50000), 40, 'scheduled']
      );
      tripCount++;
    }
    console.log(`✅ Created ${tripCount} trips`);

    console.log('\n✅ Sample bus company created successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Email: buscompany@example.com');
    console.log('   Password: buscompany123');
    console.log('\n🌐 You can now login at: http://localhost:3001/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

createSampleBusCompany();
