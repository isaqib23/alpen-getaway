import * as bookcarsTypes from "../types/bookcars-types"
import axiosInstance from './axiosInstance'
import { publicApi, authUtils } from '../api/client'
import { 
  transformGetCarsPayload, 
  transformCarResponse, 
  transformPaginatedResponse,
  createQueryParams
} from '../utils/apiTransformers'
import * as UserService from './UserService'

/**
 * Get cars.
 *
 * @param {bookcarsTypes.GetCarsPayload} data
 * @param {number} page
 * @param {number} size
 * @returns {Promise<bookcarsTypes.Result<bookcarsTypes.Car>>}
 */
export const getCars = (data: bookcarsTypes.GetCarsPayload, page: number, size: number): Promise<bookcarsTypes.Result<bookcarsTypes.Car>> => {
  try {
    // Simplified parameters that match the actual API
    const params = {
      page: page + 1, // Server uses 1-based indexing
      limit: size,
      // For now, just get featured cars without complex filtering
    };

    return publicApi
      .get('/public/content/cars?' + createQueryParams(params))
      .then((res) => transformPaginatedResponse(res.data, transformCarResponse))
      .catch((error) => {
        console.error('Cars API error:', error);
        // Fallback to legacy API
        return axiosInstance
          .post(`/api/frontend-cars/${page}/${size}`, data)
          .then((res) => res.data);
      });
  } catch (error) {
    console.error('Cars service error:', error);
    // Direct fallback to legacy API
    return axiosInstance
      .post(`/api/frontend-cars/${page}/${size}`, data)
      .then((res) => res.data);
  }
}

/**
 * Get a Car by ID.
 *
 * @param {string} id
 * @returns {Promise<bookcarsTypes.Car>}
 */
export const getCar = (id: string): Promise<bookcarsTypes.Car> => {
  try {
    return publicApi
      .get(`/public/content/cars?limit=100`)
      .then((res) => {
        const cars = res.data?.data || [];
        const car = cars.find((c: any) => c.id === id);
        if (car) {
          return transformCarResponse(car);
        }
        throw new Error('Car not found');
      })
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .get(`/api/car/${encodeURIComponent(id)}/${UserService.getLanguage()}`)
          .then((res) => res.data);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .get(`/api/car/${encodeURIComponent(id)}/${UserService.getLanguage()}`)
      .then((res) => res.data);
  }
}

/**
 * Get cars by agency and location.
 *
 * @param {string} keyword
 * @param {bookcarsTypes.GetBookingCarsPayload} data
 * @param {number} page
 * @param {number} size
 * @returns {Promise<bookcarsTypes.Car[]>}
 */
export const getBookingCars = (keyword: string, data: bookcarsTypes.GetBookingCarsPayload, page: number, size: number): Promise<bookcarsTypes.Car[]> =>
  axiosInstance
    .post(
      `/api/booking-cars/${page}/${size}/?s=${encodeURIComponent(keyword)}`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.data)
