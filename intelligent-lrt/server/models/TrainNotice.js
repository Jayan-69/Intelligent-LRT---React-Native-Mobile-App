const mongoose = require('mongoose');

const trainNoticeSchema = new mongoose.Schema({
  trainId: {
    type: String,
    required: true
  },
  trainName: {
    type: String,
    required: true
  },
  trainType: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled'],
    default: 'On Time'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make it optional
  }
}, { timestamps: true });

const TrainNotice = mongoose.model('TrainNotice', trainNoticeSchema);

module.exports = TrainNotice;
