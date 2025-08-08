import apiClient from './client'

export interface CarCategory {
  id: string
  name: string
  description: string
  base_rate: number
  per_km_rate: number
  per_minute_rate: number
  max_passengers: number
  status: 'active' | 'inactive'
  created_at: string
  // Legacy frontend properties for compatibility
  baseFare?: number
  pricePerKm?: number
  pricePerMinute?: number
  maxSeats?: number
  isActive?: boolean
  features?: string[]
  requirements?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateCarCategoryRequest {
  name: string
  description?: string
  base_rate: number
  per_km_rate?: number
  per_minute_rate?: number
  max_passengers: number
}

export interface CarCategoryStats {
  total: number
  active: number
  inactive: number
  avgBaseFare: number
}

export const carCategoriesAPI = {
  getAll: async (): Promise<CarCategory[]> => {
    return apiClient.get('/cars/categories')
  },

  getById: async (id: string): Promise<CarCategory> => {
    return apiClient.get(`/cars/categories/${id}`)
  },

  create: async (categoryData: CreateCarCategoryRequest): Promise<CarCategory> => {
    return apiClient.post('/cars/categories', categoryData)
  },

  update: async (id: string, categoryData: Partial<CreateCarCategoryRequest>): Promise<CarCategory> => {
    return apiClient.patch(`/cars/categories/${id}`, categoryData)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/cars/categories/${id}`)
  },

  getStats: async (): Promise<CarCategoryStats> => {
    return apiClient.get('/cars/categories/stats')
  }
}