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
  Payment as PaymentIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  AccountBalanceWallet as WalletIcon,
  Money as CashIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'

import { usePayments } from '../../hooks/useFinancial'
import { 
  Payment, 
  PaymentStatus, 
  PaymentMethod, 
  PaymentFilters 
} from '../../api/financial'

const Payments = () => {
  const {
    payments,
    stats,
    loading,
    pagination,
    fetchPayments,
    fetchPaymentStats,
    markAsPaid,
    markAsFailed,
    refundPayment
  } = usePayments()

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('')
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openMarkPaidDialog, setOpenMarkPaidDialog] = useState(false)
  const [openMarkFailedDialog, setOpenMarkFailedDialog] = useState(false)
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const [failureReason, setFailureReason] = useState('')

  // Load data on mount
  useEffect(() => {
    handleRefresh()
    fetchPaymentStats()
  }, [])

  const handleRefresh = () => {
    const filters: PaymentFilters = {
      ...(statusFilter && { payment_status: statusFilter }),
      ...(methodFilter && { payment_method: methodFilter }),
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo })
    }
    
    fetchPayments(pagination.page, pagination.limit, filters)
  }

  const handleSearch = () => {
    handleRefresh()
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    const filters: PaymentFilters = {
      ...(statusFilter && { payment_status: statusFilter }),
      ...(methodFilter && { payment_method: methodFilter }),
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo })
    }
    
    fetchPayments(newPage + 1, pagination.limit, filters)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    const filters: PaymentFilters = {
      ...(statusFilter && { payment_status: statusFilter }),
      ...(methodFilter && { payment_method: methodFilter }),
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo })
    }
    
    fetchPayments(1, newLimit, filters)
  }

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setOpenViewDialog(true)
  }

  const handleMarkPaid = (payment: Payment) => {
    setSelectedPayment(payment)
    setOpenMarkPaidDialog(true)
  }

  const handleMarkFailed = (payment: Payment) => {
    setSelectedPayment(payment)
    setOpenMarkFailedDialog(true)
  }

  const handleRefundPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setOpenRefundDialog(true)
  }

  const handleConfirmMarkPaid = async () => {
    if (selectedPayment) {
      const success = await markAsPaid(selectedPayment.id)
      if (success) {
        setOpenMarkPaidDialog(false)
        setSelectedPayment(null)
        fetchPaymentStats()
      }
    }
  }

  const handleConfirmMarkFailed = async () => {
    if (selectedPayment && failureReason.trim()) {
      const success = await markAsFailed(selectedPayment.id, failureReason)
      if (success) {
        setOpenMarkFailedDialog(false)
        setSelectedPayment(null)
        setFailureReason('')
        fetchPaymentStats()
      }
    }
  }

  const handleConfirmRefund = async () => {
    if (selectedPayment) {
      const success = await refundPayment(selectedPayment.id)
      if (success) {
        setOpenRefundDialog(false)
        setSelectedPayment(null)
        fetchPaymentStats()
      }
    }
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'success'
      case PaymentStatus.PENDING:
        return 'warning'
      case PaymentStatus.FAILED:
        return 'error'
      case PaymentStatus.REFUNDED:
        return 'info'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <CheckIcon fontSize="small" />
      case PaymentStatus.PENDING:
        return <PendingIcon fontSize="small" />
      case PaymentStatus.FAILED:
        return <ErrorIcon fontSize="small" />
      case PaymentStatus.REFUNDED:
        return <CancelIcon fontSize="small" />
      default:
        return null
    }
  }

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return <CardIcon fontSize="small" />
      case PaymentMethod.BANK_TRANSFER:
        return <BankIcon fontSize="small" />
      case PaymentMethod.WALLET:
        return <WalletIcon fontSize="small" />
      case PaymentMethod.CASH:
        return <CashIcon fontSize="small" />
      default:
        return <PaymentIcon fontSize="small" />
    }
  }

  const getMethodColor = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return 'primary'
      case PaymentMethod.DEBIT_CARD:
        return 'secondary'
      case PaymentMethod.BANK_TRANSFER:
        return 'info'
      case PaymentMethod.WALLET:
        return 'warning'
      case PaymentMethod.CASH:
        return 'success'
      default:
        return 'default'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatPaymentMethod = (method: PaymentMethod) => {
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatPaymentStatus = (status: PaymentStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Filter payments by search term
  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      payment.id.toLowerCase().includes(searchLower) ||
      payment.booking_reference?.toLowerCase().includes(searchLower) ||
      payment.payer_name?.toLowerCase().includes(searchLower) ||
      payment.company_name?.toLowerCase().includes(searchLower)
    )
  })

  const paymentStatusOptions = Object.values(PaymentStatus).map(status => ({
    value: status,
    label: formatPaymentStatus(status)
  }))

  const paymentMethodOptions = Object.values(PaymentMethod).map(method => ({
    value: method,
    label: formatPaymentMethod(method)
  }))

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Payment Management
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
                      Total Payments
                    </Typography>
                    <Typography variant="h5">
                      {stats.totalPayments}
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
                      Successful Payments
                    </Typography>
                    <Typography variant="h5">
                      {stats.byStatus[PaymentStatus.PAID]?.count || 0}
                    </Typography>
                  </Box>
                  <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
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
                      Failed Payments
                    </Typography>
                    <Typography variant="h5">
                      {stats.byStatus[PaymentStatus.FAILED]?.count || 0}
                    </Typography>
                  </Box>
                  <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search payments..."
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
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {paymentStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | '')}
                  label="Method"
                >
                  <MenuItem value="">All</MenuItem>
                  {paymentMethodOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Date From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Date To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              {filteredPayments.length} payment(s) found
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Payment Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Booking</TableCell>
              <TableCell>Payer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Alert severity="info">
                    No payments found. Try adjusting your search criteria.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {payment.id}
                      </Typography>
                      {payment.booking_reference && (
                        <Typography variant="caption" color="textSecondary">
                          {payment.booking_reference}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.booking_reference || payment.booking_id}
                    </Typography>
                    {payment.company_name && (
                      <Typography variant="caption" color="textSecondary">
                        via {payment.company_name}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.payer_name || 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(payment.amount, payment.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getMethodIcon(payment.payment_method)}
                      label={formatPaymentMethod(payment.payment_method)}
                      color={getMethodColor(payment.payment_method) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      {...(getStatusIcon(payment.payment_status) && { icon: getStatusIcon(payment.payment_status) })}
                      label={formatPaymentStatus(payment.payment_status)}
                      color={getStatusColor(payment.payment_status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(payment.created_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPayment(payment)}
                        color="info"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {payment.payment_status === PaymentStatus.PENDING && (
                      <>
                        <Tooltip title="Mark as Paid">
                          <IconButton
                            size="small"
                            onClick={() => handleMarkPaid(payment)}
                            color="success"
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as Failed">
                          <IconButton
                            size="small"
                            onClick={() => handleMarkFailed(payment)}
                            color="error"
                          >
                            <ErrorIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {payment.payment_status === PaymentStatus.PAID && (
                      <Tooltip title="Refund">
                        <IconButton
                          size="small"
                          onClick={() => handleRefundPayment(payment)}
                          color="warning"
                        >
                          <CancelIcon fontSize="small" />
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

      {/* View Payment Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <PaymentIcon />
            <Typography variant="h6">
              Payment Details: {selectedPayment?.id}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Payment Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Payment ID</Typography>
                        <Typography variant="body1">{selectedPayment.id}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Booking Reference</Typography>
                        <Typography variant="body1">{selectedPayment.booking_reference || selectedPayment.booking_id}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Amount</Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Payment Method</Typography>
                        <Chip
                          icon={getMethodIcon(selectedPayment.payment_method)}
                          label={formatPaymentMethod(selectedPayment.payment_method)}
                          color={getMethodColor(selectedPayment.payment_method) as any}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Status</Typography>
                        <Chip
                          icon={getStatusIcon(selectedPayment.payment_status)}
                          label={formatPaymentStatus(selectedPayment.payment_status)}
                          color={getStatusColor(selectedPayment.payment_status) as any}
                          size="small"
                        />
                      </Grid>
                      {selectedPayment.failure_reason && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Failure Reason</Typography>
                          <Typography variant="body1" color="error">
                            {selectedPayment.failure_reason}
                          </Typography>
                        </Grid>
                      )}
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
                          {new Date(selectedPayment.created_at).toLocaleString()}
                        </Typography>
                      </Grid>
                      {selectedPayment.paid_at && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Paid At</Typography>
                          <Typography variant="body1">
                            {new Date(selectedPayment.paid_at).toLocaleString()}
                          </Typography>
                        </Grid>
                      )}
                      {selectedPayment.failed_at && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Failed At</Typography>
                          <Typography variant="body1">
                            {new Date(selectedPayment.failed_at).toLocaleString()}
                          </Typography>
                        </Grid>
                      )}
                      {selectedPayment.refunded_at && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Refunded At</Typography>
                          <Typography variant="body1">
                            {new Date(selectedPayment.refunded_at).toLocaleString()}
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

      {/* Mark as Paid Dialog */}
      <Dialog open={openMarkPaidDialog} onClose={() => setOpenMarkPaidDialog(false)}>
        <DialogTitle>Mark Payment as Paid</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark payment "{selectedPayment?.id}" as paid?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMarkPaidDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleConfirmMarkPaid}>
            Mark as Paid
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mark as Failed Dialog */}
      <Dialog open={openMarkFailedDialog} onClose={() => setOpenMarkFailedDialog(false)}>
        <DialogTitle>Mark Payment as Failed</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Mark payment "{selectedPayment?.id}" as failed and provide a reason:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Failure Reason"
            value={failureReason}
            onChange={(e) => setFailureReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMarkFailedDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmMarkFailed}
            disabled={!failureReason.trim()}
          >
            Mark as Failed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)}>
        <DialogTitle>Refund Payment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to refund payment "{selectedPayment?.id}" for{' '}
            {selectedPayment && formatCurrency(selectedPayment.amount, selectedPayment.currency)}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRefundDialog(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleConfirmRefund}>
            Refund Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Payments