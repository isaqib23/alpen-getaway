import { useState, useEffect, useCallback } from 'react'
import { affiliateBookingsAPI } from '../api/affiliateBookings'
import { 
  AffiliateBooking, 
  AffiliateBookingFilters, 
  AffiliateBookingStats,
  PaginatedResponse, 
  UpdateBookingRequest 
} from '../types/api'

export const useAffiliateBookings = (initialFilters?: AffiliateBookingFilters) => {
  const [data, setData] = useState<PaginatedResponse<AffiliateBooking> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AffiliateBookingFilters>(initialFilters || {})

  const fetchBookings = useCallback(async (currentFilters = filters) => {
    try {
      console.log('📋 useAffiliateBookings.fetchBookings called with filters:', currentFilters)
      setLoading(true)
      setError(null)
      const response = await affiliateBookingsAPI.getAll(currentFilters)
      console.log('✅ useAffiliateBookings.fetchBookings response:', response)
      setData(response)
    } catch (err) {
      console.error('❌ useAffiliateBookings.fetchBookings error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliate bookings')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const updateFilters = (newFilters: Partial<AffiliateBookingFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchBookings(updatedFilters)
  }

  const getStatistics = async () => {
    try {
      console.log('📊 useAffiliateBookings.getStatistics called')
      return await affiliateBookingsAPI.getStatistics()
    } catch (err) {
      console.error('❌ useAffiliateBookings.getStatistics error:', err)
      throw err
    }
  }

  const updateBookingStatus = async (id: string, updateData: UpdateBookingRequest) => {
    try {
      console.log('📝 useAffiliateBookings.updateBookingStatus called with id:', id, 'data:', updateData)
      await affiliateBookingsAPI.updateBookingStatus(id, updateData)
      fetchBookings()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateBookings.updateBookingStatus error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update booking status' }
    }
  }

  const processCommissionPayment = async (bookingId: string) => {
    try {
      console.log('💰 useAffiliateBookings.processCommissionPayment called with bookingId:', bookingId)
      await affiliateBookingsAPI.processCommissionPayment(bookingId)
      fetchBookings()
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateBookings.processCommissionPayment error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to process commission payment' }
    }
  }

  const exportReport = async (exportFilters?: AffiliateBookingFilters) => {
    try {
      console.log('📊 useAffiliateBookings.exportReport called with filters:', exportFilters)
      const blob = await affiliateBookingsAPI.exportReport(exportFilters || filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `affiliate-bookings-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (err) {
      console.error('❌ useAffiliateBookings.exportReport error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to export report' }
    }
  }

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchBookings,
    getStatistics,
    updateBookingStatus,
    processCommissionPayment,
    exportReport,
  }
}

export const useAffiliateBookingStats = () => {
  const [stats, setStats] = useState<AffiliateBookingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log('📊 useAffiliateBookingStats.fetchStats called')
      setLoading(true)
      setError(null)
      const response = await affiliateBookingsAPI.getStatistics()
      console.log('✅ useAffiliateBookingStats.fetchStats response:', response)
      setStats(response)
    } catch (err) {
      console.error('❌ useAffiliateBookingStats.fetchStats error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliate booking statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('📊 useAffiliateBookingStats useEffect triggered')
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}