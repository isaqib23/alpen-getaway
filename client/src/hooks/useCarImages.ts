import { useState, useEffect } from 'react'
import { carImagesAPI, CarImage, CreateCarImageRequest, UpdateCarImageRequest, CarImageFilters, CarImageStats } from '../api/carImages'
import { carsAPI } from '../api/cars'
import { useNotification } from '../contexts/NotificationContext'

export const useCarImages = (filters?: CarImageFilters) => {
  const [images, setImages] = useState<CarImage[]>([])
  const [stats, setStats] = useState<CarImageStats | null>(null)
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const { showNotification } = useNotification()

  const fetchImages = async (customFilters?: CarImageFilters) => {
    setLoading(true)
    setError(null)
    try {
      const filterParams = { ...filters, ...customFilters }
      const response = await carImagesAPI.getAll(filterParams)
      console.log('Car Images API Response:', response)
      const data = response.data || response || { data: [], total: 0 }
      // @ts-ignore
      setImages(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
      // @ts-ignore
      setTotal(data.total || 0)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch car images'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await carImagesAPI.getStats()
      // @ts-ignore
      const data = response.data || response
      setStats(data)
    } catch (err: any) {
      console.error('Failed to fetch car images stats:', err)
    }
  }

  const fetchCars = async () => {
    try {
      const response = await carsAPI.getAll({ page: 1, limit: 1000 })
      const data = response.data || response || { data: [] }
      // @ts-ignore
      setCars(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('Failed to fetch cars for dropdown:', err)
    }
  }

  const getImageById = async (id: string): Promise<CarImage | null> => {
    try {
      const response = await carImagesAPI.getById(id)
      // @ts-ignore
      return response.data || response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch car image'
      showNotification(errorMessage, 'error')
      return null
    }
  }

  const getImagesByCarId = async (carId: string): Promise<CarImage[]> => {
    try {
      const response = await carImagesAPI.getByCarId(carId)
      // @ts-ignore
      return response.data || response || []
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch car images'
      showNotification(errorMessage, 'error')
      return []
    }
  }

  const createImage = async (imageData: CreateCarImageRequest, onProgress?: (progress: number) => void): Promise<boolean> => {
    try {
      // Simulate upload progress
      if (onProgress) {
        onProgress(0)
        const interval = setInterval(() => {
          let progress = 0
          const progressInterval = setInterval(() => {
            progress += 10
            onProgress(progress)
            if (progress >= 90) {
              clearInterval(progressInterval)
            }
          }, 100)
          clearInterval(interval)
        }, 100)
      }

      const response = await carImagesAPI.create(imageData)
      // @ts-ignore
      const newImage = response.data || response
      setImages(prev => [newImage, ...prev])
      showNotification('Image uploaded successfully', 'success')
      
      if (onProgress) onProgress(100)
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to upload image'
      showNotification(errorMessage, 'error')
      if (onProgress) onProgress(0)
      return false
    }
  }

  const updateImage = async (id: string, imageData: UpdateCarImageRequest): Promise<boolean> => {
    try {
      const response = await carImagesAPI.update(id, imageData)
      // @ts-ignore
      const updatedImage = response.data || response
      setImages(prev => prev.map(image => image.id === id ? updatedImage : image))
      showNotification('Image updated successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update image'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const deleteImage = async (id: string): Promise<boolean> => {
    try {
      await carImagesAPI.delete(id)
      setImages(prev => prev.filter(image => image.id !== id))
      showNotification('Image deleted successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete image'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const approveImage = async (id: string): Promise<boolean> => {
    try {
      const response = await carImagesAPI.approve(id)
      // @ts-ignore
      const updatedImage = response.data || response
      setImages(prev => prev.map(image => image.id === id ? updatedImage : image))
      showNotification('Image approved successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to approve image'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const rejectImage = async (id: string, reason?: string): Promise<boolean> => {
    try {
      const response = await carImagesAPI.reject(id, reason)
      // @ts-ignore
      const updatedImage = response.data || response
      setImages(prev => prev.map(image => image.id === id ? updatedImage : image))
      showNotification('Image rejected successfully', 'success')
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reject image'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  const bulkUpload = async (carId: string, files: File[], onProgress?: (progress: number) => void): Promise<boolean> => {
    try {
      if (onProgress) onProgress(0)
      
      const response = await carImagesAPI.bulkUpload(carId, files)
      // @ts-ignore
      const newImages = response.data || response || []
      
      setImages(prev => [...newImages, ...prev])
      showNotification(`${files.length} images uploaded successfully`, 'success')
      
      if (onProgress) onProgress(100)
      fetchStats() // Refresh stats
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to upload images'
      showNotification(errorMessage, 'error')
      if (onProgress) onProgress(0)
      return false
    }
  }

  const exportImages = async (filters?: CarImageFilters): Promise<boolean> => {
    try {
      const response = await carImagesAPI.export(filters)
      
      // Create blob link and download
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `car-images-${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      showNotification('Export completed successfully', 'success')
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to export images'
      showNotification(errorMessage, 'error')
      return false
    }
  }

  useEffect(() => {
    fetchImages()
    fetchStats()
    fetchCars()
  }, [])

  return {
    images,
    stats,
    cars,
    loading,
    error,
    total,
    fetchImages,
    fetchStats,
    fetchCars,
    getImageById,
    getImagesByCarId,
    createImage,
    updateImage,
    deleteImage,
    approveImage,
    rejectImage,
    bulkUpload,
    exportImages
  }
}