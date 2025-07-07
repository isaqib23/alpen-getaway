import { useState, useEffect } from 'react'
import { dashboardAPI } from '../api/dashboard'
import { DashboardStats } from '../types/api'

export const useDashboard = () => {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      console.log('📊 useDashboard.fetchDashboard called')
      setLoading(true)
      setError(null)
      const response = await dashboardAPI.getOverview()
      console.log('✅ useDashboard.fetchDashboard response:', response)
      setData(response)
    } catch (err) {
      console.error('❌ useDashboard.fetchDashboard error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('📊 useDashboard useEffect triggered')
    fetchDashboard()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  }
}

export const useSystemHealth = () => {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await dashboardAPI.getSystemHealth()
        setHealth(response)
      } catch (err) {
        console.error('Failed to fetch system health:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return { health, loading }
}