const express = require('express');
const router = express.Router();
const Train = require('../models/Train');
const User = require('../models/User'); // We'll need this to find drivers
const Station = require('../models/Station');
const Route = require('../models/Route');

// GET all trains
router.get('/', async (req, res) => {
  try {
    const trains = await Train.find().populate('assignedDriver', 'name'); // Populate driver name
    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new train
router.post('/', async (req, res) => {
  const { trainName, trainNumber, capacity } = req.body;
  const train = new Train({
    trainName,
    trainNumber,
    capacity
  });

  try {
    const newTrain = await train.save();
    res.status(201).json(newTrain);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) assign a driver to a train
router.put('/:id/assign-driver', async (req, res) => {
  try {
    const { driverId } = req.body;
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
        return res.status(404).json({ message: 'Valid admin driver not found' });
    }

    train.assignedDriver = driverId;
    await train.save();
    res.json(train);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all stations
router.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find().sort('name');
    res.json(stations.map(s => s.name)); // Return an array of names
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST find available train routes
router.post('/find', async (req, res) => {
  const { fromStation, toStation } = req.body;
  if (!fromStation || !toStation) {
    return res.status(400).json({ message: 'From and To stations are required.' });
  }

  try {
    const routes = await Route.find({
      stops: { $all: [fromStation, toStation] }
    });

    const availableRoutes = routes.filter(route => {
        const fromIndex = route.stops.indexOf(fromStation);
        const toIndex = route.stops.indexOf(toStation);
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });

    res.json(availableRoutes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST calculate fare
const BASE_FARE_PER_STATION = 15; // Example base fare
const FARE_MULTIPLIERS = {
  'intercity': 2.5, // Using full name to match data
  'express': 1.5,
  'slow': 1.0
};

router.post('/fare', async (req, res) => {
    const { fromStation, toStation, trainType } = req.body;
    if (!fromStation || !toStation || !trainType) {
        return res.status(400).json({ message: 'From, To, and trainType are required.' });
    }

    try {
        // For simplicity, we'll use the full station list to calculate stops.
        // A more robust solution might use the specific route's stops array.
        const allStations = await Station.find().sort('name').then(s => s.map(st => st.name));
        const fromIndex = allStations.indexOf(fromStation);
        const toIndex = allStations.indexOf(toStation);

        if (fromIndex === -1 || toIndex === -1) {
            return res.status(404).json({ message: 'One or both stations not found.' });
        }

        const stopCount = Math.abs(toIndex - fromIndex);
        const multiplier = FARE_MULTIPLIERS[trainType] || 1.0;
        const fare = stopCount * BASE_FARE_PER_STATION * multiplier;

        res.json({ fare: fare.toFixed(2) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
