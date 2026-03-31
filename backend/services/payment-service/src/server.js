/**
 * Payment Service Entry Point
 * Initializes Express server and connects to database
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('./config/database');
const paymentRoutes = require('./routes/payment.routes');
const Logger = require('../../../shared/utils/logger');

const SERVICE_NAME = 'PAYMENT-SERVICE';
const PORT = process.env.PORT || 5003;

class PaymentServiceServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, res, next) => {
      Logger.info(SERVICE_NAME, `${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        service: SERVICE_NAME,
        status: 'running',
        timestamp: new Date().toISOString()
      });
    });

    this.app.use('/api/payments', paymentRoutes);

    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  }

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

  async start() {
    try {
      await Database.connect();

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

const server = new PaymentServiceServer();
server.start();

process.on('SIGTERM', async () => {
  Logger.info(SERVICE_NAME, 'SIGTERM received, shutting down gracefully');
  await Database.disconnect();
  process.exit(0);
});
