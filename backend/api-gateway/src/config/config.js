/**
 * Service URLs Configuration
 * Central configuration for all microservices
 */

module.exports = {
  USER_SERVICE: process.env.USER_SERVICE_URL || 'http://localhost:5001',
  RESERVATION_SERVICE: process.env.RESERVATION_SERVICE_URL || 'http://localhost:5002',
  PAYMENT_SERVICE: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5003',
  AI_SERVICE: process.env.AI_SERVICE_URL || 'http://localhost:5004',
  BLOCKCHAIN_SERVICE: process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:5005',

  // Service endpoints mapping
  ENDPOINTS: {
    // User Service
    USER_REGISTER: '/api/users/register',
    USER_LOGIN: '/api/users/login',
    USER_PROFILE: '/api/users/profile',
    USER_UPDATE: '/api/users/profile',
    USER_CHANGE_PASSWORD: '/api/users/change-password',

    // Reservation Service
    FLIGHTS_SEARCH: '/api/reservations/flights/search',
    FLIGHTS_ALL: '/api/reservations/flights',
    FLIGHTS_BY_ID: '/api/reservations/flights/:id',
    BOOKINGS_CREATE: '/api/reservations/bookings',
    BOOKINGS_USER: '/api/reservations/bookings',
    BOOKINGS_BY_ID: '/api/reservations/bookings/:id',
    BOOKINGS_CANCEL: '/api/reservations/bookings/:id/cancel',

    // Payment Service
    PAYMENTS_PROCESS: '/api/payments/process',
    PAYMENTS_HISTORY: '/api/payments/history',
    PAYMENTS_BY_ID: '/api/payments/:id',
    PAYMENTS_BY_BOOKING: '/api/payments/booking/:bookingId',

    // AI Service
    AI_RECOMMENDATIONS: '/api/ai/recommendations',
    AI_DEMAND: '/api/ai/demand/predict',
    AI_PRICE: '/api/ai/price/predict',
    AI_POPULAR: '/api/ai/popular-destinations',

    // Blockchain Service
    BLOCKCHAIN_CHAIN: '/api/blockchain/chain',
    BLOCKCHAIN_STATS: '/api/blockchain/stats',
    BLOCKCHAIN_VALIDATE: '/api/blockchain/validate',
    BLOCKCHAIN_TRANSACTION: '/api/blockchain/transactions/:bookingId'
  }
};
