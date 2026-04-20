/**
 * Blockchain Controller
 * Handles HTTP requests for blockchain operations
 */

const Blockchain = require('../blockchain/Blockchain');
const Transaction = require('../blockchain/Transaction');
const { HTTP_STATUS, MESSAGES } = require('../../../../shared/constants/status-codes');
const Logger = require('../../../../shared/utils/logger');

const SERVICE_NAME = 'BLOCKCHAIN';

// Create blockchain instance
const blockchain = new Blockchain();

class BlockchainController {
  /**
   * Initialize blockchain
   */
  async initialize() {
    await blockchain.initialize();
  }

  /**
   * Add transaction to blockchain
   * POST /api/blockchain/transactions
   */
  async addTransaction(req, res) {
    try {
      const { bookingId, transactionId, amount, timestamp, paymentMethod, status } = req.body;

      // Log the incoming transaction request
      Logger.debug(SERVICE_NAME, `Adding transaction for booking: ${bookingId}`);

      if (!bookingId || !transactionId || !amount) {
        const missing = [];
        if (!bookingId) missing.push('bookingId');
        if (!transactionId) missing.push('transactionId');
        if (!amount) missing.push('amount');

        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: `Missing required transaction fields: ${missing.join(', ')}`
        });
      }

      const transaction = new Transaction(
        bookingId,
        transactionId,
        amount,
        timestamp,
        paymentMethod,
        status
      );

      const newBlock = await blockchain.addTransaction(transaction);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.TRANSACTION_LOGGED,
        data: {
          transactionId: transactionId,
          blockIndex: newBlock.index,
          blockHash: newBlock.hash,
          timestamp: newBlock.timestamp
        }
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Add transaction controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get entire blockchain
   * GET /api/blockchain/chain
   */
  getAllBlocks(req, res) {
    try {
      const chain = blockchain.getAllBlocks();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        length: chain.length,
        data: chain
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get all blocks controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get block by index
   * GET /api/blockchain/blocks/:index
   */
  getBlockByIndex(req, res) {
    try {
      const index = parseInt(req.params.index);
      const block = blockchain.getBlockByIndex(index);

      if (!block) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Block not found'
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: block.toObject()
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get block controller error', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Validate blockchain integrity
   * GET /api/blockchain/validate
   */
  validateChain(req, res) {
    try {
      const isValid = blockchain.isChainValid();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        isValid: isValid,
        message: isValid ? 'Blockchain is valid' : MESSAGES.BLOCKCHAIN_INVALID
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Validate chain controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get blockchain statistics
   * GET /api/blockchain/stats
   */
  getStatistics(req, res) {
    try {
      const stats = blockchain.getStatistics();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: stats
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Get statistics controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Find transaction by booking ID
   * GET /api/blockchain/transactions/:bookingId
   */
  findTransaction(req, res) {
    try {
      const { bookingId } = req.params;
      const result = blockchain.findTransactionByBookingId(bookingId);

      if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Find transaction controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Remove all pending transactions from ledger
   * DELETE /api/blockchain/transactions/pending
   */
  async clearPendingTransactions(req, res) {
    try {
      const result = await blockchain.removePendingTransactions();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'All pending transactions removed from blockchain ledger',
        data: result
      });
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Clear pending transactions controller error', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BlockchainController();
