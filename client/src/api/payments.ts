import { apiClient } from './client'

export interface Payment {
  id: string
  amount: number
  currency: string
  paymentMethod: 'stripe' | 'paypal' | 'cash'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  createdAt: string
  updatedAt: string
  booking?: {
    id: string
    bookingRequest: {
      id: string
      fromLocation: string
      toLocation: string
      customer: {
        id: string
        firstName: string
        lastName: string
        email: string
      }
    }
  }
}

export interface PaymentStats {
  total: number
  completed: number
  pending: number
  failed: number
  totalRevenue: number
}

export const paymentsAPI = {
  async getAll(): Promise<Payment[]> {
    console.log('💳 paymentsAPI.getAll called')
    const response = await apiClient.get('/api/admin/payments')
    console.log('✅ paymentsAPI.getAll response:', response.data)
    return response.data
  },

  async getStatistics(): Promise<PaymentStats> {
    console.log('📊 paymentsAPI.getStatistics called')
    const response = await apiClient.get('/api/admin/payments/statistics')
    console.log('✅ paymentsAPI.getStatistics response:', response.data)
    return response.data
  },

  async getById(id: string): Promise<Payment> {
    console.log('🔍 paymentsAPI.getById called with id:', id)
    const response = await apiClient.get(`/api/admin/payments/${id}`)
    console.log('✅ paymentsAPI.getById response:', response.data)
    return response.data
  }
}