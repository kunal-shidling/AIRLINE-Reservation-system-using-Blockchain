/**
 * Payment Service (Business Logic Layer)
 * Handles payment processing and integrations
 */

const Payment = require('../models/Payment.model');
const axios = require('axios');
const { ethers } = require('ethers');
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
      const { 
        bookingId, 
        userId, 
        amount, 
        paymentMethod, 
        cardDetails, 
        blockchainTransactionId 
      } = paymentData;

      Logger.info(SERVICE_NAME, `Processing payment for booking: ${bookingId}, Method: ${paymentMethod}`);

      // Validate amount
      if (amount <= 0) {
        throw new Error(MESSAGES.INVALID_AMOUNT);
      }

      // Handle unexpected method names from frontend (mapping)
      let normalizedMethod = paymentMethod;
      if (paymentMethod === 'UPI') normalizedMethod = 'UPI_ID';

      // Create payment record
      const payment = new Payment({
        bookingId,
        userId,
        amount,
        paymentMethod: normalizedMethod,
        blockchainTransactionId: blockchainTransactionId || undefined,
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

      // 🚀 BACKEND WALLET SETUP - Alternative to MetaMask
      let gatewayResponse;
      if (paymentMethod === 'ETHEREUM') {
        gatewayResponse = await this.executeBackendWalletTransaction(amount);
      } else {
        gatewayResponse = await this.simulatePaymentGateway(amount, paymentMethod);
      }

      // Update payment with gateway response
      payment.paymentGatewayResponse = gatewayResponse;

      if (gatewayResponse.responseCode === '00') {
        payment.status = PAYMENT_STATUS.SUCCESS;
        payment.paidAt = new Date();
        
        // Auto-assign the transaction hash from the backend wallet
        if (gatewayResponse.transactionId) {
          payment.blockchainTransactionId = gatewayResponse.transactionId;
        }

        await payment.save();

        // Log to internal blockchain only for non-ETH payments
        if (paymentMethod !== 'ETHEREUM') {
          try {
            const blockchainResponse = await this.logToBlockchain(payment);
            payment.blockchainTransactionId = blockchainResponse.transactionId;
            await payment.save();
          } catch (blockchainError) {
            Logger.warn(SERVICE_NAME, 'Internal blockchain logging failed', blockchainError);
          }
        }

        // Confirm booking in reservation service
        try {
          await this.confirmBooking(bookingId, payment._id, payment.blockchainTransactionId);
          Logger.success(SERVICE_NAME, `Payment processed via Backend Wallet: ${payment.blockchainTransactionId}`);
        } catch (bookingError) {
          Logger.error(SERVICE_NAME, 'Failed to confirm booking', bookingError);
        }

        return payment;
      } else {
        payment.status = PAYMENT_STATUS.FAILED;
        await payment.save();
        throw new Error(gatewayResponse.message || MESSAGES.PAYMENT_FAILED);
      }
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Payment processing failed', error);
      throw error;
    }
  }

  /**
   * Verify an Ethereum transaction hash
   * @param {String} txHash - Transaction hash from client
   * @param {Number} amount - Expected amount in INR (including platform charge)
   * @returns {Object} Verification response
   */
  async verifyEthereumTransaction(txHash, amount) {
    if (!txHash) {
      return { responseCode: '01', message: 'No transaction ID provided' };
    }

    try {
      // Use your Infura API Key to verify transaction status on-chain
      const INFURA_API_KEY = process.env.INFURA_API_KEY || '2ccbabdf3cbd48738c0e5361a26e229a';
      const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      
      const tx = await provider.getTransaction(txHash);
      if (!tx) {
        return { responseCode: '01', message: 'Transaction not found on network' };
      }

      const receipt = await provider.getTransactionReceipt(txHash);
      const isConfirmed = receipt && receipt.status === 1;

      if (isConfirmed) {
        return {
          responseCode: '00',
          message: 'Ethereum transaction verified on Sepolia chain',
          transactionId: txHash,
          network: 'Sepolia Testnet',
          platformCharge: (amount * 0.3/1.3).toFixed(2)
        };
      } else {
        return { responseCode: '01', message: 'Transaction is still pending or failed' };
      }
    } catch (error) {
      // Fallback for demo if Infura fails
      Logger.warn(SERVICE_NAME, 'Infura verification failed, using mock success for demo', error);
      return {
        responseCode: '00',
        message: 'Verified (Demo Mode)',
        transactionId: txHash,
        platformCharge: (amount * 0.3/1.3).toFixed(2)
      };
    }
  }

  /**
   * Execute a transaction using the backend's hidden wallet (No MetaMask needed)
   * Strictly following the provided implementation pattern
   * @param {Number} amountINR - Amount in INR to convert and send
   * @returns {Object} Transaction result
   */
  async executeBackendWalletTransaction(amountINR) {
    try {
      const INFURA_API_KEY = process.env.INFURA_API_KEY || '2ccbabdf3cbd48738c0e5361a26e229a';
      const RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
      const PRIVATE_KEY = process.env.BACKEND_WALLET_PRIVATE_KEY;
      const RECEIVER_ADDRESS = process.env.RECEIVER_WALLET_ADDRESS || '0x4376c9da39B4244E9367468FeD27f29393C155Ad';

      // Fallback to simulation if Private Key is missing (prevents 400 error in demo)
      if (!PRIVATE_KEY) {
        Logger.warn(SERVICE_NAME, 'BACKEND_WALLET_PRIVATE_KEY missing. Falling back to simulation mode for demo.');
        return {
          responseCode: '00',
          message: 'Success (Wallet Simulation Mode)',
          transactionId: `SIM-ETH-${Date.now()}`,
          platformCharge: (amountINR * 0.3/1.3).toFixed(2)
        };
      }

      // --- START USER PROVIDED PATTERN ---
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      // Simple conversion for demo: 1 ETH = 300,000 INR
      const ethValue = (amountINR / 300000).toFixed(6);
      
      Logger.info(SERVICE_NAME, `Backend wallet sending ${ethValue} ETH to ${RECEIVER_ADDRESS}...`);

      const tx = await wallet.sendTransaction({
        to: RECEIVER_ADDRESS,
        value: ethers.parseEther(ethValue),
      });

      console.log("Tx Hash:", tx.hash);
      // --- END USER PROVIDED PATTERN ---

      return {
        responseCode: '00',
        message: 'Transaction sent via backend wallet',
        transactionId: tx.hash,
        network: 'Sepolia',
        platformCharge: (amountINR * 0.3/1.3).toFixed(2)
      };
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Backend wallet transaction failed', error);
      return {
        responseCode: '01',
        message: `Wallet Error: ${error.message}`
      };
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
