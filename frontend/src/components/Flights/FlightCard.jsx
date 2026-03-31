/**
 * Flight Card Component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../Booking/BookingForm';

const FlightCard = ({ flight, isRecommended, score }) => {
  const [showBooking, setShowBooking] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowBooking(true);
  };

  return (
    <>
      <div className={`flight-card ${isRecommended ? 'recommended' : ''}`}>
        {isRecommended && (
          <div className="recommendation-badge">
            ⭐ Recommended (Score: {score?.toFixed(0)})
          </div>
        )}
        <div className="flight-header">
          <h4>{flight.airline}</h4>
          <span className="flight-number">{flight.flightNumber}</span>
        </div>
        <div className="flight-route">
          <div className="location">
            <strong>{flight.origin.airportCode}</strong>
            <span>{flight.origin.city}</span>
            <p>{formatTime(flight.departureTime)}</p>
            <small>{formatDate(flight.departureTime)}</small>
          </div>
          <div className="flight-duration">
            <span>✈️</span>
            <p>{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</p>
          </div>
          <div className="location">
            <strong>{flight.destination.airportCode}</strong>
            <span>{flight.destination.city}</span>
            <p>{formatTime(flight.arrivalTime)}</p>
            <small>{formatDate(flight.arrivalTime)}</small>
          </div>
        </div>
        <div className="flight-details">
          <div className="price-section">
            <div className="price-item">
              <span>Economy</span>
              <strong>₹{flight.price.economy}</strong>
              <small>{flight.availableSeats.economy} seats</small>
            </div>
            <div className="price-item">
              <span>Business</span>
              <strong>₹{flight.price.business}</strong>
              <small>{flight.availableSeats.business} seats</small>
            </div>
          </div>
        </div>
        <div className="flight-footer">
          <span className={`status ${flight.status.toLowerCase()}`}>{flight.status}</span>
          <button onClick={handleBookClick} className="btn-book">
            Book Now
          </button>
        </div>
      </div>

      {showBooking && (
        <BookingForm
          flight={flight}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
};

export default FlightCard;
