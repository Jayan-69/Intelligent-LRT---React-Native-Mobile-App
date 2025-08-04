// Optimized server for Replit with MongoDB timeout handling
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with optimized settings for Replit
const connectWithRetry = () => {
  console.log('MongoDB connection attempt...');
  
  // Optimized MongoDB options for Replit
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    socketTimeoutMS: 45000, // Longer socket timeout
    // Reduced poolSize for Replit's limited resources
    maxPoolSize: 5,
    minPoolSize: 1,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    // Only seed if needed - don't do this on every connection
    checkAndSeedData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

// Models
const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  stationType: { type: String, default: 'regular' },
  coordinates: { 
    latitude: { type: Number },
    longitude: { type: Number }
  },
  services: [String]
});

const trainSchema = new mongoose.Schema({
  trainCode: { type: String, required: true },
  trainType: { 
    type: String, 
    required: true,
    enum: ['I', 'E', 'S'] 
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  stops: [String],
  period: String,
  returnTrainCode: String,
  returnDepartureTime: String
});

const Station = mongoose.model('Station', stationSchema);
const Train = mongoose.model('Train', trainSchema);

// Minimal data for faster seeding
const stationsData = [
  { name: 'Ragama', code: 'RGM', stationType: 'major' },
  { name: 'Pahala Karagahamuna', code: 'PKG', stationType: 'minor' },
  { name: 'Kadawatha', code: 'KDW', stationType: 'major' },
  { name: 'Mahara', code: 'MHR', stationType: 'minor' },
  { name: 'Kiribathgoda', code: 'KBG', stationType: 'major' },
  { name: 'Maradana', code: 'MRD', stationType: 'major' },
  { name: 'Pettah', code: 'PTH', stationType: 'major' },
  { name: 'Bambalapitiya', code: 'BMB', stationType: 'major' },
  { name: 'Kirulapona', code: 'KLP', stationType: 'major' }
];

const trainScheduleData = [
  // Just a few essential trains for faster seeding
  {
    trainCode: 'E1',
    trainType: 'E',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:00 AM',
    stops: ['Ragama', 'Kadawatha', 'Kiribathgoda', 'Maradana', 'Pettah', 'Bambalapitiya', 'Kirulapona'],
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'I1',
    trainType: 'I',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '07:30 AM',
    stops: ['Ragama', 'Pettah', 'Kirulapona'],
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'S1',
    trainType: 'S',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '06:15 AM',
    stops: [
      'Ragama', 'Pahala Karagahamuna', 'Kadawatha', 'Mahara', 'Kiribathgoda',
      'Maradana', 'Pettah', 'Bambalapitiya', 'Kirulapona'
    ],
    period: 'Morning Office Hours'
  },
  {
    trainCode: 'E1-1',
    trainType: 'E',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '07:15 AM',
    stops: ['Kirulapona', 'Bambalapitiya', 'Pettah', 'Maradana', 'Kiribathgoda', 'Kadawatha', 'Ragama'],
    period: 'Morning Office Hours'
  }
];

// Check if data exists and seed if needed
async function checkAndSeedData() {
  try {
    // Only seed if no stations exist
    const stationCount = await Station.countDocuments().maxTimeMS(5000);
    if (stationCount === 0) {
      console.log('Seeding station data...');
      await Station.insertMany(stationsData);
      console.log(`${stationsData.length} stations added`);
    } else {
      console.log(`${stationCount} stations already exist, skipping station seeding`);
    }

    // Only seed if no trains exist
    const trainCount = await Train.countDocuments().maxTimeMS(5000);
    if (trainCount === 0) {
      console.log('Seeding train data...');
      await Train.insertMany(trainScheduleData);
      console.log(`${trainScheduleData.length} trains added`);
    } else {
      console.log(`${trainCount} trains already exist, skipping train seeding`);
    }
  } catch (err) {
    console.error('Error during data seeding:', err);
  }
}

// Helper function for fare calculation
function calculateFare(fromStation, toStation, trainType) {
  // Base fares by distance and train type
  const baseFares = {
    'I': { short: 200, medium: 300, long: 400 },
    'E': { short: 125, medium: 175, long: 200 },
    'S': { short: 100, medium: 125, long: 175 }
  };
  
  // Simple distance calculation
  const stations = stationsData.map(s => s.name);
  const fromIndex = stations.indexOf(fromStation);
  const toIndex = stations.indexOf(toStation);
  
  if (fromIndex === -1 || toIndex === -1) {
    return 100; // Default fare if stations not found
  }
  
  const stationCount = Math.abs(fromIndex - toIndex);
  
  // Determine distance category
  let distanceCategory;
  if (stationCount <= 2) {
    distanceCategory = 'short';
  } else if (stationCount <= 5) {
    distanceCategory = 'medium';
  } else {
    distanceCategory = 'long';
  }
  
  return baseFares[trainType][distanceCategory];
}

// Simple helper function to get train type full name
function getTrainTypeName(code) {
  switch(code) {
    case 'I': return 'intercity';
    case 'E': return 'express';
    case 'S': return 'slow';
    default: return 'unknown';
  }
}

// API Routes

// Root route - Health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Intelligent LRT API is running',
    serverTime: new Date().toISOString()
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is up and running!',
    serverTime: new Date().toISOString()
  });
});

