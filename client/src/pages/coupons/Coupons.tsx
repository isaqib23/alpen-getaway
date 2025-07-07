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
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination,
} from '@mui/material'
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  LocalOffer,
  CheckCircle,
  Block,
  GetApp,
  Percent,
  EuroSymbol,
  Schedule,
  TrendingUp,
} from '@mui/icons-material'

import { 
  couponsAPI, 
  Coupon, 
  CreateCouponRequest, 
  UpdateCouponRequest, 
  CouponFilters,
  CouponStatsResponse,
  DiscountType, 
  CouponStatus 
} from '../../api/coupons'

interface CouponFormData {
  code: string
  name: string
  description: string
  discount_type: DiscountType
  discount_value: number
  minimum_order_amount: number
  maximum_discount_amount: number
  usage_limit: number
  user_usage_limit: number
  valid_from: string
  valid_until: string
  applicable_user_types: string[]
  applicable_routes: string[]
  status: CouponStatus
}

const Coupons = () => {
  // State management
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [stats, setStats] = useState<CouponStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [discountTypeFilter, setDiscountTypeFilter] = useState('all')
  
  // Dialog states
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)
  
  // Form data
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    name: '',
    description: '',
    discount_type: DiscountType.PERCENTAGE,
    discount_value: 0,
    minimum_order_amount: 0,
    maximum_discount_amount: 0,
    usage_limit: 100,
    user_usage_limit: 1,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    applicable_user_types: [],
    applicable_routes: [],
    status: CouponStatus.ACTIVE
  })

  // Load data
  const loadCoupons = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters: CouponFilters = {
        page: page + 1,
        limit: rowsPerPage,
      }
      
      if (searchTerm) filters.search = searchTerm
      if (statusFilter !== 'all') filters.status = statusFilter
      if (discountTypeFilter !== 'all') filters.discount_type = discountTypeFilter
      
      const response = await couponsAPI.getCoupons(filters)
      setCoupons(response.data)
      setTotal(response.total)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load coupons')
      console.error('Error loading coupons:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const loadStats = async () => {
    try {
      const statsData = await couponsAPI.getCouponStats()
      setStats(statsData)
    } catch (err: any) {
      console.error('Error loading stats:', err)
    }
  }
  
  useEffect(() => {
    loadCoupons()
  }, [page, rowsPerPage, searchTerm, statusFilter, discountTypeFilter])
  
  useEffect(() => {
    loadStats()
  }, [])
  
  // Mock data for fallback - remove when API is fully working
  const mockCoupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME10',
      name: 'Welcome Discount',
      description: '10% discount for new customers',
      discount_type: DiscountType.PERCENTAGE,
      discount_value: 10,
      minimum_order_amount: 25.00,
      maximum_discount_amount: 50.00,
      usage_limit: 1000,
      usage_count: 156,
      user_usage_limit: 1,
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
      applicable_user_types: ['customer'],
      applicable_routes: ['all'],
      status: CouponStatus.ACTIVE,
      created_at: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      code: 'SAVE5EUR',
      name: 'Fixed 5 Euro Discount',
      description: '5 EUR off any booking over 30 EUR',
      discount_type: DiscountType.FIXED_AMOUNT,
      discount_value: 5.00,
      minimum_order_amount: 30.00,
      usage_limit: 500,
      usage_count: 243,
      user_usage_limit: 3,
      valid_from: '2024-02-01',
      valid_until: '2024-06-30',
      applicable_user_types: ['customer', 'affiliate'],
      status: CouponStatus.ACTIVE,
      created_at: '2024-02-01T10:00:00Z'
    },
    {
      id: '3',
      code: 'EXPIRED20',
      name: 'Expired 20% Discount',
      description: 'This coupon has expired',
      discount_type: DiscountType.PERCENTAGE,
      discount_value: 20,
      minimum_order_amount: 50.00,
      maximum_discount_amount: 100.00,
      usage_limit: 200,
      usage_count: 87,
      user_usage_limit: 1,
      valid_from: '2023-12-01',
      valid_until: '2023-12-31',
      applicable_user_types: ['customer'],
      status: CouponStatus.EXPIRED,
      created_at: '2023-12-01T10:00:00Z'
    },
    {
      id: '4',
      code: 'PREMIUM15',
      name: 'Premium Route Discount',
      description: '15% off premium vehicle bookings',
      discount_type: DiscountType.PERCENTAGE,
      discount_value: 15,
      minimum_order_amount: 60.00,
      maximum_discount_amount: 75.00,
      usage_limit: 300,
      usage_count: 45,
      user_usage_limit: 2,
      valid_from: '2024-03-01',
      valid_until: '2024-09-30',
      applicable_user_types: ['customer', 'b2b'],
      applicable_routes: ['premium'],
      status: CouponStatus.ACTIVE,
      created_at: '2024-03-01T10:00:00Z'
    },
    {
      id: '5',
      code: 'INACTIVE',
      name: 'Inactive Coupon',
      description: 'This coupon is currently inactive',
      discount_type: DiscountType.FIXED_AMOUNT,
      discount_value: 10.00,
      minimum_order_amount: 40.00,
      usage_limit: 100,
      usage_count: 12,
      user_usage_limit: 1,
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
      applicable_user_types: ['customer'],
      status: CouponStatus.INACTIVE,
      created_at: '2024-01-01T10:00:00Z'
    }
  ]

  // Options from backend enums
  const discountTypes = [
    { value: DiscountType.PERCENTAGE, label: 'Percentage' },
    { value: DiscountType.FIXED_AMOUNT, label: 'Fixed Amount' }
  ]

  const userTypes = [
    { value: 'customer', label: 'Customer' },
    { value: 'affiliate', label: 'Affiliate' },
    { value: 'b2b', label: 'B2B' },
    { value: 'admin', label: 'Admin' }
  ]

  const routeTypes = [
    { value: 'all', label: 'All Routes' },
    { value: 'premium', label: 'Premium Routes' },
    { value: 'economy', label: 'Economy Routes' },
    { value: 'airport', label: 'Airport Routes' }
  ]

  const statusOptions = [
    { value: CouponStatus.ACTIVE, label: 'Active' },
    { value: CouponStatus.INACTIVE, label: 'Inactive' },
    { value: CouponStatus.EXPIRED, label: 'Expired' }
  ]

  // Use real data if available, fallback to mock data

  // Filter coupons based on search and filters (only for mock data)
  const filteredCoupons = coupons.length > 0 ? coupons : mockCoupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter
    const matchesDiscountType = discountTypeFilter === 'all' || coupon.discount_type === discountTypeFilter
    
    return matchesSearch && matchesStatus && matchesDiscountType
  })

  // Statistics from API or calculated from mock data
  const totalCoupons = stats?.totalCoupons || mockCoupons.length
  const activeCoupons = stats?.activeCoupons || mockCoupons.filter(c => c.status === CouponStatus.ACTIVE).length
  const totalUsages = stats?.totalUsages || mockCoupons.reduce((sum, c) => sum + c.usage_count, 0)
  const avgDiscountValue = stats?.avgDiscountPerCoupon || mockCoupons.reduce((sum, c) => {
    return sum + (c.discount_type === DiscountType.PERCENTAGE ? c.discount_value : c.discount_value)
  }, 0) / totalCoupons

  const handleView = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setViewDialogOpen(true)
  }

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_order_amount: coupon.minimum_order_amount || 0,
      maximum_discount_amount: coupon.maximum_discount_amount || 0,
      usage_limit: coupon.usage_limit || 100,
      user_usage_limit: coupon.user_usage_limit,
      valid_from: coupon.valid_from,
      valid_until: coupon.valid_until,
      applicable_user_types: coupon.applicable_user_types || [],
      applicable_routes: coupon.applicable_routes || [],
      status: coupon.status
    })
    setEditDialogOpen(true)
  }

  const handleDelete = (coupon: Coupon) => {
    setCouponToDelete(coupon)
    setDeleteDialogOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: DiscountType.PERCENTAGE,
      discount_value: 0,
      minimum_order_amount: 0,
      maximum_discount_amount: 0,
      usage_limit: 100,
      user_usage_limit: 1,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: '',
      applicable_user_types: [],
      applicable_routes: [],
      status: CouponStatus.ACTIVE
    })
    setAddDialogOpen(true)
  }

  const handleFormSubmit = async () => {
    // Basic form validation
    if (!formData.code.trim()) {
      setError('Coupon code is required')
      return
    }
    if (!formData.name.trim()) {
      setError('Coupon name is required')
      return
    }
    if (formData.discount_value <= 0) {
      setError('Discount value must be greater than 0')
      return
    }
    if (formData.discount_type === DiscountType.PERCENTAGE && formData.discount_value > 100) {
      setError('Percentage discount cannot exceed 100%')
      return
    }
    if (!formData.valid_from || !formData.valid_until) {
      setError('Valid from and until dates are required')
      return
    }
    if (new Date(formData.valid_from) >= new Date(formData.valid_until)) {
      setError('Valid until date must be after valid from date')
      return
    }
    if (formData.user_usage_limit <= 0) {
      setError('User usage limit must be at least 1')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      if (editDialogOpen && selectedCoupon) {
        // Update coupon
        const updateData: UpdateCouponRequest = {
          code: formData.code,
          name: formData.name,
          description: formData.description || undefined,
          discount_type: formData.discount_type,
          discount_value: formData.discount_value,
          minimum_order_amount: formData.minimum_order_amount || undefined,
          maximum_discount_amount: formData.maximum_discount_amount || undefined,
          usage_limit: formData.usage_limit || undefined,
          user_usage_limit: formData.user_usage_limit,
          valid_from: formData.valid_from,
          valid_until: formData.valid_until,
          applicable_user_types: formData.applicable_user_types.length > 0 ? formData.applicable_user_types : undefined,
          applicable_routes: formData.applicable_routes.length > 0 ? formData.applicable_routes : undefined,
          status: formData.status
        }
        
        await couponsAPI.updateCoupon(selectedCoupon.id, updateData)
        setSuccessMessage('Coupon updated successfully')
        setEditDialogOpen(false)
      } else {
        // Create new coupon
        const createData: CreateCouponRequest = {
          code: formData.code,
          name: formData.name,
          description: formData.description || undefined,
          discount_type: formData.discount_type,
          discount_value: formData.discount_value,
          minimum_order_amount: formData.minimum_order_amount || undefined,
          maximum_discount_amount: formData.maximum_discount_amount || undefined,
          usage_limit: formData.usage_limit || undefined,
          user_usage_limit: formData.user_usage_limit,
          valid_from: formData.valid_from,
          valid_until: formData.valid_until,
          applicable_user_types: formData.applicable_user_types.length > 0 ? formData.applicable_user_types : undefined,
          applicable_routes: formData.applicable_routes.length > 0 ? formData.applicable_routes : undefined
        }
        
        await couponsAPI.createCoupon(createData)
        setSuccessMessage('Coupon created successfully')
        setAddDialogOpen(false)
      }
      
      setSelectedCoupon(null)
      await loadCoupons()
      await loadStats()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save coupon')
      console.error('Error saving coupon:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return
    
    try {
      setLoading(true)
      setError(null)
      
      await couponsAPI.deleteCoupon(couponToDelete.id)
      setSuccessMessage(`Coupon "${couponToDelete.code}" deleted successfully`)
      setDeleteDialogOpen(false)
      setCouponToDelete(null)
      
      await loadCoupons()
      await loadStats()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete coupon')
      console.error('Error deleting coupon:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      
      const filters: CouponFilters = {}
      if (searchTerm) filters.search = searchTerm
      if (statusFilter !== 'all') filters.status = statusFilter
      if (discountTypeFilter !== 'all') filters.discount_type = discountTypeFilter
      
      const blob = await couponsAPI.exportCoupons(filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `coupons_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setSuccessMessage('Coupons exported successfully')
    } catch (err: any) {
      // Fallback to client-side export for mock data
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Code,Name,Discount Type,Discount Value,Min Order,Usage Count,Status\n" +
        filteredCoupons.map(coupon => 
          `${coupon.code},${coupon.name},${coupon.discount_type},${coupon.discount_value},${coupon.minimum_order_amount || 0},${coupon.usage_count},${coupon.status}`
        ).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "coupons.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.warn('API export failed, using fallback:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE: return 'success'
      case CouponStatus.INACTIVE: return 'warning'
      case CouponStatus.EXPIRED: return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE: return <CheckCircle />
      case CouponStatus.INACTIVE: return <Block />
      case CouponStatus.EXPIRED: return <Schedule />
      default: return null
    }
  }

  const getDiscountTypeIcon = (type: DiscountType) => {
    return type === DiscountType.PERCENTAGE ? <Percent /> : <EuroSymbol />
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Coupons
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
          >
            Add Coupon
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalOffer sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {totalCoupons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Coupons
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
                    {activeCoupons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Coupons
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
                    {totalUsages}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Usages
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
                <Percent sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {avgDiscountValue.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Discount
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
              placeholder="Search coupons..."
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
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                {statusOptions.map(status => (
                  <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Discount Type</InputLabel>
              <Select
                value={discountTypeFilter}
                onChange={(e) => setDiscountTypeFilter(e.target.value)}
                label="Discount Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                {discountTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setDiscountTypeFilter('all')
                setPage(0)
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading and Error States */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Coupons Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name & Description</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Valid Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading coupons...</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredCoupons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No coupons found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {coupon.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(coupon.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {coupon.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {coupon.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getDiscountTypeIcon(coupon.discount_type)}
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {coupon.discount_type === DiscountType.PERCENTAGE 
                            ? `${coupon.discount_value}%` 
                            : `€${Number(coupon.discount_value || 0).toFixed(2)}`}
                        </Typography>
                        {coupon.minimum_order_amount && (
                          <Typography variant="caption" color="text.secondary">
                            Min: €{Number(coupon.minimum_order_amount).toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {coupon.usage_count} / {coupon.usage_limit || '∞'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max per user: {coupon.user_usage_limit}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(coupon.valid_from).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        to {new Date(coupon.valid_until).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.status}
                      size="small"
                      color={getStatusColor(coupon.status) as any}
                        // @ts-ignore
                      icon={getStatusIcon(coupon.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleView(coupon)} size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(coupon)} size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(coupon)} size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!loading && (
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        )}
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Coupon Details
        </DialogTitle>
        <DialogContent>
          {selectedCoupon && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Code</Typography>
                  <Typography variant="body1">{selectedCoupon.code}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selectedCoupon.name}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selectedCoupon.description || 'No description'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedCoupon.status}
                    size="small"
                    color={getStatusColor(selectedCoupon.status) as any}
                      // @ts-ignore
                    icon={getStatusIcon(selectedCoupon.status)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Discount Rules</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Discount Type</Typography>
                  <Typography variant="body1">
                    {selectedCoupon.discount_type === DiscountType.PERCENTAGE ? 'Percentage' : 'Fixed Amount'}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Discount Value</Typography>
                  <Typography variant="body1">
                    {selectedCoupon.discount_type === DiscountType.PERCENTAGE 
                      ? `${selectedCoupon.discount_value}%` 
                      : `€${Number(selectedCoupon.discount_value || 0).toFixed(2)}`}
                  </Typography>
                </Box>
                {selectedCoupon.minimum_order_amount && (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">Minimum Order Amount</Typography>
                    <Typography variant="body1">€{Number(selectedCoupon.minimum_order_amount || 0).toFixed(2)}</Typography>
                  </Box>
                )}
                {selectedCoupon.maximum_discount_amount && (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">Maximum Discount Amount</Typography>
                    <Typography variant="body1">€{Number(selectedCoupon.maximum_discount_amount || 0).toFixed(2)}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Usage & Validity</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Usage Count</Typography>
                      <Typography variant="body1">
                        {selectedCoupon.usage_count} / {selectedCoupon.usage_limit || '∞'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">User Usage Limit</Typography>
                      <Typography variant="body1">{selectedCoupon.user_usage_limit}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Valid Period</Typography>
                      <Typography variant="body1">
                        {new Date(selectedCoupon.valid_from).toLocaleDateString()} - {new Date(selectedCoupon.valid_until).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              {// @ts-ignore
                (selectedCoupon.applicableUserTypes?.length || selectedCoupon.applicableRoutes?.length) && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Restrictions</Typography>
                  {selectedCoupon.applicable_user_types?.length && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Applicable User Types</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                        {selectedCoupon.applicable_user_types.map(type => (
                          <Chip key={type} label={type} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {selectedCoupon.applicable_routes?.length && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Applicable Routes</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                        {selectedCoupon.applicable_routes.map(route => (
                          <Chip key={route} label={route} size="small" />
                        ))}
                      </Box>
                    </Box>
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

      {/* Add/Edit Dialog */}
      <Dialog open={addDialogOpen || editDialogOpen} onClose={() => { setAddDialogOpen(false); setEditDialogOpen(false) }} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editDialogOpen ? 'Edit Coupon' : 'Add New Coupon'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                helperText="Unique code for the coupon (e.g., SAVE10)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
                helperText="Optional description for the coupon"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as DiscountType })}
                  label="Discount Type"
                >
                  {discountTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={formData.discount_type === DiscountType.PERCENTAGE ? 'Discount Percentage' : 'Discount Amount (EUR)'}
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                required
                inputProps={{ step: formData.discount_type === DiscountType.PERCENTAGE ? 1 : 0.01, min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount (EUR)"
                type="number"
                value={formData.minimum_order_amount}
                onChange={(e) => setFormData({ ...formData, minimum_order_amount: Number(e.target.value) })}
                inputProps={{ step: 0.01, min: 0 }}
                helperText="Minimum order value to apply coupon"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Discount Amount (EUR)"
                type="number"
                value={formData.maximum_discount_amount}
                onChange={(e) => setFormData({ ...formData, maximum_discount_amount: Number(e.target.value) })}
                inputProps={{ step: 0.01, min: 0 }}
                helperText="Max discount for percentage coupons"
                disabled={formData.discount_type === DiscountType.FIXED_AMOUNT}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Usage Limit"
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                inputProps={{ min: 1 }}
                helperText="Total number of times coupon can be used"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="User Usage Limit"
                type="number"
                value={formData.user_usage_limit}
                onChange={(e) => setFormData({ ...formData, user_usage_limit: Number(e.target.value) })}
                inputProps={{ min: 1 }}
                helperText="Max uses per user"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valid From"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valid Until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CouponStatus })}
                  label="Status"
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Restrictions (Optional)</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Applicable User Types</InputLabel>
                <Select
                  multiple
                  value={formData.applicable_user_types}
                  onChange={(e) => setFormData({ ...formData, applicable_user_types: e.target.value as string[] })}
                  label="Applicable User Types"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {userTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Applicable Routes</InputLabel>
                <Select
                  multiple
                  value={formData.applicable_routes}
                  onChange={(e) => setFormData({ ...formData, applicable_routes: e.target.value as string[] })}
                  label="Applicable Routes"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {routeTypes.map(route => (
                    <MenuItem key={route.value} value={route.value}>{route.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddDialogOpen(false); setEditDialogOpen(false) }}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {editDialogOpen ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the coupon{' '}
            <strong>{couponToDelete?.code}</strong> ({couponToDelete?.name})?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error Snackbar */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={4000} 
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Coupons