// @ts-nocheck
import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  TrendingUp,
  DirectionsCar,
  Assignment,
  Euro,
  People,
  Gavel,
  Visibility,
  MoreVert,
} from '@mui/icons-material'
import { useCars } from '../../hooks/useCars'
import { useDrivers } from '../../hooks/useDrivers'
import { useAuth } from '../../hooks/useAuth'
import { useEarningsStats } from '../../hooks/useEarnings'
import { usePayoutStats } from '../../hooks/usePayouts'

interface DashboardStats {
  totalEarnings: number
  thisMonthEarnings: number
  activeBookings: number
  completedBookings: number
  fleetSize: number
  activeDrivers: number
  pendingPayouts: number
  avgRating: number
}

interface RecentBooking {
  id: string
  customer: string
  route: string
  date: string
  amount: number
  status: string
  driver: string
}

interface AvailableAuction {
  id: string
  route: string
  date: string
  amount: number
  bids: number
  timeLeft: string
  status: string
}

const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }: {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType
  color?: 'primary' | 'success' | 'warning' | 'error'
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {change && (
            <Typography variant="body2" color="success.main">
              {change}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.main` }}>
          <Icon />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'warning'
    case 'COMPLETED':
      return 'success'
    case 'CONFIRMED':
      return 'info'
    case 'ACTIVE':
      return 'success'
    default:
      return 'default'
  }
}

const PartnerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    activeBookings: 0,
    completedBookings: 0,
    fleetSize: 0,
    activeDrivers: 0,
    pendingPayouts: 0,
    avgRating: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [availableAuctions, setAvailableAuctions] = useState<AvailableAuction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { cars, stats: carStats, loading: carsLoading } = useCars()
  const { data: driversData, loading: driversLoading, refetch: refetchDrivers } = useDrivers()
  const { getCurrentUserCompanyId, isB2BUser } = useAuth()
  const companyId = getCurrentUserCompanyId()
  const { stats: earningsStats, loading: earningsLoading } = useEarningsStats(companyId)
  const { stats: payoutStats, loading: payoutLoading } = usePayoutStats(companyId)

  useEffect(() => {
    if (!isB2BUser()) {
      setError('Access denied. This dashboard is for B2B partners only.')
      setLoading(false)
      return
    }

    // Trigger drivers fetch for B2B users
    refetchDrivers()
  }, [isB2BUser, refetchDrivers])

  useEffect(() => {
    if (!isB2BUser()) {
      return
    }

    // Calculate dashboard stats from real API data
    if (!carsLoading && !driversLoading && !earningsLoading && !payoutLoading && carStats && driversData?.data) {
      console.log('driversData structure:', driversData)
      console.log('driversData.data:', driversData.data)
      console.log('driversData.data is array:', Array.isArray(driversData.data))
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const thisMonthEarnings = earningsStats?.monthlyTrend?.find(trend => {
        const trendDate = new Date(trend.month)
        return trendDate.getMonth() === currentMonth && trendDate.getFullYear() === currentYear
      })?.amount || 0

      const pendingPayoutAmount = (payoutStats?.byStatus?.pending?.amount || 0) + 
                                  (payoutStats?.byStatus?.requested?.amount || 0)

      setStats({
        totalEarnings: earningsStats?.totalAmount || 0,
        thisMonthEarnings: thisMonthEarnings,
        activeBookings: 0, // TODO: Implement bookings API
        completedBookings: 0, // TODO: Implement bookings API
        fleetSize: cars.length,
        activeDrivers: (() => {
          try {
            // Handle various response structures
            let drivers = [];
            if (driversData?.data?.data && Array.isArray(driversData.data.data)) {
              drivers = driversData.data.data;
            } else if (driversData?.data && Array.isArray(driversData.data)) {
              drivers = driversData.data;
            } else if (Array.isArray(driversData)) {
              drivers = driversData;
            }
            return drivers.filter((d: any) => d.status === 'active').length;
          } catch (error) {
            console.error('Error filtering drivers:', error, driversData);
            return 0;
          }
        })(),
        pendingPayouts: pendingPayoutAmount,
        avgRating: 4.5, // TODO: Calculate from real ratings
      })

      // TODO: Load real recent bookings data
      setRecentBookings([])
      
      // TODO: Load real available auctions data  
      setAvailableAuctions([])
      
      setLoading(false)
    }
  }, [cars, driversData, carStats, carsLoading, driversLoading, earningsStats, payoutStats, earningsLoading, payoutLoading, getCurrentUserCompanyId, isB2BUser])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Partner Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Earnings"
            value={`€${stats.totalEarnings.toLocaleString()}`}
            change="+12.5% from last month"
            icon={Euro}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Month"
            value={`€${stats.thisMonthEarnings.toLocaleString()}`}
            change="+8.3% from last month"
            icon={TrendingUp}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={Assignment}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fleet Size"
            value={stats.fleetSize}
            icon={DirectionsCar}
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" startIcon={<Gavel />}>
              View Auctions
            </Button>
            <Button variant="outlined" startIcon={<Assignment />}>
              New Booking
            </Button>
            <Button variant="outlined" startIcon={<DirectionsCar />}>
              Manage Fleet
            </Button>
            <Button variant="outlined" startIcon={<People />}>
              Manage Drivers
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Recent Bookings */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Bookings</Typography>
                <Button size="small" endIcon={<Visibility />}>
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Route</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Driver</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{booking.customer}</TableCell>
                        <TableCell>{booking.route}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>€{booking.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={getStatusColor(booking.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{booking.driver}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Auctions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Available Auctions</Typography>
                <Button size="small" endIcon={<Visibility />}>
                  View All
                </Button>
              </Box>
              <Box>
                {availableAuctions.map((auction) => (
                  <Box key={auction.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2">{auction.route}</Typography>
                      <Chip
                        label={auction.status}
                        color={getStatusColor(auction.status) as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {auction.date}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6" color="success.main">
                        €{auction.amount}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {auction.bids} bids
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="warning.main">
                        {auction.timeLeft} left
                      </Typography>
                      <Button size="small" variant="outlined">
                        Place Bid
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Overview */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2">96%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={96} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Customer Satisfaction</Typography>
                  <Typography variant="body2">4.8/5</Typography>
                </Box>
                <LinearProgress variant="determinate" value={96} color="success" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Fleet Utilization</Typography>
                  <Typography variant="body2">78%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} color="warning" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Key Metrics
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Total Completed Rides</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.completedBookings}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Average Rating</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.avgRating}/5
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Active Drivers</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.activeDrivers}/{stats.fleetSize}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Pending Payouts</Typography>
                <Typography variant="body2" fontWeight="bold" color="warning.main">
                  €{stats.pendingPayouts.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PartnerDashboard