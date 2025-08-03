import * as bookcarsTypes from "../types/bookcars-types"
import axiosInstance from './axiosInstance'
import apiClient, { publicApi } from '../api/client'
import { 
  transformCheckoutData, 
  transformBookingResponse, 
  transformPaginatedResponse,
  transformErrorResponse
} from '../utils/apiTransformers'
import * as UserService from './UserService'

/**
 * Complete the checkout process and create the Booking.
 *
 * @param {bookcarsTypes.CheckoutPayload} data
 * @returns {Promise<{ status: number, bookingId: string }>}
 */
export const checkout = (data: bookcarsTypes.CheckoutPayload): Promise<{ status: number, bookingId: string }> => {
  try {
    const transformedData = transformCheckoutData(data);
    return apiClient
      .post('/bookings', transformedData)
      .then((res) => ({ 
        status: res.status, 
        bookingId: res.data.id || res.data.bookingId 
      }))
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .post('/api/checkout', data)
          .then((res) => ({ status: res.status, bookingId: res.data.bookingId }));
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .post('/api/checkout', data)
      .then((res) => ({ status: res.status, bookingId: res.data.bookingId }));
  }
}

/**
 * Update a Booking.
 *
 * @param {bookcarsTypes.UpsertBookingPayload} data
 * @returns {Promise<number>}
 */
export const update = (data: bookcarsTypes.UpsertBookingPayload): Promise<number> =>
  axiosInstance
    .put(
      '/api/update-booking',
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Get bookings.
 *
 * @param {bookcarsTypes.GetBookingsPayload} payload
 * @param {number} page
 * @param {number} size
 * @returns {Promise<bookcarsTypes.Result<bookcarsTypes.Booking>>}
 */
export const getBookings = (payload: bookcarsTypes.GetBookingsPayload, page: number, size: number): Promise<bookcarsTypes.Result<bookcarsTypes.Booking>> => {
  try {
    const params = {
      page: page + 1, // Server uses 1-based indexing
      limit: size,
      customerId: payload.user,
      status: payload.status,
      from: payload.from,
      to: payload.to,
    };

    return apiClient
      .get('/bookings', { params })
      .then((res) => transformPaginatedResponse(res.data, transformBookingResponse))
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .post(`/api/bookings/${page}/${size}/${UserService.getLanguage()}`, payload, { withCredentials: true })
          .then((res) => res.data);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .post(`/api/bookings/${page}/${size}/${UserService.getLanguage()}`, payload, { withCredentials: true })
      .then((res) => res.data);
  }
}

/**
 * Get a Booking by ID.
 *
 * @param {string} id
 * @returns {Promise<bookcarsTypes.Booking>}
 */
export const getBooking = (id: string): Promise<bookcarsTypes.Booking> => {
  try {
    return apiClient
      .get(`/bookings/${encodeURIComponent(id)}`)
      .then((res) => transformBookingResponse(res.data))
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .get(`/api/booking/${encodeURIComponent(id)}/${UserService.getLanguage()}`, { withCredentials: true })
          .then((res) => res.data);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .get(`/api/booking/${encodeURIComponent(id)}/${UserService.getLanguage()}`, { withCredentials: true })
      .then((res) => res.data);
  }
}

/**
 * Cancel a Booking.
 *
 * @param {string} id
 * @returns {Promise<number>}
 */
export const cancel = (id: string): Promise<number> => {
  try {
    return apiClient
      .patch(`/bookings/${encodeURIComponent(id)}/cancel`)
      .then((res) => res.status)
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .post(`/api/cancel-booking/${encodeURIComponent(id)}`, null, { withCredentials: true })
          .then((res) => res.status);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .post(`/api/cancel-booking/${encodeURIComponent(id)}`, null, { withCredentials: true })
      .then((res) => res.status);
  }
}

/**
 * Delete temporary Booking created from checkout session.
 *
 * @param {string} bookingId
 * @param {string} sessionId
 * @returns {Promise<number>}
 */
export const deleteTempBooking = (bookingId: string, sessionId: string): Promise<number> =>
  axiosInstance
    .delete(
      `/api/delete-temp-booking/${bookingId}/${sessionId}`,
    ).then((res) => res.status)

/**
 * Check availability for a booking.
 *
 * @param {any} availabilityData
 * @returns {Promise<{ available: boolean, message?: string }>}
 */
export const getAvailability = (availabilityData: any): Promise<{ available: boolean, message?: string }> => {
  try {
    return publicApi
      .post('/public/bookings/availability', availabilityData)
      .then((res) => res.data)
      .catch((error) => {
        // If public API fails, assume available for now
        console.warn('Availability check failed, assuming available:', error);
        return { available: true };
      });
  } catch (error) {
    // Assume available if service fails
    return Promise.resolve({ available: true });
  }
}

/**
 * Get price quote for a booking.
 *
 * @param {any} quoteData
 * @returns {Promise<{ totalAmount: number, breakdown?: any }>}
 */
export const getQuote = (quoteData: any): Promise<{ totalAmount: number, breakdown?: any }> => {
  try {
    return publicApi
      .post('/public/bookings/quote', quoteData)
      .then((res) => res.data)
      .catch((error) => {
        // Fallback to basic calculation or return error
        console.warn('Quote calculation failed:', error);
        throw error;
      });
  } catch (error) {
    throw error;
  }
}
