/**
 * Payment Modal Component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/booking.service';

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
  const navigate = useNavigate();

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
      const isCardPayment =
        paymentData.paymentMethod === 'CREDIT_CARD' ||
        paymentData.paymentMethod === 'DEBIT_CARD';

      const paymentPayload = {
        bookingId: booking._id,
        amount: booking.totalPrice,
        paymentMethod: paymentData.paymentMethod
      };

      if (isCardPayment) {
        paymentPayload.cardDetails = {
          cardNumber: paymentData.cardNumber.replace(/\s+/g, ''),
          cardHolderName: paymentData.cardHolderName.trim(),
          expiryMonth: parseInt(paymentData.expiryMonth, 10),
          expiryYear: parseInt(paymentData.expiryYear, 10)
        };
      }

      const response = await bookingService.processPayment(paymentPayload);

      if (response.success) {
        alert('Payment successful! Your booking is confirmed.');
        navigate('/bookings');
      } else {
        setError(response.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Payment</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="payment-summary">
          <h4>Booking Details</h4>
          <p>Booking Reference: {booking.bookingReference}</p>
          <p>Flight: {booking.flightDetails.flightNumber}</p>
          <p>Passengers: {booking.numberOfPassengers}</p>
          <h3>Total Amount: ₹{booking.totalPrice}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={paymentData.paymentMethod} onChange={handleChange}>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          {(paymentData.paymentMethod === 'CREDIT_CARD' || paymentData.paymentMethod === 'DEBIT_CARD') && (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength="16"
                />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardHolderName"
                  value={paymentData.cardHolderName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Month</label>
                  <input
                    type="number"
                    name="expiryMonth"
                    value={paymentData.expiryMonth}
                    onChange={handleChange}
                    placeholder="MM"
                    required
                    min="1"
                    max="12"
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Year</label>
                  <input
                    type="number"
                    name="expiryYear"
                    value={paymentData.expiryYear}
                    onChange={handleChange}
                    placeholder="YYYY"
                    required
                    min="2024"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                    maxLength="3"
                  />
                </div>
              </div>
            </>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Processing Payment...' : `Pay ₹${booking.totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
