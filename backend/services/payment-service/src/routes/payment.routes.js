/**
 * Payment Routes
 * Defines API endpoints for payment service
 */

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

// Simple auth middleware
const authMiddleware = (req, res, next) => {
  const internalRequest = req.headers['x-internal-request'];
  const forwardedUserId = req.headers['x-user-id'];
  const forwardedEmail = req.headers['x-user-email'];

  if (internalRequest === 'api-gateway' && forwardedUserId) {
    req.user = {
      userId: forwardedUserId,
      email: forwardedEmail
    };
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-12345'
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Protected routes
router.post('/process', authMiddleware, PaymentController.processPayment);
router.get('/history', authMiddleware, PaymentController.getUserPayments);
router.get('/:id', authMiddleware, PaymentController.getPaymentById);
router.get('/booking/:bookingId', authMiddleware, PaymentController.getPaymentByBookingId);
router.post('/:id/refund', authMiddleware, PaymentController.processRefund);

module.exports = router;
