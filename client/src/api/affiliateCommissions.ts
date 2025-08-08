import { apiClient } from './client'
import { 
  AffiliateCommission,
  AffiliateCommissionFilters,
  AffiliateCommissionStats,
  CreateAffiliateCommissionRequest,
  UpdateAffiliateCommissionRequest,
  PaymentBatch,
  ProcessPaymentRequest,
  PaginatedResponse 
} from '../types/api'

export const affiliateCommissionsAPI = {
  async getAll(filters?: AffiliateCommissionFilters): Promise<PaginatedResponse<AffiliateCommission>> {
    console.log('💰 affiliateCommissionsAPI.getAll called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-commissions?${params.toString()}`)
    console.log('✅ affiliateCommissionsAPI.getAll RAW response:', response)
    
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
      responseData.data = responseData.data.map((commission: any) => ({
        ...commission,
        baseAmount: parseFloat(commission.baseAmount || 0),
        commissionRate: parseFloat(commission.commissionRate || 0),
        commissionAmount: parseFloat(commission.commissionAmount || 0),
      }))
    }
    
    console.log('✅ affiliateCommissionsAPI.getAll processed response:', responseData)
    // @ts-ignore
    return responseData
  },

  async getStatistics(): Promise<AffiliateCommissionStats> {
    console.log('📊 affiliateCommissionsAPI.getStatistics called')
    const response = await apiClient.get('/api/admin/affiliate-commissions/statistics')
    console.log('✅ affiliateCommissionsAPI.getStatistics response:', response)
    // @ts-ignore
    return response
  },

  async getById(id: string): Promise<AffiliateCommission> {
    console.log('🔍 affiliateCommissionsAPI.getById called with id:', id)
    const response = await apiClient.get(`/api/admin/affiliate-commissions/${id}`)
    console.log('✅ affiliateCommissionsAPI.getById response:', response)
    // @ts-ignore
    return response
  },

  async create(commissionData: CreateAffiliateCommissionRequest): Promise<AffiliateCommission> {
    console.log('➕ affiliateCommissionsAPI.create called with data:', commissionData)
    const response = await apiClient.post('/api/admin/affiliate-commissions', commissionData)
    console.log('✅ affiliateCommissionsAPI.create response:', response)
    // @ts-ignore
    return response
  },

  async update(id: string, updateData: UpdateAffiliateCommissionRequest): Promise<AffiliateCommission> {
    console.log('📝 affiliateCommissionsAPI.update called with id:', id, 'data:', updateData)
    const response = await apiClient.patch(`/api/admin/affiliate-commissions/${id}`, updateData)
    console.log('✅ affiliateCommissionsAPI.update response:', response)
    // @ts-ignore
    return response
  },

  async approve(id: string, notes?: string): Promise<AffiliateCommission> {
    console.log('✅ affiliateCommissionsAPI.approve called with id:', id, 'notes:', notes)
    const response = await apiClient.post(`/api/admin/affiliate-commissions/${id}/approve`, { notes })
    console.log('✅ affiliateCommissionsAPI.approve response:', response)
    // @ts-ignore
    return response
  },

  async reject(id: string, reason: string, notes?: string): Promise<AffiliateCommission> {
    console.log('❌ affiliateCommissionsAPI.reject called with id:', id, 'reason:', reason)
    const response = await apiClient.post(`/api/admin/affiliate-commissions/${id}/reject`, { 
      reason, 
      notes 
    })
    console.log('✅ affiliateCommissionsAPI.reject response:', response)
    // @ts-ignore
    return response
  },

  async delete(id: string): Promise<void> {
    console.log('🗑️ affiliateCommissionsAPI.delete called with id:', id)
    const response = await apiClient.delete(`/api/admin/affiliate-commissions/${id}`)
    console.log('✅ affiliateCommissionsAPI.delete response:', response)
    // @ts-ignore
    return response
  },

  async processPayment(paymentData: ProcessPaymentRequest): Promise<PaymentBatch> {
    console.log('💳 affiliateCommissionsAPI.processPayment called with data:', paymentData)
    const response = await apiClient.post('/api/admin/affiliate-commissions/process-payment', paymentData)
    console.log('✅ affiliateCommissionsAPI.processPayment response:', response)
    // @ts-ignore
    return response
  },

  async processIndividualPayment(id: string, notes?: string): Promise<AffiliateCommission> {
    console.log('💳 affiliateCommissionsAPI.processIndividualPayment called with id:', id)
    const response = await apiClient.post(`/api/admin/affiliate-commissions/${id}/process-payment`, { notes })
    console.log('✅ affiliateCommissionsAPI.processIndividualPayment response:', response)
    // @ts-ignore
    return response
  },

  async getPaymentBatches(): Promise<PaymentBatch[]> {
    console.log('📦 affiliateCommissionsAPI.getPaymentBatches called')
    const response = await apiClient.get('/api/admin/affiliate-commissions/payment-batches')
    console.log('✅ affiliateCommissionsAPI.getPaymentBatches response:', response)
    // @ts-ignore
    return response
  },

  async getPaymentBatch(batchId: string): Promise<PaymentBatch> {
    console.log('📦 affiliateCommissionsAPI.getPaymentBatch called with batchId:', batchId)
    const response = await apiClient.get(`/api/admin/affiliate-commissions/payment-batches/${batchId}`)
    console.log('✅ affiliateCommissionsAPI.getPaymentBatch response:', response)
    // @ts-ignore
    return response
  },

  async exportReport(filters?: AffiliateCommissionFilters): Promise<{ success: boolean; data: string; filename: string; totalRecords: number }> {
    console.log('📊 affiliateCommissionsAPI.exportReport called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-commissions/export?${params.toString()}`)
    console.log('✅ affiliateCommissionsAPI.exportReport response received')
    // @ts-ignore
    return response
  },

  async bulkApprove(commissionIds: string[]): Promise<void> {
    console.log('✅ affiliateCommissionsAPI.bulkApprove called with ids:', commissionIds)
    const response = await apiClient.post('/api/admin/affiliate-commissions/bulk-approve', { 
      commissionIds 
    })
    console.log('✅ affiliateCommissionsAPI.bulkApprove response:', response)
    // @ts-ignore
    return response
  },

  async bulkReject(commissionIds: string[], reason: string): Promise<void> {
    console.log('❌ affiliateCommissionsAPI.bulkReject called with ids:', commissionIds, 'reason:', reason)
    const response = await apiClient.post('/api/admin/affiliate-commissions/bulk-reject', { 
      commissionIds, 
      reason 
    })
    console.log('✅ affiliateCommissionsAPI.bulkReject response:', response)
    // @ts-ignore
    return response
  }
}