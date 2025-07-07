import apiClient from './client'

export interface CarImage {
  id: string
  car_id: string
  carDetails?: {
    make: string
    model: string
    year: number
    licensePlate: string
  }
  image_url: string
  image_type: 'exterior' | 'interior' | 'features'
  alt_text?: string
  is_primary: boolean
  created_at: string
  // Legacy properties for backward compatibility
  carId?: string
  imageUrl?: string
  imageType?: 'exterior' | 'interior' | 'engine' | 'trunk' | 'dashboard' | 'other' | 'features'
  description?: string
  isPrimary?: boolean
  uploadedAt?: string
  fileSize?: number
  dimensions?: {
    width: number
    height: number
  }
  status?: 'pending' | 'approved' | 'rejected'
  createdAt?: string
  updatedAt?: string
}

export interface CreateCarImageRequest {
  carId: string
  image_type: 'exterior' | 'interior' | 'features'
  alt_text?: string
  is_primary: boolean
  file: File
}

export interface UpdateCarImageRequest {
  image_type?: 'exterior' | 'interior' | 'features'
  alt_text?: string
  is_primary?: boolean
}

export interface CarImageFilters {
  page?: number
  limit?: number
  status?: string
  imageType?: string
  carId?: string
  search?: string
}

export interface CarImageStats {
  total: number
  approved: number
  pending: number
  rejected: number
  totalSize: number
  byType: Record<string, number>
  byCar: Record<string, number>
}

export const carImagesAPI = {
  getAll: async (filters?: CarImageFilters): Promise<{ data: CarImage[], total: number }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    return apiClient.get(`/api/v1/cars?${params.toString()}`)
  },

  getById: async (id: string): Promise<CarImage> => {
    return apiClient.get(`/api/v1/cars/${id}`)
  },

  getByCarId: async (carId: string): Promise<CarImage[]> => {
    return apiClient.get(`/api/v1/cars/${carId}/images`)
  },

  create: async (imageData: CreateCarImageRequest): Promise<CarImage> => {
    const requestData = {
      image_type: imageData.image_type,
      alt_text: imageData.alt_text,
      is_primary: imageData.is_primary,
      image_url: 'https://via.placeholder.com/400x300' // Mock URL for now
    }

    return apiClient.post(`/api/v1/cars/${imageData.carId}/images`, requestData)
  },

  update: async (id: string, imageData: UpdateCarImageRequest): Promise<CarImage> => {
    return apiClient.patch(`/api/v1/cars/images/${id}`, imageData)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/v1/cars/images/${id}`)
  },

  approve: async (id: string): Promise<CarImage> => {
    return apiClient.patch(`/api/v1/cars/images/${id}/approve`)
  },

  reject: async (id: string, reason?: string): Promise<CarImage> => {
    return apiClient.patch(`/api/v1/cars/images/${id}/reject`, { reason })
  },

  getStats: async (): Promise<CarImageStats> => {
    return apiClient.get('/api/v1/cars/stats')
  },

  bulkUpload: async (carId: string, files: File[]): Promise<CarImage[]> => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    return apiClient.post(`/api/v1/cars/${carId}/images/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  export: async (filters?: CarImageFilters): Promise<Blob> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    return apiClient.get(`/api/v1/cars/export?${params.toString()}`, {
      responseType: 'blob'
    })
  }
}