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
  Rating,
  Snackbar,
  Skeleton,
} from '@mui/material'
import {
  Search,
  Visibility,
  Receipt,
  Star,
  LocationOn,
  Person,
  Payment,
  Refresh,
  Download,
  CheckCircle,
  AttachMoney,
  Timeline,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, PaymentStatus, BookingStatsResponse } from '../../api/bookings'

const CompletedBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)
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
  }, [page, rowsPerPage, searchTerm, paymentStatusFilter, typeFilter, dateFilter])

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: BookingFilters = {
        page: page + 1,
        limit: rowsPerPage,
        booking_status: BookingStatus.COMPLETED,
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
      console.error('Failed to load completed bookings:', error)
      showToast('Failed to load completed bookings', 'error')
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

  const handleViewReceipt = (booking: Booking) => {
    setSelectedBooking(booking)
    setReceiptDialogOpen(true)
  }

  const handleRefresh = () => {
    loadBookings()
    loadStats()
  }

  const handleExport = async () => {
    try {
      const filters: BookingFilters = {
        booking_status: BookingStatus.COMPLETED,
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
      a.download = `completed-bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Completed bookings exported successfully')
    } catch (error) {
      console.error('Failed to export completed bookings:', error)
      showToast('Failed to export completed bookings', 'error')
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Completed Bookings
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
                <CheckCircle color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Completed Trips</Typography>
                  <Typography variant="h4" color="success">
                    {loading ? <Skeleton width={60} /> : stats?.byStatus?.completed || 0}
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
                <AttachMoney color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4" color="primary">
                    {loading ? <Skeleton width={80} /> : `€${Number(stats?.revenue?.total || 0).toFixed(2)}`}
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
                <Payment color="info" fontSize="large" />
                <Box>
                  <Typography variant="h6">Paid Bookings</Typography>
                  <Typography variant="h4" color="info">
                    {loading ? <Skeleton width={60} /> : stats?.byPaymentStatus?.paid || 0}
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
                  <Typography variant="h6">Average Revenue</Typography>
                  <Typography variant="h4" color="secondary">
                    {loading ? <Skeleton width={80} /> : `€${Number(stats?.revenue?.average || 0).toFixed(2)}`}
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
                placeholder="Search completed bookings..."
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
                  {totalCount} completed trip(s)
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
              <TableCell>Driver</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Rating</TableCell>
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
                    No completed bookings found
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
                        Completed: {booking.actual_dropoff_time ? new Date(booking.actual_dropoff_time).toLocaleDateString() : 'N/A'}
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
                        {booking.route_fare?.distance_km || booking.actual_distance_km || 0}km • {booking.route_fare?.vehicle_type || 'Standard'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.assigned_driver ? `${booking.assigned_driver.first_name} ${booking.assigned_driver.last_name}` : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.assigned_driver ? `★${booking.assigned_driver.rating}` : 'N/A'} • {booking.assigned_car ? `${booking.assigned_car.make} ${booking.assigned_car.model}` : 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.actual_dropoff_time ? new Date(booking.actual_dropoff_time).toLocaleTimeString() : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Duration: {booking.actual_distance_km ? `${booking.actual_distance_km}km` : 'N/A'}
                    </Typography>
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
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Star fontSize="small" color="warning" />
                      <Typography variant="body2">
                        {booking.review?.rating || 'N/A'}
                      </Typography>
                    </Box>
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
                    <Tooltip title="View Receipt">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewReceipt(booking)}
                      >
                        <Receipt fontSize="small" />
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
        <DialogTitle>Completed Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.booking_reference}</Typography>
                <Typography><strong>Type:</strong> {selectedBooking.user?.user_type || 'customer'}</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
                <Typography><strong>Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</Typography>
                <Typography><strong>Completed:</strong> {selectedBooking.actual_dropoff_time ? new Date(selectedBooking.actual_dropoff_time).toLocaleString() : 'N/A'}</Typography>
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
                <Typography variant="h6" gutterBottom>Route & Timing</Typography>
                <Typography><strong>From:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address}</Typography>
                <Typography><strong>To:</strong> {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Pickup Time:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                <Typography><strong>Actual Pickup:</strong> {selectedBooking.actual_pickup_time ? new Date(selectedBooking.actual_pickup_time).toLocaleString() : 'N/A'}</Typography>
                <Typography><strong>Actual Dropoff:</strong> {selectedBooking.actual_dropoff_time ? new Date(selectedBooking.actual_dropoff_time).toLocaleString() : 'N/A'}</Typography>
                <Typography><strong>Distance:</strong> {selectedBooking.actual_distance_km || selectedBooking.route_fare?.distance_km || 0}km</Typography>
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
                  <Typography variant="h6" gutterBottom>Driver & Vehicle</Typography>
                  <Typography><strong>Driver:</strong> {selectedBooking.assigned_driver.first_name} {selectedBooking.assigned_driver.last_name}</Typography>
                  <Typography><strong>Driver Phone:</strong> {selectedBooking.assigned_driver.phone}</Typography>
                  <Typography><strong>Driver Rating:</strong> ★{selectedBooking.assigned_driver.rating}</Typography>
                  <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car ? `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model}` : 'N/A'}</Typography>
                  <Typography><strong>License Plate:</strong> {selectedBooking.assigned_car?.license_plate || 'N/A'}</Typography>
                </Grid>
              )}

              {selectedBooking.review && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Customer Review</Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={selectedBooking.review.rating} readOnly size="small" />
                    <Typography variant="body2">({selectedBooking.review.rating}/5)</Typography>
                  </Box>
                  <Typography><strong>Comment:</strong> {selectedBooking.review.comment}</Typography>
                  <Typography><strong>Date:</strong> {new Date(selectedBooking.review.created_at).toLocaleDateString()}</Typography>
                </Grid>
              )}

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

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Receipt</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Digital receipt for booking "{selectedBooking.booking_reference}"
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h5" gutterBottom>Alpen Getaway</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Premium Transport Services
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Booking Details</Typography>
                  <Typography>Reference: {selectedBooking.booking_reference}</Typography>
                  <Typography>Date: {new Date(selectedBooking.pickup_datetime).toLocaleDateString()}</Typography>
                  <Typography>Customer: {selectedBooking.passenger_name}</Typography>
                  <Typography>Passengers: {selectedBooking.passenger_count}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Trip Details</Typography>
                  <Typography>From: {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address}</Typography>
                  <Typography>To: {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                  <Typography>Distance: {selectedBooking.actual_distance_km || selectedBooking.route_fare?.distance_km || 0}km</Typography>
                  <Typography>Vehicle: {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Payment Summary</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Base Amount:</Typography>
                    <Typography>€{Number(selectedBooking.base_amount).toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Discount:</Typography>
                    <Typography>-€{Number(selectedBooking.discount_amount).toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Tax:</Typography>
                    <Typography>€{Number(selectedBooking.tax_amount).toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total Amount:</Typography>
                    <Typography variant="h6">€{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography>Payment Status:</Typography>
                    <Chip 
                      label={selectedBooking.payment_status} 
                      color={getPaymentStatusColor(selectedBooking.payment_status) as any}
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialogOpen(false)}>Close</Button>
          <Button variant="contained">Download PDF</Button>
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

export default CompletedBookings