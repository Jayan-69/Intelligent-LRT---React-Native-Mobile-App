const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Special', 'Delay', 'Cancellation', 'General', 'Maintenance', 'Emergency'],
    required: true
  },
  // Link to a specific train if it's a delay or cancellation notice
  relatedTrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make it optional
  }
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
