import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBookings } from '../../context/BookingsContext';

gsap.registerPlugin(ScrollTrigger);

const BookingHistory = () => {
  const { bookings, loading, error, fetchBookings, refreshBookings, lastFetchedAt } = useBookings();
  const [now, setNow] = useState(Date.now());
  const rootRef = useRef(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || loading) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const heroItems = root.querySelectorAll('.booking-hero-title, .booking-hero-subtitle');
      const statCards = root.querySelectorAll('.booking-stat-card');
      const bookingCards = root.querySelectorAll('.booking-card-item');

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
              trigger: '.booking-stats-section',
              start: 'top 80%'
            }
          }
        );
      }

      if (bookingCards.length) {
        gsap.fromTo(
          bookingCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.booking-list-section',
              start: 'top 75%'
            }
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [loading, bookings.length, error]);

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

  const visibleBookings = useMemo(
    () => bookings.filter((b) => b.status !== 'PENDING' && b.status !== 'FAILED'),
    [bookings]
  );

  const summary = useMemo(() => {
    const totalValue = visibleBookings.reduce((sum, booking) => {
      const amount = Number(booking.totalAmount ?? booking.totalPrice ?? booking.amount ?? 0);
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    const blockchainBacked = visibleBookings.filter(
      (booking) => booking.blockchainTransactionId || booking.blockchainTxId
    ).length;

    const latestBooking = visibleBookings[0];
    const latestDate = latestBooking
      ? latestBooking.travelDate || latestBooking.bookingDate || latestBooking.createdAt
      : null;

    return {
      totalBookings: visibleBookings.length,
      blockchainBacked,
      totalValue,
      latestDate
    };
  }, [visibleBookings]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-dark-900 text-white" ref={rootRef}>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-semibold text-gold-500 mb-4">JOURNEY ARCHIVE</p>
            <h1 className="booking-hero-title text-5xl md:text-6xl font-bold font-playfair mb-4">
              <span className="bg-gradient-to-r from-gold-500 to-accent-cyan bg-clip-text text-transparent">
                My Bookings
              </span>
            </h1>
            <p className="booking-hero-subtitle text-xl text-white/70">
              Review all your confirmed itineraries, payment records, and blockchain-secured travel history in one place.
            </p>
          </div>

          {/* Refresh Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => refreshBookings()}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Records'}
            </button>
            <p className="text-sm text-white/60">Last updated: {lastUpdatedText}</p>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="px-4 md:px-8 lg:px-16 mb-4">
          <div className="container mx-auto max-w-7xl">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="booking-stats-section px-4 md:px-8 lg:px-16 pb-20">
        <div className="container mx-auto max-w-7xl">
          <p className="text-sm text-white/60 mb-8 font-semibold">YOUR STATISTICS</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="booking-stat-card p-6 rounded-xl glass-effect border border-white/10 backdrop-blur">
              <p className="text-white/60 text-sm mb-2">Total Trips</p>
              <p className="text-4xl font-bold text-gold-500 mb-2">{summary.totalBookings}</p>
              <p className="text-white/50 text-sm">All confirmed reservations</p>
            </div>
            <div className="booking-stat-card p-6 rounded-xl glass-effect border border-white/10 backdrop-blur">
              <p className="text-white/60 text-sm mb-2">On-Chain Records</p>
              <p className="text-4xl font-bold text-accent-cyan mb-2">{summary.blockchainBacked}</p>
              <p className="text-white/50 text-sm">Secured through blockchain</p>
            </div>
            <div className="booking-stat-card p-6 rounded-xl glass-effect border border-white/10 backdrop-blur">
              <p className="text-white/60 text-sm mb-2">Travel Value</p>
              <p className="text-2xl font-bold text-accent-purple mb-2">Rs {summary.totalValue}</p>
              <p className="text-white/50 text-sm">Total booking value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bookings List or Empty State */}
      {visibleBookings.length === 0 ? (
        <section className="px-4 md:px-8 lg:px-16 pb-20">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-20">
              <p className="text-sm font-semibold text-gold-500 mb-4">NO ITINERARIES YET</p>
              <h2 className="text-3xl font-bold font-playfair mb-4">No bookings yet</h2>
              <p className="text-white/60 mb-8">Start your journey by booking your first flight.</p>
              <Link
                to="/"
                className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="booking-list-section px-4 md:px-8 lg:px-16 pb-20">
          <div className="container mx-auto max-w-7xl">
            <p className="text-sm text-white/60 mb-12 font-semibold">BOOKING RECORDS ({visibleBookings.length})</p>
            <div className="space-y-6">
              {visibleBookings.map((booking) => {
                const bookingId = booking.bookingReference || booking.bookingId || booking._id || booking.id;
                const flight = booking.flight || booking.flightId || booking.flightDetails || {};
                const originValue = booking.origin || flight.origin;
                const destinationValue = booking.destination || flight.destination;
                const origin = originValue?.city || originValue?.airportCode || originValue;
                const destination = destinationValue?.city || destinationValue?.airportCode || destinationValue;
                const travelDate = booking.travelDate || flight.departureTime || booking.bookingDate || booking.createdAt;
                const amount = booking.totalAmount ?? booking.totalPrice ?? booking.amount;
                const txHash = booking.blockchainTransactionId || booking.blockchainTxId;
                const statusColor = booking.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400';

                return (
                  <div key={bookingId} className="booking-card-item p-8 rounded-2xl glass-effect border border-white/10 backdrop-blur hover:border-gold-500/50 transition-all duration-300">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded text-xs font-semibold mb-3 ${statusColor}`}>
                          {booking.status}
                        </span>
                        <h3 className="text-xl font-bold">Booking #{bookingId}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gold-500">Rs {amount ?? 0}</p>
                        <p className="text-sm text-white/50 mt-1">{txHash ? 'Blockchain secured' : 'Standard booking'}</p>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="my-6 py-6 border-b border-white/10">
                      <p className="text-accent-cyan font-bold text-lg mb-2">
                        {origin || 'N/A'} <span className="text-white/60">→</span> {destination || 'N/A'}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-white/60 mb-1">Flight Number</p>
                          <p className="text-white font-semibold">{booking.flightNumber || flight.flightNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 mb-1">Departure</p>
                          <p className="text-white font-semibold">{travelDate ? new Date(travelDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 mb-1">Status</p>
                          <p className="text-white font-semibold">{booking.status || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 mb-1">Amount</p>
                          <p className="text-white font-semibold">Rs {amount ?? 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Info */}
                    {txHash && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-white/70">Blockchain Tx:</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent-cyan hover:underline font-mono"
                        >
                          {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                        </a>
                        <span className="ml-auto inline-block px-3 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 font-semibold">
                          ✓ Verified
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BookingHistory;