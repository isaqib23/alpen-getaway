import { useState, useEffect } from 'react'
import { carCategoriesAPI, CarCategory, CreateCarCategoryRequest, CarCategoryStats } from '../api/carCategories'
import { useNotification } from '../contexts/NotificationContext'

export const useCarCategories = () => {
  const [categories, setCategories] = useState<CarCategory[]>([])
  const [stats, setStats] = useState<CarCategoryStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showNotification } = useNotification()

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await carCategoriesAPI.getAll()
      console.log('Categories API Response:', response) // Debug log
      // Extract data from axios response
      // @ts-ignore
      const data = response.data || response || []
      setCategories(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch car categories'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
      setCategories([]) // Ensure categories is always an array
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await carCategoriesAPI.getStats()
      // @ts-ignore
      const data = response.data || response
      setStats(data)
    } catch (err: any) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const getCategoryById = async (id: string): Promise<CarCategory | null> => {
    try {
      const response = await carCategoriesAPI.getById(id)
      // @ts-ignore
      return response.data || response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch category'
      showNotification(errorMessage, 'error')
      return null
    }
  }

  const createCategory = async (categoryData: CreateCarCategoryRequest): Promise<boolean> => {
    try {
      const response = await carCategoriesAPI.create(categoryData)
      // @ts-ignore
      const newCategory = response.data || response
      setCategories(prev => [...prev, newCategory])
      showNotification('Category created successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create category'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<CreateCarCategoryRequest>): Promise<boolean> => {
    try {
      const response = await carCategoriesAPI.update(id, categoryData)
      // @ts-ignore
      const updatedCategory = response.data || response
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat))
      showNotification('Category updated successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update category'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      await carCategoriesAPI.delete(id)
      setCategories(prev => prev.filter(cat => cat.id !== id))
      showNotification('Category deleted successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete category'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchStats()
  }, [])

  return {
    categories,
    stats,
    loading,
    error,
    fetchCategories,
    fetchStats,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  }
}