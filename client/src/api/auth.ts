import apiClient from './client'
import { LoginRequest, AuthResponse, RegisterRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/api'

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/v1/auth/login', credentials)
    return response.data
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/v1/auth/register', userData)
  },

  logout: async (): Promise<{ message: string }> => {
    return apiClient.post('/api/v1/auth/logout')
  },

  getProfile: async () => {
    return apiClient.get('/api/v1/auth/profile')
  },

  refreshToken: async (): Promise<AuthResponse> => {
    return apiClient.post('/api/v1/auth/refresh')
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    return apiClient.patch('/api/v1/auth/change-password', data)
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    return apiClient.post('/api/v1/auth/forgot-password', data)
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    return apiClient.post('/api/v1/auth/reset-password', data)
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return apiClient.post('/api/v1/auth/verify-email', { token })
  },

  resendVerification: async (): Promise<{ message: string }> => {
    return apiClient.post('/api/v1/auth/resend-verification')
  },

  // Admin endpoints
  getAllUsers: async (): Promise<any[]> => {
    return apiClient.get('/api/v1/auth/users')
  },

  getAdminUsers: async (): Promise<any[]> => {
    return apiClient.get('/api/v1/auth/admin-users')
  },

  updateUserStatus: async (userId: string, status: string): Promise<{ message: string }> => {
    return apiClient.patch(`/api/v1/auth/users/${userId}/status`, { status })
  },
}