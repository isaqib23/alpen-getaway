import apiClient from './client';

// Types
export interface Earnings {
  id: string;
  company_id: string;
  booking_id?: string;
  payment_id?: string;
  payout_id?: string;
  earnings_type: 'booking_commission' | 'auction_win' | 'referral_bonus' | 'platform_bonus';
  gross_amount: number;
  commission_rate: number;
  commission_amount: number;
  net_earnings: number;
  platform_fee: number;
  tax_amount: number;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  earned_at: string;
  processed_at?: string;
  paid_at?: string;
  notes?: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
  // Relations
  company?: {
    id: string;
    company_name: string;
  };
  booking?: {
    id: string;
    booking_reference: string;
  };
  payment?: {
    id: string;
    amount: number;
  };
  payout?: {
    id: string;
    payout_reference: string;
  };
}

export interface Payout {
  id: string;
  company_id: string;
  total_amount: number;
  fee_amount: number;
  net_amount: number;
  payout_method: 'bank_transfer' | 'paypal' | 'stripe' | 'wire_transfer' | 'check';
  status: 'pending' | 'requested' | 'approved' | 'processing' | 'paid' | 'failed' | 'cancelled';
  payout_reference: string;
  period_start: string;
  period_end: string;
  earnings_count: number;
  bank_account_details?: string;
  external_transaction_id?: string;
  requested_at?: string;
  approved_at?: string;
  processed_at?: string;
  paid_at?: string;
  failure_reason?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  company?: {
    id: string;
    company_name: string;
  };
  earnings?: Earnings[];
}

export interface EarningsFilters {
  page?: number;
  limit?: number;
  company_id?: string;
  status?: string;
  earnings_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface PayoutFilters {
  page?: number;
  limit?: number;
  company_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export interface EarningsStats {
  totalEarnings: number;
  totalAmount: number;
  totalCommission: number;
  byStatus: {
    pending: { count: number; amount: number };
    processed: { count: number; amount: number };
    paid: { count: number; amount: number };
    cancelled: { count: number; amount: number };
  };
  byType: {
    booking_commission: { count: number; amount: number };
    auction_win: { count: number; amount: number };
    referral_bonus: { count: number; amount: number };
    platform_bonus: { count: number; amount: number };
  };
  monthlyTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}

export interface PayoutStats {
  totalPayouts: number;
  totalAmount: number;
  totalFees: number;
  byStatus: {
    pending: { count: number; amount: number };
    requested: { count: number; amount: number };
    approved: { count: number; amount: number };
    processing: { count: number; amount: number };
    paid: { count: number; amount: number };
    failed: { count: number; amount: number };
    cancelled: { count: number; amount: number };
  };
}

export interface CreateEarningsDto {
  company_id: string;
  booking_id?: string;
  payment_id?: string;
  earnings_type: string;
  gross_amount: number;
  commission_rate: number;
  commission_amount: number;
  net_earnings: number;
  platform_fee?: number;
  tax_amount?: number;
  earned_at?: string;
  notes?: string;
  reference_number?: string;
}

export interface RequestPayoutDto {
  company_id: string;
  period_start: string;
  period_end: string;
  payout_method: string;
  bank_account_details?: string;
}

// API Functions
export const earningsApi = {
  // Earnings CRUD
  getAllEarnings: (filters: EarningsFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return apiClient.get(`/earnings?${params.toString()}`);
  },

  getEarningsById: (id: string) => 
    apiClient.get(`/earnings/${id}`),

  createEarnings: (data: CreateEarningsDto) => 
    apiClient.post('/earnings', data),

  updateEarnings: (id: string, data: Partial<CreateEarningsDto>) => 
    apiClient.patch(`/earnings/${id}`, data),

  deleteEarnings: (id: string) => 
    apiClient.delete(`/earnings/${id}`),

  // Earnings Stats
  getEarningsStats: (filters: { company_id?: string; period_start?: string; period_end?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return apiClient.get(`/earnings/stats?${params.toString()}`);
  },

  // Payouts
  getAllPayouts: (filters: PayoutFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return apiClient.get(`/earnings/payouts?${params.toString()}`);
  },

  getPayoutById: (id: string) => 
    apiClient.get(`/earnings/payouts/${id}`),

  requestPayout: (data: RequestPayoutDto) => 
    apiClient.post('/earnings/payouts/request', data),

  updatePayout: (id: string, data: any) => 
    apiClient.patch(`/earnings/payouts/${id}`, data),

  approvePayout: (id: string) => 
    apiClient.patch(`/earnings/payouts/${id}/approve`),

  processPayout: (id: string, externalTransactionId: string) => 
    apiClient.patch(`/earnings/payouts/${id}/process`, { external_transaction_id: externalTransactionId }),

  completePayout: (id: string) => 
    apiClient.patch(`/earnings/payouts/${id}/complete`),

  failPayout: (id: string, failureReason: string) => 
    apiClient.patch(`/earnings/payouts/${id}/fail`, { failure_reason: failureReason }),

  // Payout Stats
  getPayoutStats: () => 
    apiClient.get('/earnings/payouts/stats'),

  // Company-specific endpoints
  getCompanyEarnings: (companyId: string, filters: EarningsFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return apiClient.get(`/companies/${companyId}/earnings?${params.toString()}`);
  },

  getCompanyEarningsStats: (companyId: string, filters: { period_start?: string; period_end?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return apiClient.get(`/companies/${companyId}/earnings/stats?${params.toString()}`);
  },

  getCompanyPayouts: (companyId: string, filters: PayoutFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return apiClient.get(`/companies/${companyId}/earnings/payouts?${params.toString()}`);
  },

  getCompanyPayoutStats: (companyId: string) => 
    apiClient.get(`/companies/${companyId}/earnings/payouts/stats`),
};

export default earningsApi;