import apiClient from './client'
import { DashboardStats } from '../types/api'

export const dashboardAPI = {
  getOverview: async (): Promise<DashboardStats> => {
    return apiClient.get('/api/admin/dashboard/overview')
  },

  getVehicleStats: async () => {
    return apiClient.get('/api/admin/dashboard/vehicles/statistics')
  },

  getDriverStats: async () => {
    return apiClient.get('/api/admin/dashboard/drivers/statistics')
  },

  getBookingStats: async () => {
    return apiClient.get('/api/admin/dashboard/bookings/statistics')
  },

  getPaymentStats: async () => {
    return apiClient.get('/api/admin/dashboard/payments/statistics')
  },

  getUserStats: async () => {
    return apiClient.get('/api/admin/dashboard/users/statistics')
  },

  getRecentActivity: async () => {
    return apiClient.get('/api/admin/dashboard/activity/recent')
  },

  getSystemHealth: async () => {
    return apiClient.get('/api/admin/dashboard/system/health')
  },
}