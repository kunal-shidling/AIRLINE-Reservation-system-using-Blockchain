/**
 * Rate Limiting Middleware
 * Prevents API abuse and DDoS attacks
 */

const rateLimit = require('express-rate-limit');
const Logger = require('../../../shared/utils/logger');

const SERVICE_NAME = 'API-GATEWAY';

/**
 * General rate limiter for all routes
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    Logger.warn(SERVICE_NAME, `Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }
});

/**
 * Strict rate limiter for authentication routes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    Logger.warn(SERVICE_NAME, `Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again after 15 minutes'
    });
  }
});

/**
 * Payment rate limiter (extra strict)
 */
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
  message: {
    success: false,
    message: 'Too many payment requests, please try again later'
  },
  handler: (req, res) => {
    Logger.warn(SERVICE_NAME, `Payment rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many payment requests, please contact support'
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter
};
