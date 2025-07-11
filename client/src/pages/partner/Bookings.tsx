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
} from '@mui/material'
import {
  Edit,
  Visibility,
  MoreVert,
  FilterList,
  Download,
  Add,
  Assignment,
  CheckCircle,
  Schedule,
  Cancel,
  LocalShipping,
} from '@mui/icons-material'

// Sample data - will be replaced with real API calls
const bookingsData = [
  {
    id: 'B001',
    customer: 'Hans Mueller',
    customerEmail: 'hans.mueller@email.com',
    route: 'Innsbruck → Salzburg',
    pickup: 'Innsbruck Airport',
    dropoff: 'Salzburg Hauptbahnhof',
    date: '2024-01-15',
    time: '14:30',
    amount: 145,
    status: 'IN_PROGRESS',
    driver: 'Klaus Weber',
    vehicle: 'Mercedes E-Class',
    duration: '2h 15m',
    distance: '180 km',
    createdAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 'B002',
    customer: 'Maria Schmidt',
    customerEmail: 'maria.schmidt@email.com',
    route: 'Vienna → Graz',
    pickup: 'Vienna International Airport',
    dropoff: 'Graz City Center',
    date: '2024-01-14',
    time: '09:00',
    amount: 89,
    status: 'COMPLETED',
    driver: 'Stefan Lang',
    vehicle: 'BMW 3 Series',
    duration: '2h 45m',
    distance: '200 km',
    createdAt: '2024-01-13T15:30:00Z',
  },
  {
    id: 'B003',
    customer: 'Peter Gruber',
    customerEmail: 'peter.gruber@email.com',
    route: 'Linz → Innsbruck',
    pickup: 'Linz Hauptbahnhof',
    dropoff: 'Innsbruck City Center',
    date: '2024-01-16',
    time: '16:00',
    amount: 210,
    status: 'CONFIRMED',
    driver: 'Michael Bauer',
    vehicle: 'Audi A6',
    duration: '3h 30m',
    distance: '280 km',
    createdAt: '2024-01-14T11:45:00Z',
  },
  {
    id: 'B004',
    customer: 'Anna Weber',
    customerEmail: 'anna.weber@email.com',
    route: 'Salzburg → Munich',
    pickup: 'Salzburg Airport',
    dropoff: 'Munich Airport',
    date: '2024-01-13',
    time: '12:00',
    amount: 165,
    status: 'CANCELLED',
    driver: 'Thomas Huber',
    vehicle: 'Mercedes C-Class',
    duration: '1h 45m',
    distance: '140 km',
    createdAt: '2024-01-12T14:20:00Z',
  },
]

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'CONFIRMED':
      return 'info'
    case 'IN_PROGRESS':
      return 'primary'
    case 'COMPLETED':
      return 'success'
    case 'CANCELLED':
      return 'error'
    default:
      return 'default'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Schedule />
    case 'CONFIRMED':
      return <CheckCircle />
    case 'IN_PROGRESS':
      return <LocalShipping />
    case 'COMPLETED':
      return <CheckCircle />
    case 'CANCELLED':
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
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedBooking(null)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const filteredBookings = bookingsData.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getBookingsByStatus = (status: string) => {
    return bookingsData.filter(booking => booking.status === status)
  }

  const getTabBookings = () => {
    switch (tabValue) {
      case 0:
        return filteredBookings
      case 1:
        return getBookingsByStatus('PENDING')
      case 2:
        return getBookingsByStatus('CONFIRMED')
      case 3:
        return getBookingsByStatus('IN_PROGRESS')
      case 4:
        return getBookingsByStatus('COMPLETED')
      default:
        return filteredBookings
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          My Bookings
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          New Booking
        </Button>
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
                    {bookingsData.length}
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
                    {getBookingsByStatus('IN_PROGRESS').length}
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
                    {getBookingsByStatus('COMPLETED').length}
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
                    This Month Revenue
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    €{bookingsData.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer, route, or ID"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                <Badge badgeContent={getBookingsByStatus('PENDING').length} color="warning">
                  Pending
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={getBookingsByStatus('CONFIRMED').length} color="info">
                  Confirmed
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={getBookingsByStatus('IN_PROGRESS').length} color="primary">
                  In Progress
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={getBookingsByStatus('COMPLETED').length} color="success">
                  Completed
                </Badge>
              }
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <BookingTable bookings={getTabBookings()} onViewDetails={handleViewDetails} />
        </TabPanel>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Booking Details - {selectedBooking?.id}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Typography><strong>Name:</strong> {selectedBooking.customer}</Typography>
                <Typography><strong>Email:</strong> {selectedBooking.customerEmail}</Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Journey Details
                </Typography>
                <Typography><strong>Route:</strong> {selectedBooking.route}</Typography>
                <Typography><strong>Pickup:</strong> {selectedBooking.pickup}</Typography>
                <Typography><strong>Dropoff:</strong> {selectedBooking.dropoff}</Typography>
                <Typography><strong>Date:</strong> {selectedBooking.date}</Typography>
                <Typography><strong>Time:</strong> {selectedBooking.time}</Typography>
                <Typography><strong>Duration:</strong> {selectedBooking.duration}</Typography>
                <Typography><strong>Distance:</strong> {selectedBooking.distance}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Service Details
                </Typography>
                <Typography><strong>Driver:</strong> {selectedBooking.driver}</Typography>
                <Typography><strong>Vehicle:</strong> {selectedBooking.vehicle}</Typography>
                <Typography><strong>Amount:</strong> €{selectedBooking.amount}</Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Typography><strong>Status:</strong></Typography>
                  <Chip
                    label={selectedBooking.status}
                    color={getStatusColor(selectedBooking.status) as any}
                    size="small"
                    icon={getStatusIcon(selectedBooking.status)}
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Booking Information
                </Typography>
                <Typography><strong>Booking ID:</strong> {selectedBooking.id}</Typography>
                <Typography><strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" startIcon={<Edit />}>
            Edit Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Booking Table Component
const BookingTable = ({ bookings, onViewDetails }: { bookings: any[], onViewDetails: (booking: any) => void }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booking ID</TableCell>
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
                  {booking.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{booking.customer}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {booking.customerEmail}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{booking.route}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {booking.distance} • {booking.duration}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{booking.date}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {booking.time}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  €{booking.amount}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={booking.status}
                  color={getStatusColor(booking.status) as any}
                  size="small"
                  icon={getStatusIcon(booking.status)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{booking.driver}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {booking.vehicle}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onViewDetails(booking)}>
                  <Visibility />
                </IconButton>
                <IconButton size="small">
                  <Edit />
                </IconButton>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PartnerBookings