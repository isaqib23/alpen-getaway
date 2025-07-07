import apiClient from './client'

export interface DriverAssignment {
  id: string
  driverId: string
  driver: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    status: 'active' | 'inactive' | 'suspended'
    rating: number
    profileImage?: string
  }
  carId: string
  car: {
    make: string
    model: string
    year: number
    licensePlate: string
    status: 'active' | 'maintenance' | 'inactive'
    category: string
  }
  assignmentDate: string
  startDate: string
  endDate?: string
  status: 'active' | 'ended' | 'pending' | 'suspended'
  assignmentType: 'permanent' | 'temporary' | 'shift_based'
  workSchedule?: {
    startTime: string
    endTime: string
    workDays: string[]
  }
  performance: {
    tripsCompleted: number
    totalEarnings: number
    averageRating: number
    fuelEfficiency: number
  }
  notes?: string
  assignedBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateAssignmentRequest {
  driverId: string
  carId: string
  startDate: string
  endDate?: string
  assignmentType: 'permanent' | 'temporary' | 'shift_based'
  workSchedule?: {
    startTime: string
    endTime: string
    workDays: string[]
  }
  notes?: string
}

export interface AssignmentFilters {
  page?: number
  limit?: number
  status?: string
  assignmentType?: string
  driverId?: string
  carId?: string
  search?: string
}

export interface AssignmentStats {
  total: number
  active: number
  ended: number
  pending: number
  suspended: number
  avgTripsPerAssignment: number
  totalEarnings: number
}

export const driverAssignmentsAPI = {
  getAll: async (filters?: AssignmentFilters): Promise<{ data: DriverAssignment[], total: number }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    return apiClient.get(`/api/v1/driver-assignments?${params.toString()}`)
  },

  getById: async (id: string): Promise<DriverAssignment> => {
    return apiClient.get(`/api/v1/driver-assignments/${id}`)
  },

  create: async (assignmentData: CreateAssignmentRequest): Promise<DriverAssignment> => {
    return apiClient.post('/api/v1/driver-assignments', assignmentData)
  },

  update: async (id: string, assignmentData: Partial<CreateAssignmentRequest>): Promise<DriverAssignment> => {
    return apiClient.patch(`/api/v1/driver-assignments/${id}`, assignmentData)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/v1/driver-assignments/${id}`)
  },

  end: async (id: string, endDate?: string): Promise<DriverAssignment> => {
    return apiClient.patch(`/api/v1/driver-assignments/${id}/end`, { endDate })
  },

  suspend: async (id: string, reason?: string): Promise<DriverAssignment> => {
    return apiClient.patch(`/api/v1/driver-assignments/${id}/suspend`, { reason })
  },

  reactivate: async (id: string): Promise<DriverAssignment> => {
    return apiClient.patch(`/api/v1/driver-assignments/${id}/reactivate`)
  },

  getStats: async (): Promise<AssignmentStats> => {
    return apiClient.get('/api/v1/driver-assignments/stats')
  },

  // Get assignments by driver
  getByDriver: async (driverId: string): Promise<DriverAssignment[]> => {
    return apiClient.get(`/api/v1/drivers/${driverId}/assignments`)
  },

  // Get assignments by car
  getByCar: async (carId: string): Promise<DriverAssignment[]> => {
    return apiClient.get(`/api/v1/cars/${carId}/assignments`)
  }
}