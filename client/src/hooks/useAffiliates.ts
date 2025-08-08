import { useState, useEffect, useCallback } from 'react'
import { affiliatesAPI, AffiliateStats } from '../api/affiliates'
import { Affiliate, AffiliateFilters, PaginatedResponse, CreateAffiliateRequest, UpdateAffiliateRequest } from '../types/api'

export const useAffiliates = (initialFilters?: AffiliateFilters) => {
  const [data, setData] = useState<PaginatedResponse<Affiliate> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AffiliateFilters>(initialFilters || {})

  const fetchAffiliates = useCallback(async (currentFilters = filters) => {
    try {
      console.log('🏢 useAffiliates.fetchAffiliates called with filters:', currentFilters)
      setLoading(true)
      setError(null)
      const response = await affiliatesAPI.getAll(currentFilters)
      console.log('✅ useAffiliates.fetchAffiliates response:', response)
      setData(response)
    } catch (err) {
      console.error('❌ useAffiliates.fetchAffiliates error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliates')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAffiliates()
  }, [fetchAffiliates])

  const updateFilters = (newFilters: Partial<AffiliateFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchAffiliates(updatedFilters)
  }

  const createAffiliate = async (affiliateData: CreateAffiliateRequest) => {
    try {
      console.log('➕ useAffiliates.createAffiliate called with data:', affiliateData)
      await affiliatesAPI.create(affiliateData)
      fetchAffiliates()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliates.createAffiliate error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create affiliate' }
    }
  }

  const updateAffiliate = async (id: string, affiliateData: UpdateAffiliateRequest) => {
    try {
      console.log('📝 useAffiliates.updateAffiliate called with id:', id, 'data:', affiliateData)
      await affiliatesAPI.update(id, affiliateData)
      fetchAffiliates()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliates.updateAffiliate error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update affiliate' }
    }
  }

  const deleteAffiliate = async (id: string) => {
    try {
      console.log('🗑️ useAffiliates.deleteAffiliate called with id:', id)
      await affiliatesAPI.delete(id)
      fetchAffiliates()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliates.deleteAffiliate error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete affiliate' }
    }
  }

  const getStatistics = async () => {
    try {
      console.log('📊 useAffiliates.getStatistics called')
      return await affiliatesAPI.getStatistics()
    } catch (err) {
      console.error('❌ useAffiliates.getStatistics error:', err)
      throw err
    }
  }

  const approveAffiliate = async (id: string) => {
    try {
      console.log('✅ useAffiliates.approveAffiliate called with id:', id)
      await affiliatesAPI.approve(id)
      fetchAffiliates()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliates.approveAffiliate error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to approve affiliate' }
    }
  }

  const suspendAffiliate = async (id: string) => {
    try {
      console.log('🚫 useAffiliates.suspendAffiliate called with id:', id)
      await affiliatesAPI.suspend(id)
      fetchAffiliates()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliates.suspendAffiliate error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to suspend affiliate' }
    }
  }

  const processPayment = async (id: string, amount: number) => {
    try {
      console.log('💰 useAffiliates.processPayment called with id:', id, 'amount:', amount)
      await affiliatesAPI.processPayment(id, amount)
      fetchAffiliates()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliates.processPayment error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to process payment' }
    }
  }

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchAffiliates,
    createAffiliate,
    updateAffiliate,
    deleteAffiliate,
    getStatistics,
    approveAffiliate,
    suspendAffiliate,
    processPayment,
  }
}

export const useAffiliateStats = () => {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log('📊 useAffiliateStats.fetchStats called')
      setLoading(true)
      setError(null)
      const response = await affiliatesAPI.getStatistics()
      console.log('✅ useAffiliateStats.fetchStats response:', response)
      setStats(response)
    } catch (err) {
      console.error('❌ useAffiliateStats.fetchStats error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliate statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('📊 useAffiliateStats useEffect triggered')
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}