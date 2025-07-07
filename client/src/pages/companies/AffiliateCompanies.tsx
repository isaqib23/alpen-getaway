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
  Alert,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  ContentCopy as CopyIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material'

import { Company, CompanyType } from '../../types/api'
import { useCompanies } from '../../hooks/useCompanies'


const AffiliateCompanies = () => {
  const {
    companies,
    loading,
    pagination,
    fetchCompanies,
    deleteCompany,
  } = useCompanies()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)

  // Fetch affiliate companies when filters change
  useEffect(() => {
    const filters = {
      page: page + 1, // Backend uses 1-based pagination
      limit: rowsPerPage,
      type: CompanyType.AFFILIATE, // Only fetch affiliate companies
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
    }
    fetchCompanies(filters)
  }, [page, rowsPerPage, searchTerm, statusFilter, fetchCompanies])

  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleAddCompany = () => {
    setOpenAddDialog(true)
  }

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company)
    setOpenEditDialog(true)
  }

  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company)
    setOpenDeleteDialog(true)
  }

  const confirmDeleteCompany = async () => {
    if (selectedCompany) {
      const success = await deleteCompany(selectedCompany.id)
      if (success) {
        setOpenDeleteDialog(false)
        setSelectedCompany(null)
      }
    }
  }

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company)
    setOpenViewDialog(true)
  }

  const handleCopyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value)
  }

  const handleApprovalChange = (event: any) => {
    setApprovalFilter(event.target.value)
  }

  const handlePaymentMethodChange = (event: any) => {
    setPaymentMethodFilter(event.target.value)
  }

  const handleRefresh = () => {
    const filters = {
      page: page + 1,
      limit: rowsPerPage,
      type: CompanyType.AFFILIATE,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
    }
    fetchCompanies(filters)
  }


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'suspended':
        return 'error'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  // Filter companies to show only affiliate companies (filtering is now done by API)
  const affiliateCompanies = companies.filter(company => company.company_type === CompanyType.AFFILIATE)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Affiliate Companies
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
            onClick={handleAddCompany}
          >
            Add Affiliate
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <BusinessIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Affiliates</Typography>
                  <Typography variant="h4" color="primary">
                    {affiliateCompanies.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ShareIcon color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Referrals</Typography>
                  <Typography variant="h4" color="success">
                    {affiliateCompanies.reduce((sum, c) => sum + (c.bookings?.length || 0), 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MoneyIcon color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Earnings</Typography>
                  <Typography variant="h4" color="secondary">
                    €{affiliateCompanies.reduce((sum, c) => sum + (c.commission_rate || 0) * 100, 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUpIcon color="info" fontSize="large" />
                <Box>
                  <Typography variant="h6">Pending Payouts</Typography>
                  <Typography variant="h4" color="info">
                    €{affiliateCompanies.reduce((sum, c) => sum + (c.commission_rate || 0) * 50, 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search affiliates..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Approval</InputLabel>
                <Select
                  value={approvalFilter}
                  onChange={handleApprovalChange}
                  label="Approval"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Payment</InputLabel>
                <Select
                  value={paymentMethodFilter}
                  onChange={handlePaymentMethodChange}
                  label="Payment"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="stripe">Stripe</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {pagination.total} affiliate(s) found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Referral Code</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Referrals</TableCell>
              <TableCell>Earnings</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Last Payout</TableCell>
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
            ) : affiliateCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No affiliate companies found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              affiliateCompanies.map((company) => (
                  <TableRow key={company.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {company.company_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {company.contact_person || company.company_representative}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {company.company_registration_number}
                        </Typography>
                        <Tooltip title="Copy registration number">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyReferralCode(company.company_registration_number)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {company.commission_rate ? `${company.commission_rate}%` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Chip
                          label={company.status}
                          color={getStatusColor(company.status) as any}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {company.bookings?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {company.bookings?.length || 0} total
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          €{((company.commission_rate || 0) * 100).toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          €{((company.commission_rate || 0) * 50).toFixed(2)} pending
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Bank Transfer
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(company.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Analytics">
                        <IconButton size="small" color="info">
                          <AnalyticsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Process Payout">
                        <IconButton size="small" color="success">
                          <PaymentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewCompany(company)}
                          color="info"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCompany(company)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCompany(company)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
          rowsPerPage={rowsPerPage}
          page={page}
            // @ts-ignore
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog implementations */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Affiliate Company</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Add affiliate company form will be implemented here
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Affiliate</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Affiliate Company</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Edit affiliate company form will be implemented here
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained">Update Affiliate</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Affiliate Company</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete affiliate company "{selectedCompany?.company_name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={confirmDeleteCompany}
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Affiliate Company Details</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Detailed affiliate company view will be implemented here
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AffiliateCompanies