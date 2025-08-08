import { apiClient } from './client';

export interface B2BPartner {
  id: string;
  userId?: string;
  companyName: string;
  companyEmail: string;
  companyContact: string;
  registrationCountry: string;
  companyRepresentative: string;
  serviceArea: string;
  companyRegistrationNumber: string;
  totalVehicles: number;
  totalDrivers: number;
  totalRevenue: number;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
}

export interface CreateB2BPartnerData {
  companyName: string;
  companyEmail: string;
  companyContact: string;
  registrationCountry: string;
  companyRepresentative: string;
  serviceArea: string;
  companyRegistrationNumber: string;
  userId?: string;
}

export interface UpdateB2BPartnerData {
  companyName?: string;
  companyEmail?: string;
  companyContact?: string;
  registrationCountry?: string;
  companyRepresentative?: string;
  serviceArea?: string;
  companyRegistrationNumber?: string;
  notes?: string;
}

export interface B2BPartnerFilters {
  status?: string;
  registrationCountry?: string;
  serviceArea?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface B2BPartnerResponse {
  data: B2BPartner[];
  total: number;
  page: number;
  limit: number;
}

export interface B2BPartnerStatistics {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  suspended: number;
  totalVehicles: number;
  totalDrivers: number;
  approvalRate: number;
}

export const b2bPartnersApi = {
  // Get all B2B partners with filtering
  getAll: async (filters: B2BPartnerFilters = {}): Promise<B2BPartnerResponse> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.registrationCountry) params.append('registrationCountry', filters.registrationCountry);
    if (filters.serviceArea) params.append('serviceArea', filters.serviceArea);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await apiClient.get(`/api/admin/b2b-partners?${params.toString()}`);
    // @ts-ignore
    return response;
  },

  // Get B2B partner by ID
  getById: async (id: string): Promise<B2BPartner> => {
    const response = await apiClient.get(`/api/admin/b2b-partners/${id}`);
    // @ts-ignore
    return response;
  },

  // Create new B2B partner
  create: async (data: CreateB2BPartnerData): Promise<B2BPartner> => {
    const response = await apiClient.post('/api/admin/b2b-partners', data);
    // @ts-ignore
    return response;
  },

  // Update B2B partner
  update: async (id: string, data: UpdateB2BPartnerData): Promise<B2BPartner> => {
    const response = await apiClient.patch(`/api/admin/b2b-partners/${id}`, data);
    // @ts-ignore
    return response;
  },

  // Delete B2B partner
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/admin/b2b-partners/${id}`);
    // @ts-ignore
    return response;
  },

  // Approve B2B partner
  approve: async (id: string, notes?: string): Promise<B2BPartner> => {
    const response = await apiClient.post(`/api/admin/b2b-partners/${id}/approve`, { notes });
    // @ts-ignore
    return response;
  },

  // Reject B2B partner
  reject: async (id: string, reason?: string): Promise<B2BPartner> => {
    const response = await apiClient.post(`/api/admin/b2b-partners/${id}/reject`, { reason });
    // @ts-ignore
    return response;
  },

  // Get statistics
  getStatistics: async (): Promise<B2BPartnerStatistics> => {
    const response = await apiClient.get('/api/admin/b2b-partners/statistics');
    // @ts-ignore
    return response;
  },

  // Bulk update status
  bulkUpdateStatus: async (ids: string[], status: string): Promise<{ message: string; affected: number }> => {
    const response = await apiClient.post('/api/admin/b2b-partners/bulk-update-status', { ids, status });
    // @ts-ignore
    return response;
  }
};