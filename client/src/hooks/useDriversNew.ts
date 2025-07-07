import { useState, useEffect } from 'react'
import { driversAPI, Driver, CreateDriverRequest, DriverFilters, DriverStats, AssignCarRequest } from '../api/drivers'
import { useToast } from './useToast'

export const useDriversNew = (filters?: DriverFilters) => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [stats, setStats] = useState<DriverStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  // @ts-ignore
  const { showToast } = useToast()

  const fetchDrivers = async (customFilters?: DriverFilters) => {
    setLoading(true)
    setError(null)
    try {
      const filterParams = { ...filters, ...customFilters }
      const response = await driversAPI.getAll(filterParams)
      setDrivers(response.data)
      setTotal(response.total)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch drivers'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await driversAPI.getStats()
      setStats(data)
    } catch (err: any) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const getDriverById = async (id: string): Promise<Driver | null> => {
    try {
      return await driversAPI.getById(id)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch driver'
      showToast(errorMessage, 'error')
      return null
    }
  }

  const createDriver = async (driverData: CreateDriverRequest): Promise<boolean> => {
    try {
      const newDriver = await driversAPI.create(driverData)
      setDrivers(prev => [newDriver, ...prev])
      showToast('Driver created successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create driver'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const updateDriver = async (id: string, driverData: Partial<CreateDriverRequest>): Promise<boolean> => {
    try {
      const updatedDriver = await driversAPI.update(id, driverData)
      setDrivers(prev => prev.map(driver => driver.id === id ? updatedDriver : driver))
      showToast('Driver updated successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update driver'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const deleteDriver = async (id: string): Promise<boolean> => {
    try {
      await driversAPI.delete(id)
      setDrivers(prev => prev.filter(driver => driver.id !== id))
      showToast('Driver deleted successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete driver'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const approveBackgroundCheck = async (id: string): Promise<boolean> => {
    try {
      const updatedDriver = await driversAPI.approveBackgroundCheck(id)
      setDrivers(prev => prev.map(driver => driver.id === id ? updatedDriver : driver))
      showToast('Background check approved', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to approve background check'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const rejectBackgroundCheck = async (id: string): Promise<boolean> => {
    try {
      const updatedDriver = await driversAPI.rejectBackgroundCheck(id)
      setDrivers(prev => prev.map(driver => driver.id === id ? updatedDriver : driver))
      showToast('Background check rejected', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reject background check'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const assignCar = async (driverId: string, assignData: AssignCarRequest): Promise<boolean> => {
    try {
      await driversAPI.assignCar(driverId, assignData)
      showToast('Car assigned successfully', 'success')
      
      // Refresh the driver data
      const updatedDriver = await getDriverById(driverId)
      if (updatedDriver) {
        setDrivers(prev => prev.map(driver => driver.id === driverId ? updatedDriver : driver))
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to assign car'
      showToast(errorMessage, 'error')
      return false
    }
  }

  const unassignCar = async (assignmentId: string, driverId: string): Promise<boolean> => {
    try {
      await driversAPI.unassignCar(assignmentId)
      showToast('Car unassigned successfully', 'success')
      
      // Refresh the driver data
      const updatedDriver = await getDriverById(driverId)
      if (updatedDriver) {
        setDrivers(prev => prev.map(driver => driver.id === driverId ? updatedDriver : driver))
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to unassign car'
      showToast(errorMessage, 'error')
      return false
    }
  }

  useEffect(() => {
    fetchDrivers()
    fetchStats()
  }, [])

  return {
    drivers,
    stats,
    loading,
    error,
    total,
    fetchDrivers,
    fetchStats,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    approveBackgroundCheck,
    rejectBackgroundCheck,
    assignCar,
    unassignCar
  }
}