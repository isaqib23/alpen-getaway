import apiClient from './client'

export interface Driver {
  id: string
  user_id: string
  company_id?: string
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
  }
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
  }
}

export interface DriverFilters {
  page?: number
  limit?: number
  status?: string
  backgroundCheck?: string
  search?: string
  companyId?: string
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
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.backgroundCheck) params.append('backgroundCheck', filters.backgroundCheck)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.companyId) params.append('companyId', filters.companyId)
    
    const queryString = params.toString()
    return apiClient.get(`/drivers${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id: string): Promise<Driver> => {
    return apiClient.get(`/drivers/${id}`)
  },

  create: async (driverData: CreateDriverRequest): Promise<Driver> => {
    // Transform camelCase frontend data to snake_case backend format
    const transformedData = {
      user_id: null, // This will be created by backend
      license_number: driverData.licenseNumber,
      license_expiry: driverData.licenseExpiry,
      date_of_birth: driverData.dateOfBirth,
      address: driverData.address.street,
      city: driverData.address.city,
      state: driverData.address.state,
      postal_code: driverData.address.zipCode,
      emergency_contact_name: driverData.emergencyContact.name,
      emergency_contact_phone: driverData.emergencyContact.phone,
      status: driverData.status,
      background_check_status: 'pending',
      medical_clearance: false,
      training_completed: false,
      // Note: experience and languages fields not supported by backend
      // User data for creation
      user: {
        first_name: driverData.firstName,
        last_name: driverData.lastName,
        email: driverData.email,
        phone: driverData.phoneNumber,
        user_type: 'DRIVER',
        password: 'defaultPassword123!' // This should be changed in real implementation
      }
    }
    return apiClient.post('/drivers', transformedData)
  },

  update: async (id: string, driverData: Partial<CreateDriverRequest>): Promise<Driver> => {
    // Transform camelCase frontend data to snake_case backend format
    const transformedData: any = {}
    
    if (driverData.licenseNumber) transformedData.license_number = driverData.licenseNumber
    if (driverData.licenseExpiry) transformedData.license_expiry = driverData.licenseExpiry
    if (driverData.dateOfBirth) transformedData.date_of_birth = driverData.dateOfBirth
    if (driverData.status) transformedData.status = driverData.status
    
    if (driverData.address) {
      if (driverData.address.street) transformedData.address = driverData.address.street
      if (driverData.address.city) transformedData.city = driverData.address.city
      if (driverData.address.state) transformedData.state = driverData.address.state
      if (driverData.address.zipCode) transformedData.postal_code = driverData.address.zipCode
    }
    
    if (driverData.emergencyContact) {
      if (driverData.emergencyContact.name) transformedData.emergency_contact_name = driverData.emergencyContact.name
      if (driverData.emergencyContact.phone) transformedData.emergency_contact_phone = driverData.emergencyContact.phone
    }
    
    // Note: User updates and experience/languages fields not supported by backend for updates
    // Backend expects only driver-specific fields for updates
    
    return apiClient.patch(`/drivers/${id}`, transformedData)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/drivers/${id}`)
  },

  getStats: async (): Promise<DriverStats> => {
    return apiClient.get('/drivers/stats')
  },

  // Background check actions
  approveBackgroundCheck: async (id: string): Promise<Driver> => {
    return apiClient.patch(`/drivers/${id}/approve-background-check`)
  },

  rejectBackgroundCheck: async (id: string): Promise<Driver> => {
    return apiClient.patch(`/drivers/${id}/reject-background-check`)
  },

  // Car assignment
  assignCar: async (driverId: string, assignData: AssignCarRequest): Promise<any> => {
    return apiClient.post(`/drivers/${driverId}/assign-car`, assignData)
  },

  unassignCar: async (assignmentId: string): Promise<any> => {
    return apiClient.patch(`/drivers/assignments/${assignmentId}/unassign`)
  }
}