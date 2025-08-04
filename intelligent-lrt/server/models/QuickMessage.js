const mongoose = require('mongoose');

const quickMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make it optional
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      // Set expiry to 7 days from creation by default
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
  }
}, { timestamps: true });

// Index to automatically remove expired documents
quickMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const QuickMessage = mongoose.model('QuickMessage', quickMessageSchema);

module.exports = QuickMessage;
