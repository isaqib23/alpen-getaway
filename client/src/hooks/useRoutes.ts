import { useState, useCallback } from 'react'
import { routesAPI } from '../api/routes'
import { RouteFare, CreateRouteFareRequest, RouteFilters, PaginatedResponse } from '../types/api'

export const useRoutes = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const getRoutes = useCallback(async (filters?: RouteFilters): Promise<PaginatedResponse<RouteFare> | null> => {
    console.log('🔍 useRoutes.getRoutes called with filters:', filters)
    setLoading(true)
    setError(null)
    try {
      const response = await routesAPI.getAll(filters)
      console.log('✅ useRoutes.getRoutes response:', response)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch routes'
      console.error('❌ useRoutes.getRoutes error:', err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getRouteById = useCallback(async (id: string): Promise<RouteFare | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await routesAPI.getById(id)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch route'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createRoute = useCallback(async (routeData: CreateRouteFareRequest): Promise<RouteFare | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await routesAPI.create(routeData)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create route'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRoute = useCallback(async (id: string, routeData: Partial<CreateRouteFareRequest>): Promise<RouteFare | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await routesAPI.update(id, routeData)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update route'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRoute = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await routesAPI.delete(id)
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete route'
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
      const response = await routesAPI.getStatistics()
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch route statistics'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getLocations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await routesAPI.getLocations()
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch locations'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await routesAPI.getVehicles()
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch vehicles'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const searchRoutes = useCallback(async (searchData: { from: string; to: string; vehicle?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await routesAPI.search(searchData)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to search routes'
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
      await routesAPI.bulkUpdateStatus(ids, isActive)
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update route status'
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
    getRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    deleteRoute,
    getStatistics,
    getLocations,
    getVehicles,
    searchRoutes,
    bulkUpdateStatus,
  }
}