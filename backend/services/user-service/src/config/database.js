const mongoose = require('mongoose');
const Logger = require('../../../../shared/utils/logger');

class Database {
  static async connect() {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      Logger.success('USER-SERVICE', `MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      Logger.error('USER-SERVICE', 'MongoDB connection failed', error);
      process.exit(1);
    }
  }

  static async disconnect() {
    try {
      await mongoose.disconnect();
      Logger.info('USER-SERVICE', 'MongoDB Disconnected');
    } catch (error) {
      Logger.error('USER-SERVICE', 'MongoDB disconnection failed', error);
    }
  }
}

module.exports = Database;
