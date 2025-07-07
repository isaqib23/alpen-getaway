import { useState, useEffect } from 'react'
import { paymentsAPI, Payment, PaymentStats } from '../api/payments'

export const usePayments = () => {
  const [data, setData] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      console.log('💳 usePayments.fetchPayments called')
      setLoading(true)
      setError(null)
      const response = await paymentsAPI.getAll()
      console.log('✅ usePayments.fetchPayments response:', response)
      // Ensure we always have an array, even if response is undefined or null
      setData(Array.isArray(response) ? response : [])
    } catch (err) {
      console.error('❌ usePayments.fetchPayments error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch payments')
      // Set empty array on error
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('💳 usePayments useEffect triggered')
    fetchPayments()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchPayments,
  }
}

export const usePaymentStats = () => {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log('📊 usePaymentStats.fetchStats called')
      setLoading(true)
      setError(null)
      const response = await paymentsAPI.getStatistics()
      console.log('✅ usePaymentStats.fetchStats response:', response)
      // Ensure we always have stats object, even if response is undefined
      setStats(response || { total: 0, completed: 0, pending: 0, failed: 0, totalRevenue: 0 })
    } catch (err) {
      console.error('❌ usePaymentStats.fetchStats error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch payment statistics')
      // Set default stats on error
      setStats({ total: 0, completed: 0, pending: 0, failed: 0, totalRevenue: 0 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('📊 usePaymentStats useEffect triggered')
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}