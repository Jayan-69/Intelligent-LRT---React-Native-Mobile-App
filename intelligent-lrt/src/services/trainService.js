import { stations as mockStations, routes as mockRoutes, trains as mockTrains, trainTypes, getTrainStops } from '../data/sriLankaRailway';
import connectDB from '../config/dbConfig';
import { TrainModel, StationModel, RouteModel } from '../models/trainSchema';

// Flag to determine whether to use MongoDB or mock data
const USE_MONGODB = false; // Using mock data since we can't directly connect to MongoDB in React Native
// To use a real MongoDB connection, you would need to set up a backend API service

// Initialize database connection if using MongoDB
let dbConnection = null;
if (USE_MONGODB) {
  dbConnection = connectDB().then(() => console.log('MongoDB ready for train services'));
}

// Function to get data sources based on USE_MONGODB flag
const getDataSources = async () => {
  // When using MongoDB, we'll fetch from the database
  if (USE_MONGODB) {
    try {
      // Wait for DB connection if not already connected
      if (!dbConnection) dbConnection = await connectDB();
      
      // Return the MongoDB models
      return {
        stations: StationModel,
        routes: RouteModel,
        trains: TrainModel
      };
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      // Fallback to mock data
      console.warn('Falling back to mock data');
      return {
        stations: mockStations,
        routes: mockRoutes,
        trains: mockTrains
      };
    }
  }
  
  // When not using MongoDB, use mock data
  return {
    stations: mockStations,
    routes: mockRoutes,
    trains: mockTrains
  };
};

// In a real application, these would make actual API calls
// For now, we'll use the mock data and simulate API behavior

