import { apiClient } from './client'

export interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  discount_type: DiscountType
  discount_value: number
  minimum_order_amount?: number
  maximum_discount_amount?: number
  usage_limit?: number
  usage_count: number
  user_usage_limit: number
  valid_from: string
  valid_until: string
  // @ts-ignore
  applicable_user_types?: string[]
  // @ts-ignore
  applicable_routes?: string[]
  status: CouponStatus
  created_at: string
  updated_at?: string
}

export interface CouponUsage {
  id: string
  coupon_id: string
  user_id: string
  booking_id: string
  discount_applied: number
  used_at: string
  // Related data
  coupon?: Coupon
  user?: {
    id: string
    first_name: string
    last_name: string
    email: string
    user_type: string
  }
  booking?: {
    id: string
    reference_number: string
    pickup_location: string
    destination: string
    vehicle_type: string
    total_amount: number
    final_amount: number
  }
}

export interface CreateCouponRequest {
  code: string
  name: string
  description?: string
  discount_type: DiscountType
  discount_value: number
  minimum_order_amount?: number
  maximum_discount_amount?: number
  usage_limit?: number
  user_usage_limit?: number
  valid_from: string
  valid_until: string
  applicable_user_types?: string[]
  applicable_routes?: string[]
}

export interface UpdateCouponRequest {
  code?: string
  name?: string
  description?: string
  discount_type?: DiscountType
  discount_value?: number
  minimum_order_amount?: number
  maximum_discount_amount?: number
  usage_limit?: number
  user_usage_limit?: number
  valid_from?: string
  valid_until?: string
  applicable_user_types?: string[]
  applicable_routes?: string[]
  status?: CouponStatus
}

export interface ValidateCouponRequest {
  code: string
  user_id: string
  order_amount: number
  user_type: string
}

export interface ValidateCouponResponse {
  valid: boolean
  discount_amount?: number
  final_amount?: number
  message?: string
}

export interface CouponsResponse {
  data: Coupon[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CouponUsageResponse {
  data: CouponUsage[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CouponStatsResponse {
  totalCoupons: number
  activeCoupons: number
  inactiveCoupons: number
  expiredCoupons: number
  totalUsages: number
  totalDiscountGiven: number
  avgDiscountPerCoupon: number
  topCoupons: Array<{
    id: string
    code: string
    name: string
    usage_count: number
    total_discount: number
  }>
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export interface CouponFilters {
  page?: number
  limit?: number
  status?: CouponStatus | string
  discount_type?: DiscountType | string
  search?: string
  valid_from?: string
  valid_until?: string
  user_type?: string
}

export interface CouponUsageFilters {
  page?: number
  limit?: number
  coupon_id?: string
  user_id?: string
  booking_id?: string
  date_from?: string
  date_to?: string
  user_type?: string
  search?: string
}

class CouponsAPI {
  private readonly basePath = '/coupons'

  async getCoupons(filters: CouponFilters = {}): Promise<CouponsResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.discount_type) params.append('discount_type', filters.discount_type)
    if (filters.search) params.append('search', filters.search)
    if (filters.valid_from) params.append('valid_from', filters.valid_from)
    if (filters.valid_until) params.append('valid_until', filters.valid_until)
    if (filters.user_type) params.append('user_type', filters.user_type)

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath
    
    const response = await apiClient.get(url)
    return response.data
  }

  async getCouponById(id: string): Promise<Coupon> {
    const response = await apiClient.get(`${this.basePath}/${id}`)
    return response.data
  }

  async getCouponByCode(code: string): Promise<Coupon> {
    const response = await apiClient.get(`${this.basePath}/code/${code}`)
    return response.data
  }

  async createCoupon(couponData: CreateCouponRequest): Promise<Coupon> {
    const response = await apiClient.post(this.basePath, couponData)
    return response.data
  }

  async updateCoupon(id: string, couponData: UpdateCouponRequest): Promise<Coupon> {
    const response = await apiClient.patch(`${this.basePath}/${id}`, couponData)
    return response.data
  }

  async deleteCoupon(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }

  async deactivateCoupon(id: string): Promise<Coupon> {
    const response = await apiClient.patch(`${this.basePath}/${id}/deactivate`)
    return response.data
  }

  async getCouponStats(): Promise<CouponStatsResponse> {
    const response = await apiClient.get(`${this.basePath}/stats`)
    return response.data
  }

  async validateCoupon(validateData: ValidateCouponRequest): Promise<ValidateCouponResponse> {
    const response = await apiClient.post(`${this.basePath}/validate`, validateData)
    return response.data
  }

  async getCouponUsage(filters: CouponUsageFilters = {}): Promise<CouponUsageResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.coupon_id) params.append('coupon_id', filters.coupon_id)
    if (filters.user_id) params.append('user_id', filters.user_id)
    if (filters.booking_id) params.append('booking_id', filters.booking_id)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.user_type) params.append('user_type', filters.user_type)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}/usage?${queryString}` : `${this.basePath}/usage`
    
    const response = await apiClient.get(url)
    return response.data
  }

  async exportCoupons(filters: CouponFilters = {}): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.discount_type) params.append('discount_type', filters.discount_type)
    if (filters.search) params.append('search', filters.search)
    if (filters.valid_from) params.append('valid_from', filters.valid_from)
    if (filters.valid_until) params.append('valid_until', filters.valid_until)
    if (filters.user_type) params.append('user_type', filters.user_type)

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}/export?${queryString}` : `${this.basePath}/export`
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    })
    
    return response.data
  }

  async exportCouponUsage(filters: CouponUsageFilters = {}): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (filters.coupon_id) params.append('coupon_id', filters.coupon_id)
    if (filters.user_id) params.append('user_id', filters.user_id)
    if (filters.booking_id) params.append('booking_id', filters.booking_id)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.user_type) params.append('user_type', filters.user_type)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}/usage/export?${queryString}` : `${this.basePath}/usage/export`
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    })
    
    return response.data
  }
}

export const couponsAPI = new CouponsAPI()