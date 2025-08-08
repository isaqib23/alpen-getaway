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
    // Since backend doesn't have dedicated assignments endpoint, get drivers with their assignments
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    // Get all drivers and extract their assignments
    const response = await apiClient.get(`/drivers?${params.toString()}`)
    const drivers = response.data?.data || []
    
    // Transform driver assignments into assignment format
    const assignments: DriverAssignment[] = []
    drivers.forEach((driver: any) => {
      if (driver.carAssignments && driver.carAssignments.length > 0) {
        driver.carAssignments.forEach((assignment: any) => {
          assignments.push({
            id: assignment.id,
            driverId: driver.id,
            driver: {
              firstName: driver.user?.first_name || '',
              lastName: driver.user?.last_name || '',
              email: driver.user?.email || '',
              phoneNumber: driver.user?.phone || '',
              status: driver.status,
              rating: parseFloat(driver.average_rating || '0'),
              profileImage: driver.profile_photo_url
            },
            carId: assignment.car_id,
            car: {
              make: assignment.car?.make || '',
              model: assignment.car?.model || '',
              year: assignment.car?.year || new Date().getFullYear(),
              licensePlate: assignment.car?.license_plate || '',
              status: assignment.car?.status || 'active',
              category: 'standard' // Default category
            },
            assignmentDate: assignment.assigned_date,
            startDate: assignment.assigned_date,
            endDate: assignment.unassigned_date,
            status: assignment.status === 'active' ? 'active' : assignment.unassigned_date ? 'ended' : 'active',
            assignmentType: assignment.is_primary ? 'permanent' : 'temporary',
            performance: {
              tripsCompleted: driver.total_rides || 0,
              totalEarnings: 0, // Not available in current backend
              averageRating: parseFloat(driver.average_rating || '0'),
              fuelEfficiency: 0 // Not available in current backend
            },
            assignedBy: 'System',
            createdAt: assignment.assigned_date,
            updatedAt: assignment.assigned_date
          })
        })
      }
    })
    
    return { data: assignments, total: assignments.length }
  },

  getById: async (id: string): Promise<DriverAssignment> => {
    // For now, get all assignments and find the specific one
    const response = await driverAssignmentsAPI.getAll()
    const assignment = response.data.find(a => a.id === id)
    if (!assignment) {
      throw new Error('Assignment not found')
    }
    return assignment
  },

  create: async (assignmentData: CreateAssignmentRequest): Promise<DriverAssignment> => {
    // Use the drivers controller to assign car to driver
    const response = await apiClient.post(`/drivers/${assignmentData.driverId}/assign-car`, {
      car_id: assignmentData.carId,
      is_primary: assignmentData.assignmentType === 'permanent'
    })
    return response.data || response
  },

  update: async (_id: string, _assignmentData: Partial<CreateAssignmentRequest>): Promise<DriverAssignment> => {
    // For updates, we would need to unassign and reassign
    // This is a simplified implementation
    throw new Error('Assignment updates not implemented - please end current assignment and create new one')
  },

  delete: async (id: string): Promise<void> => {
    // Use the unassign endpoint
    return apiClient.patch(`/drivers/assignments/${id}/unassign`)
  },

  end: async (id: string, _endDate?: string): Promise<DriverAssignment> => {
    // Same as delete for current implementation
    await driverAssignmentsAPI.delete(id)
    return driverAssignmentsAPI.getById(id)
  },

  suspend: async (_id: string, _reason?: string): Promise<DriverAssignment> => {
    // Not implemented in backend yet
    throw new Error('Assignment suspension not implemented')
  },

  reactivate: async (_id: string): Promise<DriverAssignment> => {
    // Not implemented in backend yet
    throw new Error('Assignment reactivation not implemented')
  },

  getStats: async (): Promise<AssignmentStats> => {
    // Get all assignments and calculate stats
    const response = await driverAssignmentsAPI.getAll()
    const assignments = response.data
    
    const stats: AssignmentStats = {
      total: assignments.length,
      active: assignments.filter(a => a.status === 'active').length,
      ended: assignments.filter(a => a.status === 'ended').length,
      pending: assignments.filter(a => a.status === 'pending').length,
      suspended: assignments.filter(a => a.status === 'suspended').length,
      avgTripsPerAssignment: assignments.length > 0 ? 
        assignments.reduce((sum, a) => sum + a.performance.tripsCompleted, 0) / assignments.length : 0,
      totalEarnings: assignments.reduce((sum, a) => sum + a.performance.totalEarnings, 0)
    }
    
    return stats
  },

  // Get assignments by driver
  getByDriver: async (driverId: string): Promise<DriverAssignment[]> => {
    const response = await driverAssignmentsAPI.getAll({ driverId })
    return response.data.filter(a => a.driverId === driverId)
  },

  // Get assignments by car
  getByCar: async (carId: string): Promise<DriverAssignment[]> => {
    const response = await driverAssignmentsAPI.getAll({ carId })
    return response.data.filter(a => a.carId === carId)
  }
}