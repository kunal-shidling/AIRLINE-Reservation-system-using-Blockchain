/**
 * Booking Form Component
 */

import React, { useState } from 'react';
import bookingService from '../../services/booking.service';
import PaymentModal from '../Payment/PaymentModal';

const BookingForm = ({ flight, onClose }) => {
  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '', age: '', gender: 'MALE' }
  ]);
  const [seatClass, setSeatClass] = useState('economy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleAddPassenger = () => {
    setPassengers([...passengers, { firstName: '', lastName: '', age: '', gender: 'MALE' }]);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedPassengers = passengers.map((passenger) => ({
        ...passenger,
        age: Number(passenger.age),
        gender: (passenger.gender || '').toUpperCase()
      }));

      const bookingData = {
        flightId: flight._id,
        passengers: normalizedPassengers,
        seatClass
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        setBooking(response.data);
        setShowPayment(true);
      } else {
        setError(response.message || 'Booking failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = flight.price[seatClass] * passengers.length;

  if (showPayment && booking) {
    return <PaymentModal booking={booking} onClose={onClose} />;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Book Flight - {flight.flightNumber}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Seat Class</label>
            <select value={seatClass} onChange={(e) => setSeatClass(e.target.value)}>
              <option value="economy">Economy - ₹{flight.price.economy}</option>
              <option value="business">Business - ₹{flight.price.business}</option>
              <option value="firstClass">First Class - ₹{flight.price.firstClass}</option>
            </select>
          </div>

          <h4>Passengers</h4>
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-form">
              <h5>Passenger {index + 1}</h5>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Age"
                  value={passenger.age}
                  onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  required
                  min="1"
                />
                <select
                  value={passenger.gender}
                  onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          ))}

          <button type="button" onClick={handleAddPassenger} className="btn-secondary">
            + Add Passenger
          </button>

          <div className="booking-summary">
            <h4>Summary</h4>
            <p>Flight: {flight.airline} {flight.flightNumber}</p>
            <p>Passengers: {passengers.length}</p>
            <p>Seat Class: {seatClass}</p>
            <p className="total-price">Total: ₹{totalPrice}</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
