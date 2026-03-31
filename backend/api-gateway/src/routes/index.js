/**
 * Gateway Routes
 * Routes requests to appropriate microservices
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const AuthMiddleware = require('../middleware/auth.middleware');
const { authLimiter, paymentLimiter } = require('../middleware/rateLimit.middleware');
const config = require('../config/config');
const Logger = require('../../../shared/utils/logger');
const { HTTP_STATUS } = require('../../../shared/constants/status-codes');

const SERVICE_NAME = 'API-GATEWAY';

/**
 * Helper function to forward requests to microservices
 */
async function forwardRequest(serviceUrl, path, method, data, headers) {
  try {
    const url = `${serviceUrl}${path}`;

    Logger.info(SERVICE_NAME, `Forwarding ${method} to ${url}`);

    // Remove the host header to prevent issues when forwarding
    const headersToForward = { ...headers };
    delete headersToForward.host;

    const axiosConfig = {
      method,
      url,
      headers: headersToForward
    };

    // Only include data and Content-Type for requests that have a body
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      axiosConfig.data = data;
      axiosConfig.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(axiosConfig);

    return response.data;
  } catch (error) {
    Logger.error(SERVICE_NAME, `Error forwarding to ${serviceUrl}${path}`, error);

    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data
      };
    }

    throw {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: {
        success: false,
        message: 'Service unavailable'
      }
    };
  }
}

// =====================
// USER SERVICE ROUTES
// =====================

router.post('/users/register', authLimiter, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.USER_SERVICE,
      config.ENDPOINTS.USER_REGISTER,
      'POST',
      req.body,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.post('/users/login', authLimiter, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.USER_SERVICE,
      config.ENDPOINTS.USER_LOGIN,
      'POST',
      req.body,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.get('/users/profile', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.USER_SERVICE,
      config.ENDPOINTS.USER_PROFILE,
      'GET',
      null,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.put('/users/profile', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.USER_SERVICE,
      config.ENDPOINTS.USER_UPDATE,
      'PUT',
      req.body,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.post('/users/change-password', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.USER_SERVICE,
      config.ENDPOINTS.USER_CHANGE_PASSWORD,
      'POST',
      req.body,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

// =====================
// RESERVATION SERVICE ROUTES
// =====================

router.get('/flights/search', async (req, res) => {
  try {
    // Add query parameters
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString ? `${config.ENDPOINTS.FLIGHTS_SEARCH}?${queryString}` : config.ENDPOINTS.FLIGHTS_SEARCH;

    const result = await forwardRequest(
      config.RESERVATION_SERVICE,
      url,
      'GET',
      null,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data || { success: false, message: 'Error forwarding to reservation service' });
  }
});

router.get('/flights', async (req, res) => {
  try {
    const response = await axios.get(`${config.RESERVATION_SERVICE}${config.ENDPOINTS.FLIGHTS_ALL}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

router.get('/flights/:id', async (req, res) => {
  try {
    const url = config.ENDPOINTS.FLIGHTS_BY_ID.replace(':id', req.params.id);
    const response = await axios.get(`${config.RESERVATION_SERVICE}${url}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

router.post('/bookings', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.RESERVATION_SERVICE,
      config.ENDPOINTS.BOOKINGS_CREATE,
      'POST',
      req.body,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.get('/bookings', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.RESERVATION_SERVICE,
      config.ENDPOINTS.BOOKINGS_USER,
      'GET',
      null,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.get('/bookings/:id', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const url = config.ENDPOINTS.BOOKINGS_BY_ID.replace(':id', req.params.id);
    const result = await forwardRequest(
      config.RESERVATION_SERVICE,
      url,
      'GET',
      null,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.put('/bookings/:id/cancel', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const url = config.ENDPOINTS.BOOKINGS_CANCEL.replace(':id', req.params.id);
    const result = await forwardRequest(
      config.RESERVATION_SERVICE,
      url,
      'PUT',
      req.body,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

// =====================
// PAYMENT SERVICE ROUTES
// =====================

router.post('/payments/process', AuthMiddleware.verifyToken, paymentLimiter, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.PAYMENT_SERVICE,
      config.ENDPOINTS.PAYMENTS_PROCESS,
      'POST',
      req.body,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

router.get('/payments/history', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await forwardRequest(
      config.PAYMENT_SERVICE,
      config.ENDPOINTS.PAYMENTS_HISTORY,
      'GET',
      null,
      req.headers
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error.data);
  }
});

// =====================
// AI SERVICE ROUTES
// =====================

router.post('/ai/recommendations', async (req, res) => {
  try {
    const response = await axios.post(
      `${config.AI_SERVICE}${config.ENDPOINTS.AI_RECOMMENDATIONS}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

router.post('/ai/demand/predict', async (req, res) => {
  try {
    const response = await axios.post(
      `${config.AI_SERVICE}${config.ENDPOINTS.AI_DEMAND}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

router.get('/ai/popular-destinations', async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString ? `${config.ENDPOINTS.AI_POPULAR}?${queryString}` : config.ENDPOINTS.AI_POPULAR;
    const response = await axios.get(`${config.AI_SERVICE}${url}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

// =====================
// BLOCKCHAIN SERVICE ROUTES
// =====================

router.get('/blockchain/chain', async (req, res) => {
  try {
    const response = await axios.get(`${config.BLOCKCHAIN_SERVICE}${config.ENDPOINTS.BLOCKCHAIN_CHAIN}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

router.get('/blockchain/stats', async (req, res) => {
  try {
    const response = await axios.get(`${config.BLOCKCHAIN_SERVICE}${config.ENDPOINTS.BLOCKCHAIN_STATS}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

router.get('/blockchain/validate', async (req, res) => {
  try {
    const response = await axios.get(`${config.BLOCKCHAIN_SERVICE}${config.ENDPOINTS.BLOCKCHAIN_VALIDATE}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { success: false, message: 'Error' });
  }
});

module.exports = router;
