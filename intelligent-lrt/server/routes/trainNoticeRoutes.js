const express = require('express');
const router = express.Router();
const TrainNotice = require('../models/TrainNotice');

// GET all train notices
router.get('/trains', async (req, res) => {
  try {
    const notices = await TrainNotice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    console.error('Error fetching train notices:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new train notice
router.post('/trains', async (req, res) => {
  try {
    const { trainId, trainName, trainType, departureTime, status, createdBy } = req.body;

    if (!trainId || !trainName || !trainType || !departureTime) {
      return res.status(400).json({ message: 'Missing required train information' });
    }

    const trainNotice = new TrainNotice({
      trainId,
      trainName,
      trainType,
      departureTime,
      status: status || 'On Time',
      createdBy: createdBy || null // Make createdBy optional
    });

    const newNotice = await trainNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    console.error('Error creating train notice:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET all quick messages
router.get('/quickmsgs', async (req, res) => {
  try {
    const QuickMessage = require('../models/QuickMessage');
    const messages = await QuickMessage.find({
      expiresAt: { $gt: new Date() } // Only get non-expired messages
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching quick messages:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new quick message
router.post('/quickmsgs', async (req, res) => {
  try {
    const QuickMessage = require('../models/QuickMessage');
    const { content, createdBy } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Create expiry date (7 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const quickMessage = new QuickMessage({
      content,
      createdBy: createdBy || null, // Make createdBy optional
      expiresAt: expiryDate
    });

    const newMessage = await quickMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error creating quick message:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
