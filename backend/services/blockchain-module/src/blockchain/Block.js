/**
 * Block Class (OOP Implementation)
 * Represents a single block in the blockchain
 */

const crypto = require('crypto');

class Block {
  /**
   * Create a new block
   * @param {Number} index - Block index in chain
   * @param {Array} transactions - List of transactions
   * @param {String} previousHash - Hash of previous block
   * @param {String} timestamp - Block creation timestamp
   */
  constructor(index, transactions, previousHash = '', timestamp = null) {
    this.index = index;
    this.timestamp = timestamp || new Date().toISOString();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate block hash using SHA-256
   * @returns {String} Calculated hash
   */
  calculateHash() {
    const blockData =
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce;

    return crypto
      .createHash('sha256')
      .update(blockData)
      .digest('hex');
  }

  /**
   * Mine block with proof-of-work (simplified)
   * @param {Number} difficulty - Mining difficulty (number of leading zeros)
   */
  mineBlock(difficulty = 2) {
    const target = Array(difficulty + 1).join('0');

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }

  /**
   * Validate block hash
   * @returns {Boolean} True if hash is valid
   */
  hasValidHash() {
    return this.hash === this.calculateHash();
  }

  /**
   * Convert block to plain object
   * @returns {Object} Block data
   */
  toObject() {
    return {
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions.map(tx =>
        typeof tx.toObject === 'function' ? tx.toObject() : tx
      ),
      previousHash: this.previousHash,
      nonce: this.nonce,
      hash: this.hash
    };
  }

  /**
   * Create block from plain object
   * @param {Object} obj - Block object
   * @returns {Block} Block instance
   */
  static fromObject(obj) {
    const block = new Block(
      obj.index,
      obj.transactions,
      obj.previousHash,
      obj.timestamp
    );
    block.nonce = obj.nonce;
    block.hash = obj.hash;
    return block;
  }
}

module.exports = Block;
