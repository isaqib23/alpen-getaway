import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material'
import {
  Search,
  GetApp,
  TrendingUp,
  AttachMoney,
  Receipt,
  AccountBalance,
  Visibility,
  RequestQuote,
} from '@mui/icons-material'

interface EarningsData {
  id: string
  booking_id: string
  amount: number
  commission_rate: number
  commission_amount: number
  net_amount: number
  payment_status: 'pending' | 'paid' | 'cancelled'
  payment_date: string
  created_at: string
  booking: {
    id: string
    pickup_location: string
    dropoff_location: string
    customer_name: string
    ride_date: string
    status: string
  }
}

interface EarningsStats {
  total_earnings: number
  total_commission: number
  net_earnings: number
  pending_amount: number
  paid_amount: number
  total_rides: number
  avg_ride_value: number
  commission_rate: number
}

const Earnings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedEarning, setSelectedEarning] = useState<EarningsData | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [earnings, setEarnings] = useState<EarningsData[]>([])
  const [stats, setStats] = useState<EarningsStats>({
    total_earnings: 0,
    total_commission: 0,
    net_earnings: 0,
    pending_amount: 0,
    paid_amount: 0,
    total_rides: 0,
    avg_ride_value: 0,
    commission_rate: 0,
  })

  // Note: Company context functionality would be implemented here when needed

  // Filter earnings based on search and filters
  const filteredEarnings = earnings.filter(earning => {
    const matchesSearch = searchTerm === '' || 
      earning.booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.booking.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.booking.dropoff_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.booking_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || earning.payment_status === statusFilter
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const earningDate = new Date(earning.created_at)
      const now = new Date()
      
      switch (dateFilter) {
        case 'today':
          matchesDate = earningDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = earningDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = earningDate >= monthAgo
          break
        case 'custom':
          if (startDate && endDate) {
            const start = new Date(startDate)
            const end = new Date(endDate)
            matchesDate = earningDate >= start && earningDate <= end
          }
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Mock data loading function - replace with real API call
  const loadEarnings = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - replace with actual API call
      const mockEarnings: EarningsData[] = [
        {
          id: '1',
          booking_id: 'BK-001',
          amount: 45.00,
          commission_rate: 0.15,
          commission_amount: 6.75,
          net_amount: 38.25,
          payment_status: 'paid',
          payment_date: '2024-07-05',
          created_at: '2024-07-01',
          booking: {
            id: 'BK-001',
            pickup_location: 'Airport Terminal 1',
            dropoff_location: 'Hotel Alpenblick',
            customer_name: 'John Smith',
            ride_date: '2024-07-01',
            status: 'completed'
          }
        },
        {
          id: '2',
          booking_id: 'BK-002',
          amount: 32.50,
          commission_rate: 0.15,
          commission_amount: 4.88,
          net_amount: 27.62,
          payment_status: 'pending',
          payment_date: '',
          created_at: '2024-07-02',
          booking: {
            id: 'BK-002',
            pickup_location: 'Zurich HB',
            dropoff_location: 'Davos Resort',
            customer_name: 'Maria Garcia',
            ride_date: '2024-07-02',
            status: 'completed'
          }
        },
        {
          id: '3',
          booking_id: 'BK-003',
          amount: 78.00,
          commission_rate: 0.15,
          commission_amount: 11.70,
          net_amount: 66.30,
          payment_status: 'paid',
          payment_date: '2024-07-06',
          created_at: '2024-07-03',
          booking: {
            id: 'BK-003',
            pickup_location: 'St. Moritz Center',
            dropoff_location: 'Engadin Airport',
            customer_name: 'Robert Johnson',
            ride_date: '2024-07-03',
            status: 'completed'
          }
        }
      ]
      
      const mockStats: EarningsStats = {
        total_earnings: 155.50,
        total_commission: 23.33,
        net_earnings: 132.17,
        pending_amount: 27.62,
        paid_amount: 104.55,
        total_rides: 3,
        avg_ride_value: 51.83,
        commission_rate: 0.15
      }
      
      setEarnings(mockEarnings)
      setStats(mockStats)
    } catch (err) {
      setError('Failed to load earnings data')
      console.error('Error loading earnings:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load earnings on component mount and when filters change
  useEffect(() => {
    loadEarnings()
  }, [statusFilter, dateFilter, startDate, endDate])

  const handleViewEarning = (earning: EarningsData) => {
    setSelectedEarning(earning)
    setViewDialogOpen(true)
  }

  const handleRequestPayout = () => {
    setPayoutDialogOpen(true)
  }

  const handleExport = () => {
    console.log('Exporting earnings data...')
    // Add export logic here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Earnings & Payouts
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<GetApp />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="contained" startIcon={<RequestQuote />} onClick={handleRequestPayout}>
            Request Payout
          </Button>
        </Box>
      </Box>

      {/* Earnings Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {formatCurrency(stats.total_earnings)}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Net Earnings
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(stats.net_earnings)}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Amount
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {formatCurrency(stats.pending_amount)}
                  </Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Rides
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.total_rides}
                  </Typography>
                </Box>
                <Receipt sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Commission Rate Info */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Current commission rate: <strong>{(stats.commission_rate * 100).toFixed(1)}%</strong>
          {' • '}
          Average ride value: <strong>{formatCurrency(stats.avg_ride_value)}</strong>
        </Typography>
      </Alert>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Payment Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Date Range"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </TextField>
          </Grid>
          {dateFilter === 'custom' && (
            <>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setDateFilter('all')
                setStartDate('')
                setEndDate('')
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Earnings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Ride Details</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Ride Date</TableCell>
              <TableCell>Gross Amount</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>Net Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredEarnings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No earnings found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEarnings.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {earning.booking_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {earning.booking.pickup_location}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        → {earning.booking.dropoff_location}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {earning.booking.customer_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(earning.booking.ride_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(earning.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      -{formatCurrency(earning.commission_amount)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ({(earning.commission_rate * 100).toFixed(1)}%)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatCurrency(earning.net_amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={earning.payment_status}
                      color={getStatusColor(earning.payment_status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {earning.payment_date ? new Date(earning.payment_date).toLocaleDateString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleViewEarning(earning)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Earning Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Earning Details</DialogTitle>
        <DialogContent>
          {selectedEarning && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Booking ID:</strong> {selectedEarning.booking_id}</Typography>
                <Typography><strong>Customer:</strong> {selectedEarning.booking.customer_name}</Typography>
                <Typography><strong>Ride Date:</strong> {new Date(selectedEarning.booking.ride_date).toLocaleDateString()}</Typography>
                <Typography><strong>Pickup:</strong> {selectedEarning.booking.pickup_location}</Typography>
                <Typography><strong>Dropoff:</strong> {selectedEarning.booking.dropoff_location}</Typography>
                <Typography><strong>Status:</strong> {selectedEarning.booking.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment Details</Typography>
                <Typography><strong>Gross Amount:</strong> {formatCurrency(selectedEarning.amount)}</Typography>
                <Typography><strong>Commission Rate:</strong> {(selectedEarning.commission_rate * 100).toFixed(1)}%</Typography>
                <Typography><strong>Commission Amount:</strong> -{formatCurrency(selectedEarning.commission_amount)}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography><strong>Net Amount:</strong> {formatCurrency(selectedEarning.net_amount)}</Typography>
                <Typography><strong>Payment Status:</strong> {selectedEarning.payment_status}</Typography>
                {selectedEarning.payment_date && (
                  <Typography><strong>Payment Date:</strong> {new Date(selectedEarning.payment_date).toLocaleDateString()}</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Payout Request Dialog */}
      <Dialog open={payoutDialogOpen} onClose={() => setPayoutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Payout</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Request payout for your pending earnings. The payout will be processed within 3-5 business days.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Available for payout: <strong>{formatCurrency(stats.pending_amount)}</strong>
            </Typography>
          </Alert>
          <Typography variant="body2" color="textSecondary">
            Note: Minimum payout amount is CHF 20.00. Payouts are processed to your registered bank account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayoutDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => setPayoutDialogOpen(false)}
            disabled={stats.pending_amount < 20}
          >
            Request Payout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Earnings