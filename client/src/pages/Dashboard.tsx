import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import {
  TrendingUp,
  DirectionsCar,
  People,
  AttachMoney,
  Business,
  LocalShipping,
  Assessment,
} from '@mui/icons-material'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: any
}

const StatCard = ({ title, value, change, changeType, icon: Icon }: StatCardProps) => (
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
            color={changeType === 'increase' ? 'success.main' : 'error.main'}
          >
            {changeType === 'increase' ? '+' : ''}{change}
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

const Dashboard = () => {
  // Mock data for now - will be replaced with actual API calls
  const mockData = {
    users: { total: 1250, active: 980 },
    companies: { total: 45, approved: 38 },
    bookings: { total: 2340, completed: 2120, pending: 15, confirmed: 205 },
    payments: { totalRevenue: 156750, successRate: 98.5, pending: 3, completed: 847 },
    cars: { total: 85, active: 78 },
    drivers: { active: 92, averageRating: 4.7 },
    routeFares: { total: 124, active: 118 },
    coupons: { active: 12, used: 234 },
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Ride Booking Admin Dashboard
        </Typography>
        <Chip label="System Online" color="success" variant="outlined" />
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={mockData.users.total.toString()}
            change={`${mockData.users.active} active`}
            changeType="increase"
            icon={People}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Companies"
            value={mockData.companies.total.toString()}
            change={`${mockData.companies.approved} approved`}
            changeType="increase"
            icon={Business}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={mockData.bookings.total.toString()}
            change={`${mockData.bookings.completed} completed`}
            changeType="increase"
            icon={LocalShipping}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`€${mockData.payments.totalRevenue.toLocaleString()}`}
            change={`${mockData.payments.successRate}% success`}
            changeType="increase"
            icon={AttachMoney}
          />
        </Grid>

        {/* Additional Stats Row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fleet Size"
            value={mockData.cars.total.toString()}
            change={`${mockData.cars.active} active`}
            changeType="increase"
            icon={DirectionsCar}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Drivers"
            value={mockData.drivers.active.toString()}
            change={`${mockData.drivers.averageRating}★ avg`}
            changeType="increase"
            icon={People}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Route Fares"
            value={mockData.routeFares.total.toString()}
            change={`${mockData.routeFares.active} active`}
            changeType="increase"
            icon={TrendingUp}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Coupons"
            value={mockData.coupons.active.toString()}
            change={`${mockData.coupons.used} used`}
            changeType="increase"
            icon={Assessment}
          />
        </Grid>

        {/* Quick Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Overview
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome to the Ride Booking Admin Panel! This dashboard provides a comprehensive overview 
              of your ride booking platform. Navigate through the sidebar to manage users, companies, 
              bookings, fleet, routes, financial operations, and more.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label="New UI Design" color="info" size="small" sx={{ mr: 1 }} />
              <Chip label="Based on Updated Schema" color="success" size="small" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard