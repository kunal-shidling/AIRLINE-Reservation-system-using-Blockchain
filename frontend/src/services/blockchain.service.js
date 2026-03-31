import api from './api';

const blockchainService = {
  getBlockchain: async () => {
    const response = await api.get('/blockchain/chain');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/blockchain/stats');
    return response.data;
  },

  validateChain: async () => {
    const response = await api.get('/blockchain/validate');
    return response.data;
  },

  getTransaction: async (transactionId) => {
    const response = await api.get(`/blockchain/transaction/${transactionId}`);
    return response.data;
  }
};

export default blockchainService;
