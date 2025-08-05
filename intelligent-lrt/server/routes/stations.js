const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

// Get all stations
router.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find({}).sort({ name: 1 });
    const stationNames = stations.map(station => station.name);
    
    res.json({ stations: stationNames });
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

module.exports = router; 