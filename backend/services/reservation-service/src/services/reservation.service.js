/**
 * Reservation Service (Business Logic Layer)
 * Handles flight searches and booking operations
 */

const Flight = require('../models/Flight.model');
const Booking = require('../models/Booking.model');
const axios = require('axios');
const config = require('../config/config');
const Logger = require('../../../../shared/utils/logger');
const { MESSAGES, BOOKING_STATUS } = require('../../../../shared/constants/status-codes');

const SERVICE_NAME = 'RESERVATION-SERVICE';

const CITY_ALIASES = {
  delhi: ['delhi', 'new delhi'],
  'new delhi': ['new delhi', 'delhi'],
  bangalore: ['bangalore', 'bengaluru', 'bengalore'],
  bengaluru: ['bengaluru', 'bangalore', 'bengalore'],
  bengalore: ['bengalore', 'bangalore', 'bengaluru'],
  mumbai: ['mumbai', 'bombay'],
  bombay: ['bombay', 'mumbai'],
  goa: ['goa'],
  chennai: ['chennai', 'madras'],
  madras: ['madras', 'chennai'],
  hyderabad: ['hyderabad']
};

class ReservationService {
  getCitySearchValues(city) {
    const normalizedCity = city.trim().toLowerCase();
    return CITY_ALIASES[normalizedCity] || [normalizedCity];
  }

  buildLocationFilter(fieldName, value) {
    const normalizedValue = value.trim();
    const valueUpper = normalizedValue.toUpperCase();
    const cityValues = this.getCitySearchValues(normalizedValue);

    return {
      $or: [
        { [`${fieldName}.airportCode`]: valueUpper },
        {
          [`${fieldName}.city`]: {
            $in: cityValues.map((city) => new RegExp(`^${city}$`, 'i'))
          }
        }
      ]
    };
  }

  buildRouteQuery(origin, destination) {
    const routeFilters = [];

    if (origin) {
      routeFilters.push(this.buildLocationFilter('origin', origin));
    }

    if (destination) {
      routeFilters.push(this.buildLocationFilter('destination', destination));
    }

    if (routeFilters.length === 0) {
      return {};
    }

    if (routeFilters.length === 1) {
      return routeFilters[0];
    }

    return { $and: routeFilters };
  }

