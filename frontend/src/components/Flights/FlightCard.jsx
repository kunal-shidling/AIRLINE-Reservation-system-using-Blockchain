import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../Booking/BookingForm';

const FlightCard = ({ flight, isRecommended, score }) => {
  const [showBooking, setShowBooking] = useState(false);
  const { isAuthenticated } = useAuth();

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US');

  const handleBookClick = () => {
    setShowBooking(true);
  };

  return (
    <>
      <article className={`glass-effect rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg group ${
        isRecommended
          ? 'border-gold-500 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40'
          : 'border-white/10 hover:border-gold-500/50 hover:shadow-gold-500/20'
      }`}>
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-gold-500/20 to-accent-cyan/20 border border-gold-500/50">
            <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-gold-400">
              Recommended ({score?.toFixed(0)})
            </span>
          </div>
        )}

        {/* Header - Airline & Flight Number */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white">{flight.airline}</h3>
            <p className="text-gold-400 text-sm font-semibold">{flight.flightNumber}</p>
          </div>
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            String(flight.status || '').toLowerCase() === 'available'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : String(flight.status || '').toLowerCase() === 'booked'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}>
            {flight.status}
          </span>
        </div>

        {/* Route Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Departure */}
          <div className="flex flex-col">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">From</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{flight.origin.airportCode}</p>
              <p className="text-white/70 text-sm">{flight.origin.city}</p>
              <p className="text-gold-400 font-semibold text-sm">{formatTime(flight.departureTime)}</p>
              <p className="text-white/50 text-xs">{formatDate(flight.departureTime)}</p>
            </div>
          </div>

          {/* Flight Duration */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-2"></div>
            <div className="text-center">
              <p className="text-white/60 text-xs uppercase mb-1">Duration</p>
              <p className="text-white font-bold">{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</p>
            </div>
            <div className="relative w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent mt-2"></div>
          </div>

          {/* Arrival */}
          <div className="flex flex-col items-end">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">To</p>
            <div className="space-y-1 text-right">
              <p className="text-2xl font-bold text-white">{flight.destination.airportCode}</p>
              <p className="text-white/70 text-sm">{flight.destination.city}</p>
              <p className="text-gold-400 font-semibold text-sm">{formatTime(flight.arrivalTime)}</p>
              <p className="text-white/50 text-xs">{formatDate(flight.arrivalTime)}</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
          {/* Economy */}
          <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Economy</p>
            <p className="text-2xl font-bold text-gold-400">₹{flight.price.economy}</p>
            <p className="text-white/50 text-xs mt-2">
              {flight.availableSeats.economy} seats available
            </p>
          </div>

          {/* Business */}
          <div className="p-4 rounded-xl bg-accent-cyan/5 hover:bg-accent-cyan/10 transition-all border border-accent-cyan/30">
            <p className="text-accent-cyan text-xs uppercase tracking-wider mb-2">Business</p>
            <p className="text-2xl font-bold text-accent-cyan">₹{flight.price.business}</p>
            <p className="text-white/50 text-xs mt-2">
              {flight.availableSeats.business} seats available
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleBookClick}
          className="w-full py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 hover:shadow-lg hover:shadow-gold-500/50 hover:scale-105 active:scale-95"
        >
          Book Now
        </button>
      </article>

      {showBooking && (
        <BookingForm flight={flight} onClose={() => setShowBooking(false)} />
      )}
    </>
  );
};

export default FlightCard;
