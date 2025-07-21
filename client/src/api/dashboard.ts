import apiClient from './client'
import { 
  DashboardOverview, 
  BookingAnalytics, 
  RevenueAnalytics, 
  UserAnalytics, 
  DriverPerformance, 
  CompanyAnalytics, 
  CouponAnalytics, 
  OperationalMetrics 
} from '../types/api'

export const analyticsAPI = {
  // Dashboard Overview
  getDashboardOverview: async (): Promise<DashboardOverview> => {
    const response = await apiClient.get('/analytics/dashboard')
    return response.data
  },

  // Booking Analytics
  getBookingAnalytics: async (period: string = '30d'): Promise<BookingAnalytics> => {
    const response = await apiClient.get(`/analytics/bookings?period=${period}`)
    return response.data
  },

  // Revenue Analytics
  getRevenueAnalytics: async (period: string = '12m'): Promise<RevenueAnalytics> => {
    const response = await apiClient.get(`/analytics/revenue?period=${period}`)
    return response.data
  },

  // User Analytics
  getUserAnalytics: async (): Promise<UserAnalytics> => {
    const response = await apiClient.get('/analytics/users')
    return response.data
  },

  // Driver Performance
  getDriverPerformance: async (): Promise<DriverPerformance> => {
    const response = await apiClient.get('/analytics/drivers')
    return response.data
  },

  // Company Analytics
  getCompanyAnalytics: async (): Promise<CompanyAnalytics> => {
    const response = await apiClient.get('/analytics/companies')
    return response.data
  },

  // Coupon Analytics
  getCouponAnalytics: async (): Promise<CouponAnalytics> => {
    const response = await apiClient.get('/analytics/coupons')
    return response.data
  },

  // Operational Metrics
  getOperationalMetrics: async (): Promise<OperationalMetrics> => {
    const response = await apiClient.get('/analytics/operations')
    return response.data
  },

  // Real-time metrics
  getRealtimeMetrics: async () => {
    const response = await apiClient.get('/analytics/realtime')
    return response.data
  },

  // Financial summary
  getFinancialSummary: async (period: string = '30d') => {
    const response = await apiClient.get(`/analytics/financial-summary?period=${period}`)
    return response.data
  },

  // Performance summary
  getPerformanceSummary: async () => {
    const response = await apiClient.get('/analytics/performance-summary')
    return response.data
  },

  // Growth metrics
  getGrowthMetrics: async (period: string = '12m') => {
    const response = await apiClient.get(`/analytics/growth?period=${period}`)
    return response.data
  },

  // Export analytics
  exportAnalytics: async (format: string = 'json', period: string = '30d') => {
    const response = await apiClient.get(`/analytics/export?format=${format}&period=${period}`)
    return response.data
  },
}

// Keep the legacy dashboard API for backward compatibility
export const dashboardAPI = {
  getOverview: async () => {
    return analyticsAPI.getDashboardOverview()
  },

  getVehicleStats: async () => {
    const data = await analyticsAPI.getOperationalMetrics()
    return { data: data.fleetUtilization }
  },

  getDriverStats: async () => {
    const data = await analyticsAPI.getDriverPerformance()
    return { data: data.topDrivers }
  },

  getBookingStats: async () => {
    const data = await analyticsAPI.getBookingAnalytics()
    return { data: data.statusDistribution }
  },

  getPaymentStats: async () => {
    const data = await analyticsAPI.getRevenueAnalytics()
    return { data: data.byPaymentMethod }
  },

  getUserStats: async () => {
    const data = await analyticsAPI.getUserAnalytics()
    return { data: data.topCustomers }
  },

  getRecentActivity: async () => {
    return analyticsAPI.getRealtimeMetrics()
  },

  getSystemHealth: async () => {
    return { data: { status: 'healthy', uptime: '99.9%' } }
  },
}