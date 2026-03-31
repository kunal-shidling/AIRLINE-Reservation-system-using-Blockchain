/**
 * Blockchain Routes
 * Defines API endpoints for blockchain operations
 */

const express = require('express');
const router = express.Router();
const BlockchainController = require('../controllers/blockchain.controller');

// Transaction routes
router.post('/transactions', BlockchainController.addTransaction);
router.get('/transactions/:bookingId', BlockchainController.findTransaction);

// Blockchain routes
router.get('/chain', BlockchainController.getAllBlocks);
router.get('/blocks/:index', BlockchainController.getBlockByIndex);
router.get('/validate', BlockchainController.validateChain);
router.get('/stats', BlockchainController.getStatistics);

module.exports = router;
