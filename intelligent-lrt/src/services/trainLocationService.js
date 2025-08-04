import { stations, routes, trains } from '../data/sriLankaRailway';
import { TrainModel, StationModel } from '../models/trainSchema';
import connectDB from '../config/dbConfig';
import realtimeService from './realtimeService';

// Flag to determine whether to use MongoDB or mock data
// In React Native, we'll default to mock data for better performance
const USE_MONGODB = false; // Disable MongoDB in React Native for now

// Initialize database connection
let dbConnection = null;
if (USE_MONGODB) {
  dbConnection = connectDB().then(() => console.log('MongoDB ready for train location services'));
}

// In-memory storage for train locations (fallback when MongoDB is not available)
let trainLocations = {};
let stationLocations = {};

// Initialize train locations from the data
const initializeTrainLocations = () => {
  if (trains && Array.isArray(trains)) {
    trains.forEach(train => {
      if (train.currentLocation && train.currentLocation.coordinates) {
        trainLocations[train.id] = {
          latitude: train.currentLocation.coordinates.latitude,
          longitude: train.currentLocation.coordinates.longitude,
          lastUpdated: new Date().toISOString()
        };
      }
    });
  }
  console.log('Initialized train locations:', trainLocations);
};

// Initialize station locations from the data
const initializeStationLocations = () => {
  if (stations && Array.isArray(stations)) {
    stations.forEach(station => {
      if (station.coordinates) {
        stationLocations[station.id] = {
          latitude: station.coordinates.latitude,
          longitude: station.coordinates.longitude,
          lastUpdated: new Date().toISOString()
        };
      }
    });
  }
  console.log('Initialized station locations:', stationLocations);
};

// Call initialization functions
initializeTrainLocations();
initializeStationLocations();

// Get all train locations
export const getAllTrainLocations = async () => {
  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      const trainData = await TrainModel.find({}, 'trainNumber currentLocation');
      const locations = {};
      trainData.forEach(train => {
        if (train.currentLocation && train.currentLocation.coordinates) {
          locations[train.trainNumber] = {
            latitude: train.currentLocation.coordinates.latitude,
            longitude: train.currentLocation.coordinates.longitude,
            lastUpdated: train.currentLocation.lastUpdated
          };
        }
      });
      return locations;
    } catch (error) {
      console.error('Error fetching train locations from MongoDB:', error);
      return trainLocations;
    }
  }
  return trainLocations;
};

// Get all station locations
export const getAllStationLocations = async () => {
  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      const stationData = await StationModel.find({}, 'code coordinates');
      const locations = {};
      stationData.forEach(station => {
        if (station.coordinates) {
          locations[station.code] = {
            latitude: station.coordinates.latitude,
            longitude: station.coordinates.longitude,
            lastUpdated: new Date().toISOString()
          };
        }
      });
      return locations;
    } catch (error) {
      console.error('Error fetching station locations from MongoDB:', error);
      return stationLocations;
    }
  }
  return stationLocations;
};

// Get a specific train's location
export const getTrainLocation = async (trainId) => {
  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      const train = await TrainModel.findOne({ trainNumber: trainId }, 'currentLocation');
      if (train && train.currentLocation && train.currentLocation.coordinates) {
        return {
          latitude: train.currentLocation.coordinates.latitude,
          longitude: train.currentLocation.coordinates.longitude,
          lastUpdated: train.currentLocation.lastUpdated
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching train location from MongoDB:', error);
      return trainLocations[trainId];
    }
  }
  return trainLocations[trainId];
};

// Get a specific station's location
export const getStationLocation = async (stationId) => {
  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      const station = await StationModel.findOne({ code: stationId }, 'coordinates');
      if (station && station.coordinates) {
        return {
          latitude: station.coordinates.latitude,
          longitude: station.coordinates.longitude,
          lastUpdated: new Date().toISOString()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching station location from MongoDB:', error);
      return stationLocations[stationId];
    }
  }
  return stationLocations[stationId];
};

// Update a train's location (admin function)
export const updateTrainLocation = async (trainId, latitude, longitude) => {
  if (!trainId) {
    throw new Error('Train ID is required');
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }

  // Validate coordinates (Sri Lanka bounds)
  if (latitude < 5.9 || latitude > 9.9 || longitude < 79.5 || longitude > 81.9) {
    throw new Error('Coordinates must be within Sri Lanka bounds');
  }

  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      
      const updatedTrain = await TrainModel.findOneAndUpdate(
        { trainNumber: trainId },
        {
          'currentLocation.coordinates.latitude': latitude,
          'currentLocation.coordinates.longitude': longitude,
          'currentLocation.lastUpdated': new Date().toISOString()
        },
        { new: true }
      );

      if (!updatedTrain) {
        throw new Error(`Train with ID ${trainId} not found`);
      }

      console.log(`Updated train ${trainId} location to: ${latitude}, ${longitude} in MongoDB`);
      
      // Also update in-memory storage for consistency
      trainLocations[trainId] = {
        latitude,
        longitude,
        lastUpdated: new Date().toISOString()
      };

      // Emit real-time update
      realtimeService.emitTrainLocationUpdate(trainId, latitude, longitude);

      return {
        latitude,
        longitude,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating train location in MongoDB:', error);
      throw error;
    }
  } else {
    trainLocations[trainId] = {
      latitude,
      longitude,
      lastUpdated: new Date().toISOString()
    };

    console.log(`Updated train ${trainId} location to: ${latitude}, ${longitude}`);
    
    // Emit real-time update
    realtimeService.emitTrainLocationUpdate(trainId, latitude, longitude);
    
    return trainLocations[trainId];
  }
};

