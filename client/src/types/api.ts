// Common API response types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success?: boolean
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Authentication types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    user_type: string
  }
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  status: string
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// Dashboard types
export interface DashboardStats {
  vehicles: {
    total: number
    active: number
    maintenance: number
    inactive: number
    utilizationRate: number
  }
  drivers: {
    total: number
    active: number
    available: number
    busy: number
    averageRating: number
  }
  bookings: {
    total: number
    pending: number
    completed: number
    cancelled: number
    today: number
    completionRate: number
  }
  payments: {
    total: number
    completed: number
    pending: number
    pendingAmount: number
    totalRevenue: number
    successRate: number
  }
  summary: {
    totalVehicles: number
    totalDrivers: number
    totalBookings: number
    totalRevenue: number
    activeDrivers: number
    completedBookings: number
  }
  partners: {
    total: number
    active: number
  }
  affiliates: {
    total: number
    active: number
  }
  recentBookings: Array<{
    route: string
    vehicle: string
    customer: string
    amount: number
    status: string
  }>
}

// Vehicle enums
export enum VehicleCategory {
  ECONOMY = 'economy',
  BUSINESS = 'business',
  VIP = 'vip'
}

export enum VehicleStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive'
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric'
}

// B2B Partner types
export interface B2BPartner {
  id: string
  name: string
  email: string
}

// Vehicle types
export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  category: VehicleCategory
  status: VehicleStatus
  licensePlate: string
  fuelType: FuelType
  seats: number
  color: string
  mileage: number
  dailyRate: number
  registrationExpiry?: string
  assignedDriverId?: string
  partnerId?: string
  assignedDriver?: Driver
  images?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateVehicleRequest {
  make: string
  model: string
  year: number
  category: VehicleCategory
  licensePlate: string
  fuelType: FuelType
  seats: number
  color: string
  dailyRate: number
  registrationExpiry?: string
  assignedDriverId?: string
  partnerId?: string
  status?: VehicleStatus
  mileage?: number
  notes?: string
  images?: string[]
}

// Driver enums
export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

export enum BackgroundCheckStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Driver types
export interface Driver {
  id: string
  userId: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  licenseNumber: string
  licenseExpiryDate: string
  licenseCountry: string
  status: DriverStatus
  availabilityStatus: AvailabilityStatus
  backgroundCheckStatus: BackgroundCheckStatus
  ratingAverage: number
  totalTrips: number
  totalEarnings: number
  assignedVehicles?: Vehicle[]
  partnerId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDriverRequest {
  email: string
  firstName: string
  lastName: string
  phone?: string
  licenseNumber: string
  licenseExpiryDate: string
  licenseCountry: string
  assignedVehicleId?: string
  partnerId?: string
}

export interface UpdateDriverRequest {
  firstName?: string
  lastName?: string
  phone?: string
  licenseNumber?: string
  licenseExpiryDate?: string
  licenseCountry?: string
  assignedVehicleId?: string
  partnerId?: string
  status?: DriverStatus
  availabilityStatus?: AvailabilityStatus
  backgroundCheckStatus?: BackgroundCheckStatus
}

// Route types
export interface RouteFare {
  id: string
  from_location: string
  from_country_code: string
  to_location: string
  to_country_code: string
  distance_km: number
  vehicle: string
  min_fare: string | number  // Server returns as string, display as number
  original_fare: string | number
  sale_fare: string | number
  currency: string
  is_active: boolean
  effective_from: string
  effective_until: string | null
  created_at: string
  updated_at: string
}

export interface CreateRouteFareRequest {
  from_location: string
  from_country_code: string
  to_location: string
  to_country_code: string
  distance_km: number
  vehicle: string
  min_fare: number
  original_fare: number
  sale_fare: number
  currency?: string
  is_active?: boolean
  effective_from?: Date | string
  effective_until?: Date | string
}

// Filter types
export interface VehicleFilters {
  status?: VehicleStatus
  category?: VehicleCategory
  make?: string
  search?: string
  partnerId?: string
  limit?: number
  offset?: number
}

export interface DriverFilters {
  status?: string
  availabilityStatus?: string
  backgroundCheckStatus?: string
  search?: string
  partnerId?: string
  limit?: number
  offset?: number
}

export interface RouteFilters {
  from_location?: string
  to_location?: string
  vehicle?: string
  is_active?: boolean
  search?: string
  page?: number
  limit?: number
}

// Affiliate types
export enum CommissionType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe'
}

export enum AffiliateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface Affiliate {
  id: string
  userId?: string
  companyName: string
  companyEmail: string
  companyContact: string
  registrationCountry: string
  companyRepresentative: string
  referralCode: string
  commissionType: CommissionType
  commissionRate: number
  minimumPayout: number
  paymentMethod: PaymentMethod
  paymentDetails?: Record<string, any>
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  status: AffiliateStatus
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
  }
  referrals: any[]
  createdAt: string
  updatedAt: string
}

