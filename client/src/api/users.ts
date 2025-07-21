import { apiClient } from './client'

export interface User {
  id: string
  email: string
  phone?: string
  first_name: string
  last_name: string
  user_type: UserType
  status: UserStatus
  email_verified: boolean
  phone_verified: boolean
  created_at: string
  updated_at: string
  company?: {
    id: string
    company_name: string
    company_type: string
    status: string
  }
}

export interface CreateUserRequest {
  email: string
  password: string
  phone?: string
  first_name: string
  last_name: string
  user_type: UserType
}

export interface UpdateUserRequest {
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  user_type?: UserType
  status?: UserStatus
  email_verified?: boolean
  phone_verified?: boolean
}

export interface UsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserStatsResponse {
  total: number
  activeUsers: number
  inactiveUsers: number
  suspendedUsers: number
  customerCount: number
  affiliateCount: number
  b2bCount: number
  adminCount: number
}

export enum UserType {
  CUSTOMER = 'customer',
  AFFILIATE = 'affiliate',
  B2B = 'b2b',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface UserFilters {
  page?: number
  limit?: number
  userType?: UserType | string
  status?: UserStatus | string
  search?: string
  emailVerified?: boolean
  phoneVerified?: boolean
}

class UsersAPI {
  private readonly basePath = '/users'

  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.userType) params.append('userType', filters.userType)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.emailVerified !== undefined) params.append('emailVerified', filters.emailVerified.toString())
    if (filters.phoneVerified !== undefined) params.append('phoneVerified', filters.phoneVerified.toString())

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath
    
    const response = await apiClient.get(url)
    return response.data
  }

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`${this.basePath}/${id}`)
    return response.data
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post(this.basePath, userData)
    return response.data
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch(`${this.basePath}/${id}`, userData)
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }

  async getUserStats(): Promise<UserStatsResponse> {
    const response = await apiClient.get(`${this.basePath}/stats`)
    return response.data
  }

  async exportUsers(filters: UserFilters = {}): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (filters.userType) params.append('userType', filters.userType)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.emailVerified !== undefined) params.append('emailVerified', filters.emailVerified.toString())
    if (filters.phoneVerified !== undefined) params.append('phoneVerified', filters.phoneVerified.toString())

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}/export?${queryString}` : `${this.basePath}/export`
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    })
    
    return response.data
  }
}

export const usersAPI = new UsersAPI()