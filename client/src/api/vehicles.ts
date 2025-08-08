import apiClient from './client'
import { Vehicle, CreateVehicleRequest, VehicleFilters, PaginatedResponse } from '../types/api'

export const vehiclesAPI = {
  getAll: async (filters?: VehicleFilters): Promise<PaginatedResponse<Vehicle>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    return apiClient.get(`/api/admin/cars?${params.toString()}`)
  },

  getById: async (id: string): Promise<Vehicle> => {
    return apiClient.get(`/api/admin/cars/${id}`)
  },

  create: async (vehicleData: CreateVehicleRequest): Promise<Vehicle> => {
    return apiClient.post('/api/admin/cars', vehicleData)
  },

  update: async (id: string, vehicleData: Partial<CreateVehicleRequest>): Promise<Vehicle> => {
    return apiClient.patch(`/api/admin/cars/${id}`, vehicleData)
  },

  delete: async (id: string) => {
    return apiClient.delete(`/api/admin/cars/${id}`)
  },

  getStatistics: async () => {
    return apiClient.get('/api/admin/cars/statistics')
  },

  bulkUpdateStatus: async (ids: string[], status: string) => {
    return apiClient.post('/api/admin/cars/bulk-update-status', { ids, status })
  },
}