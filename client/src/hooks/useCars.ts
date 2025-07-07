import { useState, useEffect } from 'react'
import { carsAPI, Car, CreateCarRequest, CarFilters, CarStats } from '../api/cars'
import { useNotification } from '../contexts/NotificationContext'

export const useCars = (filters?: CarFilters) => {
  const [cars, setCars] = useState<Car[]>([])
  const [stats, setStats] = useState<CarStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const { showNotification } = useNotification()

  const fetchCars = async (customFilters?: CarFilters) => {
    setLoading(true)
    setError(null)
    try {
      const filterParams = { ...filters, ...customFilters }
      const response = await carsAPI.getAll(filterParams)
      console.log('Cars API Response:', response) // Debug log
      // Extract data from axios response
      const data = response.data || response || { data: [], total: 0 }
      // @ts-ignore
      setCars(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
      // @ts-ignore
      setTotal(data.total || 0)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch cars'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
      setCars([]) // Ensure cars is always an array
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await carsAPI.getStats()
      // @ts-ignore
      const data = response.data || response
      setStats(data)
    } catch (err: any) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const getCarById = async (id: string): Promise<Car | null> => {
    try {
      const response = await carsAPI.getById(id)
      // @ts-ignore
      return response.data || response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch car'
      showNotification(errorMessage, 'error')
      return null
    }
  }

  const createCar = async (carData: CreateCarRequest): Promise<boolean> => {
    try {
      const response = await carsAPI.create(carData)
      // @ts-ignore
      const newCar = response.data || response
      setCars(prev => [newCar, ...prev])
      showNotification('Car created successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create car'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const updateCar = async (id: string, carData: Partial<CreateCarRequest>): Promise<boolean> => {
    try {
      const response = await carsAPI.update(id, carData)
      // @ts-ignore
      const updatedCar = response.data || response
      setCars(prev => prev.map(car => car.id === id ? updatedCar : car))
      showNotification('Car updated successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update car'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const deleteCar = async (id: string): Promise<boolean> => {
    try {
      await carsAPI.delete(id)
      setCars(prev => prev.filter(car => car.id !== id))
      showNotification('Car deleted successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete car'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const addCarImage = async (carId: string, imageFile: File): Promise<boolean> => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      
      await carsAPI.addImage(carId, formData)
      showNotification('Image added successfully', 'success')
      
      // Refresh the car data to get updated images
      const updatedCar = await getCarById(carId)
      if (updatedCar) {
        setCars(prev => prev.map(car => car.id === carId ? updatedCar : car))
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add image'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const removeCarImage = async (imageId: string, carId: string): Promise<boolean> => {
    try {
      await carsAPI.removeImage(imageId)
      showNotification('Image removed successfully', 'success')
      
      // Refresh the car data to get updated images
      const updatedCar = await getCarById(carId)
      if (updatedCar) {
        setCars(prev => prev.map(car => car.id === carId ? updatedCar : car))
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove image'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  useEffect(() => {
    fetchCars()
    fetchStats()
  }, [])

  return {
    cars,
    stats,
    loading,
    error,
    total,
    fetchCars,
    fetchStats,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    addCarImage,
    removeCarImage
  }
}