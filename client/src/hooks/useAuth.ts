import { useState, useCallback } from 'react'
import { authAPI } from '../api/auth'
import { LoginRequest, RegisterRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/api'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login(credentials)
      // Store token in localStorage
      localStorage.setItem('authToken', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Dispatch custom event to notify App component about auth state change
      window.dispatchEvent(new Event('authStateChanged'))
      
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: RegisterRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register(userData)
      // Store token in localStorage
      localStorage.setItem('authToken', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Dispatch custom event to notify App component about auth state change
      window.dispatchEvent(new Event('authStateChanged'))
      
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await authAPI.logout()
      // Clear stored data
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // Dispatch custom event to notify App component about auth state change
      window.dispatchEvent(new Event('authStateChanged'))
      
      return { success: true }
    } catch (err: any) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // Dispatch custom event to notify App component about auth state change
      window.dispatchEvent(new Event('authStateChanged'))
      
      return { success: true }
    } finally {
      setLoading(false)
    }
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.changePassword(data)
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Password change failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.forgotPassword(data)
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Request failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.resetPassword(data)
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Password reset failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyEmail = useCallback(async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.verifyEmail(token)
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Email verification failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const resendVerification = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.resendVerification()
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend verification'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Get current user from localStorage
  const getCurrentUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }, [])

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('authToken')
    const user = getCurrentUser()
    return !!(token && user)
  }, [getCurrentUser])

  return {
    loading,
    error,
    clearError,
    login,
    register,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    getCurrentUser,
    isAuthenticated,
  }
}