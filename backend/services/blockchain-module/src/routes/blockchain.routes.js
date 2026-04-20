/**
 * Blockchain Routes
 * Defines API endpoints for blockchain operations
 */

const express = require('express');
const router = express.Router();
const BlockchainController = require('../controllers/blockchain.controller');

const requireAdminKey = (req, res, next) => {
	const configuredAdminKey = process.env.BLOCKCHAIN_ADMIN_KEY;

	if (!configuredAdminKey) {
		return res.status(503).json({
			success: false,
			message: 'Blockchain admin key is not configured on server'
		});
	}

	const providedAdminKey = req.headers['x-admin-key'];
	if (providedAdminKey !== configuredAdminKey) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized: invalid admin key'
		});
	}

	return next();
};

// Transaction routes
router.post('/transactions', BlockchainController.addTransaction);
router.get('/transactions/:bookingId', BlockchainController.findTransaction);
router.delete('/transactions/pending', requireAdminKey, BlockchainController.clearPendingTransactions);

// Blockchain routes
router.get('/chain', BlockchainController.getAllBlocks);
router.get('/blocks/:index', BlockchainController.getBlockByIndex);
router.get('/validate', BlockchainController.validateChain);
router.get('/stats', BlockchainController.getStatistics);

module.exports = router;
