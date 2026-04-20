/**
 * Booking Form Component
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import bookingService from '../../services/booking.service';
import PaymentModal from '../Payment/PaymentModal';
import { SeatSelectionScene } from '../3D/Scenes/SeatSelectionScene';

const BookingForm = ({ flight, onClose }) => {
  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '', age: '', gender: 'MALE' }
  ]);
  const [seatClass, setSeatClass] = useState('economy');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
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

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
    setShowSeatSelection(false);
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
  const renderInPortal = (content) => (typeof document !== 'undefined' ? createPortal(content, document.body) : content);

  if (showPayment && booking) {
    return renderInPortal(<PaymentModal booking={booking} onClose={onClose} />);
  }

  if (showSeatSelection) {
    return renderInPortal(
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 animate-popup-backdrop" onClick={onClose}>
        <div className="glass-effect rounded-3xl w-[99vw] max-w-[1900px] max-h-[95vh] overflow-auto animate-popup-card" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 flex items-center justify-between p-8 border-b border-white/10 bg-dark-900/60 backdrop-blur">
            <h3 className="text-3xl font-bold font-playfair text-white">Select Your Seats - <span className="gradient-text">{flight.flightNumber}</span></h3>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-8">
            <SeatSelectionScene
              onSeatsSelected={handleSeatsSelected}
              selectedSeats={selectedSeats}
            />
            <button
              onClick={() => setShowSeatSelection(false)}
              className="w-full mt-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-gold-500/50 transition-all"
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return renderInPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 animate-popup-backdrop" onClick={onClose}>
      <div className="glass-effect rounded-3xl w-[99vw] max-w-[1900px] max-h-[95vh] overflow-y-auto animate-popup-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-8 border-b border-white/10 bg-dark-900/60 backdrop-blur">
          <h2 className="text-3xl font-bold font-playfair">
            Book Flight <span className="gradient-text">{flight.flightNumber}</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Flight Banner Image */}
        <div className="w-full h-96 md:h-[420px] lg:h-[480px] overflow-hidden border-b border-white/10 bg-gradient-to-br from-gold-500/10 to-accent-cyan/10">
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <svg className="absolute w-full h-full text-white/20" viewBox="0 0 1600 480" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#D4AF37', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: '#00D9FF', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>

              {/* Sky background */}
              <rect width="1600" height="480" fill="url(#flightGradient)" />

              {/* Clouds */}
              <ellipse cx="250" cy="100" rx="100" ry="50" fill="white" opacity="0.15" />
              <ellipse cx="1350" cy="120" rx="120" ry="60" fill="white" opacity="0.1" />

              {/* Sun */}
              <circle cx="1350" cy="100" r="60" fill="#D4AF37" opacity="0.2" />

              {/* Airplane */}
              <g transform="translate(800, 240)">
                {/* Fuselage */}
                <rect x="-100" y="-20" width="200" height="40" rx="20" fill="currentColor" opacity="0.6" />

                {/* Wings */}
                <rect x="-250" y="-10" width="500" height="20" fill="currentColor" opacity="0.5" />

                {/* Tail */}
                <polygon points="-90,-20 -90,20 -130,0" fill="currentColor" opacity="0.6" />

                {/* Cockpit */}
                <circle cx="80" cy="0" r="15" fill="#D4AF37" opacity="0.8" />

                {/* Windows */}
                <circle cx="35" cy="-10" r="8" fill="#00D9FF" opacity="0.6" />
                <circle cx="10" cy="-10" r="8" fill="#00D9FF" opacity="0.6" />
                <circle cx="-15" cy="-10" r="8" fill="#00D9FF" opacity="0.6" />

                {/* Landing Gear */}
                <line x1="-40" y1="20" x2="-40" y2="70" stroke="currentColor" opacity="0.5" strokeWidth="5" />
                <line x1="25" y1="20" x2="25" y2="70" stroke="currentColor" opacity="0.5" strokeWidth="5" />
              </g>

              {/* Flight path */}
              <path d="M 100 300 Q 800 240 1500 300" stroke="white" strokeDasharray="15,8" opacity="0.2" fill="none" strokeWidth="4" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold font-playfair mb-6">
                <span className="gradient-text">{flight.airline}</span>
              </h3>
              <div className="flex items-center gap-12 text-3xl md:text-4xl lg:text-5xl font-bold">
                <div className="text-center">
                  <p className="text-gold-400 mb-3">{flight.origin.airportCode}</p>
                  <p className="text-white/70 text-lg md:text-xl">{flight.origin.city}</p>
                </div>
                <svg className="w-16 h-16 md:w-20 md:h-20 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="text-center">
                  <p className="text-accent-cyan mb-3">{flight.destination.airportCode}</p>
                  <p className="text-white/70 text-lg md:text-xl">{flight.destination.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seat Class Selection */}
            <div>
              <label className="block text-lg font-bold text-white mb-4">Seat Class</label>
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-6">
                {[
                  { value: 'economy', label: 'Economy', price: flight.price.economy },
                  { value: 'business', label: 'Business', price: flight.price.business },
                  { value: 'firstClass', label: 'First Class', price: flight.price.firstClass }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSeatClass(option.value)}
                    className={`p-6 rounded-xl transition-all border-2 ${
                      seatClass === option.value
                        ? 'glass-effect border-gold-500 shadow-lg shadow-gold-500/30 bg-gold-500/10'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <p className="font-bold text-white text-xl">{option.label}</p>
                    <p className={`text-base mt-3 ${seatClass === option.value ? 'text-gold-400' : 'text-white/60'}`}>
                      ₹{option.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Passengers Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Passengers</h3>
                <span className="px-4 py-2 rounded-full bg-gold-500/20 text-gold-400 text-sm font-bold">
                  {passengers.length} passenger{passengers.length !== 1 ? 's' : ''}
                </span>
              </div>

              {passengers.map((passenger, index) => (
                <div key={index} className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-5 hover:border-white/20 transition-all">
                  <h5 className="font-bold text-white text-xl">Passenger {index + 1}</h5>

                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={passenger.firstName}
                      onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                      required
                      className="px-5 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-base"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={passenger.lastName}
                      onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                      required
                      className="px-5 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-base"
                    />
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                    <input
                      type="number"
                      placeholder="Age"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      required
                      min="1"
                      className="px-5 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-base"
                    />
                    <select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="px-5 py-3 rounded-lg bg-dark-800 border border-dark-700 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-base"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPassenger}
                className="w-full py-3 rounded-lg border-2 border-gold-500/50 text-gold-400 hover:bg-gold-500/10 transition-all font-bold text-base"
              >
                + Add Another Passenger
              </button>
            </div>

            {/* Seat Selection Button */}
            <button
              type="button"
              onClick={() => setShowSeatSelection(true)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedSeats.length > 0
                  ? 'bg-accent-cyan/20 border-2 border-accent-cyan/50 text-accent-cyan'
                  : 'bg-white/5 border-2 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {selectedSeats.length > 0
                ? `✓ Seats Selected: ${selectedSeats.join(', ')}`
                : '🎫 Select Your Seats'}
            </button>

            {/* Summary Box */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gold-500/20 to-accent-cyan/20 border-2 border-gold-500/40 space-y-6">
              <h4 className="font-bold text-white text-2xl flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Booking Summary
              </h4>
              <div className="space-y-4 text-lg text-white/80">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Flight:</span>
                  <span className="font-bold text-white text-xl">{flight.airline} {flight.flightNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Passengers:</span>
                  <span className="font-bold text-white text-xl">{passengers.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Seat Class:</span>
                  <span className="font-bold text-white text-xl capitalize">{seatClass}</span>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Seats:</span>
                    <span className="font-bold text-accent-cyan text-xl">{selectedSeats.join(', ')}</span>
                  </div>
                )}

                <div className="border-t-2 border-white/20 pt-4 flex items-center justify-between">
                  <span className="font-bold text-white text-2xl">Total Amount:</span>
                  <span className="text-4xl font-bold gradient-text">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold text-lg hover:shadow-lg hover:shadow-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Proceed to Payment 💳'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
