import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingsContext';

const BookingHistory = () => {
  const { bookings, loading, error, fetchBookings, refreshBookings, lastFetchedAt } = useBookings();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const lastUpdatedText = useMemo(() => {
    if (!lastFetchedAt) {
      return 'Not updated yet';
    }
    const diffMs = now - lastFetchedAt;
    if (diffMs < 30000) {
      return 'Just now';
    }
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }, [lastFetchedAt, now]);

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>My Bookings</h1>
        <button
          className="btn-secondary"
          onClick={() => refreshBookings()}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
        <span style={{ color: '#666' }}>
          Last updated: {lastUpdatedText}
        </span>
      </div>

      {error && (
        <div className="error-message" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '12px', 
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <h2>No bookings yet</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            Start your journey by booking your first flight!
          </p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '1.5rem' }}
            onClick={() => window.location.href = '/'}
          >
            Search Flights
          </button>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => {
            const bookingId = booking.bookingReference || booking.bookingId || booking._id || booking.id;
            const flight = booking.flight || booking.flightId || booking.flightDetails || {};
            const originValue = booking.origin || flight.origin;
            const destinationValue = booking.destination || flight.destination;
            const origin = originValue?.city || originValue?.airportCode || originValue;
            const destination = destinationValue?.city || destinationValue?.airportCode || destinationValue;
            const travelDate = booking.travelDate || flight.departureTime || booking.bookingDate || booking.createdAt;
            const amount = booking.totalAmount ?? booking.totalPrice ?? booking.amount;

            return (
              <div key={bookingId} className="booking-card">
                <div className="booking-header">
                  <h3>Booking #{bookingId}</h3>
                  {booking.status && (
                    <span className={`status ${booking.status}`}>{booking.status}</span>
                  )}
                </div>
                <div>
                  <p><strong>Flight:</strong> {booking.flightNumber || flight.flightNumber || 'N/A'}</p>
                  <p><strong>Route:</strong> {origin || 'N/A'} → {destination || 'N/A'}</p>
                  <p><strong>Date:</strong> {travelDate ? new Date(travelDate).toLocaleString() : 'N/A'}</p>
                  <p><strong>Amount:</strong> ₹{amount ?? 0}</p>
                </div>
                <div className="blockchain-badge">
                  ⛓️ Verified on Blockchain
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
