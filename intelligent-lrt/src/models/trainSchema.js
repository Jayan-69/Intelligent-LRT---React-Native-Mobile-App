import mongoose from 'mongoose';

// MongoDB Schema and Model definitions for the Sri Lanka Railway Tracking system

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

const RouteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stations: [{
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station'
    },
    stopOrder: {
      type: Number,
      required: true
    },
    distanceFromStart: {
      type: Number, // in kilometers
      required: true
    }
  }],
  totalDistance: {
    type: Number,
    required: true
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
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  }
});

const ScheduleSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true
  },
  dayType: {
    type: String,
    enum: ['Weekday', 'Weekend', 'Holiday'],
    required: true
  },
  stops: [{
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station'
    },
    arrivalTime: String,
    departureTime: String
  }]
});

// Create models from schemas
export const Station = mongoose.model('Station', StationSchema);
export const Route = mongoose.model('Route', RouteSchema);
export const Train = mongoose.model('Train', TrainSchema);
export const Schedule = mongoose.model('Schedule', ScheduleSchema);

// Export models in the format expected by trainService
export const StationModel = Station;
export const RouteModel = Route;
export const TrainModel = Train;
export const ScheduleModel = Schedule;
