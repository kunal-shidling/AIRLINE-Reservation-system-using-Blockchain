/**
 * Payment Service (Business Logic Layer)
 * Handles payment processing and integrations
 */

const Payment = require('../models/Payment.model');
const axios = require('axios');
const Logger = require('../../../../shared/utils/logger');
const { MESSAGES, PAYMENT_STATUS } = require('../../../../shared/constants/status-codes');

const SERVICE_NAME = 'PAYMENT-SERVICE';

class PaymentService {
  /**
   * Process payment for a booking
   * @param {Object} paymentData - Payment information
   * @returns {Object} Payment details
   */
  async processPayment(paymentData) {
    try {
      const { bookingId, userId, amount, paymentMethod, cardDetails } = paymentData;

      // Validate amount
      if (amount <= 0) {
        throw new Error(MESSAGES.INVALID_AMOUNT);
      }

      // Create payment record
      const payment = new Payment({
        bookingId,
        userId,
        amount,
        paymentMethod,
        cardDetails: cardDetails ? {
          cardHolderName: cardDetails.cardHolderName,
          expiryMonth: cardDetails.expiryMonth,
          expiryYear: cardDetails.expiryYear
        } : undefined,
        status: PAYMENT_STATUS.PENDING
      });

      // Mask card number if provided
      if (cardDetails && cardDetails.cardNumber) {
        payment.maskCardNumber(cardDetails.cardNumber);
      }

      // Simulate payment gateway processing
      const gatewayResponse = await this.simulatePaymentGateway(amount, paymentMethod);

      // Update payment with gateway response
      payment.paymentGatewayResponse = gatewayResponse;

      if (gatewayResponse.responseCode === '00') {
        payment.status = PAYMENT_STATUS.SUCCESS;
        payment.paidAt = new Date();

        await payment.save();

        // Log transaction to blockchain
        try {
          const blockchainResponse = await this.logToBlockchain(payment);
          payment.blockchainTransactionId = blockchainResponse.transactionId;
          await payment.save();
        } catch (blockchainError) {
          Logger.warn(SERVICE_NAME, 'Blockchain logging failed, but payment succeeded', blockchainError);
        }

        // Confirm booking in reservation service
        try {
          await this.confirmBooking(bookingId, payment._id, payment.blockchainTransactionId);
          Logger.success(SERVICE_NAME, `Payment processed: ${payment.transactionId}`);
        } catch (bookingError) {
          Logger.error(SERVICE_NAME, 'Failed to confirm booking after payment', bookingError);
        }

        return payment;
      } else {
        payment.status = PAYMENT_STATUS.FAILED;
        await payment.save();
        throw new Error(MESSAGES.PAYMENT_FAILED);
      }
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Payment processing failed', error);
      throw error;
    }
  }

  /**
   * Simulate payment gateway API call
   * @param {Number} amount - Payment amount
   * @param {String} method - Payment method
   * @returns {Object} Gateway response
   */
  async simulatePaymentGateway(amount, method) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
          resolve({
            gatewayTransactionId: 'GTW' + Date.now(),
            responseCode: '00',
            responseMessage: 'Payment successful'
          });
        } else {
          resolve({
            gatewayTransactionId: 'GTW' + Date.now(),
            responseCode: '01',
            responseMessage: 'Insufficient funds'
          });
        }
      }, 1000); // Simulate network delay
    });
  }

  /**
   * Log transaction to blockchain
   * @param {Object} payment - Payment document
   * @returns {Object} Blockchain response
   */
  async logToBlockchain(payment) {
    try {
      const blockchainUrl = process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:5005';
      const response = await axios.post(`${blockchainUrl}/api/blockchain/transactions`, {
        bookingId: payment.bookingId,
        transactionId: payment.transactionId,
        amount: payment.amount,
        timestamp: new Date().toISOString(),
        paymentMethod: payment.paymentMethod,
        status: payment.status
      });

      return response.data.data;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Blockchain logging failed', error);
      throw error;
    }
  }

  /**
   * Confirm booking after successful payment
   * @param {String} bookingId - Booking ID
   * @param {String} paymentId - Payment ID
   * @param {String} blockchainTxId - Blockchain transaction ID
   */
  async confirmBooking(bookingId, paymentId, blockchainTxId) {
    try {
      const reservationUrl = process.env.RESERVATION_SERVICE_URL || 'http://localhost:5002';
      await axios.put(`${reservationUrl}/api/reservations/bookings/${bookingId}/confirm`, {
        paymentId,
        blockchainTxId
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to confirm booking', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   * @param {String} paymentId - Payment ID
   * @returns {Object} Payment details
   */
  async getPaymentById(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to fetch payment', error);
      throw error;
    }
  }

  /**
   * Get payment by booking ID
   * @param {String} bookingId - Booking ID
   * @returns {Object} Payment details
   */
  async getPaymentByBookingId(bookingId) {
    try {
      const payment = await Payment.findOne({ bookingId });

      if (!payment) {
        throw new Error('Payment not found for this booking');
      }

      return payment;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to fetch payment by booking', error);
      throw error;
    }
  }

  /**
   * Get user payment history
   * @param {String} userId - User ID
   * @returns {Array} List of payments
   */
  async getUserPayments(userId) {
    try {
      const payments = await Payment.find({ userId })
        .populate('bookingId')
        .sort({ createdAt: -1 });

      return payments;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to fetch user payments', error);
      throw error;
    }
  }

  /**
   * Process refund for cancelled booking
   * @param {String} paymentId - Payment ID
   * @param {String} reason - Refund reason
   * @returns {Object} Updated payment
   */
  async processRefund(paymentId, reason) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== PAYMENT_STATUS.SUCCESS) {
        throw new Error('Only successful payments can be refunded');
      }

      // Simulate refund processing
      payment.status = PAYMENT_STATUS.REFUNDED;
      payment.refundDetails = {
        refundId: 'REF' + Date.now(),
        refundAmount: payment.amount,
        refundDate: new Date(),
        refundReason: reason
      };

      await payment.save();

      Logger.success(SERVICE_NAME, `Refund processed: ${payment.transactionId}`);

      return payment;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Refund processing failed', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
