/**
 * Flight Model
 * Mongoose schema for flight information
 */

const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: [/^[A-Z]{2}\d{3,4}$/, 'Flight number must be in format: XX123 or XX1234']
  },
  airline: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    city: {
      type: String,
      required: true
    },
    airport: {
      type: String,
      required: true
    },
    airportCode: {
      type: String,
      required: true,
      uppercase: true,
      length: 3
    }
  },
  destination: {
    city: {
      type: String,
      required: true
    },
    airport: {
      type: String,
      required: true
    },
    airportCode: {
      type: String,
      required: true,
      uppercase: true,
      length: 3
    }
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  price: {
    economy: {
      type: Number,
      required: true,
      min: 0
    },
    business: {
      type: Number,
      required: true,
      min: 0
    },
    firstClass: {
      type: Number,
      required: true,
      min: 0
    }
  },
  availableSeats: {
    economy: {
      type: Number,
      required: true,
      min: 0
    },
    business: {
      type: Number,
      required: true,
      min: 0
    },
    firstClass: {
      type: Number,
      required: true,
      min: 0
    }
  },
  totalSeats: {
    economy: Number,
    business: Number,
    firstClass: Number
  },
  aircraft: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'DELAYED', 'CANCELLED', 'COMPLETED'],
    default: 'SCHEDULED'
  },
  amenities: [{
    type: String,
    enum: ['WIFI', 'MEALS', 'ENTERTAINMENT', 'POWER_OUTLETS', 'EXTRA_LEGROOM']
  }],
  isDynamic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
flightSchema.index({ 'origin.airportCode': 1, 'destination.airportCode': 1, departureTime: 1 });
flightSchema.index({ flightNumber: 1 });

// Method to check seat availability
flightSchema.methods.hasAvailableSeats = function(seatClass, quantity = 1) {
  return this.availableSeats[seatClass] >= quantity;
};

// Method to update seat count
flightSchema.methods.updateSeats = function(seatClass, quantity, operation = 'book') {
  if (operation === 'book') {
    this.availableSeats[seatClass] -= quantity;
  } else if (operation === 'cancel') {
    this.availableSeats[seatClass] += quantity;
  }
};

module.exports = mongoose.model('Flight', flightSchema);
