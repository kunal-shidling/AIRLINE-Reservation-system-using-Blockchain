/**
 * Reservation Service External Services Configuration
 */

module.exports = {
  AI_SERVICE: process.env.AI_SERVICE_URL || 'http://localhost:5004',
  BLOCKCHAIN_SERVICE: process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:5005',
  
  ENDPOINTS: {
    AI: {
      RECOMMENDATIONS: '/api/ai/recommendations',
      DEMAND: '/api/ai/demand/predict',
      PRICE: '/api/ai/price/predict'
    },
    BLOCKCHAIN: {
      RECORD: '/api/blockchain/transactions'
    }
  }
};
