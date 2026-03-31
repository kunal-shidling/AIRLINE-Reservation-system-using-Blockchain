/**
 * Booking Model
 * Mongoose schema for flight bookings
 */

const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../../../../shared/constants/status-codes');

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    default: () => `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  flightDetails: {
    flightNumber: String,
    airline: String,
    origin: String,
    destination: String,
    departureTime: Date,
    arrivalTime: Date
  },
  passengers: [{
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: 0
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: true
    },
    seatNumber: String
  }],
  seatClass: {
    type: String,
    enum: ['economy', 'business', 'firstClass'],
    required: true
  },
  numberOfPassengers: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  blockchainTransactionId: {
    type: String
  },
  status: {
    type: String,
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.PENDING
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  cancellationDate: {
    type: Date
  },
  cancellationReason: {
    type: String
  }
}, {
  timestamps: true
});

// Ensure booking reference exists before validation
bookingSchema.pre('validate', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  return this.status === BOOKING_STATUS.CONFIRMED || this.status === BOOKING_STATUS.PENDING;
};

module.exports = mongoose.model('Booking', bookingSchema);
