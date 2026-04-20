import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingsContext';
import { HomeScene } from '../3D/Scenes/HomeScene';

gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const { user } = useAuth();
  const { bookings, loading, error, fetchBookings, refreshBookings, lastFetchedAt } = useBookings();
  const [now, setNow] = useState(Date.now());
  const rootRef = useRef(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const topItems = root.querySelectorAll('.dashboard-header > *');
      const statItems = root.querySelectorAll('.xp-glow-stat');
      const panels = root.querySelectorAll('.dashboard-panel');

      if (topItems.length) {
        gsap.fromTo(
          topItems,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out' }
        );
      }

      if (statItems.length) {
        gsap.fromTo(
          statItems,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out' }
        );
      }

      if (panels.length) {
        gsap.fromTo(
          panels,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 75%'
            }
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [loading, bookings.length]);

  const lastUpdatedText = useMemo(() => {
    if (!lastFetchedAt) return 'Not updated yet';
    const diffMs = now - lastFetchedAt;
    if (diffMs < 30000) return 'Just now';
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }, [lastFetchedAt, now]);

  const stats = useMemo(() => {
    const currentTime = Date.now();
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
        if (travelTime >= currentTime && !status.includes('cancel')) {
          upcomingFlights += 1;
        }
      }
    });

    return { totalBookings: bookings.length, upcomingFlights, totalSpent };
  }, [bookings]);

  return (
    <div className="min-h-screen pt-20 pb-10 bg-dark-900 relative overflow-hidden" ref={rootRef}>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 space-y-10">
        {/* Header Section */}
        <div className="dashboard-header space-y-6">
          <div>
            <p className="text-gold-400 text-sm font-semibold tracking-wide uppercase mb-2">Control Deck</p>
            <h1 className="text-5xl font-bold font-playfair mb-3">
              Welcome back, <span className="gradient-text">{user?.firstName || 'Traveler'}</span>
            </h1>
            <p className="text-xl text-white/60">
              Realtime dashboard synced <span className="text-accent-cyan">{lastUpdatedText}</span>
            </p>
          </div>

          <button
            onClick={() => refreshBookings()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white/80 hover:border-gold-500 hover:text-gold-400 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Metrics
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-effect rounded-2xl p-6 border-white/10">
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Bookings</p>
            <p className="text-3xl font-bold gradient-text">{loading ? '...' : stats.totalBookings}</p>
          </div>

          <div className="glass-effect rounded-2xl p-6 border-white/10">
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Upcoming Flights</p>
            <p className="text-3xl font-bold text-accent-cyan">{loading ? '...' : stats.upcomingFlights}</p>
          </div>

          <div className="glass-effect rounded-2xl p-6 border-white/10">
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-gold-400">{loading ? '...' : `₹${stats.totalSpent}`}</p>
          </div>

          <div className="glass-effect rounded-2xl p-6 border-white/10">
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Account Status</p>
            <p className="text-3xl font-bold text-green-400">Active</p>
          </div>
        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flight Explorer */}
          <div className="dashboard-panel glass-effect rounded-2xl p-8 border-white/10 lg:row-span-2">
            <h3 className="text-2xl font-bold mb-6 text-white">Flight Explorer</h3>
            <div className="h-96 rounded-xl overflow-hidden border border-white/10">
              <HomeScene />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-panel glass-effect rounded-2xl p-8 border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-white">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/flights"
                className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-gold-500/20 to-gold-400/20 border border-gold-500/50 text-white hover:bg-gold-500/30 hover:border-gold-500 transition-all group"
              >
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-semibold">Search Flights</span>
              </Link>

              <Link
                to="/bookings"
                className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-accent-cyan/20 to-accent-cyan/20 border border-accent-cyan/50 text-white hover:bg-accent-cyan/30 hover:border-accent-cyan transition-all group"
              >
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-semibold">My Bookings</span>
              </Link>

              <Link
                to="/blockchain"
                className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-purple/20 border border-accent-purple/50 text-white hover:bg-accent-purple/30 hover:border-accent-purple transition-all group"
              >
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-semibold">Blockchain</span>
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="dashboard-panel glass-effect rounded-2xl p-8 border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-white">Your Profile</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm uppercase tracking-wider text-white/60 mb-1">Email Address</p>
                <p className="text-lg font-semibold text-gold-400 font-mono break-all">{user?.email}</p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm uppercase tracking-wider text-white/60 mb-1">Phone Number</p>
                <p className="text-lg font-semibold text-white">{user?.phone || 'Not provided'}</p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm uppercase tracking-wider text-white/60 mb-1">Member Since</p>
                <p className="text-lg font-semibold text-accent-cyan">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
