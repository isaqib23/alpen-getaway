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
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'

import { Company, CompanyType, CompanyStatus, CreateCompanyRequest, UpdateCompanyRequest } from '../../types/api'
import { useCompanies } from '../../hooks/useCompanies'
import { useUsers } from '../../hooks/useUsers'

const AllCompanies = () => {
  const {
    companies,
    stats,
    loading,
    pagination,
    fetchCompanies,
    deleteCompany,
  } = useCompanies()
  
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)

  // Update filters and fetch data when they change
  useEffect(() => {
    const filters = {
      page: page + 1, // Backend uses 1-based pagination
      limit: rowsPerPage,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(typeFilter && { type: typeFilter })
    }
    fetchCompanies(filters)
  }, [page, rowsPerPage, searchTerm, statusFilter, typeFilter, fetchCompanies])

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0) // Reset to first page when searching
  }

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value)
    setPage(0) // Reset to first page when filtering
  }

  const handleTypeChange = (event: any) => {
    setTypeFilter(event.target.value)
    setPage(0) // Reset to first page when filtering
  }

  const handleRefresh = () => {
    const filters = {
      page: page + 1,
      limit: rowsPerPage,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(typeFilter && { type: typeFilter })
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
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'affiliate':
        return 'secondary'
      case 'b2b':
        return 'info'
      default:
        return 'default'
    }
  }


  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'b2b':
        return 'B2B Partner'
      case 'affiliate':
        return 'Affiliate'
      default:
        return type
    }
  }

  const getApprovalColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  // Companies are now fetched from API via useCompanies hook
  // No filtering needed here as it's handled by the backend

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          All Companies
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
            Add Company
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
                  <Typography variant="h6">Total Companies</Typography>
                  <Typography variant="h4" color="primary">
                    {stats?.total || companies.length}
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
                <CheckCircleIcon color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Active</Typography>
                  <Typography variant="h4" color="success">
                    {stats?.active || 0}
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
                <PeopleIcon color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4" color="secondary">
                    {companies.reduce((sum, c) => sum + (c.user ? 1 : 0), 0)}
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
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4" color="info">
                    €{companies.reduce((sum, c) => sum + (c.commissions?.length || 0), 0).toFixed(2)}
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
                placeholder="Search companies..."
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
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={handleTypeChange}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="affiliate">Affiliate</MenuItem>
                  <MenuItem value="b2b">B2B Partner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {pagination.total} company(s) found
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
              <TableCell>Type</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approval</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>Last Updated</TableCell>
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
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No companies found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
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
                            {company.company_email}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" display="block">
                            {company.city}, {company.country}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(company.company_type)}
                        color={getTypeColor(company.company_type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {company.company_representative}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {company.contact_person}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={company.status}
                        color={getStatusColor(company.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={company.status}
                        color={getStatusColor(company.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {company.user ? 1 : 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {company.commission_rate ? `${company.commission_rate}%` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(company.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
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

      {/* Add Company Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Company</DialogTitle>
        <DialogContent>
          <AddCompanyForm onClose={() => setOpenAddDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          {selectedCompany && (
            <EditCompanyForm 
              company={selectedCompany} 
              onClose={() => setOpenEditDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Company Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Are you sure you want to delete company "{selectedCompany?.company_name}"?
              This action cannot be undone and will remove all associated data.
            </Typography>
          </Alert>
          {selectedCompany && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Company Details:</strong>
              </Typography>
              <Typography variant="body2">• {selectedCompany.user ? '1 user' : '0 users'}</Typography>
              <Typography variant="body2">• {selectedCompany.bookings?.length || 0} bookings</Typography>
              <Typography variant="body2">• {selectedCompany.commission_rate || 0}% commission rate</Typography>
            </Box>
          )}
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

      {/* View Company Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedCompany?.company_name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedCompany && getTypeLabel(selectedCompany.company_type)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCompany && (
            <Box sx={{ mt: 2 }}>
              {/* Status Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <CheckCircleIcon color="success" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Status
                          </Typography>
                          <Chip
                            label={selectedCompany.status}
                            color={getStatusColor(selectedCompany.status) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <PendingIcon color="warning" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Approval
                          </Typography>
                          <Chip
                            label={selectedCompany.status}
                            color={getApprovalColor(selectedCompany.status) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <PeopleIcon color="info" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Total Users
                          </Typography>
                          <Typography variant="h6" color="info.main">
                            {selectedCompany.user ? 1 : 0}
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
                        <TrendingUpIcon color="success" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Revenue
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            €{(selectedCompany.commissions?.length || 0) * 100}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Company Information */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon />
                    Company Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Registration Number:</strong> {selectedCompany.company_registration_number}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Tax ID:</strong> {selectedCompany.tax_id || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Total Bookings:</strong> {selectedCompany.bookings?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Commission Rate:</strong> {selectedCompany.commission_rate || 0}%
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Registration Country:</strong> {selectedCompany.registration_country}
                    </Typography>
                    {selectedCompany.website && (
                      <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon fontSize="small" />
                        <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
                          {selectedCompany.website}
                        </a>
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon />
                    Address
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedCompany.address || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedCompany.city}, {selectedCompany.state} {selectedCompany.postal_code}
                    </Typography>
                    <Typography variant="body2">
                      {selectedCompany.country}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon />
                    Contact Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Contact Person:</strong> {selectedCompany.contact_person || selectedCompany.company_representative}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      {selectedCompany.company_email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" />
                      {selectedCompany.company_contact_number}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon />
                    Performance
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Total Users:</strong> {selectedCompany.user ? 1 : 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Total Bookings:</strong> {selectedCompany.bookings?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Commission Rate:</strong> {selectedCompany.commission_rate || 0}%
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Last Updated:</strong> {new Date(selectedCompany.updated_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>

                {selectedCompany.service_area_province && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon />
                      Service Area
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Province:</strong> {selectedCompany.service_area_province}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Timestamps
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Created:</strong> {new Date(selectedCompany.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Updated:</strong> {new Date(selectedCompany.updated_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenViewDialog(false)
              handleEditCompany(selectedCompany!)
            }}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Add Company Form Component
const AddCompanyForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { createCompany } = useCompanies()
  const { users, fetchUsers } = useUsers()
  const [loading, setLoading] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [formData, setFormData] = useState<CreateCompanyRequest>({
    user_id: '', // This should be populated from user selection or current user
    company_name: '',
    company_email: '',
    company_contact_number: '',
    company_type: CompanyType.AFFILIATE,
    company_registration_number: '',
    registration_country: '',
    company_representative: '',
    service_area_province: '',
    tax_id: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    website: '',
    contact_person: '',
    commission_rate: 0
  })

  // Filter users based on company type and exclude users who already have companies
  useEffect(() => {
    if (formData.company_type && users.length > 0) {
      const filtered = users.filter(user => {
        // Filter by user type
        const matchesType = formData.company_type === 'affiliate' ? user.user_type === 'affiliate' : user.user_type === 'b2b'
        // Exclude users who already have a company
        const hasNoCompany = !user.company
        return matchesType && hasNoCompany
      })
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers([])
    }
  }, [formData.company_type, users])

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSelectChange = (field: string) => (event: any) => {
    if (field === 'user_id') {
      // When user is selected, also update company_representative with the user's name
      const selectedUser = filteredUsers.find(user => user.id === event.target.value)
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
        company_representative: selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.user_id) {
      alert('Please select a user for this company')
      return
    }
    
    setLoading(true)
    const success = await createCompany(formData)
    setLoading(false)
    
    if (success) {
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Company Name"
            value={formData.company_name}
            onChange={handleChange('company_name')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Company Email"
            type="email"
            value={formData.company_email}
            onChange={handleChange('company_email')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Contact Number"
            value={formData.company_contact_number}
            onChange={handleChange('company_contact_number')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Company Type</InputLabel>
            <Select
              value={formData.company_type}
              onChange={handleSelectChange('company_type')}
              label="Company Type"
            >
              <MenuItem value="affiliate">Affiliate</MenuItem>
              <MenuItem value="b2b">B2B Partner</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Registration Number"
            value={formData.company_registration_number}
            onChange={handleChange('company_registration_number')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Registration Country"
            value={formData.registration_country}
            onChange={handleChange('registration_country')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Company Representative</InputLabel>
            <Select
              value={formData.user_id}
              onChange={handleSelectChange('user_id')}
              label="Company Representative"
            >
              <MenuItem value="">Select a user</MenuItem>
              {filteredUsers.length === 0 && formData.company_type ? (
                <MenuItem disabled>
                  No available {formData.company_type} users without companies
                </MenuItem>
              ) : (
                filteredUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} - {user.email}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Service Area Province"
            value={formData.service_area_province}
            onChange={handleChange('service_area_province')}
          />
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Address Information
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={handleChange('address')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={handleChange('city')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={handleChange('state')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Postal Code"
            value={formData.postal_code}
            onChange={handleChange('postal_code')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={handleChange('country')}
          />
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Additional Information
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Tax ID"
            value={formData.tax_id}
            onChange={handleChange('tax_id')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website"
            value={formData.website}
            onChange={handleChange('website')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Person"
            value={formData.contact_person}
            onChange={handleChange('contact_person')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Commission Rate (%)"
            type="number"
            value={formData.commission_rate}
            onChange={handleChange('commission_rate')}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Adding...' : 'Add Company'}
        </Button>
      </Box>
    </form>
  )
}

// Edit Company Form Component
const EditCompanyForm: React.FC<{ company: Company; onClose: () => void }> = ({ company, onClose }) => {
  const { updateCompany } = useCompanies()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateCompanyRequest>({
    company_name: company.company_name || '',
    company_email: company.company_email || '',
    company_contact_number: company.company_contact_number || '',
    company_type: company.company_type || CompanyType.AFFILIATE,
    company_registration_number: company.company_registration_number || '',
    registration_country: company.registration_country || '',
    company_representative: company.company_representative || '',
    service_area_province: company.service_area_province || '',
    tax_id: company.tax_id || '',
    address: company.address || '',
    city: company.city || '',
    state: company.state || '',
    postal_code: company.postal_code || '',
    country: company.country || '',
    website: company.website || '',
    contact_person: company.contact_person || '',
    commission_rate: company.commission_rate || 0,
    status: company.status || CompanyStatus.PENDING
  })

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const success = await updateCompany(company.id, formData)
    setLoading(false)
    
    if (success) {
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Company Name"
            value={formData.company_name}
            onChange={handleChange('company_name')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Company Email"
            type="email"
            value={formData.company_email}
            onChange={handleChange('company_email')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Contact Number"
            value={formData.company_contact_number}
            onChange={handleChange('company_contact_number')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Company Type</InputLabel>
            <Select
              value={formData.company_type}
              onChange={handleSelectChange('company_type')}
              label="Company Type"
            >
              <MenuItem value="affiliate">Affiliate</MenuItem>
              <MenuItem value="b2b">B2B Partner</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Registration Number"
            value={formData.company_registration_number}
            onChange={handleChange('company_registration_number')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Registration Country"
            value={formData.registration_country}
            onChange={handleChange('registration_country')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Company Representative"
            value={formData.company_representative}
            onChange={handleChange('company_representative')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Service Area Province"
            value={formData.service_area_province}
            onChange={handleChange('service_area_province')}
          />
        </Grid>

        {/* Status Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Status Information
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleSelectChange('status')}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Approval Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleSelectChange('status')}
              label="Approval Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Address Information
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={handleChange('address')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={handleChange('city')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={handleChange('state')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Postal Code"
            value={formData.postal_code}
            onChange={handleChange('postal_code')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={handleChange('country')}
          />
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Additional Information
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Tax ID"
            value={formData.tax_id}
            onChange={handleChange('tax_id')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website"
            value={formData.website}
            onChange={handleChange('website')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Person"
            value={formData.contact_person}
            onChange={handleChange('contact_person')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Commission Rate (%)"
            type="number"
            value={formData.commission_rate}
            onChange={handleChange('commission_rate')}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
          />
        </Grid>
        
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update Company'}
        </Button>
      </Box>
    </form>
  )
}

export default AllCompanies