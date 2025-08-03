import * as bookcarsTypes from "../types/bookcars-types"
import axiosInstance from './axiosInstance'
import { publicApi } from '../api/client'
import { transformLocationResponse, transformPaginatedResponse } from '../utils/apiTransformers'
import * as UserService from './UserService'

/**
 * Get locations.
 *
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @returns {Promise<bookcarsTypes.Result<bookcarsTypes.Location>>}
 */
export const getLocations = (keyword: string, page: number, size: number): Promise<bookcarsTypes.Result<bookcarsTypes.Location>> => {
  try {
    const params = {
      search: keyword,
      page: page + 1,
      limit: size,
    };

    return publicApi
      .get('/public/locations/search', { params })
      .then((res) => transformPaginatedResponse(res.data, transformLocationResponse))
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .get(`/api/locations/${page}/${size}/${UserService.getLanguage()}/?s=${encodeURIComponent(keyword)}`)
          .then((res) => res.data);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .get(`/api/locations/${page}/${size}/${UserService.getLanguage()}/?s=${encodeURIComponent(keyword)}`)
      .then((res) => res.data);
  }
}

/**
 * Get a Location by ID.
 *
 * @param {string} id
 * @returns {Promise<bookcarsTypes.Location>}
 */
export const getLocation = (id: string): Promise<bookcarsTypes.Location> => {
  try {
    return publicApi
      .get(`/public/locations/${encodeURIComponent(id)}`)
      .then((res) => transformLocationResponse(res.data))
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .get(`/api/location/${encodeURIComponent(id)}/${UserService.getLanguage()}`)
          .then((res) => res.data);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .get(`/api/location/${encodeURIComponent(id)}/${UserService.getLanguage()}`)
      .then((res) => res.data);
  }
}

/**
 * Get Location ID by name (en).
 *
 * @param {string} name
 * @param {string} language
 * @returns {Promise<{ status: number, data: string }>}
 */
export const getLocationId = (name: string, language: string): Promise<{ status: number, data: string }> => {
  try {
    const params = { name, language: language || 'en' };
    
    return publicApi
      .get('/public/locations/by-name', { params })
      .then((res) => ({ status: res.status, data: res.data.id || res.data }))
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .get(`/api/location-id/${encodeURIComponent(name)}/${language}`)
          .then((res) => ({ status: res.status, data: res.data }));
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .get(`/api/location-id/${encodeURIComponent(name)}/${language}`)
      .then((res) => ({ status: res.status, data: res.data }));
  }
}
