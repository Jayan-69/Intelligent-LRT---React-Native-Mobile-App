const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Train = require('../models/Train');

// GET all notices
router.get('/', async (req, res) => {
  try {
    // Populate related train info and creator info
    const notices = await Notice.find().populate('relatedTrain', 'trainName trainNumber').populate('createdBy', 'name');
    res.json(notices);
  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET a specific notice by ID
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('relatedTrain', 'trainName trainNumber')
      .populate('createdBy', 'name');
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.json(notice);
  } catch (err) {
    console.error('Error fetching notice:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new notice
router.post('/', async (req, res) => {
  try {
    const { title, content, type, relatedTrainId, createdBy } = req.body;

    // Validate required fields
    if (!title || !content || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, content, and type are required' 
      });
    }

    // If it's a delay or cancellation, update the train status as well
    if (type === 'Delay' || type === 'Cancellation') {
      if (!relatedTrainId) {
        return res.status(400).json({ message: 'Train ID is required for this notice type.' });
      }
      try {
        const newStatus = type === 'Delay' ? 'Delayed' : 'Cancelled';
        await Train.findByIdAndUpdate(relatedTrainId, { status: newStatus });
      } catch (err) {
        console.error('Error updating train status:', err);
        return res.status(404).json({ message: 'Train not found or failed to update.' });
      }
    }

    const noticeData = {
      title,
      content,
      type,
      relatedTrain: relatedTrainId || null,
      createdBy: createdBy || null // Make createdBy optional
    };

    const notice = new Notice(noticeData);
    const newNotice = await notice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    console.error('Error creating notice:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update a notice
router.put('/:id', async (req, res) => {
  try {
    const { title, content, type, relatedTrainId, createdBy } = req.body;

    // Validate required fields
    if (!title || !content || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, content, and type are required' 
      });
    }

    // If it's a delay or cancellation, update the train status as well
    if (type === 'Delay' || type === 'Cancellation') {
      if (!relatedTrainId) {
        return res.status(400).json({ message: 'Train ID is required for this notice type.' });
      }
      try {
        const newStatus = type === 'Delay' ? 'Delayed' : 'Cancelled';
        await Train.findByIdAndUpdate(relatedTrainId, { status: newStatus });
      } catch (err) {
        console.error('Error updating train status:', err);
        return res.status(404).json({ message: 'Train not found or failed to update.' });
      }
    }

    const updateData = {
      title,
      content,
      type,
      relatedTrain: relatedTrainId || null,
      createdBy: createdBy || null
    };

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(updatedNotice);
  } catch (err) {
    console.error('Error updating notice:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a notice
router.delete('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Cannot find notice' });
    }
    res.json({ message: 'Deleted Notice' });
  } catch (err) {
    console.error('Error deleting notice:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
