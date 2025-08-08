import * as bookcarsTypes from "../types/bookcars-types"
import axiosInstance from './axiosInstance'
import apiClient from '../api/client'

/**
 * Create Checkout Session with new booking integration.
 *
 * @param {bookcarsTypes.CreatePaymentPayload} payload
 * @returns {Promise<bookcarsTypes.PaymentResult>}
 */
export const createCheckoutSession = async (payload: bookcarsTypes.CreatePaymentPayload): Promise<bookcarsTypes.PaymentResult> => {
  try {
    // Create booking first if bookingData is provided, otherwise use existing bookingId
    let bookingId = payload.bookingId;

    if (payload.bookingData && !bookingId) {
      // Import BookingService to create booking first
      const BookingService = await import('./BookingService');
      const bookingResponse = await BookingService.checkout(payload.bookingData);
      bookingId = bookingResponse.bookingId;
    }

    if (!bookingId) {
      throw new Error('Booking ID is required for payment processing');
    }

    // Create checkout session with new API
    const response = await apiClient.post('/payments/stripe/checkout-session', {
      bookingId: bookingId,
      amount: payload.amount,
      currency: payload.currency || 'USD',
      successUrl: payload.successUrl,
      cancelUrl: payload.cancelUrl,
    });

    // Return sessionId and sessionUrl for frontend redirection
    return {
      sessionId: response.data.sessionId,
      sessionUrl: response.data.sessionUrl,
      paymentIntentId: response.data.sessionId, // For compatibility
    };
  } catch (error) {
    console.error('New API checkout session creation failed:', error);
    
    // Fallback to legacy API
    try {
      const legacyResponse = await axiosInstance.post('/api/create-checkout-session', payload);
      return legacyResponse.data;
    } catch (legacyError) {
      console.error('Legacy API also failed:', legacyError);
      throw new Error(`Payment processing failed: ${error.message || error}`);
    }
  }
}

/**
 * Check Checkout Session.
 *
 * @param {string} sessionId
 * @returns {Promise<{ status: number; payment_status: string }>}
 */
export const checkCheckoutSession = async (sessionId: string): Promise<{ status: number; payment_status: string }> => {
  try {
    // Use new API first
    const response = await apiClient.get(`/payments/stripe/session/${sessionId}/status`);
    return {
      status: response.status,
      payment_status: response.data.payment_status
    };
  } catch (error) {
    console.error('New API session status check failed:', error);
    
    // Fallback to legacy API
    try {
      const legacyResponse = await axiosInstance.post(`/api/check-checkout-session/${sessionId}`, null);
      return {
        status: legacyResponse.status,
        payment_status: legacyResponse.status === 200 ? 'paid' : 'pending'
      };
    } catch (legacyError) {
      console.error('Legacy API session check also failed:', legacyError);
      throw new Error(`Session status check failed: ${error.message || error}`);
    }
  }
}

/**
 * Create Payment Intent.
 *
 * @param {bookcarsTypes.CreatePaymentPayload} payload
 * @returns {Promise<bookcarsTypes.PaymentResult>}
 */
export const createPaymentIntent = async (payload: bookcarsTypes.CreatePaymentPayload): Promise<bookcarsTypes.PaymentResult> => {
  try {
    // Create booking first if bookingData is provided, otherwise use existing bookingId
    let bookingId = payload.bookingId;

    if (payload.bookingData && !bookingId) {
      // Import BookingService to create booking first
      const BookingService = await import('./BookingService');
      const bookingResponse = await BookingService.checkout(payload.bookingData);
      bookingId = bookingResponse.bookingId;
    }

    if (!bookingId) {
      throw new Error('Booking ID is required for payment processing');
    }

    // Create payment intent with new API
    const response = await apiClient.post('/payments/stripe/payment-intent', {
      bookingId: bookingId,
      amount: payload.amount,
      currency: payload.currency || 'USD',
    });

    // Return client_secret and payment_intent_id for frontend processing
    return {
      paymentIntentId: response.data.payment_intent_id,
      clientSecret: response.data.client_secret,
    };
  } catch (error) {
    console.error('New API payment intent creation failed:', error);
    
    // Fallback to legacy API
    try {
      const legacyResponse = await axiosInstance.post('/api/create-payment-intent', payload);
      return legacyResponse.data;
    } catch (legacyError) {
      console.error('Legacy API also failed:', legacyError);
      throw new Error(`Payment intent creation failed: ${error.message || error}`);
    }
  }
}
