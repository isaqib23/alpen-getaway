import { apiClient } from './client'
import { 
  Affiliate, 
  CreateAffiliateRequest, 
  UpdateAffiliateRequest, 
  AffiliateFilters, 
  PaginatedResponse 
} from '../types/api'

export interface AffiliateReferral {
  id: string
  customerId: string
  bookingId?: string
  commissionAmount: number
  status: 'pending' | 'confirmed' | 'paid'
  createdAt: string
}

export interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  totalPaid: string
  averageConversion: string
}

export const affiliatesAPI = {
  async getAll(filters?: AffiliateFilters): Promise<PaginatedResponse<Affiliate>> {
    console.log('🏢 affiliatesAPI.getAll called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliates?${params.toString()}`)
    console.log('✅ affiliatesAPI.getAll RAW response:', response)
    
    // Since apiClient.interceptor returns response.data, we receive the actual data
    // The backend returns {data: [], total, page, limit}
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
      responseData.data = responseData.data.map((affiliate: any) => ({
        ...affiliate,
        commissionRate: parseFloat(affiliate.commissionRate || 0),
        minimumPayout: parseFloat(affiliate.minimumPayout || 0),
        totalEarnings: parseFloat(affiliate.totalEarnings || 0),
        pendingEarnings: parseFloat(affiliate.pendingEarnings || 0),
        paidEarnings: parseFloat(affiliate.paidEarnings || 0),
      }))
    }
    
    console.log('✅ affiliatesAPI.getAll processed response:', responseData)
    // @ts-ignore
    return responseData
  },

  async getStatistics(): Promise<AffiliateStats> {
    console.log('📊 affiliatesAPI.getStatistics called')
    const response = await apiClient.get('/api/admin/affiliates/statistics')
    console.log('✅ affiliatesAPI.getStatistics response:', response.data)
    return response.data
  },

  async getById(id: string): Promise<Affiliate> {
    console.log('🔍 affiliatesAPI.getById called with id:', id)
    const response = await apiClient.get(`/api/admin/affiliates/${id}`)
    console.log('✅ affiliatesAPI.getById response:', response.data)
    return response.data
  },

  async create(affiliateData: CreateAffiliateRequest): Promise<Affiliate> {
    console.log('➕ affiliatesAPI.create called with data:', affiliateData)
    const response = await apiClient.post('/api/admin/affiliates', affiliateData)
    console.log('✅ affiliatesAPI.create response:', response.data)
    return response.data
  },

  async update(id: string, affiliateData: UpdateAffiliateRequest): Promise<Affiliate> {
    console.log('📝 affiliatesAPI.update called with id:', id, 'data:', affiliateData)
    const response = await apiClient.patch(`/api/admin/affiliates/${id}`, affiliateData)
    console.log('✅ affiliatesAPI.update response:', response.data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    console.log('🗑️ affiliatesAPI.delete called with id:', id)
    const response = await apiClient.delete(`/api/admin/affiliates/${id}`)
    console.log('✅ affiliatesAPI.delete response:', response.data)
    return response.data
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    console.log('🔄 affiliatesAPI.bulkUpdateStatus called with ids:', ids, 'status:', status)
    const response = await apiClient.post('/api/admin/affiliates/bulk-update-status', { ids, status })
    console.log('✅ affiliatesAPI.bulkUpdateStatus response:', response.data)
    return response.data
  },

  async approve(id: string): Promise<void> {
    console.log('✅ affiliatesAPI.approve called with id:', id)
    const response = await apiClient.post(`/api/admin/affiliates/${id}/approve`)
    console.log('✅ affiliatesAPI.approve response:', response.data)
    return response.data
  },

  async suspend(id: string): Promise<void> {
    console.log('🚫 affiliatesAPI.suspend called with id:', id)
    const response = await apiClient.post(`/api/admin/affiliates/${id}/suspend`)
    console.log('✅ affiliatesAPI.suspend response:', response.data)
    return response.data
  },

  async processPayment(id: string, amount: number): Promise<void> {
    console.log('💰 affiliatesAPI.processPayment called with id:', id, 'amount:', amount)
    const response = await apiClient.post(`/api/admin/affiliates/${id}/process-payment`, { amount })
    console.log('✅ affiliatesAPI.processPayment response:', response.data)
    return response.data
  }
}