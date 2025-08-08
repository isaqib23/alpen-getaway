import { useState, useEffect, useCallback } from 'react'
import { vehiclesAPI } from '../api/vehicles'
import { Vehicle, VehicleFilters, PaginatedResponse } from '../types/api'

export const useVehicles = (initialFilters?: VehicleFilters) => {
  const [data, setData] = useState<PaginatedResponse<Vehicle> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters || {})

  const fetchVehicles = useCallback(async (currentFilters = filters) => {
    try {
      console.log('🚗 useVehicles.fetchVehicles called with filters:', currentFilters)
      setLoading(true)
      setError(null)
      const response = await vehiclesAPI.getAll(currentFilters)
      console.log('✅ useVehicles.fetchVehicles response:', response)
      setData(response)
    } catch (err) {
      console.error('❌ useVehicles.fetchVehicles error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const updateFilters = (newFilters: Partial<VehicleFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchVehicles(updatedFilters)
  }

  const createVehicle = async (vehicleData: any) => {
    try {
      await vehiclesAPI.create(vehicleData)
      fetchVehicles()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create vehicle' }
    }
  }

  const updateVehicle = async (id: string, vehicleData: any) => {
    try {
      await vehiclesAPI.update(id, vehicleData)
      fetchVehicles()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update vehicle' }
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      await vehiclesAPI.delete(id)
      fetchVehicles()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete vehicle' }
    }
  }

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  }
}