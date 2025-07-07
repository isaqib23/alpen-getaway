import { useState, useEffect, useCallback } from 'react'
import { affiliateCommissionsAPI } from '../api/affiliateCommissions'
import { 
  AffiliateCommission, 
  AffiliateCommissionFilters, 
  AffiliateCommissionStats,
  PaginatedResponse, 
  CreateAffiliateCommissionRequest,
  UpdateAffiliateCommissionRequest,
  ProcessPaymentRequest,
  PaymentBatch
} from '../types/api'

export const useAffiliateCommissions = (initialFilters?: AffiliateCommissionFilters) => {
  const [data, setData] = useState<PaginatedResponse<AffiliateCommission> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AffiliateCommissionFilters>(initialFilters || {})

  const fetchCommissions = useCallback(async (currentFilters = filters) => {
    try {
      console.log('💰 useAffiliateCommissions.fetchCommissions called with filters:', currentFilters)
      setLoading(true)
      setError(null)
      const response = await affiliateCommissionsAPI.getAll(currentFilters)
      console.log('✅ useAffiliateCommissions.fetchCommissions response:', response)
      setData(response)
    } catch (err) {
      console.error('❌ useAffiliateCommissions.fetchCommissions error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliate commissions')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCommissions()
  }, [fetchCommissions])

  const updateFilters = (newFilters: Partial<AffiliateCommissionFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchCommissions(updatedFilters)
  }

  const createCommission = async (commissionData: CreateAffiliateCommissionRequest) => {
    try {
      console.log('➕ useAffiliateCommissions.createCommission called with data:', commissionData)
      await affiliateCommissionsAPI.create(commissionData)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.createCommission error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create commission' }
    }
  }

  const updateCommission = async (id: string, commissionData: UpdateAffiliateCommissionRequest) => {
    try {
      console.log('📝 useAffiliateCommissions.updateCommission called with id:', id, 'data:', commissionData)
      await affiliateCommissionsAPI.update(id, commissionData)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.updateCommission error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update commission' }
    }
  }

  const approveCommission = async (id: string, notes?: string) => {
    try {
      console.log('✅ useAffiliateCommissions.approveCommission called with id:', id, 'notes:', notes)
      await affiliateCommissionsAPI.approve(id, notes)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.approveCommission error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to approve commission' }
    }
  }

  const rejectCommission = async (id: string, reason: string, notes?: string) => {
    try {
      console.log('❌ useAffiliateCommissions.rejectCommission called with id:', id, 'reason:', reason)
      await affiliateCommissionsAPI.reject(id, reason, notes)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.rejectCommission error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to reject commission' }
    }
  }

  const deleteCommission = async (id: string) => {
    try {
      console.log('🗑️ useAffiliateCommissions.deleteCommission called with id:', id)
      await affiliateCommissionsAPI.delete(id)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.deleteCommission error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete commission' }
    }
  }

  const processPayment = async (paymentData: ProcessPaymentRequest) => {
    try {
      console.log('💳 useAffiliateCommissions.processPayment called with data:', paymentData)
      const result = await affiliateCommissionsAPI.processPayment(paymentData)
      fetchCommissions()
      return { success: true, data: result }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.processPayment error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to process payment' }
    }
  }

  const processIndividualPayment = async (id: string, notes?: string) => {
    try {
      console.log('💳 useAffiliateCommissions.processIndividualPayment called with id:', id)
      await affiliateCommissionsAPI.processIndividualPayment(id, notes)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.processIndividualPayment error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to process individual payment' }
    }
  }

  const bulkApprove = async (commissionIds: string[]) => {
    try {
      console.log('✅ useAffiliateCommissions.bulkApprove called with ids:', commissionIds)
      await affiliateCommissionsAPI.bulkApprove(commissionIds)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.bulkApprove error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to bulk approve commissions' }
    }
  }

  const bulkReject = async (commissionIds: string[], reason: string) => {
    try {
      console.log('❌ useAffiliateCommissions.bulkReject called with ids:', commissionIds, 'reason:', reason)
      await affiliateCommissionsAPI.bulkReject(commissionIds, reason)
      fetchCommissions()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateCommissions.bulkReject error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to bulk reject commissions' }
    }
  }

  const getStatistics = async () => {
    try {
      console.log('📊 useAffiliateCommissions.getStatistics called')
      return await affiliateCommissionsAPI.getStatistics()
    } catch (err) {
      console.error('❌ useAffiliateCommissions.getStatistics error:', err)
      throw err
    }
  }

  const exportReport = async (exportFilters?: AffiliateCommissionFilters) => {
    try {
      console.log('📊 useAffiliateCommissions.exportReport called with filters:', exportFilters)
      const result = await affiliateCommissionsAPI.exportReport(exportFilters || filters)
      
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
    } catch (err) {
      console.error('❌ useAffiliateCommissions.exportReport error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to export report' }
    }
  }

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchCommissions,
    createCommission,
    updateCommission,
    approveCommission,
    rejectCommission,
    deleteCommission,
    processPayment,
    processIndividualPayment,
    bulkApprove,
    bulkReject,
    getStatistics,
    exportReport,
  }
}

export const useAffiliateCommissionStats = () => {
  const [stats, setStats] = useState<AffiliateCommissionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log('📊 useAffiliateCommissionStats.fetchStats called')
      setLoading(true)
      setError(null)
      const response = await affiliateCommissionsAPI.getStatistics()
      console.log('✅ useAffiliateCommissionStats.fetchStats response:', response)
      setStats(response)
    } catch (err) {
      console.error('❌ useAffiliateCommissionStats.fetchStats error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch commission statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('📊 useAffiliateCommissionStats useEffect triggered')
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

export const usePaymentBatches = () => {
  const [batches, setBatches] = useState<PaymentBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBatches = async () => {
    try {
      console.log('📦 usePaymentBatches.fetchBatches called')
      setLoading(true)
      setError(null)
      const response = await affiliateCommissionsAPI.getPaymentBatches()
      console.log('✅ usePaymentBatches.fetchBatches response:', response)
      setBatches(response)
    } catch (err) {
      console.error('❌ usePaymentBatches.fetchBatches error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch payment batches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  return {
    batches,
    loading,
    error,
    refetch: fetchBatches,
  }
}