export interface CreateAffiliateRequest {
  companyName: string
  companyEmail: string
  companyContact: string
  registrationCountry: string
  companyRepresentative: string
  referralCode: string
  commissionType: CommissionType
  commissionRate: number
  minimumPayout?: number
  paymentMethod: PaymentMethod
  paymentDetails?: Record<string, any>
  userId?: string
}

export interface UpdateAffiliateRequest {
  companyName?: string
  companyEmail?: string
  companyContact?: string
  registrationCountry?: string
  companyRepresentative?: string
  referralCode?: string
  commissionType?: CommissionType
  commissionRate?: number
  minimumPayout?: number
  paymentMethod?: PaymentMethod
  paymentDetails?: Record<string, any>
  status?: AffiliateStatus
}

export interface AffiliateFilters {
  status?: string
  commissionType?: string
  paymentMethod?: string
  search?: string
  limit?: number
  offset?: number
}

export interface AffiliateReferral {
  id: string
  affiliateId: string
  referredUserId: string
  referralSource?: string
  conversionDate?: string
  totalBookings: number
  totalRevenueGenerated: number
  status: 'pending' | 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  // Relations
  affiliate?: Affiliate
  referredUser?: User
}

// Booking-related types for affiliate bookings
export enum BookingType {
  DIRECT = 'direct',
  AUCTION = 'auction',
  AFFILIATE = 'affiliate'
}

export enum BookingRequestStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export interface BookingRequest {
  id: string
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
  bookingType: BookingType
  status: BookingRequestStatus
  quotedFare?: number
  finalAmount?: number
  currency: string
  paymentStatus: PaymentStatus
  notes?: string
  createdAt: string
  updatedAt: string
  // Relations
  customer?: User
  affiliate?: Affiliate
}

export interface AffiliateBooking {
  id: string
  bookingId: string
  affiliateId: string
  affiliateName: string
  affiliateReferralCode: string
  customerName: string
  customerEmail: string
  route: string
  vehicle: string
  pickupDateTime: string
  passengerCount: number
  totalAmount: number
  affiliateCommission: number
  commissionRate: number
  status: BookingRequestStatus
  paymentStatus: PaymentStatus
  createdAt: string
  bookingType: BookingType
  // Relations
  bookingRequest?: BookingRequest
  affiliate?: Affiliate
}

export interface AffiliateBookingFilters {
  search?: string
  status?: BookingRequestStatus | ''
  paymentStatus?: PaymentStatus | ''
  affiliateId?: string | ''
  dateRange?: 'today' | 'week' | 'month' | 'quarter' | ''
  page?: number
  limit?: number
}

export interface AffiliateBookingStats {
  totalBookings: number
  totalRevenue: number
  totalCommission: number
  completionRate: number
  avgCommissionRate: number
  pendingPayments: number
}

// Booking filters and requests
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
  luggageCount?: number
  specialRequirements?: string
  contactName: string
  contactPhone: string
  contactEmail: string
  bookingType: BookingType
  quotedFare?: number
  notes?: string
}

export interface UpdateBookingRequest {
  status?: BookingRequestStatus
  finalAmount?: number
  paymentStatus?: PaymentStatus
  notes?: string
  specialRequirements?: string
}

// Affiliate Request types
export enum AffiliateRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface AffiliateRequest {
  id: string
  requestId: string
  affiliateId: string
  affiliateName: string
  affiliateReferralCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  fromLocation: string
  fromCountryCode: string
  toLocation: string
  toCountryCode: string
  pickupDateTime: string
  passengerCount: number
  luggageCount: number
  vehiclePreference: string
  specialRequirements?: string
  estimatedFare: number
  maxBudget: number
  status: AffiliateRequestStatus
  submittedAt: string
  processedAt?: string
  processedBy?: string
  rejectionReason?: string
  notes?: string
  // Relations
  affiliate?: Affiliate
  customer?: User
}

export interface AffiliateRequestFilters {
  search?: string
  status?: AffiliateRequestStatus | ''
  affiliateId?: string | ''
  dateRange?: 'today' | 'week' | 'month' | 'quarter' | ''
  page?: number
  limit?: number
}

export interface AffiliateRequestStats {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  expiredRequests: number
  approvalRate: number
  avgProcessingTime: number
}

export interface CreateAffiliateRequestRequest {
  affiliateId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  fromLocation: string
  fromCountryCode: string
  toLocation: string
  toCountryCode: string
  pickupDateTime: string
  passengerCount: number
  luggageCount?: number
  vehiclePreference: string
  specialRequirements?: string
  estimatedFare: number
  maxBudget: number
  notes?: string
}

export interface UpdateAffiliateRequestRequest {
  status?: AffiliateRequestStatus
  processedBy?: string
  rejectionReason?: string
  notes?: string
  estimatedFare?: number
  maxBudget?: number
}

// Affiliate Commission types
export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum TransactionType {
  COMMISSION = 'commission',
  BONUS = 'bonus',
  PENALTY = 'penalty',
  REFUND = 'refund'
}

