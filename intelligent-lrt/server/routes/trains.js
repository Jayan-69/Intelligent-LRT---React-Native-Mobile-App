const express = require('express');
const router = express.Router();
const Train = require('../models/Train');
const Route = require('../models/Route');
const Station = require('../models/Station');
const Ticket = require('../models/Ticket'); // Import the Ticket model

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

// Book a ticket and save it to the database
router.post('/book', async (req, res) => {
  try {
    console.log('📝 Booking request received:', req.body);

    const {
      userId,
      trainId,
      trainName,
      trainNumber,
      from,
      to,
      departureTime,
      arrivalTime,
      date,
      passengerDetails, // Contains name, nic, phone, email, seatPreference
      numberOfSeats,
      totalAmount,
      paymentMethod
    } = req.body;

    // Basic validation
    if (!userId || !trainId || !passengerDetails || !numberOfSeats) {
      return res.status(400).json({ error: 'Missing required booking information.' });
    }

    // Generate seat numbers for the booking
    const seatNumbers = Array.from({ length: numberOfSeats }, () => generateSeatNumber());

    // Create a new ticket document with the correct nested structure
    const newTicket = new Ticket({
      userId: userId,
      trainId: trainId,
      trainDetails: {
        trainName: trainName,
        trainNumber: trainNumber,
        from: from,
        to: to,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        date: date,
      },
      passengerDetails: {
        name: passengerDetails.name,
        nic: passengerDetails.nic,
        phone: passengerDetails.phone,
        email: passengerDetails.email,
      },
      seatInfo: {
        numberOfSeats: numberOfSeats,
        seatType: passengerDetails.seatPreference, // Correctly mapped from passengerDetails
        seatNumbers: seatNumbers,
      },
      paymentDetails: {
        amount: totalAmount,
        method: paymentMethod,
        status: 'Paid',
      },
      status: 'Confirmed', // Default status
    });

    const savedTicket = await newTicket.save();

    console.log('✅ Ticket saved successfully to DB:', savedTicket._id);

    res.status(201).json({
      success: true,
      message: 'Booking successful!',
      ticketId: savedTicket._id,
      ticket: savedTicket,
    });

  } catch (error) {
    // Enhanced error logging to provide specific details
    console.error('❌ DATABASE ERROR while booking ticket:', error.message);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      error: 'Failed to book ticket due to a server error.',
      details: error.message // Send back the specific Mongoose error
    });
  }
});

// Get all tickets for a specific user
router.get('/tickets/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Find all tickets for the given userId and sort by most recent
    const userTickets = await Ticket.find({ userId: userId }).sort({ createdAt: -1 });

    if (!userTickets) {
      return res.json({ tickets: [] }); // Return empty array if no tickets found
    }

    console.log(`✅ Found ${userTickets.length} tickets for user ${userId}`);
    res.json({ tickets: userTickets });

  } catch (error) {
    console.error('❌ Error fetching user tickets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user tickets',
      details: error.message 
    });
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