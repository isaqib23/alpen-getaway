import { apiClient } from './client'

export interface Booking {
  id: string
  booking_reference: string
  user_id: string
  company_id?: string
  route_fare_id: string
  assigned_car_id?: string
  assigned_driver_id?: string
  
  // Passenger details
  passenger_name: string
  passenger_phone: string
  passenger_email?: string
  passenger_count: number
  
  // Special requirements
  needs_infant_seat: boolean
  needs_child_seat: boolean
  needs_wheelchair_access: boolean
  needs_medical_equipment: boolean
  special_instructions?: string
  
  // Booking details
  pickup_datetime: string
  pickup_address: string
  dropoff_address: string
  
  // Pricing
  fare_used: FareType
  base_amount: string | number
  discount_amount: string | number
  coupon_id?: string
  tax_amount: string | number
  total_amount: string | number
  
  // Status tracking
  booking_status: BookingStatus
  payment_status: PaymentStatus
  
  // Tracking
  actual_pickup_time?: string
  actual_dropoff_time?: string
  actual_distance_km?: number
  
  created_at: string
  updated_at: string
  
  // Relations (populated when needed)
  user?: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
    user_type: string
  }
  company?: {
    id: string
    name: string
    type: string
  }
  route_fare?: {
    id: string
    from_location: string
    to_location: string
    vehicle_type: string
    sale_fare: number
    business_fare: number
    distance_km: number
  }
  assigned_car?: {
    id: string
    make: string
    model: string
    year: number
    license_plate: string
    color: string
  }
  assigned_driver?: {
    id: string
    first_name: string
    last_name: string
    phone: string
    email: string
    license_number: string
    rating: number
  }
  coupon?: {
    id: string
    code: string
    discount_type: string
    discount_value: number
  }
  review?: {
    id: string
    rating: number
    comment: string
    created_at: string
  }
}

export interface CreateBookingRequest {
  user_id: string
  company_id?: string
  route_fare_id: string
  passenger_name: string
  passenger_phone: string
  passenger_email?: string
  passenger_count: number
  pickup_datetime: string
  pickup_address: string
  dropoff_address: string
  needs_infant_seat?: boolean
  needs_child_seat?: boolean
  needs_wheelchair_access?: boolean
  needs_medical_equipment?: boolean
  special_instructions?: string
  fare_used: FareType
  base_amount: number
  discount_amount?: number
  coupon_id?: string
  tax_amount?: number
  total_amount: number
}

export interface CreateBookingByEmailRequest {
  customer_email: string
  customer_name: string
  customer_phone: string
  company_id?: string
  route_fare_id: string
  passenger_name: string
  passenger_phone: string
  passenger_email?: string
  passenger_count: number
  pickup_datetime: string
  pickup_address: string
  dropoff_address: string
  needs_infant_seat?: boolean
  needs_child_seat?: boolean
  needs_wheelchair_access?: boolean
  needs_medical_equipment?: boolean
  special_instructions?: string
  fare_used?: FareType
  base_amount: number
  discount_amount?: number
  coupon_id?: string
  tax_amount?: number
  total_amount: number
  car_id?: string
  driver_id?: string
  status?: string
}

export interface UpdateBookingRequest {
  passenger_name?: string
  passenger_phone?: string
  passenger_email?: string
  passenger_count?: number
  pickup_datetime?: string
  pickup_address?: string
  dropoff_address?: string
  needs_infant_seat?: boolean
  needs_child_seat?: boolean
  needs_wheelchair_access?: boolean
  needs_medical_equipment?: boolean
  special_instructions?: string
  base_amount?: number
  discount_amount?: number
  tax_amount?: number
  total_amount?: number
  booking_status?: BookingStatus
  payment_status?: PaymentStatus
}

export interface AssignDriverCarRequest {
  driver_id: string
  car_id: string
}

