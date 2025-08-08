import { useState, useEffect, useCallback } from 'react'
import { 
  Company, 
  CreateCompanyRequest, 
  UpdateCompanyRequest, 
  CompanyFilters, 
  CompanyStats,
  PaginatedResponse 
} from '../types/api'
import { companiesAPI } from '../api/companies'
import { useNotification } from '../contexts/NotificationContext'

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [stats, setStats] = useState<CompanyStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  })
  
  const { showNotification } = useNotification()

  // Fetch companies with filters
  const fetchCompanies = useCallback(async (filters: CompanyFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: PaginatedResponse<Company> = await companiesAPI.getCompanies(filters)
      
      setCompanies(response.data)
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch companies'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  // Fetch company statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await companiesAPI.getCompanyStats()
      setStats(response)
    } catch (err: any) {
      console.error('Failed to fetch company stats:', err)
    }
  }, [])

  // Get single company
  const getCompany = useCallback(async (id: string): Promise<Company | null> => {
    try {
      setLoading(true)
      const response = await companiesAPI.getCompany(id)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch company'
      showNotification(errorMessage, 'error')
      return null
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  // Create company
  const createCompany = useCallback(async (data: CreateCompanyRequest): Promise<boolean> => {
    try {
      setLoading(true)
      await companiesAPI.createCompany(data)
      showNotification('Company created successfully', 'success')
      await fetchCompanies() // Refresh the list
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create company'
      showNotification(errorMessage, 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showNotification, showNotification, fetchCompanies])

  // Update company
  const updateCompany = useCallback(async (id: string, data: UpdateCompanyRequest): Promise<boolean> => {
    try {
      setLoading(true)
      await companiesAPI.updateCompany(id, data)
      showNotification('Company updated successfully', 'success')
      await fetchCompanies() // Refresh the list
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update company'
      showNotification(errorMessage, 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showNotification, showNotification, fetchCompanies])

  // Delete company
  const deleteCompany = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      await companiesAPI.deleteCompany(id)
      showNotification('Company deleted successfully', 'success')
      await fetchCompanies() // Refresh the list
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete company'
      showNotification(errorMessage, 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showNotification, showNotification, fetchCompanies])

  // Approve company
  const approveCompany = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      await companiesAPI.approveCompany(id)
      showNotification('Company approved successfully', 'success')
      await fetchCompanies() // Refresh the list
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to approve company'
      showNotification(errorMessage, 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showNotification, showNotification, fetchCompanies])

  // Reject company
  const rejectCompany = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      await companiesAPI.rejectCompany(id)
      showNotification('Company rejected successfully', 'success')
      await fetchCompanies() // Refresh the list
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reject company'
      showNotification(errorMessage, 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showNotification, showNotification, fetchCompanies])

  // Export companies
  const exportCompanies = useCallback(async (filters: CompanyFilters = {}): Promise<boolean> => {
    try {
      setLoading(true)
      const blob = await companiesAPI.exportCompanies(filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `companies_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      showNotification('Companies exported successfully', 'success')
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to export companies'
      showNotification(errorMessage, 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  // Load initial data
  useEffect(() => {
    fetchCompanies()
    fetchStats()
  }, [fetchCompanies, fetchStats])

  return {
    // Data
    companies,
    stats,
    loading,
    error,
    pagination,
    
    // Actions
    fetchCompanies,
    fetchStats,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    approveCompany,
    rejectCompany,
    exportCompanies,
    
    // Utils
    refresh: () => {
      fetchCompanies()
      fetchStats()
    }
  }
}

export default useCompanies