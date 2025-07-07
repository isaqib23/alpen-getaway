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
    const url = queryString ? `/api/v1/companies?${queryString}` : '/api/v1/companies'
    
    const response = await apiClient.get(url)
    return response.data
  },

  // Get company by ID
  getCompany: async (id: string): Promise<Company> => {
    const response = await apiClient.get(`/api/v1/companies/${id}`)
    return response.data
  },

  // Create new company
  createCompany: async (data: CreateCompanyRequest): Promise<Company> => {
    const response = await apiClient.post('/api/v1/companies', data)
    return response.data
  },

  // Update company
  updateCompany: async (id: string, data: UpdateCompanyRequest): Promise<Company> => {
    const response = await apiClient.patch(`/api/v1/companies/${id}`, data)
    return response.data
  },

  // Delete company
  deleteCompany: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/companies/${id}`)
  },

  // Approve company
  approveCompany: async (id: string): Promise<Company> => {
    const response = await apiClient.patch(`/api/v1/companies/${id}/approve`)
    return response.data
  },

  // Reject company
  rejectCompany: async (id: string): Promise<Company> => {
    const response = await apiClient.patch(`/api/v1/companies/${id}/reject`)
    return response.data
  },

  // Get company statistics
  getCompanyStats: async (): Promise<CompanyStats> => {
    const response = await apiClient.get('/api/v1/companies/stats')
    return response.data
  },

  // Export companies (returns file blob)
  exportCompanies: async (filters: CompanyFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `/api/v1/companies/export?${queryString}` : '/api/v1/companies/export'

    const response = await apiClient.get(url, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default companiesAPI