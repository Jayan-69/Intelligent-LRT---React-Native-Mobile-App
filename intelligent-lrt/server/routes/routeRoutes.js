const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// Get all routes/schedules
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().sort({ departureTime: 1 });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Error fetching routes', error: error.message });
  }
});

// Get a specific route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ message: 'Error fetching route', error: error.message });
  }
});

// Create a new route/schedule
router.post('/', async (req, res) => {
  try {
    const {
      trainCode,
      trainType,
      from,
      to,
      departureTime,
      stops,
      period,
      status = 'On Time'
    } = req.body;

    // Validate required fields
    if (!trainCode || !trainType || !from || !to || !departureTime) {
      return res.status(400).json({ 
        message: 'Missing required fields: trainCode, trainType, from, to, departureTime' 
      });
    }

    // Check if train code already exists
    const existingRoute = await Route.findOne({ trainCode });
    if (existingRoute) {
      return res.status(400).json({ message: 'Train code already exists' });
    }

    const newRoute = new Route({
      trainCode,
      trainType,
      from,
      to,
      departureTime,
      stops: stops || [from, to],
      period,
      status
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ message: 'Error creating route', error: error.message });
  }
});

// Update a route/schedule
router.put('/:id', async (req, res) => {
  try {
    const {
      trainCode,
      trainType,
      from,
      to,
      departureTime,
      stops,
      period,
      status
    } = req.body;

    // Validate required fields
    if (!trainCode || !trainType || !from || !to || !departureTime) {
      return res.status(400).json({ 
        message: 'Missing required fields: trainCode, trainType, from, to, departureTime' 
      });
    }

    // First, check if the route exists
    const existingRoute = await Route.findById(req.params.id);
    if (!existingRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Check if train code already exists for a different route (excluding current route)
    const duplicateRoute = await Route.findOne({ 
      trainCode, 
      _id: { $ne: req.params.id } 
    });
    
    if (duplicateRoute) {
      return res.status(400).json({ 
        message: `Train code '${trainCode}' already exists for another route` 
      });
    }

    // Update the route
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      {
        trainCode,
        trainType,
        from,
        to,
        departureTime,
        stops: stops || [from, to],
        period,
        status
      },
      { new: true, runValidators: true }
    );

    console.log(`✅ Route updated successfully: ${updatedRoute.trainCode}`);
    res.json(updatedRoute);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ message: 'Error updating route', error: error.message });
  }
});

// Update train status only
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['On Time', 'Delayed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: On Time, Delayed, Cancelled' 
      });
    }

    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(updatedRoute);
  } catch (error) {
    console.error('Error updating route status:', error);
    res.status(500).json({ message: 'Error updating route status', error: error.message });
  }
});

// Delete a route/schedule
router.delete('/:id', async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);
    
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({ message: 'Route deleted successfully', deletedRoute });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ message: 'Error deleting route', error: error.message });
  }
});

// Get routes by train type
router.get('/type/:trainType', async (req, res) => {
  try {
    const routes = await Route.find({ trainType: req.params.trainType }).sort({ departureTime: 1 });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes by type:', error);
    res.status(500).json({ message: 'Error fetching routes by type', error: error.message });
  }
});

// Get routes by period
router.get('/period/:period', async (req, res) => {
  try {
    const routes = await Route.find({ period: req.params.period }).sort({ departureTime: 1 });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes by period:', error);
    res.status(500).json({ message: 'Error fetching routes by period', error: error.message });
  }
});

// Get routes by status
router.get('/status/:status', async (req, res) => {
  try {
    const routes = await Route.find({ status: req.params.status }).sort({ departureTime: 1 });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes by status:', error);
    res.status(500).json({ message: 'Error fetching routes by status', error: error.message });
  }
});

// Search routes by station
router.get('/search/station/:station', async (req, res) => {
  try {
    const station = req.params.station;
    const routes = await Route.find({
      $or: [
        { from: { $regex: station, $options: 'i' } },
        { to: { $regex: station, $options: 'i' } },
        { stops: { $regex: station, $options: 'i' } }
      ]
    }).sort({ departureTime: 1 });
    
    res.json(routes);
  } catch (error) {
    console.error('Error searching routes by station:', error);
    res.status(500).json({ message: 'Error searching routes by station', error: error.message });
  }
});

module.exports = router; 