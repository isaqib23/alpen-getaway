import apiClient from './client'
import { RouteFare, CreateRouteFareRequest, RouteFilters, PaginatedResponse } from '../types/api'

export const routesAPI = {
  getAll: async (filters?: RouteFilters): Promise<PaginatedResponse<RouteFare>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const url = `/route-fares?${params.toString()}`
    console.log('🌐 routesAPI.getAll calling:', url)
    const response = await apiClient.get(url)
    return response.data
  },

  getById: async (id: string): Promise<RouteFare> => {
    const response = await apiClient.get(`/route-fares/${id}`)
    return response.data
  },

  create: async (routeData: CreateRouteFareRequest): Promise<RouteFare> => {
    const response = await apiClient.post('/route-fares', routeData)
    return response.data
  },

  update: async (id: string, routeData: Partial<CreateRouteFareRequest>): Promise<RouteFare> => {
    const url = `/route-fares/${id}`
    console.log('🌐 routesAPI.update calling:', url, 'with ID type:', typeof id)
    const response = await apiClient.patch(url, routeData)
    return response.data
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/route-fares/${id}`)
    return response.data
  },

  getStatistics: async () => {
    const response = await apiClient.get('/route-fares/stats')
    return response.data
  },

  getLocations: async () => {
    const response = await apiClient.get('/route-fares/locations')
    return response.data
  },

  getVehicles: async () => {
    const response = await apiClient.get('/route-fares/vehicles')
    return response.data
  },

  search: async (searchData: { from: string; to: string; vehicle?: string }) => {
    const params = new URLSearchParams()
    params.append('from', searchData.from)
    params.append('to', searchData.to)
    if (searchData.vehicle) {
      params.append('vehicle', searchData.vehicle)
    }
    const response = await apiClient.get(`/route-fares/search?${params.toString()}`)
    return response.data
  },

  importRoutes: async (routesData: CreateRouteFareRequest[]) => {
    const response = await apiClient.post('/route-fares/import', routesData)
    return response.data
  },

  bulkUpdateStatus: async (ids: string[], isActive: boolean) => {
    const response = await apiClient.post('/api/v1/route-fares/bulk-update-status', { ids, isActive })
    return response.data
  },
}