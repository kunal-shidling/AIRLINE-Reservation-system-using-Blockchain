/**
 * Reservation Routes
 * Defines API endpoints for reservation service
 */

const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservation.controller');

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

// Flight routes
router.get('/flights/search', ReservationController.searchFlights);
router.get('/flights', ReservationController.getAllFlights);
router.get('/flights/:id', ReservationController.getFlightById);

// Booking routes (protected)
router.post('/bookings', authMiddleware, ReservationController.createBooking);
router.get('/bookings', authMiddleware, ReservationController.getUserBookings);
router.get('/bookings/:id', authMiddleware, ReservationController.getBookingById);
router.put('/bookings/:id/confirm', ReservationController.confirmBooking); // Called by payment service
router.put('/bookings/:id/cancel', authMiddleware, ReservationController.cancelBooking);

module.exports = router;
