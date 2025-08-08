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
  Alert,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  Search,
  Visibility,
  Assignment,
  DirectionsCar,
  Person,
  CheckCircle,
  Block,
} from '@mui/icons-material'
import { useDriverAssignments } from '../../hooks/useDriverAssignments'
import { useCars } from '../../hooks/useCars'
import { useDrivers } from '../../hooks/useDrivers'
import { DriverAssignment as DriverAssignmentType, CreateAssignmentRequest } from '../../api/driverAssignments'

interface AssignmentFormData {
  driverId: string
  carId: string
  startDate: string
  endDate?: string
  assignmentType: 'permanent' | 'temporary' | 'shift_based'
  workSchedule?: {
    startTime: string
    endTime: string
    workDays: string[]
  }
  notes: string
}

const DriverAssignments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState<DriverAssignmentType | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignmentToDelete, setAssignmentToDelete] = useState<DriverAssignmentType | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<AssignmentFormData>({
    driverId: '',
    carId: '',
    startDate: '',
    endDate: '',
    assignmentType: 'permanent',
    workSchedule: {
      startTime: '08:00',
      endTime: '18:00',
      workDays: []
    },
    notes: ''
  })

  // API Hooks
  const {
    assignments,
    stats: assignmentStats,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    endAssignment
  } = useDriverAssignments()

  const { cars } = useCars()
  const { data: driversData } = useDrivers()
  const drivers = Array.isArray(driversData?.data?.data) ? driversData.data.data : []
  
  // Ensure cars is always an array
  const carsArray = Array.isArray(cars) ? cars : []

  // Apply client-side filtering
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = searchTerm === '' ||
      assignment.driver?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.driver?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.car?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.car?.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    const matchesType = typeFilter === 'all' || assignment.assignmentType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Update filters when state changes
  useEffect(() => {
    const filters = {
      page: 1,
      limit: 50,
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      assignmentType: typeFilter !== 'all' ? typeFilter : undefined
    }
    fetchAssignments(filters)
  }, [searchTerm, statusFilter, typeFilter])

  const workDaysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const assignmentSteps = ['Select Driver', 'Select Vehicle', 'Set Schedule', 'Review & Confirm']

  const stats = {
    total: assignmentStats?.total || 0,
    active: assignmentStats?.active || 0,
    suspended: assignmentStats?.suspended || 0,
    unassignedDrivers: drivers.filter(d => d.status === 'active' && !d.currentCar).length,
    unassignedCars: carsArray.filter(c => c.status === 'active').length // API should handle hasAssignment
  }

  const handleViewAssignment = (assignment: DriverAssignmentType) => {
    setSelectedAssignment(assignment)
    setViewDialogOpen(true)
  }


  const handleNewAssignment = () => {
    setFormData({
      driverId: '',
      carId: '',
      startDate: '',
      endDate: '',
      assignmentType: 'permanent',
      workSchedule: {
        startTime: '08:00',
        endTime: '18:00',
        workDays: []
      },
      notes: ''
    })
    setCurrentStep(0)
    setAssignDialogOpen(true)
  }


  const handleDeleteAssignment = (assignment: DriverAssignmentType) => {
    setAssignmentToDelete(assignment)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (assignmentToDelete) {
      const success = await endAssignment(assignmentToDelete.id)
      if (success) {
        setDeleteDialogOpen(false)
        setAssignmentToDelete(null)
      }
    }
  }

  const handleSave = async () => {
    // Create new assignment
    const success = await createAssignment(formData as CreateAssignmentRequest)
    if (success) {
      setAssignDialogOpen(false)
      setCurrentStep(0)
      // Reset form
      setFormData({
        driverId: '',
        carId: '',
        startDate: '',
        endDate: '',
        assignmentType: 'permanent',
        workSchedule: {
          startTime: '08:00',
          endTime: '18:00',
          workDays: []
        },
        notes: ''
      })
    }
  }


  const handleWorkDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule!,
        workDays: prev.workSchedule!.workDays.includes(day)
          ? prev.workSchedule!.workDays.filter(d => d !== day)
          : [...prev.workSchedule!.workDays, day]
      }
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'suspended': return 'warning'
      case 'ended': return 'error'
      case 'pending': return 'info'
      default: return 'default'
    }
  }

  const getAvailableDrivers = () => {
    return drivers.filter(d => d.status === 'active' && !d.currentCar)
  }

  const getAvailableCars = () => {
    return carsArray.filter(c => c.status === 'active')
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Driver-Car Assignments
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" startIcon={<Assignment />} onClick={handleNewAssignment}>
            New Assignment
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
                    Active Assignments
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.active}
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
                    Total Assignments
                  </Typography>
                  <Typography variant="h4">
                    {stats.total}
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
                    Unassigned Drivers
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.unassignedDrivers}
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
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
                    Unassigned Cars
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.unassignedCars}
                  </Typography>
                </Box>
                <DirectionsCar sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
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
              placeholder="Search assignments..."
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
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="ended">Ended</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Assignment Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="permanent">Permanent</MenuItem>
              <MenuItem value="temporary">Temporary</MenuItem>
              <MenuItem value="shift_based">Shift Based</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setTypeFilter('all')
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Assignments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Driver</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No assignments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={assignment.driver?.profileImage}
                        sx={{ width: 40, height: 40 }}
                      >
                        {assignment.driver?.firstName?.[0] || 'U'}{assignment.driver?.lastName?.[0] || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {assignment.driver?.firstName || 'Unknown'} {assignment.driver?.lastName || 'Driver'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Rating: {assignment.driver?.rating || 0}/5
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {assignment.car?.make || 'Unknown'} {assignment.car?.model || 'Vehicle'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {assignment.car?.licensePlate || 'No Plate'} • {assignment.car?.category || 'Standard'}
                      </Typography>
                    </Box>
                  </TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={assignment.assignmentType || 'Unknown'}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="caption" display="block" color="textSecondary">
                      Since: {assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : 'Unknown'}
                    </Typography>
                    {assignment.endDate && (
                      <Typography variant="caption" display="block" color="textSecondary">
                        Until: {new Date(assignment.endDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {assignment.workSchedule ? (
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {assignment.workSchedule.startTime} - {assignment.workSchedule.endTime}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {assignment.workSchedule.workDays?.length || 0} days/week
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No schedule set
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {assignment.performance?.tripsCompleted || 0} trips
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      €{assignment.performance?.totalEarnings?.toLocaleString() || '0'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={assignment.status || 'Unknown'}
                    color={getStatusColor(assignment.status || 'default') as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewAssignment(assignment)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="End Assignment">
                    <IconButton onClick={() => handleDeleteAssignment(assignment)}>
                      <Block />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Assignment Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assignment Details</DialogTitle>
        <DialogContent>
          {selectedAssignment && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Driver Information</Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={selectedAssignment.driver.profileImage}
                    sx={{ width: 60, height: 60 }}
                  >
                    {selectedAssignment.driver.firstName[0]}{selectedAssignment.driver.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedAssignment.driver.firstName} {selectedAssignment.driver.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedAssignment.driver.email}
                    </Typography>
                  </Box>
                </Box>
                <Typography><strong>Phone:</strong> {selectedAssignment.driver.phoneNumber}</Typography>
                <Typography><strong>Rating:</strong> {selectedAssignment.driver.rating}/5</Typography>
                <Typography><strong>Status:</strong> {selectedAssignment.driver.status}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                <Typography><strong>Vehicle:</strong> {selectedAssignment.car.make} {selectedAssignment.car.model} ({selectedAssignment.car.year})</Typography>
                <Typography><strong>License Plate:</strong> {selectedAssignment.car.licensePlate}</Typography>
                <Typography><strong>Category:</strong> {selectedAssignment.car.category}</Typography>
                <Typography><strong>Status:</strong> {selectedAssignment.car.status}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Assignment Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Type:</strong> {selectedAssignment.assignmentType}</Typography>
                    <Typography><strong>Start Date:</strong> {new Date(selectedAssignment.startDate).toLocaleDateString()}</Typography>
                    {selectedAssignment.endDate && (
                      <Typography><strong>End Date:</strong> {new Date(selectedAssignment.endDate).toLocaleDateString()}</Typography>
                    )}
                    <Typography><strong>Status:</strong> {selectedAssignment.status}</Typography>
                    <Typography><strong>Assigned By:</strong> {selectedAssignment.assignedBy}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {selectedAssignment.workSchedule && (
                      <>
                        <Typography><strong>Work Hours:</strong> {selectedAssignment.workSchedule.startTime} - {selectedAssignment.workSchedule.endTime}</Typography>
                        <Typography><strong>Work Days:</strong> {selectedAssignment.workSchedule.workDays.join(', ')}</Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
                {selectedAssignment.notes && (
                  <Box mt={2}>
                    <Typography><strong>Notes:</strong></Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedAssignment.notes}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h6" color="primary">
                      {selectedAssignment.performance.tripsCompleted}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Trips Completed
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h6" color="success.main">
                      €{selectedAssignment.performance.totalEarnings.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Earnings
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h6" color="warning.main">
                      {selectedAssignment.performance.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Rating
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h6" color="info.main">
                      {selectedAssignment.performance.fuelEfficiency}L/100km
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fuel Efficiency
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* New Assignment Dialog */}
      <Dialog 
        open={assignDialogOpen} 
        onClose={() => setAssignDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>New Driver-Car Assignment</DialogTitle>
        <DialogContent>
          <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
            {assignmentSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Select Driver</Typography>
              <Autocomplete
                options={getAvailableDrivers()}
                getOptionLabel={(option) => `${option.user?.first_name || ''} ${option.user?.last_name || ''}`}
                value={getAvailableDrivers().find(d => d.id === formData.driverId) || null}
                onChange={(_, value) => setFormData({...formData, driverId: value?.id || ''})}
                renderInput={(params) => (
                  <TextField {...params} label="Available Drivers" fullWidth />
                )}
                sx={{ mb: 2 }}
              />
              <Alert severity="info">
                Only drivers without current assignments are shown.
              </Alert>
            </Box>
          )}

          {currentStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Select Vehicle</Typography>
              <Autocomplete
                options={getAvailableCars()}
                getOptionLabel={(option) => `${option.make} ${option.model} - ${option.license_plate}`}
                value={getAvailableCars().find(c => c.id === formData.carId) || null}
                onChange={(_, value) => setFormData({...formData, carId: value?.id || ''})}
                renderInput={(params) => (
                  <TextField {...params} label="Available Vehicles" fullWidth />
                )}
                sx={{ mb: 2 }}
              />
              <Alert severity="info">
                Only vehicles without current assignments are shown.
              </Alert>
            </Box>
          )}

          {currentStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Set Assignment Schedule</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Assignment Type"
                    value={formData.assignmentType}
                    onChange={(e) => setFormData({...formData, assignmentType: e.target.value as any})}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="permanent">Permanent</MenuItem>
                    <MenuItem value="temporary">Temporary</MenuItem>
                    <MenuItem value="shift_based">Shift Based</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {formData.assignmentType === 'temporary' && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={formData.workSchedule?.startTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      workSchedule: {...formData.workSchedule!, startTime: e.target.value}
                    })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={formData.workSchedule?.endTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      workSchedule: {...formData.workSchedule!, endTime: e.target.value}
                    })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Work Days</Typography>
                  <Grid container spacing={1}>
                    {workDaysOptions.map(day => (
                      <Grid item key={day} xs={6} md={3}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.workSchedule?.workDays.includes(day) || false}
                              onChange={() => handleWorkDayToggle(day)}
                            />
                          }
                          label={day}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {currentStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Review & Confirm</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Driver</Typography>
                  <Typography>
                    {getAvailableDrivers().find(d => d.id === formData.driverId)?.user?.first_name} {getAvailableDrivers().find(d => d.id === formData.driverId)?.user?.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Vehicle</Typography>
                  <Typography>
                    {getAvailableCars().find(c => c.id === formData.carId)?.make} {getAvailableCars().find(c => c.id === formData.carId)?.model} - {getAvailableCars().find(c => c.id === formData.carId)?.license_plate}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Assignment Type</Typography>
                  <Typography>{formData.assignmentType}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Start Date</Typography>
                  <Typography>{new Date(formData.startDate).toLocaleDateString()}</Typography>
                </Grid>
                {formData.endDate && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>End Date</Typography>
                    <Typography>{new Date(formData.endDate).toLocaleDateString()}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Work Schedule</Typography>
                  <Typography>
                    {formData.workSchedule?.startTime} - {formData.workSchedule?.endTime}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formData.workSchedule?.workDays.join(', ')}
                  </Typography>
                </Grid>
                {formData.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formData.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>
          )}
          {currentStep < assignmentSteps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 0 && !formData.driverId) ||
                (currentStep === 1 && !formData.carId) ||
                (currentStep === 2 && (!formData.startDate || !formData.workSchedule?.workDays.length))
              }
            >
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSave}>
              Create Assignment
            </Button>
          )}
        </DialogActions>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>End Assignment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end the assignment between "{assignmentToDelete?.driver.firstName} {assignmentToDelete?.driver.lastName}" and "{assignmentToDelete?.car.make} {assignmentToDelete?.car.model} ({assignmentToDelete?.car.licensePlate})"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            End Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DriverAssignments