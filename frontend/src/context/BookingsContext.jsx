import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import bookingService from '../services/booking.service';
import { useAuth } from './AuthContext';

const BookingsContext = createContext(null);
const BOOKINGS_TTL_MS = 60 * 1000;

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingsProvider');
  }
  return context;
};

export const BookingsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetchedAt, setLastFetchedAt] = useState(0);
  const bookingsRef = useRef([]);
  const lastFetchedAtRef = useRef(0);

  const clearCache = useCallback(() => {
    setBookings([]);
    bookingsRef.current = [];
    setError('');
    setLastFetchedAt(0);
    lastFetchedAtRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      clearCache();
    }
  }, [isAuthenticated, clearCache]);

  const fetchBookings = useCallback(async ({ force = false } = {}) => {
    if (!isAuthenticated) {
      clearCache();
      return [];
    }

    const isFresh =
      bookingsRef.current.length > 0 &&
      Date.now() - lastFetchedAtRef.current < BOOKINGS_TTL_MS;
    if (!force && isFresh) {
      return bookingsRef.current;
    }

    setLoading(true);
    setError('');
    try {
      const response = await bookingService.getUserBookings();
      const payload = response?.success ? response.data : response;
      const list = Array.isArray(payload) ? payload : [];
      setBookings(list);
      bookingsRef.current = list;
      const fetchedAt = Date.now();
      setLastFetchedAt(fetchedAt);
      lastFetchedAtRef.current = fetchedAt;
      return list;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
      setBookings([]);
      bookingsRef.current = [];
      setLastFetchedAt(0);
      lastFetchedAtRef.current = 0;
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, clearCache]);

  const refreshBookings = useCallback(() => {
    return fetchBookings({ force: true });
  }, [fetchBookings]);

  const value = useMemo(() => ({
    bookings,
    loading,
    error,
    fetchBookings,
    refreshBookings,
    lastFetchedAt
  }), [bookings, loading, error, fetchBookings, refreshBookings, lastFetchedAt]);

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
};
