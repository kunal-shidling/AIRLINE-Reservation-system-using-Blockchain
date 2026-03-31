/**
 * Reservation Service (Business Logic Layer)
 * Handles flight searches and booking operations
 */

const Flight = require('../models/Flight.model');
const Booking = require('../models/Booking.model');
const axios = require('axios');
const Logger = require('../../../../shared/utils/logger');
const { MESSAGES, BOOKING_STATUS } = require('../../../../shared/constants/status-codes');

const SERVICE_NAME = 'RESERVATION-SERVICE';

class ReservationService {
  /**
   * Search flights based on criteria
   * @param {Object} searchParams - Search parameters
   * @returns {Array} List of flights
   */
  async searchFlights(searchParams) {
    try {
      const { origin, destination, departureDate, passengers = 1, seatClass = 'economy' } = searchParams;

      // Convert passengers to number
      const passengerCount = parseInt(passengers, 10) || 1;

      const query = {
        isActive: true,
        status: 'SCHEDULED'
      };

      if (origin) {
        const originUpper = origin.toUpperCase();
        // Search by either airport code or city name
        query.$or = [
          { 'origin.airportCode': originUpper },
          { 'origin.city': new RegExp(`^${origin}$`, 'i') }
        ];
      }

      if (destination) {
        const destUpper = destination.toUpperCase();
        // If origin already has $or, combine both conditions
        if (query.$or) {
          const originOr = query.$or;
          delete query.$or;
          query.$and = [
            { $or: originOr },
            {
              $or: [
                { 'destination.airportCode': destUpper },
                { 'destination.city': new RegExp(`^${destination}$`, 'i') }
              ]
            }
          ];
        } else {
          query.$or = [
            { 'destination.airportCode': destUpper },
            { 'destination.city': new RegExp(`^${destination}$`, 'i') }
          ];
        }
      }

      if (departureDate) {
        const startDate = new Date(departureDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(departureDate);
        endDate.setHours(23, 59, 59, 999);

        if (query.$and) {
          query.$and.push({ departureTime: { $gte: startDate, $lte: endDate } });
        } else {
          query.departureTime = {
            $gte: startDate,
            $lte: endDate
          };
        }
      }

      // Filter by available seats
      query[`availableSeats.${seatClass}`] = { $gte: passengerCount };

      const flights = await Flight.find(query).sort({ departureTime: 1 });

      Logger.info(SERVICE_NAME, `Found ${flights.length} flights`, searchParams);

      return flights;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Flight search failed', error);
      throw error;
    }
  }

  /**
   * Get flight by ID
   * @param {String} flightId - Flight ID
   * @returns {Object} Flight details
   */
  async getFlightById(flightId) {
    try {
      const flight = await Flight.findById(flightId);

      if (!flight) {
        throw new Error(MESSAGES.FLIGHT_NOT_FOUND);
      }

      return flight;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to fetch flight', error);
      throw error;
    }
  }

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking information
   * @returns {Object} Created booking
   */
  async createBooking(bookingData) {
    try {
      const { userId, flightId, passengers, seatClass } = bookingData;

      // Get flight details
      const flight = await Flight.findById(flightId);
      if (!flight) {
        throw new Error(MESSAGES.FLIGHT_NOT_FOUND);
      }

      // Check seat availability
      const numberOfPassengers = passengers.length;
      if (!flight.hasAvailableSeats(seatClass, numberOfPassengers)) {
        throw new Error(MESSAGES.INSUFFICIENT_SEATS);
      }

      // Calculate total price
      const totalPrice = flight.price[seatClass] * numberOfPassengers;

      // Create booking
      const booking = new Booking({
        userId,
        flightId,
        bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        flightDetails: {
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          origin: `${flight.origin.city} (${flight.origin.airportCode})`,
          destination: `${flight.destination.city} (${flight.destination.airportCode})`,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime
        },
        passengers,
        seatClass,
        numberOfPassengers,
        totalPrice,
        status: BOOKING_STATUS.PENDING
      });

      await booking.save();

      // Update available seats
      flight.updateSeats(seatClass, numberOfPassengers, 'book');
      await flight.save();

      Logger.success(SERVICE_NAME, `Booking created: ${booking.bookingReference}`);

      return booking;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Booking creation failed', error);
      throw error;
    }
  }

  /**
   * Confirm booking after payment
   * @param {String} bookingId - Booking ID
   * @param {String} paymentId - Payment ID
   * @param {String} blockchainTxId - Blockchain transaction ID
   * @returns {Object} Updated booking
   */
  async confirmBooking(bookingId, paymentId, blockchainTxId) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new Error(MESSAGES.BOOKING_NOT_FOUND);
      }

      booking.status = BOOKING_STATUS.CONFIRMED;
      booking.paymentId = paymentId;
      booking.blockchainTransactionId = blockchainTxId;

      await booking.save();

      Logger.success(SERVICE_NAME, `Booking confirmed: ${booking.bookingReference}`);

      return booking;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Booking confirmation failed', error);
      throw error;
    }
  }

  /**
   * Cancel booking
   * @param {String} bookingId - Booking ID
   * @param {String} userId - User ID
   * @param {String} reason - Cancellation reason
   * @returns {Object} Updated booking
   */
  async cancelBooking(bookingId, userId, reason) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new Error(MESSAGES.BOOKING_NOT_FOUND);
      }

      // Verify ownership
      if (booking.userId.toString() !== userId) {
        throw new Error('Unauthorized to cancel this booking');
      }

      if (!booking.canBeCancelled()) {
        throw new Error('Booking cannot be cancelled');
      }

      // Restore seats
      const flight = await Flight.findById(booking.flightId);
      if (flight) {
        flight.updateSeats(booking.seatClass, booking.numberOfPassengers, 'cancel');
        await flight.save();
      }

      // Update booking status
      booking.status = BOOKING_STATUS.CANCELLED;
      booking.cancellationDate = new Date();
      booking.cancellationReason = reason;

      await booking.save();

      Logger.success(SERVICE_NAME, `Booking cancelled: ${booking.bookingReference}`);

      return booking;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Booking cancellation failed', error);
      throw error;
    }
  }

  /**
   * Get user bookings
   * @param {String} userId - User ID
   * @returns {Array} List of bookings
   */
  async getUserBookings(userId) {
    try {
      const bookings = await Booking.find({ userId })
        .populate('flightId')
        .sort({ bookingDate: -1 });

      return bookings;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to fetch user bookings', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   * @param {String} bookingId - Booking ID
   * @param {String} userId - User ID
   * @returns {Object} Booking details
   */
  async getBookingById(bookingId, userId) {
    try {
      const booking = await Booking.findById(bookingId).populate('flightId');

      if (!booking) {
        throw new Error(MESSAGES.BOOKING_NOT_FOUND);
      }

      // Verify ownership
      if (booking.userId.toString() !== userId) {
        throw new Error('Unauthorized access to booking');
      }

      return booking;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to fetch booking', error);
      throw error;
    }
  }

  /**
   * Get all flights (for admin/listing)
   * @returns {Array} List of all flights
   */
  async getAllFlights() {
    try {
      const flights = await Flight.find({ isActive: true }).sort({ departureTime: 1 });
      return flights;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to fetch flights', error);
      throw error;
    }
  }
}

module.exports = new ReservationService();
