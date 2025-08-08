import { apiClient } from './client'
import { 
  AffiliateRequest,
  AffiliateRequestFilters,
  AffiliateRequestStats,
  CreateAffiliateRequestRequest,
  UpdateAffiliateRequestRequest,
  PaginatedResponse 
} from '../types/api'

export const affiliateRequestsAPI = {
  async getAll(filters?: AffiliateRequestFilters): Promise<PaginatedResponse<AffiliateRequest>> {
    console.log('📋 affiliateRequestsAPI.getAll called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-requests?${params.toString()}`)
    console.log('✅ affiliateRequestsAPI.getAll RAW response:', response)
    
    // Since apiClient.interceptor returns response.data, we receive the actual data
    let responseData = response
    
    // If response is an array, it means it's malformed, wrap it properly
    if (Array.isArray(response)) {
      responseData = {
        data: response,
        // @ts-ignore
        total: response.length,
        page: 1,
        limit: response.length
      }
    }
    
    // Convert string numbers to actual numbers for consistency
    if (responseData.data && Array.isArray(responseData.data)) {
      responseData.data = responseData.data.map((request: any) => ({
        ...request,
        estimatedFare: parseFloat(request.estimatedFare || 0),
        maxBudget: parseFloat(request.maxBudget || 0),
        passengerCount: parseInt(request.passengerCount || 1),
        luggageCount: parseInt(request.luggageCount || 0),
      }))
    }
    
    console.log('✅ affiliateRequestsAPI.getAll processed response:', responseData)
    // @ts-ignore
    return responseData
  },

  async getStatistics(): Promise<AffiliateRequestStats> {
    console.log('📊 affiliateRequestsAPI.getStatistics called')
    const response = await apiClient.get('/api/admin/affiliate-requests/statistics')
    console.log('✅ affiliateRequestsAPI.getStatistics response:', response)
    // @ts-ignore
    return response
  },

  async getById(id: string): Promise<AffiliateRequest> {
    console.log('🔍 affiliateRequestsAPI.getById called with id:', id)
    const response = await apiClient.get(`/api/admin/affiliate-requests/${id}`)
    console.log('✅ affiliateRequestsAPI.getById response:', response)
    // @ts-ignore
    return response
  },

  async create(requestData: CreateAffiliateRequestRequest): Promise<AffiliateRequest> {
    console.log('➕ affiliateRequestsAPI.create called with data:', requestData)
    const response = await apiClient.post('/api/admin/affiliate-requests', requestData)
    console.log('✅ affiliateRequestsAPI.create response:', response)
    // @ts-ignore
    return response
  },

  async update(id: string, updateData: UpdateAffiliateRequestRequest): Promise<AffiliateRequest> {
    console.log('📝 affiliateRequestsAPI.update called with id:', id, 'data:', updateData)
    const response = await apiClient.patch(`/api/admin/affiliate-requests/${id}`, updateData)
    console.log('✅ affiliateRequestsAPI.update response:', response)
    // @ts-ignore
    return response
  },

  async approve(id: string, notes?: string): Promise<AffiliateRequest> {
    console.log('✅ affiliateRequestsAPI.approve called with id:', id, 'notes:', notes)
    const response = await apiClient.post(`/api/admin/affiliate-requests/${id}/approve`, { notes })
    console.log('✅ affiliateRequestsAPI.approve response:', response)
    // @ts-ignore
    return response
  },

  async reject(id: string, rejectionReason: string, notes?: string): Promise<AffiliateRequest> {
    console.log('❌ affiliateRequestsAPI.reject called with id:', id, 'reason:', rejectionReason)
    const response = await apiClient.post(`/api/admin/affiliate-requests/${id}/reject`, { 
      rejectionReason, 
      notes 
    })
    console.log('✅ affiliateRequestsAPI.reject response:', response)
    // @ts-ignore
    return response
  },

  async delete(id: string): Promise<void> {
    console.log('🗑️ affiliateRequestsAPI.delete called with id:', id)
    const response = await apiClient.delete(`/api/admin/affiliate-requests/${id}`)
    console.log('✅ affiliateRequestsAPI.delete response:', response)
    // @ts-ignore
    return response
  },

  async exportReport(filters?: AffiliateRequestFilters): Promise<Blob> {
    console.log('📊 affiliateRequestsAPI.exportReport called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-requests/export?${params.toString()}`, {
      responseType: 'blob'
    })
    console.log('✅ affiliateRequestsAPI.exportReport response received')
    // @ts-ignore
    return response
  },

  async convertToBooking(id: string): Promise<void> {
    console.log('🔄 affiliateRequestsAPI.convertToBooking called with id:', id)
    const response = await apiClient.post(`/api/admin/affiliate-requests/${id}/convert-to-booking`)
    console.log('✅ affiliateRequestsAPI.convertToBooking response:', response)
    // @ts-ignore
    return response
  }
}