// Simple Express server for Glitch.com
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Basic JSON parsing
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint accessed');
  res.json({ 
    status: 'success', 
    message: 'API is working!', 
    time: new Date().toISOString() 
  });
});

// Mock stations data
const stations = [
  { 
    id: 1, 
    name: 'Ragama', 
    location: { lat: 7.0322, lng: 79.9170 },
    facilities: ['Ticket Counter', 'Waiting Area', 'Restrooms'],
    nextTrains: ['7:30 AM', '8:15 AM', '9:00 AM'] 
  },
  { 
    id: 2, 
    name: 'Kirulapona', 
    location: { lat: 6.8720, lng: 79.8789 },
    facilities: ['Ticket Counter', 'Cafe', 'Restrooms'],
    nextTrains: ['7:45 AM', '8:30 AM', '9:15 AM']
  },
  {
    id: 3,
    name: 'Colombo Fort',
    location: { lat: 6.9344, lng: 79.8428 },
    facilities: ['Ticket Counter', 'Information Desk', 'Restrooms', 'Food Court'],
    nextTrains: ['7:15 AM', '7:45 AM', '8:15 AM']
  }
];

// API Endpoints
app.get('/api/stations', (req, res) => {
  console.log('Stations endpoint accessed');
  res.json(stations);
});

app.get('/api/stations/:id', (req, res) => {
  const station = stations.find(s => s.id === parseInt(req.params.id));
  if (!station) return res.status(404).json({ error: 'Station not found' });
  res.json(station);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
