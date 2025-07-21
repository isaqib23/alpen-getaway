import apiClient from './client'

export interface CarImage {
  id: string
  car_id: string
  car?: {
    id: string
    make: string
    model: string
    year: number
    license_plate: string
    color: string
    company?: {
      id: string
      company_name: string
    }
  }
  image_url: string
  image_type: 'exterior' | 'interior' | 'features'
  alt_text?: string
  is_primary: boolean
  status: 'pending' | 'approved' | 'rejected'
  file_size: number
  file_name: string
  mime_type: string
  width: number
  height: number
  created_at: string
  updated_at: string
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
  createdAt?: string
  carDetails?: {
    make: string
    model: string
    year: number
    licensePlate: string
  }
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
    return apiClient.get(`/cars/images?${params.toString()}`)
  },

  getById: async (id: string): Promise<CarImage> => {
    return apiClient.get(`/cars/images/${id}`)
  },

  getByCarId: async (carId: string): Promise<CarImage[]> => {
    return apiClient.get(`/cars/${carId}/images`)
  },

  create: async (imageData: CreateCarImageRequest): Promise<CarImage> => {
    const formData = new FormData()
    formData.append('file', imageData.file)
    formData.append('image_type', imageData.image_type)
    formData.append('is_primary', imageData.is_primary.toString())
    if (imageData.alt_text) {
      formData.append('alt_text', imageData.alt_text)
    }

    return apiClient.post(`/cars/${imageData.carId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  update: async (id: string, imageData: UpdateCarImageRequest): Promise<CarImage> => {
    return apiClient.patch(`/cars/images/${id}`, imageData)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/cars/images/${id}`)
  },

  approve: async (id: string): Promise<CarImage> => {
    return apiClient.patch(`/cars/images/${id}/approve`)
  },

  reject: async (id: string, reason?: string): Promise<CarImage> => {
    return apiClient.patch(`/cars/images/${id}/reject`, { reason })
  },


  bulkUpload: async (carId: string, files: File[]): Promise<CarImage[]> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    return apiClient.post(`/cars/${carId}/images/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

}