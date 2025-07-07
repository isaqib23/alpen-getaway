import { useState, useEffect } from 'react'
import { driverAssignmentsAPI, DriverAssignment, CreateAssignmentRequest, AssignmentFilters, AssignmentStats } from '../api/driverAssignments'
import { useNotification } from '../contexts/NotificationContext'

export const useDriverAssignments = (filters?: AssignmentFilters) => {
  const [assignments, setAssignments] = useState<DriverAssignment[]>([])
  const [stats, setStats] = useState<AssignmentStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const { showNotification } = useNotification()

  const fetchAssignments = async (customFilters?: AssignmentFilters) => {
    setLoading(true)
    setError(null)
    try {
      const filterParams = { ...filters, ...customFilters }
      const response = await driverAssignmentsAPI.getAll(filterParams)
      setAssignments(response.data)
      setTotal(response.total)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch assignments'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await driverAssignmentsAPI.getStats()
      setStats(data)
    } catch (err: any) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const getAssignmentById = async (id: string): Promise<DriverAssignment | null> => {
    try {
      return await driverAssignmentsAPI.getById(id)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch assignment'
      showNotification(errorMessage, 'error')
      return null
    }
  }

  const createAssignment = async (assignmentData: CreateAssignmentRequest): Promise<boolean> => {
    try {
      const newAssignment = await driverAssignmentsAPI.create(assignmentData)
      setAssignments(prev => [newAssignment, ...prev])
      showNotification('Assignment created successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create assignment'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const updateAssignment = async (id: string, assignmentData: Partial<CreateAssignmentRequest>): Promise<boolean> => {
    try {
      const updatedAssignment = await driverAssignmentsAPI.update(id, assignmentData)
      setAssignments(prev => prev.map(assignment => assignment.id === id ? updatedAssignment : assignment))
      showNotification('Assignment updated successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update assignment'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const deleteAssignment = async (id: string): Promise<boolean> => {
    try {
      await driverAssignmentsAPI.delete(id)
      setAssignments(prev => prev.filter(assignment => assignment.id !== id))
      showNotification('Assignment deleted successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete assignment'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const endAssignment = async (id: string, endDate?: string): Promise<boolean> => {
    try {
      const updatedAssignment = await driverAssignmentsAPI.end(id, endDate)
      setAssignments(prev => prev.map(assignment => assignment.id === id ? updatedAssignment : assignment))
      showNotification('Assignment ended successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to end assignment'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const suspendAssignment = async (id: string, reason?: string): Promise<boolean> => {
    try {
      const updatedAssignment = await driverAssignmentsAPI.suspend(id, reason)
      setAssignments(prev => prev.map(assignment => assignment.id === id ? updatedAssignment : assignment))
      showNotification('Assignment suspended successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to suspend assignment'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const reactivateAssignment = async (id: string): Promise<boolean> => {
    try {
      const updatedAssignment = await driverAssignmentsAPI.reactivate(id)
      setAssignments(prev => prev.map(assignment => assignment.id === id ? updatedAssignment : assignment))
      showNotification('Assignment reactivated successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reactivate assignment'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const getAssignmentsByDriver = async (driverId: string): Promise<DriverAssignment[]> => {
    try {
      return await driverAssignmentsAPI.getByDriver(driverId)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch driver assignments'
      showNotification(errorMessage, 'error')
      return []
    }
  }

  const getAssignmentsByCar = async (carId: string): Promise<DriverAssignment[]> => {
    try {
      return await driverAssignmentsAPI.getByCar(carId)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch car assignments'
      showNotification(errorMessage, 'error')
      return []
    }
  }

  useEffect(() => {
    fetchAssignments()
    fetchStats()
  }, [])

  return {
    assignments,
    stats,
    loading,
    error,
    total,
    fetchAssignments,
    fetchStats,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    endAssignment,
    suspendAssignment,
    reactivateAssignment,
    getAssignmentsByDriver,
    getAssignmentsByCar
  }
}