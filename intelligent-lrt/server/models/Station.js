const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Add any other station-specific fields if needed, e.g., facilities, zone
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
