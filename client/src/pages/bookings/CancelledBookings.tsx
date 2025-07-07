import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
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
  Alert,
  Tooltip,
  CircularProgress,
  Avatar,
  Divider,
  Snackbar,
  Skeleton,
} from '@mui/material'
import {
  Search,
  Visibility,
  Cancel,
  LocationOn,
  Person,
  Refresh,
  Download,
  Warning,
  MoneyOff,
  Timeline,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, PaymentStatus, BookingStatsResponse } from '../../api/bookings'

const CancelledBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [reasonFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [stats, setStats] = useState<BookingStatsResponse | null>(null)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // Load data on component mount and when filters change
  useEffect(() => {
    loadBookings()
    loadStats()
  }, [page, rowsPerPage, searchTerm, paymentStatusFilter, typeFilter, reasonFilter, dateFilter])

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: BookingFilters = {
        page: page + 1,
        limit: rowsPerPage,
        booking_status: BookingStatus.CANCELLED,
        search: searchTerm || undefined,
        payment_status: paymentStatusFilter || undefined,
        user_type: typeFilter || undefined,
      }

      // Handle date filter
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0]
        filters.date_from = today
        filters.date_to = today
      } else if (dateFilter === 'week') {
        const today = new Date()
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        filters.date_from = weekAgo.toISOString().split('T')[0]
        filters.date_to = today.toISOString().split('T')[0]
      } else if (dateFilter === 'month') {
        const today = new Date()
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        filters.date_from = monthAgo.toISOString().split('T')[0]
        filters.date_to = today.toISOString().split('T')[0]
      }

      const response = await bookingsAPI.getBookings(filters)
      setBookings(response.data)
      setTotalCount(response.total)
    } catch (error) {
      console.error('Failed to load cancelled bookings:', error)
      showToast('Failed to load cancelled bookings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await bookingsAPI.getBookingStats()
      setStats(response)
    } catch (error) {
      console.error('Failed to load booking stats:', error)
    }
  }

  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setViewDialogOpen(true)
  }

  const handleRefundRequest = (booking: Booking) => {
    setSelectedBooking(booking)
    setRefundDialogOpen(true)
  }

  const handleProcessRefund = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('refund')
      await bookingsAPI.updatePaymentStatus(selectedBooking.id, PaymentStatus.REFUNDED)
      showToast('Refund processed successfully')
      loadBookings()
      setRefundDialogOpen(false)
    } catch (error) {
      console.error('Failed to process refund:', error)
      showToast('Failed to process refund', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRefresh = () => {
    loadBookings()
    loadStats()
  }

  const handleExport = async () => {
    try {
      const filters: BookingFilters = {
        booking_status: BookingStatus.CANCELLED,
        search: searchTerm || undefined,
        payment_status: paymentStatusFilter || undefined,
        user_type: typeFilter || undefined,
      }

      // Handle date filter
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0]
        filters.date_from = today
        filters.date_to = today
      } else if (dateFilter === 'week') {
        const today = new Date()
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        filters.date_from = weekAgo.toISOString().split('T')[0]
        filters.date_to = today.toISOString().split('T')[0]
      } else if (dateFilter === 'month') {
        const today = new Date()
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        filters.date_from = monthAgo.toISOString().split('T')[0]
        filters.date_to = today.toISOString().split('T')[0]
      }

      const blob = await bookingsAPI.exportBookings(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `cancelled-bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Cancelled bookings exported successfully')
    } catch (error) {
      console.error('Failed to export cancelled bookings:', error)
      showToast('Failed to export cancelled bookings', 'error')
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'success'
      case PaymentStatus.PENDING:
        return 'warning'
      case PaymentStatus.FAILED:
        return 'error'
      case PaymentStatus.REFUNDED:
        return 'info'
      default:
        return 'default'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer': return 'primary'
      case 'affiliate': return 'secondary'
      case 'b2b': return 'info'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Cancelled Bookings
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Cancel color="error" fontSize="large" />
                <Box>
                  <Typography variant="h6">Cancelled Trips</Typography>
                  <Typography variant="h4" color="error">
                    {loading ? <Skeleton width={60} /> : stats?.byStatus?.cancelled || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MoneyOff color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h6">Refunded</Typography>
                  <Typography variant="h4" color="warning">
                    {loading ? <Skeleton width={60} /> : stats?.byPaymentStatus?.refunded || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Warning color="info" fontSize="large" />
                <Box>
                  <Typography variant="h6">Pending Refund</Typography>
                  <Typography variant="h4" color="info">
                    {loading ? <Skeleton width={60} /> : (stats?.byStatus?.cancelled || 0) - (stats?.byPaymentStatus?.refunded || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Timeline color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Loss Revenue</Typography>
                  <Typography variant="h4" color="secondary">
                    {loading ? <Skeleton width={80} /> : `€${((stats?.byStatus?.cancelled || 0) * 50).toFixed(2)}`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search cancelled bookings..."
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
            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                select
                label="Payment Status"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={PaymentStatus.PAID}>Paid</MenuItem>
                <MenuItem value={PaymentStatus.PENDING}>Pending</MenuItem>
                <MenuItem value={PaymentStatus.FAILED}>Failed</MenuItem>
                <MenuItem value={PaymentStatus.REFUNDED}>Refunded</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="affiliate">Affiliate</MenuItem>
                <MenuItem value="b2b">B2B</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                select
                label="Date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3} md={3}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {totalCount} cancelled trip(s)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Cancelled</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No cancelled bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {booking.booking_reference}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Cancelled: {new Date(booking.updated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {booking.passenger_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {booking.passenger_count} pax • {booking.user?.user_type || 'customer'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <LocationOn fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                        {booking.route_fare?.from_location || booking.pickup_address}
                      </Typography>
                      <Typography variant="body2">
                        → {booking.route_fare?.to_location || booking.dropoff_address}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.route_fare?.distance_km || 0}km • {booking.route_fare?.vehicle_type || 'Standard'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(booking.updated_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(booking.updated_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Admin Cancel"
                      color="warning"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.payment_status}
                      color={getPaymentStatusColor(booking.payment_status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      €{Number(booking.total_amount).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.user?.user_type || 'customer'}
                      color={getTypeColor(booking.user?.user_type || 'customer') as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewBooking(booking)}
                        color="info"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Process Refund">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleRefundRequest(booking)}
                        disabled={booking.payment_status === PaymentStatus.REFUNDED}
                      >
                        <MoneyOff fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
            // @ts-ignore
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Booking Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Cancelled Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.booking_reference}</Typography>
                <Typography><strong>Type:</strong> {selectedBooking.user?.user_type || 'customer'}</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
                <Typography><strong>Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</Typography>
                <Typography><strong>Cancelled:</strong> {new Date(selectedBooking.updated_at).toLocaleString()}</Typography>
                <Typography><strong>Cancellation Reason:</strong> Admin Cancellation</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Typography><strong>Name:</strong> {selectedBooking.passenger_name}</Typography>
                <Typography><strong>Email:</strong> {selectedBooking.passenger_email || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {selectedBooking.passenger_phone}</Typography>
                <Typography><strong>Passengers:</strong> {selectedBooking.passenger_count}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Route Information</Typography>
                <Typography><strong>From:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address}</Typography>
                <Typography><strong>To:</strong> {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Scheduled Pickup:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                <Typography><strong>Distance:</strong> {selectedBooking.route_fare?.distance_km || 0}km</Typography>
                <Typography><strong>Vehicle Type:</strong> {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment Information</Typography>
                <Typography><strong>Base Amount:</strong> €{Number(selectedBooking.base_amount).toFixed(2)}</Typography>
                <Typography><strong>Discount:</strong> €{Number(selectedBooking.discount_amount).toFixed(2)}</Typography>
                <Typography><strong>Tax:</strong> €{Number(selectedBooking.tax_amount).toFixed(2)}</Typography>
                <Typography><strong>Total Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
                <Typography><strong>Payment Status:</strong> {selectedBooking.payment_status}</Typography>
              </Grid>

              {selectedBooking.assigned_driver && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Assigned Driver (at cancellation)</Typography>
                  <Typography><strong>Driver:</strong> {selectedBooking.assigned_driver.first_name} {selectedBooking.assigned_driver.last_name}</Typography>
                  <Typography><strong>Driver Phone:</strong> {selectedBooking.assigned_driver.phone}</Typography>
                  <Typography><strong>Driver Rating:</strong> ★{selectedBooking.assigned_driver.rating}</Typography>
                  <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car ? `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model}` : 'N/A'}</Typography>
                  <Typography><strong>License Plate:</strong> {selectedBooking.assigned_car?.license_plate || 'N/A'}</Typography>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Cancellation Details</Typography>
                <Typography><strong>Cancelled By:</strong> Admin</Typography>
                <Typography><strong>Cancellation Time:</strong> {new Date(selectedBooking.updated_at).toLocaleString()}</Typography>
                <Typography><strong>Reason:</strong> Administrative cancellation</Typography>
                <Typography><strong>Refund Status:</strong> {selectedBooking.payment_status === PaymentStatus.REFUNDED ? 'Processed' : 'Pending'}</Typography>
                {selectedBooking.payment_status === PaymentStatus.REFUNDED && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Refund has been processed and customer has been notified.
                  </Alert>
                )}
              </Grid>

              {selectedBooking.special_instructions && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Special Instructions</Typography>
                  <Typography>{selectedBooking.special_instructions}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Refund</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                Processing refund for booking "{selectedBooking.booking_reference}"
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Refund Details</Typography>
                  <Typography><strong>Customer:</strong> {selectedBooking.passenger_name}</Typography>
                  <Typography><strong>Original Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
                  <Typography><strong>Current Status:</strong> {selectedBooking.payment_status}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Refund Amount (€)"
                    type="number"
                    defaultValue={Number(selectedBooking.total_amount).toFixed(2)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    select
                    label="Refund Reason"
                    defaultValue="admin_cancellation"
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="admin_cancellation">Administrative Cancellation</MenuItem>
                    <MenuItem value="driver_unavailable">Driver Unavailable</MenuItem>
                    <MenuItem value="customer_request">Customer Request</MenuItem>
                    <MenuItem value="service_issue">Service Issue</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                  
                  <TextField
                    fullWidth
                    label="Refund Notes"
                    multiline
                    rows={3}
                    placeholder="Add any additional notes about this refund..."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Alert severity="warning">
                    This action will process a refund and notify the customer. This action cannot be undone.
                  </Alert>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)} disabled={actionLoading === 'refund'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={() => handleProcessRefund(// @ts-ignore
                Number(selectedBooking?.total_amount || 0), 'admin_cancellation')}
            disabled={actionLoading === 'refund'}
            startIcon={actionLoading === 'refund' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'refund' ? 'Processing...' : 'Process Refund'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CancelledBookings