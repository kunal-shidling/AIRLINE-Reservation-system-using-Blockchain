/**
 * Booking Service
 * Handles flight bookings and cancellations
 */

import api from './api';

const bookingService = {
  /**
   * Create new booking
   */
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  /**
   * Get user bookings
   */
  async getUserBookings() {
    const response = await api.get('/bookings');
    return response.data;
  },

  /**
   * Get booking by ID
   */
  async getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(id, reason) {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Process payment for booking
   */
  async processPayment(paymentData) {
    const response = await api.post('/payments/process', paymentData);
    return response.data;
  },

  /**
   * Get payment history
   */
  async getPaymentHistory() {
    const response = await api.get('/payments/history');
    return response.data;
  }
};

export default bookingService;
