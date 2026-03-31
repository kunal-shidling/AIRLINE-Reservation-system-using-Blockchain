/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 */

const jwt = require('jsonwebtoken');
const Logger = require('../../../shared/utils/logger');
const { HTTP_STATUS } = require('../../../shared/constants/status-codes');

const SERVICE_NAME = 'API-GATEWAY';

class AuthMiddleware {
  /**
   * Verify JWT token
   */
  static verifyToken(req, res, next) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'No token provided'
        });
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request
      req.user = decoded;

      // Propagate trusted user headers for downstream services
      req.headers['x-user-id'] = decoded.userId || decoded.id;
      req.headers['x-user-email'] = decoded.email || '';
      req.headers['x-internal-request'] = 'api-gateway';

      // Log authenticated request
      Logger.info(SERVICE_NAME, `Authenticated request: ${req.method} ${req.path}`, {
        userId: decoded.userId || decoded.id,
        email: decoded.email
      });

      next();
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Token verification failed', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Token expired'
        });
      }

      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }

  /**
   * Optional authentication (for routes that work with or without auth)
   */
  static optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      }

      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  }
}

module.exports = AuthMiddleware;
