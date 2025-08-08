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
    // For now, get all suppliers since we don't have location/date filtering implemented yet
    const params = {
      limit: 50, // Get more suppliers
    };

    return publicApi
      .get('/public/content/suppliers?' + createQueryParams(params))
      .then((res) => {
        // Handle the new API response structure
        const suppliers = res.data?.data || res.data?.items || res.data || [];
        
        // Transform company/supplier data to user format for compatibility
        return suppliers.map((supplier: any) => ({
          _id: supplier.id || supplier._id,
          id: supplier.id || supplier._id,
          email: supplier.email || supplier.contactEmail || '',
          firstName: supplier.firstName || supplier.name || supplier.companyName || 'Supplier',
          lastName: supplier.lastName || '',
          fullName: supplier.name || supplier.companyName || `${supplier.firstName || 'Supplier'} ${supplier.lastName || ''}`.trim(),
          type: 'supplier',
          verified: supplier.verified !== false && supplier.status === 'active',
          avatar: supplier.logo || supplier.avatar || '/img/default-supplier.jpg',
          companyName: supplier.companyName || supplier.name,
          phone: supplier.phone || supplier.contactPhone || '',
          address: supplier.address || '',
          website: supplier.website || '',
        }));
      })
      .catch((error) => {
        console.error('Suppliers API error:', error);
        // Fallback to legacy API
        return axiosInstance
          .post('/api/frontend-suppliers', data)
          .then((res) => res.data);
      });
  } catch (error) {
    console.error('Suppliers service error:', error);
    // Direct fallback to legacy API
    return axiosInstance
      .post('/api/frontend-suppliers', data)
      .then((res) => res.data);
  }
}
