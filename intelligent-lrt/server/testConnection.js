// Test connection script for debugging API connectivity
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Station = require('./models/Station');

const app = express();

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint accessed!');
  res.json({ 
    status: 'success', 
    message: 'Server is up and running!', 
    serverTime: new Date().toISOString(),
    clientIP: req.ip,
    headers: req.headers
  });
});

// Stations endpoint
app.get('/api/trains/stations', async (req, res) => {
  try {
    const stations = await Station.find().sort('name');
    console.log(`Found ${stations.length} stations`);
    res.json({
      status: 'success',
      count: stations.length,
      data: stations.map(s => s.name)
    });
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ 
      status: 'error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// DB Connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    
    // Get and log the list of collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Count stations
    const stationCount = await Station.countDocuments();
    console.log(`Found ${stationCount} stations in database`);
    
    // List some stations for verification
    if (stationCount > 0) {
      const sampleStations = await Station.find().limit(5);
      console.log('Sample stations:', sampleStations.map(s => s.name));
    }
    
    const PORT = process.env.PORT || 5001;
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Listening on all network interfaces (0.0.0.0)`);
      console.log(`To test locally, visit: http://localhost:${PORT}/test`);
      console.log(`For your phone, try: http://192.168.8.128:${PORT}/test`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Start the server
startServer();
