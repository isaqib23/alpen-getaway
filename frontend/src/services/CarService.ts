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
    // Use the correct public API endpoint for featured cars
    const params = {
      page: page + 1, // Server uses 1-based indexing
      limit: size,
      category: data.carType?.join(','), // Pass car types as comma-separated
    };

    return publicApi
      .get('/public/content/cars?' + createQueryParams(params))
      .then((res) => {
        // Transform the response to match expected format
        const apiData = res.data;
        if (apiData.success && apiData.data) {
          return {
            resultData: apiData.data.map(transformCarResponse),
            pageInfo: [
              {
                totalRecords: apiData.pagination?.total || apiData.data.length,
                totalPages: apiData.pagination?.totalPages || 1,
                pageSize: size,
                pageIndex: page,
                resultData: apiData.data.map(transformCarResponse)
              }
            ]
          };
        }
        throw new Error('Invalid API response format');
      })
      .catch((error) => {
        console.error('Cars API error:', error);
        console.log('Trying alternative approach - getting all cars');
        // Alternative: try to get cars without pagination
        return publicApi
          .get('/public/content/cars?limit=50')
          .then((res) => {
            const apiData = res.data;
            if (apiData.success && apiData.data) {
              const cars = apiData.data.map(transformCarResponse);
              const startIndex = page * size;
              const endIndex = startIndex + size;
              const paginatedCars = cars.slice(startIndex, endIndex);
              
              return {
                resultData: paginatedCars,
                pageInfo: [
                  {
                    totalRecords: cars.length,
                    totalPages: Math.ceil(cars.length / size),
                    pageSize: size,
                    pageIndex: page,
                    resultData: paginatedCars
                  }
                ]
              };
            }
            throw new Error('No cars available');
          });
      });
  } catch (error) {
    console.error('Cars service error:', error);
    // Return empty result instead of failing
    return Promise.resolve({
      resultData: [],
      pageInfo: [
        {
          totalRecords: 0,
          totalPages: 0,
          pageSize: size,
          pageIndex: page,
          resultData: []
        }
      ]
    });
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
