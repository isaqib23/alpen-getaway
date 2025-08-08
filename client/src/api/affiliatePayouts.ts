import { apiClient } from './client'
import { 
  AffiliatePayout,
  AffiliatePayoutFilters,
  AffiliatePayoutStats,
  PaginatedResponse,
  CreateAffiliatePayoutRequest,
  UpdateAffiliatePayoutRequest,
  ProcessPayoutBatchRequest,
} from '../types/api'

export const affiliatePayoutsAPI = {
  async getAll(filters: AffiliatePayoutFilters = {}): Promise<PaginatedResponse<AffiliatePayout>> {
    console.log('📄 affiliatePayoutsAPI.getAll called with filters:', filters)
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/api/admin/affiliate-payouts?${params.toString()}`)
    console.log('✅ affiliatePayoutsAPI.getAll response:', response)
    
    // Transform response to match expected structure
    return {
      data: response.data || response,
      // @ts-ignore
      total: response.total || 0,
      // @ts-ignore
      page: response.page || 1,
      // @ts-ignore
      limit: response.limit || 10
    }
  },

  async getStatistics(): Promise<AffiliatePayoutStats> {
    console.log('📊 affiliatePayoutsAPI.getStatistics called')
    const response = await apiClient.get('/api/admin/affiliate-payouts/statistics')
    console.log('✅ affiliatePayoutsAPI.getStatistics response:', response)
    // @ts-ignore
    return response
  },

  async getById(id: string): Promise<AffiliatePayout> {
    console.log('🔍 affiliatePayoutsAPI.getById called with id:', id)
    const response = await apiClient.get(`/api/admin/affiliate-payouts/${id}`)
    console.log('✅ affiliatePayoutsAPI.getById response:', response)
    // @ts-ignore
    return response
  },

  async create(data: CreateAffiliatePayoutRequest): Promise<AffiliatePayout> {
    console.log('➕ affiliatePayoutsAPI.create called with data:', data)
    const response = await apiClient.post('/api/admin/affiliate-payouts', data)
    console.log('✅ affiliatePayoutsAPI.create response:', response)
    // @ts-ignore
    return response
  },

  async update(id: string, data: UpdateAffiliatePayoutRequest): Promise<AffiliatePayout> {
    console.log('📝 affiliatePayoutsAPI.update called with id:', id, 'data:', data)
    const response = await apiClient.patch(`/api/admin/affiliate-payouts/${id}`, data)
    console.log('✅ affiliatePayoutsAPI.update response:', response)
    // @ts-ignore
    return response
  },

  async delete(id: string): Promise<void> {
    console.log('🗑️ affiliatePayoutsAPI.delete called with id:', id)
    const response = await apiClient.delete(`/api/admin/affiliate-payouts/${id}`)
    console.log('✅ affiliatePayoutsAPI.delete response:', response)
    // @ts-ignore
    return response
  },

  async retry(id: string, notes?: string): Promise<AffiliatePayout> {
    console.log('🔄 affiliatePayoutsAPI.retry called with id:', id, 'notes:', notes)
    const response = await apiClient.post(`/api/admin/affiliate-payouts/${id}/retry`, { notes })
    console.log('✅ affiliatePayoutsAPI.retry response:', response)
    // @ts-ignore
    return response
  },

  async cancel(id: string, reason: string): Promise<AffiliatePayout> {
    console.log('❌ affiliatePayoutsAPI.cancel called with id:', id, 'reason:', reason)
    const response = await apiClient.post(`/api/admin/affiliate-payouts/${id}/cancel`, { reason })
    console.log('✅ affiliatePayoutsAPI.cancel response:', response)
    // @ts-ignore
    return response
  },

  async processBatch(data: ProcessPayoutBatchRequest): Promise<{ batchId: string; processedCount: number; totalAmount: number }> {
    console.log('💳 affiliatePayoutsAPI.processBatch called with data:', data)
    const response = await apiClient.post('/api/admin/affiliate-payouts/process-batch', data)
    console.log('✅ affiliatePayoutsAPI.processBatch response:', response)
    // @ts-ignore
    return response
  },

  async generatePayouts(affiliateId?: string): Promise<{ created: number; totalAmount: number }> {
    console.log('🏭 affiliatePayoutsAPI.generatePayouts called with affiliateId:', affiliateId)
    const response = await apiClient.post('/api/admin/affiliate-payouts/generate', { affiliateId })
    console.log('✅ affiliatePayoutsAPI.generatePayouts response:', response)
    // @ts-ignore
    return response
  },

  async exportReport(filters?: AffiliatePayoutFilters): Promise<{ success: boolean; data: string; filename: string; totalRecords: number }> {
    console.log('📊 affiliatePayoutsAPI.exportReport called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-payouts/export?${params.toString()}`)
    console.log('✅ affiliatePayoutsAPI.exportReport response received')
    // @ts-ignore
    return response
  },

  async getPendingPayouts(): Promise<AffiliatePayout[]> {
    console.log('⏳ affiliatePayoutsAPI.getPendingPayouts called')
    const response = await apiClient.get('/api/admin/affiliate-payouts/pending')
    console.log('✅ affiliatePayoutsAPI.getPendingPayouts response:', response)
    // @ts-ignore
    return response
  },

  async getPayoutsByAffiliate(affiliateId: string, filters?: AffiliatePayoutFilters): Promise<PaginatedResponse<AffiliatePayout>> {
    console.log('👤 affiliatePayoutsAPI.getPayoutsByAffiliate called with affiliateId:', affiliateId, 'filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-payouts/affiliate/${affiliateId}?${params.toString()}`)
    console.log('✅ affiliatePayoutsAPI.getPayoutsByAffiliate response:', response)
    // @ts-ignore
    return response
  },
}

export default affiliatePayoutsAPI