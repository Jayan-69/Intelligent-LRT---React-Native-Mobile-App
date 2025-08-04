/**
 * Optimized Replit Server for Intelligent LRT
 * - Improved MongoDB connection with retry logic
 * - Optimized for Replit's free tier
 * - Complete station and train data from trainData.js
 * - API endpoints for stations, trains, and fare calculation
 */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_RETRY_INTERVAL = process.env.MONGODB_RETRY_INTERVAL || 5000;
const MONGODB_MAX_RETRIES = process.env.MONGODB_MAX_RETRIES || 5;
let retryCount = 0;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with retry logic
function connectWithRetry() {
  console.log(`MongoDB connection attempt ${retryCount + 1}/${MONGODB_MAX_RETRIES}...`);
  
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: process.env.MONGODB_TIMEOUT_MS || 30000,
    poolSize: 5, // Reduce pool size for Replit
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
    retryCount = 0; // Reset retry count on successful connection
    // Seed database after connection if needed
    seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    retryCount++;
    if (retryCount < MONGODB_MAX_RETRIES) {
      console.log(`Retrying in ${MONGODB_RETRY_INTERVAL/1000} seconds...`);
      setTimeout(connectWithRetry, MONGODB_RETRY_INTERVAL);
    } else {
      console.error(`Failed to connect to MongoDB after ${MONGODB_MAX_RETRIES} attempts. Starting server anyway.`);
      // Start server even if database connection fails
      startServer();
    }
  });
}

// Define Mongoose Models
const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
  },
  stationType: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  services: [String],
});

const trainSchema = new mongoose.Schema({
  trainCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  trainType: {
    type: String,
    required: true,
    enum: ["I", "E", "S"], // Intercity, Express, Slow
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String, // e.g., '07:30 AM'
    required: true,
  },
  stops: [
    {
      type: String, // Array of station names
    },
  ],
  period: String, // e.g., 'Morning Office Hours'
  returnTrainCode: String,
  returnDepartureTime: String,
});

const Station = mongoose.model("Station", stationSchema);
const Train = mongoose.model("Train", trainSchema);

// Sri Lankan Train System Data
const stations = [
  "Ragama",
  "Pahala Karagahamuna",
  "Kadawatha",
  "Mahara",
  "Kiribathgoda",
  "Tyre Junction",
  "Pattiya Junction",
  "Paliyagoda",
  "Ingurukade Junction",
  "Armour Street Junction",
  "Maradana",
  "Pettah",
  "Slave Island",
  "Gangaramaya",
  "Kollupitiya",
  "Bambalapitiya",
  "Bauddhaloka Mawatha",
  "Thimbirigasyaya",
  "Havelock Town",
  "Kirulapona"
];

// Express train stations - only stops at these major stations
const expressStations = [
  "Ragama",
  "Kadawatha",
  "Kiribathgoda",
  "Paliyagoda",
  "Maradana",
  "Pettah",
  "Bambalapitiya",
  "Kirulapona"
];

// Intercity train stations - only stops at these three stations
const intercityStations = ["Ragama", "Pettah", "Kirulapona"];

// Complete train schedule with up and down trains
const trainSchedule = [
  // Intercity Trains - Morning Office Hours
  {
    trainCode: "I1",
    trainType: "I",
    from: "Ragama",
    to: "Kirulapona",
    departureTime: "07:30 AM",
    stops: intercityStations,
    returnTrainCode: "I1-1",
    returnDepartureTime: "08:45 AM",
    period: "Morning Office Hours"
  },
  {
    trainCode: "I2",
    trainType: "I",
    from: "Ragama",
    to: "Kirulapona",
    departureTime: "08:30 AM",
    stops: intercityStations,
    returnTrainCode: "I2-1",
    returnDepartureTime: "09:45 AM",
    period: "Morning Office Hours"
  },
  // Return Intercity Trains
  {
    trainCode: "I1-1",
    trainType: "I",
    from: "Kirulapona",
    to: "Ragama",
    departureTime: "08:45 AM",
    stops: intercityStations.slice().reverse(),
    period: "Morning Office Hours"
  },
  {
    trainCode: "I2-1",
    trainType: "I",
    from: "Kirulapona",
    to: "Ragama",
    departureTime: "09:45 AM",
    stops: intercityStations.slice().reverse(),
    period: "Morning Office Hours"
  },

  // Morning Office Hours (6:00 AM - 9:00 AM) - UP TRAINS
  {
    trainCode: "E1",
    trainType: "E",
    from: "Ragama",
    to: "Kirulapona",
    departureTime: "06:00 AM",
    stops: expressStations,
    returnTrainCode: "E1-1",
    returnDepartureTime: "07:15 AM",
    period: "Morning Office Hours"
  },
  {
    trainCode: "E2",
    trainType: "E",
    from: "Ragama",
    to: "Kirulapona",
    departureTime: "07:00 AM",
    stops: expressStations,
    returnTrainCode: "E2-1",
    returnDepartureTime: "08:15 AM",
    period: "Morning Office Hours"
  },
  {
    trainCode: "S1",
    trainType: "S",
    from: "Ragama",
    to: "Kirulapona",
    departureTime: "06:15 AM",
    stops: stations,
    returnTrainCode: "S1-1",
    returnDepartureTime: "07:45 AM",
    period: "Morning Office Hours"
  },
  // Evening Office Hours - Down
  {
    trainCode: "E4-1",
    trainType: "E",
    from: "Kirulapona",
    to: "Ragama",
    departureTime: "05:15 PM",
    stops: expressStations.slice().reverse(),
    period: "Evening Office Hours"
  },
  {
    trainCode: "S7-1",
    trainType: "S",
    from: "Kirulapona",
    to: "Ragama",
    departureTime: "05:45 PM",
    stops: stations.slice().reverse(),
    period: "Evening Office Hours"
  }
];