export const trainService = {
  // Station-related methods
  getAllStations: async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { stations } = await getDataSources();
      
      if (USE_MONGODB) {
        const stationList = await stations.find().lean();
        return { success: true, data: stationList };
      }
      
      return { success: true, data: stations };
    } catch (error) {
      console.error('Error fetching stations:', error);
      return { success: false, error: 'Failed to fetch stations' };
    }
  },
  
  getStationById: async (stationId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { stations } = await getDataSources();
      
      if (USE_MONGODB) {
        const station = await stations.findById(stationId).lean();
        if (!station) {
          return { success: false, error: 'Station not found' };
        }
        return { success: true, data: station };
      }
      
      const station = stations.find(s => s.id === stationId);
      if (!station) {
        return { success: false, error: 'Station not found' };
      }
      return { success: true, data: station };
    } catch (error) {
      console.error('Error fetching station:', error);
      return { success: false, error: 'Failed to fetch station' };
    }
  },

  // Route-related methods
  getAllRoutes: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { routes } = await getDataSources();
      
      if (USE_MONGODB) {
        const routeList = await routes.find().lean();
        return { success: true, data: routeList };
      }
      
      return { success: true, data: routes };
    } catch (error) {
      console.error('Error fetching routes:', error);
      return { success: false, error: 'Failed to fetch routes' };
    }
  },
  
  getRouteById: async (routeId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { routes } = await getDataSources();
      
      if (USE_MONGODB) {
        const route = await routes.findById(routeId).lean();
        if (!route) {
          return { success: false, error: 'Route not found' };
        }
        return { success: true, data: route };
      }
      
      const route = routes.find(r => r.id === routeId);
      if (!route) {
        return { success: false, error: 'Route not found' };
      }
      return { success: true, data: route };
    } catch (error) {
      console.error('Error fetching route:', error);
      return { success: false, error: 'Failed to fetch route' };
    }
  },
  
  getRouteWithStations: async (routeId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { routes, stations } = await getDataSources();
      
      if (USE_MONGODB) {
        const route = await routes.findById(routeId).lean();
        if (!route) {
          return { success: false, error: 'Route not found' };
        }
        
        // For MongoDB, we need to populate the stations using their ObjectIds
        const stationIds = route.stations.map(s => s.station);
        const stationList = await stations.find({ _id: { $in: stationIds } }).lean();
        
        const routeWithStations = {
          ...route,
          stations: route.stations.map(routeStation => {
            const station = stationList.find(s => s._id.toString() === routeStation.station.toString());
            return {
              ...station,
              stopOrder: routeStation.stopOrder,
              distanceFromStart: routeStation.distanceFromStart
            };
          }).sort((a, b) => a.stopOrder - b.stopOrder)
        };
        
        return { success: true, data: routeWithStations };
      }
      
      // For mock data
      const route = routes.find(r => r.id === routeId);
      if (!route) {
        return { success: false, error: 'Route not found' };
      }
      
      const routeWithStations = {
        ...route,
        stations: route.stations.map(routeStation => {
          const station = stations.find(s => s.id === routeStation.id);
          return {
            ...station,
            stopOrder: routeStation.stopOrder,
            distanceFromStart: routeStation.distanceFromStart
          };
        }).sort((a, b) => a.stopOrder - b.stopOrder)
      };
      
      return { success: true, data: routeWithStations };
    } catch (error) {
      console.error('Error fetching route with stations:', error);
      return { success: false, error: 'Failed to fetch route with stations' };
    }
  },

  // Train-related methods
  getAllTrains: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { trains } = await getDataSources();
      
      if (USE_MONGODB) {
        const trainList = await trains.find().lean();
        return { success: true, data: trainList };
      }
      
      return { success: true, data: trains };
    } catch (error) {
      console.error('Error fetching trains:', error);
      return { success: false, error: 'Failed to fetch trains' };
    }
  },
  
  getTrainById: async (trainId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { trains } = await getDataSources();
      
      if (USE_MONGODB) {
        const train = await trains.findById(trainId).lean();
        if (!train) {
          return { success: false, error: 'Train not found' };
        }
        return { success: true, data: train };
      }
      
      const train = trains.find(t => t.id === trainId);
      if (!train) {
        return { success: false, error: 'Train not found' };
      }
      return { success: true, data: train };
    } catch (error) {
      console.error('Error fetching train:', error);
      return { success: false, error: 'Failed to fetch train' };
    }
  },
  
  getTrainDetails: async (trainId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const { trains, routes, stations } = await getDataSources();
      
      let train, route, currentStation, trainType, trainStops;
      
      if (USE_MONGODB) {
        // Get the train with populated route and station information
        train = await trains.findById(trainId).populate('route').lean();
        if (!train) {
          return { success: false, error: 'Train not found' };
        }
        
        // Get the train's route
        route = train.route;
        if (!route) {
          return { success: false, error: 'Train route not found' };
        }
        
        // Get current station details
        currentStation = await stations.findById(train.currentLocation.station).lean();
        if (!currentStation) {
          return { success: false, error: 'Current station not found' };
        }
      } else {
        // Using mock data
        train = trains.find(t => t.id === trainId);
        if (!train) {
          return { success: false, error: 'Train not found' };
        }
        
        // Get the train's route
        route = routes.find(r => r.id === train.route);
        if (!route) {
          return { success: false, error: 'Train route not found' };
        }
        
        // Get current station details
        currentStation = stations.find(s => s.id === train.currentLocation.stationId);
        if (!currentStation) {
          return { success: false, error: 'Current station not found' };
        }
      }
      
      // Find train type safely with fallback
      trainType = trainTypes.find(t => t.id && train.type && t.id.includes(train.type));
      if (!trainType) {
        // Fallback to a default train type if none found
        console.warn(`Train type not found for ${train.type}, using default`);
        trainType = { id: 'default', name: 'Default', speed: 60 };
      }
      
      // Get train stops safely
      try {
        trainStops = getTrainStops(train.id, trainType.id);
        if (!trainStops || !Array.isArray(trainStops) || trainStops.length === 0) {
          throw new Error('No train stops found');
        }
      } catch (stopsError) {
        console.warn('Error getting train stops:', stopsError);
        // Fallback: use route stations as stops
        trainStops = route.stations ? [...route.stations] : [];
        // If we still don't have stops, create a basic one with current station
        if (trainStops.length === 0) {
          trainStops = [{ ...currentStation, stopOrder: 1 }];
        }
      }
      
      // Find next station - with safety checks
      let currentStationIndex = -1;
      try {
        currentStationIndex = trainStops.findIndex(s => s && s.id === currentStation.id);
      } catch (err) {
        console.warn('Error finding current station index:', err);
      }
      
      const nextStation = (currentStationIndex >= 0 && currentStationIndex < trainStops.length - 1) 
        ? trainStops[currentStationIndex + 1] 
        : null;
      
      // Enhanced train details with safety checks for all properties
      const trainDetails = {
        ...train,
        currentStation: currentStation?.name || 'Unknown',
        nextStation: nextStation?.name || 'Final Destination',
        estimatedArrival: nextStation ? '15 min' : '--',
        route: {
          ...route,
          stations: trainStops
        },
        route_coordinates: trainStops.map(station => ({
          latitude: station?.coordinates?.latitude || 0,
          longitude: station?.coordinates?.longitude || 0
        })),
        stations: trainStops.map(station => ({
          name: station?.name || 'Unknown',
          status: station?.id === currentStation?.id 
            ? 'Current' 
            : ((station?.stopOrder || 0) < (currentStation?.stopOrder || 0) ? 'Departed' : 'Upcoming'),
          time: '08:' + (30 + (station?.stopOrder || 0)) + ' AM', // Mock time for demo
          coordinates: station?.coordinates || { latitude: 0, longitude: 0 }
        }))
      };
      
      return { success: true, data: trainDetails };
    } catch (error) {
      console.error('Error fetching train details:', error);
      return { success: false, error: `Failed to fetch train details: ${error.message || error}` };
    }
  },
  
  updateTrainLocation: async (trainId, stationId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const { trains, stations } = await getDataSources();
      
      if (USE_MONGODB) {
        // Find the train and station in MongoDB
        const train = await trains.findById(trainId);
        if (!train) {
          return { success: false, error: 'Train not found' };
        }
        
        const station = await stations.findById(stationId);
        if (!station) {
          return { success: false, error: 'Station not found' };
        }
        
        // Update the train's location
        train.currentLocation = {
          station: stationId, // In MongoDB, we store station reference
          coordinates: station.coordinates,
          lastUpdated: new Date()
        };
        
        await train.save();
        return { success: true, data: train.toObject() };
      } else {
        // Using mock data
        const trainIndex = trains.findIndex(t => t.id === trainId);
        if (trainIndex === -1) {
          return { success: false, error: 'Train not found' };
        }
        
        const station = stations.find(s => s.id === stationId);
        if (!station) {
          return { success: false, error: 'Station not found' };
        }
        
        // Update the train's location
        trains[trainIndex] = {
          ...trains[trainIndex],
          currentLocation: {
            stationId: station.id,
            coordinates: station.coordinates,
            lastUpdated: new Date().toISOString()
          }
        };
        
        return { success: true, data: trains[trainIndex] };
      }
    } catch (error) {
      console.error('Error updating train location:', error);
      return { success: false, error: 'Failed to update train location' };
    }
  },
  
  updateTrainStatus: async (trainId, status, delayMinutes = 0) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { trains } = await getDataSources();
      
      if (USE_MONGODB) {
        // Find the train in MongoDB
        const train = await trains.findById(trainId);
        if (!train) {
          return { success: false, error: 'Train not found' };
        }
        
        // Update the train's status
        train.status = status;
        train.delayMinutes = status === 'Delayed' ? delayMinutes : 0;
        
        await train.save();
        return { success: true, data: train.toObject() };
      } else {
        // Using mock data
        const trainIndex = trains.findIndex(t => t.id === trainId);
        if (trainIndex === -1) {
          return { success: false, error: 'Train not found' };
        }
        
        // Update the train's status
        trains[trainIndex] = {
          ...trains[trainIndex],
          status,
          delayMinutes: status === 'Delayed' ? delayMinutes : 0
        };
        
        return { success: true, data: trains[trainIndex] };
      }
    } catch (error) {
      console.error('Error updating train status:', error);
      return { success: false, error: 'Failed to update train status' };
    }
  },
  
  // Train management (for Admin/SuperAdmin)
  createTrain: async (trainData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const { trains } = await getDataSources();
      
      if (USE_MONGODB) {
        // Create a new train in MongoDB
        const newTrain = new trains({
          ...trainData,
          status: 'Not Started',
          delayMinutes: 0
        });
        
        await newTrain.save();
        return { success: true, data: newTrain.toObject() };
      } else {
        // Using mock data
        // Generate a new ID
        const newId = 'train-' + (trains.length + 1).toString().padStart(3, '0');
        
        // Create the new train
        const newTrain = {
          id: newId,
          ...trainData,
          status: 'Not Started',
          delayMinutes: 0
        };
        
        // Add to the trains array
        trains.push(newTrain);
        
        return { success: true, data: newTrain };
      }
    } catch (error) {
      console.error('Error creating train:', error);
      return { success: false, error: 'Failed to create train' };
    }
  },
  
  deleteTrain: async (trainId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const { trains } = await getDataSources();
      
      if (USE_MONGODB) {
        // Find and delete the train in MongoDB
        const train = await trains.findById(trainId);
        if (!train) {
          return { success: false, error: 'Train not found' };
        }
        
        // Remove the train from MongoDB
        const deletedTrain = await trains.findByIdAndDelete(trainId);
        
        return { success: true, data: deletedTrain.toObject() };
      } else {
        // Using mock data
        const trainIndex = trains.findIndex(t => t.id === trainId);
        if (trainIndex === -1) {
          return { success: false, error: 'Train not found' };
        }
        
        // Remove the train
        const deletedTrain = trains.splice(trainIndex, 1)[0];
        
        return { success: true, data: deletedTrain };
      }
    } catch (error) {
      console.error('Error deleting train:', error);
      return { success: false, error: 'Failed to delete train' };
    }
  }
};

export default trainService;
