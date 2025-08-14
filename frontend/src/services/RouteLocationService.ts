import { publicApi } from '../api/client'

export interface RouteLocation {
  location: string
}

export interface LocationSearchResponse {
  locations: string[]
}

/**
 * Get unique locations from route fares table
 * @param search Search term for filtering locations
 * @param limit Maximum number of results to return (default: 100)
 * @returns Promise with array of location strings
 */
export const getRouteLocations = async (
  search: string = '',
  limit: number = 100
): Promise<string[]> => {
  try {
    const response = await publicApi.get('/public/locations/route-locations', {
      params: {
        search: search.trim(),
        limit
      }
    })
    
    // Handle both success response format and direct locations array
    if (response.data?.success && response.data?.locations) {
      return response.data.locations
    } else if (response.data?.locations) {
      return response.data.locations
    } else if (Array.isArray(response.data)) {
      return response.data
    }
    
    return []
  } catch (error) {
    console.error('Error fetching route locations:', error)
    return []
  }
}

/**
 * Get initial set of locations (first 100)
 * @returns Promise with array of location strings
 */
export const getInitialLocations = (): Promise<string[]> => {
  return getRouteLocations('', 100)
}

/**
 * Search locations by term
 * @param searchTerm Search term
 * @returns Promise with filtered array of location strings
 */
export const searchLocations = (searchTerm: string): Promise<string[]> => {
  return getRouteLocations(searchTerm, 50)
}