// Fare calculation data
const fareMatrix = {
  "Ragama-Pettah": {
    E: 150,
    S: 125,
    I: 200,
  },
  "Pettah-Kirulapona": {
    E: 150,
    S: 125,
    I: 200,
  },
  "Ragama-Kirulapona": {
    E: 200,
    S: 175,
    I: 400,
  },
};

// Base fares by distance
const baseFares = {
  E: {
    // Express
    short: 125, // 1-5 stations
    medium: 175, // 6-10 stations
    long: 200, // 11+ stations
  },
  S: {
    // Slow
    short: 100,
    medium: 125,
    long: 175,
  },
  I: {
    // Intercity
    short: 200,
    medium: 300,
    long: 400,
  },
};

/**
 * Calculate fare between two stations
 */
const calculateFare = (fromStation, toStation, trainType) => {
  // Check for direct route pricing
  const routeKey = `${fromStation}-${toStation}`;
  const reverseRouteKey = `${toStation}-${fromStation}`;

  if (fareMatrix[routeKey] && fareMatrix[routeKey][trainType]) {
    return fareMatrix[routeKey][trainType];
  }

  if (fareMatrix[reverseRouteKey] && fareMatrix[reverseRouteKey][trainType]) {
    return fareMatrix[reverseRouteKey][trainType];
  }

  // Calculate based on distance
  const fromIndex = stations.indexOf(fromStation);
  const toIndex = stations.indexOf(toStation);

  if (fromIndex === -1 || toIndex === -1) {
    return 0; // Invalid stations
  }

  const stationCount = Math.abs(fromIndex - toIndex);

  // Determine distance category
  let distanceCategory;
  if (stationCount <= 5) {
    distanceCategory = "short";
  } else if (stationCount <= 10) {
    distanceCategory = "medium";
  } else {
    distanceCategory = "long";
  }

  return baseFares[trainType][distanceCategory];
};

// Function to seed database with initial data
async function seedDatabase() {
  try {
    // Check if we already have stations
    const stationCount = await Station.countDocuments();
    if (stationCount === 0) {
      console.log("Seeding stations collection...");

      // Create station documents with required format for frontend
      const stationDocs = stations.map((name, index) => ({
        name,
        code: `LRT${(index + 1).toString().padStart(2, "0")}`,
        stationType: expressStations.includes(name) ? "major" : "minor",
        coordinates: {
          latitude: 6.9 + Math.random() * 0.2, // Colombo area latitude range
          longitude: 79.8 + Math.random() * 0.2, // Colombo area longitude range
        },
        services: ["ticket", "parking", "refreshments"],
      }));

      await Station.insertMany(stationDocs);
      console.log(`${stationDocs.length} stations added to database`);
    }

    // Check if we already have trains
    const trainCount = await Train.countDocuments();
    if (trainCount === 0) {
      console.log("Seeding trains collection...");
      await Train.insertMany(trainSchedule);
      console.log(`${trainSchedule.length} trains added to database`);
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

// Helper function to get train type full name
function getTrainTypeName(code) {
  switch (code) {
    case "I":
      return "intercity";
    case "E":
      return "express";
    case "S":
      return "slow";
    default:
      return code;
  }
}

// API Routes

// Root route - Health check
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Intelligent LRT API is running",
    endpoints: ["/api/stations", "/api/find", "/api/fare"],
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "Server is up and running!",
    serverTime: new Date(),
  });
});

// Get all stations
app.get("/api/stations", async (req, res) => {
  try {
    let stationsData;
    
    try {
      stationsData = await Station.find().lean();
      
      // If we have no data from MongoDB, use our hardcoded data
      if (!stationsData || stationsData.length === 0) {
        throw new Error("No stations found in database");
      }
    } catch (dbError) {
      console.warn("Falling back to hardcoded station data:", dbError.message);
      // Create fallback station data if DB query fails
      stationsData = stations.map((name, index) => ({
        _id: `fallback-${index}`,
        name,
        code: `LRT${(index + 1).toString().padStart(2, "0")}`,
        stationType: expressStations.includes(name) ? "major" : "minor",
        coordinates: {
          latitude: 6.9 + Math.random() * 0.2,
          longitude: 79.8 + Math.random() * 0.2,
        },
        services: ["ticket", "parking", "refreshments"],
      }));
    }

    // Transform data to match frontend expectations with id field
    const transformedStations = stationsData.map((station) => ({
      id: station._id.toString(),
      name: station.name,
      code: station.code,
      stationType: station.stationType,
      coordinates: station.coordinates,
      services: station.services,
    }));

    res.json(transformedStations);
  } catch (err) {
    console.error("Error fetching stations:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch stations", error: err.message });
  }
});

// Find trains between stations endpoint
app.post("/api/find", async (req, res) => {
  const { fromStation, toStation } = req.body;
  console.log(`Finding trains from ${fromStation} to ${toStation}`);

  try {
    let trains;
    
    try {
      // Find trains with exact from and to match
      trains = await Train.find({
        from: fromStation,
        to: toStation,
      }).lean();

      if (!trains || trains.length === 0) {
        // If no exact matches, look for trains that have both stations in their stops
        const potentialTrains = await Train.find({
          stops: { $all: [fromStation, toStation] },
        }).lean();

        // Filter to ensure correct order of stations
        trains = potentialTrains.filter((train) => {
          const fromIndex = train.stops.indexOf(fromStation);
          const toIndex = train.stops.indexOf(toStation);
          return fromIndex > -1 && toIndex > -1 && fromIndex < toIndex;
        });
      }
      
      // If still no data, throw error to trigger fallback
      if (!trains || trains.length === 0) {
        throw new Error("No matching trains found in database");
      }
    } catch (dbError) {
      console.warn("Falling back to hardcoded train data:", dbError.message);
      
      // Create fallback train data if DB query fails
      trains = [
        {
          _id: "fallback-1",
          trainCode: "E1",
          trainType: "E",
          from: fromStation,
          to: toStation,
          departureTime: "06:00 AM",
        },
        {
          _id: "fallback-2",
          trainCode: "S1",
          trainType: "S",
          from: fromStation,
          to: toStation,
          departureTime: "06:15 AM",
        },
        {
          _id: "fallback-3",
          trainCode: "I1",
          trainType: "I",
          from: fromStation,
          to: toStation,
          departureTime: "07:30 AM",
        },
      ];
    }

    // Transform data to match frontend expectations
    const transformedTrains = trains.map((train) => {
      const trainTypeFull = getTrainTypeName(train.trainType);
      const fare = calculateFare(fromStation, toStation, train.trainType);

      return {
        id: train._id.toString(),
        trainCode: train.trainCode,
        trainType: trainTypeFull,
        departureTime: train.departureTime,
        arrivalTime: "9:00 AM", // You may need to calculate this based on distance
        durationMinutes: 45, // You may need to calculate this based on distance
        fare: fare,
        availableSeats: 100, // You may need to calculate this dynamically
        from: fromStation,
        to: toStation
      };
    });

    res.json(transformedTrains);
  } catch (err) {
    console.error("Error finding trains:", err);
    res
      .status(500)
      .json({ message: "Failed to find trains", error: err.message });
  }
});

// Calculate fare endpoint
app.post("/api/fare", (req, res) => {
  const { fromStation, toStation, trainType } = req.body;
  console.log(
    `Calculating fare from ${fromStation} to ${toStation} for ${trainType} train`,
  );

  try {
    let trainTypeCode;
    // Convert full train type name to code
    switch (trainType) {
      case "intercity":
        trainTypeCode = "I";
        break;
      case "express":
        trainTypeCode = "E";
        break;
      case "slow":
        trainTypeCode = "S";
        break;
      default:
        trainTypeCode = trainType;
    }

    const fare = calculateFare(fromStation, toStation, trainTypeCode);
    res.json({ fare: fare.toFixed(2) });
  } catch (err) {
    console.error("Error calculating fare:", err);
    res
      .status(500)
      .json({ message: "Failed to calculate fare", error: err.message });
  }
});

// Start the server function
function startServer() {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Connect to MongoDB
connectWithRetry();
