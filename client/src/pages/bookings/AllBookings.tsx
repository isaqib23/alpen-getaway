// @ts-nocheck
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
  Add as AddIcon,
} from '@mui/icons-material'
import { bookingsAPI, Booking, BookingFilters, BookingStatus, PaymentStatus, BookingStatsResponse, CreateBookingByEmailRequest } from '../../api/bookings'
import { useUsers } from '../../hooks/useUsers'
import { useDrivers } from '../../hooks/useDrivers'
import { useCars } from '../../hooks/useCars'
import { routesAPI } from '../../api/routes'

// Interface removed as it's imported from API

const AllBookings = () => {
  const { users, fetchUsers } = useUsers()
  const { data: driversData } = useDrivers()
  const { cars } = useCars()
  
  // Extract drivers from hook data and ensure it's an array
  const drivers = Array.isArray(driversData?.data?.data) ? driversData.data.data : []
  const carsArray = Array.isArray(cars) ? cars : []
  const [bookings, setBookings] = useState<Booking[]>([])
  const [routes, setRoutes] = useState<any[]>([])
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
  const [selectedDriverId, setSelectedDriverId] = useState('')
  const [selectedCarId, setSelectedCarId] = useState('')
  const [assignmentNotes, setAssignmentNotes] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [stats, setStats] = useState<BookingStatsResponse | null>(null)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // Form data for edit booking
  const [editFormData, setEditFormData] = useState({
    passenger_name: '',
    passenger_email: '',
    passenger_phone: '',
    booking_status: '',
    payment_status: '',
    pickup_address: '',
    dropoff_address: '',
    pickup_datetime: '',
    passenger_count: 1,
    base_amount: 0,
    total_amount: 0,
    special_instructions: ''
  })
  
  // Form data for new booking
  const [bookingFormData, setBookingFormData] = useState({
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    passenger_name: '',
    passenger_phone: '',
    passenger_count: 1,
    pickup_address: '',
    dropoff_address: '',
    pickup_datetime: '',
    route_fare_id: '',
    base_amount: 0,
    total_amount: 0,
    special_requirements: '',
    notes: ''
  })

  // Load routes for route fare selection
  const loadRoutes = async () => {
    try {
      const response = await routesAPI.getAll()
      setRoutes(response.data || [])
    } catch (error) {
      console.error('Failed to load routes:', error)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    loadBookings()
    loadStats()
    fetchUsers() // Fetch users for the dropdown
    loadRoutes() // Load routes for booking form
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
    // Populate edit form data
    setEditFormData({
      passenger_name: booking.passenger_name,
      passenger_email: booking.passenger_email || '',
      passenger_phone: booking.passenger_phone,
      booking_status: booking.booking_status,
      payment_status: booking.payment_status,
      pickup_address: booking.pickup_address,
      dropoff_address: booking.dropoff_address,
      pickup_datetime: new Date(booking.pickup_datetime).toISOString().slice(0, 16),
      passenger_count: booking.passenger_count,
      base_amount: parseFloat(booking.base_amount.toString()),
      total_amount: parseFloat(booking.total_amount.toString()),
      special_instructions: booking.special_instructions || ''
    })
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
    if (!selectedBooking || !selectedDriverId || !selectedCarId) {
      showToast('Please select both driver and vehicle', 'error')
      return
    }
    
    try {
      setActionLoading('assign')
      await bookingsAPI.assignDriverAndCar(selectedBooking.id, {
        driver_id: selectedDriverId,
        car_id: selectedCarId
      })
      showToast('Driver and car assigned successfully')
      loadBookings()
      setOpenAssignDialog(false)
      // Reset form
      setSelectedDriverId('')
      setSelectedCarId('')
      setAssignmentNotes('')
    } catch (error: any) {
      console.error('Failed to assign driver and car:', error)
      // Show backend error message if available
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign driver and car'
      showToast(errorMessage, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading('update')
      
      // Collect data from edit form
      const updateData = {
        passenger_name: editFormData.passenger_name,
        passenger_email: editFormData.passenger_email || undefined,
        passenger_phone: editFormData.passenger_phone,
        booking_status: editFormData.booking_status,
        payment_status: editFormData.payment_status,
        pickup_address: editFormData.pickup_address,
        dropoff_address: editFormData.dropoff_address,
        pickup_datetime: editFormData.pickup_datetime,
        passenger_count: editFormData.passenger_count,
        base_amount: editFormData.base_amount,
        total_amount: editFormData.total_amount,
        special_instructions: editFormData.special_instructions || undefined
      }
      
      await bookingsAPI.updateBooking(selectedBooking.id, updateData)
      showToast('Booking updated successfully')
      loadBookings()
      setOpenEditDialog(false)
    } catch (error: any) {
      console.error('Failed to update booking:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update booking'
      showToast(errorMessage, 'error')
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
      
      if (!bookingFormData.customer_email) {
        showToast('Please enter customer email', 'error')
        return
      }
      
      if (!bookingFormData.customer_name) {
        showToast('Please enter customer name', 'error')
        return
      }

      if (!bookingFormData.route_fare_id) {
        showToast('Please select a route', 'error')
        return
      }
      
      const bookingData: CreateBookingByEmailRequest = {
        customer_email: bookingFormData.customer_email,
        customer_name: bookingFormData.customer_name,
        customer_phone: bookingFormData.customer_phone,
        route_fare_id: bookingFormData.route_fare_id,
        passenger_name: bookingFormData.passenger_name || bookingFormData.customer_name,
        passenger_phone: bookingFormData.passenger_phone || bookingFormData.customer_phone,
        passenger_email: bookingFormData.customer_email,
        passenger_count: bookingFormData.passenger_count,
        pickup_datetime: bookingFormData.pickup_datetime,
        pickup_address: bookingFormData.pickup_address,
        dropoff_address: bookingFormData.dropoff_address,
        fare_used: 'sale_fare' as any,
        base_amount: bookingFormData.base_amount,
        total_amount: bookingFormData.total_amount,
        special_instructions: bookingFormData.special_requirements,
      }
      await bookingsAPI.createBookingByEmail(bookingData)
      showToast('Booking created successfully')
      loadBookings()
      setOpenAddDialog(false)
      // Reset form
      setBookingFormData({
        customer_email: '',
        customer_name: '',
        customer_phone: '',
        passenger_name: '',
        passenger_phone: '',
        passenger_count: 1,
        pickup_address: '',
        dropoff_address: '',
        pickup_datetime: '',
        route_fare_id: '',
        base_amount: 0,
        total_amount: 0,
        special_requirements: '',
        notes: ''
      })
    } catch (error: any) {
      console.error('Failed to create booking:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking'
      showToast(errorMessage, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) || 0 : event.target.value
    setBookingFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFormSelectChange = (field: string) => (event: any) => {
    setBookingFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleEditFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) || 0 : event.target.value
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEditFormSelectChange = (field: string) => (event: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
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
              <TextField 
                fullWidth 
                label="Customer Email" 
                type="email"
                value={bookingFormData.customer_email}
                onChange={handleFormChange('customer_email')}
                sx={{ mb: 2 }}
                required
                helperText="Enter customer email. If it exists, we'll use the existing customer. If not, we'll create a new customer account."
              />
              <TextField 
                fullWidth 
                label="Customer Name" 
                value={bookingFormData.customer_name}
                onChange={handleFormChange('customer_name')}
                sx={{ mb: 2 }}
                required
              />
              <TextField 
                fullWidth 
                label="Customer Phone" 
                value={bookingFormData.customer_phone}
                onChange={handleFormChange('customer_phone')}
                sx={{ mb: 2 }}
                required
              />
              <TextField 
                fullWidth 
                label="Passenger Name" 
                value={bookingFormData.passenger_name}
                onChange={handleFormChange('passenger_name')}
                sx={{ mb: 2 }} 
                helperText="Leave empty to use customer name"
              />
              <TextField 
                fullWidth 
                label="Passenger Phone" 
                value={bookingFormData.passenger_phone}
                onChange={handleFormChange('passenger_phone')}
                sx={{ mb: 2 }} 
                helperText="Leave empty to use customer phone"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Route Information</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Route</InputLabel>
                <Select
                  value={bookingFormData.route_fare_id}
                  onChange={(e) => {
                    const selectedRoute = routes.find(r => r.id === e.target.value);
                    setBookingFormData(prev => ({
                      ...prev,
                      route_fare_id: e.target.value as string,
                      pickup_address: selectedRoute?.from_location || prev.pickup_address,
                      dropoff_address: selectedRoute?.to_location || prev.dropoff_address,
                      base_amount: selectedRoute?.sale_fare || prev.base_amount,
                      total_amount: selectedRoute?.sale_fare || prev.total_amount,
                    }));
                  }}
                  label="Select Route"
                  required
                >
                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.from_location} → {route.to_location} (€{route.sale_fare})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField 
                fullWidth 
                label="From Location" 
                value={bookingFormData.pickup_address}
                onChange={handleFormChange('pickup_address')}
                sx={{ mb: 2 }} 
                required
              />
              <TextField 
                fullWidth 
                label="To Location" 
                value={bookingFormData.dropoff_address}
                onChange={handleFormChange('dropoff_address')}
                sx={{ mb: 2 }} 
                required
              />
              <TextField
                fullWidth
                label="Pickup Date & Time"
                type="datetime-local"
                value={bookingFormData.pickup_datetime}
                onChange={handleFormChange('pickup_datetime')}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Booking Details</Typography>
              <TextField 
                fullWidth 
                label="Passenger Count" 
                type="number" 
                value={bookingFormData.passenger_count}
                onChange={handleFormChange('passenger_count')}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                label="Base Amount (€)" 
                type="number" 
                value={bookingFormData.base_amount}
                onChange={handleFormChange('base_amount')}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                label="Total Amount (€)" 
                type="number" 
                value={bookingFormData.total_amount}
                onChange={handleFormChange('total_amount')}
                sx={{ mb: 2 }} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Additional Options</Typography>
              <TextField 
                fullWidth 
                label="Special Requirements" 
                multiline 
                rows={2} 
                value={bookingFormData.special_requirements}
                onChange={handleFormChange('special_requirements')}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                label="Notes" 
                multiline 
                rows={2} 
                value={bookingFormData.notes}
                onChange={handleFormChange('notes')}
              />
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
                <TextField 
                  fullWidth 
                  label="Passenger Name" 
                  value={editFormData.passenger_name} 
                  onChange={handleEditFormChange('passenger_name')}
                  sx={{ mb: 2 }} 
                />
                <TextField 
                  fullWidth 
                  label="Passenger Email" 
                  value={editFormData.passenger_email} 
                  onChange={handleEditFormChange('passenger_email')}
                  sx={{ mb: 2 }} 
                />
                <TextField 
                  fullWidth 
                  label="Passenger Phone" 
                  value={editFormData.passenger_phone} 
                  onChange={handleEditFormChange('passenger_phone')}
                  sx={{ mb: 2 }} 
                />
                <TextField
                  fullWidth
                  select
                  label="Booking Status"
                  value={editFormData.booking_status}
                  onChange={handleEditFormSelectChange('booking_status')}
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
                <TextField 
                  fullWidth 
                  label="Pickup Address" 
                  value={editFormData.pickup_address} 
                  onChange={handleEditFormChange('pickup_address')}
                  sx={{ mb: 2 }} 
                />
                <TextField 
                  fullWidth 
                  label="Dropoff Address" 
                  value={editFormData.dropoff_address} 
                  onChange={handleEditFormChange('dropoff_address')}
                  sx={{ mb: 2 }} 
                />
                <TextField
                  fullWidth
                  label="Pickup Date & Time"
                  type="datetime-local"
                  value={editFormData.pickup_datetime}
                  onChange={handleEditFormChange('pickup_datetime')}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField 
                  fullWidth 
                  label="Vehicle Type" 
                  value={selectedBooking.route_fare?.vehicle_type || 'Standard'} 
                  disabled
                  sx={{ mb: 2 }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing & Payment</Typography>
                <TextField 
                  fullWidth 
                  label="Passenger Count" 
                  type="number" 
                  value={editFormData.passenger_count} 
                  onChange={handleEditFormChange('passenger_count')}
                  sx={{ mb: 2 }} 
                />
                <TextField 
                  fullWidth 
                  label="Base Amount (€)" 
                  type="number" 
                  value={editFormData.base_amount} 
                  onChange={handleEditFormChange('base_amount')}
                  sx={{ mb: 2 }} 
                />
                <TextField 
                  fullWidth 
                  label="Total Amount (€)" 
                  type="number" 
                  value={editFormData.total_amount} 
                  onChange={handleEditFormChange('total_amount')}
                  sx={{ mb: 2 }} 
                />
                <TextField
                  fullWidth
                  select
                  label="Payment Status"
                  value={editFormData.payment_status}
                  onChange={handleEditFormSelectChange('payment_status')}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Assignment & Notes</Typography>
                <TextField 
                  fullWidth 
                  label="Assigned Driver" 
                  value={selectedBooking.assigned_driver ? `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : ''} 
                  disabled
                  sx={{ mb: 2 }} 
                />
                <TextField 
                  fullWidth 
                  label="Assigned Car" 
                  value={selectedBooking.assigned_car ? `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model} (${selectedBooking.assigned_car.license_plate})` : ''} 
                  disabled
                  sx={{ mb: 2 }} 
                />
                <TextField 
                  fullWidth 
                  label="Special Instructions" 
                  value={editFormData.special_instructions} 
                  onChange={handleEditFormChange('special_instructions')}
                  multiline 
                  rows={2} 
                  sx={{ mb: 2 }} 
                />
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
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                  >
                    <MenuItem value="">
                      <em>Select a driver...</em>
                    </MenuItem>
                    {drivers
                      .filter(driver => driver.status === 'active')
                      .map((driver) => (
                        <MenuItem key={driver.id} value={driver.id}>
                          {driver.user?.first_name || 'Unknown'} {driver.user?.last_name || 'Driver'} 
                          (★{parseFloat(driver.average_rating || '0').toFixed(1)}) 
                          - {driver.status}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label="Select Vehicle"
                    value={selectedCarId}
                    onChange={(e) => setSelectedCarId(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                  >
                    <MenuItem value="">
                      <em>Select a vehicle...</em>
                    </MenuItem>
                    {carsArray
                      .filter(car => car.status === 'active')
                      .map((car) => (
                        <MenuItem key={car.id} value={car.id}>
                          {car.make} {car.model} ({car.license_plate}) - {car.status}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                  <TextField
                    fullWidth
                    label="Assignment Notes"
                    multiline
                    rows={3}
                    placeholder="Any special instructions for the driver..."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
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