export interface AffiliateCommission {
  id: string
  bookingId: string
  affiliateId: string
  affiliateName: string
  affiliateReferralCode: string
  customerName: string
  baseAmount: number
  commissionRate: number
  commissionAmount: number
  status: CommissionStatus
  transactionType: TransactionType
  description: string
  bookingDate: string
  earnedDate: string
  paidDate?: string
  paymentBatchId?: string
  route?: string
  vehicle?: string
  createdAt: string
  updatedAt: string
  // Relations
  affiliate?: Affiliate
  booking?: BookingRequest
}

export interface AffiliateCommissionFilters {
  search?: string
  status?: CommissionStatus | ''
  transactionType?: TransactionType | ''
  affiliateId?: string | ''
  dateRange?: 'today' | 'week' | 'month' | 'quarter' | ''
  minAmount?: number
  maxAmount?: number
  page?: number
  limit?: number
}

export interface AffiliateCommissionStats {
  totalCommissions: number
  totalAmount: number
  pendingAmount: number
  approvedAmount: number
  paidAmount: number
  cancelledAmount: number
  averageCommission: number
  totalTransactions: number
}

export interface CreateAffiliateCommissionRequest {
  bookingId: string
  affiliateId: string
  baseAmount: number
  commissionRate: number
  commissionAmount: number
  transactionType: TransactionType
  description: string
  earnedDate: string
}

export interface UpdateAffiliateCommissionRequest {
  status?: CommissionStatus
  commissionAmount?: number
  description?: string
  paymentBatchId?: string
  paidDate?: string
}

// ===== AFFILIATE PAYOUTS =====

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface AffiliatePayout {
  id: string
  batchId: string
  affiliateId: string
  affiliateName: string
  affiliateEmail: string
  totalAmount: number
  commissionCount: number
  paymentMethod: PaymentMethod
  paymentDetails: string
  status: PayoutStatus
  scheduledDate: string
  processedDate?: string
  failureReason?: string
  transactionId?: string
  fees: number
  netAmount: number
  currency: string
  notes?: string
  createdAt: string
  updatedAt: string
  // Relations
  affiliate?: Affiliate
  commissions?: AffiliateCommission[]
}

export interface AffiliatePayoutFilters {
  search?: string
  status?: PayoutStatus | ''
  paymentMethod?: PaymentMethod | ''
  affiliateId?: string | ''
  dateRange?: 'today' | 'week' | 'month' | 'quarter' | ''
  minAmount?: number
  maxAmount?: number
  page?: number
  limit?: number
}

export interface AffiliatePayoutStats {
  totalPayouts: number
  totalAmount: number
  pendingAmount: number
  processingAmount: number
  completedAmount: number
  failedAmount: number
  averagePayout: number
  successRate: number
  totalFees: number
  totalCommissions: number
}

export interface CreateAffiliatePayoutRequest {
  affiliateId: string
  commissionIds: string[]
  paymentMethod: PaymentMethod
  paymentDetails: string
  scheduledDate: string
  notes?: string
}

export interface UpdateAffiliatePayoutRequest {
  status?: PayoutStatus
  paymentDetails?: string
  scheduledDate?: string
  processedDate?: string
  failureReason?: string
  transactionId?: string
  fees?: number
  notes?: string
}

export interface ProcessPayoutBatchRequest {
  payoutIds: string[]
  notes?: string
}

export interface PaymentBatch {
  id: string
  batchId: string
  affiliateId: string
  totalAmount: number
  commissionCount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processedAt?: string
  createdAt: string
  commissions: AffiliateCommission[]
}

export interface ProcessPaymentRequest {
  commissionIds: string[]
  paymentMethod?: string
  notes?: string
}

// User-related types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  status: string
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// Company Management types
export enum CompanyType {
  AFFILIATE = 'affiliate',
  B2B = 'b2b'
}

export enum CompanyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected'
}

export interface Company {
  id: string
  user_id: string
  company_name: string
  company_email: string
  company_contact_number: string
  company_type: CompanyType
  company_registration_number: string
  registration_country: string
  company_representative: string
  service_area_province?: string
  tax_id?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  website?: string
  contact_person?: string
  status: CompanyStatus
  commission_rate?: number
  created_at: string
  updated_at: string
  user?: User
  bookings?: any[]
  commissions?: any[]
}

export interface CreateCompanyRequest {
  user_id: string
  company_name: string
  company_email: string
  company_contact_number: string
  company_type: CompanyType
  company_registration_number: string
  registration_country: string
  company_representative: string
  service_area_province?: string
  tax_id?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  website?: string
  contact_person?: string
  commission_rate?: number
}

export interface UpdateCompanyRequest {
  company_name?: string
  company_email?: string
  company_contact_number?: string
  company_type?: CompanyType
  company_registration_number?: string
  registration_country?: string
  company_representative?: string
  service_area_province?: string
  tax_id?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  website?: string
  contact_person?: string
  commission_rate?: number
  status?: CompanyStatus
}

export interface CompanyFilters {
  page?: number
  limit?: number
  status?: string
  type?: string
  search?: string
}

export interface CompanyStats {
  total: number
  active: number
  pending: number
  approved: number
  rejected: number
  by_type: {
    affiliate: number
    b2b: number
  }
}