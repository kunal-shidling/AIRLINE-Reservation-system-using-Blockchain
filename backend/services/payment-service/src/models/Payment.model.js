/**
 * Payment Model
 * Mongoose schema for payment transactions
 */

const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../../../../shared/constants/status-codes');

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    default: () => `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    enum: ['CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'UPI', 'WALLET', 'ETHEREUM', 'UPI_ID'],
    required: true
  },
  cardDetails: {
    cardNumber: {
      type: String,
      select: false // Don't return by default for security
    },
    cardHolderName: String,
    expiryMonth: Number,
    expiryYear: Number,
    lastFourDigits: String
  },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  paymentGatewayResponse: {
    gatewayTransactionId: String,
    responseCode: String,
    responseMessage: String
  },
  refundDetails: {
    refundId: String,
    refundAmount: Number,
    refundDate: Date,
    refundReason: String
  },
  blockchainTransactionId: String,
  paidAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique transaction ID before validation
paymentSchema.pre('validate', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

// Method to mask card number
paymentSchema.methods.maskCardNumber = function(cardNumber) {
  if (cardNumber && cardNumber.length >= 4) {
    this.lastFourDigits = cardNumber.slice(-4);
    return '**** **** **** ' + this.lastFourDigits;
  }
  return null;
};

module.exports = mongoose.model('Payment', paymentSchema);
