/**
 * API Gateway Server
 * Central entry point for all client requests
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const Logger = require('../../shared/utils/logger');

const SERVICE_NAME = 'API-GATEWAY';
const PORT = process.env.PORT || 5000;

class APIGateway {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Basic security headers
    this.app.use(helmet());

    // Configure Content Security Policy
    this.app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // Allow self and inline scripts for React
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5001", "http://localhost:5002", "http://localhost:5003", "http://localhost:5004", "http://localhost:5005", "https://sepolia.infura.io"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      })
    );

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Apply rate limiting to all routes
    this.app.use(generalLimiter);

    // Request logging
    this.app.use((req, res, next) => {
      Logger.info(SERVICE_NAME, `${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        service: SERVICE_NAME,
        status: 'running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API version info
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Airline Reservation System - API Gateway',
        version: '1.0.0',
        services: {
          user: 'User authentication and profile management',
          reservation: 'Flight search and booking',
          payment: 'Payment processing',
          ai: 'AI-powered recommendations',
          blockchain: 'Transaction ledger'
        },
        documentation: '/api/docs'
      });
    });

    // Mount API routes
    this.app.use('/api', routes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((err, req, res, next) => {
      Logger.error(SERVICE_NAME, 'Unhandled error', err);

      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });
  }

  start() {
    try {
      this.app.listen(PORT, () => {
        Logger.success(SERVICE_NAME, `🚀 Gateway running on port ${PORT}`);
        Logger.info(SERVICE_NAME, `Environment: ${process.env.NODE_ENV}`);
        Logger.info(SERVICE_NAME, `All microservices accessible through this gateway`);
        console.log('\n📡 Available Services:');
        console.log(`   - User Service: ${process.env.USER_SERVICE_URL}`);
        console.log(`   - Reservation Service: ${process.env.RESERVATION_SERVICE_URL}`);
        console.log(`   - Payment Service: ${process.env.PAYMENT_SERVICE_URL}`);
        console.log(`   - AI Service: ${process.env.AI_SERVICE_URL}`);
        console.log(`   - Blockchain Service: ${process.env.BLOCKCHAIN_SERVICE_URL}\n`);
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to start gateway', error);
      process.exit(1);
    }
  }
}

// Initialize and start gateway
const gateway = new APIGateway();
gateway.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info(SERVICE_NAME, 'SIGTERM received, shutting down gracefully');
  process.exit(0);
});
