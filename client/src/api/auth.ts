import apiClient from './client'
import { LoginRequest, AuthResponse, RegisterRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/api'

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/auth/register', userData)
  },

  logout: async (): Promise<{ message: string }> => {
    return apiClient.post('/auth/logout')
  },

  getProfile: async () => {
    return apiClient.get('/auth/profile')
  },

  refreshToken: async (): Promise<AuthResponse> => {
    return apiClient.post('/auth/refresh')
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    return apiClient.patch('/auth/change-password', data)
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    return apiClient.post('/auth/forgot-password', data)
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    return apiClient.post('/auth/reset-password', data)
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/verify-email', { token })
  },

  resendVerification: async (): Promise<{ message: string }> => {
    return apiClient.post('/auth/resend-verification')
  },

  // Admin endpoints
  getAllUsers: async (): Promise<any[]> => {
    return apiClient.get('/auth/users')
  },

  getAdminUsers: async (): Promise<any[]> => {
    return apiClient.get('/auth/admin-users')
  },

  updateUserStatus: async (userId: string, status: string): Promise<{ message: string }> => {
    return apiClient.patch(`/api/v1/auth/users/${userId}/status`, { status })
  },
}