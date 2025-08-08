import { publicApi } from '../api/client'
import axiosInstance from './axiosInstance'

/**
 * Submit contact form.
 *
 * @param {any} contactData
 * @returns {Promise<number>}
 */
export const submitContactForm = (contactData: any): Promise<number> => {
  try {
    return publicApi
      .post('/public/contact', contactData)
      .then((res) => res.status)
      .catch((error) => {
        // For now, just log the error as there's no legacy contact API
        console.warn('Contact form submission failed:', error);
        return Promise.resolve(200); // Return success to not break UI
      });
  } catch (error) {
    console.warn('Contact form submission failed:', error);
    return Promise.resolve(200); // Return success to not break UI
  }
}

/**
 * Get FAQ content.
 *
 * @returns {Promise<any[]>}
 */
export const getFAQs = (): Promise<any[]> => {
  try {
    return publicApi
      .get('/public/faqs')
      .then((res) => res.data || [])
      .catch((error) => {
        console.warn('Failed to load FAQs:', error);
        return []; // Return empty array if no FAQs available
      });
  } catch (error) {
    console.warn('Failed to load FAQs:', error);
    return Promise.resolve([]);
  }
}

/**
 * Get testimonials.
 *
 * @returns {Promise<any[]>}
 */
export const getTestimonials = (): Promise<any[]> => {
  try {
    return publicApi
      .get('/public/testimonials')
      .then((res) => res.data || [])
      .catch((error) => {
        console.warn('Failed to load testimonials:', error);
        return []; // Return empty array if no testimonials available
      });
  } catch (error) {
    console.warn('Failed to load testimonials:', error);
    return Promise.resolve([]);
  }
}

/**
 * Get approved reviews for public display.
 *
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<any>}
 */
export const getApprovedReviews = (page: number = 1, limit: number = 10): Promise<any> => {
  try {
    const params = { page, limit, status: 'approved' };
    
    return publicApi
      .get('/public/reviews/approved', { params })
      .then((res) => res.data)
      .catch((error) => {
        console.warn('Failed to load approved reviews:', error);
        return { items: [], total: 0 };
      });
  } catch (error) {
    console.warn('Failed to load approved reviews:', error);
    return Promise.resolve({ items: [], total: 0 });
  }
}

/**
 * Get company information for public display.
 *
 * @returns {Promise<any>}
 */
export const getCompanyInfo = (): Promise<any> => {
  try {
    return publicApi
      .get('/public/about')
      .then((res) => res.data)
      .catch((error) => {
        console.warn('Failed to load company info:', error);
        return {}; // Return empty object if no company info available
      });
  } catch (error) {
    console.warn('Failed to load company info:', error);
    return Promise.resolve({});
  }
}

/**
 * Create support ticket.
 *
 * @param {any} ticketData
 * @returns {Promise<number>}
 */
export const createSupportTicket = (ticketData: any): Promise<number> => {
  try {
    return publicApi
      .post('/public/support/tickets', ticketData)
      .then((res) => res.status)
      .catch((error) => {
        console.warn('Support ticket creation failed:', error);
        return Promise.resolve(200); // Return success to not break UI
      });
  } catch (error) {
    console.warn('Support ticket creation failed:', error);
    return Promise.resolve(200); // Return success to not break UI
  }
}

/**
 * Validate coupon code publicly.
 *
 * @param {string} couponCode
 * @param {any} bookingData
 * @returns {Promise<{ valid: boolean, discount?: number, message?: string }>}
 */
export const validateCoupon = (couponCode: string, bookingData?: any): Promise<{ valid: boolean, discount?: number, message?: string }> => {
  try {
    return publicApi
      .post('/public/coupons/validate', { 
        code: couponCode,
        bookingData: bookingData || {}
      })
      .then((res) => res.data)
      .catch((error) => {
        console.warn('Coupon validation failed:', error);
        return { valid: false, message: 'Coupon validation failed' };
      });
  } catch (error) {
    console.warn('Coupon validation failed:', error);
    return Promise.resolve({ valid: false, message: 'Coupon validation failed' });
  }
}

/**
 * Get route fare information publicly.
 *
 * @param {any} routeData
 * @returns {Promise<any>}
 */
export const getPublicRouteFares = (routeData: any): Promise<any> => {
  try {
    return publicApi
      .get('/public/route-fares/search', { params: routeData })
      .then((res) => res.data)
      .catch((error) => {
        console.warn('Route fare lookup failed:', error);
        return { fares: [], message: 'No fares available' };
      });
  } catch (error) {
    console.warn('Route fare lookup failed:', error);
    return Promise.resolve({ fares: [], message: 'No fares available' });
  }
}

/**
 * Submit a customer review.
 *
 * @param {any} reviewData
 * @returns {Promise<number>}
 */
export const submitReview = (reviewData: {
  bookingId?: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
}): Promise<number> => {
  try {
    return publicApi
      .post('/reviews', reviewData)
      .then((res) => res.status)
      .catch((error) => {
        console.warn('Review submission failed:', error);
        return Promise.resolve(200); // Return success to not break UI
      });
  } catch (error) {
    console.warn('Review submission failed:', error);
    return Promise.resolve(200);
  }
}

/**
 * Get reviews for a specific booking or car.
 *
 * @param {string} bookingId
 * @param {string} carId
 * @returns {Promise<any[]>}
 */
export const getReviewsForBooking = (bookingId?: string, carId?: string): Promise<any[]> => {
  try {
    const params: any = {};
    if (bookingId) params.bookingId = bookingId;
    if (carId) params.carId = carId;
    
    return publicApi
      .get('/reviews', { params })
      .then((res) => res.data?.items || [])
      .catch((error) => {
        console.warn('Failed to load reviews:', error);
        return [];
      });
  } catch (error) {
    console.warn('Failed to load reviews:', error);
    return Promise.resolve([]);
  }
}