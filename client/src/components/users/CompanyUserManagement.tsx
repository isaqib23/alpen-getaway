import React, { useState } from 'react'
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
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

import { useUsers, getUserStatusOptions } from '../../hooks/useUsers'
import { User, UserType, UserStatus, CreateUserRequest, UpdateUserRequest } from '../../api/users'

interface CompanyUserManagementProps {
  userType: UserType.B2B | UserType.AFFILIATE
  title: string
  description?: string
}

const CompanyUserManagement: React.FC<CompanyUserManagementProps> = ({ userType, title, description }) => {
  // Initialize users hook with specific user type filtering
  const {
    users,
    total,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setFilters,
  } = useUsers({ page: 1, limit: 10, userType })

  // Local state for UI
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  
  // Form state for Add User with Company
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_type: userType,
    password: '',
    company: {
      company_name: '',
      company_email: '',
      company_contact_number: '',
      company_type: userType === UserType.B2B ? 'b2b' : 'affiliate',
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
      commission_rate: userType === UserType.AFFILIATE ? 5 : undefined,
    }
  })
  
  // Form state for Edit User with Company
  const [editUser, setEditUser] = useState<UpdateUserRequest>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_type: userType,
    status: UserStatus.ACTIVE,
    email_verified: false,
    phone_verified: false,
    company: {
      company_name: '',
      company_email: '',
      company_contact_number: '',
      company_type: userType === UserType.B2B ? 'b2b' : 'affiliate',
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
      status: 'pending',
      commission_rate: userType === UserType.AFFILIATE ? 5 : undefined,
    }
  })

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
    setFilters({
      page: newPage + 1,
      limit: rowsPerPage,
      search: searchTerm || undefined,
      userType,
      status: statusFilter || undefined,
    })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)
    setFilters({
      page: 1,
      limit: newRowsPerPage,
      search: searchTerm || undefined,
      userType,
      status: statusFilter || undefined,
    })
  }

  const handleAddUser = () => {
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      user_type: userType,
      password: '',
      company: {
        company_name: '',
        company_email: '',
        company_contact_number: '',
        company_type: userType === UserType.B2B ? 'b2b' : 'affiliate',
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
        commission_rate: userType === UserType.AFFILIATE ? 5 : undefined,
      }
    })
    setOpenAddDialog(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditUser({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      user_type: user.user_type,
      status: user.status,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
      company: user.company ? {
        company_name: user.company.company_name,
        company_email: user.company.company_email,
        company_contact_number: user.company.company_contact_number,
        company_type: user.company.company_type,
        company_registration_number: user.company.company_registration_number,
        registration_country: user.company.registration_country,
        company_representative: user.company.company_representative,
        service_area_province: user.company.service_area_province || '',
        tax_id: user.company.tax_id || '',
        address: user.company.address || '',
        city: user.company.city || '',
        state: user.company.state || '',
        postal_code: user.company.postal_code || '',
        country: user.company.country || '',
        website: user.company.website || '',
        contact_person: user.company.contact_person || '',
        status: user.company.status,
        commission_rate: user.company.commission_rate || (userType === UserType.AFFILIATE ? 5 : undefined),
      } : {
        company_name: '',
        company_email: '',
        company_contact_number: '',
        company_type: userType === UserType.B2B ? 'b2b' : 'affiliate',
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
        status: 'pending',
        commission_rate: userType === UserType.AFFILIATE ? 5 : undefined,
      }
    })
    setOpenEditDialog(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setOpenDeleteDialog(true)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setOpenViewDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)
    setFilters({
      page: 1,
      limit: rowsPerPage,
      search: newSearchTerm,
      userType,
      status: statusFilter || undefined,
    })
  }

  const handleStatusChange = (event: any) => {
    const newStatus = event.target.value
    setStatusFilter(newStatus)
    setFilters({
      page: 1,
      limit: rowsPerPage,
      search: searchTerm || undefined,
      userType,
      status: newStatus || undefined,
    })
  }

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleSubmitAddUser = async () => {
    setFormLoading(true)
    try {
      // Prepare the data and ensure commission_rate is a number
      const userData = { ...newUser }
      if (userData.company && userData.company.commission_rate) {
        userData.company.commission_rate = Number(userData.company.commission_rate)
      }
      
      const result = await createUser(userData)
      if (result) {
        setOpenAddDialog(false)
        handleRefresh()
      }
    } catch (error) {
      console.error('Error adding user:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmitEditUser = async () => {
    if (!selectedUser) return
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (editUser.company?.company_email && !emailRegex.test(editUser.company.company_email)) {
      console.error('Invalid company email format')
      return
    }
    
    setFormLoading(true)
    try {
      // Prepare the data and ensure commission_rate is a number
      const updatedUser = { ...editUser }
      if (updatedUser.company && updatedUser.company.commission_rate) {
        updatedUser.company.commission_rate = Number(updatedUser.company.commission_rate)
      }
      
      const result = await updateUser(selectedUser.id, updatedUser)
      if (result) {
        setOpenEditDialog(false)
        setSelectedUser(null)
        handleRefresh()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    
    const success = await deleteUser(selectedUser.id)
    if (success) {
      setOpenDeleteDialog(false)
      setSelectedUser(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'suspended':
        return 'error'
      default:
        return 'default'
    }
  }

  const getCompanyStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      case 'suspended':
        return 'error'
      default:
        return 'default'
    }
  }

  const getCompanyStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircleIcon fontSize="small" />
      case 'pending':
        return <PendingIcon fontSize="small" />
      case 'rejected':
      case 'suspended':
        return <CancelIcon fontSize="small" />
      default:
        return undefined
    }
  }

  const userStatusOptions = getUserStatusOptions()
  const companyStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'suspended', label: 'Suspended' },
  ]

  const countryOptions = [
    'Austria', 'Germany', 'Switzerland', 'Italy', 'France', 'Netherlands', 'Belgium', 'Luxembourg'
  ]

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="textSecondary" mt={1}>
              {description} (Includes company management)
            </Typography>
          )}
        </Box>
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
            onClick={handleAddUser}
          >
            Add {title.slice(0, -1)}
          </Button>
        </Box>
      </Box>

      {/* Enhanced Filters */}
      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder={`Search ${title.toLowerCase()}...`}
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
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>User Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  label="User Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {userStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {total} {title.toLowerCase()} found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Enhanced Table with Company Information */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Details</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Company Status</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>User Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No {title.toLowerCase()} found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.company ? (
                      <Box>
                        <Typography variant="subtitle2">
                          {user.company.company_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {user.company.company_type?.toUpperCase()} • {user.company.registration_country}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No company
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.company ? (
                      <Chip
                        label={user.company.status}
                        color={getCompanyStatusColor(user.company.status) as any}
                        size="small"
                        icon={getCompanyStatusIcon(user.company.status)}
                      />
                    ) : (
                      <Chip label="N/A" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {user.company?.company_email || user.email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {user.company?.company_contact_number || user.phone || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewUser(user)}
                        color="info"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteUser(user)}
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
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add User & Company Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Add New {title.slice(0, -1)} & Company</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* User Information Section */}
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon />
                      <Typography variant="h6">User Information</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={newUser.first_name}
                          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={newUser.last_name}
                          onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          placeholder="+1234567890"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          required
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Company Information Section */}
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <BusinessIcon />
                      <Typography variant="h6">Company Information</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          value={newUser.company?.company_name || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, company_name: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Email"
                          type="email"
                          value={newUser.company?.company_email || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, company_email: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Contact Number"
                          value={newUser.company?.company_contact_number || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, company_contact_number: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Registration Number"
                          value={newUser.company?.company_registration_number || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, company_registration_number: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Registration Country</InputLabel>
                          <Select
                            value={newUser.company?.registration_country || ''}
                            onChange={(e) => setNewUser({
                              ...newUser,
                              company: { ...newUser.company!, registration_country: e.target.value }
                            })}
                            label="Registration Country"
                          >
                            {countryOptions.map((country) => (
                              <MenuItem key={country} value={country}>
                                {country}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Representative"
                          value={newUser.company?.company_representative || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, company_representative: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Website"
                          value={newUser.company?.website || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, website: e.target.value }
                          })}
                          placeholder="https://company.com"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax ID"
                          value={newUser.company?.tax_id || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, tax_id: e.target.value }
                          })}
                        />
                      </Grid>
                      {userType === UserType.AFFILIATE && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Commission Rate (%)"
                            type="number"
                            value={newUser.company?.commission_rate || 5}
                            onChange={(e) => setNewUser({
                              ...newUser,
                              company: { ...newUser.company!, commission_rate: Number(e.target.value) }
                            })}
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                          />
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          multiline
                          rows={2}
                          value={newUser.company?.address || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, address: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="City"
                          value={newUser.company?.city || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, city: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="State/Province"
                          value={newUser.company?.state || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, state: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={newUser.company?.postal_code || ''}
                          onChange={(e) => setNewUser({
                            ...newUser,
                            company: { ...newUser.company!, postal_code: e.target.value }
                          })}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} disabled={formLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitAddUser}
            disabled={formLoading || !newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password || !newUser.company?.company_name}
          >
            {formLoading ? <CircularProgress size={20} /> : `Add ${title.slice(0, -1)}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User & Company Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Edit {title.slice(0, -1)} & Company</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* User Information Section */}
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon />
                      <Typography variant="h6">User Information</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={editUser.first_name}
                          onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={editUser.last_name}
                          onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={editUser.email}
                          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={editUser.phone}
                          onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                          placeholder="+1234567890"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={editUser.status}
                            onChange={(e) => setEditUser({ ...editUser, status: e.target.value as UserStatus })}
                            label="Status"
                          >
                            {userStatusOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" gap={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={editUser.email_verified}
                                onChange={(e) => setEditUser({ ...editUser, email_verified: e.target.checked })}
                              />
                            }
                            label="Email Verified"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={editUser.phone_verified}
                                onChange={(e) => setEditUser({ ...editUser, phone_verified: e.target.checked })}
                              />
                            }
                            label="Phone Verified"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Company Information Section */}
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <BusinessIcon />
                      <Typography variant="h6">Company Information</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          value={editUser.company?.company_name || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, company_name: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Email"
                          type="email"
                          value={editUser.company?.company_email || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, company_email: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Contact Number"
                          value={editUser.company?.company_contact_number || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, company_contact_number: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Registration Number"
                          value={editUser.company?.company_registration_number || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, company_registration_number: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Registration Country</InputLabel>
                          <Select
                            value={editUser.company?.registration_country || ''}
                            onChange={(e) => setEditUser({
                              ...editUser,
                              company: { ...editUser.company!, registration_country: e.target.value }
                            })}
                            label="Registration Country"
                          >
                            {countryOptions.map((country) => (
                              <MenuItem key={country} value={country}>
                                {country}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Representative"
                          value={editUser.company?.company_representative || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, company_representative: e.target.value }
                          })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Website"
                          value={editUser.company?.website || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, website: e.target.value }
                          })}
                          placeholder="https://company.com"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax ID"
                          value={editUser.company?.tax_id || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, tax_id: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Company Status</InputLabel>
                          <Select
                            value={editUser.company?.status || 'pending'}
                            onChange={(e) => setEditUser({
                              ...editUser,
                              company: { ...editUser.company!, status: e.target.value as 'suspended' | 'pending' | 'approved' | 'rejected' }
                            })}
                            label="Company Status"
                          >
                            {companyStatusOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {userType === UserType.AFFILIATE && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Commission Rate (%)"
                            type="number"
                            value={editUser.company?.commission_rate || 5}
                            onChange={(e) => setEditUser({
                              ...editUser,
                              company: { ...editUser.company!, commission_rate: Number(e.target.value) }
                            })}
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                          />
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          multiline
                          rows={2}
                          value={editUser.company?.address || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, address: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="City"
                          value={editUser.company?.city || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, city: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="State/Province"
                          value={editUser.company?.state || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, state: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={editUser.company?.postal_code || ''}
                          onChange={(e) => setEditUser({
                            ...editUser,
                            company: { ...editUser.company!, postal_code: e.target.value }
                          })}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} disabled={formLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitEditUser}
            disabled={formLoading || !editUser.first_name || !editUser.last_name || !editUser.email || 
              !editUser.company?.company_name || !editUser.company?.company_email || 
              !editUser.company?.company_contact_number || !editUser.company?.company_registration_number || 
              !editUser.company?.registration_country || !editUser.company?.company_representative ||
              (!!editUser.company?.company_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.company.company_email))}
          >
            {formLoading ? <CircularProgress size={20} /> : `Update ${title.slice(0, -1)}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete {title.slice(0, -1)}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {title.slice(0, -1).toLowerCase()} "{selectedUser?.first_name} {selectedUser?.last_name}" 
            {selectedUser?.company && ` and their company "${selectedUser.company.company_name}"`}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced View User Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <PersonIcon />
            <Typography variant="h6">
              {title.slice(0, -1)} Details: {selectedUser?.first_name} {selectedUser?.last_name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* User Information */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        User Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Name</Typography>
                          <Typography variant="body1">{selectedUser.first_name} {selectedUser.last_name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Email</Typography>
                          <Typography variant="body1">{selectedUser.email}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Phone</Typography>
                          <Typography variant="body1">{selectedUser.phone || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Status</Typography>
                          <Chip
                            label={selectedUser.status}
                            color={getStatusColor(selectedUser.status) as any}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Email Verified</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon
                              color={selectedUser.email_verified ? 'success' : 'disabled'}
                              fontSize="small"
                            />
                            <Typography variant="body1">
                              {selectedUser.email_verified ? 'Yes' : 'No'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Phone Verified</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon
                              color={selectedUser.phone_verified ? 'success' : 'disabled'}
                              fontSize="small"
                            />
                            <Typography variant="body1">
                              {selectedUser.phone_verified ? 'Yes' : 'No'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Company Information */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <BusinessIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Company Information
                      </Typography>
                      {selectedUser.company ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">Company Name</Typography>
                            <Typography variant="body1">{selectedUser.company.company_name}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">Type</Typography>
                            <Typography variant="body1">{selectedUser.company.company_type?.toUpperCase()}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">Status</Typography>
                            <Chip
                              label={selectedUser.company.status}
                              color={getCompanyStatusColor(selectedUser.company.status) as any}
                              size="small"
                              icon={getCompanyStatusIcon(selectedUser.company.status)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">Contact Email</Typography>
                            <Typography variant="body1">{selectedUser.company.company_email}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">Contact Number</Typography>
                            <Typography variant="body1">{selectedUser.company.company_contact_number}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">Registration #</Typography>
                            <Typography variant="body1">{selectedUser.company.company_registration_number}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">Country</Typography>
                            <Typography variant="body1">{selectedUser.company.registration_country}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">Representative</Typography>
                            <Typography variant="body1">{selectedUser.company.company_representative}</Typography>
                          </Grid>
                          {selectedUser.company.website && (
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">Website</Typography>
                              <Typography variant="body1">
                                <a href={selectedUser.company.website} target="_blank" rel="noopener noreferrer">
                                  {selectedUser.company.website}
                                </a>
                              </Typography>
                            </Grid>
                          )}
                          {selectedUser.company.commission_rate && (
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">Commission Rate</Typography>
                              <Typography variant="body1">{selectedUser.company.commission_rate}%</Typography>
                            </Grid>
                          )}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No company information available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Address Information */}
                {selectedUser.company?.address && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          <LocationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Address Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">Address</Typography>
                            <Typography variant="body1">{selectedUser.company.address}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">City</Typography>
                            <Typography variant="body1">{selectedUser.company.city || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">State</Typography>
                            <Typography variant="body1">{selectedUser.company.state || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Postal Code</Typography>
                            <Typography variant="body1">{selectedUser.company.postal_code || 'N/A'}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => handleEditUser(selectedUser!)}>
            Edit {title.slice(0, -1)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CompanyUserManagement