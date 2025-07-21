import { useState, useEffect } from 'react'
import { bookingsAPI, Booking, BookingFilters, BookingStatsResponse } from '../api/bookings'

export interface UseBookingsReturn {
  bookings: Booking[]
  stats: BookingStatsResponse | null
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  total: number
  refetch: () => void
  updateFilters: (filters: BookingFilters) => void
}

export const useBookings = (initialFilters: BookingFilters = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<BookingStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    ...initialFilters
  })

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [bookingsResponse, statsResponse] = await Promise.all([
        bookingsAPI.getBookings(filters),
        bookingsAPI.getBookingStats()
      ])
      
      setBookings(bookingsResponse.data)
      setTotalPages(bookingsResponse.totalPages)
      setCurrentPage(bookingsResponse.page)
      setTotal(bookingsResponse.total)
      setStats(statsResponse)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings')
      setBookings([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: BookingFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const refetch = () => {
    fetchBookings()
  }

  useEffect(() => {
    fetchBookings()
  }, [filters])

  return {
    bookings,
    stats,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refetch,
    updateFilters
  }
}

export interface UseBookingReturn {
  booking: Booking | null
  loading: boolean
  error: string | null
  refetch: () => void
  updateBooking: (id: string, data: any) => Promise<void>
  deleteBooking: (id: string) => Promise<void>
  confirmBooking: (id: string) => Promise<void>
  cancelBooking: (id: string, reason?: string) => Promise<void>
  assignDriverAndCar: (id: string, driverId: string, carId: string) => Promise<void>
  startTrip: (id: string) => Promise<void>
  completeTrip: (id: string, actualDistanceKm?: number) => Promise<void>
}

export const useBooking = (id: string) => {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBooking = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingsAPI.getBookingById(id)
      setBooking(response)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch booking')
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  const updateBooking = async (bookingId: string, data: any) => {
    try {
      const updated = await bookingsAPI.updateBooking(bookingId, data)
      setBooking(updated)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to update booking')
    }
  }

  const deleteBooking = async (bookingId: string) => {
    try {
      await bookingsAPI.deleteBooking(bookingId)
      setBooking(null)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to delete booking')
    }
  }

  const confirmBooking = async (bookingId: string) => {
    try {
      const updated = await bookingsAPI.confirmBooking(bookingId)
      setBooking(updated)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to confirm booking')
    }
  }

  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      const updated = await bookingsAPI.cancelBooking(bookingId, reason)
      setBooking(updated)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to cancel booking')
    }
  }

  const assignDriverAndCar = async (bookingId: string, driverId: string, carId: string) => {
    try {
      const updated = await bookingsAPI.assignDriverAndCar(bookingId, { driver_id: driverId, car_id: carId })
      setBooking(updated)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to assign driver and car')
    }
  }

  const startTrip = async (bookingId: string) => {
    try {
      const updated = await bookingsAPI.startTrip(bookingId)
      setBooking(updated)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to start trip')
    }
  }

  const completeTrip = async (bookingId: string, actualDistanceKm?: number) => {
    try {
      const updated = await bookingsAPI.completeTrip(bookingId, actualDistanceKm)
      setBooking(updated)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to complete trip')
    }
  }

  const refetch = () => {
    fetchBooking()
  }

  useEffect(() => {
    if (id) {
      fetchBooking()
    }
  }, [id])

  return {
    booking,
    loading,
    error,
    refetch,
    updateBooking,
    deleteBooking,
    confirmBooking,
    cancelBooking,
    assignDriverAndCar,
    startTrip,
    completeTrip
  }
}