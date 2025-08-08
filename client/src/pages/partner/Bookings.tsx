// @ts-nocheck
import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
  Alert,
  Pagination,
  Tooltip,
} from '@mui/material'
import {
  Visibility,
  FilterList,
  Download,
  Assignment,
  CheckCircle,
  Schedule,
  Cancel,
  LocalShipping,
} from '@mui/icons-material'
import { useBookings } from '../../hooks/useBookings'
import { Booking, BookingStatus } from '../../api/bookings'

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: BookingStatus.PENDING, label: 'Pending' },
  { value: BookingStatus.CONFIRMED, label: 'Confirmed' },
  { value: BookingStatus.ASSIGNED, label: 'Assigned' },
  { value: BookingStatus.IN_AUCTION, label: 'In Auction' },
  { value: BookingStatus.AUCTION_AWARDED, label: 'Auction Awarded' },
  { value: BookingStatus.IN_PROGRESS, label: 'In Progress' },
  { value: BookingStatus.COMPLETED, label: 'Completed' },
  { value: BookingStatus.CANCELLED, label: 'Cancelled' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case BookingStatus.PENDING:
      return 'warning'
    case BookingStatus.CONFIRMED:
      return 'info'
    case BookingStatus.ASSIGNED:
      return 'secondary'
    case BookingStatus.IN_AUCTION:
      return 'warning'
    case BookingStatus.AUCTION_AWARDED:
      return 'success'
    case BookingStatus.IN_PROGRESS:
      return 'primary'
    case BookingStatus.COMPLETED:
      return 'success'
    case BookingStatus.CANCELLED:
      return 'error'
    default:
      return 'default'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case BookingStatus.PENDING:
      return <Schedule />
    case BookingStatus.CONFIRMED:
    case BookingStatus.ASSIGNED:
      return <CheckCircle />
    case BookingStatus.IN_AUCTION:
      return <Schedule />
    case BookingStatus.AUCTION_AWARDED:
      return <CheckCircle />
    case BookingStatus.IN_PROGRESS:
      return <LocalShipping />
    case BookingStatus.COMPLETED:
      return <CheckCircle />
    case BookingStatus.CANCELLED:
      return <Cancel />
    default:
      return <Assignment />
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const PartnerBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [tabValue, setTabValue] = useState(0)
  

  const { 
    bookings, 
    stats, 
    loading, 
    error, 
    totalPages, 
    currentPage, 
    total, 
    updateFilters 
  } = useBookings({
    page: 1,
    limit: 50 // Get more records for tabs to work properly
  })

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedBooking(null)
  }


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    // Update filters based on tab
    let status: string | undefined = undefined
    switch (newValue) {
      case 1:
        status = BookingStatus.PENDING
        break
      case 2:
        status = BookingStatus.CONFIRMED
        break
      case 3:
        status = BookingStatus.IN_PROGRESS
        break
      case 4:
        status = BookingStatus.COMPLETED
        break
      default:
        status = undefined
    }
    updateFilters({ booking_status: status, search: searchTerm !== '' ? searchTerm : undefined })
  }

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus)
    const status = newStatus === 'all' ? undefined : newStatus
    updateFilters({ booking_status: status, search: searchTerm !== '' ? searchTerm : undefined })
  }

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch)
    updateFilters({ 
      booking_status: statusFilter === 'all' ? undefined : statusFilter,
      search: newSearch !== '' ? newSearch : undefined 
    })
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    updateFilters({ page })
  }

  const getBookingsByStatus = (status: string) => {
    return bookings.filter(booking => booking.booking_status === status)
  }

  const getTabBookings = () => {
    switch (tabValue) {
      case 0:
        return bookings
      case 1:
        return getBookingsByStatus(BookingStatus.PENDING)
      case 2:
        return getBookingsByStatus(BookingStatus.CONFIRMED)
      case 3:
        return getBookingsByStatus(BookingStatus.IN_PROGRESS)
      case 4:
        return getBookingsByStatus(BookingStatus.COMPLETED)
      default:
        return bookings
    }
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and track bookings assigned to your company
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Bookings
                  </Typography>
                  <Typography variant="h4">
                    {loading ? <CircularProgress size={24} /> : total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Assignment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Bookings
                  </Typography>
                  <Typography variant="h4">
                    {loading ? <CircularProgress size={24} /> : (stats?.byStatus?.in_progress || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <LocalShipping />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4">
                    {loading ? <CircularProgress size={24} /> : (stats?.byStatus?.completed || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {loading ? <CircularProgress size={24} /> : `€${stats?.revenue?.total || '0'}`}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Assignment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search bookings"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by customer, route, or ID"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={2}>
                <Button startIcon={<FilterList />} variant="outlined">
                  More Filters
                </Button>
                <Button startIcon={<Download />} variant="outlined">
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Booking Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
            <Tab label="All Bookings" />
            <Tab
              label={
                <Badge badgeContent={stats?.byStatus?.pending || 0} color="warning">
                  Pending
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={stats?.byStatus?.confirmed || 0} color="info">
                  Confirmed
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={stats?.byStatus?.in_progress || 0} color="primary">
                  In Progress
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={stats?.byStatus?.completed || 0} color="success">
                  Completed
                </Badge>
              }
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} loading={loading} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} loading={loading} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} loading={loading} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} loading={loading} />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} loading={loading} />
        </TabPanel>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Booking Details</Typography>
            {selectedBooking && (
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  #{selectedBooking.booking_reference || selectedBooking.id?.slice(-8).toUpperCase()}
                </Typography>
                <Chip
                  label={selectedBooking.booking_status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(selectedBooking.booking_status) as any}
                  icon={getStatusIcon(selectedBooking.booking_status)}
                />
              </Box>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          {selectedBooking && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Customer Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                  Customer Information
                </Typography>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Customer Name</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedBooking.passenger_name || selectedBooking.customer_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">
                          {selectedBooking.passenger_email || selectedBooking.customer_email || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">
                          {selectedBooking.passenger_phone || selectedBooking.customer_phone || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Passengers</Typography>
                        <Typography variant="body1">
                          {selectedBooking.passenger_count || 1} passenger(s)
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Trip Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                  Trip Information
                </Typography>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Route</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedBooking.route_fare ? 
                            `${selectedBooking.route_fare.from_location} → ${selectedBooking.route_fare.to_location}` : 
                            `${selectedBooking.pickup_location || selectedBooking.pickup_address} → ${selectedBooking.destination || selectedBooking.dropoff_address}`
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Date</Typography>
                        <Typography variant="body1">
                          {new Date(selectedBooking.pickup_datetime).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Time</Typography>
                        <Typography variant="body1">
                          {new Date(selectedBooking.pickup_datetime).toLocaleTimeString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Pickup Address</Typography>
                        <Typography variant="body1">
                          {selectedBooking.pickup_address || selectedBooking.pickup_location || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Dropoff Address</Typography>
                        <Typography variant="body1">
                          {selectedBooking.dropoff_address || selectedBooking.destination || 'Not specified'}
                        </Typography>
                      </Grid>
                      {selectedBooking.route_fare?.distance_km && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">Distance</Typography>
                          <Typography variant="body1">
                            {selectedBooking.route_fare.distance_km} km
                          </Typography>
                        </Grid>
                      )}
                      {selectedBooking.special_instructions && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Special Instructions</Typography>
                          <Typography variant="body1">
                            {selectedBooking.special_instructions}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Assignment Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                  Service Assignment
                </Typography>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Assigned Driver</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedBooking.assigned_driver ? 
                            `${selectedBooking.assigned_driver.first_name} ${selectedBooking.assigned_driver.last_name}` : 
                            'Not assigned yet'
                          }
                        </Typography>
                        {selectedBooking.assigned_driver?.license_number && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            License: {selectedBooking.assigned_driver.license_number}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Assigned Vehicle</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedBooking.assigned_car ? 
                            `${selectedBooking.assigned_car.make} ${selectedBooking.assigned_car.model}` : 
                            'Not assigned yet'
                          }
                        </Typography>
                        {selectedBooking.assigned_car?.license_plate && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            License Plate: {selectedBooking.assigned_car.license_plate}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Financial Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                  Financial Details
                </Typography>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Base Amount</Typography>
                        <Typography variant="body1">
                          €{Number(selectedBooking.base_amount || 0).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Discount</Typography>
                        <Typography variant="body1">
                          €{Number(selectedBooking.discount_amount || 0).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Tax</Typography>
                        <Typography variant="body1">
                          €{Number(selectedBooking.tax_amount || 0).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                        <Typography variant="h6" color="primary">
                          €{Number(selectedBooking.total_amount).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                        <Typography variant="body1">
                          {selectedBooking.payment_status?.toUpperCase() || 'Pending'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Trip Progress (if available) */}
              {(selectedBooking.actual_pickup_time || selectedBooking.actual_dropoff_time) && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                    Trip Progress
                  </Typography>
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        {selectedBooking.actual_pickup_time && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Actual Pickup</Typography>
                            <Typography variant="body1">
                              {new Date(selectedBooking.actual_pickup_time).toLocaleString()}
                            </Typography>
                          </Grid>
                        )}
                        {selectedBooking.actual_dropoff_time && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Actual Dropoff</Typography>
                            <Typography variant="body1">
                              {new Date(selectedBooking.actual_dropoff_time).toLocaleString()}
                            </Typography>
                          </Grid>
                        )}
                        {selectedBooking.actual_distance_km && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Actual Distance</Typography>
                            <Typography variant="body1">
                              {selectedBooking.actual_distance_km} km
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Booking Timeline */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                  Booking Timeline
                </Typography>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Created</Typography>
                        <Typography variant="body1">
                          {selectedBooking.created_at ? 
                            new Date(selectedBooking.created_at).toLocaleString() : 
                            'N/A'
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                        <Typography variant="body1">
                          {selectedBooking.updated_at ? 
                            new Date(selectedBooking.updated_at).toLocaleString() : 
                            'N/A'
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined" size="large">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

// Booking Table Component
const BookingTable = ({ 
  bookings, 
  onViewDetails, 
  loading 
}: { 
  bookings: Booking[]
  onViewDetails: (booking: Booking) => void
  loading: boolean
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (bookings.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="textSecondary">
          No bookings found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting your filters or search criteria
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booking Ref</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Route</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {booking.booking_reference}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{booking.passenger_name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {booking.passenger_email || booking.passenger_phone}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {booking.route_fare ? `${booking.route_fare.from_location} → ${booking.route_fare.to_location}` : 'Route not available'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {booking.route_fare?.distance_km ? `${booking.route_fare.distance_km} km` : ''}
                </Typography>
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
                  label={booking.booking_status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(booking.booking_status) as any}
                  size="small"
                  icon={getStatusIcon(booking.booking_status)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {booking.assigned_driver ? 
                    `${booking.assigned_driver.first_name} ${booking.assigned_driver.last_name}` : 
                    'Not assigned'
                  }
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {booking.assigned_car ? 
                    `${booking.assigned_car.make} ${booking.assigned_car.model}` : 
                    'No vehicle assigned'
                  }
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Details">
                  <IconButton 
                    size="small" 
                    onClick={() => onViewDetails(booking)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PartnerBookings