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
  SwapHoriz,
  PlayArrow,
  LocationOn,
  Person,
  Assignment,
  Phone,
  Message,
  Navigation,
  Refresh,
  Download,
  Warning,
  CheckCircle,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, BookingStatsResponse } from '../../api/bookings'

const AssignedBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('')
  const [driverStatusFilter, setDriverStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [stats, setStats] = useState<BookingStatsResponse | null>(null)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false)
  const [startTripDialogOpen, setStartTripDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Load data on component mount and when filters change
  useEffect(() => {
    loadBookings()
    loadStats()
  }, [page, rowsPerPage, searchTerm, urgencyFilter, driverStatusFilter, typeFilter])

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: BookingFilters = {
        page: page + 1,
        limit: rowsPerPage,
        booking_status: BookingStatus.ASSIGNED,
        search: searchTerm || undefined,
        user_type: typeFilter || undefined,
      }

      const response = await bookingsAPI.getBookings(filters)
      setBookings(response.data)
      setTotalCount(response.total)
    } catch (error) {
      console.error('Failed to load assigned bookings:', error)
      showToast('Failed to load assigned bookings', 'error')
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

  const getUrgencyLevel = (pickupDate: string) => {
    const now = new Date()
    const pickup = new Date(pickupDate)
    const hoursUntilPickup = (pickup.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (hoursUntilPickup <= 2) return 'high'
    if (hoursUntilPickup <= 6) return 'medium'
    return 'low'
  }

  const getDriverStatus = (booking: Booking) => {
    // Since we don't have real driver status tracking yet, simulate based on pickup time
    const now = new Date()
    const pickup = new Date(booking.pickup_datetime)
    const minutesUntilPickup = (pickup.getTime() - now.getTime()) / (1000 * 60)
    
    if (minutesUntilPickup <= -30) return 'delayed' // More than 30 minutes late
    if (minutesUntilPickup <= 0) return 'arrived'
    if (minutesUntilPickup <= 30) return 'on_way'
    return 'waiting'
  }

  const filteredBookings = bookings.filter(booking => {
    const urgency = getUrgencyLevel(booking.pickup_datetime)
    const driverStatus = getDriverStatus(booking)
    
    const matchesUrgency = urgencyFilter === '' || urgency === urgencyFilter
    const matchesDriverStatus = driverStatusFilter === '' || driverStatus === driverStatusFilter
    
    return matchesUrgency && matchesDriverStatus
  })

  const assignedStats = {
    total: stats?.byStatus?.assigned || 0,
    withDriver: bookings.filter(b => b.assigned_driver_id).length,
    withCar: bookings.filter(b => b.assigned_car_id).length,
    readyToStart: bookings.filter(b => b.assigned_driver_id && b.assigned_car_id).length,
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

  const handleReassignBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setReassignDialogOpen(true)
  }

  const handleStartTrip = (booking: Booking) => {
    setSelectedBooking(booking)
    setStartTripDialogOpen(true)
  }

  const handleContactDriver = (booking: Booking) => {
    setSelectedBooking(booking)
    setContactDialogOpen(true)
  }

  const handleReassignSubmit = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('reassign')
      // TODO: Get actual driver and car IDs from form
      await bookingsAPI.assignDriverAndCar(selectedBooking.id, {
        driver_id: 'new_driver_id',
        car_id: 'new_car_id'
      })
      showToast('Booking reassigned successfully')
      loadBookings()
      setReassignDialogOpen(false)
    } catch (error) {
      console.error('Failed to reassign booking:', error)
      showToast('Failed to reassign booking', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleStartTripSubmit = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('start')
      await bookingsAPI.startTrip(selectedBooking.id)
      showToast('Trip started successfully')
      loadBookings()
      setStartTripDialogOpen(false)
    } catch (error) {
      console.error('Failed to start trip:', error)
      showToast('Failed to start trip', 'error')
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
        booking_status: BookingStatus.ASSIGNED,
        search: searchTerm || undefined,
        user_type: typeFilter || undefined,
      }

      const blob = await bookingsAPI.exportBookings(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `assigned-bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Assigned bookings exported successfully')
    } catch (error) {
      console.error('Failed to export assigned bookings:', error)
      showToast('Failed to export assigned bookings', 'error')
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

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case 'on_way': return 'info'
      case 'arrived': return 'success'
      case 'waiting': return 'warning'
      case 'delayed': return 'error'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Assigned Bookings
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
                <Assignment color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Assigned</Typography>
                  <Typography variant="h4" color="primary">
                    {loading ? <Skeleton width={60} /> : assignedStats.total}
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
                  <Typography variant="h6">Drivers En Route</Typography>
                  <Typography variant="h4" color="info">
                    {loading ? <Skeleton width={60} /> : filteredBookings.filter(b => getDriverStatus(b) === 'on_way').length}
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
                <CheckCircle color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Drivers Arrived</Typography>
                  <Typography variant="h4" color="success">
                    {loading ? <Skeleton width={60} /> : filteredBookings.filter(b => getDriverStatus(b) === 'arrived').length}
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
                <Warning color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h6">Delayed</Typography>
                  <Typography variant="h4" color="warning">
                    {loading ? <Skeleton width={60} /> : filteredBookings.filter(b => getDriverStatus(b) === 'delayed').length}
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
                placeholder="Search bookings, customers, drivers..."
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
                label="Driver Status"
                value={driverStatusFilter}
                onChange={(e) => setDriverStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="on_way">En Route</MenuItem>
                <MenuItem value="arrived">Arrived</MenuItem>
                <MenuItem value="waiting">Waiting</MenuItem>
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
                  {filteredBookings.length} assignment(s) found
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
              <TableCell>Driver & Vehicle</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pickup Time</TableCell>
              <TableCell>Urgency</TableCell>
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
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No assigned bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => {
                const driverStatus = getDriverStatus(booking)
                const urgency = getUrgencyLevel(booking.pickup_datetime)
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
                        <Typography variant="body2">
                          → {booking.route_fare?.to_location || booking.dropoff_address}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {booking.route_fare?.vehicle_type || 'Standard'} • {booking.passenger_count} pax
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {booking.assigned_driver ? (
                          <>
                            <Typography variant="body2" fontWeight="bold">
                              {booking.assigned_driver.first_name} {booking.assigned_driver.last_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ★{booking.assigned_driver.rating || 'N/A'}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No driver assigned
                          </Typography>
                        )}
                        {booking.assigned_car && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            {booking.assigned_car.make} {booking.assigned_car.model} ({booking.assigned_car.license_plate})
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={driverStatus.replace('_', ' ')}
                          color={getDriverStatusColor(driverStatus) as any}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        {driverStatus === 'on_way' && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            En route to pickup
                          </Typography>
                        )}
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
                        label={urgency}
                        color={getUrgencyColor(urgency) as any}
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
                      <Tooltip title="Contact Driver">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleContactDriver(booking)}
                        >
                          <Phone fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Start Trip">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleStartTrip(booking)}
                          disabled={driverStatus !== 'arrived'}
                        >
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reassign">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleReassignBooking(booking)}
                        >
                          <SwapHoriz fontSize="small" />
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
        <DialogTitle>Assigned Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.booking_reference}</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
                <Typography><strong>Urgency:</strong> {getUrgencyLevel(selectedBooking.pickup_datetime)}</Typography>
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
                <Typography variant="h6" gutterBottom>Assignment Details</Typography>
                {selectedBooking.assigned_driver ? (
                  <>
                    <Typography><strong>Driver:</strong> {selectedBooking.assigned_driver.first_name} {selectedBooking.assigned_driver.last_name}</Typography>
                    <Typography><strong>Driver Phone:</strong> {selectedBooking.assigned_driver.phone}</Typography>
                    <Typography><strong>Driver Rating:</strong> ★{selectedBooking.assigned_driver.rating || 'N/A'}</Typography>
                  </>
                ) : (
                  <Typography><strong>Driver:</strong> Not assigned</Typography>
                )}
                {selectedBooking.assigned_car ? (
                  <>
                    <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car.make} {selectedBooking.assigned_car.model}</Typography>
                    <Typography><strong>License Plate:</strong> {selectedBooking.assigned_car.license_plate}</Typography>
                  </>
                ) : (
                  <Typography><strong>Vehicle:</strong> Not assigned</Typography>
                )}
                <Typography><strong>Current Status:</strong> {getDriverStatus(selectedBooking).replace('_', ' ')}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Route Information</Typography>
                <Typography><strong>From:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address}</Typography>
                <Typography><strong>To:</strong> {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Pickup Time:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                <Typography><strong>Passengers:</strong> {selectedBooking.passenger_count}</Typography>
                <Typography><strong>Vehicle Type:</strong> {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
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

      {/* Reassign Booking Dialog */}
      <Dialog open={reassignDialogOpen} onClose={() => setReassignDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Reassign Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Reassigning booking "{selectedBooking.booking_reference}" from {selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : 'current driver'}
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Current Assignment</Typography>
                  {selectedBooking.assigned_driver ? (
                    <>
                      <Typography><strong>Driver:</strong> {selectedBooking.assigned_driver.first_name} {selectedBooking.assigned_driver.last_name}</Typography>
                      <Typography><strong>Driver Phone:</strong> {selectedBooking.assigned_driver.phone}</Typography>
                    </>
                  ) : (
                    <Typography><strong>Driver:</strong> Not assigned</Typography>
                  )}
                  {selectedBooking.assigned_car ? (
                    <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car.make} {selectedBooking.assigned_car.model} ({selectedBooking.assigned_car.license_plate})</Typography>
                  ) : (
                    <Typography><strong>Vehicle:</strong> Not assigned</Typography>
                  )}
                  <Typography><strong>Status:</strong> {getDriverStatus(selectedBooking).replace('_', ' ')}</Typography>
                  <Typography><strong>Last Updated:</strong> {new Date(selectedBooking.updated_at).toLocaleString()}</Typography>
                  
                  <TextField
                    fullWidth
                    label="Reassignment Reason"
                    multiline
                    rows={3}
                    placeholder="Please provide a reason for reassignment..."
                    sx={{ mt: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>New Assignment</Typography>
                  <TextField
                    fullWidth
                    select
                    label="Select New Driver"
                    defaultValue=""
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="driver4">Anna Fischer (★4.9) - Available - {// @ts-ignore
                      selectedBooking.vehicleType}</MenuItem>
                    <MenuItem value="driver5">Klaus Mueller (★4.7) - Available - {// @ts-ignore
                      selectedBooking.vehicleType}</MenuItem>
                    <MenuItem value="driver6">Lisa Wagner (★4.8) - Available - {// @ts-ignore
                      selectedBooking.vehicleType}</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label="Select New Vehicle"
                    defaultValue=""
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="car5">BMW 5 Series (W-AF-789) - {// @ts-ignore
                      selectedBooking.vehicleType}</MenuItem>
                    <MenuItem value="car6">Audi A6 (S-KM-123) - {// @ts-ignore
                      selectedBooking.vehicleType}</MenuItem>
                    <MenuItem value="car7">Mercedes C-Class (IBK-LW-456) - {// @ts-ignore
                      selectedBooking.vehicleType}</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Notes for New Driver"
                    multiline
                    rows={2}
                    placeholder="Special instructions for the new driver..."
                    defaultValue={// @ts-ignore
                    selectedBooking.specialRequirements || ''}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReassignDialogOpen(false)} disabled={actionLoading === 'reassign'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={handleReassignSubmit}
            disabled={actionLoading === 'reassign'}
            startIcon={actionLoading === 'reassign' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'reassign' ? 'Reassigning...' : 'Reassign Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Start Trip Dialog */}
      <Dialog open={startTripDialogOpen} onClose={() => setStartTripDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start Trip</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Start trip for booking "{selectedBooking.booking_reference}"?
                This will move the booking to "In Progress" status.
              </Alert>
              <Typography variant="h6" gutterBottom>Trip Summary:</Typography>
              <Typography><strong>Customer:</strong> {selectedBooking.passenger_name}</Typography>
              <Typography><strong>Driver:</strong> {selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : 'Not assigned'}</Typography>
              <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car ? `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model} (${selectedBooking.assigned_car.license_plate})` : 'Not assigned'}</Typography>
              <Typography><strong>Route:</strong> {selectedBooking.route_fare?.from_location || selectedBooking.pickup_address} → {selectedBooking.route_fare?.to_location || selectedBooking.dropoff_address}</Typography>
              <Typography><strong>Passengers:</strong> {selectedBooking.passenger_count}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartTripDialogOpen(false)} disabled={actionLoading === 'start'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleStartTripSubmit}
            disabled={actionLoading === 'start'}
            startIcon={actionLoading === 'start' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'start' ? 'Starting Trip...' : 'Start Trip'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Driver Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Driver</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Contact {selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : 'driver'} for booking "{selectedBooking.booking_reference}"
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Driver Information</Typography>
                  {selectedBooking.assigned_driver ? (
                    <>
                      <Typography><strong>Name:</strong> {selectedBooking.assigned_driver.first_name} {selectedBooking.assigned_driver.last_name}</Typography>
                      <Typography><strong>Phone:</strong> {selectedBooking.assigned_driver.phone}</Typography>
                      <Typography><strong>Rating:</strong> ★{selectedBooking.assigned_driver.rating || 'N/A'}</Typography>
                      <Typography><strong>Current Status:</strong> {getDriverStatus(selectedBooking).replace('_', ' ')}</Typography>
                    </>
                  ) : (
                    <Typography>No driver assigned to this booking.</Typography>
                  )}
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

export default AssignedBookings