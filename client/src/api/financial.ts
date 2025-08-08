import { apiClient } from './client'

// Enums matching backend
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  CASH = 'cash'
}

export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected'
}

// Interfaces
export interface Payment {
  id: string
  booking_id: string
  payer_id: string
  company_id?: string
  payment_method: PaymentMethod
  amount: number
  currency: string
  stripe_payment_intent_id?: string
  stripe_customer_id?: string
  stripe_payment_method_id?: string
  payment_status: PaymentStatus
  failure_reason?: string
  paid_at?: string
  failed_at?: string
  refunded_at?: string
  created_at: string
  updated_at?: string
  // Related data from joins
  payer_name?: string
  company_name?: string
  booking_reference?: string
}

export interface CreatePaymentDto {
  booking_id: string
  payer_id: string
  company_id?: string
  payment_method: PaymentMethod
  amount: number
  currency?: string
  stripe_payment_intent_id?: string
  stripe_customer_id?: string
  stripe_payment_method_id?: string
}

export interface UpdatePaymentDto {
  payment_method?: PaymentMethod
  amount?: number
  currency?: string
  stripe_payment_intent_id?: string
  stripe_customer_id?: string
  stripe_payment_method_id?: string
  failure_reason?: string
}

export interface PaymentFilters {
  payment_status?: PaymentStatus
  payment_method?: PaymentMethod
  date_from?: string
  date_to?: string
}

export interface PaymentStats {
  totalPayments: number
  totalAmount: number
  byStatus: {
    [key in PaymentStatus]: {
      count: number
      amount: number
    }
  }
  byMethod: {
    [key in PaymentMethod]: {
      count: number
      amount: number
    }
  }
  monthlyRevenue: Array<{
    month: string
    amount: number
    count: number
  }>
}

export interface Commission {
  id: string
  company_id: string
  booking_id: string
  payment_id: string
  booking_amount: number
  commission_rate: number
  commission_amount: number
  status: CommissionStatus
  approved_at?: string
  paid_at?: string
  created_at: string
  // Related data from joins
  company_name?: string
  booking_reference?: string
  payment_amount?: number
}

export interface CommissionStats {
  totalCommissions: number
  totalAmount: number
  byStatus: {
    [key in CommissionStatus]: {
      count: number
      amount: number
    }
  }
  monthlyCommissions: Array<{
    month: string
    amount: number
    count: number
  }>
}

export interface PaymentMethodConfig {
  id: string
  name: string
  type: PaymentMethod
  is_active: boolean
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreatePaymentMethodDto {
  name: string
  type: PaymentMethod
  is_active?: boolean
  config?: Record<string, any>
}

export interface UpdatePaymentMethodDto {
  name?: string
  type?: PaymentMethod
  is_active?: boolean
  config?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    lastPage: number
    limit: number
  }
}

// Financial API functions
export const financialAPI = {
  // Payments CRUD
  async getPayments(page = 1, limit = 10, filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.payment_status && { payment_status: filters.payment_status }),
      ...(filters?.payment_method && { payment_method: filters.payment_method }),
      ...(filters?.date_from && { date_from: filters.date_from }),
      ...(filters?.date_to && { date_to: filters.date_to })
    })
    
    const response = await apiClient.get(`/payments?${params}`)
    return response.data
  },

  async getPaymentById(id: string): Promise<Payment> {
    const response = await apiClient.get(`/payments/${id}`)
    return response.data
  },

  async createPayment(data: CreatePaymentDto): Promise<Payment> {
    const response = await apiClient.post('/payments', data)
    return response.data
  },

  async updatePayment(id: string, data: UpdatePaymentDto): Promise<Payment> {
    const response = await apiClient.patch(`/payments/${id}`, data)
    return response.data
  },

  async markPaymentAsPaid(id: string): Promise<Payment> {
    const response = await apiClient.patch(`/payments/${id}/mark-paid`)
    return response.data
  },

  async markPaymentAsFailed(id: string, failure_reason: string): Promise<Payment> {
    const response = await apiClient.patch(`/payments/${id}/mark-failed`, { failure_reason })
    return response.data
  },

  async refundPayment(id: string): Promise<Payment> {
    const response = await apiClient.patch(`/payments/${id}/refund`)
    return response.data
  },

  async getPaymentStats(): Promise<PaymentStats> {
    const response = await apiClient.get('/payments/stats')
    return response.data
  },

  // Commissions CRUD
  async getCommissions(page = 1, limit = 10, status?: CommissionStatus): Promise<PaginatedResponse<Commission>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    })
    
    const response = await apiClient.get(`/payments/commissions?${params}`)
    return response.data
  },

  async getCommissionStats(): Promise<CommissionStats> {
    const response = await apiClient.get('/payments/commissions/stats')
    return response.data
  },

  async approveCommission(id: string): Promise<Commission> {
    const response = await apiClient.patch(`/payments/commissions/${id}/approve`)
    return response.data
  },

  async payCommission(id: string): Promise<Commission> {
    const response = await apiClient.patch(`/payments/commissions/${id}/pay`)
    return response.data
  },

  // Payment Methods CRUD
  async getPaymentMethods(): Promise<PaymentMethodConfig[]> {
    const response = await apiClient.get('/payment-methods')
    return response.data
  },

  async getPaymentMethodById(id: string): Promise<PaymentMethodConfig> {
    const response = await apiClient.get(`/payment-methods/${id}`)
    return response.data
  },

  async createPaymentMethod(data: CreatePaymentMethodDto): Promise<PaymentMethodConfig> {
    const response = await apiClient.post('/payment-methods', data)
    return response.data
  },

  async updatePaymentMethod(id: string, data: UpdatePaymentMethodDto): Promise<PaymentMethodConfig> {
    const response = await apiClient.patch(`/payment-methods/${id}`, data)
    return response.data
  },

  async deletePaymentMethod(id: string): Promise<void> {
    await apiClient.delete(`/payment-methods/${id}`)
  }
}