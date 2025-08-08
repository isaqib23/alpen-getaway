import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  DirectionsCar,
  People,
  AttachMoney,
  Business,
  LocalShipping,
  Assessment,
  CheckCircle,
  Schedule,
  Star,
  Route,
  LocalOffer,
} from '@mui/icons-material'
import { analyticsAPI } from '../api/dashboard'
import { DashboardOverview, BookingAnalytics } from '../types/api'
import { SimpleBarChart, SimpleLineChart, SimpleDonutChart } from '../components/charts/SimpleChart'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: any
  loading?: boolean
}

const StatCard = ({ title, value, change, changeType, icon: Icon, loading }: StatCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: '70%' }}>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="60%" height={40} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography
              variant="body2"
              color={
                changeType === 'increase' 
                  ? 'success.main' 
                  : changeType === 'decrease' 
                  ? 'error.main' 
                  : 'text.secondary'
              }
            >
              {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}{change}
            </Typography>
          </Box>
          <Icon
            sx={{
              fontSize: 48,
              color: 'primary.main',
              opacity: 0.8,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null)
  const [bookingAnalytics, setBookingAnalytics] = useState<BookingAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeData, setRealtimeData] = useState<any>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [overview, realtime, bookings] = await Promise.all([
          analyticsAPI.getDashboardOverview(),
          analyticsAPI.getRealtimeMetrics().catch(() => null), // Don't fail if realtime is unavailable
          analyticsAPI.getBookingAnalytics('7d').catch(() => null) // Last 7 days
        ])
        
        setDashboardData(overview)
        setRealtimeData(realtime)
        setBookingAnalytics(bookings)
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up periodic refresh for real-time data
    const interval = setInterval(() => {
      analyticsAPI.getRealtimeMetrics()
        .then(setRealtimeData)
        .catch(console.error)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Ride Booking Admin Dashboard
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Error Loading Dashboard</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Ride Booking Admin Dashboard
        </Typography>
        <Box display="flex" gap={1}>
          <Chip 
            label="System Online" 
            color="success" 
            variant="outlined"
            icon={<CheckCircle />}
          />
          {realtimeData && (
            <Chip 
              label={`Last Updated: ${new Date(realtimeData.timestamp).toLocaleTimeString()}`}
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={dashboardData?.overview.totalUsers.toLocaleString() || '0'}
            change={`${realtimeData?.activeUsers || 'N/A'} active`}
            changeType="neutral"
            icon={People}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Companies"
            value={dashboardData?.overview.totalCompanies.toString() || '0'}
            change={`${dashboardData?.overview.pendingCompanies || 0} pending`}
            changeType={dashboardData?.overview.pendingCompanies ? 'decrease' : 'neutral'}
            icon={Business}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={dashboardData?.overview.totalBookings.toLocaleString() || '0'}
            change={`${dashboardData?.overview.activeBookings || 0} active`}
            changeType="increase"
            icon={LocalShipping}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`€${parseFloat(dashboardData?.overview.totalRevenue || '0').toLocaleString()}`}
            change={`€${parseFloat(dashboardData?.recentActivity.recentRevenue || '0').toLocaleString()} recent`}
            changeType="increase"
            icon={AttachMoney}
            loading={loading}
          />
        </Grid>

        {/* Additional Stats Row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fleet Size"
            value={dashboardData?.overview.totalCars.toString() || '0'}
            change="active fleet"
            changeType="neutral"
            icon={DirectionsCar}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Drivers"
            value={dashboardData?.overview.totalDrivers.toString() || '0'}
            change={`${dashboardData?.overview.averageRating || '0'}★ avg`}
            changeType="increase"
            icon={People}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Route Fares"
            value={dashboardData?.overview.totalRoutes.toString() || '0'}
            change="active routes"
            changeType="neutral"
            icon={Route}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Coupons"
            value={dashboardData?.overview.activeCoupons.toString() || '0'}
            change="promotions"
            changeType="neutral"
            icon={LocalOffer}
            loading={loading}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <Schedule sx={{ mr: 1 }} />
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Box>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton variant="text" width="100%" height={24} />
                    <Skeleton variant="text" width="70%" height={20} />
                  </Box>
                ))}
              </Box>
            ) : (
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocalShipping color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${dashboardData?.recentActivity.recentBookings || 0} new bookings`}
                    secondary="In the last 7 days"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoney color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`€${parseFloat(dashboardData?.recentActivity.recentRevenue || '0').toLocaleString()} revenue`}
                    secondary="Generated in the last 7 days"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${dashboardData?.overview.averageRating || '0'} average rating`}
                    secondary="Overall system rating"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Business color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${dashboardData?.overview.pendingCompanies || 0} pending approvals`}
                    secondary="Companies awaiting verification"
                  />
                </ListItem>
              </List>
            )}
          </Paper>
        </Grid>

        {/* System Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <Assessment sx={{ mr: 1 }} />
              System Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Box>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="text" width="100%" height={32} sx={{ mb: 1 }} />
                ))}
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Welcome to the Ride Booking Admin Panel! This dashboard provides a comprehensive 
                  overview of your ride booking platform.
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center" p={2} bgcolor="primary.main" color="white" borderRadius={1}>
                        <Typography variant="h4">{dashboardData?.overview.totalBookings || 0}</Typography>
                        <Typography variant="body2">Total Bookings</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center" p={2} bgcolor="success.main" color="white" borderRadius={1}>
                        <Typography variant="h4">€{parseFloat(dashboardData?.overview.totalRevenue || '0').toLocaleString()}</Typography>
                        <Typography variant="body2">Revenue</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip label="Real-time Data" color="info" size="small" sx={{ mr: 1 }} />
                  <Chip label="Auto-refresh" color="success" size="small" />
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Booking Status Distribution */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Paper sx={{ p: 3, height: 350 }}>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', display: 'block' }} />
            </Paper>
          ) : bookingAnalytics?.statusDistribution ? (
            <SimpleDonutChart
              title="Booking Status Distribution"
              data={bookingAnalytics.statusDistribution.map(item => ({
                label: item.status.replace('_', ' ').toUpperCase(),
                value: item.count,
              }))}
              size={150}
            />
          ) : (
            <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No booking data available</Typography>
            </Paper>
          )}
        </Grid>

        {/* Daily Booking Trend */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Paper sx={{ p: 3, height: 350 }}>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
          ) : bookingAnalytics?.dailyTrend ? (
            <SimpleLineChart
              title="Daily Booking Trend (Last 7 Days)"
              data={bookingAnalytics.dailyTrend.slice(-7).map(item => ({
                label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: item.bookings,
              }))}
              height={250}
            />
          ) : (
            <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No trend data available</Typography>
            </Paper>
          )}
        </Grid>

        {/* Top Routes */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Paper sx={{ p: 3, height: 350 }}>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
          ) : bookingAnalytics?.topRoutes ? (
            <SimpleBarChart
              title="Top Routes by Bookings"
              data={bookingAnalytics.topRoutes.slice(0, 5).map(item => ({
                label: item.route.split(' → ')[0].substring(0, 8) + '...',
                value: item.bookings,
              }))}
              height={250}
            />
          ) : (
            <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No route data available</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard