import { useState, useEffect, useCallback } from 'react'
import { 
  usersAPI, 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserFilters, 
  UsersResponse,
  UserStatsResponse,
  UserType,
  UserStatus
} from '../api/users'
import { useNotification } from '../contexts/NotificationContext'

export interface UseUsersState {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null
  stats: UserStatsResponse | null
  statsLoading: boolean
}

export interface UseUsersActions {
  fetchUsers: (filters?: UserFilters) => Promise<void>
  fetchUserStats: () => Promise<void>
  createUser: (userData: CreateUserRequest) => Promise<User | null>
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<User | null>
  deleteUser: (id: string) => Promise<boolean>
  getUserById: (id: string) => Promise<User | null>
  exportUsers: (filters?: UserFilters) => Promise<void>
  setFilters: (filters: UserFilters) => void
  clearError: () => void
}

export const useUsers = (initialFilters: UserFilters = {}) => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    loading: false,
    error: null,
    stats: null,
    statsLoading: false,
  })

  const [filters, setFilters] = useState<UserFilters>(initialFilters)
  const { showNotification } = useNotification()

  const fetchUsers = useCallback(async (newFilters?: UserFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const queryFilters = newFilters || filters
      const response: UsersResponse = await usersAPI.getUsers(queryFilters)
      
      setState(prev => ({
        ...prev,
        users: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        loading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      showNotification(errorMessage, 'error')
    }
  }, [filters, showNotification])

  const fetchUserStats = useCallback(async () => {
    setState(prev => ({ ...prev, statsLoading: true }))
    
    try {
      const stats = await usersAPI.getUserStats()
      setState(prev => ({
        ...prev,
        stats,
        statsLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user statistics'
      setState(prev => ({ ...prev, statsLoading: false }))
      showNotification(errorMessage, 'error')
    }
  }, [showNotification])

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<User | null> => {
    try {
      const user = await usersAPI.createUser(userData)
      showNotification(`User ${user.first_name} ${user.last_name} created successfully`, 'success')
      
      // Refresh the users list
      await fetchUsers()
      
      return user
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user'
      showNotification(errorMessage, 'error')
      return null
    }
  }, [fetchUsers, showNotification])

  const updateUser = useCallback(async (id: string, userData: UpdateUserRequest): Promise<User | null> => {
    try {
      const user = await usersAPI.updateUser(id, userData)
      showNotification(`User ${user.first_name} ${user.last_name} updated successfully`, 'success')
      
      // Update the user in the current list
      setState(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === id ? user : u)
      }))
      
      return user
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update user'
      showNotification(errorMessage, 'error')
      return null
    }
  }, [showNotification])

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      await usersAPI.deleteUser(id)
      showNotification('User deleted successfully', 'success')
      
      // Remove the user from the current list
      setState(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== id),
        total: prev.total - 1
      }))
      
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user'
      showNotification(errorMessage, 'error')
      return false
    }
  }, [showNotification])

  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    try {
      const user = await usersAPI.getUserById(id)
      return user
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user'
      showNotification(errorMessage, 'error')
      return null
    }
  }, [showNotification])

  const exportUsers = useCallback(async (exportFilters?: UserFilters) => {
    try {
      const queryFilters = exportFilters || filters
      const blob = await usersAPI.exportUsers(queryFilters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `users-export-${timestamp}.csv`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      showNotification('Users exported successfully', 'success')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to export users'
      showNotification(errorMessage, 'error')
    }
  }, [filters, showNotification])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Load initial data
  useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, []) // Only run on mount

  // Refetch when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchUsers()
    }
  }, [filters, fetchUsers])

  const actions: UseUsersActions = {
    fetchUsers,
    fetchUserStats,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    exportUsers,
    setFilters: updateFilters,
    clearError,
  }

  return {
    ...state,
    filters,
    ...actions,
  }
}

// Utility function to get enum options for dropdowns
export const getUserTypeOptions = () => {
  return Object.values(UserType).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
  }))
}

export const getUserStatusOptions = () => {
  return Object.values(UserStatus).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
  }))
}