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
  LinearProgress,
  Snackbar,
  Skeleton,
} from '@mui/material'
import {
  Search,
  Visibility,
  DirectionsCar,
  Phone,
  Message,
  Navigation,
  LocationOn,
  Person,
  CheckCircle,
  Refresh,
  Download,
  Timeline,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, BookingStatsResponse } from '../../api/bookings'

// Interface removed since we're using the main Booking interface from API

const InProgressBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('')
  const [tripStatusFilter, setTripStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
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
  }, [page, rowsPerPage, searchTerm, urgencyFilter, tripStatusFilter, typeFilter])

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: BookingFilters = {
        page: page + 1,
        limit: rowsPerPage,
        booking_status: BookingStatus.IN_PROGRESS,
        search: searchTerm || undefined,
        user_type: typeFilter || undefined,
      }

      const response = await bookingsAPI.getBookings(filters)
      setBookings(response.data)
      setTotalCount(response.total)
    } catch (error) {
      console.error('Failed to load in-progress bookings:', error)
      showToast('Failed to load in-progress bookings', 'error')
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

  // Auto-refresh for real-time updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadBookings()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

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

  const handleTrackTrip = (booking: Booking) => {
    setSelectedBooking(booking)
    setTrackingDialogOpen(true)
  }

  const handleContactDriver = (booking: Booking) => {
    setSelectedBooking(booking)
    setContactDialogOpen(true)
  }

  const handleCompleteTrip = async (booking: Booking) => {
    try {
      setActionLoading('complete')
      await bookingsAPI.completeTrip(booking.id)
      showToast('Trip completed successfully')
      loadBookings()
    } catch (error) {
      console.error('Failed to complete trip:', error)
      showToast('Failed to complete trip', 'error')
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
        booking_status: BookingStatus.IN_PROGRESS,
        search: searchTerm || undefined,
        user_type: typeFilter || undefined,
      }

      const blob = await bookingsAPI.exportBookings(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `in-progress-bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('In-progress bookings exported successfully')
    } catch (error) {
      console.error('Failed to export in-progress bookings:', error)
      showToast('Failed to export in-progress bookings', 'error')
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          In Progress Bookings
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant={autoRefresh ? "contained" : "outlined"}
            size="small"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
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
                <DirectionsCar color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Active Trips</Typography>
                  <Typography variant="h4" color="primary">
                    {loading ? <Skeleton width={60} /> : stats?.byStatus?.in_progress || 0}
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
                <Navigation color="info" fontSize="large" />
                <Box>
                  <Typography variant="h6">All Assigned</Typography>
                  <Typography variant="h4" color="info">
                    {loading ? <Skeleton width={60} /> : stats?.byStatus?.assigned || 0}
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
                <LocationOn color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Completed Today</Typography>
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
                <Timeline color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4" color="secondary">
                    {loading ? <Skeleton width={80} /> : `€${Number(stats?.revenue?.total || 0).toFixed(2)}`}
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
                placeholder="Search trips, customers, drivers..."
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
                label="Trip Status"
                value={tripStatusFilter}
                onChange={(e) => setTripStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="just_started">Just Started</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="near_destination">Near Destination</MenuItem>
                <MenuItem value="delayed">Delayed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                select
                label="Urgency"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
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
                  {totalCount} active trip(s)
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
              <TableCell>Trip</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>ETA</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No active trips found
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
                          Started: {booking.actual_pickup_time ? new Date(booking.actual_pickup_time).toLocaleTimeString() : 'Pending'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Pickup: {new Date(booking.pickup_datetime).toLocaleTimeString()}
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
                          Vehicle: {booking.route_fare?.vehicle_type || 'Standard'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {booking.assigned_driver ? `${booking.assigned_driver.first_name} ${booking.assigned_driver.last_name}` : 'Not assigned'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {booking.assigned_driver ? `★${booking.assigned_driver.rating}` : 'N/A'} • {booking.assigned_car ? `${booking.assigned_car.make} ${booking.assigned_car.model}` : 'No car'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {booking.assigned_car?.license_plate || 'No plate'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <LinearProgress 
                            variant="determinate" 
                            value={booking.actual_pickup_time ? 50 : 10} 
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" fontWeight="bold">
                            {booking.actual_pickup_time ? '50%' : '10%'}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {booking.route_fare?.distance_km || 0}km total
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<DirectionsCar fontSize="small" />}
                        label="In Progress"
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(booking.pickup_datetime).toLocaleTimeString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        €{Number(booking.total_amount).toFixed(2)}
                      </Typography>
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
                      <Tooltip title="Live Tracking">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleTrackTrip(booking)}
                        >
                          <Navigation fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Contact Driver">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleContactDriver(booking)}
                        >
                          <Phone fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Complete Trip">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleCompleteTrip(booking)}
                          disabled={!booking.actual_pickup_time || actionLoading === 'complete'}
                        >
                          <CheckCircle fontSize="small" />
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
        <DialogTitle>In Progress Trip Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Trip Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.booking_reference}</Typography>
                <Typography><strong>Type:</strong> {selectedBooking.user?.user_type || 'customer'}</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
                <Typography><strong>Started:</strong> {selectedBooking.actual_pickup_time ? new Date(selectedBooking.actual_pickup_time).toLocaleString() : 'Not started'}</Typography>
                <Typography><strong>Pickup Scheduled:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                <Typography><strong>Payment Status:</strong> {selectedBooking.payment_status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Timing & Distance</Typography>
                <Typography><strong>Pickup Time:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                <Typography><strong>Actual Pickup:</strong> {selectedBooking.actual_pickup_time ? new Date(selectedBooking.actual_pickup_time).toLocaleString() : 'Not picked up'}</Typography>
                <Typography><strong>Actual Dropoff:</strong> {selectedBooking.actual_dropoff_time ? new Date(selectedBooking.actual_dropoff_time).toLocaleString() : 'Not completed'}</Typography>
                <Typography><strong>Total Distance:</strong> {selectedBooking.route_fare?.distance_km || 0}km</Typography>
                <Typography><strong>Actual Distance:</strong> {selectedBooking.actual_distance_km || 'N/A'}km</Typography>
                <Typography><strong>Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Typography><strong>Name:</strong> {selectedBooking.passenger_name}</Typography>
                <Typography><strong>Email:</strong> {selectedBooking.passenger_email || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {selectedBooking.passenger_phone}</Typography>
                <Typography><strong>Passengers:</strong> {selectedBooking.passenger_count}</Typography>
                <Typography><strong>User Type:</strong> {selectedBooking.user?.user_type || 'customer'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Driver & Vehicle</Typography>
                <Typography><strong>Driver:</strong> {selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : 'Not assigned'}</Typography>
                <Typography><strong>Driver Phone:</strong> {selectedBooking.assigned_driver?.phone || 'N/A'}</Typography>
                <Typography><strong>Driver Rating:</strong> {selectedBooking.assigned_driver ? `★${selectedBooking.assigned_driver.rating}` : 'N/A'}</Typography>
                <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car ? `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model}` : 'Not assigned'}</Typography>
                <Typography><strong>License Plate:</strong> {selectedBooking.assigned_car?.license_plate || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Route Information</Typography>
                <Typography><strong>From:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address}</Typography>
                <Typography><strong>Pickup Address:</strong> {selectedBooking.pickup_address}</Typography>
                <Typography><strong>To:</strong> {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Dropoff Address:</strong> {selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Vehicle Type:</strong> {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
              </Grid>
              {selectedBooking.special_instructions && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Special Instructions</Typography>
                  <Typography>{selectedBooking.special_instructions}</Typography>
                </Grid>
              )}
              {(selectedBooking.needs_infant_seat || selectedBooking.needs_child_seat || selectedBooking.needs_wheelchair_access || selectedBooking.needs_medical_equipment) && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Special Requirements</Typography>
                  {selectedBooking.needs_infant_seat && <Typography>• Infant seat required</Typography>}
                  {selectedBooking.needs_child_seat && <Typography>• Child seat required</Typography>}
                  {selectedBooking.needs_wheelchair_access && <Typography>• Wheelchair access required</Typography>}
                  {selectedBooking.needs_medical_equipment && <Typography>• Medical equipment space required</Typography>}
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Live Tracking Dialog */}
      <Dialog open={trackingDialogOpen} onClose={() => setTrackingDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Live Trip Tracking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Real-time tracking for trip "{selectedBooking.booking_reference}"
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Current Status</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
                <Typography><strong>Payment Status:</strong> {selectedBooking.payment_status}</Typography>
                <Typography><strong>Last Update:</strong> {new Date(selectedBooking.updated_at).toLocaleTimeString()}</Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>Trip Progress</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={selectedBooking.actual_pickup_time ? 50 : 10} 
                    sx={{ height: 12, borderRadius: 6, mb: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {selectedBooking.actual_pickup_time ? '50%' : '10%'} completed ({selectedBooking.route_fare?.distance_km || 0}km total)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Trip Timeline</Typography>
                <Typography><strong>Scheduled:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleTimeString()}</Typography>
                <Typography><strong>Started:</strong> {selectedBooking.actual_pickup_time ? new Date(selectedBooking.actual_pickup_time).toLocaleTimeString() : 'Not started'}</Typography>
                <Typography><strong>Completed:</strong> {selectedBooking.actual_dropoff_time ? new Date(selectedBooking.actual_dropoff_time).toLocaleTimeString() : 'Not completed'}</Typography>
                <Typography><strong>Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold">Map Integration</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Live GPS tracking would be displayed here in production
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button variant="outlined" startIcon={<Phone />} fullWidth>
                    Call Driver
                  </Button>
                  <Button variant="outlined" startIcon={<Message />} fullWidth>
                    Send Message
                  </Button>
                  <Button variant="outlined" startIcon={<Phone />} fullWidth>
                    Call Customer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackingDialogOpen(false)}>Close</Button>
          <Button variant="contained">Refresh Location</Button>
        </DialogActions>
      </Dialog>

      {/* Contact Driver Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Driver</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Contact {selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : 'driver'} for active trip "{selectedBooking.booking_reference}"
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Driver Information</Typography>
                  <Typography><strong>Name:</strong> {selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : 'Not assigned'}</Typography>
                  <Typography><strong>Phone:</strong> {selectedBooking.assigned_driver?.phone || 'N/A'}</Typography>
                  <Typography><strong>Rating:</strong> {selectedBooking.assigned_driver ? `★${selectedBooking.assigned_driver.rating}` : 'N/A'}</Typography>
                  <Typography><strong>Current Status:</strong> {selectedBooking.booking_status}</Typography>
                  <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car ? `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model}` : 'Not assigned'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2} mt={2}>
                    <Button
                      variant="contained"
                      startIcon={<Phone />}
                      href={`tel:${selectedBooking.assigned_driver?.phone || ''}`}
                      fullWidth
                      disabled={!selectedBooking.assigned_driver?.phone}
                    >
                      Call Driver
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Message />}
                      href={`sms:${selectedBooking.assigned_driver?.phone || ''}`}
                      fullWidth
                      disabled={!selectedBooking.assigned_driver?.phone}
                    >
                      Send SMS
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quick Message"
                    multiline
                    rows={3}
                    placeholder="Type a message to send to the driver..."
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Close</Button>
          <Button variant="contained">Send Message</Button>
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

export default InProgressBookings