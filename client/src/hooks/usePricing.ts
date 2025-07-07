import { useState, useCallback } from 'react'
import { pricingAPI, PricingRule, CreatePricingRuleRequest, PricingFilters, PaginatedResponse } from '../api/pricing'

export const usePricing = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const getPricingRules = useCallback(async (filters?: PricingFilters): Promise<PaginatedResponse<PricingRule> | null> => {
    console.log('🔍 usePricing.getPricingRules called with filters:', filters)
    setLoading(true)
    setError(null)
    try {
      const response = await pricingAPI.getAll(filters)
      console.log('✅ usePricing.getPricingRules response:', response)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch pricing rules'
      console.error('❌ usePricing.getPricingRules error:', err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getPricingRuleById = useCallback(async (id: string): Promise<PricingRule | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await pricingAPI.getById(id)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch pricing rule'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createPricingRule = useCallback(async (ruleData: CreatePricingRuleRequest): Promise<PricingRule | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await pricingAPI.create(ruleData)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create pricing rule'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePricingRule = useCallback(async (id: string, ruleData: Partial<CreatePricingRuleRequest>): Promise<PricingRule | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await pricingAPI.update(id, ruleData)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update pricing rule'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePricingRule = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await pricingAPI.delete(id)
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete pricing rule'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getStatistics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await pricingAPI.getStatistics()
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch pricing statistics'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const simulatePrice = useCallback(async (simulationData: {
    basePrice: number
    distance: number
    time: string
    vehicleType: string
    date: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await pricingAPI.simulate(simulationData)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to simulate pricing'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const bulkUpdateStatus = useCallback(async (ids: string[], isActive: boolean): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await pricingAPI.bulkUpdateStatus(ids, isActive)
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update pricing rule status'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    clearError,
    getPricingRules,
    getPricingRuleById,
    createPricingRule,
    updatePricingRule,
    deletePricingRule,
    getStatistics,
    simulatePrice,
    bulkUpdateStatus,
  }
}