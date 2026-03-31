/**
 * User Service Entry Point
 * Initializes Express server and connects to database
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('./config/database');
const userRoutes = require('./routes/user.routes');
const Logger = require('../../../shared/utils/logger');

const SERVICE_NAME = 'USER-SERVICE';
const PORT = process.env.PORT || 5001;

class UserServiceServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      Logger.info(SERVICE_NAME, `${req.method} ${req.path}`, {
        body: req.body,
        query: req.query
      });
      next();
    });
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        service: SERVICE_NAME,
        status: 'running',
        timestamp: new Date().toISOString()
      });
    });

    // User routes
    this.app.use('/api/users', userRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      Logger.error(SERVICE_NAME, 'Unhandled error', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });
  }

  /**
   * Start the server
   */
  async start() {
    try {
      // Connect to database
      await Database.connect();

      // Start Express server
      this.app.listen(PORT, () => {
        Logger.success(SERVICE_NAME, `Server running on port ${PORT}`);
        Logger.info(SERVICE_NAME, `Environment: ${process.env.NODE_ENV}`);
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to start server', error);
      process.exit(1);
    }
  }
}

// Initialize and start server
const server = new UserServiceServer();
server.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  Logger.info(SERVICE_NAME, 'SIGTERM received, shutting down gracefully');
  await Database.disconnect();
  process.exit(0);
});
