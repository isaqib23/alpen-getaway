import * as bookcarsTypes from "../types/bookcars-types"
import axiosInstance from './axiosInstance'
import { publicApi, authUtils } from '../api/client'
import { transformUserResponse, transformPaginatedResponse, createQueryParams } from '../utils/apiTransformers'

/**
 * Get all suppliers.
 *
 * @returns {Promise<bookcarsTypes.User[]>}
 */
export const getAllSuppliers = (): Promise<bookcarsTypes.User[]> =>
  axiosInstance
    .get(
      '/api/all-suppliers',
      { withCredentials: true }
    )
    .then((res) => res.data)

/**
 * Get suppliers.
 *
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @returns {Promise<bookcarsTypes.Result<bookcarsTypes.User>>}
 */
export const getSuppliers = (keyword: string, page: number, size: number): Promise<bookcarsTypes.Result<bookcarsTypes.User>> =>
  axiosInstance
    .get(
      `/api/suppliers/${page}/${size}/?s=${encodeURIComponent(keyword)}`,
      { withCredentials: true }
    )
    .then((res) => res.data)

/**
* Get frontend suppliers.
*
* @param {bookcarsTypes.GetCarsPayload} data
* @returns {Promise<bookcarsTypes.User[]>}
*/
export const getFrontendSuppliers = (data: bookcarsTypes.GetCarsPayload): Promise<bookcarsTypes.User[]> => {
  try {
    const params = {
      pickupLocationId: data.pickupLocation,
      dropoffLocationId: data.dropoffLocation,
      pickupDateTime: data.from,
      dropoffDateTime: data.to,
    };

    return publicApi
      .get('/public/companies/affiliates?' + createQueryParams(params))
      .then((res) => {
        // Transform company/supplier data to user format for compatibility
        return (res.data.items || res.data || []).map((supplier: any) => ({
          _id: supplier.id,
          email: supplier.email,
          firstName: supplier.firstName || supplier.name,
          lastName: supplier.lastName || '',
          fullName: supplier.name || `${supplier.firstName} ${supplier.lastName}`.trim(),
          type: 'supplier',
          verified: supplier.verified !== false,
          avatar: supplier.logo || supplier.avatar || '',
        }));
      })
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .post('/api/frontend-suppliers', data)
          .then((res) => res.data);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .post('/api/frontend-suppliers', data)
      .then((res) => res.data);
  }
}
