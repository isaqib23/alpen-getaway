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
  CircularProgress,
  Card,
  CardContent,
  Alert
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckIcon,
  Payment as PaymentIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material'

import { useCommissions } from '../../hooks/useFinancial'
import { 
  Commission, 
  CommissionStatus 
} from '../../api/financial'

const Commissions = () => {
  const {
    commissions,
    stats,
    loading,
    pagination,
    fetchCommissions,
    fetchCommissionStats,
    approveCommission,
    payCommission
  } = useCommissions()

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | ''>('')
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openPayDialog, setOpenPayDialog] = useState(false)

  // Load data on mount
  useEffect(() => {
    handleRefresh()
    fetchCommissionStats()
  }, [])

  const handleRefresh = () => {
    fetchCommissions(pagination.page, pagination.limit, statusFilter || undefined)
  }

  const handleSearch = () => {
    handleRefresh()
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    fetchCommissions(newPage + 1, pagination.limit, statusFilter || undefined)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    fetchCommissions(1, newLimit, statusFilter || undefined)
  }

  const handleViewCommission = (commission: Commission) => {
    setSelectedCommission(commission)
    setOpenViewDialog(true)
  }

  const handleApproveCommission = (commission: Commission) => {
    setSelectedCommission(commission)
    setOpenApproveDialog(true)
  }

  const handlePayCommission = (commission: Commission) => {
    setSelectedCommission(commission)
    setOpenPayDialog(true)
  }

  const handleConfirmApprove = async () => {
    if (selectedCommission) {
      const success = await approveCommission(selectedCommission.id)
      if (success) {
        setOpenApproveDialog(false)
        setSelectedCommission(null)
        fetchCommissionStats()
      }
    }
  }

  const handleConfirmPay = async () => {
    if (selectedCommission) {
      const success = await payCommission(selectedCommission.id)
      if (success) {
        setOpenPayDialog(false)
        setSelectedCommission(null)
        fetchCommissionStats()
      }
    }
  }

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PAID:
        return 'success'
      case CommissionStatus.APPROVED:
        return 'info'
      case CommissionStatus.PENDING:
        return 'warning'
      case CommissionStatus.REJECTED:
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PAID:
        return <PaymentIcon fontSize="small" />
      case CommissionStatus.APPROVED:
        return <CheckIcon fontSize="small" />
      case CommissionStatus.PENDING:
        return <PendingIcon fontSize="small" />
      case CommissionStatus.REJECTED:
        return <ErrorIcon fontSize="small" />
      default:
        return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatCommissionStatus = (status: CommissionStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatPercentage = (rate: number) => {
    return `${rate}%`
  }

  // Filter commissions by search term
  const filteredCommissions = commissions.filter(commission => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      commission.id.toLowerCase().includes(searchLower) ||
      commission.booking_reference?.toLowerCase().includes(searchLower) ||
      commission.company_name?.toLowerCase().includes(searchLower)
    )
  })

  const commissionStatusOptions = Object.values(CommissionStatus).map(status => ({
    value: status,
    label: formatCommissionStatus(status)
  }))

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Commission Management
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
        </Box>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Commissions
                    </Typography>
                    <Typography variant="h5">
                      {stats.totalCommissions}
                    </Typography>
                  </Box>
                  <ReceiptIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Amount
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(stats.totalAmount)}
                    </Typography>
                  </Box>
                  <MoneyIcon color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Pending Approval
                    </Typography>
                    <Typography variant="h5">
                      {stats.byStatus[CommissionStatus.PENDING]?.count || 0}
                    </Typography>
                  </Box>
                  <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Paid Commissions
                    </Typography>
                    <Typography variant="h5">
                      {stats.byStatus[CommissionStatus.PAID]?.count || 0}
                    </Typography>
                  </Box>
                  <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search commissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as CommissionStatus | '')}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {commissionStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary" textAlign="right">
                {filteredCommissions.length} commission(s) found
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Commission Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Commission ID</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Booking</TableCell>
              <TableCell>Booking Amount</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Commission Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
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
            ) : filteredCommissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Alert severity="info">
                    No commissions found. Try adjusting your search criteria.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              filteredCommissions.map((commission) => (
                <TableRow key={commission.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {commission.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {commission.company_name || 'Unknown Company'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {commission.booking_reference || commission.booking_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatCurrency(commission.booking_amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPercentage(commission.commission_rate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(commission.commission_amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(commission.status)}
                      label={formatCommissionStatus(commission.status)}
                      color={getStatusColor(commission.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(commission.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(commission.created_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewCommission(commission)}
                        color="info"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {commission.status === CommissionStatus.PENDING && (
                      <Tooltip title="Approve Commission">
                        <IconButton
                          size="small"
                          onClick={() => handleApproveCommission(commission)}
                          color="success"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {commission.status === CommissionStatus.APPROVED && (
                      <Tooltip title="Pay Commission">
                        <IconButton
                          size="small"
                          onClick={() => handlePayCommission(commission)}
                          color="primary"
                        >
                          <PaymentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Commission Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <BusinessIcon />
            <Typography variant="h6">
              Commission Details: {selectedCommission?.id}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCommission && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Commission Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Commission ID</Typography>
                        <Typography variant="body1">{selectedCommission.id}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Company</Typography>
                        <Typography variant="body1">{selectedCommission.company_name || 'Unknown'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Booking Reference</Typography>
                        <Typography variant="body1">{selectedCommission.booking_reference || selectedCommission.booking_id}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Booking Amount</Typography>
                        <Typography variant="h6">
                          {formatCurrency(selectedCommission.booking_amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Commission Rate</Typography>
                        <Typography variant="h6" color="primary">
                          {formatPercentage(selectedCommission.commission_rate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Commission Amount</Typography>
                        <Typography variant="h5" color="success.main">
                          {formatCurrency(selectedCommission.commission_amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Status</Typography>
                        <Chip
                          icon={getStatusIcon(selectedCommission.status)}
                          label={formatCommissionStatus(selectedCommission.status)}
                          color={getStatusColor(selectedCommission.status) as any}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Timeline
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Created</Typography>
                        <Typography variant="body1">
                          {new Date(selectedCommission.created_at).toLocaleString()}
                        </Typography>
                      </Grid>
                      {selectedCommission.approved_at && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Approved At</Typography>
                          <Typography variant="body1">
                            {new Date(selectedCommission.approved_at).toLocaleString()}
                          </Typography>
                        </Grid>
                      )}
                      {selectedCommission.paid_at && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Paid At</Typography>
                          <Typography variant="body1">
                            {new Date(selectedCommission.paid_at).toLocaleString()}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Commission Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Approve Commission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve commission "{selectedCommission?.id}" for{' '}
            {selectedCommission && formatCurrency(selectedCommission.commission_amount)}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleConfirmApprove}>
            Approve Commission
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pay Commission Dialog */}
      <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)}>
        <DialogTitle>Pay Commission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark commission "{selectedCommission?.id}" as paid for{' '}
            {selectedCommission && formatCurrency(selectedCommission.commission_amount)}?
            This will indicate that the payment has been processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmPay}>
            Mark as Paid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Commissions