// @ts-nocheck
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
import { useEarnings, useEarningsStats } from '../../hooks/useEarnings'
import { useAuth } from '../../hooks/useAuth'

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
  const [selectedEarning, setSelectedEarning] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false)
  
  const { getCurrentUserCompanyId } = useAuth()
  const companyId = getCurrentUserCompanyId()
  
  // Use real earnings hooks
  const {
    earnings,
    loading,
    error,
    pagination,
    fetchEarnings,
  } = useEarnings({
    company_id: companyId,
    page: 1,
    limit: 50,
  })

  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useEarningsStats(companyId)

  // Filter earnings based on search and filters
  const filteredEarnings = earnings.filter(earning => {
    const matchesSearch = searchTerm === '' || 
      earning.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.booking?.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.company?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || earning.status === statusFilter
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const earningDate = new Date(earning.earned_at || earning.created_at)
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

  // Handle filter changes - refetch data when filters change
  useEffect(() => {
    const filters: any = {}
    
    if (statusFilter !== 'all') {
      filters.status = statusFilter
    }
    
    if (searchTerm !== '') {
      filters.search = searchTerm
    }
    
    if (dateFilter === 'custom' && startDate && endDate) {
      filters.date_from = startDate
      filters.date_to = endDate
    } else if (dateFilter !== 'all') {
      const now = new Date()
      switch (dateFilter) {
        case 'today':
          filters.date_from = now.toISOString().split('T')[0]
          filters.date_to = now.toISOString().split('T')[0]
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filters.date_from = weekAgo.toISOString().split('T')[0]
          filters.date_to = now.toISOString().split('T')[0]
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          filters.date_from = monthAgo.toISOString().split('T')[0]
          filters.date_to = now.toISOString().split('T')[0]
          break
      }
    }
    
    fetchEarnings(filters)
  }, [statusFilter, dateFilter, startDate, endDate, searchTerm, fetchEarnings])

  const handleViewEarning = (earning: any) => {
    setSelectedEarning(earning)
    setViewDialogOpen(true)
  }

  const handleRequestPayout = () => {
    setPayoutDialogOpen(true)
  }

  const handleExport = () => {
    try {
      // Create CSV content
      const csvContent = [
        // Header row
        ['Reference Number', 'Booking ID', 'Earning Type', 'Company', 'Earned Date', 'Gross Amount (CHF)', 'Commission Rate (%)', 'Commission Amount (CHF)', 'Platform Fee (CHF)', 'Tax Amount (CHF)', 'Net Earnings (CHF)', 'Status', 'Payment Date', 'Notes'].join(','),
        // Data rows
        ...filteredEarnings.map(earning => [
          `"${earning.reference_number || ''}"`,
          `"${earning.booking?.booking_reference || 'N/A'}"`,
          `"${earning.earnings_type?.replace('_', ' ').toUpperCase() || ''}"`,
          `"${earning.company?.company_name || 'Unknown'}"`,
          `"${new Date(earning.earned_at || earning.created_at).toLocaleDateString()}"`,
          `"${earning.gross_amount || 0}"`,
          `"${earning.commission_rate || 0}"`,
          `"${earning.commission_amount || 0}"`,
          `"${earning.platform_fee || 0}"`,
          `"${earning.tax_amount || 0}"`,
          `"${earning.net_earnings || 0}"`,
          `"${earning.status || ''}"`,
          `"${earning.paid_at ? new Date(earning.paid_at).toLocaleDateString() : 'Not Paid'}"`,
          `"${earning.notes || ''}"`
        ].join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `company-earnings-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log(`Exported ${filteredEarnings.length} earnings records to CSV`)
    } catch (error) {
      console.error('Error exporting earnings:', error)
      alert('Failed to export earnings data. Please try again.')
    }
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
                    {statsLoading ? <CircularProgress size={24} /> : formatCurrency(stats?.totalAmount || 0)}
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
                    {statsLoading ? <CircularProgress size={24} /> : formatCurrency(stats?.totalAmount || 0)}
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
                    {statsLoading ? <CircularProgress size={24} /> : formatCurrency(stats?.byStatus?.pending?.amount || 0)}
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
                    {statsLoading ? <CircularProgress size={24} /> : (stats?.totalEarnings || 0)}
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
          Total Commission: <strong>{formatCurrency(stats?.totalCommission || 0)}</strong>
          {' • '}
          Total Earnings: <strong>{stats?.totalEarnings || 0} transactions</strong>
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
      {(error || statsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || statsError}
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
                      {earning.booking?.booking_reference || earning.reference_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {earning.earnings_type.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {earning.booking ? `Booking: ${earning.booking.booking_reference}` : 'No booking info'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {earning.company?.company_name || 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(earning.earned_at || earning.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(earning.gross_amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      -{formatCurrency(earning.commission_amount)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ({earning.commission_rate}%)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatCurrency(earning.net_earnings)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={earning.status}
                      color={getStatusColor(earning.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {earning.paid_at ? new Date(earning.paid_at).toLocaleDateString() : '-'}
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
                <Typography variant="h6" gutterBottom>Earning Information</Typography>
                <Typography><strong>Reference:</strong> {selectedEarning.reference_number}</Typography>
                <Typography><strong>Type:</strong> {selectedEarning.earnings_type?.replace('_', ' ').toUpperCase()}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedEarning.earned_at || selectedEarning.created_at).toLocaleDateString()}</Typography>
                {selectedEarning.booking && (
                  <>
                    <Typography><strong>Booking:</strong> {selectedEarning.booking.booking_reference}</Typography>
                  </>
                )}
                <Typography><strong>Company:</strong> {selectedEarning.company?.company_name || 'Unknown'}</Typography>
                <Typography><strong>Status:</strong> {selectedEarning.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment Details</Typography>
                <Typography><strong>Gross Amount:</strong> {formatCurrency(selectedEarning.gross_amount)}</Typography>
                <Typography><strong>Commission Rate:</strong> {selectedEarning.commission_rate}%</Typography>
                <Typography><strong>Commission Amount:</strong> -{formatCurrency(selectedEarning.commission_amount)}</Typography>
                <Typography><strong>Platform Fee:</strong> -{formatCurrency(selectedEarning.platform_fee || 0)}</Typography>
                <Typography><strong>Tax Amount:</strong> -{formatCurrency(selectedEarning.tax_amount || 0)}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography><strong>Net Earnings:</strong> {formatCurrency(selectedEarning.net_earnings)}</Typography>
                {selectedEarning.paid_at && (
                  <Typography><strong>Paid At:</strong> {new Date(selectedEarning.paid_at).toLocaleDateString()}</Typography>
                )}
                {selectedEarning.notes && (
                  <Typography><strong>Notes:</strong> {selectedEarning.notes}</Typography>
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
              Available for payout: <strong>{formatCurrency(stats?.byStatus?.pending?.amount || 0)}</strong>
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
            disabled={(stats?.byStatus?.pending?.amount || 0) < 20}
          >
            Request Payout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Earnings