// @ts-nocheck
import { useState, useEffect } from 'react'
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
  Avatar,
  Tooltip,
  FormControlLabel,
  Switch,
  Divider,
  Rating,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Person,
  DriveEta,
  CheckCircle,
  Star,
  GetApp,
  Phone,
  Email,
} from '@mui/icons-material'
import { useDrivers } from '../../hooks/useDrivers'
import { Driver as DriverType, CreateDriverRequest } from '../../api/drivers'

interface DriverFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  licenseNumber: string
  licenseExpiry: string
  status: 'active' | 'inactive' | 'suspended'
  backgroundCheck: 'pending' | 'approved' | 'rejected'
  dateOfBirth: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  emergencyContact: {
    name: string
    phone: string
  }
  isAvailable: boolean
}

const FleetDrivers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [backgroundFilter, setBackgroundFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [selectedDriver, setSelectedDriver] = useState<DriverType | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [driverToDelete, setDriverToDelete] = useState<DriverType | null>(null)
  const [formData, setFormData] = useState<DriverFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseExpiry: '',
    status: 'active',
    backgroundCheck: 'pending',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      phone: ''
    },
    isAvailable: true
  })

  // Get current user's company context
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  const currentUser = getCurrentUser()
  const companyId = currentUser?.company_id || currentUser?.company?.id
  console.log('FleetDrivers - currentUser:', currentUser)
  console.log('FleetDrivers - companyId:', companyId)

  // API Hooks
  const {
    data: driversData,
    loading,
    error,
    updateFilters,
    createDriver: createDriverAPI,
    updateDriver: updateDriverAPI,
    deleteDriver: deleteDriverAPI,
    refetch
  } = useDrivers()


  // Extract drivers from hook data and ensure it's an array
  console.log('FleetDrivers - driversData:', driversData)
  console.log('FleetDrivers - driversData?.data:', driversData?.data)
  
  // Handle the response structure - the API returns {data: [...], total: number}
  const allDrivers = (() => {
    if (driversData?.data?.data && Array.isArray(driversData.data.data)) {
      return driversData.data.data
    } else if (driversData?.data && Array.isArray(driversData.data)) {
      return driversData.data
    } else if (Array.isArray(driversData)) {
      return driversData
    }
    return []
  })()

  // Filter drivers - note: company filtering may need to be implemented in the API
  const companyDrivers = allDrivers

  // Apply client-side filtering for search and availability
  const filteredDrivers = companyDrivers.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      driver.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.license_number?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    const matchesBackground = backgroundFilter === 'all' || driver.background_check_status === backgroundFilter
    const matchesAvailability = availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && driver.status === 'active') ||
      (availabilityFilter === 'unavailable' && driver.status !== 'active')
    
    return matchesSearch && matchesStatus && matchesBackground && matchesAvailability
  })

  // Company-specific stats
  const companyStats = {
    total: companyDrivers.length,
    active: companyDrivers.filter(d => d.status === 'active').length,
    inactive: companyDrivers.filter(d => d.status === 'inactive').length,
    suspended: companyDrivers.filter(d => d.status === 'suspended').length,
    available: companyDrivers.filter(d => d.status === 'active').length,
    avgRating: companyDrivers.length ? companyDrivers.reduce((sum, d) => sum + parseFloat(d.average_rating || "0"), 0) / companyDrivers.length : 0,
    pendingBackground: companyDrivers.filter(d => d.background_check_status === 'pending').length
  }

  // Load drivers on component mount and when filters change
  useEffect(() => {
    if (companyId) {
      const apiFilters = {
        page: 1,
        limit: 50,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        backgroundCheck: backgroundFilter !== 'all' ? backgroundFilter : undefined,
        search: searchTerm || undefined,
        companyId: companyId, // Add company filter
      }
      updateFilters(apiFilters)
    }
  }, [statusFilter, backgroundFilter, searchTerm, companyId, updateFilters])

  // Initial data fetch on component mount
  useEffect(() => {
    if (companyId && refetch) {
      refetch()
    }
  }, [companyId, refetch])


  const handleViewDriver = (driver: DriverType) => {
    setSelectedDriver(driver)
    setViewDialogOpen(true)
  }

  const handleEditDriver = (driver: DriverType) => {
    setSelectedDriver(driver)
    setFormData({
      firstName: driver.user?.first_name || '',
      lastName: driver.user?.last_name || '',
      email: driver.user?.email || '',
      phoneNumber: driver.user?.phone || '',
      licenseNumber: driver.license_number,
      licenseExpiry: driver.license_expiry,
      status: driver.status,
      backgroundCheck: driver.background_check_status,
      dateOfBirth: driver.date_of_birth,
      address: {
        street: driver.address,
        city: driver.city,
        state: driver.state,
        zipCode: driver.postal_code
      },
      emergencyContact: {
        name: driver.emergency_contact_name,
        phone: driver.emergency_contact_phone
      },
      isAvailable: driver.status === 'active'
    })
    setEditDialogOpen(true)
  }

  const handleAddDriver = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      licenseNumber: '',
      licenseExpiry: '',
      status: 'active',
      backgroundCheck: 'pending',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      emergencyContact: {
        name: '',
        phone: ''
      },
      isAvailable: true
    })
    setAddDialogOpen(true)
  }

  const handleDeleteDriver = (driver: DriverType) => {
    setDriverToDelete(driver)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (driverToDelete) {
      const result = await deleteDriverAPI(driverToDelete.id)
      if (result.success) {
        setDeleteDialogOpen(false)
        setDriverToDelete(null)
      }
    }
  }

  const handleSave = async () => {
    if (editDialogOpen && selectedDriver) {
      // For updates, only send driver-specific fields (user updates not supported)
      const driverUpdateData = {
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        dateOfBirth: formData.dateOfBirth,
        status: formData.status,
        backgroundCheck: formData.backgroundCheck,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        company_id: companyId
        // Note: user fields (name, phone) and experience/languages not supported for updates
      }
      
      const result = await updateDriverAPI(selectedDriver.id, driverUpdateData)
      if (result.success) {
        setEditDialogOpen(false)
        setSelectedDriver(null)
      }
    } else {
      // Create new driver - include all fields for creation
      const driverData = {
        ...formData,
        company_id: companyId
      }
      const result = await createDriverAPI(driverData as CreateDriverRequest)
      if (result.success) {
        setAddDialogOpen(false)
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          licenseNumber: '',
          licenseExpiry: '',
          status: 'active',
          backgroundCheck: 'pending',
          dateOfBirth: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          emergencyContact: {
            name: '',
            phone: ''
          },
          isAvailable: true
        })
      }
    }
  }

  const handleExport = () => {
    try {
      // Create CSV content
      const csvContent = [
        // Header row
        ['Name', 'Email', 'Phone', 'License Number', 'License Expiry', 'Status', 'Background Check', 'Rating', 'Total Trips', 'Address', 'Emergency Contact', 'Emergency Phone'].join(','),
        // Data rows
        ...filteredDrivers.map(driver => [
          `"${driver.user?.first_name || ''} ${driver.user?.last_name || ''}"`,
          `"${driver.user?.email || ''}"`,
          `"${driver.user?.phone || ''}"`,
          `"${driver.license_number || ''}"`,
          `"${driver.license_expiry || ''}"`,
          `"${driver.status || ''}"`,
          `"${driver.background_check_status || ''}"`,
          `"${driver.average_rating || '0'}"`,
          `"${driver.total_rides || 0}"`,
          `"${driver.address || ''}, ${driver.city || ''}, ${driver.state || ''} ${driver.postal_code || ''}"`,
          `"${driver.emergency_contact_name || ''}"`,
          `"${driver.emergency_contact_phone || ''}"`
        ].join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `company-drivers-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log(`Exported ${filteredDrivers.length} drivers to CSV`)
    } catch (error) {
      console.error('Error exporting drivers:', error)
      alert('Failed to export drivers. Please try again.')
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'suspended': return 'error'
      default: return 'default'
    }
  }

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  // Removed unused getDocumentStatusIcon function

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Fleet - Drivers
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<GetApp />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddDriver}>
            Add Driver
          </Button>
        </Box>
      </Box>

      {/* Company Fleet Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Drivers
                  </Typography>
                  <Typography variant="h4">
                    {companyStats.total}
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
                    Active Drivers
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {companyStats.active}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
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
                    Available Now
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {companyStats.available}
                  </Typography>
                </Box>
                <DriveEta sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
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
                    Avg. Rating
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {companyStats.avgRating.toFixed(1)}
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search drivers..."
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
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Background Check"
              value={backgroundFilter}
              onChange={(e) => setBackgroundFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Availability"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setBackgroundFilter('all')
                setAvailabilityFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Drivers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Driver</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Background</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Trips</TableCell>
              <TableCell>Assigned Car</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No drivers found in your fleet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={driver.profile_photo_url}
                      sx={{ width: 50, height: 50 }}
                    >
                      {driver.user?.first_name?.[0] || 'U'}{driver.user?.last_name?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {driver.user?.first_name} {driver.user?.last_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        License: {driver.license_number}
                      </Typography>
                      {driver.status === 'active' && (
                        <Chip label="Available" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Email fontSize="small" /> {driver.user?.email}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone fontSize="small" /> {driver.user?.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {driver.license_number}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Expires: {new Date(driver.license_expiry).toLocaleDateString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={driver.status}
                    color={getStatusColor(driver.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={driver.background_check_status}
                    color={getBackgroundColor(driver.background_check_status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={parseFloat(driver.average_rating)} precision={0.1} size="small" readOnly />
                    <Typography variant="body2">
                      {parseFloat(driver.average_rating).toFixed(1)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {driver.total_rides.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Medical: {driver.medical_clearance ? 'Yes' : 'No'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {driver.carAssignments && driver.carAssignments.length > 0 ? (
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {driver.carAssignments[0].car.make} {driver.carAssignments[0].car.model}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {driver.carAssignments[0].car.license_plate}
                      </Typography>
                      {driver.carAssignments[0].is_primary && (
                        <Chip label="Primary" size="small" color="primary" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Unassigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewDriver(driver)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Driver">
                    <IconButton onClick={() => handleEditDriver(driver)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Driver">
                    <IconButton onClick={() => handleDeleteDriver(driver)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Driver Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Driver Details</DialogTitle>
        <DialogContent>
          {selectedDriver && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Avatar
                    src={selectedDriver.profile_photo_url}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    {selectedDriver.user?.first_name?.[0] || 'U'}{selectedDriver.user?.last_name?.[0] || 'U'}
                  </Avatar>
                  <Typography variant="h6">
                    {selectedDriver.user?.first_name} {selectedDriver.user?.last_name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Rating value={parseFloat(selectedDriver.average_rating)} precision={0.1} size="small" readOnly />
                    <Typography variant="body2">
                      {parseFloat(selectedDriver.average_rating).toFixed(1)} ({selectedDriver.total_rides} trips)
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Typography><strong>Email:</strong> {selectedDriver.user?.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedDriver.user?.phone}</Typography>
                <Typography><strong>Date of Birth:</strong> {new Date(selectedDriver.date_of_birth).toLocaleDateString()}</Typography>
                <Typography><strong>Address:</strong> {selectedDriver.address}, {selectedDriver.city}, {selectedDriver.state} {selectedDriver.postal_code}</Typography>
                <Typography><strong>Member Since:</strong> {new Date(selectedDriver.created_at).toLocaleDateString()}</Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
                <Typography><strong>Name:</strong> {selectedDriver.emergency_contact_name}</Typography>
                <Typography><strong>Phone:</strong> {selectedDriver.emergency_contact_phone}</Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>License & Documentation</Typography>
                <Typography><strong>License Number:</strong> {selectedDriver.license_number}</Typography>
                <Typography><strong>License Expiry:</strong> {new Date(selectedDriver.license_expiry).toLocaleDateString()}</Typography>
                <Typography><strong>Background Check:</strong> {selectedDriver.background_check_status}</Typography>
                <Typography><strong>Medical Clearance:</strong> {selectedDriver.medical_clearance ? 'Yes' : 'No'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Driver Dialog */}
      <Dialog 
        open={editDialogOpen || addDialogOpen} 
        onClose={() => {
          setEditDialogOpen(false)
          setAddDialogOpen(false)
        }} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          {editDialogOpen ? 'Edit Driver' : 'Add New Driver'}
        </DialogTitle>
        <DialogContent>
          {editDialogOpen && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Note: Name, contact information, experience, and languages cannot be updated through this interface. Only driver-specific details (license, status, address) can be modified.
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={editDialogOpen}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={editDialogOpen}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={editDialogOpen}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                disabled={editDialogOpen}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>License & Status</Typography>
              <TextField
                fullWidth
                label="License Number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="License Expiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                sx={{ mb: 2 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="Background Check"
                value={formData.backgroundCheck}
                onChange={(e) => setFormData({...formData, backgroundCheck: e.target.value as any})}
                sx={{ mb: 2 }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  />
                }
                label="Available for Trips"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, street: e.target.value}
                    })}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, city: e.target.value}
                    })}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, state: e.target.value}
                    })}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, zipCode: e.target.value}
                    })}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: {...formData.emergencyContact, name: e.target.value}
                    })}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: {...formData.emergencyContact, phone: e.target.value}
                    })}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false)
            setAddDialogOpen(false)
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editDialogOpen ? 'Save Changes' : 'Add Driver'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Driver</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the driver "{driverToDelete?.user?.first_name} {driverToDelete?.user?.last_name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FleetDrivers