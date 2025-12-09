const fs = require('fs');
const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'thanhdat12345',
  database: 'bus_ticket_management',
  multipleStatements: true
});

const sql = fs.readFileSync('database/insert_trips.sql', 'utf8');

conn.query(sql, (err, results) => {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Trips inserted successfully!');
  
  // Get last result (SELECT COUNT)
  const lastResult = results[results.length - 1];
  if (lastResult && lastResult[0]) {
    console.log(`📊 Total trips: ${lastResult[0].total_trips}`);
  }
  
  conn.end();
  process.exit(0);
});
