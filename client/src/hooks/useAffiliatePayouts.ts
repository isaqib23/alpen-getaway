import { useState, useEffect, useCallback } from 'react'
import { affiliatePayoutsAPI } from '../api/affiliatePayouts'
import { 
  AffiliatePayout,
  AffiliatePayoutFilters,
  AffiliatePayoutStats,
  PaginatedResponse,
  CreateAffiliatePayoutRequest,
  UpdateAffiliatePayoutRequest,
  ProcessPayoutBatchRequest
} from '../types/api'

export const useAffiliatePayouts = (initialFilters: AffiliatePayoutFilters = {}) => {
  const [data, setData] = useState<PaginatedResponse<AffiliatePayout> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AffiliatePayoutFilters>(initialFilters)

  const fetchPayouts = useCallback(async (fetchFilters?: AffiliatePayoutFilters) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 useAffiliatePayouts.fetchPayouts called with filters:', fetchFilters || filters)
      const result = await affiliatePayoutsAPI.getAll(fetchFilters || filters)
      console.log('✅ useAffiliatePayouts.fetchPayouts result:', result)
      setData(result)
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.fetchPayouts error:', err)
      setError(err.message || 'Failed to fetch affiliate payouts')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<AffiliatePayoutFilters>) => {
    console.log('🔧 useAffiliatePayouts.updateFilters called with:', newFilters)
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchPayouts(updatedFilters)
  }, [filters, fetchPayouts])

  const createPayout = async (data: CreateAffiliatePayoutRequest) => {
    try {
      console.log('➕ useAffiliatePayouts.createPayout called with data:', data)
      const result = await affiliatePayoutsAPI.create(data)
      console.log('✅ useAffiliatePayouts.createPayout result:', result)
      
      // Refresh data after creation
      await fetchPayouts()
      
      return { success: true, data: result }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.createPayout error:', err)
      const error = err.response?.data?.message || err.message || 'Failed to create payout'
      setError(error)
      return { success: false, error }
    }
  }

  const updatePayout = async (id: string, data: UpdateAffiliatePayoutRequest) => {
    try {
      console.log('📝 useAffiliatePayouts.updatePayout called with id:', id, 'data:', data)
      const result = await affiliatePayoutsAPI.update(id, data)
      console.log('✅ useAffiliatePayouts.updatePayout result:', result)
      
      // Refresh data after update
      await fetchPayouts()
      
      return { success: true, data: result }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.updatePayout error:', err)
      const error = err.response?.data?.message || err.message || 'Failed to update payout'
      setError(error)
      return { success: false, error }
    }
  }

  const deletePayout = async (id: string) => {
    try {
      console.log('🗑️ useAffiliatePayouts.deletePayout called with id:', id)
      await affiliatePayoutsAPI.delete(id)
      console.log('✅ useAffiliatePayouts.deletePayout completed')
      
      // Refresh data after deletion
      await fetchPayouts()
      
      return { success: true }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.deletePayout error:', err)
      const error = err.response?.data?.message || err.message || 'Failed to delete payout'
      setError(error)
      return { success: false, error }
    }
  }

  const retryPayout = async (id: string, notes?: string) => {
    try {
      console.log('🔄 useAffiliatePayouts.retryPayout called with id:', id, 'notes:', notes)
      const result = await affiliatePayoutsAPI.retry(id, notes)
      console.log('✅ useAffiliatePayouts.retryPayout result:', result)
      
      // Refresh data after retry
      await fetchPayouts()
      
      return { success: true, data: result }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.retryPayout error:', err)
      const error = err.response?.data?.message || err.message || 'Failed to retry payout'
      setError(error)
      return { success: false, error }
    }
  }

  const cancelPayout = async (id: string, reason: string) => {
    try {
      console.log('❌ useAffiliatePayouts.cancelPayout called with id:', id, 'reason:', reason)
      const result = await affiliatePayoutsAPI.cancel(id, reason)
      console.log('✅ useAffiliatePayouts.cancelPayout result:', result)
      
      // Refresh data after cancellation
      await fetchPayouts()
      
      return { success: true, data: result }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.cancelPayout error:', err)
      const error = err.response?.data?.message || err.message || 'Failed to cancel payout'
      setError(error)
      return { success: false, error }
    }
  }

  const processBatch = async (data: ProcessPayoutBatchRequest) => {
    try {
      console.log('💳 useAffiliatePayouts.processBatch called with data:', data)
      const result = await affiliatePayoutsAPI.processBatch(data)
      console.log('✅ useAffiliatePayouts.processBatch result:', result)
      
      // Refresh data after batch processing
      await fetchPayouts()
      
      return { success: true, data: result }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.processBatch error:', err)
      const error = err.response?.data?.message || err.message || 'Failed to process batch'
      setError(error)
      return { success: false, error }
    }
  }

  const generatePayouts = async (affiliateId?: string) => {
    try {
      console.log('🏭 useAffiliatePayouts.generatePayouts called with affiliateId:', affiliateId)
      const result = await affiliatePayoutsAPI.generatePayouts(affiliateId)
      console.log('✅ useAffiliatePayouts.generatePayouts result:', result)
      
      // Refresh data after generation
      await fetchPayouts()
      
      return { success: true, data: result }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.generatePayouts error:', err)
      const error = err.response?.data?.message || err.message || 'Failed to generate payouts'
      setError(error)
      return { success: false, error }
    }
  }

  const exportReport = async (exportFilters?: AffiliatePayoutFilters) => {
    try {
      console.log('📊 useAffiliatePayouts.exportReport called with filters:', exportFilters)
      const result = await affiliatePayoutsAPI.exportReport(exportFilters || filters)
      
      if (result.success) {
        // Create blob from CSV data
        const blob = new Blob([result.data], { type: 'text/csv' })
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = result.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        return { success: true, totalRecords: result.totalRecords }
      }
      
      return { success: false, error: 'Export failed' }
    } catch (err: any) {
      console.error('❌ useAffiliatePayouts.exportReport error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to export report' }
    }
  }

  // Load initial data
  useEffect(() => {
    fetchPayouts()
  }, [])

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchPayouts,
    createPayout,
    updatePayout,
    deletePayout,
    retryPayout,
    cancelPayout,
    processBatch,
    generatePayouts,
    exportReport,
  }
}

export const useAffiliatePayoutStats = () => {
  const [stats, setStats] = useState<AffiliatePayoutStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📊 useAffiliatePayoutStats.fetchStats called')
      const result = await affiliatePayoutsAPI.getStatistics()
      console.log('✅ useAffiliatePayoutStats.fetchStats result:', result)
      setStats(result)
    } catch (err: any) {
      console.error('❌ useAffiliatePayoutStats.fetchStats error:', err)
      setError(err.message || 'Failed to fetch payout statistics')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

export default useAffiliatePayouts