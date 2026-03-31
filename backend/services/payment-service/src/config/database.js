/**
 * Database Configuration
 * Handles MongoDB connection for Payment Service
 */

const mongoose = require('mongoose');
const Logger = require('../../../../shared/utils/logger');
const SERVICE_NAME = 'PAYMENT-SERVICE';

class Database {
  static async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, options);
      Logger.success(SERVICE_NAME, 'MongoDB connected successfully');
    } catch (error) {
      Logger.error(SERVICE_NAME, 'MongoDB connection failed', error);
      process.exit(1);
    }
  }

  static async disconnect() {
    try {
      await mongoose.disconnect();
      Logger.info(SERVICE_NAME, 'MongoDB disconnected');
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Error disconnecting from MongoDB', error);
    }
  }
}

module.exports = Database;
