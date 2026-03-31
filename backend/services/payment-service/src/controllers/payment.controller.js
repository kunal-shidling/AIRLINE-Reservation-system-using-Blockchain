/**
 * Payment Controller (Request Handler Layer)
 * Handles HTTP requests for payment operations
 */

const PaymentService = require('../services/payment.service');
const { HTTP_STATUS, MESSAGES } = require('../../../../shared/constants/status-codes');
const Logger = require('../../../../shared/utils/logger');

const SERVICE_NAME = 'PAYMENT-SERVICE';

class PaymentController {
  /**
   * Process payment
   * POST /api/payments/process
   */
  async processPayment(req, res) {
    try {
      const userId = req.user.userId || req.user.id; // From auth middleware
      const paymentData = {
        ...req.body,
        userId
      };

      const payment = await PaymentService.processPayment(paymentData);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.PAYMENT_SUCCESS,
        data: payment
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Process payment controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get payment by ID
   * GET /api/payments/:id
   */
  async getPaymentById(req, res) {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: payment
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get payment controller error', error);
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get payment by booking ID
   * GET /api/payments/booking/:bookingId
   */
  async getPaymentByBookingId(req, res) {
    try {
      const payment = await PaymentService.getPaymentByBookingId(req.params.bookingId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: payment
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get payment by booking controller error', error);
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get user payment history
   * GET /api/payments/history
   */
  async getUserPayments(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const payments = await PaymentService.getUserPayments(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get user payments controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Process refund
   * POST /api/payments/:id/refund
   */
  async processRefund(req, res) {
    try {
      const { reason } = req.body;
      const payment = await PaymentService.processRefund(req.params.id, reason);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Refund processed successfully',
        data: payment
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Process refund controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PaymentController();
