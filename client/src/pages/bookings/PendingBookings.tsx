import React, { useState, useEffect } from 'react'
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
  TablePagination,
  Snackbar,
  Skeleton,
  Avatar,
} from '@mui/material'
import {
  Search,
  Visibility,
  Assignment,
  CheckCircle,
  Cancel,
  Warning,
  EventNote,
  Person,
  LocationOn,
  Schedule,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, PaymentStatus, BookingStatsResponse } from '../../api/bookings'

const PendingBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [setStats] = useState<BookingStatsResponse | null>(null)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // Load data on component mount and when filters change
  useEffect(() => {
    loadBookings()
    loadStats()
  }, [page, rowsPerPage, searchTerm, urgencyFilter])

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: BookingFilters = {
        page: page + 1,
        limit: rowsPerPage,
        booking_status: BookingStatus.PENDING,
        search: searchTerm || undefined,
      }

      const response = await bookingsAPI.getBookings(filters)
      setBookings(response.data)
      setTotalCount(response.total)
    } catch (error) {
      console.error('Failed to load pending bookings:', error)
      showToast('Failed to load pending bookings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await bookingsAPI.getBookingStats()
      // @ts-ignore
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

  const getUrgencyLevel = (pickupDate: string) => {
    const now = new Date()
    const pickup = new Date(pickupDate)
    const hoursUntilPickup = (pickup.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (hoursUntilPickup <= 12) return 'high'
    if (hoursUntilPickup <= 24) return 'medium'
    return 'low'
  }

  const filteredBookings = bookings.filter(booking => {
    const urgency = getUrgencyLevel(booking.pickup_datetime)
    return urgencyFilter === 'all' || urgency === urgencyFilter
  })

  const urgencyStats = {
    total: bookings.length,
    high: bookings.filter(b => getUrgencyLevel(b.pickup_datetime) === 'high').length,
    medium: bookings.filter(b => getUrgencyLevel(b.pickup_datetime) === 'medium').length,
    low: bookings.filter(b => getUrgencyLevel(b.pickup_datetime) === 'low').length,
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setViewDialogOpen(true)
  }

  const handleAssignBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setAssignDialogOpen(true)
  }

  const handleConfirmBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setConfirmDialogOpen(true)
  }

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancelDialogOpen(true)
  }

  const handleConfirmSubmit = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('confirm')
      await bookingsAPI.confirmBooking(selectedBooking.id)
      showToast('Booking confirmed successfully')
      loadBookings()
      setConfirmDialogOpen(false)
    } catch (error) {
      console.error('Failed to confirm booking:', error)
      showToast('Failed to confirm booking', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelSubmit = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('cancel')
      await bookingsAPI.cancelBooking(selectedBooking.id, 'Cancelled by admin')
      showToast('Booking cancelled successfully')
      loadBookings()
      setCancelDialogOpen(false)
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      showToast('Failed to cancel booking', 'error')
    } finally {
      setActionLoading(null)
    }
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
        booking_status: BookingStatus.PENDING,
        search: searchTerm || undefined,
      }

      const blob = await bookingsAPI.exportBookings(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `pending-bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Pending bookings exported successfully')
    } catch (error) {
      console.error('Failed to export pending bookings:', error)
      showToast('Failed to export pending bookings', 'error')
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Pending Bookings
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export List
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Pending
                  </Typography>
                  <Typography variant="h4">
                    {loading ? <Skeleton width={60} /> : urgencyStats.total}
                  </Typography>
                </Box>
                <EventNote sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
                    High Priority
                  </Typography>
                  <Typography variant="h4" color="error">
                    {loading ? <Skeleton width={60} /> : urgencyStats.high}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
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
                    Medium Priority
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {loading ? <Skeleton width={60} /> : urgencyStats.medium}
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
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
                    Low Priority
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {loading ? <Skeleton width={60} /> : urgencyStats.low}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Urgency"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
            >
              <MenuItem value="all">All Urgencies</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="low">Low Priority</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setUrgencyFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking Reference</TableCell>
              <TableCell>Passenger</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Pickup Time</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Urgency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No pending bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => {
                const urgency = getUrgencyLevel(booking.pickup_datetime)
                return (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.booking_reference}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Person fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{booking.passenger_name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {booking.passenger_phone}
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
                        <Typography variant="caption" color="textSecondary">
                          → {booking.route_fare?.to_location || booking.dropoff_address}
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
                      <Typography variant="body2" fontWeight="bold">
                        €{Number(booking.total_amount).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.payment_status}
                        color={booking.payment_status === PaymentStatus.PAID ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={urgency}
                        color={getUrgencyColor(urgency) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleViewBooking(booking)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Assign Driver">
                        <IconButton onClick={() => handleAssignBooking(booking)}>
                          <Assignment />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Confirm Booking">
                        <IconButton 
                          onClick={() => handleConfirmBooking(booking)}
                          color="success"
                          disabled={actionLoading !== null}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel Booking">
                        <IconButton 
                          onClick={() => handleCancelBooking(booking)}
                          color="error"
                          disabled={actionLoading !== null}
                        >
                          <Cancel />
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
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.booking_reference}</Typography>
                <Typography><strong>Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</Typography>
                <Typography><strong>Pickup:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                <Typography><strong>Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
                <Typography><strong>Payment Status:</strong> {selectedBooking.payment_status}</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
                <Typography><strong>Urgency:</strong> {getUrgencyLevel(selectedBooking.pickup_datetime)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Passenger Information</Typography>
                <Typography><strong>Name:</strong> {selectedBooking.passenger_name}</Typography>
                <Typography><strong>Phone:</strong> {selectedBooking.passenger_phone}</Typography>
                <Typography><strong>Email:</strong> {selectedBooking.passenger_email || 'N/A'}</Typography>
                <Typography><strong>Passenger Count:</strong> {selectedBooking.passenger_count}</Typography>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Route Information</Typography>
                <Typography><strong>From:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address}</Typography>
                <Typography><strong>To:</strong> {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Vehicle Type:</strong> {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
              </Grid>
              {(selectedBooking.needs_infant_seat || selectedBooking.needs_child_seat || selectedBooking.needs_wheelchair_access || selectedBooking.needs_medical_equipment || selectedBooking.special_instructions) && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Special Requirements</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedBooking.needs_infant_seat && <Chip label="Infant Seat" size="small" />}
                    {selectedBooking.needs_child_seat && <Chip label="Child Seat" size="small" />}
                    {selectedBooking.needs_wheelchair_access && <Chip label="Wheelchair Access" size="small" />}
                    {selectedBooking.needs_medical_equipment && <Chip label="Medical Equipment" size="small" />}
                  </Box>
                  {selectedBooking.special_instructions && (
                    <Typography sx={{ mt: 1 }}><strong>Instructions:</strong> {selectedBooking.special_instructions}</Typography>
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
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Driver & Vehicle</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This will assign a driver and vehicle to the booking and change its status to "assigned".
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Select Driver"
                defaultValue=""
                sx={{ mb: 2 }}
              >
                <MenuItem value="driver1">John Smith (Rating: 4.8★)</MenuItem>
                <MenuItem value="driver2">Jane Doe (Rating: 4.9★)</MenuItem>
                <MenuItem value="driver3">Mike Johnson (Rating: 4.7★)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Select Vehicle"
                defaultValue=""
              >
                <MenuItem value="car1">Mercedes E-Class (ABC-123)</MenuItem>
                <MenuItem value="car2">BMW 5 Series (DEF-456)</MenuItem>
                <MenuItem value="car3">Audi A6 (GHI-789)</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
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

      {/* Confirm Booking Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Are you sure you want to confirm booking "{selectedBooking.booking_reference}"?
                This will move the booking to confirmed status.
              </Alert>
              <Typography variant="h6" gutterBottom>Booking Summary:</Typography>
              <Typography><strong>Customer:</strong> {selectedBooking.passenger_name}</Typography>
              <Typography><strong>Route:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address} → {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
              <Typography><strong>Pickup:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
              <Typography><strong>Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
              <Typography><strong>Payment:</strong> {selectedBooking.payment_status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={actionLoading === 'confirm'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleConfirmSubmit}
            disabled={actionLoading === 'confirm'}
            startIcon={actionLoading === 'confirm' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'confirm' ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Are you sure you want to cancel booking "{selectedBooking.booking_reference}"?
                This action may have financial implications.
              </Alert>
              <Typography variant="h6" gutterBottom>Booking Details:</Typography>
              <Typography><strong>Customer:</strong> {selectedBooking.passenger_name}</Typography>
              <Typography><strong>Route:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address} → {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
              <Typography><strong>Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
              
              <TextField
                fullWidth
                label="Cancellation Reason"
                multiline
                rows={3}
                placeholder="Please provide a reason for cancellation..."
                sx={{ mt: 2, mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Refund Status"
                defaultValue="pending"
              >
                <MenuItem value="pending">Pending Review</MenuItem>
                <MenuItem value="full_refund">Full Refund</MenuItem>
                <MenuItem value="partial_refund">Partial Refund</MenuItem>
                <MenuItem value="no_refund">No Refund</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={actionLoading === 'cancel'}>
            Keep Booking
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleCancelSubmit}
            disabled={actionLoading === 'cancel'}
            startIcon={actionLoading === 'cancel' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Booking'}
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

export default PendingBookings