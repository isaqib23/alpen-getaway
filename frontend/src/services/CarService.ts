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
    const transformedFilters = transformGetCarsPayload(data);
    const params = {
      ...transformedFilters,
      page: page + 1, // Server uses 1-based indexing
      limit: size,
    };

    return publicApi
      .get('/cars?' + createQueryParams(params))
      .then((res) => transformPaginatedResponse(res.data, transformCarResponse))
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .post(`/api/frontend-cars/${page}/${size}`, data)
          .then((res) => res.data);
      });
  } catch (error) {
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
      .get(`/cars/${encodeURIComponent(id)}`)
      .then((res) => transformCarResponse(res.data))
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
