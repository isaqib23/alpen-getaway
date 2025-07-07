import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Skeleton,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, PaymentStatus, BookingStatsResponse } from '../../api/bookings'

// Interface removed as it's imported from API

const AllBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
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
  }, [page, rowsPerPage, searchTerm, statusFilter, typeFilter, paymentStatusFilter, dateFilter])

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: BookingFilters = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: searchTerm || undefined,
        booking_status: statusFilter || undefined,
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
      console.error('Failed to load bookings:', error)
      showToast('Failed to load bookings', 'error')
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
  // @ts-ignore
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleAddBooking = () => {
    setOpenAddDialog(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setOpenEditDialog(true)
  }

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setOpenDeleteDialog(true)
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setOpenViewDialog(true)
  }

  const handleAssignBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setOpenAssignDialog(true)
  }

  const handleConfirmAssignment = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('assign')
      // TODO: Get actual driver and car IDs from form
      await bookingsAPI.assignDriverAndCar(selectedBooking.id, {
        driver_id: 'driver1', // This should come from form
        car_id: 'car1' // This should come from form
      })
      showToast('Driver and car assigned successfully')
      loadBookings()
      setOpenAssignDialog(false)
    } catch (error) {
      console.error('Failed to assign driver and car:', error)
      showToast('Failed to assign driver and car', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('update')
      // TODO: Get actual update data from form
      await bookingsAPI.updateBooking(selectedBooking.id, {
        booking_status: selectedBooking.booking_status,
        payment_status: selectedBooking.payment_status,
      })
      showToast('Booking updated successfully')
      loadBookings()
      setOpenEditDialog(false)
    } catch (error) {
      console.error('Failed to update booking:', error)
      showToast('Failed to update booking', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('delete')
      await bookingsAPI.cancelBooking(selectedBooking.id, 'Cancelled by admin')
      showToast('Booking cancelled successfully')
      loadBookings()
      setOpenDeleteDialog(false)
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      showToast('Failed to cancel booking', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateBooking = async () => {
    try {
      setActionLoading('create')
      // TODO: Get actual booking data from form
      const bookingData = {
        user_id: 'user1', // This should come from form
        route_fare_id: 'route1', // This should come from form
        passenger_name: 'John Doe', // This should come from form
        passenger_phone: '+1234567890', // This should come from form
        passenger_count: 1,
        pickup_datetime: new Date().toISOString(),
        pickup_address: 'Pickup Location',
        dropoff_address: 'Dropoff Location',
        fare_used: 'sale_fare' as any,
        base_amount: 100,
        total_amount: 100,
      }
      await bookingsAPI.createBooking(bookingData)
      showToast('Booking created successfully')
      loadBookings()
      setOpenAddDialog(false)
    } catch (error) {
      console.error('Failed to create booking:', error)
      showToast('Failed to create booking', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value)
  }

  const handleTypeChange = (event: any) => {
    setTypeFilter(event.target.value)
  }

  const handlePaymentStatusChange = (event: any) => {
    setPaymentStatusFilter(event.target.value)
  }

  const handleDateChange = (event: any) => {
    setDateFilter(event.target.value)
  }

  const handleRefresh = () => {
    loadBookings()
    loadStats()
  }

  const handleExport = async () => {
    try {
      const filters: BookingFilters = {
        search: searchTerm || undefined,
        booking_status: statusFilter || undefined,
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
      a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Bookings exported successfully')
    } catch (error) {
      console.error('Failed to export bookings:', error)
      showToast('Failed to export bookings', 'error')
    }
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return 'success'
      case BookingStatus.IN_PROGRESS:
        return 'info'
      case BookingStatus.CONFIRMED:
        return 'primary'
      case BookingStatus.ASSIGNED:
        return 'secondary'
      case BookingStatus.PENDING:
        return 'warning'
      case BookingStatus.CANCELLED:
        return 'error'
      default:
        return 'default'
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

  const getUserTypeColor = (userType: string) => {
    switch (userType.toLowerCase()) {
      case 'customer':
        return 'primary'
      case 'affiliate':
        return 'secondary'
      case 'b2b':
        return 'info'
      default:
        return 'default'
    }
  }

  // Data is loaded from API

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          All Bookings
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
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBooking}
          >
            New Booking
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ReceiptIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Bookings</Typography>
                  <Typography variant="h4" color="primary">
                    {loading ? <Skeleton width={60} /> : Object.values(stats?.byStatus || {}).reduce((sum, count) => sum + count, 0)}
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
                <TrendingUpIcon color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Completed</Typography>
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
                <ScheduleIcon color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h6">In Progress</Typography>
                  <Typography variant="h4" color="warning">
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
                <MoneyIcon color="secondary" fontSize="large" />
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

      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={BookingStatus.PENDING}>Pending</MenuItem>
                  <MenuItem value={BookingStatus.CONFIRMED}>Confirmed</MenuItem>
                  <MenuItem value={BookingStatus.ASSIGNED}>Assigned</MenuItem>
                  <MenuItem value={BookingStatus.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={BookingStatus.COMPLETED}>Completed</MenuItem>
                  <MenuItem value={BookingStatus.CANCELLED}>Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={handleTypeChange}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="affiliate">Affiliate</MenuItem>
                  <MenuItem value="b2b">B2B</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Payment</InputLabel>
                <Select
                  value={paymentStatusFilter}
                  onChange={handlePaymentStatusChange}
                  label="Payment"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={PaymentStatus.PAID}>Paid</MenuItem>
                  <MenuItem value={PaymentStatus.PENDING}>Pending</MenuItem>
                  <MenuItem value={PaymentStatus.FAILED}>Failed</MenuItem>
                  <MenuItem value={PaymentStatus.REFUNDED}>Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={1}>
              <FormControl fullWidth>
                <InputLabel>Date</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={handleDateChange}
                  label="Date"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {totalCount} booking(s) found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Status</TableCell>
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
                    No bookings found
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
                          ID: {booking.id}
                        </Typography>
                        {booking.assigned_driver && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Driver: {booking.assigned_driver.first_name} {booking.assigned_driver.last_name}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
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
                          <LocationIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
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
                        label={booking.booking_status.replace('_', ' ')}
                        color={getStatusColor(booking.booking_status) as any}
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
                        color={getUserTypeColor(booking.user?.user_type || 'customer') as any}
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
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Assign Driver">
                        <IconButton
                          size="small"
                          color="warning"
                          disabled={booking.booking_status === BookingStatus.COMPLETED || booking.booking_status === BookingStatus.CANCELLED}
                          onClick={() => handleAssignBooking(booking)}
                        >
                          <AssignmentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={() => handleEditBooking(booking)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteBooking(booking)}
                        color="error"
                        disabled={booking.booking_status === BookingStatus.IN_PROGRESS}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog implementations */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Booking</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Customer Information</Typography>
              <TextField fullWidth label="Customer Name" sx={{ mb: 2 }} />
              <TextField fullWidth label="Customer Email" type="email" sx={{ mb: 2 }} />
              <TextField fullWidth label="Customer Phone" sx={{ mb: 2 }} />
              <TextField
                fullWidth
                select
                label="Booking Type"
                defaultValue="direct"
                sx={{ mb: 2 }}
              >
                <MenuItem value="direct">Direct</MenuItem>
                <MenuItem value="affiliate">Affiliate</MenuItem>
                <MenuItem value="b2b">B2B</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Route Information</Typography>
              <TextField fullWidth label="From Location" sx={{ mb: 2 }} />
              <TextField fullWidth label="To Location" sx={{ mb: 2 }} />
              <TextField
                fullWidth
                label="Pickup Date & Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Vehicle Type"
                defaultValue="economy"
                sx={{ mb: 2 }}
              >
                <MenuItem value="economy">Economy</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="luxury">Luxury</MenuItem>
                <MenuItem value="van">Van</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Booking Details</Typography>
              <TextField fullWidth label="Passenger Count" type="number" defaultValue={1} sx={{ mb: 2 }} />
              <TextField fullWidth label="Luggage Count" type="number" defaultValue={0} sx={{ mb: 2 }} />
              <TextField fullWidth label="Quoted Fare (€)" type="number" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Additional Options</Typography>
              <TextField
                fullWidth
                select
                label="Payment Status"
                defaultValue="pending"
                sx={{ mb: 2 }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </TextField>
              <TextField fullWidth label="Special Requirements" multiline rows={2} sx={{ mb: 2 }} />
              <TextField fullWidth label="Notes" multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} disabled={actionLoading === 'create'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateBooking}
            disabled={actionLoading === 'create'}
            startIcon={actionLoading === 'create' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'create' ? 'Creating...' : 'Create Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Booking - {selectedBooking?.booking_reference}</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <TextField fullWidth label="Passenger Name" defaultValue={selectedBooking.passenger_name} sx={{ mb: 2 }} />
                <TextField fullWidth label="Passenger Email" defaultValue={selectedBooking.passenger_email || ''} sx={{ mb: 2 }} />
                <TextField fullWidth label="Passenger Phone" defaultValue={selectedBooking.passenger_phone} sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  select
                  label="Booking Status"
                  defaultValue={selectedBooking.booking_status}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Route Information</Typography>
                <TextField fullWidth label="Pickup Address" defaultValue={selectedBooking.pickup_address} sx={{ mb: 2 }} />
                <TextField fullWidth label="Dropoff Address" defaultValue={selectedBooking.dropoff_address} sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  label="Pickup Date & Time"
                  type="datetime-local"
                  defaultValue={new Date(selectedBooking.pickup_datetime).toISOString().slice(0, 16)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField fullWidth label="Vehicle Type" defaultValue={selectedBooking.route_fare?.vehicle_type || 'Standard'} sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing & Payment</Typography>
                <TextField fullWidth label="Passenger Count" type="number" defaultValue={selectedBooking.passenger_count} sx={{ mb: 2 }} />
                <TextField fullWidth label="Base Amount (€)" type="number" defaultValue={selectedBooking.base_amount} sx={{ mb: 2 }} />
                <TextField fullWidth label="Total Amount (€)" type="number" defaultValue={selectedBooking.total_amount} sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  select
                  label="Payment Status"
                  defaultValue={selectedBooking.payment_status}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Assignment & Notes</Typography>
                <TextField fullWidth label="Assigned Driver" defaultValue={selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : ''} sx={{ mb: 2 }} />
                <TextField fullWidth label="Assigned Car" defaultValue={selectedBooking.assigned_car ? `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model} (${selectedBooking.assigned_car.license_plate})` : ''} sx={{ mb: 2 }} />
                <TextField fullWidth label="Special Instructions" defaultValue={selectedBooking.special_instructions || ''} multiline rows={2} sx={{ mb: 2 }} />
                <TextField fullWidth label="Notes" defaultValue={''} multiline rows={2} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} disabled={actionLoading === 'update'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateBooking}
            disabled={actionLoading === 'update'}
            startIcon={actionLoading === 'update' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'update' ? 'Updating...' : 'Update Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to cancel booking "{selectedBooking?.booking_reference}"?
            This action may have financial implications.
          </Alert>
          <TextField
            fullWidth
            label="Cancellation Reason"
            multiline
            rows={3}
            placeholder="Please provide a reason for cancellation..."
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Refund Status"
            defaultValue="pending"
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending Review</MenuItem>
            <MenuItem value="full_refund">Full Refund</MenuItem>
            <MenuItem value="partial_refund">Partial Refund</MenuItem>
            <MenuItem value="no_refund">No Refund</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={actionLoading === 'delete'}>
            Keep Booking
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleConfirmDelete}
            disabled={actionLoading === 'delete'}
            startIcon={actionLoading === 'delete' ? <CircularProgress size={20} /> : null}
          >
            {actionLoading === 'delete' ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.booking_reference}</Typography>
                <Typography><strong>User Type:</strong> {selectedBooking.user?.user_type || 'N/A'}</Typography>
                <Typography><strong>Status:</strong> {selectedBooking.booking_status}</Typography>
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
                <Typography variant="h6" gutterBottom>Route & Pickup Details</Typography>
                <Typography><strong>Pickup Address:</strong> {selectedBooking.pickup_address}</Typography>
                <Typography><strong>Dropoff Address:</strong> {selectedBooking.dropoff_address}</Typography>
                <Typography><strong>Pickup Time:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                {selectedBooking.actual_pickup_time && (
                  <Typography><strong>Actual Pickup:</strong> {new Date(selectedBooking.actual_pickup_time).toLocaleString()}</Typography>
                )}
                {selectedBooking.actual_dropoff_time && (
                  <Typography><strong>Actual Dropoff:</strong> {new Date(selectedBooking.actual_dropoff_time).toLocaleString()}</Typography>
                )}
                {selectedBooking.actual_distance_km && (
                  <Typography><strong>Distance:</strong> {selectedBooking.actual_distance_km} km</Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing Information</Typography>
                <Typography><strong>Fare Type:</strong> {selectedBooking.fare_used}</Typography>
                <Typography><strong>Base Amount:</strong> €{Number(selectedBooking.base_amount).toFixed(2)}</Typography>
                <Typography><strong>Discount Amount:</strong> €{Number(selectedBooking.discount_amount).toFixed(2)}</Typography>
                <Typography><strong>Tax Amount:</strong> €{Number(selectedBooking.tax_amount).toFixed(2)}</Typography>
                <Typography><strong>Total Amount:</strong> €{Number(selectedBooking.total_amount).toFixed(2)}</Typography>
                <Typography><strong>Payment Status:</strong> {selectedBooking.payment_status}</Typography>
              </Grid>

              {selectedBooking.assigned_driver && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Assigned Driver</Typography>
                  <Typography><strong>Name:</strong> {selectedBooking.assigned_driver.first_name} {selectedBooking.assigned_driver.last_name}</Typography>
                  <Typography><strong>Phone:</strong> {selectedBooking.assigned_driver.phone}</Typography>
                  <Typography><strong>Email:</strong> {selectedBooking.assigned_driver.email}</Typography>
                  <Typography><strong>License:</strong> {selectedBooking.assigned_driver.license_number}</Typography>
                  <Typography><strong>Rating:</strong> ⭐ {selectedBooking.assigned_driver.rating || 'N/A'}</Typography>
                </Grid>
              )}

              {selectedBooking.assigned_car && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Assigned Vehicle</Typography>
                  <Typography><strong>Vehicle:</strong> {selectedBooking.assigned_car.make} {selectedBooking.assigned_car.model} ({selectedBooking.assigned_car.year})</Typography>
                  <Typography><strong>License Plate:</strong> {selectedBooking.assigned_car.license_plate}</Typography>
                  <Typography><strong>Color:</strong> {selectedBooking.assigned_car.color}</Typography>
                </Grid>
              )}

              {(selectedBooking.needs_infant_seat || selectedBooking.needs_child_seat || selectedBooking.needs_wheelchair_access || selectedBooking.needs_medical_equipment || selectedBooking.special_instructions) && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Special Requirements</Typography>
                  {selectedBooking.needs_infant_seat && <Typography>• Infant seat required</Typography>}
                  {selectedBooking.needs_child_seat && <Typography>• Child seat required</Typography>}
                  {selectedBooking.needs_wheelchair_access && <Typography>• Wheelchair access required</Typography>}
                  {selectedBooking.needs_medical_equipment && <Typography>• Medical equipment space required</Typography>}
                  {selectedBooking.special_instructions && (
                    <Typography><strong>Special Instructions:</strong> {selectedBooking.special_instructions}</Typography>
                  )}
                </Grid>
              )}

              {selectedBooking.coupon && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Coupon Information</Typography>
                  <Typography><strong>Code:</strong> {selectedBooking.coupon.code}</Typography>
                  <Typography><strong>Discount Type:</strong> {selectedBooking.coupon.discount_type}</Typography>
                  <Typography><strong>Discount Value:</strong> {selectedBooking.coupon.discount_value}</Typography>
                </Grid>
              )}

              {selectedBooking.review && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Customer Review</Typography>
                  <Typography><strong>Rating:</strong> ⭐ {selectedBooking.review.rating}/5</Typography>
                  <Typography><strong>Comment:</strong> {selectedBooking.review.comment}</Typography>
                  <Typography><strong>Date:</strong> {new Date(selectedBooking.review.created_at).toLocaleDateString()}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Driver Dialog */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assign Driver & Vehicle</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                Assigning driver and vehicle to booking "{selectedBooking.booking_reference}"
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Booking Details</Typography>
                  <Typography><strong>Passenger:</strong> {selectedBooking.passenger_name}</Typography>
                  <Typography><strong>Route:</strong> {selectedBooking.pickup_address} → {selectedBooking.dropoff_address}</Typography>
                  <Typography><strong>Pickup:</strong> {new Date(selectedBooking.pickup_datetime).toLocaleString()}</Typography>
                  <Typography><strong>Passengers:</strong> {selectedBooking.passenger_count}</Typography>
                  <Typography><strong>Vehicle Type:</strong> {selectedBooking.route_fare?.vehicle_type || 'Standard'}</Typography>
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
                    <MenuItem value="driver1">John Smith (★4.8) - Available</MenuItem>
                    <MenuItem value="driver2">Jane Doe (★4.9) - Available</MenuItem>
                    <MenuItem value="driver3">Mike Johnson (★4.7) - Available</MenuItem>
                    <MenuItem value="driver4">Sarah Wilson (★4.6) - Available</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label="Select Vehicle"
                    defaultValue=""
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="car1">Mercedes E-Class (ABC-123)</MenuItem>
                    <MenuItem value="car2">BMW 5 Series (DEF-456)</MenuItem>
                    <MenuItem value="car3">Audi A6 (GHI-789)</MenuItem>
                    <MenuItem value="car4">VW Passat (JKL-012)</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Assignment Notes"
                    multiline
                    rows={3}
                    placeholder="Any special instructions for the driver..."
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)} disabled={actionLoading === 'assign'}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmAssignment}
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

export default AllBookings