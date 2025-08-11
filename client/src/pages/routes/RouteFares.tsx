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
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Backdrop,
} from '@mui/material'
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Route,
  TrendingUp,
  LocalOffer,
  GetApp,
  CheckCircle,
  Block,
} from '@mui/icons-material'
import { useRoutes } from '../../hooks/useRoutes'
import { RouteFare as ApiRouteFare, CreateRouteFareRequest } from '../../types/api'
import { useGlobalToast } from '../../contexts/ToastContext'
import ConfirmDialog from '../../components/common/ConfirmDialog'

// Using ApiRouteFare from types/api.ts

// Using CreateRouteFareRequest from types/api.ts

const RouteFares = () => {
  // API Integration
  const {
    loading,
    error,
    clearError,
    getRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    getStatistics
  } = useRoutes()

  // Toast notifications
  const toast = useGlobalToast()

  // State Management
  const [routes, setRoutes] = useState<ApiRouteFare[]>([])
  const [totalRoutes, setTotalRoutes] = useState<number>(0)
  const [statistics, setStatistics] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [selectedRoute, setSelectedRoute] = useState<ApiRouteFare | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [routeToDelete, setRouteToDelete] = useState<ApiRouteFare | null>(null)
  const [formData, setFormData] = useState<CreateRouteFareRequest>({
    from_location: '',
    from_country_code: 'AT',
    to_location: '',
    to_country_code: 'AT',
    distance_km: 0,
    vehicle: 'Economy',
    min_fare: 0,
    original_fare: 0,
    sale_fare: 0,
    currency: 'EUR',
    is_active: true,
    effective_from: new Date().toISOString().split('T')[0],
    effective_until: ''
  })

  // Load data on component mount
  useEffect(() => {
    console.log('🚀 RouteFares component mounted, loading data...')
    loadRoutes()
    loadStatistics()
  }, [])

  // Clear error when component unmounts or user dismisses
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError, toast])

  // State for pagination
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  // Reload routes when filters or pagination changes
  useEffect(() => {
    console.log('🔄 Filters changed, reloading routes...', { page, rowsPerPage, searchTerm, statusFilter, vehicleFilter })
    loadRoutes()
  }, [page, rowsPerPage, searchTerm, statusFilter, vehicleFilter])

  const loadRoutes = async (currentPage = page, limit = rowsPerPage, search = searchTerm, status = statusFilter, vehicle = vehicleFilter) => {
    console.log('🔄 Loading routes from API...', { currentPage, limit, search, status, vehicle })
    
    const filters: any = {
      page: currentPage,
      limit: limit,
    }
    
    // Add search filter
    if (search && search.length >= 2) {
      filters.search = search
    }
    
    // Add status filter
    if (status !== 'all') {
      filters.is_active = status === 'active'
    }
    
    // Add vehicle filter
    if (vehicle !== 'all') {
      filters.vehicle = vehicle
    }
    
    // Add sorting for consistency (if supported by API)
    // filters.sort_by = 'created_at'
    // filters.sort_order = 'desc'
    
    const response = await getRoutes(filters)
    console.log('📡 API Response:', response)
    
    if (response) {
      // Handle the response format: {data: [], total: X} or just []
      if (Array.isArray(response)) {
        console.log('✅ Setting routes from array:', response.length, 'items')
        setRoutes(response)
        setTotalRoutes(response.length)
      } else if (response.data && Array.isArray(response.data)) {
        console.log('✅ Setting routes from nested data:', response.data.length, 'items')
        setRoutes(response.data)
        setTotalRoutes(response.total || response.data.length)
      } else {
        console.log('❌ Unexpected response format:', response)
        setRoutes([])
        setTotalRoutes(0)
      }
    } else {
      console.log('❌ No response from API')
      setRoutes([])
      setTotalRoutes(0)
    }
  }

  const loadStatistics = async () => {
    const stats = await getStatistics()
    if (stats) {
      setStatistics(stats)
    }
  }

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page !== 1) {
        setPage(1) // Reset to first page when searching
      } else {
        loadRoutes(1, rowsPerPage, searchTerm, statusFilter, vehicleFilter)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Pagination handlers
  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage + 1) // Material-UI uses 0-based pages, API uses 1-based
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1) // Reset to first page
  }

  // Filter handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value)
    setPage(1) // Reset to first page
  }

  const handleVehicleFilterChange = (event: any) => {
    setVehicleFilter(event.target.value)
    setPage(1) // Reset to first page
  }

  // Vehicle types from backend enums
  const vehicleTypes = [
    'Economy',
    'Standard',
    'Premium',
    'SUV',
    'Mercedes E Class',
    'Van',
    'Luxury'
  ]

  // Currency options
  const currencies = ['EUR', 'USD', 'GBP', 'CHF']

  // Country codes
  const countryCodes = [
    { code: 'AT', name: 'Austria' },
    { code: 'DE', name: 'Germany' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'IT', name: 'Italy' },
    { code: 'FR', name: 'France' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'US', name: 'United States' }
  ]

  // Use real data from API (mock data removed since API is working)
  const routeData = routes // Now routes is always an array
  console.log('🎯 Using API data, routes count:', routeData.length)
  console.log('📊 Route data:', routeData)

  // Show loading state while data is being fetched
  if (loading && routeData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  console.log('🎯 Sample route data for debugging:', routeData[0])

  // Statistics - use API data if available
  const totalRoutesCount = statistics?.totalRoutes || totalRoutes || routeData.length
  const activeRoutes = statistics?.activeRoutes || routeData.filter(route => route.is_active).length
  const avgOriginalFare = statistics?.avgOriginalFare || (routeData.length > 0 ? routeData.reduce((sum, route) => sum + parseFloat(route.original_fare.toString()), 0) / routeData.length : 0)
  const avgSaleFare = statistics?.avgSaleFare || (routeData.length > 0 ? routeData.reduce((sum, route) => sum + parseFloat(route.sale_fare.toString()), 0) / routeData.length : 0)

  const handleView = (route: ApiRouteFare) => {
    setSelectedRoute(route)
    setViewDialogOpen(true)
  }

  const handleEdit = (route: ApiRouteFare) => {
    console.log('✏️ Editing route:', route)
    setSelectedRoute(route)
    setFormData({
      from_location: route.from_location,
      from_country_code: route.from_country_code,
      to_location: route.to_location,
      to_country_code: route.to_country_code,
      distance_km: route.distance_km,
      vehicle: route.vehicle,
      min_fare: parseFloat(route.min_fare.toString()),
      original_fare: parseFloat(route.original_fare.toString()),
      sale_fare: parseFloat(route.sale_fare.toString()),
      currency: route.currency,
      is_active: route.is_active,
      effective_from: route.effective_from.split('T')[0], // Convert ISO date to YYYY-MM-DD
      effective_until: route.effective_until ? route.effective_until.split('T')[0] : ''
    })
    setEditDialogOpen(true)
  }

  const handleDelete = (route: ApiRouteFare) => {
    setRouteToDelete(route)
    setDeleteDialogOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      from_location: '',
      from_country_code: 'AT',
      to_location: '',
      to_country_code: 'AT',
      distance_km: 0,
      vehicle: 'Economy',
      min_fare: 0,
      original_fare: 0,
      sale_fare: 0,
      currency: 'EUR',
      is_active: true,
      effective_from: new Date().toISOString().split('T')[0],
      effective_until: ''
    })
    setAddDialogOpen(true)
  }

  const handleFormSubmit = async () => {
    try {
      if (editDialogOpen && selectedRoute) {
        console.log('🔧 Updating route with ID:', selectedRoute.id, 'Type:', typeof selectedRoute.id)
        console.log('📝 Form data:', formData)
        const updated = await updateRoute(selectedRoute.id, formData)
        if (updated) {
          toast.success('Route fare updated successfully')
          setEditDialogOpen(false)
          setSelectedRoute(null)
          loadRoutes() // Refresh the list
        }
      } else {
        console.log('➕ Creating new route with data:', formData)
        const created = await createRoute(formData)
        if (created) {
          toast.success('Route fare created successfully')
          setAddDialogOpen(false)
          loadRoutes() // Refresh the list
        }
      }
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  const handleDeleteConfirm = async () => {
    if (routeToDelete) {
      const success = await deleteRoute(routeToDelete.id)
      if (success) {
        toast.success('Route fare deleted successfully')
        setDeleteDialogOpen(false)
        setRouteToDelete(null)
        loadRoutes() // Refresh the list
      }
    }
  }

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "From Location,To Location,Vehicle,Distance (km),Min Fare,Original Fare,Sale Fare,Currency,Status\n" +
      routeData.map(route => 
        `${route.from_location},${route.to_location},${route.vehicle},${route.distance_km},${route.min_fare},${route.original_fare},${route.sale_fare},${route.currency},${route.is_active ? 'Active' : 'Inactive'}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "route_fares.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Route Fares
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handleExport}
            sx={{ mr: 2 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            disabled={loading}
          >
            Add Route Fare
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Route sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {totalRoutesCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Routes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {activeRoutes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Routes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    €{avgOriginalFare.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Original Fare
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalOffer sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    €{avgSaleFare.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Sale Fare
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search routes..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={vehicleFilter}
                onChange={handleVehicleFilterChange}
                label="Vehicle Type"
              >
                <MenuItem value="all">All Vehicles</MenuItem>
                {vehicleTypes.map(vehicle => (
                  <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading Backdrop */}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Routes Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Route</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Distance</TableCell>
                <TableCell>Min Fare</TableCell>
                <TableCell>Original Fare</TableCell>
                <TableCell>Sale Fare</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routeData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No routes found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {routeData.map((route) => {
                console.log('🎯 Rendering route row:', route.id, route.from_location, '→', route.to_location)
                return (
                  <TableRow key={route.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {route.from_location} → {route.to_location}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {route.from_country_code} → {route.to_country_code}
                        </Typography>
                      </Box>
                    </TableCell>
                  <TableCell>
                    <Chip
                      label={route.vehicle}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{route.distance_km} km</TableCell>
                  <TableCell>{route.currency} {parseFloat(route.min_fare.toString()).toFixed(2)}</TableCell>
                  <TableCell>{route.currency} {parseFloat(route.original_fare.toString()).toFixed(2)}</TableCell>
                  <TableCell>{route.currency} {parseFloat(route.sale_fare.toString()).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={route.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={route.is_active ? 'success' : 'error'}
                      icon={route.is_active ? <CheckCircle /> : <Block />}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleView(route)} size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(route)} size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(route)} size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalRoutes}
          rowsPerPage={rowsPerPage}
          page={page - 1} // Material-UI uses 0-based pages
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
          labelRowsPerPage="Routes per page:"
        />
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Route Fare Details
        </DialogTitle>
        <DialogContent>
          {selectedRoute && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Route Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">From</Typography>
                  <Typography variant="body1">{selectedRoute.from_location} ({selectedRoute.from_country_code})</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">To</Typography>
                  <Typography variant="body1">{selectedRoute.to_location} ({selectedRoute.to_country_code})</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Distance</Typography>
                  <Typography variant="body1">{selectedRoute.distance_km} km</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Vehicle Type</Typography>
                  <Typography variant="body1">{selectedRoute.vehicle}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Min Fare</Typography>
                  <Typography variant="body1">{selectedRoute.currency} {parseFloat(selectedRoute.min_fare.toString()).toFixed(2)}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Original Fare</Typography>
                  <Typography variant="body1">{selectedRoute.currency} {parseFloat(selectedRoute.original_fare.toString()).toFixed(2)}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Sale Fare</Typography>
                  <Typography variant="body1">{selectedRoute.currency} {parseFloat(selectedRoute.sale_fare.toString()).toFixed(2)}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedRoute.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    color={selectedRoute.is_active ? 'success' : 'error'}
                    icon={selectedRoute.is_active ? <CheckCircle /> : <Block />}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Effective Period</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Effective From</Typography>
                  <Typography variant="body1">{new Date(selectedRoute.effective_from).toLocaleDateString()}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Effective Until</Typography>
                  <Typography variant="body1">
                    {selectedRoute.effective_until ? new Date(selectedRoute.effective_until).toLocaleDateString() : 'No expiry'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={addDialogOpen || editDialogOpen} onClose={() => { setAddDialogOpen(false); setEditDialogOpen(false) }} maxWidth="md" fullWidth>
        <DialogTitle>
          {editDialogOpen ? 'Edit Route Fare' : 'Add New Route Fare'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From Location"
                value={formData.from_location}
                onChange={(e) => setFormData({ ...formData, from_location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>From Country</InputLabel>
                <Select
                  value={formData.from_country_code}
                  onChange={(e) => setFormData({ ...formData, from_country_code: e.target.value })}
                  label="From Country"
                >
                  {countryCodes.map(country => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="To Location"
                value={formData.to_location}
                onChange={(e) => setFormData({ ...formData, to_location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>To Country</InputLabel>
                <Select
                  value={formData.to_country_code}
                  onChange={(e) => setFormData({ ...formData, to_country_code: e.target.value })}
                  label="To Country"
                >
                  {countryCodes.map(country => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Distance (km)"
                type="number"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  label="Vehicle Type"
                >
                  {vehicleTypes.map(vehicle => (
                    <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Min Fare"
                type="number"
                value={formData.min_fare}
                onChange={(e) => setFormData({ ...formData, min_fare: Number(e.target.value) })}
                required
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Original Fare"
                type="number"
                value={formData.original_fare}
                onChange={(e) => setFormData({ ...formData, original_fare: Number(e.target.value) })}
                required
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sale Fare"
                type="number"
                value={formData.sale_fare}
                onChange={(e) => setFormData({ ...formData, sale_fare: Number(e.target.value) })}
                required
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  label="Currency"
                >
                  {currencies.map(currency => (
                    <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Effective From"
                type="date"
                value={formData.effective_from}
                onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Effective Until"
                type="date"
                value={formData.effective_until}
                onChange={(e) => setFormData({ ...formData, effective_until: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText="Leave empty for no expiry"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddDialogOpen(false); setEditDialogOpen(false) }} disabled={loading}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : (editDialogOpen ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message={`Are you sure you want to delete the route fare from ${routeToDelete?.from_location} to ${routeToDelete?.to_location}?`}
        confirmText="Delete"
        severity="error"
        loading={loading}
      />
    </Box>
  )
}

export default RouteFares