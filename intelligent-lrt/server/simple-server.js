// A simplified server to test network connectivity issues
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Simple test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint accessed!');
  res.json({ 
    status: 'success', 
    message: 'Simple server is up and running!', 
    time: new Date().toISOString() 
  });
});

// Simple stations endpoint for testing
app.get('/api/stations', (req, res) => {
  console.log('Stations endpoint accessed!');
  res.json([
    { id: 1, name: 'Ragama', location: { lat: 7.0322, lng: 79.9170 } },
    { id: 2, name: 'Kirulapona', location: { lat: 6.8720, lng: 79.8789 } },
  ]);
});

// Use port 8081 which we know works with http-server
const PORT = 8081;

// Start the server listening on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple test server running on port ${PORT}`);
  console.log(`Access test endpoint at: http://localhost:${PORT}/test`);
  console.log(`Access API endpoint at: http://localhost:${PORT}/api/stations`);
});
