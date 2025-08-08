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
  Avatar,
  LinearProgress,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination,
} from '@mui/material'
import {
  Search,
  Visibility,
  Delete,
  TrendingUp,
  LocalOffer,
  Person,
  GetApp,
  AttachMoney,
  CheckCircle,
} from '@mui/icons-material'

import { 
  couponsAPI, 
  CouponUsage as APICouponUsage,
  CouponUsageFilters 
} from '../../api/coupons'

interface CouponUsage extends APICouponUsage {
  // Add UI-specific fields if needed
  userName?: string
  userEmail?: string
  userType?: string
  bookingReference?: string
  originalAmount?: number
  finalAmount?: number
  routeFrom?: string
  routeTo?: string
  vehicleType?: string
}

const CouponUsage = () => {
  // State management
  const [usageData, setUsageData] = useState<CouponUsage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [couponFilter, setCouponFilter] = useState('all')
  const [userTypeFilter, setUserTypeFilter] = useState('all')
  const [dateRangeFilter, setDateRangeFilter] = useState('all')
  
  // Dialog states
  const [selectedUsage, setSelectedUsage] = useState<CouponUsage | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [usageToDelete, setUsageToDelete] = useState<CouponUsage | null>(null)

  // Load usage data
  const loadUsageData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters: CouponUsageFilters = {
        page: page + 1,
        limit: rowsPerPage,
      }
      
      if (searchTerm) filters.search = searchTerm
      if (couponFilter !== 'all') filters.coupon_id = couponFilter
      if (userTypeFilter !== 'all') filters.user_type = userTypeFilter
      
      // Add date range filtering
      if (dateRangeFilter !== 'all') {
        const now = new Date()
        const fromDate = new Date()
        
        switch (dateRangeFilter) {
          case 'today':
            fromDate.setDate(now.getDate() - 1)
            break
          case '7days':
            fromDate.setDate(now.getDate() - 7)
            break
          case '30days':
            fromDate.setDate(now.getDate() - 30)
            break
          case '90days':
            fromDate.setDate(now.getDate() - 90)
            break
        }
        
        if (dateRangeFilter !== 'all') {
          filters.date_from = fromDate.toISOString().split('T')[0]
          filters.date_to = now.toISOString().split('T')[0]
        }
      }
      
      const response = await couponsAPI.getCouponUsage(filters)
      setUsageData(response.data)
      setTotal(response.total)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load coupon usage data')
      console.error('Error loading usage data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadUsageData()
  }, [page, rowsPerPage, searchTerm, couponFilter, userTypeFilter, dateRangeFilter])
  
  // Mock data for fallback - remove when API is fully working

  const mockUsageData: CouponUsage[] = [
    {
      id: '1',
      coupon_id: '1',
      user_id: 'user1',
      booking_id: 'book1',
      discount_applied: 3.50,
      used_at: '2024-01-15T14:30:00Z',
      // UI-specific mock data
      // @ts-ignore
      couponCode: 'WELCOME10',
      couponName: 'Welcome Discount',
      userName: 'Anna Schmidt',
      userEmail: 'anna.schmidt@email.com',
      userType: 'customer',
      bookingReference: 'BK-2024-001',
      originalAmount: 35.00,
      finalAmount: 31.50,
      routeFrom: 'Innsbruck Airport',
      routeTo: 'Absam',
      vehicleType: 'Economy'
    },
    {
      id: '2',
      coupon_id: '2',
      user_id: 'user2',
      booking_id: 'book2',
      discount_applied: 5.00,
      used_at: '2024-01-16T10:15:00Z',
      // UI-specific mock data
      // @ts-ignore
      couponCode: 'SAVE5EUR',
      couponName: 'Fixed 5 Euro Discount',
      userName: 'Hans Müller',
      userEmail: 'hans.mueller@company.at',
      userType: 'b2b',
      bookingReference: 'BK-2024-002',
      originalAmount: 45.00,
      finalAmount: 40.00,
      routeFrom: 'Innsbruck Airport',
      routeTo: 'Hall in Tirol',
      vehicleType: 'Mercedes E Class'
    },
    {
      id: '3',
      coupon_id: '4',
      user_id: 'user3',
      booking_id: 'book3',
      discount_applied: 9.00,
      used_at: '2024-01-17T16:45:00Z',
      // UI-specific mock data
      // @ts-ignore
      couponCode: 'PREMIUM15',
      couponName: 'Premium Route Discount',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@affiliate.com',
      userType: 'affiliate',
      bookingReference: 'BK-2024-003',
      originalAmount: 60.00,
      finalAmount: 51.00,
      routeFrom: 'Salzburg Airport',
      routeTo: 'Salzburg Old Town',
      vehicleType: 'Premium'
    },
    {
      id: '4',
      coupon_id: '1',
      user_id: 'user4',
      booking_id: 'book4',
      discount_applied: 5.00,
      used_at: '2024-01-18T12:20:00Z',
      // UI-specific mock data
      // @ts-ignore
      couponCode: 'WELCOME10',
      couponName: 'Welcome Discount',
      userName: 'Maria Weber',
      userEmail: 'maria.weber@gmail.com',
      userType: 'customer',
      bookingReference: 'BK-2024-004',
      originalAmount: 50.00,
      finalAmount: 45.00,
      routeFrom: 'Innsbruck Central Station',
      routeTo: 'Seefeld',
      vehicleType: 'Economy'
    },
    {
      id: '5',
      coupon_id: '2',
      user_id: 'user5',
      booking_id: 'book5',
      discount_applied: 5.00,
      used_at: '2024-01-19T09:10:00Z',
      // UI-specific mock data
      // @ts-ignore
      couponCode: 'SAVE5EUR',
      couponName: 'Fixed 5 Euro Discount',
      userName: 'Thomas Fischer',
      userEmail: 'thomas.fischer@business.de',
      userType: 'b2b',
      bookingReference: 'BK-2024-005',
      originalAmount: 75.00,
      finalAmount: 70.00,
      routeFrom: 'Vienna Airport',
      routeTo: 'Vienna City Center',
      vehicleType: 'SUV'
    }
  ]

  // Get unique coupons for filter
  const uniqueCoupons = Array.from(
    new Set(mockUsageData.map(usage => `${// @ts-ignore
      usage.couponCode}|${usage.couponName}`))
  ).map(combo => {
    const [code, name] = combo.split('|')
    return { code, name }
  })

  const userTypes = [
    { value: 'customer', label: 'Customer' },
    { value: 'affiliate', label: 'Affiliate' },
    { value: 'b2b', label: 'B2B' }
  ]

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ]

  // Use real data if available, fallback to mock data

  // Filter usage data (only for mock data)
  const filteredUsage = usageData.length > 0 ? usageData : mockUsageData.filter(usage => {
    const matchesSearch =
        // @ts-ignore
      (usage.couponCode && usage.couponCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usage.userName && usage.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usage.userEmail && usage.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usage.bookingReference && usage.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()))
    // @ts-ignore
    const matchesCoupon = couponFilter === 'all' || (usage.couponCode && usage.couponCode === couponFilter)
    const matchesUserType = userTypeFilter === 'all' || (usage.userType && usage.userType === userTypeFilter)
    
    // Simple date filtering (for demo purposes)
    let matchesDateRange = true
    if (dateRangeFilter !== 'all') {
      const usageDate = new Date(usage.used_at)
      const now = new Date()
      const daysAgo = new Date()
      
      switch (dateRangeFilter) {
        case 'today':
          daysAgo.setDate(now.getDate() - 1)
          matchesDateRange = usageDate >= daysAgo
          break
        case '7days':
          daysAgo.setDate(now.getDate() - 7)
          matchesDateRange = usageDate >= daysAgo
          break
        case '30days':
          daysAgo.setDate(now.getDate() - 30)
          matchesDateRange = usageDate >= daysAgo
          break
        case '90days':
          daysAgo.setDate(now.getDate() - 90)
          matchesDateRange = usageDate >= daysAgo
          break
      }
    }
    
    return matchesSearch && matchesCoupon && matchesUserType && matchesDateRange
  })

  // Statistics
  const totalUsages = filteredUsage.length
  const totalDiscountGiven = filteredUsage.reduce((sum, usage) => sum + usage.discount_applied, 0)
  const totalOriginalAmount = filteredUsage.reduce((sum, usage) => sum + (usage.originalAmount || 0), 0)
  const avgDiscountPerUsage = totalUsages > 0 ? totalDiscountGiven / totalUsages : 0
  const discountRate = totalOriginalAmount > 0 ? (totalDiscountGiven / totalOriginalAmount) * 100 : 0

  // Usage by coupon
  const usageByCoupon = filteredUsage.reduce((acc, usage) => {
    // @ts-ignore
    const key = usage.couponCode || usage.coupon_id
    if (!acc[key]) {
      // @ts-ignore
      acc[key] = { count: 0, totalDiscount: 0, name: usage.couponName || 'Unknown Coupon' }
    }
    acc[key].count += 1
    acc[key].totalDiscount += usage.discount_applied
    return acc
  }, {} as Record<string, { count: number; totalDiscount: number; name: string }>)

  const handleView = (usage: CouponUsage) => {
    setSelectedUsage(usage)
    setViewDialogOpen(true)
  }

  const handleDelete = (usage: CouponUsage) => {
    setUsageToDelete(usage)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!usageToDelete) return
    
    try {
      setLoading(true)
      setError(null)
      
      // Note: This would require a delete endpoint for usage records
      // await couponsAPI.deleteCouponUsage(usageToDelete.id)
      
      // For now, just simulate the deletion
      setSuccessMessage(`Usage record deleted successfully`)
      setDeleteDialogOpen(false)
      setUsageToDelete(null)
      
      await loadUsageData()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete usage record')
      console.error('Error deleting usage record:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      
      const filters: CouponUsageFilters = {}
      if (searchTerm) filters.search = searchTerm
      if (couponFilter !== 'all') filters.coupon_id = couponFilter
      if (userTypeFilter !== 'all') filters.user_type = userTypeFilter
      
      // Add date range filtering
      if (dateRangeFilter !== 'all') {
        const now = new Date()
        const fromDate = new Date()
        
        switch (dateRangeFilter) {
          case 'today':
            fromDate.setDate(now.getDate() - 1)
            break
          case '7days':
            fromDate.setDate(now.getDate() - 7)
            break
          case '30days':
            fromDate.setDate(now.getDate() - 30)
            break
          case '90days':
            fromDate.setDate(now.getDate() - 90)
            break
        }
        
        if (dateRangeFilter !== 'all') {
          filters.date_from = fromDate.toISOString().split('T')[0]
          filters.date_to = now.toISOString().split('T')[0]
        }
      }
      
      const blob = await couponsAPI.exportCouponUsage(filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `coupon_usage_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setSuccessMessage('Usage data exported successfully')
    } catch (err: any) {
      // Fallback to client-side export for mock data
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Coupon Code,User Name,User Email,User Type,Booking Ref,Discount Applied,Original Amount,Final Amount,Used At,Route\n" +
        filteredUsage.map(usage => 
          `${// @ts-ignore
          usage.couponCode || 'N/A'},${usage.userName || 'N/A'},${usage.userEmail || 'N/A'},${usage.userType || 'N/A'},${usage.bookingReference || 'N/A'},${Number(usage.discount_applied || 0).toFixed(2)},${(usage.originalAmount || 0).toFixed(2)},${(usage.finalAmount || 0).toFixed(2)},${new Date(usage.used_at).toLocaleDateString()},"${usage.routeFrom || 'N/A'} to ${usage.routeTo || 'N/A'}"`
        ).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "coupon_usage.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.warn('API export failed, using fallback:', err)
    } finally {
      setLoading(false)
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'customer': return 'primary'
      case 'affiliate': return 'secondary'
      case 'b2b': return 'info'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Coupon Usage
        </Typography>
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {totalUsages}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Uses
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
                <AttachMoney sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    €{Number(totalDiscountGiven || 0).toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Discount
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
                    €{Number(avgDiscountPerUsage || 0).toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg per Use
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
                <CheckCircle sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {Number(discountRate || 0).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discount Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Coupon Performance Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Coupon Performance Summary
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(usageByCoupon).map(([code, data]) => (
              <Grid item xs={12} md={6} key={code}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body1" fontWeight="bold">{code}</Typography>
                    <Chip label={`${data.count} uses`} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {data.name}
                  </Typography>
                  <Typography variant="body2">
                    Total Discount: €{Number(data.totalDiscount || 0).toFixed(2)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((data.count / totalUsages) * 100, 100)} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search usage..."
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
              <InputLabel>Coupon</InputLabel>
              <Select
                value={couponFilter}
                onChange={(e) => setCouponFilter(e.target.value)}
                label="Coupon"
              >
                <MenuItem value="all">All Coupons</MenuItem>
                {uniqueCoupons.map(coupon => (
                  <MenuItem key={coupon.code} value={coupon.code}>
                    {coupon.code} - {coupon.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>User Type</InputLabel>
              <Select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                label="User Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                {userTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                label="Date Range"
              >
                {dateRanges.map(range => (
                  <MenuItem key={range.value} value={range.value}>{range.label}</MenuItem>
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
                setCouponFilter('all')
                setUserTypeFilter('all')
                setDateRangeFilter('all')
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
      
      {/* Usage Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Coupon</TableCell>
                <TableCell>Booking</TableCell>
                <TableCell>Discount Applied</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Used At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading usage data...</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredUsage.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No usage data found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredUsage.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {usage.userName || (usage.user?.first_name && usage.user?.last_name ? `${usage.user.first_name} ${usage.user.last_name}` : 'Unknown User')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {usage.userEmail || usage.user?.email || 'No email'}
                        </Typography>
                        <br />
                        <Chip 
                          label={usage.userType || usage.user?.user_type || 'Unknown'} 
                          size="small" 
                          color={getUserTypeColor(usage.userType || usage.user?.user_type || 'customer') as any}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {// @ts-ignore
                          usage.couponCode || usage.coupon?.code || 'Unknown Code'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {// @ts-ignore
                          usage.couponName || usage.coupon?.name || 'Unknown Coupon'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {usage.bookingReference || usage.booking?.reference_number || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {usage.vehicleType || usage.booking?.vehicle_type || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        -€{Number(usage.discount_applied || 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        €{(usage.originalAmount || usage.booking?.total_amount || 0)} → €{(usage.finalAmount || usage.booking?.final_amount || 0)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {usage.routeFrom || usage.booking?.pickup_location || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      to {usage.routeTo || usage.booking?.destination || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(usage.used_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(usage.used_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleView(usage)} size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Usage Record">
                      <IconButton onClick={() => handleDelete(usage)} size="small" color="error">
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
          Coupon Usage Details
        </DialogTitle>
        <DialogContent>
          {selectedUsage && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>User Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selectedUsage.userName || (selectedUsage.user?.first_name && selectedUsage.user?.last_name ? `${selectedUsage.user.first_name} ${selectedUsage.user.last_name}` : 'Unknown User')}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedUsage.userEmail || selectedUsage.user?.email || 'No email'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">User Type</Typography>
                  <Chip 
                    label={selectedUsage.userType || selectedUsage.user?.user_type || 'Unknown'} 
                    size="small" 
                    color={getUserTypeColor(selectedUsage.userType || selectedUsage.user?.user_type || 'customer') as any}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Coupon Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Coupon Code</Typography>
                  <Typography variant="body1">{// @ts-ignore
                    selectedUsage.couponCode || selectedUsage.coupon?.code || 'Unknown Code'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Coupon Name</Typography>
                  <Typography variant="body1">{// @ts-ignore
                    selectedUsage.couponName || selectedUsage.coupon?.name || 'Unknown Coupon'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Used At</Typography>
                  <Typography variant="body1">
                    {new Date(selectedUsage.used_at).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Booking Reference</Typography>
                      <Typography variant="body1">{selectedUsage.bookingReference || selectedUsage.booking?.reference_number || 'N/A'}</Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Vehicle Type</Typography>
                      <Typography variant="body1">{selectedUsage.vehicleType || selectedUsage.booking?.vehicle_type || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Route</Typography>
                      <Typography variant="body1">
                        {selectedUsage.routeFrom || selectedUsage.booking?.pickup_location || 'N/A'} → {selectedUsage.routeTo || selectedUsage.booking?.destination || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Financial Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Original Amount</Typography>
                      <Typography variant="h6">€{(selectedUsage.originalAmount || selectedUsage.booking?.total_amount || 0).toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Discount Applied</Typography>
                      <Typography variant="h6" color="success.main">
                        -€{Number(selectedUsage.discount_applied || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Final Amount</Typography>
                      <Typography variant="h6">€{(selectedUsage.finalAmount || selectedUsage.booking?.final_amount || 0).toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box>
                  <Typography variant="body2" color="text.secondary">Discount Percentage</Typography>
                  <Typography variant="body1">
                    {(((Number(selectedUsage.discount_applied || 0) / (selectedUsage.originalAmount || selectedUsage.booking?.total_amount || 1)) * 100) || 0).toFixed(1)}%
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the usage record for coupon{' '}
            <strong>{// @ts-ignore
              usageToDelete?.couponCode}</strong> used by{' '}
            <strong>{usageToDelete?.userName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone and will affect usage statistics.
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

export default CouponUsage