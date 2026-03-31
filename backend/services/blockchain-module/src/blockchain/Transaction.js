/**
 * Transaction Class
 * Represents a single transaction in the blockchain
 */

class Transaction {
  /**
   * Create a new transaction
   * @param {String} bookingId - Booking reference ID
   * @param {String} transactionId - Payment transaction ID
   * @param {Number} amount - Transaction amount
   * @param {String} timestamp - Transaction timestamp
   * @param {String} paymentMethod - Payment method used
   * @param {String} status - Transaction status
   */
  constructor(bookingId, transactionId, amount, timestamp, paymentMethod, status) {
    this.bookingId = bookingId;
    this.transactionId = transactionId;
    this.amount = amount;
    this.timestamp = timestamp || new Date().toISOString();
    this.paymentMethod = paymentMethod;
    this.status = status;
  }

  /**
   * Get transaction data as object
   * @returns {Object} Transaction data
   */
  toObject() {
    return {
      bookingId: this.bookingId,
      transactionId: this.transactionId,
      amount: this.amount,
      timestamp: this.timestamp,
      paymentMethod: this.paymentMethod,
      status: this.status
    };
  }

  /**
   * Create transaction from object
   * @param {Object} obj - Transaction object
   * @returns {Transaction} Transaction instance
   */
  static fromObject(obj) {
    return new Transaction(
      obj.bookingId,
      obj.transactionId,
      obj.amount,
      obj.timestamp,
      obj.paymentMethod,
      obj.status
    );
  }
}

module.exports = Transaction;
