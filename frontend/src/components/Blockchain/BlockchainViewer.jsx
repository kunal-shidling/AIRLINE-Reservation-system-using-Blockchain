/**
 * Blockchain Viewer Component
 */

import React, { useState, useEffect } from 'react';
import blockchainService from '../../services/blockchain.service';

const BlockchainViewer = () => {
  const [blockchain, setBlockchain] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationStatus, setValidationStatus] = useState(null);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      const [chainResponse, statsResponse] = await Promise.all([
        blockchainService.getBlockchain(),
        blockchainService.getStats()
      ]);

      if (chainResponse.success) {
        setBlockchain(chainResponse.data);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Failed to fetch blockchain data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      const response = await blockchainService.validateChain();
      setValidationStatus(response.isValid ? 'valid' : 'invalid');
      setTimeout(() => setValidationStatus(null), 3000);
    } catch (err) {
      setValidationStatus('error');
    }
  };

  if (loading) return <div className="loading">Loading blockchain...</div>;

  return (
    <div className="blockchain-container">
      <h2>⛓️ Blockchain Ledger</h2>

      {stats && (
        <div className="blockchain-stats">
          <div className="stat-card">
            <h3>{stats.totalBlocks}</h3>
            <p>Total Blocks</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalTransactions}</h3>
            <p>Transactions</p>
          </div>
          <div className="stat-card">
            <h3>{stats.difficulty}</h3>
            <p>Difficulty</p>
          </div>
          <div className="stat-card">
            <h3>{stats.isValid ? '✅' : '❌'}</h3>
            <p>Chain Valid</p>
          </div>
        </div>
      )}

      <div className="blockchain-actions">
        <button onClick={handleValidate} className="btn-primary">
          Validate Chain
        </button>
        {validationStatus && (
          <span className={`validation-status ${validationStatus}`}>
            {validationStatus === 'valid' && '✅ Blockchain is valid'}
            {validationStatus === 'invalid' && '❌ Blockchain integrity compromised'}
            {validationStatus === 'error' && '⚠️ Validation failed'}
          </span>
        )}
      </div>

      <div className="blocks-list">
        <h3>Blocks</h3>
        {blockchain.map((block) => (
          <div key={block.index} className="block-card">
            <div className="block-header">
              <h4>Block #{block.index}</h4>
              <span className="block-timestamp">
                {new Date(block.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="block-details">
              <p><strong>Hash:</strong> <code>{block.hash}</code></p>
              <p><strong>Previous Hash:</strong> <code>{block.previousHash}</code></p>
              <p><strong>Nonce:</strong> {block.nonce}</p>
              <p><strong>Transactions:</strong> {block.transactions.length}</p>
            </div>
            <div className="transactions">
              {block.transactions.map((tx, idx) => (
                <div key={idx} className="transaction">
                  <p><strong>Booking:</strong> {tx.bookingId}</p>
                  <p><strong>Transaction:</strong> {tx.transactionId}</p>
                  <p><strong>Amount:</strong> ₹{tx.amount}</p>
                  <p><strong>Status:</strong> {tx.status}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainViewer;
