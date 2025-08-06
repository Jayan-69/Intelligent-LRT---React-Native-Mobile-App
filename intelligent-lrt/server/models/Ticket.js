const mongoose = require('mongoose');

// This is the correct and final schema that matches the data structure from the app.
const ticketSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed from ObjectId to String to support demo user ID
    required: true,
  },
  trainId: { type: String, required: true },
  trainDetails: {
    trainName: { type: String, required: true },
    trainNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    date: { type: String, required: true },
  },
  passengerDetails: {
    name: { type: String, required: true },
    nic: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
  },
  seatInfo: {
    numberOfSeats: { type: Number, required: true, min: 1 },
    seatType: { type: String, default: 'Any' },
    seatNumbers: { type: [String], default: [] },
  },
  paymentDetails: {
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, default: 'Paid' },
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Used'],
    default: 'Confirmed',
  },
  qrCodeValue: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Corrected pre-save hook to generate QR code data reliably.
ticketSchema.pre('save', function(next) {
  if (this.isNew) {
    try {
      const qrData = {
        ticketId: this._id.toString(),
        passenger: this.passengerDetails.name,
        train: this.trainDetails.trainNumber,
        from: this.trainDetails.from,
        to: this.trainDetails.to,
        date: this.trainDetails.date,
        departure: this.trainDetails.departureTime,
        seats: this.seatInfo.seatNumbers.join(', '),
        status: this.status,
      };
      this.qrCodeValue = JSON.stringify(qrData);
    } catch (error) {
      // If QR generation fails, log it but don't block saving the ticket.
      console.error('Error generating QR code value:', error);
      // Proceed without a QR code value to ensure the booking is not lost.
    }
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

