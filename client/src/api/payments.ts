import { apiClient } from './client'

export interface Payment {
  id: string
  booking_id: string
  payer_id: string
  company_id?: string
  payment_method: 'stripe_bank_transfer'
  bank_transfer_type?: BankTransferType
  amount: number
  currency: string
  stripe_payment_intent_id?: string
  stripe_customer_id?: string
  stripe_payment_method_id?: string
  stripe_session_id?: string
  stripe_client_secret?: string
  bank_details?: BankTransferDetails
  metadata?: Record<string, any>
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  failure_reason?: string
  paid_at?: string
  failed_at?: string
  refunded_at?: string
  created_at: string
  booking?: {
    id: string
    booking_reference: string
    passenger_name: string
    pickup_address: string
    dropoff_address: string
    pickup_datetime: string
  }
  payer?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  company?: {
    id: string
    company_name: string
  }
}

export type BankTransferType = 
  | 'us_bank_account'
  | 'sepa_debit'
  | 'ach_debit'
  | 'ach_credit'
  | 'customer_balance'
  | 'fpx'
  | 'giropay'
  | 'ideal'
  | 'sofort'
  | 'bancontact'
  | 'eps'
  | 'przelewy24'

export interface BankTransferDetails {
  account_holder_name?: string
  account_number?: string
  routing_number?: string
  iban?: string
  swift_code?: string
  sort_code?: string
  bank_name?: string
  country?: string
  reference?: string
  payment_reference?: string
  hosted_regulatory_receipt_url?: string
}

export interface PaymentStats {
  total: number
  completed: number
  pending: number
  failed: number
  totalRevenue: number
}

export interface CreatePaymentData {
  booking_id: string
  payer_id: string
  company_id?: string
  payment_method: 'stripe_bank_transfer'
  bank_transfer_type?: BankTransferType
  amount: number
  currency?: string
  bank_details?: BankTransferDetails
}

export interface PaymentFilters {
  page?: number
  limit?: number
  payment_status?: string
  payment_method?: string
  date_from?: string
  date_to?: string
}

export const paymentsAPI = {
  async getAll(filters?: PaymentFilters): Promise<{ data: Payment[], meta: any }> {
    console.log('💳 paymentsAPI.getAll called')
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.payment_status) params.append('payment_status', filters.payment_status)
    if (filters?.payment_method) params.append('payment_method', filters.payment_method)
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)
    
    const response = await apiClient.get(`/payments?${params.toString()}`)
    console.log('✅ paymentsAPI.getAll response:', response.data)
    return response.data
  },

  async getById(id: string): Promise<Payment> {
    console.log('💳 paymentsAPI.getById called for:', id)
    const response = await apiClient.get(`/payments/${id}`)
    return response.data
  },

  async create(data: CreatePaymentData): Promise<Payment> {
    console.log('💳 paymentsAPI.create called with:', data)
    const response = await apiClient.post('/payments', data)
    return response.data
  },

  async getStatistics(): Promise<PaymentStats> {
    console.log('📊 paymentsAPI.getStatistics called')
    const response = await apiClient.get('/payments/stats')
    console.log('✅ paymentsAPI.getStatistics response:', response.data)
    return response.data
  },

  async getBankTransferDetails(paymentId: string): Promise<BankTransferDetails> {
    console.log('🏦 paymentsAPI.getBankTransferDetails called for:', paymentId)
    const response = await apiClient.get(`/payments/${paymentId}/bank-transfer-details`)
    return response.data
  },

  async getSupportedBankTransferTypes(country?: string, currency?: string): Promise<BankTransferType[]> {
    console.log('🌍 paymentsAPI.getSupportedBankTransferTypes called')
    const params = new URLSearchParams()
    if (country) params.append('country', country)
    if (currency) params.append('currency', currency)
    
    const response = await apiClient.get(`/payments/bank-transfer/supported-types?${params.toString()}`)
    return response.data
  },

  async initializeDefaultPaymentMethods(): Promise<any> {
    console.log('⚙️ paymentsAPI.initializeDefaultPaymentMethods called')
    const response = await apiClient.post('/payments/payment-methods/initialize-defaults')
    return response.data
  },

  async markAsPaid(id: string): Promise<Payment> {
    console.log('✅ paymentsAPI.markAsPaid called for:', id)
    const response = await apiClient.patch(`/payments/${id}/mark-paid`)
    return response.data
  },

  async markAsFailed(id: string, failureReason: string): Promise<Payment> {
    console.log('❌ paymentsAPI.markAsFailed called for:', id)
    const response = await apiClient.patch(`/payments/${id}/mark-failed`, { failure_reason: failureReason })
    return response.data
  },

  async refund(id: string): Promise<Payment> {
    console.log('↩️ paymentsAPI.refund called for:', id)
    const response = await apiClient.patch(`/payments/${id}/refund`)
    return response.data
  }
}