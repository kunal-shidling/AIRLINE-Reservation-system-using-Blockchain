import React, { useState, useEffect } from 'react';
import FlightCard from './FlightCard';
import flightService from '../../services/flight.service';

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  useEffect(() => {
    fetchFlights();
  }, []);

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
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Flights</h1>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="From (Origin)"
            value={searchParams.origin}
            onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
          />
          <input
            type="text"
            placeholder="To (Destination)"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
          />
          <input
            type="date"
            value={searchParams.date}
            onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
          />
          <button type="submit" className="btn-search">Search</button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading flights...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</div>
      ) : (
        <React.Fragment>
          <div className="flights-grid">
            {flights.map(flight => (
              <FlightCard key={flight._id || flight.id} flight={flight} />
            ))}
          </div>

          {flights.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
              <h3>No flights available</h3>
              <p>Please search for other dates or destinations</p>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default FlightList;
