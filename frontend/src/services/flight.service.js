/**
 * Flight Service
 * Handles flight search and retrieval
 */

import api from './api';

const flightService = {
  /**
   * Search flights
   */
  async searchFlights(searchParams) {
    const params = {
      ...searchParams,
      departureDate: searchParams.date // map frontend date to backend departureDate
    };
    const response = await api.get('/flights/search', { params });
    return response.data;
  },

  /**
   * Get all flights
   */
  async getAllFlights() {
    const response = await api.get('/flights');
    return response.data;
  },

  /**
   * Get flight by ID
   */
  async getFlightById(id) {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },

  /**
   * Get AI recommendations
   */
  async getRecommendations(userPreferences, flights) {
    const response = await api.post('/ai/recommendations', {
      userPreferences,
      flights
    });
    return response.data;
  },

  /**
   * Get popular destinations
   */
  async getPopularDestinations(origin = null) {
    const params = origin ? { origin } : {};
    const response = await api.get('/ai/popular-destinations', { params });
    return response.data;
  }
};

export default flightService;
