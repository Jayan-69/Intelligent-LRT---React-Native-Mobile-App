const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  trainCode: {
    type: String,
    required: true,
    unique: true,
  },
  trainType: {
    type: String,
    required: true,
    enum: ['I', 'E', 'S', 'SE'], // Intercity, Express, Slow, Semi Express
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
  stops: [{
    type: String, // Array of station names
    required: true,
  }],
  period: {
    type: String, // e.g., 'Morning Office Hours'
    default: 'Morning Office Hours'
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled'],
    default: 'On Time'
  }
}, { timestamps: true });

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
