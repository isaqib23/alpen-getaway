import apiClient from './client'

export interface PricingRule {
  id: string
  name: string
  description: string
  type: 'base' | 'surge' | 'time_based' | 'distance_based' | 'demand_based' | 'seasonal'
  priority: number
  isActive: boolean
  conditions: {
    dayOfWeek?: string[]
    timeStart?: string
    timeEnd?: string
    minDistance?: number
    maxDistance?: number
    demandThreshold?: number
    seasonStart?: string
    seasonEnd?: string
  }
  multiplier: number
  fixedAmount: number
  maxPrice: number
  minPrice: number
  applicableVehicles: string[]
  applicableRoutes: string[]
  createdAt: string
  updatedAt: string
}

export interface CreatePricingRuleRequest {
  name: string
  description: string
  type: 'base' | 'surge' | 'time_based' | 'distance_based' | 'demand_based' | 'seasonal'
  priority: number
  isActive: boolean
  conditions: {
    dayOfWeek?: string[]
    timeStart?: string
    timeEnd?: string
    minDistance?: number
    maxDistance?: number
    demandThreshold?: number
    seasonStart?: string
    seasonEnd?: string
  }
  multiplier: number
  fixedAmount: number
  maxPrice: number
  minPrice: number
  applicableVehicles: string[]
  applicableRoutes: string[]
}

export interface PricingFilters {
  page?: number
  limit?: number
  type?: string
  isActive?: boolean
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const pricingAPI = {
  getAll: async (filters?: PricingFilters): Promise<PaginatedResponse<PricingRule>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const url = `/api/v1/pricing-rules?${params.toString()}`
    console.log('🌐 pricingAPI.getAll calling:', url)
    return apiClient.get(url)
  },

  getById: async (id: string): Promise<PricingRule> => {
    return apiClient.get(`/api/v1/pricing-rules/${id}`)
  },

  create: async (ruleData: CreatePricingRuleRequest): Promise<PricingRule> => {
    return apiClient.post('/api/v1/pricing-rules', ruleData)
  },

  update: async (id: string, ruleData: Partial<CreatePricingRuleRequest>): Promise<PricingRule> => {
    return apiClient.patch(`/api/v1/pricing-rules/${id}`, ruleData)
  },

  delete: async (id: string) => {
    return apiClient.delete(`/api/v1/pricing-rules/${id}`)
  },

  getStatistics: async () => {
    return apiClient.get('/api/v1/pricing-rules/stats')
  },

  simulate: async (simulationData: {
    basePrice: number
    distance: number
    time: string
    vehicleType: string
    date: string
  }) => {
    return apiClient.post('/api/v1/pricing-rules/simulate', simulationData)
  },

  bulkUpdateStatus: async (ids: string[], isActive: boolean) => {
    return apiClient.post('/api/v1/pricing-rules/bulk-update-status', { ids, isActive })
  },
}