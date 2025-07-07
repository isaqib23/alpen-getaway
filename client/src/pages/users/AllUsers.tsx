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
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'

import { useUsers, getUserTypeOptions, getUserStatusOptions } from '../../hooks/useUsers'
import { User, UserType, UserStatus, CreateUserRequest, UpdateUserRequest } from '../../api/users'

const AllUsers = () => {
  // Initialize users hook with pagination
  const {
    users,
    total,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setFilters,
  } = useUsers({ page: 1, limit: 10 })

  // Local state for UI
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  
  // Form state for Add User
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_type: UserType.CUSTOMER,
    password: '',
  })
  
  // Form state for Edit User
  const [editUser, setEditUser] = useState<UpdateUserRequest>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_type: UserType.CUSTOMER,
    status: UserStatus.ACTIVE,
    email_verified: false,
    phone_verified: false,
  })

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
    setFilters({
      page: newPage + 1, // API pages are 1-based
      limit: rowsPerPage,
      search: searchTerm || undefined,
      userType: roleFilter || undefined,
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
      userType: roleFilter || undefined,
      status: statusFilter || undefined,
    })
  }

  const handleAddUser = () => {
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      user_type: UserType.CUSTOMER,
      password: '',
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
      userType: roleFilter || undefined,
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
      userType: roleFilter || undefined,
      status: newStatus || undefined,
    })
  }

  const handleRoleChange = (event: any) => {
    const newRole = event.target.value
    setRoleFilter(newRole)
    setFilters({
      page: 1,
      limit: rowsPerPage,
      search: searchTerm || undefined,
      userType: newRole || undefined,
      status: statusFilter || undefined,
    })
  }

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleSubmitAddUser = async () => {
    setFormLoading(true)
    try {
      const result = await createUser(newUser)
      if (result) {
        // Reset form and close dialog
        setNewUser({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          user_type: UserType.CUSTOMER,
          password: '',
        })
        setOpenAddDialog(false)
      }
    } catch (error) {
      console.error('Error adding user:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmitEditUser = async () => {
    if (!selectedUser) return
    
    setFormLoading(true)
    try {
      const result = await updateUser(selectedUser.id, editUser)
      if (result) {
        // Close dialog
        setOpenEditDialog(false)
        setSelectedUser(null)
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
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error'
      case 'customer':
        return 'primary'
      case 'affiliate':
        return 'secondary'
      case 'b2b':
        return 'info'
      default:
        return 'default'
    }
  }

  // Get enum options for dropdowns
  const userTypeOptions = getUserTypeOptions()
  const userStatusOptions = getUserStatusOptions()

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          All Users
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
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  label="Status"
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
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={handleRoleChange}
                  label="Role"
                >
                  <MenuItem value="">All</MenuItem>
                  {userTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {total} user(s) found
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
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Verification</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Created</TableCell>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No users found
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
                          ID: {user.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.user_type}
                        color={getRoleColor(user.user_type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title={user.email_verified ? 'Email verified' : 'Email not verified'}>
                          <EmailIcon
                            color={user.email_verified ? 'success' : 'disabled'}
                            fontSize="small"
                          />
                        </Tooltip>
                        <Tooltip title={user.phone_verified ? 'Phone verified' : 'Phone not verified'}>
                          <PhoneIcon
                            color={user.phone_verified ? 'success' : 'disabled'}
                            fontSize="small"
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      Never
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

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUser.user_type}
                    onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value as UserType })}
                    label="Role"
                  >
                    {userTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            disabled={formLoading || !newUser.first_name || !newUser.last_name || !newUser.email || !newUser.user_type || !newUser.password}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
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
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={editUser.user_type}
                    onChange={(e) => setEditUser({ ...editUser, user_type: e.target.value as UserType })}
                    label="Role"
                  >
                    {userTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editUser.email_verified}
                      onChange={(e) => setEditUser({ ...editUser, email_verified: e.target.checked })}
                    />
                  }
                  label="Email Verified"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editUser.phone_verified}
                      onChange={(e) => setEditUser({ ...editUser, phone_verified: e.target.checked })}
                    />
                  }
                  label="Phone Verified"
                />
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
            disabled={formLoading || !editUser.first_name || !editUser.last_name || !editUser.email || !editUser.user_type}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.first_name} {selectedUser?.last_name}"?
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

      {/* View User Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <PersonIcon />
            <Typography variant="h6">
              User Details: {selectedUser?.first_name} {selectedUser?.last_name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Personal Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">First Name</Typography>
                        <Typography variant="body1">{selectedUser.first_name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Last Name</Typography>
                        <Typography variant="body1">{selectedUser.last_name}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Email</Typography>
                        <Typography variant="body1">{selectedUser.email}</Typography>
                      </Grid>
                      {selectedUser.phone && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Phone</Typography>
                          <Typography variant="body1">{selectedUser.phone}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Account Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Role</Typography>
                        <Chip
                          label={selectedUser.user_type}
                          color={getRoleColor(selectedUser.user_type) as any}
                          size="small"
                        />
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
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <CalendarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Activity Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Last Login</Typography>
                        <Typography variant="body1">
                          Never
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Member Since</Typography>
                        <Typography variant="body1">
                          {new Date(selectedUser.created_at).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Last Updated</Typography>
                        <Typography variant="body1">
                          {new Date(selectedUser.updated_at).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => handleEditUser(selectedUser!)}>
            Edit User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AllUsers