// Update a station's location (admin function)
export const updateStationLocation = async (stationId, latitude, longitude) => {
  if (!stationId) {
    throw new Error('Station ID is required');
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }

  // Validate coordinates (Sri Lanka bounds)
  if (latitude < 5.9 || latitude > 9.9 || longitude < 79.5 || longitude > 81.9) {
    throw new Error('Coordinates must be within Sri Lanka bounds');
  }

  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      
      const updatedStation = await StationModel.findOneAndUpdate(
        { code: stationId },
        {
          'coordinates.latitude': latitude,
          'coordinates.longitude': longitude
        },
        { new: true }
      );

      if (!updatedStation) {
        throw new Error(`Station with ID ${stationId} not found`);
      }

      console.log(`Updated station ${stationId} location to: ${latitude}, ${longitude} in MongoDB`);
      
      // Also update in-memory storage for consistency
      stationLocations[stationId] = {
        latitude,
        longitude,
        lastUpdated: new Date().toISOString()
      };

      // Emit real-time update
      realtimeService.emitStationLocationUpdate(stationId, latitude, longitude);

      return {
        latitude,
        longitude,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating station location in MongoDB:', error);
      throw error;
    }
  } else {
    stationLocations[stationId] = {
      latitude,
      longitude,
      lastUpdated: new Date().toISOString()
    };

    console.log(`Updated station ${stationId} location to: ${latitude}, ${longitude}`);
    return stationLocations[stationId];
  }
};

// Get trains with their current locations
export const getTrainsWithLocations = async () => {
  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      const trainData = await TrainModel.find({}).populate('route');
      
      return trainData.map(train => ({
        id: train.trainNumber,
        name: train.name,
        type: train.type,
        route: train.route?.name || 'Unknown Route',
        status: train.status,
        currentLocation: {
          coordinates: train.currentLocation?.coordinates || { latitude: 6.9271, longitude: 79.8612 }
        },
        stations: train.route?.stations || []
      }));
    } catch (error) {
      console.error('Error fetching trains with locations from MongoDB:', error);
      // Fallback to mock data
      return trains.map(train => ({
        ...train,
        currentLocation: {
          coordinates: trainLocations[train.id] || (train.currentLocation?.coordinates || { latitude: 6.9271, longitude: 79.8612 })
        }
      }));
    }
  }
  
  const result = trains.map(train => ({
    ...train,
    currentLocation: {
      coordinates: trainLocations[train.id] || (train.currentLocation?.coordinates || { latitude: 6.9271, longitude: 79.8612 })
    }
  }));
  
  console.log('getTrainsWithLocations returning:', result);
  return result;
};

// Get stations with their coordinates
export const getStationsWithCoordinates = async () => {
  if (USE_MONGODB) {
    try {
      if (!dbConnection) dbConnection = await connectDB();
      const stationData = await StationModel.find({});
      
      return stationData.map(station => ({
        id: station.code,
        name: station.name,
        code: station.code,
        stationType: station.stationType,
        coordinates: station.coordinates || null
      })).filter(station => station.coordinates);
    } catch (error) {
      console.error('Error fetching stations with coordinates from MongoDB:', error);
      // Fallback to mock data
      return stations.map(station => ({
        ...station,
        coordinates: stationLocations[station.id] || station.coordinates
      })).filter(station => station.coordinates);
    }
  }
  
  return stations.map(station => ({
    ...station,
    coordinates: stationLocations[station.id] || station.coordinates
  })).filter(station => station.coordinates);
};

// Find nearest station to given coordinates
export const findNearestStation = async (latitude, longitude) => {
  let nearestStation = null;
  let minDistance = Infinity;

  const stationsWithCoords = await getStationsWithCoordinates();
  
  stationsWithCoords.forEach(station => {
    if (station.coordinates) {
      const distance = calculateDistance(
        latitude,
        longitude,
        station.coordinates.latitude,
        station.coordinates.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }
  });

  return { station: nearestStation, distance: minDistance };
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Get train status based on location
export const getTrainStatus = async (trainId) => {
  const trainLocation = await getTrainLocation(trainId);
  if (!trainLocation) return 'Unknown';

  const nearestStation = await findNearestStation(trainLocation.latitude, trainLocation.longitude);
  
  if (nearestStation.distance < 0.5) { // Within 500 meters of a station
    return `At ${nearestStation.station.name}`;
  } else if (nearestStation.distance < 2) { // Within 2km of a station
    return `Approaching ${nearestStation.station.name}`;
  } else {
    return 'In Transit';
  }
}; 