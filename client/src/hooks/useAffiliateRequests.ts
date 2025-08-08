import { useState, useEffect, useCallback } from 'react'
import { affiliateRequestsAPI } from '../api/affiliateRequests'
import { 
  AffiliateRequest, 
  AffiliateRequestFilters, 
  AffiliateRequestStats,
  PaginatedResponse, 
  CreateAffiliateRequestRequest,
  UpdateAffiliateRequestRequest 
} from '../types/api'

export const useAffiliateRequests = (initialFilters?: AffiliateRequestFilters) => {
  const [data, setData] = useState<PaginatedResponse<AffiliateRequest> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AffiliateRequestFilters>(initialFilters || {})

  const fetchRequests = useCallback(async (currentFilters = filters) => {
    try {
      console.log('📋 useAffiliateRequests.fetchRequests called with filters:', currentFilters)
      setLoading(true)
      setError(null)
      const response = await affiliateRequestsAPI.getAll(currentFilters)
      console.log('✅ useAffiliateRequests.fetchRequests response:', response)
      setData(response)
    } catch (err) {
      console.error('❌ useAffiliateRequests.fetchRequests error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliate requests')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const updateFilters = (newFilters: Partial<AffiliateRequestFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchRequests(updatedFilters)
  }

  const createRequest = async (requestData: CreateAffiliateRequestRequest) => {
    try {
      console.log('➕ useAffiliateRequests.createRequest called with data:', requestData)
      await affiliateRequestsAPI.create(requestData)
      fetchRequests()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateRequests.createRequest error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create affiliate request' }
    }
  }

  const updateRequest = async (id: string, requestData: UpdateAffiliateRequestRequest) => {
    try {
      console.log('📝 useAffiliateRequests.updateRequest called with id:', id, 'data:', requestData)
      await affiliateRequestsAPI.update(id, requestData)
      fetchRequests()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateRequests.updateRequest error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update affiliate request' }
    }
  }

  const approveRequest = async (id: string, notes?: string) => {
    try {
      console.log('✅ useAffiliateRequests.approveRequest called with id:', id, 'notes:', notes)
      await affiliateRequestsAPI.approve(id, notes)
      fetchRequests()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateRequests.approveRequest error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to approve affiliate request' }
    }
  }

  const rejectRequest = async (id: string, rejectionReason: string, notes?: string) => {
    try {
      console.log('❌ useAffiliateRequests.rejectRequest called with id:', id, 'reason:', rejectionReason)
      await affiliateRequestsAPI.reject(id, rejectionReason, notes)
      fetchRequests()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateRequests.rejectRequest error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to reject affiliate request' }
    }
  }

  const deleteRequest = async (id: string) => {
    try {
      console.log('🗑️ useAffiliateRequests.deleteRequest called with id:', id)
      await affiliateRequestsAPI.delete(id)
      fetchRequests()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateRequests.deleteRequest error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete affiliate request' }
    }
  }

  const convertToBooking = async (id: string) => {
    try {
      console.log('🔄 useAffiliateRequests.convertToBooking called with id:', id)
      await affiliateRequestsAPI.convertToBooking(id)
      fetchRequests()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateRequests.convertToBooking error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to convert request to booking' }
    }
  }

  const getStatistics = async () => {
    try {
      console.log('📊 useAffiliateRequests.getStatistics called')
      return await affiliateRequestsAPI.getStatistics()
    } catch (err) {
      console.error('❌ useAffiliateRequests.getStatistics error:', err)
      throw err
    }
  }

  const exportReport = async (exportFilters?: AffiliateRequestFilters) => {
    try {
      console.log('📊 useAffiliateRequests.exportReport called with filters:', exportFilters)
      const blob = await affiliateRequestsAPI.exportReport(exportFilters || filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `affiliate-requests-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateRequests.exportReport error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to export report' }
    }
  }

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchRequests,
    createRequest,
    updateRequest,
    approveRequest,
    rejectRequest,
    deleteRequest,
    convertToBooking,
    getStatistics,
    exportReport,
  }
}

export const useAffiliateRequestStats = () => {
  const [stats, setStats] = useState<AffiliateRequestStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log('📊 useAffiliateRequestStats.fetchStats called')
      setLoading(true)
      setError(null)
      const response = await affiliateRequestsAPI.getStatistics()
      console.log('✅ useAffiliateRequestStats.fetchStats response:', response)
      setStats(response)
    } catch (err) {
      console.error('❌ useAffiliateRequestStats.fetchStats error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliate request statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('📊 useAffiliateRequestStats useEffect triggered')
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}