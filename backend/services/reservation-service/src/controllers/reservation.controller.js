/**
 * Reservation Controller (Request Handler Layer)
 * Handles HTTP requests for flights and bookings
 */

const ReservationService = require('../services/reservation.service');
const { HTTP_STATUS, MESSAGES } = require('../../../../shared/constants/status-codes');
const Logger = require('../../../../shared/utils/logger');

const SERVICE_NAME = 'RESERVATION-SERVICE';

class ReservationController {
  /**
   * Search flights
   * GET /api/reservations/flights/search
   */
  async searchFlights(req, res) {
    try {
      const flights = await ReservationService.searchFlights(req.query);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        count: flights.length,
        data: flights
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Search flights controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all flights
   * GET /api/reservations/flights
   */
  async getAllFlights(req, res) {
    try {
      const flights = await ReservationService.getAllFlights();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        count: flights.length,
        data: flights
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get all flights controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get flight by ID
   * GET /api/reservations/flights/:id
   */
  async getFlightById(req, res) {
    try {
      const flight = await ReservationService.getFlightById(req.params.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: flight
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get flight controller error', error);
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Create booking
   * POST /api/reservations/bookings
   */
  async createBooking(req, res) {
    try {
      const userId = req.user.userId || req.user.id; // From auth middleware
      const bookingData = {
        ...req.body,
        userId
      };

      const booking = await ReservationService.createBooking(bookingData);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.BOOKING_CREATED,
        data: booking
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Create booking controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Confirm booking (called by payment service)
   * PUT /api/reservations/bookings/:id/confirm
   */
  async confirmBooking(req, res) {
    try {
      const { paymentId, blockchainTxId } = req.body;
      const booking = await ReservationService.confirmBooking(
        req.params.id,
        paymentId,
        blockchainTxId
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: booking
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Confirm booking controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Cancel booking
   * PUT /api/reservations/bookings/:id/cancel
   */
  async cancelBooking(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const { reason } = req.body;

      const booking = await ReservationService.cancelBooking(
        req.params.id,
        userId,
        reason || 'No reason provided'
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.BOOKING_CANCELLED,
        data: booking
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Cancel booking controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get user bookings
   * GET /api/reservations/bookings
   */
  async getUserBookings(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const bookings = await ReservationService.getUserBookings(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get user bookings controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get booking by ID
   * GET /api/reservations/bookings/:id
   */
  async getBookingById(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const booking = await ReservationService.getBookingById(req.params.id, userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: booking
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get booking controller error', error);
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ReservationController();
