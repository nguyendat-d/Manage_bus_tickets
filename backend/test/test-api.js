const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/trips/search?from=Ho%20Chi%20Minh&to=Da%20Lat&date=2025-12-15',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    try {
      const json = JSON.parse(data);
      if (json.success) {
        console.log(`\n✅ Found ${json.data.trips.length} trips`);
      } else {
        console.log(`\n❌ Error: ${json.message}`);
      }
    } catch (e) {
      console.log('Failed to parse JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();
