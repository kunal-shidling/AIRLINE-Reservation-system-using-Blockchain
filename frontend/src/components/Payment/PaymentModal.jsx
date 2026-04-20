/**
 * Payment Modal Component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import bookingService from '../../services/booking.service';
import { PaymentScene } from '../3D/Scenes/PaymentScene';

const PaymentModal = ({ booking, onClose }) => {
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [useBackendWallet, setUseBackendWallet] = useState(false);
  const navigate = useNavigate();

  const PLATFORM_CHARGE_PERCENT = 0.3;
  const SEPOLIA_CHAIN_ID = '11155111';

  const calculateEthAmount = (price) => {
    const totalWithCharge = price * (1 + PLATFORM_CHARGE_PERCENT);
    return (totalWithCharge / 300000).toFixed(6);
  };

  const validateNetwork = async () => {
    if (!window.ethereum) return false;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId, 16).toString() !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }]
          });
          return true;
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Test Network',
                    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://sepolia.infura.io/v3/'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                  }
                ]
              });
              return true;
            } catch (addError) {
              setError('Failed to add Sepolia network to MetaMask');
              return false;
            }
          }
          setError('Please switch to Sepolia Testnet (Chain ID: 11155111) in MetaMask');
          return false;
        }
      }
      return true;
    } catch (err) {
      setError('Network validation failed');
      return false;
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const isSepolia = await validateNetwork();
        if (!isSepolia) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);

        const balance = await provider.getBalance(accounts[0]);
        setWalletBalance(ethers.formatEther(balance));
        setError('');
      } catch (err) {
        setError('Wallet Error: ' + err.message);
      }
    } else {
      setError('MetaMask not found. Please install extension.');
    }
  };

  const handleMetaMaskPayment = async () => {
    const isSepolia = await validateNetwork();
    if (!isSepolia) throw new Error('Wrong network. Switch to Sepolia.');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const ethAmount = calculateEthAmount(booking.totalPrice);
    const platformAddress = '0x4376c9da39B4244E9367468FeD27f29393C155Ad';

    const tx = await signer.sendTransaction({
      to: platformAddress.toLowerCase(),
      value: ethers.parseEther(ethAmount)
    });

    setLoading(true);
    await tx.wait();
    setLoading(false);
    return tx.hash;
  };

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let blockchainTxId = null;
      const finalAmount = booking.totalPrice * (1 + PLATFORM_CHARGE_PERCENT);

      if (paymentData.paymentMethod === 'ETHEREUM') {
        if (!useBackendWallet) {
          blockchainTxId = await handleMetaMaskPayment();
        }
      }

      const paymentPayload = {
        bookingId: booking._id,
        amount: finalAmount,
        paymentMethod: paymentData.paymentMethod,
        blockchainTransactionId: blockchainTxId
      };

      if (paymentData.paymentMethod === 'CREDIT_CARD' || paymentData.paymentMethod === 'DEBIT_CARD') {
        paymentPayload.cardDetails = {
          cardNumber: paymentData.cardNumber.trim(),
          cardHolderName: paymentData.cardHolderName.trim(),
          expiryMonth: parseInt(paymentData.expiryMonth),
          expiryYear: parseInt(paymentData.expiryYear)
        };
      }

      const response = await bookingService.processPayment(paymentPayload);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/bookings');
        }, 3000);
      } else {
        setError(response.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Processing Error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="glass-effect rounded-2xl p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-accent-cyan mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
          <p className="text-white/70">Your flight has been booked. Redirecting to bookings...</p>
          <div className="pt-4">
            <div className="w-full bg-dark-800 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-gold-500 to-accent-cyan h-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-effect rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-dark-900/40">
          <h2 className="text-2xl font-bold font-playfair">
            Secure <span className="gradient-text">Payment</span>
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* 3D Scene */}
          <div className="h-48 rounded-xl overflow-hidden border border-white/10">
            <PaymentScene />
          </div>

          {/* Booking Summary */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-gold-500/10 to-accent-cyan/10 border border-gold-500/30 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Booking Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
              <p>Reference:</p>
              <p className="text-right font-mono text-gold-400">{booking.bookingReference}</p>

              <p>Flight:</p>
              <p className="text-right font-semibold text-white">{booking.flightDetails.flightNumber}</p>

              <p>Passengers:</p>
              <p className="text-right font-semibold text-white">{booking.numberOfPassengers}</p>

              <div className="col-span-2 border-t border-white/10 pt-2 flex items-center justify-between">
                <p className="font-semibold text-white">Amount:</p>
                <p className="text-xl font-bold gradient-text">₹{booking.totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
                  { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
                  { value: 'UPI', label: 'UPI', icon: '📱' },
                  { value: 'ETHEREUM', label: 'Crypto', icon: '⟠' }
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentData({ ...paymentData, paymentMethod: method.value })}
                    className={`p-3 rounded-lg transition-all border text-center ${
                      paymentData.paymentMethod === method.value
                        ? 'glass-effect border-gold-500 shadow-lg shadow-gold-500/30'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <p className="text-xs font-semibold text-white">{method.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Ethereum Payment Options */}
            {paymentData.paymentMethod === 'ETHEREUM' && (
              <div className="space-y-4 p-4 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUseBackendWallet(false)}
                    className={`flex-1 py-2 rounded-lg transition-all text-sm font-semibold ${
                      !useBackendWallet
                        ? 'bg-accent-cyan/30 text-accent-cyan border border-accent-cyan/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    MetaMask Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseBackendWallet(true)}
                    className={`flex-1 py-2 rounded-lg transition-all text-sm font-semibold ${
                      useBackendWallet
                        ? 'bg-accent-cyan/30 text-accent-cyan border border-accent-cyan/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    Backend Wallet
                  </button>
                </div>

                {!useBackendWallet ? (
                  <>
                    <p className="text-sm text-accent-cyan/80">
                      ⚠ Connect to <strong>Sepolia Testnet (Chain ID: 11155111)</strong>
                    </p>

                    {!walletAddress ? (
                      <button
                        type="button"
                        onClick={connectWallet}
                        className="w-full py-2 rounded-lg bg-accent-cyan/30 text-accent-cyan border border-accent-cyan/50 hover:bg-accent-cyan/50 transition-all font-semibold text-sm"
                      >
                        🔗 Connect MetaMask
                      </button>
                    ) : (
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 text-sm">
                        <p className="text-white/70">
                          <span className="font-semibold">Account:</span>{' '}
                          <span className="font-mono text-accent-cyan">{walletAddress.substring(0, 8)}...{walletAddress.substring(36)}</span>
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">Balance:</span>{' '}
                          <span className="font-mono text-accent-cyan">{parseFloat(walletBalance || 0).toFixed(4)} ETH</span>
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70">
                    <p className="font-semibold text-white mb-1">🔐 Master Mode</p>
                    <p>Secured transaction via backend wallet</p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/70">Ticket Price:</span>
                    <span className="text-white font-semibold">₹{booking.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Platform Charge (30%):</span>
                    <span className="text-gold-400 font-semibold">₹{(booking.totalPrice * 0.3).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-white font-semibold">Total (INR):</span>
                    <span className="text-accent-cyan font-bold">₹{(booking.totalPrice * 1.3).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 bg-white/5 p-2 rounded text-center">
                    <span className="text-white/70">Crypto Amount:</span>
                    <span className="text-accent-cyan font-bold font-mono">{calculateEthAmount(booking.totalPrice)} ETH</span>
                  </div>
                </div>
              </div>
            )}

            {/* Credit/Debit Card Fields */}
            {(paymentData.paymentMethod === 'CREDIT_CARD' || paymentData.paymentMethod === 'DEBIT_CARD') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    maxLength="16"
                    className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={paymentData.cardHolderName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Month</label>
                    <input
                      type="number"
                      name="expiryMonth"
                      value={paymentData.expiryMonth}
                      onChange={handleChange}
                      placeholder="MM"
                      required
                      min="1"
                      max="12"
                      className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Year</label>
                    <input
                      type="number"
                      name="expiryYear"
                      value={paymentData.expiryYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      required
                      min="2024"
                      className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      required
                      maxLength="3"
                      className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-semibold hover:shadow-lg hover:shadow-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                `Pay ₹${(booking.totalPrice * 1.3).toFixed(2)}`
              )}
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/60 pt-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>🔒 Your payment information is secure and encrypted</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
