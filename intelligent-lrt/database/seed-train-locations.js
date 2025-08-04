const mongoose = require('mongoose');

// MongoDB connection URI
const MONGO_URI = 'mongodb+srv://lrt-admin:Sj0k80NUWfvhFFPl@cluster0.ubpov8g.mongodb.net/lrt_tracking';

// Station coordinates for Sri Lanka railway stations
const stationCoordinates = {
  'RGM': { latitude: 7.0297, longitude: 79.9177 }, // Ragama
  'PKG': { latitude: 7.0167, longitude: 79.9333 }, // Pahala Karagahamuna
  'KDW': { latitude: 7.0167, longitude: 79.9500 }, // Kadawatha
  'MHR': { latitude: 7.0167, longitude: 79.9667 }, // Mahara
  'KBG': { latitude: 7.0167, longitude: 79.9833 }, // Kiribathgoda
  'TYJ': { latitude: 7.0167, longitude: 80.0000 }, // Tyre Junction
  'PTJ': { latitude: 7.0167, longitude: 80.0167 }, // Pattiya Junction
  'PLG': { latitude: 7.0167, longitude: 80.0333 }, // Paliyagoda
  'IGJ': { latitude: 7.0167, longitude: 80.0500 }, // Ingurukade Junction
  'ASJ': { latitude: 7.0167, longitude: 80.0667 }, // Armour Street Junction
  'MRD': { latitude: 6.9271, longitude: 79.8612 }, // Maradana
  'PTH': { latitude: 6.9271, longitude: 79.8612 }, // Pettah
  'SVI': { latitude: 6.9271, longitude: 79.8612 }, // Slave Island
  'GRM': { latitude: 6.9271, longitude: 79.8612 }, // Gangaramaya
  'KLP': { latitude: 6.9271, longitude: 79.8612 }, // Kollupitiya
  'BMB': { latitude: 6.9271, longitude: 79.8612 }, // Bambalapitiya
  'BLM': { latitude: 6.9271, longitude: 79.8612 }, // Bauddhaloka Mawatha
  'TBG': { latitude: 6.9271, longitude: 79.8612 }, // Thimbirigasyaya
  'HVT': { latitude: 6.9271, longitude: 79.8612 }, // Havelock Town
  'KLP': { latitude: 6.9271, longitude: 79.8612 }  // Kirulapona
};

// Sample trains with initial locations
const sampleTrainsWithLocations = [
  {
    trainNumber: 'I1',
    name: 'Intercity Express 1',
    type: 'intercity',
    capacity: 200,
    status: 'On Time',
    currentLocation: {
      coordinates: {
        latitude: 7.0297,
        longitude: 79.9177
      },
      lastUpdated: new Date()
    }
  },
  {
    trainNumber: 'E1',
    name: 'Express Train 1',
    type: 'express',
    capacity: 150,
    status: 'On Time',
    currentLocation: {
      coordinates: {
        latitude: 7.0167,
        longitude: 79.9333
      },
      lastUpdated: new Date()
    }
  },
  {
    trainNumber: 'S1',
    name: 'Slow Train 1',
    type: 'slow',
    capacity: 100,
    status: 'On Time',
    currentLocation: {
      coordinates: {
        latitude: 7.0167,
        longitude: 79.9500
      },
      lastUpdated: new Date()
    }
  },
  {
    trainNumber: 'I2',
    name: 'Intercity Express 2',
    type: 'intercity',
    capacity: 200,
    status: 'Delayed',
    currentLocation: {
      coordinates: {
        latitude: 6.9271,
        longitude: 79.8612
      },
      lastUpdated: new Date()
    }
  },
  {
    trainNumber: 'E2',
    name: 'Express Train 2',
    type: 'express',
    capacity: 150,
    status: 'On Time',
    currentLocation: {
      coordinates: {
        latitude: 6.9271,
        longitude: 79.8612
      },
      lastUpdated: new Date()
    }
  }
];

