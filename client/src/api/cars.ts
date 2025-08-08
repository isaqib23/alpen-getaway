import apiClient from './client'

export interface Car {
  id: string
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  category_id: string
  company_id?: string
  seats: number
  status: 'active' | 'maintenance' | 'inactive'
  has_wifi: boolean
  has_ac: boolean
  has_gps: boolean
  has_wheelchair_access: boolean
  has_child_seat: boolean
  has_infant_seat: boolean
  has_medical_equipment: boolean
  last_service_date: string
  next_service_date: string
  odometer_reading: number
  vin?: string
  category?: {
    id: string
    name: string
    description: string
    base_rate: number
    per_km_rate: number
    per_minute_rate: number
    max_passengers: number
    status: 'active' | 'inactive'
  }
  images?: CarImage[]
  driverAssignments?: DriverAssignment[]
  created_at: string
  updated_at: string
  // Legacy properties for backward compatibility
  licensePlate?: string
  categoryId?: string
  features?: {
    hasWifi: boolean
    hasAC: boolean
    hasGPS: boolean
    hasWheelchairAccess: boolean
    hasChildSeat: boolean
    hasInfantSeat: boolean
    hasMedicalEquipment: boolean
  }
  lastServiceDate?: string
  nextServiceDate?: string
  odometerReading?: number
  createdAt?: string
  updatedAt?: string
}

export interface CarImage {
  id: string
  url: string
  fileName: string
  isMain: boolean
  createdAt: string
}

export interface DriverAssignment {
  id: string
  driverId: string
  carId: string
  assignedAt: string
  unassignedAt?: string
  isActive: boolean
  driver?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export interface CreateCarRequest {
  make: string
  model: string
  year: number
  color?: string
  license_plate: string
  category_id: string
  seats: number
  vin?: string
  has_medical_equipment?: boolean
  has_infant_seat?: boolean
  has_child_seat?: boolean
  has_wheelchair_access?: boolean
  has_wifi?: boolean
  has_ac?: boolean
  has_gps?: boolean
  status?: 'active' | 'maintenance' | 'inactive'
  last_service_date?: string
  next_service_date?: string
  odometer_reading?: number
}

export interface CarFilters {
  page?: number
  limit?: number
  status?: string
  categoryId?: string
  search?: string
}

export interface CarStats {
  byCategory: Record<string, number>
  byStatus: Record<string, number>
}

export const carsAPI = {
  getAll: async (filters?: CarFilters): Promise<{ data: Car[], total: number }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    return apiClient.get(`/cars?${params.toString()}`)
  },

  getById: async (id: string): Promise<Car> => {
    return apiClient.get(`/cars/${id}`)
  },

  create: async (carData: CreateCarRequest): Promise<Car> => {
    return apiClient.post('/cars', carData)
  },

  update: async (id: string, carData: Partial<CreateCarRequest>): Promise<Car> => {
    return apiClient.patch(`/cars/${id}`, carData)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/cars/${id}`)
  },

  getStats: async (): Promise<CarStats> => {
    return apiClient.get('/cars/stats')
  },

  // Car Images
  addImage: async (carId: string, imageData: FormData): Promise<CarImage> => {
    return apiClient.post(`/cars/${carId}/images`, imageData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  removeImage: async (imageId: string): Promise<void> => {
    return apiClient.delete(`/cars/images/${imageId}`)
  }
}