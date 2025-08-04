const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainName: {
    type: String,
    required: true,
    trim: true
  },
  trainNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  assignedDriver: {
    // We'll store the ObjectId of the admin user assigned as driver
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled'],
    default: 'On Time'
  },
  capacity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
