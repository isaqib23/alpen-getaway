import { useState, useEffect, useCallback } from 'react'
// @ts-ignore
import { driversAPI, Driver, CreateDriverRequest, DriverFilters, DriverStats } from '../api/drivers'

interface DriverResponse {
  data: Driver[]
  total: number
  page: number
  limit: number
}

export const useDrivers = (initialFilters: DriverFilters = {}) => {

  const [data, setData] = useState<DriverResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<DriverFilters>(initialFilters)

  const fetchDrivers = useCallback(async (fetchFilters: DriverFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await driversAPI.getAll(fetchFilters)
      // @ts-ignore
      setData(response)
    } catch (err: any) {
      console.error('Failed to fetch drivers:', err)
      setError(err.message || 'Failed to fetch drivers')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFilters = useCallback((newFilters: Partial<DriverFilters>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters }
      fetchDrivers(updatedFilters)
      return updatedFilters
    })
  }, [fetchDrivers])

  const createDriver = useCallback(async (driverData: CreateDriverRequest) => {
    try {
      const response = await driversAPI.create(driverData)
      if (response) {
        // Refresh the list after creating
        await fetchDrivers(filters)
        return { success: true, data: response }
      }
      return { success: false, error: 'Failed to create driver' }
    } catch (err: any) {
      console.error('Failed to create driver:', err)
      return { success: false, error: err.message || 'Failed to create driver' }
    }
  }, [filters, fetchDrivers])

  const updateDriver = useCallback(async (id: string, driverData: Partial<CreateDriverRequest>) => {
    try {
      const response = await driversAPI.update(id, driverData)
      if (response) {
        // Refresh the list after updating
        await fetchDrivers(filters)
        return { success: true, data: response }
      }
      return { success: false, error: 'Failed to update driver' }
    } catch (err: any) {
      console.error('Failed to update driver:', err)
      return { success: false, error: err.message || 'Failed to update driver' }
    }
  }, [filters, fetchDrivers])

  const deleteDriver = useCallback(async (id: string) => {
    try {
      await driversAPI.delete(id)
      // Refresh the list after deleting
      await fetchDrivers(filters)
      return { success: true }
    } catch (err: any) {
      console.error('Failed to delete driver:', err)
      return { success: false, error: err.message || 'Failed to delete driver' }
    }
  }, [filters, fetchDrivers])

  const approveBackgroundCheck = useCallback(async (id: string) => {
    try {
      await driversAPI.approveBackgroundCheck(id)
      // Refresh the list after approving
      await fetchDrivers(filters)
      return { success: true }
    } catch (err: any) {
      console.error('Failed to approve background check:', err)
      return { success: false, error: err.message || 'Failed to approve background check' }
    }
  }, [filters, fetchDrivers])

  const rejectBackgroundCheck = useCallback(async (id: string) => {
    try {
      await driversAPI.rejectBackgroundCheck(id)
      // Refresh the list after rejecting
      await fetchDrivers(filters)
      return { success: true }
    } catch (err: any) {
      console.error('Failed to reject background check:', err)
      return { success: false, error: err.message || 'Failed to reject background check' }
    }
  }, [filters, fetchDrivers])

  const refetch = useCallback(() => {
    fetchDrivers(filters)
  }, [filters, fetchDrivers])

  // Removed initial fetch - let the component control when to fetch

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    createDriver,
    updateDriver,
    deleteDriver,
    approveBackgroundCheck,
    rejectBackgroundCheck,
    refetch,
  }
}

export interface DriverStats {
  byStatus: {
    inactive: number
    active: number
  }
  byBackgroundCheck: {
    pending: number
    approved: number
  }
  averageRating: string
  // Legacy properties for backward compatibility
  total?: number
  active?: number
  available?: number
  busy?: number
  offline?: number
}

export const useDriverStats = () => {
  const [stats, setStats] = useState<DriverStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await driversAPI.getStats()
      setStats(response || { 
        byStatus: { inactive: 0, active: 0 }, 
        byBackgroundCheck: { pending: 0, approved: 0 }, 
        averageRating: "0" 
      })
    } catch (err: any) {
      console.error('Failed to fetch driver statistics:', err)
      setError(err.message || 'Failed to fetch driver statistics')
      setStats({
        // @ts-ignore
        byStatus: { inactive: 0, active: 0 }, 
        byBackgroundCheck: { pending: 0, approved: 0 }, 
        averageRating: "0" 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}