import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlightCard from './FlightCard';
import flightService from '../../services/flight.service';

gsap.registerPlugin(ScrollTrigger);

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({ origin: '', destination: '', date: '' });
  const rootRef = useRef(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const heroItems = root.querySelectorAll('.flight-hero-title, .flight-hero-subtitle');
      const searchForm = root.querySelector('.flight-search-form');
      const flightCards = root.querySelectorAll('.flight-card-wrapper');

      if (heroItems.length) {
        gsap.fromTo(
          heroItems,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.85, ease: 'power3.out' }
        );
      }

      if (searchForm) {
        gsap.fromTo(
          searchForm,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.3
          }
        );
      }

      if (flightCards.length) {
        gsap.fromTo(
          flightCards,
          { y: 40, opacity: 0, rotateX: 8 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 70%'
            }
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [flights, loading]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const data = await flightService.getAllFlights();
      if (data && data.success) {
        setFlights(data.data);
      } else if (Array.isArray(data)) {
        setFlights(data);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Failed to load flights');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await flightService.searchFlights(searchParams);
      if (data && data.success) {
        setFlights(data.data);
      } else if (Array.isArray(data)) {
        setFlights(data);
      } else {
        setFlights([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-dark-900 text-white" ref={rootRef}>
      {/* Hero Section */}
      <section className="pt-32 px-4 md:px-8 lg:px-16 pb-20 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl mb-12">
            <h1 className="flight-hero-title text-5xl md:text-6xl font-bold font-playfair mb-4">
              <span className="bg-gradient-to-r from-gold-500 to-accent-cyan bg-clip-text text-transparent">
                Find Your Flight
              </span>
            </h1>
            <p className="flight-hero-subtitle text-xl text-white/70">
              Search and book flights with real-time pricing, instant availability, and seamless payment integration.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flight-search-form p-8 rounded-2xl glass-effect border border-white/10 backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-white/70 mb-2">From</label>
                <input
                  type="text"
                  placeholder="Origin city"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-gold-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-white/70 mb-2">To</label>
                <input
                  type="text"
                  placeholder="Destination city"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-gold-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-white/70 mb-2">Date</label>
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-gold-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 md:px-8 lg:px-16 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-gold-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-white/60">Loading flights...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <p className="font-semibold">{error}</p>
              <p className="text-sm text-red-400/80 mt-2">Please try again or contact support if the issue persists.</p>
            </div>
          )}

          {/* Flights Grid */}
          {!loading && !error && (
            <>
              {flights.length > 0 ? (
                <div>
                  <p className="text-sm text-white/60 mb-6">Found {flights.length} flight{flights.length !== 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flights.map((flight) => (
                      <div key={flight._id || flight.id} className="flight-card-wrapper">
                        <FlightCard flight={flight} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xl text-white/60 mb-4">No flights available</p>
                  <p className="text-white/50">Try adjusting your search filters to find available flights.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default FlightList;