const express = require('express');
const router = express.Router();
const Train = require('../models/Train');
const Route = require('../models/Route');
const Station = require('../models/Station');

// Get available trains
router.get('/available', async (req, res) => {
  try {
    // Get all routes from database
    const routes = await Route.find({});
    
    // Get all trains from database
    const trains = await Train.find({});
    
    // Combine route and train data to create available trains
    const availableTrains = routes.map(route => {
      const train = trains.find(t => t.trainNumber === route.trainCode);
      return {
        id: route._id,
        trainName: train ? train.trainName : `${route.trainType} Train ${route.trainCode}`,
        trainNumber: route.trainCode,
        from: route.from,
        to: route.to,
        departureTime: route.departureTime,
        arrivalTime: route.returnDepartureTime || 'TBD',
        status: train ? train.status : 'On Time',
        availableSeats: train ? train.capacity : 150,
        price: calculatePrice(route.trainType, route.from, route.to),
        type: getTrainTypeName(route.trainType),
        stops: route.stops || []
      };
    });

    res.json({ trains: availableTrains });
  } catch (error) {
    console.error('Error fetching available trains:', error);
    res.status(500).json({ error: 'Failed to fetch available trains' });
  }
});

// Book a ticket
router.post('/book', async (req, res) => {
  try {
    console.log('📝 Booking request received:', req.body);
    
    const {
      trainId,
      trainNumber,
      from,
      to,
      departureTime,
      passengerDetails,
      numberOfSeats,
      totalAmount,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!trainNumber || !from || !to || !passengerDetails || !numberOfSeats) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['trainNumber', 'from', 'to', 'passengerDetails', 'numberOfSeats']
      });
    }

    // Generate ticket ID
    const ticketId = `T${Date.now()}`;
    
    // Generate seat number
    const seatNumber = generateSeatNumber();
    
    // Create ticket object
    const ticket = {
      id: ticketId,
      trainName: `${getTrainTypeName(trainNumber.charAt(0))} Train ${trainNumber}`,
      trainNumber: trainNumber,
      from: from,
      to: to,
      departureTime: departureTime,
      arrivalTime: calculateArrivalTime(departureTime, from, to),
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      seatNumber: seatNumber,
      price: totalAmount,
      passengerName: passengerDetails.name,
      bookingDate: new Date().toISOString().split('T')[0],
      passengerDetails: passengerDetails,
      numberOfSeats: numberOfSeats,
      paymentMethod: paymentMethod
    };

    console.log('✅ Ticket created successfully:', ticketId);

    // In a real application, you would save this to a Ticket collection
    // For now, we'll return the ticket data
    res.json({ 
      success: true, 
      ticketId: ticketId,
      ticket: ticket,
      message: 'Booking successful!'
    });
  } catch (error) {
    console.error('❌ Error booking ticket:', error);
    res.status(500).json({ 
      error: 'Failed to book ticket',
      details: error.message 
    });
  }
});

// Get user tickets
router.get('/tickets', async (req, res) => {
  try {
    // In a real application, you would fetch tickets for the authenticated user
    // For now, we'll return sample tickets based on database data
    const routes = await Route.find({}).limit(3);
    const trains = await Train.find({}).limit(3);
    
    const tickets = routes.map((route, index) => {
      const train = trains[index] || trains[0];
      return {
        id: `T${1000 + index + 1}`,
        trainName: train ? train.trainName : `${route.trainType} Train ${route.trainCode}`,
        trainNumber: route.trainCode,
        from: route.from,
        to: route.to,
        departureTime: route.departureTime,
        arrivalTime: route.returnDepartureTime || 'TBD',
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: index === 2 ? 'Cancelled' : 'Active',
        seatNumber: `A${10 + index}`,
        price: calculatePrice(route.trainType, route.from, route.to),
        passengerName: 'John Doe',
        bookingDate: new Date().toISOString().split('T')[0]
      };
    });

    res.json({ tickets: tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Helper functions
function calculatePrice(trainType, from, to) {
  const basePrice = 80;
  const typeMultiplier = {
    'I': 2.5, // Intercity
    'E': 1.8, // Express
    'S': 1.0  // Slow
  };
  
  const multiplier = typeMultiplier[trainType] || 1.0;
  return Math.round(basePrice * multiplier);
}

function getTrainTypeName(trainType) {
  const typeNames = {
    'I': 'Intercity',
    'E': 'Express',
    'S': 'Slow'
  };
  return typeNames[trainType] || 'Regular';
}

function generateSeatNumber() {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const row = rows[Math.floor(Math.random() * rows.length)];
  const seat = Math.floor(Math.random() * 50) + 1;
  return `${row}${seat}`;
}

function calculateArrivalTime(departureTime, from, to) {
  // Simple calculation - in real app, this would be more sophisticated
  const departure = new Date(`2000-01-01 ${departureTime}`);
  const duration = Math.floor(Math.random() * 3) + 1; // 1-3 hours
  const arrival = new Date(departure.getTime() + duration * 60 * 60 * 1000);
  return arrival.toTimeString().slice(0, 5);
}

module.exports = router; 