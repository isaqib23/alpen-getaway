import { apiClient } from './client'
import { 
  AffiliateBooking,
  AffiliateBookingFilters,
  AffiliateBookingStats,
  BookingRequest,
  PaginatedResponse,
  UpdateBookingRequest
} from '../types/api'

export const affiliateBookingsAPI = {
  async getAll(filters?: AffiliateBookingFilters): Promise<PaginatedResponse<AffiliateBooking>> {
    console.log('📋 affiliateBookingsAPI.getAll called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-bookings?${params.toString()}`)
    console.log('✅ affiliateBookingsAPI.getAll RAW response:', response)
    
    // Since apiClient.interceptor returns response.data, we receive the actual data
    let responseData = response
    
    // If response is an array, it means it's malformed, wrap it properly
    if (Array.isArray(response)) {
      responseData = {
        data: response,
        // @ts-ignore
        total: response.length,
        page: 1,
        limit: response.length
      }
    }
    
    // Convert string numbers to actual numbers for consistency
    if (responseData.data && Array.isArray(responseData.data)) {
      responseData.data = responseData.data.map((booking: any) => ({
        ...booking,
        totalAmount: parseFloat(booking.totalAmount || 0),
        affiliateCommission: parseFloat(booking.affiliateCommission || 0),
        commissionRate: parseFloat(booking.commissionRate || 0),
        passengerCount: parseInt(booking.passengerCount || 1),
      }))
    }
    
    console.log('✅ affiliateBookingsAPI.getAll processed response:', responseData)
    // @ts-ignore
    return responseData
  },

  async getStatistics(): Promise<AffiliateBookingStats> {
    console.log('📊 affiliateBookingsAPI.getStatistics called')
    const response = await apiClient.get('/api/admin/affiliate-bookings/statistics')
    console.log('✅ affiliateBookingsAPI.getStatistics response:', response)
    // @ts-ignore
    return response
  },

  async getById(id: string): Promise<AffiliateBooking> {
    console.log('🔍 affiliateBookingsAPI.getById called with id:', id)
    const response = await apiClient.get(`/api/admin/affiliate-bookings/${id}`)
    console.log('✅ affiliateBookingsAPI.getById response:', response)
    // @ts-ignore
    return response
  },

  async updateBookingStatus(id: string, updateData: UpdateBookingRequest): Promise<BookingRequest> {
    console.log('📝 affiliateBookingsAPI.updateBookingStatus called with id:', id, 'data:', updateData)
    const response = await apiClient.patch(`/api/admin/affiliate-bookings/${id}`, updateData)
    console.log('✅ affiliateBookingsAPI.updateBookingStatus response:', response)
    // @ts-ignore
    return response
  },

  async exportReport(filters?: AffiliateBookingFilters): Promise<Blob> {
    console.log('📊 affiliateBookingsAPI.exportReport called with filters:', filters)
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await apiClient.get(`/api/admin/affiliate-bookings/export?${params.toString()}`, {
      responseType: 'blob'
    })
    console.log('✅ affiliateBookingsAPI.exportReport response received')
    // @ts-ignore
    return response
  },

  async processCommissionPayment(bookingId: string): Promise<void> {
    console.log('💰 affiliateBookingsAPI.processCommissionPayment called with bookingId:', bookingId)
    const response = await apiClient.post(`/api/admin/affiliate-bookings/${bookingId}/process-commission`)
    console.log('✅ affiliateBookingsAPI.processCommissionPayment response:', response)
    // @ts-ignore
    return response
  }
}