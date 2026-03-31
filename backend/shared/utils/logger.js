/**
 * Logger Utility
 * Simple logging utility for consistent logging across services
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class Logger {
  /**
   * Format timestamp for logs
   */
  static getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Info level logging
   */
  static info(serviceName, message, data = null) {
    console.log(
      `${colors.blue}[INFO]${colors.reset} [${this.getTimestamp()}] [${serviceName}] ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  }

  /**
   * Error level logging
   */
  static error(serviceName, message, error = null) {
    console.error(
      `${colors.red}[ERROR]${colors.reset} [${this.getTimestamp()}] [${serviceName}] ${message}`,
      error ? error.stack || error : ''
    );
  }

  /**
   * Warning level logging
   */
  static warn(serviceName, message, data = null) {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} [${this.getTimestamp()}] [${serviceName}] ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  }

  /**
   * Success level logging
   */
  static success(serviceName, message, data = null) {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} [${this.getTimestamp()}] [${serviceName}] ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  }

  /**
   * Debug level logging
   */
  static debug(serviceName, message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${colors.cyan}[DEBUG]${colors.reset} [${this.getTimestamp()}] [${serviceName}] ${message}`,
        data ? JSON.stringify(data, null, 2) : ''
      );
    }
  }
}

module.exports = Logger;
