import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import blockchainService from '../../services/blockchain.service';

gsap.registerPlugin(ScrollTrigger);

const BlockchainViewer = () => {
  const [blockchain, setBlockchain] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationStatus, setValidationStatus] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || loading) return undefined;

    const ctx = gsap.context(() => {
      const heroItems = root.querySelectorAll('.blockchain-hero-title, .blockchain-hero-subtitle');
      const statCards = root.querySelectorAll('.blockchain-stat-card');
      const blockCards = root.querySelectorAll('.blockchain-block-card');

      if (heroItems.length) {
        gsap.fromTo(
          heroItems,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.85, ease: 'power3.out' }
        );
      }

      if (statCards.length) {
        gsap.fromTo(
          statCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.blockchain-stats-section',
              start: 'top 80%'
            }
          }
        );
      }

      if (blockCards.length) {
        gsap.fromTo(
          blockCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.blockchain-blocks-section',
              start: 'top 75%'
            }
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [loading, blockchain.length, validationStatus]);

  const fetchBlockchainData = async () => {
    try {
      const [chainResponse, statsResponse] = await Promise.all([
        blockchainService.getBlockchain(),
        blockchainService.getStats()
      ]);
      if (chainResponse.success) setBlockchain(chainResponse.data);
      if (statsResponse.success) setStats(statsResponse.data);
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

  const chainSummary = useMemo(() => {
    const totalTransactions = blockchain.reduce((count, block) => count + (block.transactions?.length || 0), 0);
    const latestBlock = blockchain[blockchain.length - 1];
    return {
      totalBlocks: stats?.totalBlocks ?? blockchain.length,
      totalTransactions: stats?.totalTransactions ?? totalTransactions,
      difficulty: stats?.difficulty ?? '—',
      status: stats?.isValid ? 'Valid' : 'Monitoring',
      latestBlock
    };
  }, [blockchain, stats]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-accent-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-dark-900 text-white" ref={rootRef}>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl mb-12">
            <h1 className="blockchain-hero-title text-5xl md:text-6xl font-bold font-playfair mb-4">
              <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                Blockchain Ledger
              </span>
            </h1>
            <p className="blockchain-hero-subtitle text-xl text-white/70">
              Monitor transaction blocks, verify chain integrity, and view real-time payment records secured on the distributed ledger.
            </p>
          </div>

          {/* Action and Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleValidate}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-cyan/70 text-dark-900 font-bold hover:shadow-lg hover:shadow-accent-cyan/50 transition-all duration-300"
            >
              Validate Chain
            </button>
            {validationStatus && (
              <div
                className={`px-6 py-3 rounded-lg backdrop-blur border transition-all duration-300 ${
                  validationStatus === 'valid'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : validationStatus === 'invalid'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                }`}
              >
                {validationStatus === 'valid' && '✓ Blockchain is valid'}
                {validationStatus === 'invalid' && '✗ Chain integrity compromised'}
                {validationStatus === 'error' && '! Validation failed'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="blockchain-stats-section px-4 md:px-8 lg:px-16 pb-20">
          <div className="container mx-auto max-w-7xl">
            <p className="text-sm text-white/60 mb-8 font-semibold">CHAIN STATUS</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="blockchain-stat-card p-6 rounded-xl glass-effect border border-white/10 backdrop-blur">
                <p className="text-white/60 text-sm mb-2">Total Blocks</p>
                <p className="text-4xl font-bold text-accent-cyan">{stats.totalBlocks}</p>
              </div>
              <div className="blockchain-stat-card p-6 rounded-xl glass-effect border border-white/10 backdrop-blur">
                <p className="text-white/60 text-sm mb-2">Transactions</p>
                <p className="text-4xl font-bold text-accent-cyan">{stats.totalTransactions}</p>
              </div>
              <div className="blockchain-stat-card p-6 rounded-xl glass-effect border border-white/10 backdrop-blur">
                <p className="text-white/60 text-sm mb-2">Difficulty</p>
                <p className="text-4xl font-bold text-accent-cyan">{stats.difficulty}</p>
              </div>
              <div className="blockchain-stat-card p-6 rounded-xl glass-effect border border-white/10 backdrop-blur">
                <p className="text-white/60 text-sm mb-2">Chain Status</p>
                <p className={`text-4xl font-bold ${stats.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.isValid ? 'Valid' : 'Invalid'}
                </p>
              </div>
            </div>
            {chainSummary.latestBlock && (
              <p className="text-white/50 text-sm mt-6">
                Latest block: {new Date(chainSummary.latestBlock.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Blocks Section */}
      <section className="blockchain-blocks-section px-4 md:px-8 lg:px-16 pb-20">
        <div className="container mx-auto max-w-7xl">
          <p className="text-sm text-white/60 mb-12 font-semibold">TRANSACTION BLOCKS ({blockchain.length})</p>
          <div className="space-y-6">
            {blockchain.map((block) => (
              <div key={block.index} className="blockchain-block-card p-0 rounded-2xl glass-effect backdrop-blur hover:border-accent-cyan/50 transition-all duration-300 overflow-hidden">
                {/* Block Header with Visual */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Visual Block Representation */}
                  <div className="bg-gradient-to-br from-accent-cyan/20 to-gold-500/20 p-8 flex flex-col items-center justify-center lg:border-r lg:border-white/10">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-gold-500 mb-4">
                      #{block.index}
                    </div>
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-accent-cyan/30 to-accent-purple/30 border-2 border-white/20 flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1h3a1 1 0 100-2h-1V3a2 2 0 00-2-2H6a2 2 0 00-2 2v2H4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <time className="text-white/70 text-sm text-center">{new Date(block.timestamp).toLocaleString()}</time>
                  </div>

                  {/* Block Info */}
                  <div className="p-8 border-r border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-6">Block Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Block Hash</p>
                        <code className="text-accent-cyan text-xs font-mono break-all bg-dark-800/50 p-3 rounded-lg block">{block.hash.substring(0, 32)}...</code>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Previous Hash</p>
                        <code className="text-accent-purple text-xs font-mono break-all bg-dark-800/50 p-3 rounded-lg block">{block.previousHash.substring(0, 32)}...</code>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider">Nonce</p>
                          <p className="text-white font-bold text-lg">{block.nonce}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider">Transactions</p>
                          <p className="text-white font-bold text-lg">{block.transactions.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Summary */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Transactions</h3>
                    {block.transactions.length > 0 ? (
                      <div className="space-y-3">
                        {block.transactions.slice(0, 3).map((tx, idx) => (
                          <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-accent-cyan/50 transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-white/60 text-xs uppercase">Booking</p>
                                <p className="text-white font-mono text-sm">{tx.bookingId}</p>
                              </div>
                              <span className={`px-3 py-1 rounded text-xs font-bold ${
                                tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {tx.status}
                              </span>
                            </div>
                            <p className="text-gold-400 text-lg font-bold">Rs {tx.amount}</p>
                          </div>
                        ))}
                        {block.transactions.length > 3 && (
                          <p className="text-white/50 text-sm text-center pt-2">+ {block.transactions.length - 3} more transactions</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-white/50">No transactions</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {blockchain.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent-cyan/10 border-2 border-accent-cyan/30 mb-6">
                  <svg className="w-12 h-12 text-accent-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl text-white/60 mb-2">No blocks in chain yet</p>
                <p className="text-white/50">Transaction blocks will appear as payments are processed.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlockchainViewer;