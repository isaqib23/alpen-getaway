import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

// Create axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface B2BRequest {
  id: string
  requestId: string
  partnerId: string
  partnerName: string
  customerName: string
  fromLocation: string
  toLocation: string
  pickupDateTime: string
  passengerCount: number
  luggageCount: number
  vehiclePreference: string
  specialRequirements: string
  maxBudget: number
  status: 'pending' | 'auction_created' | 'auction_active' | 'auction_won' | 'auction_lost' | 'completed' | 'cancelled'
  submittedAt: string
  auctionId: string | null
  currentBids: number
  winningBid: number | null
  winningPartner: string | null
  businessType: string
  priority: 'low' | 'medium' | 'high'
}

export interface BookingRequestFilters {
  search?: string
  status?: string
  bookingType?: string
  paymentStatus?: string
  customerId?: string
  affiliateId?: string
  fromDate?: string
  toDate?: string
  fromLocation?: string
  toLocation?: string
  context?: 'root' | 'b2b' | 'affiliate' // Add context filter
}

export interface CreateBookingRequest {
  customerId: string
  affiliateId?: string
  fromLocation: string
  fromCountryCode: string
  toLocation: string
  toCountryCode: string
  vehicle: string
  distanceKm: number
  pickupAddress: Record<string, any>
  dropoffAddress: Record<string, any>
  pickupDatetime: string
  passengerCount: number
  luggageCount: number
  specialRequirements?: string
  contactName: string
  contactPhone: string
  contactEmail: string
  bookingType: 'direct' | 'auction' | 'affiliate'
  quotedFare?: number
  currency?: string
  notes?: string
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed'
  finalAmount?: number
}

export const bookingRequestsApi = {
  // Get all booking requests
  getAll: async (filters?: BookingRequestFilters): Promise<B2BRequest[]> => {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })
      }
      
      const response = await api.get(`/admin/booking-requests?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching booking requests:', error)
      throw error
    }
  },

  // Get booking request by ID
  getById: async (id: string): Promise<B2BRequest> => {
    try {
      const response = await api.get(`/admin/booking-requests/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching booking request:', error)
      throw error
    }
  },

  // Create new booking request
  create: async (data: CreateBookingRequest): Promise<B2BRequest> => {
    try {
      const response = await api.post('/admin/booking-requests', data)
      return response.data
    } catch (error) {
      console.error('Error creating booking request:', error)
      throw error
    }
  },

  // Update booking request
  update: async (id: string, data: UpdateBookingRequest): Promise<B2BRequest> => {
    try {
      const response = await api.patch(`/admin/booking-requests/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating booking request:', error)
      throw error
    }
  },

  // Delete booking request
  delete: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/admin/booking-requests/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting booking request:', error)
      throw error
    }
  },

  // Create auction for booking request
  createAuction: async (id: string, maxBidAmount?: number): Promise<any> => {
    try {
      const response = await api.post(`/admin/booking-requests/${id}/create-auction`, {
        maxBidAmount
      })
      return response.data
    } catch (error) {
      console.error('Error creating auction:', error)
      throw error
    }
  },

  // Get statistics
  getStatistics: async (context?: 'root' | 'b2b' | 'affiliate'): Promise<{
    totalRequests: number
    pendingRequests: number
    activeAuctions: number
    successRate: number
  }> => {
    try {
      const params = context ? `?context=${context}` : ''
      const response = await api.get(`/admin/booking-requests/statistics${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching statistics:', error)
      throw error
    }
  }
}