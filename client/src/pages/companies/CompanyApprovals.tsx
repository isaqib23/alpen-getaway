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
  Avatar,
  Card,
  CardContent,
  Divider,
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Pending as PendingIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material'

import { Company, CompanyStatus } from '../../types/api'
import { useCompanies } from '../../hooks/useCompanies'


const CompanyApprovals = () => {
  const {
    companies,
    loading,
    pagination,
    fetchCompanies,
    approveCompany,
    rejectCompany,
  } = useCompanies()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selectedApproval, setSelectedApproval] = useState<Company | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // Fetch companies pending approval when filters change
  useEffect(() => {
    const filters = {
      page: page + 1, // Backend uses 1-based pagination
      limit: rowsPerPage,
      status: CompanyStatus.PENDING, // Only fetch pending companies
      ...(searchTerm && { search: searchTerm }),
      ...(typeFilter && { type: typeFilter }),
    }
    fetchCompanies(filters)
  }, [page, rowsPerPage, searchTerm, typeFilter, fetchCompanies])

  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewApproval = (approval: Company) => {
    setSelectedApproval(approval)
    setOpenViewDialog(true)
  }

  const handleApprove = (approval: Company) => {
    setSelectedApproval(approval)
    setOpenApproveDialog(true)
  }

  const handleReject = (approval: Company) => {
    setSelectedApproval(approval)
    setOpenRejectDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value)
  }

  const handleTypeChange = (event: any) => {
    setTypeFilter(event.target.value)
  }

  const handlePriorityChange = (event: any) => {
    setPriorityFilter(event.target.value)
  }

  const handleRefresh = () => {
    // @ts-ignore
    setLoading(true)
    // @ts-ignore
    setTimeout(() => setLoading(false), 1000)
  }


  const confirmApproval = async () => {
    if (selectedApproval) {
      const success = await approveCompany(selectedApproval.id)
      if (success) {
        setOpenApproveDialog(false)
        setSelectedApproval(null)
      }
    }
  }

  const confirmRejection = async () => {
    if (selectedApproval) {
      const success = await rejectCompany(selectedApproval.id)
      if (success) {
        setOpenRejectDialog(false)
        setSelectedApproval(null)
        setRejectionReason('')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'under_review':
        return 'warning'
      case 'pending':
        return 'info'
      default:
        return 'default'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'b2b_partner':
        return 'B2B Partner'
      case 'affiliate':
        return 'Affiliate'
      case 'corporate':
        return 'Corporate'
      case 'supplier':
        return 'Supplier'
      default:
        return type
    }
  }

  const getDaysWaiting = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }


  // Filter companies to show only pending companies (filtering is now done by API)
  const pendingCompanies = companies.filter(company => company.status === CompanyStatus.PENDING)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Company Approvals
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

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PendingIcon color="info" fontSize="large" />
                <Box>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4" color="info">
                    {pendingCompanies.filter(a => a.status === 'pending').length}
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
                <TimeIcon color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h6">Under Review</Typography>
                  <Typography variant="h4" color="warning">
                    {// @ts-ignore
                      pendingCompanies.filter(a => a.status === 'under_review').length}
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
                <ApproveIcon color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Approved</Typography>
                  <Typography variant="h4" color="success">
                    {pendingCompanies.filter(a => a.status === 'approved').length}
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
                <RejectIcon color="error" fontSize="large" />
                <Box>
                  <Typography variant="h6">Rejected</Typography>
                  <Typography variant="h4" color="error">
                    {pendingCompanies.filter(a => a.status === 'rejected').length}
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
                placeholder="Search approval requests..."
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
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="under_review">Under Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
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
                  <MenuItem value="b2b_partner">B2B Partner</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                  <MenuItem value="supplier">Supplier</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={handlePriorityChange}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {pagination.total} request(s) found
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
              <TableCell>Priority</TableCell>
              <TableCell>Days Waiting</TableCell>
              <TableCell>Monthly Volume</TableCell>
              <TableCell>Submitted</TableCell>
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
            ) : pendingCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No approval requests found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pendingCompanies
                .map((approval) => (
                  <TableRow key={approval.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {approval.company_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {approval.company_registration_number}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {approval.company_type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {approval.contact_person || approval.company_representative}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {// @ts-ignore
                            approval.contact_email || approval.company_email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={approval.status.replace('_', ' ')}
                        color={getStatusColor(approval.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Medium"
                        color="warning"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {getDaysWaiting(approval.created_at)} days
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {approval.bookings?.length || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(approval.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewApproval(approval)}
                          color="info"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {approval.status === 'pending' ? (
                        <>
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              onClick={() => handleApprove(approval)}
                              color="success"
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              size="small"
                              onClick={() => handleReject(approval)}
                              color="error"
                            >
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : null}
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

      {/* View Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Company Approval Details</DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{// @ts-ignore
                  selectedApproval.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {// @ts-ignore
                    getTypeLabel(selectedApproval.type)} • {// @ts-ignore
                  selectedApproval.registrationNumber}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                <Typography variant="body2">{// @ts-ignore
                  selectedApproval.contactPerson}</Typography>
                <Typography variant="body2">{// @ts-ignore
                  selectedApproval.contactEmail}</Typography>
                <Typography variant="body2">{// @ts-ignore
                  selectedApproval.contactPhone}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Business Details</Typography>
                <Typography variant="body2">Tax ID: {// @ts-ignore
                  selectedApproval.taxId}</Typography>
                <Typography variant="body2">License: {// @ts-ignore
                  selectedApproval.businessLicense}</Typography>
                <Typography variant="body2">Website: {selectedApproval.website}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Address</Typography>
                <Typography variant="body2">
                  {// @ts-ignore
                    selectedApproval.address.street}, {// @ts-ignore
                  selectedApproval.address.city}, {// @ts-ignore
                  selectedApproval.address.state} {// @ts-ignore
                    selectedApproval.address.zipCode}, {// @ts-ignore
                  selectedApproval.address.country}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Requested Services</Typography>
                {// @ts-ignore
                  selectedApproval.requestedServices.map((service, index) => (
                  <Chip key={index} label={service} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Business Expectations</Typography>
                <Typography variant="body2">Monthly Volume: {// @ts-ignore
                  selectedApproval.estimatedMonthlyVolume}</Typography>
                <Typography variant="body2">Commission: {// @ts-ignore
                  selectedApproval.commissionExpectation}%</Typography>
              </Grid>
              {// @ts-ignore
                selectedApproval.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                  <Typography variant="body2">{// @ts-ignore
                    selectedApproval.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Approve Company</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve "{// @ts-ignore
            selectedApproval?.name}"?
            This will grant them access to the platform.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={confirmApproval}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Company</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to reject "{// @ts-ignore
            selectedApproval?.name}"?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmRejection}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CompanyApprovals