// Get all stations with proper error handling
app.get('/api/stations', async (req, res) => {
  try {
    // Use lean() and timeout for better performance
    const stations = await Station.find().lean().maxTimeMS(5000);
    
    // Transform for frontend
    const transformedStations = stations.map(station => ({
      id: station._id.toString(),
      name: station.name,
      code: station.code || '',
      stationType: station.stationType || 'regular',
      coordinates: station.coordinates || { latitude: 0, longitude: 0 },
      services: station.services || []
    }));
    
    res.json(transformedStations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ 
      message: 'Failed to fetch stations', 
      error: err.message 
    });
  }
});

// Find trains between stations endpoint
app.post('/api/find', async (req, res) => {
  try {
    const { fromStation, toStation } = req.body;
    console.log(`Finding trains from ${fromStation} to ${toStation}`);
    
    if (!fromStation || !toStation) {
      return res.status(400).json({ 
        message: 'Both fromStation and toStation are required' 
      });
    }
    
    // Find matching trains with stops containing both stations
    const trains = await Train.find({
      stops: { $all: [fromStation, toStation] }
    }).lean().maxTimeMS(5000);
    
    // Filter to ensure stops are in correct order
    const matchingTrains = trains.filter(train => {
      const fromIndex = train.stops.indexOf(fromStation);
      const toIndex = train.stops.indexOf(toStation);
      return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });
    
    // Transform for frontend
    const transformedTrains = matchingTrains.map(train => {
      const fare = calculateFare(fromStation, toStation, train.trainType);
      
      return {
        id: train._id.toString(),
        trainCode: train.trainCode,
        trainType: getTrainTypeName(train.trainType),
        departureTime: train.departureTime,
        arrivalTime: '9:00 AM', // Placeholder
        durationMinutes: 45, // Placeholder
        fare: fare,
        availableSeats: 100 // Placeholder
      };
    });
    
    res.json(transformedTrains);
  } catch (err) {
    console.error('Error finding trains:', err);
    res.status(500).json({ 
      message: 'Failed to find trains', 
      error: err.message 
    });
  }
});

// Calculate fare endpoint
app.post('/api/fare', (req, res) => {
  try {
    const { fromStation, toStation, trainType } = req.body;
    
    if (!fromStation || !toStation || !trainType) {
      return res.status(400).json({ 
        message: 'fromStation, toStation and trainType are required' 
      });
    }
    
    let trainTypeCode;
    // Convert full train type name to code
    switch(trainType.toLowerCase()) {
      case 'intercity': trainTypeCode = 'I'; break;
      case 'express': trainTypeCode = 'E'; break;
      case 'slow': trainTypeCode = 'S'; break;
      default: trainTypeCode = trainType;
    }
    
    const fare = calculateFare(fromStation, toStation, trainTypeCode);
    res.json({ fare });
  } catch (err) {
    console.error('Error calculating fare:', err);
    res.status(500).json({ 
      message: 'Failed to calculate fare', 
      error: err.message 
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
connectWithRetry();