// Sample stations with coordinates
const sampleStationsWithCoordinates = [
  {
    name: 'Ragama',
    code: 'RGM',
    stationType: 'main',
    coordinates: {
      latitude: 7.0297,
      longitude: 79.9177
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    name: 'Pahala Karagahamuna',
    code: 'PKG',
    stationType: 'regular',
    coordinates: {
      latitude: 7.0167,
      longitude: 79.9333
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    name: 'Kadawatha',
    code: 'KDW',
    stationType: 'express',
    coordinates: {
      latitude: 7.0167,
      longitude: 79.9500
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    name: 'Mahara',
    code: 'MHR',
    stationType: 'regular',
    coordinates: {
      latitude: 7.0167,
      longitude: 79.9667
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: false,
      hasRestrooms: false
    }
  },
  {
    name: 'Kiribathgoda',
    code: 'KBG',
    stationType: 'express',
    coordinates: {
      latitude: 7.0167,
      longitude: 79.9833
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    name: 'Maradana',
    code: 'MRD',
    stationType: 'main',
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    name: 'Pettah',
    code: 'PTH',
    stationType: 'main',
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    name: 'Bambalapitiya',
    code: 'BMB',
    stationType: 'express',
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  },
  {
    name: 'Kirulapona',
    code: 'KLP',
    stationType: 'main',
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612
    },
    services: {
      hasTicketCounter: true,
      hasWaitingRoom: true,
      hasRestrooms: true
    }
  }
];

// Define schemas inline to avoid import issues
const StationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  stationType: {
    type: String,
    enum: ['main', 'express', 'regular'],
    default: 'regular'
  },
  services: {
    hasTicketCounter: { type: Boolean, default: true },
    hasWaitingRoom: { type: Boolean, default: false },
    hasRestrooms: { type: Boolean, default: false }
  }
});

const TrainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['intercity', 'express', 'slow'],
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 200
  },
  currentLocation: {
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled', 'Completed', 'Not Started'],
    default: 'Not Started'
  },
  delayMinutes: {
    type: Number,
    default: 0
  }
});

// Create models
const Station = mongoose.model('Station', StationSchema);
const Train = mongoose.model('Train', TrainSchema);

// Database seeding function
const seedTrainLocations = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Connection string:', MONGO_URI);
    
    // Connect to MongoDB with timeout
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Connected to MongoDB successfully!');
    
    // Clear existing train and station data
    console.log('Clearing existing train and station data...');
    await Station.deleteMany({});
    await Train.deleteMany({});
    
    console.log('Existing data cleared.');
    
    // Create stations with coordinates
    console.log('Creating stations with coordinates...');
    const createdStations = await Station.insertMany(sampleStationsWithCoordinates);
    console.log(`Created ${createdStations.length} stations with coordinates.`);
    
    // Create trains with locations
    console.log('Creating trains with locations...');
    const createdTrains = await Train.insertMany(sampleTrainsWithLocations);
    console.log(`Created ${createdTrains.length} trains with locations.`);
    
    console.log('\n=== TRAIN LOCATION SEEDING COMPLETE ===');
    console.log('Collections updated:');
    console.log(`- Stations: ${createdStations.length} records with coordinates`);
    console.log(`- Trains: ${createdTrains.length} records with locations`);
    
    console.log('\nSample Train Locations:');
    createdTrains.forEach(train => {
      console.log(`- ${train.name} (${train.trainNumber}): ${train.currentLocation.coordinates.latitude}, ${train.currentLocation.coordinates.longitude}`);
    });
    
    console.log('\nSample Station Coordinates:');
    createdStations.forEach(station => {
      console.log(`- ${station.name} (${station.code}): ${station.coordinates.latitude}, ${station.coordinates.longitude}`);
    });
    
    console.log('\nDatabase is ready for train location tracking!');
    console.log('Admin can now update train locations and users will see real-time updates.');
    
  } catch (error) {
    console.error('Error seeding train locations:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// Run the seeding
if (require.main === module) {
  seedTrainLocations();
}

module.exports = { seedTrainLocations }; 