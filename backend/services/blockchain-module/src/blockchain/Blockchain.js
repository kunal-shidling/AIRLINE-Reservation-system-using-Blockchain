/**
 * Blockchain Class (OOP Implementation)
 * Manages the complete blockchain with immutability and validation
 */

const Block = require('./Block');
const Transaction = require('./Transaction');
const fs = require('fs').promises;
const path = require('path');
const Logger = require('../../../../shared/utils/logger');

const SERVICE_NAME = 'BLOCKCHAIN';

class Blockchain {
  /**
   * Initialize blockchain
   */
  constructor() {
    this.chain = [];
    this.difficulty = 2; // Mining difficulty
    this.storagePath = path.join(__dirname, '../storage/chain.json');
  }

  /**
   * Initialize blockchain with genesis block or load from storage
   */
  async initialize() {
    try {
      await this.loadFromStorage();

      if (this.chain.length === 0) {
        this.createGenesisBlock();
        await this.saveToStorage();
        Logger.success(SERVICE_NAME, 'Genesis block created');
      } else {
        Logger.success(SERVICE_NAME, `Blockchain loaded with ${this.chain.length} blocks`);
      }
    } catch (error) {
      Logger.warn(SERVICE_NAME, 'Creating new blockchain');
      this.createGenesisBlock();
      await this.saveToStorage();
    }
  }

  /**
   * Create the first block (Genesis Block)
   */
  createGenesisBlock() {
    const genesisTransaction = new Transaction(
      'GENESIS',
      'GENESIS-TX',
      0,
      new Date().toISOString(),
      'SYSTEM',
      'GENESIS'
    );

    const genesisBlock = new Block(0, [genesisTransaction], '0');
    genesisBlock.mineBlock(this.difficulty);
    this.chain.push(genesisBlock);
  }

  /**
   * Get the latest block in chain
   * @returns {Block} Latest block
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new transaction to blockchain
   * @param {Transaction} transaction - Transaction to add
   * @returns {Block} Newly created block
   */
  async addTransaction(transaction) {
    try {
      const latestBlock = this.getLatestBlock();
      const newBlock = new Block(
        latestBlock.index + 1,
        [transaction],
        latestBlock.hash
      );

      newBlock.mineBlock(this.difficulty);
      this.chain.push(newBlock);

      await this.saveToStorage();

      Logger.success(SERVICE_NAME, `Block ${newBlock.index} added to chain`);

      return newBlock;
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to add transaction', error);
      throw error;
    }
  }

  /**
   * Validate entire blockchain
   * @returns {Boolean} True if blockchain is valid
   */
  isChainValid() {
    // Check genesis block
    const genesisBlock = this.chain[0];
    if (genesisBlock.hash !== genesisBlock.calculateHash()) {
      Logger.error(SERVICE_NAME, 'Genesis block tampered');
      return false;
    }

    // Validate each block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if current block hash is valid
      if (!currentBlock.hasValidHash()) {
        Logger.error(SERVICE_NAME, `Block ${i} has invalid hash`);
        return false;
      }

      // Check if previous hash matches
      if (currentBlock.previousHash !== previousBlock.hash) {
        Logger.error(SERVICE_NAME, `Block ${i} has invalid previous hash`);
        return false;
      }

      // Check mining difficulty
      if (!currentBlock.hash.startsWith(Array(this.difficulty + 1).join('0'))) {
        Logger.error(SERVICE_NAME, `Block ${i} was not properly mined`);
        return false;
      }
    }

    Logger.success(SERVICE_NAME, 'Blockchain is valid');
    return true;
  }

  /**
   * Get all blocks in chain
   * @returns {Array} Array of blocks
   */
  getAllBlocks() {
    return this.chain.map(block => block.toObject());
  }

  /**
   * Get block by index
   * @param {Number} index - Block index
   * @returns {Block} Block at index
   */
  getBlockByIndex(index) {
    if (index >= 0 && index < this.chain.length) {
      return this.chain[index];
    }
    return null;
  }

  /**
   * Search transaction by booking ID
   * @param {String} bookingId - Booking ID
   * @returns {Object} Transaction and block info
   */
  findTransactionByBookingId(bookingId) {
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      for (let tx of block.transactions) {
        if (tx.bookingId === bookingId) {
          return {
            transaction: tx,
            blockIndex: block.index,
            blockHash: block.hash,
            timestamp: block.timestamp
          };
        }
      }
    }
    return null;
  }

  /**
   * Get blockchain statistics
   * @returns {Object} Blockchain stats
   */
  getStatistics() {
    return {
      totalBlocks: this.chain.length,
      totalTransactions: this.chain.reduce((sum, block) => sum + block.transactions.length, 0),
      difficulty: this.difficulty,
      isValid: this.isChainValid(),
      latestBlockHash: this.getLatestBlock().hash,
      createdAt: this.chain[0].timestamp
    };
  }

  /**
   * Save blockchain to file storage
   */
  async saveToStorage() {
    try {
      const chainData = this.chain.map(block => block.toObject());
      const dir = path.dirname(this.storagePath);

      // Create directory if it doesn't exist
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }

      await fs.writeFile(this.storagePath, JSON.stringify(chainData, null, 2));
      Logger.info(SERVICE_NAME, 'Blockchain saved to storage');
    } catch (error) {
      Logger.error(SERVICE_NAME, 'Failed to save blockchain', error);
      throw error;
    }
  }

  /**
   * Load blockchain from file storage
   */
  async loadFromStorage() {
    try {
      const data = await fs.readFile(this.storagePath, 'utf8');
      const chainData = JSON.parse(data);

      this.chain = chainData.map(blockData => Block.fromObject(blockData));

      Logger.info(SERVICE_NAME, 'Blockchain loaded from storage');
    } catch (error) {
      Logger.warn(SERVICE_NAME, 'No existing blockchain found');
      throw error;
    }
  }
}

module.exports = Blockchain;
