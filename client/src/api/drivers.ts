import apiClient from './client'

export interface Driver {
  id: string
  user_id: string
  license_number: string
  license_expiry: string
  date_of_birth: string
  address: string
  city: string
  state: string
  postal_code: string
  emergency_contact_name: string
  emergency_contact_phone: string
  profile_photo_url?: string
  background_check_status: 'pending' | 'approved' | 'rejected'
  medical_clearance: boolean
  training_completed: boolean
  average_rating: string
  total_rides: number
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
  user: {
    id: string
    email: string
    password_hash: string
    phone: string
    first_name: string
    last_name: string
    user_type: string
    status: string
    email_verified: boolean
    phone_verified: boolean
    created_at: string
    updated_at: string
  }
  carAssignments: Array<{
    id: string
    driver_id: string
    car_id: string
    assigned_date: string
    unassigned_date?: string
    is_primary: boolean
    status: string
    car: {
      id: string
      category_id: string
      make: string
      model: string
      year: number
      color: string
      license_plate: string
      vin: string
      seats: number
      has_medical_equipment: boolean
      has_infant_seat: boolean
      has_child_seat: boolean
      has_wheelchair_access: boolean
      has_wifi: boolean
      has_ac: boolean
      has_gps: boolean
      status: string
      last_service_date?: string
      next_service_date?: string
      odometer_reading?: number
      created_at: string
      updated_at: string
    }
  }>
  // Legacy properties for backward compatibility
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  licenseNumber?: string
  licenseExpiry?: string
  backgroundCheck?: 'pending' | 'approved' | 'rejected'
  profileImage?: string
  dateOfBirth?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  languages?: string[]
  experience?: number
  rating?: number
  totalTrips?: number
  earnings?: number
  isAvailable?: boolean
  currentCar?: {
    id: string
    make: string
    model: string
    licensePlate: string
  }
  documentsStatus?: {
    license: 'pending' | 'approved' | 'rejected'
    insurance: 'pending' | 'approved' | 'rejected'
    registration: 'pending' | 'approved' | 'rejected'
    background: 'pending' | 'approved' | 'rejected'
  }
  joinDate?: string
  lastActive?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateDriverRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  licenseNumber: string
  licenseExpiry: string
  status: 'active' | 'inactive' | 'suspended'
  dateOfBirth: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  languages: string[]
  experience: number
}

export interface DriverFilters {
  page?: number
  limit?: number
  status?: string
  backgroundCheck?: string
  search?: string
}

export interface DriverStats {
  total: number
  active: number
  inactive: number
  suspended: number
  available: number
  pendingApproval: number
  avgRating: number
  totalTrips: number
}

export interface AssignCarRequest {
  carId: string
  assignedAt?: string
}

export const driversAPI = {
  // @ts-ignore
  getAll: async (filters?: DriverFilters): Promise<{ data: Driver[], total: number }> => {
    return apiClient.get(`/api/v1/drivers`)
  },

  getById: async (id: string): Promise<Driver> => {
    return apiClient.get(`/api/v1/drivers/${id}`)
  },

  create: async (driverData: CreateDriverRequest): Promise<Driver> => {
    return apiClient.post('/api/v1/drivers', driverData)
  },

  update: async (id: string, driverData: Partial<CreateDriverRequest>): Promise<Driver> => {
    return apiClient.patch(`/api/v1/drivers/${id}`, driverData)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/v1/drivers/${id}`)
  },

  getStats: async (): Promise<DriverStats> => {
    return apiClient.get('/api/v1/drivers/stats')
  },

  // Background check actions
  approveBackgroundCheck: async (id: string): Promise<Driver> => {
    return apiClient.patch(`/api/v1/drivers/${id}/approve-background-check`)
  },

  rejectBackgroundCheck: async (id: string): Promise<Driver> => {
    return apiClient.patch(`/api/v1/drivers/${id}/reject-background-check`)
  },

  // Car assignment
  assignCar: async (driverId: string, assignData: AssignCarRequest): Promise<any> => {
    return apiClient.post(`/api/v1/drivers/${driverId}/assign-car`, assignData)
  },

  unassignCar: async (assignmentId: string): Promise<any> => {
    return apiClient.patch(`/api/v1/drivers/assignments/${assignmentId}/unassign`)
  }
}