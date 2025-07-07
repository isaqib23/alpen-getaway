import React, { useState, useEffect } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tab,
  Tabs,
  TablePagination,
  CircularProgress,
  Backdrop,
} from '@mui/material'
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  AttachMoney,
  TrendingUp,
  Schedule,
  LocalOffer,
  GetApp,
  CheckCircle,
  Block,
  Analytics,
  Speed,
  Timer,
} from '@mui/icons-material'
import { usePricing } from '../../hooks/usePricing'
import { PricingRule, CreatePricingRuleRequest } from '../../api/pricing'
import { useGlobalToast } from '../../contexts/ToastContext'
import ConfirmDialog from '../../components/common/ConfirmDialog'

// Using PricingRule from api/pricing.ts

// Using CreatePricingRuleRequest from api/pricing.ts

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
      id={`pricing-tabpanel-${index}`}
      aria-labelledby={`pricing-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const PricingManagement = () => {
  // API Integration
  const {
    loading,
    error,
    clearError
  } = usePricing()

  // Toast notifications
  const toast = useGlobalToast()

  // State Management
  const [rules] = useState<PricingRule[]>([])
  const [statistics] = useState<any>(null)
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<PricingRule | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formData, setFormData] = useState<CreatePricingRuleRequest>({
    name: '',
    description: '',
    type: 'base',
    priority: 1,
    isActive: true,
    conditions: {},
    multiplier: 1.0,
    fixedAmount: 0,
    maxPrice: 0,
    minPrice: 0,
    applicableVehicles: [],
    applicableRoutes: []
  })

  // Load data on component mount
  useEffect(() => {
    loadPricingRules()
    loadStatistics()
  }, [])

  // Clear error when component unmounts or user dismisses
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const loadPricingRules = async () => {
    // Since pricing rules API might not be implemented yet, use mock data
    // When API is ready, uncomment below:
    // const response = await getPricingRules({ page: 1, limit: 100 })
    // if (response) {
    //   setRules(response.data)
    // }
  }

  const loadStatistics = async () => {
    // When API is ready:
    // const stats = await getStatistics()
    // if (stats) {
    //   setStatistics(stats)
    // }
  }

  // Mock data - replace with actual API call when backend is ready
  const mockPricingRules: PricingRule[] = [
    {
      id: '1',
      name: 'Base Pricing',
      description: 'Standard pricing for all routes',
      type: 'base',
      priority: 1,
      isActive: true,
      conditions: {},
      multiplier: 1.0,
      fixedAmount: 0,
      maxPrice: 500,
      minPrice: 10,
      applicableVehicles: ['Economy', 'Standard', 'Premium'],
      applicableRoutes: ['All'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-05T14:30:00Z'
    },
    {
      id: '2',
      name: 'Weekend Surge',
      description: 'Increased pricing during weekends',
      type: 'surge',
      priority: 2,
      isActive: true,
      conditions: {
        dayOfWeek: ['Saturday', 'Sunday']
      },
      multiplier: 1.5,
      fixedAmount: 0,
      maxPrice: 750,
      minPrice: 15,
      applicableVehicles: ['Economy', 'Standard', 'Premium'],
      applicableRoutes: ['All'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-05T14:30:00Z'
    },
    {
      id: '3',
      name: 'Peak Hours',
      description: 'Morning and evening rush hour pricing',
      type: 'time_based',
      priority: 3,
      isActive: true,
      conditions: {
        timeStart: '07:00',
        timeEnd: '09:00'
      },
      multiplier: 1.25,
      fixedAmount: 5,
      maxPrice: 600,
      minPrice: 12,
      applicableVehicles: ['Economy', 'Standard'],
      applicableRoutes: ['Airport Routes'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-05T14:30:00Z'
    },
    {
      id: '4',
      name: 'Long Distance',
      description: 'Pricing for long distance routes',
      type: 'distance_based',
      priority: 4,
      isActive: true,
      conditions: {
        minDistance: 50
      },
      multiplier: 0.9,
      fixedAmount: 0,
      maxPrice: 1000,
      minPrice: 50,
      applicableVehicles: ['Premium', 'SUV'],
      applicableRoutes: ['All'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-05T14:30:00Z'
    },
    {
      id: '5',
      name: 'High Demand',
      description: 'Dynamic pricing based on demand',
      type: 'demand_based',
      priority: 5,
      isActive: false,
      conditions: {
        demandThreshold: 80
      },
      multiplier: 2.0,
      fixedAmount: 0,
      maxPrice: 800,
      minPrice: 20,
      applicableVehicles: ['All'],
      applicableRoutes: ['All'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-05T14:30:00Z'
    },
    {
      id: '6',
      name: 'Winter Season',
      description: 'Seasonal pricing for winter months',
      type: 'seasonal',
      priority: 6,
      isActive: true,
      conditions: {
        seasonStart: '2024-12-01',
        seasonEnd: '2025-03-31'
      },
      multiplier: 1.15,
      fixedAmount: 0,
      maxPrice: 650,
      minPrice: 12,
      applicableVehicles: ['SUV', 'Premium'],
      applicableRoutes: ['Mountain Routes'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-05T14:30:00Z'
    }
  ]

  // Rule types
  const ruleTypes = [
    { value: 'base', label: 'Base Pricing', icon: <AttachMoney /> },
    { value: 'surge', label: 'Surge Pricing', icon: <TrendingUp /> },
    { value: 'time_based', label: 'Time-Based', icon: <Schedule /> },
    { value: 'distance_based', label: 'Distance-Based', icon: <Speed /> },
    { value: 'demand_based', label: 'Demand-Based', icon: <Analytics /> },
    { value: 'seasonal', label: 'Seasonal', icon: <Timer /> }
  ]

  // Vehicle types
  const vehicleTypes = [
    'Economy',
    'Standard',
    'Premium',
    'SUV',
    'Mercedes E Class',
    'Van',
    'Luxury'
  ]

  // Use real data if available, fallback to mock data
  const rulesData = rules.length > 0 ? rules : mockPricingRules

  // Filter rules based on search and filters
  const filteredRules = rulesData.filter(rule => {
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || rule.type === typeFilter
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && rule.isActive) ||
      (statusFilter === 'inactive' && !rule.isActive)
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Statistics - use API data if available
  const totalRules = statistics?.totalRules || rulesData.length
  const activeRules = statistics?.activeRules || rulesData.filter(rule => rule.isActive).length
  const avgMultiplier = statistics?.avgMultiplier || rulesData.reduce((sum, rule) => sum + rule.multiplier, 0) / rulesData.length
  const maxMultiplier = statistics?.maxMultiplier || Math.max(...rulesData.map(rule => rule.multiplier))

  const handleView = (rule: PricingRule) => {
    setSelectedRule(rule)
    setViewDialogOpen(true)
  }

  const handleEdit = (rule: PricingRule) => {
    setSelectedRule(rule)
    setFormData({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      priority: rule.priority,
      isActive: rule.isActive,
      conditions: rule.conditions,
      multiplier: rule.multiplier,
      fixedAmount: rule.fixedAmount,
      maxPrice: rule.maxPrice,
      minPrice: rule.minPrice,
      applicableVehicles: rule.applicableVehicles,
      applicableRoutes: rule.applicableRoutes
    })
    setEditDialogOpen(true)
  }

  const handleDelete = (rule: PricingRule) => {
    setRuleToDelete(rule)
    setDeleteDialogOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      type: 'base',
      priority: 1,
      isActive: true,
      conditions: {},
      multiplier: 1.0,
      fixedAmount: 0,
      maxPrice: 0,
      minPrice: 0,
      applicableVehicles: [],
      applicableRoutes: []
    })
    setAddDialogOpen(true)
  }

  const handleFormSubmit = async () => {
    try {
      if (editDialogOpen && selectedRule) {
        // When API is ready:
        // const updated = await updatePricingRule(selectedRule.id, formData)
        // if (updated) {
          toast.success('Pricing rule updated successfully')
          setEditDialogOpen(false)
          setSelectedRule(null)
          loadPricingRules() // Refresh the list
        // }
      } else {
        // When API is ready:
        // const created = await createPricingRule(formData)
        // if (created) {
          toast.success('Pricing rule created successfully')
          setAddDialogOpen(false)
          loadPricingRules() // Refresh the list
        // }
      }
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  const handleDeleteConfirm = async () => {
    if (ruleToDelete) {
      // When API is ready:
      // const success = await deletePricingRule(ruleToDelete.id)
      // if (success) {
        toast.success('Pricing rule deleted successfully')
        setDeleteDialogOpen(false)
        setRuleToDelete(null)
        loadPricingRules() // Refresh the list
      // }
    }
  }

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Type,Priority,Multiplier,Fixed Amount,Max Price,Min Price,Status\n" +
      filteredRules.map(rule => 
        `${rule.name},${rule.type},${rule.priority},${rule.multiplier},${rule.fixedAmount},${rule.maxPrice},${rule.minPrice},${rule.isActive ? 'Active' : 'Inactive'}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "pricing_rules.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'base': return 'primary'
      case 'surge': return 'error'
      case 'time_based': return 'warning'
      case 'distance_based': return 'info'
      case 'demand_based': return 'secondary'
      case 'seasonal': return 'success'
      default: return 'default'
    }
  }

  const getTypeIcon = (type: string) => {
    const ruleType = ruleTypes.find(rt => rt.value === type)
    return ruleType ? ruleType.icon : <AttachMoney />
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Pricing Management
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
            Add Pricing Rule
          </Button>
        </Box>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {totalRules}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Rules
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
                    {activeRules}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Rules
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
                    {avgMultiplier.toFixed(2)}x
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Multiplier
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
                    {maxMultiplier.toFixed(1)}x
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Multiplier
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={// @ts-ignore
          (newValue) => setTabValue(newValue)}>
          <Tab label="Pricing Rules" />
          <Tab label="Rule Analytics" />
          <Tab label="Price Simulator" />
        </Tabs>
      </Paper>

      {/* Pricing Rules Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search rules..."
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Rule Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {ruleTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Rules Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Multiplier</TableCell>
                  <TableCell>Fixed Amount</TableCell>
                  <TableCell>Price Range</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {rule.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {rule.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ruleTypes.find(rt => rt.value === rule.type)?.label}
                        size="small"
                        color={getTypeColor(rule.type) as any}
                        variant="outlined"
                        icon={getTypeIcon(rule.type)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.priority}
                        size="small"
                        color={rule.priority <= 3 ? 'error' : rule.priority <= 6 ? 'warning' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{rule.multiplier.toFixed(2)}x</TableCell>
                    <TableCell>€{rule.fixedAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        €{rule.minPrice} - €{rule.maxPrice}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={rule.isActive ? 'success' : 'error'}
                        icon={rule.isActive ? <CheckCircle /> : <Block />}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleView(rule)} size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(rule)} size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(rule)} size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRules.length}
            rowsPerPage={rowsPerPage}
            page={page}
              // @ts-ignore
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </Paper>
      </TabPanel>

      {/* Rule Analytics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rule Type Distribution
                </Typography>
                {ruleTypes.map(type => {
                  const count = mockPricingRules.filter(rule => rule.type === type.value).length
                  const percentage = (count / totalRules) * 100
                  return (
                    <Box key={type.value} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2">{type.label}</Typography>
                        <Typography variant="body2">{count} ({percentage.toFixed(1)}%)</Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                        <Box 
                          sx={{ 
                            width: `${percentage}%`, 
                            height: '100%', 
                            bgcolor: 'primary.main', 
                            borderRadius: 1 
                          }} 
                        />
                      </Box>
                    </Box>
                  )
                })}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Priority Distribution
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    High Priority (1-3): {mockPricingRules.filter(r => r.priority <= 3).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Medium Priority (4-6): {mockPricingRules.filter(r => r.priority > 3 && r.priority <= 6).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Priority (7+): {mockPricingRules.filter(r => r.priority > 6).length}
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Higher priority rules are applied first when multiple rules match the same booking.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Price Simulator Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Price Simulator
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Simulate how pricing rules would affect a booking
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Base Price"
                  type="number"
                  defaultValue="50"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Distance (km)"
                  type="number"
                  defaultValue="25"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  defaultValue="08:00"
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select defaultValue="Economy" label="Vehicle Type">
                    {vehicleTypes.map(vehicle => (
                      <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Applicable Rules
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Base Pricing (1.0x)" color="primary" sx={{ m: 0.5 }} />
                  <Chip label="Peak Hours (1.25x)" color="warning" sx={{ m: 0.5 }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Final Price Calculation
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Base Price: €50.00
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Peak Hours Multiplier: 1.25x
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fixed Amount: +€5.00
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" color="primary">
                    Final Price: €67.50
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Pricing Rule Details
        </DialogTitle>
        <DialogContent>
          {selectedRule && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Rule Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selectedRule.name}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selectedRule.description}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Chip
                    label={ruleTypes.find(rt => rt.value === selectedRule.type)?.label}
                    size="small"
                    color={getTypeColor(selectedRule.type) as any}
                    variant="outlined"
                    icon={getTypeIcon(selectedRule.type)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Priority</Typography>
                  <Typography variant="body1">{selectedRule.priority}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Multiplier</Typography>
                  <Typography variant="body1">{selectedRule.multiplier.toFixed(2)}x</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Fixed Amount</Typography>
                  <Typography variant="body1">€{selectedRule.fixedAmount.toFixed(2)}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Price Range</Typography>
                  <Typography variant="body1">€{selectedRule.minPrice} - €{selectedRule.maxPrice}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedRule.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={selectedRule.isActive ? 'success' : 'error'}
                    icon={selectedRule.isActive ? <CheckCircle /> : <Block />}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Applicable Vehicles</Typography>
                <Box mb={2}>
                  {selectedRule.applicableVehicles.map(vehicle => (
                    <Chip key={vehicle} label={vehicle} size="small" sx={{ m: 0.5 }} />
                  ))}
                </Box>
                <Typography variant="h6" gutterBottom>Applicable Routes</Typography>
                <Box mb={2}>
                  {selectedRule.applicableRoutes.map(route => (
                    <Chip key={route} label={route} size="small" sx={{ m: 0.5 }} />
                  ))}
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
          {editDialogOpen ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rule Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label="Rule Type"
                >
                  {ruleTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Multiplier"
                type="number"
                value={formData.multiplier}
                onChange={(e) => setFormData({ ...formData, multiplier: Number(e.target.value) })}
                required
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fixed Amount"
                type="number"
                value={formData.fixedAmount}
                onChange={(e) => setFormData({ ...formData, fixedAmount: Number(e.target.value) })}
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={formData.maxPrice}
                onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Applicable Vehicles</InputLabel>
                <Select
                  multiple
                  value={formData.applicableVehicles}
                  onChange={(e) => setFormData({ ...formData, applicableVehicles: e.target.value as string[] })}
                  label="Applicable Vehicles"
                >
                  {vehicleTypes.map(vehicle => (
                    <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
        message={`Are you sure you want to delete the pricing rule "${ruleToDelete?.name}"? This action may affect active bookings.`}
        confirmText="Delete"
        severity="error"
        loading={loading}
      />
    </Box>
  )
}

export default PricingManagement