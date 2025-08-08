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
  Assignment,
  CheckCircle,
  LocationOn,
  Person,
  Payment,
  Refresh,
  Download,
  EventNote,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, PaymentStatus, BookingStatsResponse } from '../../api/bookings'

const ConfirmedBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
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
  }, [page, rowsPerPage, searchTerm, priorityFilter, paymentStatusFilter, typeFilter])

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: BookingFilters = {
        page: page + 1,
        limit: rowsPerPage,
        booking_status: BookingStatus.CONFIRMED,
        search: searchTerm || undefined,
        payment_status: paymentStatusFilter || undefined,
        user_type: typeFilter || undefined,
      }

      const response = await bookingsAPI.getBookings(filters)
      setBookings(response.data)
      setTotalCount(response.total)
    } catch (error) {
      console.error('Failed to load confirmed bookings:', error)
      showToast('Failed to load confirmed bookings', 'error')
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

  const getPriorityLevel = (pickupDate: string) => {
    const now = new Date()
    const pickup = new Date(pickupDate)
    const hoursUntilPickup = (pickup.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (hoursUntilPickup <= 12) return 'high'
    if (hoursUntilPickup <= 24) return 'medium'
    return 'low'
  }

  const filteredBookings = bookings.filter(booking => {
    const priority = getPriorityLevel(booking.pickup_datetime)
    return priorityFilter === '' || priority === priorityFilter
  })

  const priorityStats = {
    total: stats?.byStatus?.confirmed || 0,
    readyForAssignment: bookings.filter(b => b.payment_status === PaymentStatus.PAID).length,
    pendingPayment: bookings.filter(b => b.payment_status === PaymentStatus.PENDING).length,
    highPriority: bookings.filter(b => getPriorityLevel(b.pickup_datetime) === 'high').length,
    totalRevenue: bookings.reduce((sum, b) => sum + Number(b.total_amount), 0),
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

  const handleAssignBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setAssignDialogOpen(true)
  }

  const handleAssignSubmit = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('assign')
      // TODO: Get actual driver and car IDs from form
      await bookingsAPI.assignDriverAndCar(selectedBooking.id, {
        driver_id: 'driver1',
        car_id: 'car1'
      })
      showToast('Driver and car assigned successfully')
      loadBookings()
      setAssignDialogOpen(false)
    } catch (error) {
      console.error('Failed to assign driver and car:', error)
      showToast('Failed to assign driver and car', 'error')
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
        booking_status: BookingStatus.CONFIRMED,
        search: searchTerm || undefined,
        payment_status: paymentStatusFilter || undefined,
        user_type: typeFilter || undefined,
      }

      const blob = await bookingsAPI.exportBookings(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `confirmed-bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Confirmed bookings exported successfully')
    } catch (error) {
      console.error('Failed to export confirmed bookings:', error)
      showToast('Failed to export confirmed bookings', 'error')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'error'
      case 'refunded': return 'info'
      default: return 'default'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'direct': return 'primary'
      case 'affiliate': return 'secondary'
      case 'b2b': return 'info'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Confirmed Bookings
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
                <CheckCircle color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Confirmed</Typography>
                  <Typography variant="h4" color="primary">
                    {loading ? <Skeleton width={60} /> : priorityStats.total}
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
                <Assignment color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Ready for Assignment</Typography>
                  <Typography variant="h4" color="success">
                    {loading ? <Skeleton width={60} /> : priorityStats.readyForAssignment}
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
                <Payment color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h6">Pending Payment</Typography>
                  <Typography variant="h4" color="warning">
                    {loading ? <Skeleton width={60} /> : priorityStats.pendingPayment}
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
                <EventNote color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4" color="secondary">
                    {loading ? <Skeleton width={80} /> : `€${priorityStats.totalRevenue.toFixed(2)}`}
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
            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                select
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                select
                label="Payment"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
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
                <MenuItem value="direct">Direct</MenuItem>
                <MenuItem value="affiliate">Affiliate</MenuItem>
                <MenuItem value="b2b">B2B</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3} md={3}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {totalCount} booking(s) found
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
              <TableCell>Schedule</TableCell>
              <TableCell>Priority</TableCell>
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
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No confirmed bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => {
                const priority = getPriorityLevel(booking.pickup_datetime)
                return (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {booking.booking_reference}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {booking.id}
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
                            {booking.passenger_email || booking.passenger_phone}
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
                          {booking.route_fare?.vehicle_type || 'Standard'} • {booking.passenger_count} pax
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(booking.pickup_datetime).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(booking.pickup_datetime).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={priority}
                        color={getPriorityColor(priority) as any}
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
                      <Tooltip title="Assign Driver & Vehicle">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleAssignBooking(booking)}
                          disabled={booking.payment_status !== PaymentStatus.PAID}
                        >
                          <Assignment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })
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
        <DialogTitle>Confirmed Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.booking_reference}</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
                <Typography><strong>Priority:</strong> {getPriorityLevel(selectedBooking.pickup_datetime)}</Typography>
                <Typography><strong>Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</Typography>
                <Typography><strong>Updated:</strong> {new Date(selectedBooking.updated_at).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Passenger Information</Typography>
                <Typography><strong>Name:</strong> {selectedBooking.passenger_name}</Typography>
                <Typography><strong>Email:</strong> {selectedBooking.passenger_email || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {selectedBooking.passenger_phone}</Typography>
                <Typography><strong>Passenger Count:</strong> {selectedBooking.passenger_count}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Route Details</Typography>
                <Typography><strong>From:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address}</Typography>
                <Typography><strong>To:</strong> {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Pickup:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                <Typography><strong>Vehicle Type:</strong> {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
                {selectedBooking.route_fare && (
                  <Typography><strong>Distance:</strong> {selectedBooking.route_fare.distance_km}km</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing Details</Typography>
                <Typography><strong>Base Amount:</strong> €{Number(selectedBooking.base_amount).toFixed(2)}</Typography>
                <Typography><strong>Discount:</strong> €{Number(selectedBooking.discount_amount).toFixed(2)}</Typography>
                <Typography><strong>Tax:</strong> €{Number(selectedBooking.tax_amount).toFixed(2)}</Typography>
                <Typography><strong>Total Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
                <Typography><strong>Payment Status:</strong> {selectedBooking.payment_status}</Typography>
              </Grid>
              {(selectedBooking.needs_infant_seat || selectedBooking.needs_child_seat || selectedBooking.needs_wheelchair_access || selectedBooking.needs_medical_equipment || selectedBooking.special_instructions) && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Special Requirements</Typography>
                  {selectedBooking.needs_infant_seat && <Typography>• Infant seat required</Typography>}
                  {selectedBooking.needs_child_seat && <Typography>• Child seat required</Typography>}
                  {selectedBooking.needs_wheelchair_access && <Typography>• Wheelchair access required</Typography>}
                  {selectedBooking.needs_medical_equipment && <Typography>• Medical equipment space required</Typography>}
                  {selectedBooking.special_instructions && (
                    <Typography><strong>Instructions:</strong> {selectedBooking.special_instructions}</Typography>
                  )}
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Driver Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assign Driver & Vehicle</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                Assigning driver and vehicle to confirmed booking "{selectedBooking.booking_reference}"
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Booking Details</Typography>
                  <Typography><strong>Customer:</strong> {selectedBooking.passenger_name}</Typography>
                  <Typography><strong>Route:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address} → {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                  <Typography><strong>Pickup:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                  <Typography><strong>Passengers:</strong> {selectedBooking.passenger_count}</Typography>
                  <Typography><strong>Vehicle Type:</strong> {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
                  {selectedBooking.route_fare && (
                    <Typography><strong>Distance:</strong> {selectedBooking.route_fare.distance_km}km</Typography>
                  )}
                  <Typography><strong>Priority:</strong> {getPriorityLevel(selectedBooking.pickup_datetime)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Assignment</Typography>
                  <TextField
                    fullWidth
                    select
                    label="Select Driver"
                    defaultValue=""
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="driver1">John Smith (★4.8) - Available - {selectedBooking.route_fare?.vehicle_type || 'Standard'}</MenuItem>
                    <MenuItem value="driver2">Jane Doe (★4.9) - Available - {selectedBooking.route_fare?.vehicle_type || 'Standard'}</MenuItem>
                    <MenuItem value="driver3">Mike Johnson (★4.7) - Available - {selectedBooking.route_fare?.vehicle_type || 'Standard'}</MenuItem>
                    <MenuItem value="driver4">Sarah Wilson (★4.6) - Available - {selectedBooking.route_fare?.vehicle_type || 'Standard'}</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label="Select Vehicle"
                    defaultValue=""
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="car1">Mercedes E-Class (ABC-123) - {selectedBooking.route_fare?.vehicle_type || 'Standard'}</MenuItem>
                    <MenuItem value="car2">BMW 5 Series (DEF-456) - {selectedBooking.route_fare?.vehicle_type || 'Standard'}</MenuItem>
                    <MenuItem value="car3">Audi A6 (GHI-789) - {selectedBooking.route_fare?.vehicle_type || 'Standard'}</MenuItem>
                    <MenuItem value="car4">VW Passat (JKL-012) - Economy</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Assignment Notes"
                    multiline
                    rows={3}
                    placeholder="Any special instructions for the driver..."
                    defaultValue={selectedBooking.special_instructions || ''}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} disabled={actionLoading === 'assign'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAssignSubmit}
            disabled={actionLoading === 'assign'}
            startIcon={actionLoading === 'assign' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'assign' ? 'Assigning...' : 'Assign Booking'}
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

export default ConfirmedBookings