  buildDateRange(departureDate) {
    if (!departureDate) {
      return null;
    }

    const startDate = new Date(departureDate);
    const endDate = new Date(departureDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  createDynamicFlightFromTemplate(templateFlight, targetDate) {
    const templateDeparture = new Date(templateFlight.departureTime);
    const templateArrival = new Date(templateFlight.arrivalTime);

    const departureTime = new Date(targetDate);
    departureTime.setHours(
      templateDeparture.getHours(),
      templateDeparture.getMinutes(),
      templateDeparture.getSeconds(),
      templateDeparture.getMilliseconds()
    );

    const arrivalTime = new Date(departureTime.getTime() + ((templateFlight.duration || 0) * 60 * 1000));

    return {
      airline: templateFlight.airline,
      origin: templateFlight.origin,
      destination: templateFlight.destination,
      departureTime,
      arrivalTime: templateArrival > templateDeparture ? arrivalTime : departureTime,
      duration: templateFlight.duration,
      price: templateFlight.price,
      availableSeats: templateFlight.totalSeats || templateFlight.availableSeats,
      totalSeats: templateFlight.totalSeats || templateFlight.availableSeats,
      aircraft: templateFlight.aircraft,
      status: 'SCHEDULED',
      amenities: templateFlight.amenities || [],
      isActive: true
    };
  }

  async generateUniqueFlightNumber(templateFlight, seedDigits) {
    const flightPrefix = (templateFlight.flightNumber || '').slice(0, 2).toUpperCase() || 'AR';
    const candidates = [];

    if (seedDigits && String(seedDigits).length === 4) {
      candidates.push(String(seedDigits));
    }

    for (let i = 0; i < 5; i += 1) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      candidates.push(String(randomDigits));
    }

    for (const digits of candidates) {
      const flightNumber = `${flightPrefix}${digits}`;
      const exists = await Flight.exists({ flightNumber });
      if (!exists) {
        return flightNumber;
      }
    }

    throw new Error('Unable to generate a unique flight number');
  }

  async createOrReuseDynamicFlight(templateFlight, targetDate) {
    const baseFlight = this.createDynamicFlightFromTemplate(templateFlight, targetDate);
    const departureTime = baseFlight.departureTime;

    const existingFlight = await Flight.findOne({
      airline: baseFlight.airline,
      'origin.airportCode': baseFlight.origin.airportCode,
      'destination.airportCode': baseFlight.destination.airportCode,
      departureTime,
      isActive: true,
      status: 'SCHEDULED'
    });

    if (existingFlight) {
      return existingFlight;
    }

    const seedDigits = `${String(departureTime.getHours()).padStart(2, '0')}${String(departureTime.getMinutes()).padStart(2, '0')}`;
    const flightNumber = await this.generateUniqueFlightNumber(templateFlight, seedDigits);

    const flightData = {
      flightNumber,
      airline: baseFlight.airline,
      origin: baseFlight.origin,
      destination: baseFlight.destination,
      departureTime: baseFlight.departureTime,
      arrivalTime: baseFlight.arrivalTime,
      duration: baseFlight.duration,
      price: baseFlight.price,
      availableSeats: baseFlight.availableSeats,
      totalSeats: baseFlight.totalSeats,
      aircraft: baseFlight.aircraft,
      status: baseFlight.status,
      amenities: baseFlight.amenities,
      isDynamic: true,
      isActive: baseFlight.isActive
    };

    const createdFlight = new Flight(flightData);
    await createdFlight.save();

    return createdFlight;
  }

  getAirportCodeFromCity(city) {
    if (!city) {
      return 'XXX';
    }

    const letters = city.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (letters.length >= 3) {
      return letters.slice(0, 3);
    }

    return `${letters}${'X'.repeat(3 - letters.length)}`;
  }

  buildFallbackTemplates(origin, destination) {
    const originCity = origin.trim();
    const destinationCity = destination.trim();
    const originCode = this.getAirportCodeFromCity(originCity);
    const destinationCode = this.getAirportCodeFromCity(destinationCity);

    const baseDate = new Date();
    const scheduleHours = [9, 13, 18];
    const airlines = [
      { name: 'Air India', prefix: 'AI', prices: { economy: 4200, business: 8500, firstClass: 15000 }, duration: 90, aircraft: 'Boeing 737' },
      { name: 'SpiceJet', prefix: 'SG', prices: { economy: 3100, business: 6500, firstClass: 10500 }, duration: 110, aircraft: 'Airbus A320' },
      { name: 'Vistara', prefix: 'UK', prices: { economy: 5500, business: 11000, firstClass: 18000 }, duration: 80, aircraft: 'Airbus A321neo' }
    ];

    return scheduleHours.map((hour, index) => {
      const departureTime = new Date(baseDate);
      departureTime.setHours(hour, 0, 0, 0);
      const airlineData = airlines[index];

      return {
        flightNumber: `${airlineData.prefix}${100 + index}`,
        airline: airlineData.name,
        origin: {
          city: originCity,
          airport: `${originCity} Airport`,
          airportCode: originCode
        },
        destination: {
          city: destinationCity,
          airport: `${destinationCity} Airport`,
          airportCode: destinationCode
        },
        departureTime,
        arrivalTime: new Date(departureTime.getTime() + (airlineData.duration * 60 * 1000)),
        duration: airlineData.duration,
        price: airlineData.prices,
        availableSeats: {
          economy: 120,
          business: 24,
          firstClass: 8
        },
        totalSeats: {
          economy: 120,
          business: 24,
          firstClass: 8
        },
        aircraft: airlineData.aircraft,
        status: 'SCHEDULED',
        amenities: ['WIFI', 'MEALS']
      };
    });
  }

  async getDynamicFlightsForDate(searchParams) {
    const { origin, destination, departureDate } = searchParams;
    const dateRange = this.buildDateRange(departureDate);

    if (!origin || !destination || !dateRange) {
      return [];
    }

    const existingDynamicFlights = await Flight.find({
      isDynamic: true,
      isActive: true,
      status: 'SCHEDULED',
      ...this.buildRouteQuery(origin, destination),
      departureTime: {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate
      }
    }).sort({ departureTime: 1 });

    if (existingDynamicFlights.length > 0) {
      return existingDynamicFlights;
    }

    const routeTemplates = await Flight.find({
      isDynamic: { $ne: true },
      isActive: true,
      status: 'SCHEDULED',
      ...this.buildRouteQuery(origin, destination)
    })
      .sort({ departureTime: 1 })
      .limit(5);

    if (routeTemplates.length === 0) {
      const fallbackTemplates = this.buildFallbackTemplates(origin, destination);
      const fallbackFlights = await Promise.all(
        fallbackTemplates.map((templateFlight) =>
          this.createOrReuseDynamicFlight(templateFlight, dateRange.startDate)
        )
      );

      Logger.info(
        SERVICE_NAME,
        `Prepared ${fallbackFlights.length} fallback dynamic flights for ${origin} to ${destination} on ${departureDate}`
      );

      return fallbackFlights;
    }

    const dynamicFlights = await Promise.all(
      routeTemplates.map((templateFlight) =>
        this.createOrReuseDynamicFlight(templateFlight, dateRange.startDate)
      )
    );

    Logger.info(
      SERVICE_NAME,
      `Prepared ${dynamicFlights.length} dynamic flights for ${origin} to ${destination} on ${departureDate}`
    );

    return dynamicFlights;
  }

  /**
   * Search flights based on criteria with AI-driven price adjustments
   * @param {Object} searchParams - Search parameters
   * @returns {Array} List of flights
   */
  async searchFlights(searchParams) {
    try {
      const { origin, destination, departureDate, passengers = 1, seatClass = 'economy' } = searchParams;

      // Convert passengers to number
      const passengerCount = parseInt(passengers, 10) || 1;
      const routeQuery = this.buildRouteQuery(origin, destination);
      const dateRange = this.buildDateRange(departureDate);

      const query = {
        isActive: true,
        status: 'SCHEDULED',
        ...routeQuery
      };

      if (dateRange) {
        query.departureTime = {
          $gte: dateRange.startDate,
          $lte: dateRange.endDate
        };
      }

      // Filter by available seats
      query[`availableSeats.${seatClass}`] = { $gte: passengerCount };

      let flights = await Flight.find(query).sort({ departureTime: 1 });

      if (flights.length === 0 && origin && destination && dateRange) {
        flights = await this.getDynamicFlightsForDate(searchParams);
        flights = flights.filter((flight) =>
          (flight.availableSeats?.[seatClass] || 0) >= passengerCount
        );
      }

      // Next-Generation: Integrate AI for Dynamic Pricing
      try {
        const aiAdjustedFlights = await Promise.all(flights.map(async (flight) => {
          try {
            const daysUntil = Math.ceil((new Date(flight.departureTime) - new Date()) / (1000 * 60 * 60 * 24));
            
            const response = await axios.post(`${config.AI_SERVICE}${config.ENDPOINTS.AI.PRICE}`, {
              route: {
                origin: flight.origin.airportCode,
                destination: flight.destination.airportCode
              },
              currentPrice: flight.price[seatClass],
              daysUntilDeparture: daysUntil > 0 ? daysUntil : 0
            }, { timeout: 1000 });

            if (response.data && response.data.success) {
              const flightObj = flight.toObject ? flight.toObject() : { ...flight };
              flightObj.originalPrice = flight.price[seatClass];
              flightObj.price[seatClass] = response.data.data.predictedPrice;
              flightObj.aiPriceNote = "AI-Driven Dynamic Pricing Applied";
              return flightObj;
            }
          } catch (aiErr) {
            // Silently fail and use original flight if AI service is unavailable
          }
          return flight;
        }));
        flights = aiAdjustedFlights;
      } catch (overallAiErr) {
        Logger.error(SERVICE_NAME, 'AI Price adjustment failed', overallAiErr);
      }

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

      // Next-Generation: Blockchain Integration
      // Every valid booking is recorded in the immutable ledger
      try {
        await axios.post(`${config.BLOCKCHAIN_SERVICE}${config.ENDPOINTS.BLOCKCHAIN.RECORD}`, {
          bookingId: booking.bookingReference,
          transactionId: `TX-${booking._id}`,
          amount: booking.totalPrice,
          paymentMethod: 'EXTERNAL',
          status: booking.status,
          timestamp: new Date()
        }, { timeout: 2000 });
        Logger.info(SERVICE_NAME, `Booking ${booking.bookingReference} recorded on blockchain`);
      } catch (bcError) {
        Logger.error(SERVICE_NAME, 'Blockchain logging failed', bcError);
        // We continue anyway as the main DB update succeeded
      }

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
