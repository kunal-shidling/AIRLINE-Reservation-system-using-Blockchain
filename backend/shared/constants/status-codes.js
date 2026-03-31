/**
 * HTTP Status Codes and Response Messages
 * Centralized constants for consistent API responses
 */

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const MESSAGES = {
  // User Service
  USER_CREATED: 'User registered successfully',
  USER_LOGGED_IN: 'Login successful',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',

  // Reservation Service
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  BOOKING_NOT_FOUND: 'Booking not found',
  FLIGHT_NOT_FOUND: 'Flight not found',
  INSUFFICIENT_SEATS: 'Insufficient seats available',

  // Payment Service
  PAYMENT_SUCCESS: 'Payment processed successfully',
  PAYMENT_FAILED: 'Payment processing failed',
  INVALID_AMOUNT: 'Invalid payment amount',

  // Blockchain
  TRANSACTION_LOGGED: 'Transaction logged to blockchain',
  BLOCKCHAIN_INVALID: 'Blockchain integrity compromised',

  // General
  SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation error'
};

const BOOKING_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
};

const PAYMENT_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  REFUNDED: 'REFUNDED'
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
  BOOKING_STATUS,
  PAYMENT_STATUS
};
