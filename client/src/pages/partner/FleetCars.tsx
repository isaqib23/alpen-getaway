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
  CircularProgress,
} from '@mui/material'
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  DirectionsCar,
  Build,
  CheckCircle,
  Warning,
  GetApp,
} from '@mui/icons-material'
import { useCars } from '../../hooks/useCars'
import { useCarCategories } from '../../hooks/useCarCategories'
import { Car } from '../../api/cars'

interface CarFormData {
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  category_id: string
  seats: number
  status: 'active' | 'maintenance' | 'inactive'
  has_wifi: boolean
  has_ac: boolean
  has_gps: boolean
  has_wheelchair_access: boolean
  has_child_seat: boolean
  has_infant_seat: boolean
  has_medical_equipment: boolean
  last_service_date: string
  next_service_date: string
  odometer_reading: number
}

const FleetCars = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<Car | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<CarFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    license_plate: '',
    category_id: '',
    seats: 4,
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    has_wifi: false,
    has_ac: false,
    has_gps: false,
    has_wheelchair_access: false,
    has_child_seat: false,
    has_infant_seat: false,
    has_medical_equipment: false,
    last_service_date: '',
    next_service_date: '',
    odometer_reading: 0,
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
  const companyId = currentUser?.company?.id

  const { 
    cars, 
    loading,
    createCar, 
    updateCar, 
    deleteCar,
    fetchCars
  } = useCars()

  const { categories } = useCarCategories()

  // Filter cars - note: company filtering may need to be implemented in the API
  const companyCars = cars || []

  const filteredCars = companyCars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || 
                           (car.category && car.category.id === categoryFilter) ||
                           car.category_id === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Company-specific stats
  const companyStats = {
    total: companyCars.length,
    active: companyCars.filter(car => car.status === 'active').length,
    maintenance: companyCars.filter(car => car.status === 'maintenance').length,
    inactive: companyCars.filter(car => car.status === 'inactive').length,
  }

  // Handle search and filter changes
  useEffect(() => {
    const filters = {
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
      companyId: companyId, // Add company filter
    }
    fetchCars(filters)
  }, [searchTerm, statusFilter, categoryFilter, companyId])

  const handleViewCar = (car: Car) => {
    setSelectedCar(car)
    setViewDialogOpen(true)
  }

  const handleEditCar = (car: Car) => {
    setSelectedCar(car)
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      license_plate: car.license_plate,
      category_id: car.category_id,
      seats: car.seats,
      status: car.status,
      has_wifi: car.has_wifi,
      has_ac: car.has_ac,
      has_gps: car.has_gps,
      has_wheelchair_access: car.has_wheelchair_access,
      has_child_seat: car.has_child_seat,
      has_infant_seat: car.has_infant_seat,
      has_medical_equipment: car.has_medical_equipment,
      last_service_date: car.last_service_date,
      next_service_date: car.next_service_date,
      odometer_reading: car.odometer_reading,
    })
    setEditDialogOpen(true)
  }

  const handleAddCar = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      license_plate: '',
      category_id: '',
      seats: 4,
      status: 'active',
      has_wifi: false,
      has_ac: false,
      has_gps: false,
      has_wheelchair_access: false,
      has_child_seat: false,
      has_infant_seat: false,
      has_medical_equipment: false,
      last_service_date: '',
      next_service_date: '',
      odometer_reading: 0,
    })
    setAddDialogOpen(true)
  }

  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (carToDelete) {
      const success = await deleteCar(carToDelete.id)
      if (success) {
        setDeleteDialogOpen(false)
        setCarToDelete(null)
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Add company context to form data
      const carData = {
        ...formData,
        company_id: companyId
      }

      if (editDialogOpen && selectedCar) {
        const success = await updateCar(selectedCar.id, carData)
        if (success) {
          setEditDialogOpen(false)
          setSelectedCar(null)
        }
      } else if (addDialogOpen) {
        const success = await createCar(carData)
        if (success) {
          setAddDialogOpen(false)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    console.log('Exporting company cars...')
    // Add export logic here with company filtering
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'maintenance': return 'warning'
      case 'inactive': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />
      case 'maintenance': return <Build />
      case 'inactive': return <Warning />
      default: return null
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Fleet - Cars
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<GetApp />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddCar}>
            Add New Car
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
                    Total Cars
                  </Typography>
                  <Typography variant="h4">
                    {companyStats.total}
                  </Typography>
                </Box>
                <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
                    Active
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
                    In Maintenance
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {companyStats.maintenance}
                  </Typography>
                </Box>
                <Build sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
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
                    Inactive
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {companyStats.inactive}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
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
              placeholder="Search cars..."
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
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {(categories || []).map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setCategoryFilter('all')
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Cars Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Service Due</TableCell>
              <TableCell>Odometer</TableCell>
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
            ) : filteredCars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No cars found in your fleet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        // @ts-ignore
                      src={car.image}
                      variant="rounded"
                      sx={{ width: 60, height: 40 }}
                    >
                      <DirectionsCar />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {car.make} {car.model}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {car.year} • {car.color}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {car.license_plate}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {car.seats} seats
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={car.category?.name || 'Unknown'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                      // @ts-ignore
                    icon={getStatusIcon(car.status)}
                    label={car.status}
                    color={getStatusColor(car.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {// @ts-ignore
                    car.assignedDriver ? (
                      // @ts-ignore
                    <Typography variant="body2">{car.assignedDriver}</Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">Unassigned</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(car.next_service_date).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {car.odometer_reading} km
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewCar(car)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Car">
                    <IconButton onClick={() => handleEditCar(car)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Car">
                    <IconButton onClick={() => handleDeleteCar(car)}>
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

      {/* View Car Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Car Details</DialogTitle>
        <DialogContent>
          {selectedCar && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                <Typography><strong>Make & Model:</strong> {selectedCar.make} {selectedCar.model}</Typography>
                <Typography><strong>Year:</strong> {selectedCar.year}</Typography>
                <Typography><strong>Color:</strong> {selectedCar.color}</Typography>
                <Typography><strong>License Plate:</strong> {selectedCar.license_plate}</Typography>
                <Typography><strong>Category:</strong> {selectedCar.category?.name || 'Unknown'}</Typography>
                <Typography><strong>Seats:</strong> {selectedCar.seats}</Typography>
                <Typography><strong>Status:</strong> {selectedCar.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Maintenance Information</Typography>
                <Typography><strong>Last Service:</strong> {new Date(selectedCar.last_service_date).toLocaleDateString()}</Typography>
                <Typography><strong>Next Service:</strong> {new Date(selectedCar.next_service_date).toLocaleDateString()}</Typography>
                <Typography><strong>Odometer:</strong> {selectedCar.odometer_reading} km</Typography>
                {// @ts-ignore
                  selectedCar.assignedDriver && (
                    // @ts-ignore
                  <Typography><strong>Assigned Driver:</strong> {selectedCar.assignedDriver}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Features & Equipment</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {selectedCar.has_wifi && <Chip label="WiFi" size="small" />}
                  {selectedCar.has_ac && <Chip label="Air Conditioning" size="small" />}
                  {selectedCar.has_gps && <Chip label="GPS Navigation" size="small" />}
                  {selectedCar.has_wheelchair_access && <Chip label="Wheelchair Access" size="small" />}
                  {selectedCar.has_child_seat && <Chip label="Child Seat" size="small" />}
                  {selectedCar.has_infant_seat && <Chip label="Infant Seat" size="small" />}
                  {selectedCar.has_medical_equipment && <Chip label="Medical Equipment" size="small" />}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Car Dialog */}
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
          {editDialogOpen ? 'Edit Car' : 'Add New Car'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Make"
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="License Plate"
                value={formData.license_plate}
                onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                sx={{ mb: 2 }}
              >
                {(categories || []).map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'maintenance' | 'inactive'})}
                sx={{ mb: 2 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Odometer Reading (km)"
                type="number"
                value={formData.odometer_reading}
                onChange={(e) => setFormData({...formData, odometer_reading: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Service Date"
                type="date"
                value={formData.last_service_date}
                onChange={(e) => setFormData({...formData, last_service_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Next Service Date"
                type="date"
                value={formData.next_service_date}
                onChange={(e) => setFormData({...formData, next_service_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Features & Equipment</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.has_wifi}
                        onChange={(e) => setFormData({
                          ...formData,
                          has_wifi: e.target.checked
                        })}
                      />
                    }
                    label="WiFi"
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.has_ac}
                        onChange={(e) => setFormData({
                          ...formData,
                          has_ac: e.target.checked
                        })}
                      />
                    }
                    label="Air Conditioning"
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.has_gps}
                        onChange={(e) => setFormData({
                          ...formData,
                          has_gps: e.target.checked
                        })}
                      />
                    }
                    label="GPS Navigation"
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.has_wheelchair_access}
                        onChange={(e) => setFormData({
                          ...formData,
                          has_wheelchair_access: e.target.checked
                        })}
                      />
                    }
                    label="Wheelchair Access"
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.has_child_seat}
                        onChange={(e) => setFormData({
                          ...formData,
                          has_child_seat: e.target.checked
                        })}
                      />
                    }
                    label="Child Seat"
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.has_infant_seat}
                        onChange={(e) => setFormData({
                          ...formData,
                          has_infant_seat: e.target.checked
                        })}
                      />
                    }
                    label="Infant Seat"
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.has_medical_equipment}
                        onChange={(e) => setFormData({
                          ...formData,
                          has_medical_equipment: e.target.checked
                        })}
                      />
                    }
                    label="Medical Equipment"
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
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : (editDialogOpen ? 'Save Changes' : 'Add Car')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the car "{carToDelete?.make} {carToDelete?.model} ({carToDelete?.license_plate})"? This action cannot be undone.
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

export default FleetCars