export interface BookingsResponse {
  data: Booking[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BookingStatsResponse {
  byStatus: {
    cancelled: number
    confirmed: number
    completed: number
    in_progress: number
    assigned: number
    pending?: number
    in_auction?: number
    auction_awarded?: number
  }
  byPaymentStatus: {
    refunded: number
    paid: number
    pending: number
    failed?: number
  }
  revenue: {
    total: string
    average: string
    totalBookings: number
  }
  monthlyTrends: Array<{
    month: string
    bookings: number
    revenue: string
  }>
  topRoutes: Array<{
    route: string
    bookings: number
    revenue: string
  }>
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ASSIGNED = 'assigned',
  IN_AUCTION = 'in_auction',
  AUCTION_AWARDED = 'auction_awarded',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum FareType {
  SALE_FARE = 'sale_fare',
  BUSINESS_FARE = 'business_fare',
}

export interface BookingFilters {
  page?: number
  limit?: number
  booking_status?: BookingStatus | string
  payment_status?: PaymentStatus | string
  user_type?: string
  company_id?: string
  driver_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

class BookingsAPI {
  private readonly basePath = '/bookings'

  async getBookings(filters: BookingFilters = {}): Promise<BookingsResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.booking_status) params.append('booking_status', filters.booking_status)
    if (filters.payment_status) params.append('payment_status', filters.payment_status)
    if (filters.user_type) params.append('user_type', filters.user_type)
    if (filters.company_id) params.append('company_id', filters.company_id)
    if (filters.driver_id) params.append('driver_id', filters.driver_id)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath
    
    const response = await apiClient.get(url)
    return response.data
  }

  async getBookingById(id: string): Promise<Booking> {
    const response = await apiClient.get(`${this.basePath}/${id}`)
    return response.data
  }

  async getBookingByReference(reference: string): Promise<Booking> {
    const response = await apiClient.get(`${this.basePath}/reference/${reference}`)
    return response.data
  }

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const response = await apiClient.post(this.basePath, bookingData)
    return response.data
  }

  async createBookingByEmail(bookingData: CreateBookingByEmailRequest): Promise<Booking> {
    const response = await apiClient.post(`${this.basePath}/by-email`, bookingData)
    return response.data
  }

  async updateBooking(id: string, bookingData: UpdateBookingRequest): Promise<Booking> {
    const response = await apiClient.patch(`${this.basePath}/${id}`, bookingData)
    return response.data
  }

  async deleteBooking(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }

  async getBookingStats(): Promise<BookingStatsResponse> {
    const response = await apiClient.get(`${this.basePath}/stats`)
    return response.data
  }

  async getUpcomingBookings(hours: number = 24): Promise<Booking[]> {
    const response = await apiClient.get(`${this.basePath}/upcoming?hours=${hours}`)
    return response.data
  }

  async getBookingsByUser(userId: string, page: number = 1, limit: number = 10): Promise<BookingsResponse> {
    const response = await apiClient.get(`${this.basePath}/user/${userId}?page=${page}&limit=${limit}`)
    return response.data
  }

  async getBookingsByDriver(driverId: string, page: number = 1, limit: number = 10): Promise<BookingsResponse> {
    const response = await apiClient.get(`${this.basePath}/driver/${driverId}?page=${page}&limit=${limit}`)
    return response.data
  }

  async getBookingsByCompany(companyId: string, page: number = 1, limit: number = 10): Promise<BookingsResponse> {
    const response = await apiClient.get(`${this.basePath}/company/${companyId}?page=${page}&limit=${limit}`)
    return response.data
  }

  // Status management actions
  async assignDriverAndCar(id: string, assignData: AssignDriverCarRequest): Promise<Booking> {
    const response = await apiClient.patch(`${this.basePath}/${id}/assign`, assignData)
    return response.data
  }

  async confirmBooking(id: string): Promise<Booking> {
    const response = await apiClient.patch(`${this.basePath}/${id}/confirm`)
    return response.data
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const response = await apiClient.patch(`${this.basePath}/${id}/cancel`, { reason })
    return response.data
  }

  async startTrip(id: string): Promise<Booking> {
    const response = await apiClient.patch(`${this.basePath}/${id}/start`)
    return response.data
  }

  async completeTrip(id: string, actualDistanceKm?: number): Promise<Booking> {
    const response = await apiClient.patch(`${this.basePath}/${id}/complete`, { 
      actual_distance_km: actualDistanceKm 
    })
    return response.data
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Booking> {
    const response = await apiClient.patch(`${this.basePath}/${id}/payment-status`, { 
      payment_status: paymentStatus 
    })
    return response.data
  }

  async exportBookings(filters: BookingFilters = {}): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (filters.booking_status) params.append('booking_status', filters.booking_status)
    if (filters.payment_status) params.append('payment_status', filters.payment_status)
    if (filters.user_type) params.append('user_type', filters.user_type)
    if (filters.company_id) params.append('company_id', filters.company_id)
    if (filters.driver_id) params.append('driver_id', filters.driver_id)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}/export?${queryString}` : `${this.basePath}/export`
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    })
    
    return response.data
  }
}

export const bookingsAPI = new BookingsAPI()