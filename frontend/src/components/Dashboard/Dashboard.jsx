import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useBookings } from '../../context/BookingsContext';

const Dashboard = () => {
  const { user } = useAuth();
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

  const stats = useMemo(() => {
    const now = Date.now();
    let totalSpent = 0;
    let upcomingFlights = 0;

    bookings.forEach((booking) => {
      const amount = booking.totalAmount ?? booking.totalPrice ?? booking.amount ?? 0;
      totalSpent += Number(amount) || 0;

      const flight = booking.flight || booking.flightId || booking.flightDetails || {};
      const dateValue = booking.travelDate || flight.departureTime || booking.bookingDate || booking.createdAt;
      const status = (booking.status || '').toLowerCase();
      if (dateValue) {
        const travelTime = new Date(dateValue).getTime();
        if (travelTime >= now && !status.includes('cancel')) {
          upcomingFlights += 1;
        }
      }
    });

    return {
      totalBookings: bookings.length,
      upcomingFlights,
      totalSpent
    };
  }, [bookings]);

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>Welcome back, {user?.firstName}! 👋</h1>
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
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{loading ? '...' : stats.totalBookings}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{loading ? '...' : stats.upcomingFlights}</h3>
          <p>Upcoming Flights</p>
        </div>
        <div className="stat-card">
          <h3>{loading ? '...' : `₹${stats.totalSpent}`}</h3>
          <p>Total Spent</p>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <p>Account Status</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/" className="btn-primary">Search Flights</Link>
          <Link to="/bookings" className="btn-secondary">View Bookings</Link>
          <Link to="/blockchain" className="btn-secondary">View Blockchain</Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
        <h3>Your Profile</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone}</p>
        <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
      </div>
    </div>
  );
};

export default Dashboard;
