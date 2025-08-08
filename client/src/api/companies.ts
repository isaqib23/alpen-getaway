import { apiClient } from './client'
import { 
  Company, 
  CreateCompanyRequest, 
  UpdateCompanyRequest, 
  CompanyFilters, 
  CompanyStats,
  PaginatedResponse
} from '../types/api'

export const companiesAPI = {
  // Get all companies with pagination and filters
  getCompanies: async (filters: CompanyFilters = {}): Promise<PaginatedResponse<Company>> => {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `/companies?${queryString}` : '/companies'
    
    const response = await apiClient.get(url)
    return response.data
  },

  // Get company by ID
  getCompany: async (id: string): Promise<Company> => {
    const response = await apiClient.get(`/companies/${id}`)
    return response.data
  },

  // Create new company
  createCompany: async (data: CreateCompanyRequest): Promise<Company> => {
    const response = await apiClient.post('/companies', data)
    return response.data
  },

  // Update company
  updateCompany: async (id: string, data: UpdateCompanyRequest): Promise<Company> => {
    const response = await apiClient.patch(`/companies/${id}`, data)
    return response.data
  },

  // Delete company
  deleteCompany: async (id: string): Promise<void> => {
    await apiClient.delete(`/companies/${id}`)
  },

  // Approve company
  approveCompany: async (id: string): Promise<Company> => {
    const response = await apiClient.patch(`/companies/${id}/approve`)
    return response.data
  },

  // Reject company
  rejectCompany: async (id: string): Promise<Company> => {
    const response = await apiClient.patch(`/companies/${id}/reject`)
    return response.data
  },

  // Get company statistics
  getCompanyStats: async (): Promise<CompanyStats> => {
    const response = await apiClient.get('/companies/stats')
    return response.data
  },

  // Export companies (returns file blob)
  exportCompanies: async (filters: CompanyFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `/companies/export?${queryString}` : '/companies/export'

    const response = await apiClient.get(url, {
      responseType: 'blob'
    })
    return response.data
  },

  // Partner Profile API methods
  getPartnerProfile: async (): Promise<Company> => {
    const response = await apiClient.get('/companies/profile/me')
    return response.data
  },

  updatePartnerProfile: async (data: UpdateCompanyRequest): Promise<Company> => {
    const response = await apiClient.patch('/companies/profile/me', data)
    return response.data
  }
}

export default companiesAPI