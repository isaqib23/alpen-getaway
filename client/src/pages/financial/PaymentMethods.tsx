import { useState, useEffect } from 'react'
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
  Alert,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  AccountBalanceWallet as WalletIcon,
  Money as CashIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Save as SaveIcon
} from '@mui/icons-material'

import { usePaymentMethods } from '../../hooks/useFinancial'
import { 
  PaymentMethodConfig, 
  PaymentMethod,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto
} from '../../api/financial'

const PaymentMethods = () => {
  const {
    paymentMethods,
    loading,
    fetchPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  } = usePaymentMethods()

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodConfig | null>(null)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openConfigDialog, setOpenConfigDialog] = useState(false)

  // Form state
  const [formData, setFormData] = useState<CreatePaymentMethodDto>({
    name: '',
    type: PaymentMethod.CREDIT_CARD,
    is_active: true,
    config: {}
  })

  // Load data on mount
  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const handleRefresh = () => {
    fetchPaymentMethods()
  }

  const handleCreateMethod = () => {
    setFormData({
      name: '',
      type: PaymentMethod.CREDIT_CARD,
      is_active: true,
      config: {}
    })
    setOpenCreateDialog(true)
  }

  const handleEditMethod = (method: PaymentMethodConfig) => {
    setSelectedMethod(method)
    setFormData({
      name: method.name,
      type: method.type,
      is_active: method.is_active,
      config: method.config || {}
    })
    setOpenEditDialog(true)
  }

  const handleDeleteMethod = (method: PaymentMethodConfig) => {
    setSelectedMethod(method)
    setOpenDeleteDialog(true)
  }

  const handleConfigMethod = (method: PaymentMethodConfig) => {
    setSelectedMethod(method)
    setOpenConfigDialog(true)
  }

  const handleCreateSubmit = async () => {
    const success = await createPaymentMethod(formData)
    if (success) {
      setOpenCreateDialog(false)
      setFormData({
        name: '',
        type: PaymentMethod.CREDIT_CARD,
        is_active: true,
        config: {}
      })
    }
  }

  const handleEditSubmit = async () => {
    if (selectedMethod) {
      const updateData: UpdatePaymentMethodDto = {
        name: formData.name,
        type: formData.type,
        is_active: formData.is_active,
        config: formData.config
      }
      
      const success = await updatePaymentMethod(selectedMethod.id, updateData)
      if (success) {
        setOpenEditDialog(false)
        setSelectedMethod(null)
      }
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedMethod) {
      const success = await deletePaymentMethod(selectedMethod.id)
      if (success) {
        setOpenDeleteDialog(false)
        setSelectedMethod(null)
      }
    }
  }

  const handleToggleActive = async (method: PaymentMethodConfig) => {
    const success = await updatePaymentMethod(method.id, {
      is_active: !method.is_active
    })
    if (success) {
      // The method will be updated via the hook
    }
  }

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return <CreditCardIcon fontSize="small" />
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

  const formatPaymentMethod = (method: PaymentMethod) => {
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  // Filter payment methods by search term
  const filteredMethods = paymentMethods.filter(method => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      method.name.toLowerCase().includes(searchLower) ||
      method.type.toLowerCase().includes(searchLower)
    )
  })

  const paymentMethodOptions = Object.values(PaymentMethod).map(method => ({
    value: method,
    label: formatPaymentMethod(method)
  }))

  const activeMethodsCount = paymentMethods.filter(m => m.is_active).length
  const totalMethodsCount = paymentMethods.length

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Payment Methods Configuration
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateMethod}
          >
            Add Payment Method
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Methods
                  </Typography>
                  <Typography variant="h5">
                    {totalMethodsCount}
                  </Typography>
                </Box>
                <PaymentIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Methods
                  </Typography>
                  <Typography variant="h5">
                    {activeMethodsCount}
                  </Typography>
                </Box>
                <CheckIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Inactive Methods
                  </Typography>
                  <Typography variant="h5">
                    {totalMethodsCount - activeMethodsCount}
                  </Typography>
                </Box>
                <CancelIcon color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search payment methods..."
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
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" textAlign="right">
                {filteredMethods.length} method(s) found
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Payment Methods Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Configuration</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Alert severity="info">
                    No payment methods found. Try adjusting your search criteria or add a new method.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              filteredMethods.map((method) => (
                <TableRow key={method.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {method.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getMethodIcon(method.type)}
                      label={formatPaymentMethod(method.type)}
                      color={getMethodColor(method.type) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={method.is_active}
                          onChange={() => handleToggleActive(method)}
                          size="small"
                        />
                      }
                      label={method.is_active ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">
                        {Object.keys(method.config || {}).length} setting(s)
                      </Typography>
                      <Tooltip title="View Configuration">
                        <IconButton
                          size="small"
                          onClick={() => handleConfigMethod(method)}
                          color="info"
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(method.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(method.created_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Method">
                      <IconButton
                        size="small"
                        onClick={() => handleEditMethod(method)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Method">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteMethod(method)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Payment Method Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Payment Method</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Method Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Stripe Credit Card"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethod })}
                    label="Payment Type"
                  >
                    {paymentMethodOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getMethodIcon(option.value)}
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateSubmit}
            disabled={!formData.name.trim()}
            startIcon={<SaveIcon />}
          >
            Create Method
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Payment Method Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Payment Method</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Method Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethod })}
                    label="Payment Type"
                  >
                    {paymentMethodOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getMethodIcon(option.value)}
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditSubmit}
            disabled={!formData.name.trim()}
            startIcon={<SaveIcon />}
          >
            Update Method
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Payment Method Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Payment Method</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the payment method "{selectedMethod?.name}"?
            This action cannot be undone and may affect existing payment configurations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete Method
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={openConfigDialog} onClose={() => setOpenConfigDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Payment Method Configuration: {selectedMethod?.name}
        </DialogTitle>
        <DialogContent>
          {selectedMethod && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Basic Information
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Name</Typography>
                        <Typography variant="body1">{selectedMethod.name}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Type</Typography>
                        <Chip
                          icon={getMethodIcon(selectedMethod.type)}
                          label={formatPaymentMethod(selectedMethod.type)}
                          color={getMethodColor(selectedMethod.type) as any}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Status</Typography>
                        <Chip
                          icon={selectedMethod.is_active ? <CheckIcon /> : <CancelIcon />}
                          label={selectedMethod.is_active ? 'Active' : 'Inactive'}
                          color={selectedMethod.is_active ? 'success' : 'error'}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Configuration Settings
                    </Typography>
                    {selectedMethod.config && Object.keys(selectedMethod.config).length > 0 ? (
                      <Grid container spacing={1}>
                        {Object.entries(selectedMethod.config).map(([key, value]) => (
                          <Grid item xs={12} key={key}>
                            <Typography variant="body2" color="textSecondary">{key}</Typography>
                            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Alert severity="info">
                        No configuration settings found for this payment method.
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfigDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PaymentMethods