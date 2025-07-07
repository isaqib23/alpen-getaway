import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material'
import {
  Search,
  Visibility,
  Gavel,
  Schedule,
  CheckCircle,
  Cancel,
  Business,
  LocationOn,
  AttachMoney,
  CalendarToday,
  TrendingUp,
  Edit,
  Save,
  Close,
  Person,
  DirectionsCar,
} from '@mui/icons-material'
import { bookingRequestsApi, B2BRequest } from '../api/bookingRequests'
import { useNotification } from '../contexts/NotificationContext'

export type BookingContext = 'root' | 'b2b' | 'affiliate'

interface BookingRequestsTableProps {
  context: BookingContext
  title: string
  showPartnerColumn?: boolean
  showAffiliateColumn?: boolean
  showCreateAuction?: boolean
  showEditBooking?: boolean
  additionalFilters?: React.ReactNode
  externalFilters?: Record<string, any>
}

const BookingRequestsTable: React.FC<BookingRequestsTableProps> = ({
  context,
  title,
  showPartnerColumn = false,
  showAffiliateColumn = false,
  showCreateAuction = false,
  showEditBooking = false,
  additionalFilters,
  externalFilters = {},
}) => {
  const { showNotification } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [partnerFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<B2BRequest | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingRequest, setEditingRequest] = useState<B2BRequest | null>(null)
  const [requests, setRequests] = useState<B2BRequest[]>([])
  const [statistics, setStatistics] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    activeAuctions: 0,
    successRate: 0
  })
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchRequests()
    fetchStatistics()
  }, [])

  // Fetch data when filters change
  useEffect(() => {
    fetchRequests()
  }, [searchTerm, statusFilter, partnerFilter, priorityFilter, externalFilters])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const filters: any = {
        context: context, // Add context filter
      }
      
      if (searchTerm) filters.search = searchTerm
      if (statusFilter !== 'All') filters.status = statusFilter.toLowerCase()
      if (partnerFilter !== 'All') filters.affiliateId = partnerFilter
      if (priorityFilter !== 'All') filters.priority = priorityFilter.toLowerCase()
      
      // Apply external filters
      Object.entries(externalFilters).forEach(([key, value]) => {
        if (value && value !== 'All') {
          if (key === 'partnerFilter') {
            filters.affiliateId = value
          } else {
            filters[key] = value
          }
        }
      })
      
      const data = await bookingRequestsApi.getAll(filters)
      setRequests(data)
    } catch (error) {
      showNotification('Failed to fetch booking requests', 'error')
      console.error('Fetch requests error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const stats = await bookingRequestsApi.getStatistics(context)
      setStatistics(stats)
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'auction_won':
      case 'completed':
        return 'success'
      case 'auction_active':
        return 'info'
      case 'auction_created':
      case 'pending':
        return 'warning'
      case 'auction_lost':
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'auction_won':
      case 'completed':
        return <CheckCircle />
      case 'auction_active':
        return <Gavel />
      case 'auction_created':
      case 'pending':
        return <Schedule />
      case 'auction_lost':
      case 'cancelled':
        return <Cancel />
      default:
        return <Schedule />
    }
  }

  const getContextIcon = () => {
    switch (context) {
      case 'root':
        return <DirectionsCar />
      case 'b2b':
        return <Business />
      case 'affiliate':
        return <Person />
      default:
        return <DirectionsCar />
    }
  }

  const getContextColor = () => {
    switch (context) {
      case 'root':
        return 'primary.main'
      case 'b2b':
        return 'info.main'
      case 'affiliate':
        return 'success.main'
      default:
        return 'primary.main'
    }
  }

  const handleViewRequest = (request: B2BRequest) => {
    setSelectedRequest(request)
    setOpenDialog(true)
  }

  const handleCreateAuction = async (requestId: string) => {
    try {
      await bookingRequestsApi.createAuction(requestId)
      showNotification('Auction created successfully!', 'success')
      fetchRequests()
    } catch (error) {
      showNotification('Failed to create auction', 'error')
    }
  }

  const handleEditRequest = (request: B2BRequest) => {
    setEditingRequest({ ...request })
    setOpenEditDialog(true)
  }

  const handleSaveRequest = async () => {
    if (!editingRequest) return
    
    setSubmitLoading(true)
    try {
      const updateData = {
        customerName: editingRequest.customerName,
        fromLocation: editingRequest.fromLocation,
        toLocation: editingRequest.toLocation,
        pickupDatetime: editingRequest.pickupDateTime,
        passengerCount: editingRequest.passengerCount,
        luggageCount: editingRequest.luggageCount,
        vehiclePreference: editingRequest.vehiclePreference,
        specialRequirements: editingRequest.specialRequirements,
        maxBudget: editingRequest.maxBudget,
        priority: editingRequest.priority,
        status: editingRequest.status
      }
      
      await bookingRequestsApi.update(editingRequest.id, updateData as any)
      showNotification('Booking request updated successfully!', 'success')
      setOpenEditDialog(false)
      setEditingRequest(null)
      fetchRequests()
    } catch (error) {
      showNotification('Failed to update booking request', 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEditChange = (field: keyof B2BRequest, value: any) => {
    if (editingRequest) {
      setEditingRequest(prev => prev ? { ...prev, [field]: value } : null)
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">{title}</Typography>
        <Button variant="outlined" startIcon={<TrendingUp />}>
          Export Report
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="auction_created">Auction Created</MenuItem>
                <MenuItem value="auction_active">Auction Active</MenuItem>
                <MenuItem value="auction_won">Auction Won</MenuItem>
                <MenuItem value="auction_lost">Auction Lost</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="All">All Priorities</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Additional context-specific filters */}
          {additionalFilters}
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{statistics.totalRequests}</Typography>
              <Typography variant="body2" color="textSecondary">Total Requests</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">{statistics.pendingRequests}</Typography>
              <Typography variant="body2" color="textSecondary">Pending Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">{statistics.activeAuctions}</Typography>
              <Typography variant="body2" color="textSecondary">Active Auctions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{statistics.successRate}%</Typography>
              <Typography variant="body2" color="textSecondary">Success Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Requests Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request</TableCell>
                {showPartnerColumn && <TableCell>Partner</TableCell>}
                {showAffiliateColumn && <TableCell>Affiliate</TableCell>}
                <TableCell>Customer</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Pickup Time</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Auction</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    Loading booking requests...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    No booking requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                        {request.requestId}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {showPartnerColumn && (
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 1, bgcolor: getContextColor(), width: 32, height: 32 }}>
                          {getContextIcon()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{request.partnerName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.businessType?.replace('_', ' ') || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  )}

                  {showAffiliateColumn && (
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 1, bgcolor: 'success.main', width: 32, height: 32 }}>
                          <Person fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{request.partnerName || 'Direct'}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Affiliate
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  )}

                  <TableCell>
                    <Typography variant="body2">{request.customerName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {request.passengerCount} pax, {request.luggageCount} bags
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2">
                          {request.fromLocation} → {request.toLocation}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {request.vehiclePreference}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2">
                          {new Date(request.pickupDateTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(request.pickupDateTime).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <AttachMoney fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          €{request.maxBudget.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Max budget
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {request.auctionId ? (
                      <Box>
                        <Typography variant="body2">
                          {request.currentBids} bid{request.currentBids !== 1 ? 's' : ''}
                        </Typography>
                        {request.winningBid && (
                          <Typography variant="caption" color="success.main">
                            Best: €{request.winningBid.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        No auction
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={request.priority.toUpperCase()}
                      color={getPriorityColor(request.priority)}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getStatusIcon(request.status)}
                      <Chip
                        label={request.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <IconButton size="small" onClick={() => handleViewRequest(request)}>
                      <Visibility />
                    </IconButton>
                    {showEditBooking && (
                      <IconButton size="small" onClick={() => handleEditRequest(request)}>
                        <Edit />
                      </IconButton>
                    )}
                    {showCreateAuction && request.status === 'pending' && (
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleCreateAuction(request.id)}
                      >
                        <Gavel />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Request Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {getContextIcon()}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {context.toUpperCase()} Request Details: {selectedRequest?.requestId}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Request Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Request ID:</strong> {selectedRequest.requestId}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Context:</strong> {context.toUpperCase()}
                </Typography>
                {selectedRequest.partnerName && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Partner:</strong> {selectedRequest.partnerName}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Priority:</strong> {selectedRequest.priority.toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Submitted:</strong> {new Date(selectedRequest.submittedAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {selectedRequest.status.replace('_', ' ').toUpperCase()}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Trip Details
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Customer:</strong> {selectedRequest.customerName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>From:</strong> {selectedRequest.fromLocation}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>To:</strong> {selectedRequest.toLocation}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Pickup:</strong> {new Date(selectedRequest.pickupDateTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Passengers:</strong> {selectedRequest.passengerCount}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Luggage:</strong> {selectedRequest.luggageCount} pieces
                </Typography>
                <Typography variant="body2">
                  <strong>Vehicle:</strong> {selectedRequest.vehiclePreference}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Special Requirements
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedRequest.specialRequirements || 'None specified'}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Budget & Auction Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Maximum Budget:</strong> €{selectedRequest.maxBudget.toFixed(2)}
                </Typography>
                {selectedRequest.auctionId ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Auction ID:</strong> {selectedRequest.auctionId}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Current Bids:</strong> {selectedRequest.currentBids}
                    </Typography>
                    {selectedRequest.winningBid && (
                      <>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Best Bid:</strong> €{selectedRequest.winningBid.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Leading Partner:</strong> {selectedRequest.winningPartner}
                        </Typography>
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No auction created yet
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {showCreateAuction && selectedRequest?.status === 'pending' && (
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Gavel />}
              onClick={() => handleCreateAuction(selectedRequest.id)}
            >
              Create Auction
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Request Dialog */}
      {showEditBooking && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <Edit sx={{ mr: 1 }} />
              Edit {context.toUpperCase()} Request: {editingRequest?.requestId}
            </Box>
          </DialogTitle>
          <DialogContent>
            {editingRequest && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    value={editingRequest.customerName}
                    onChange={(e) => handleEditChange('customerName', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="From Location"
                    value={editingRequest.fromLocation}
                    onChange={(e) => handleEditChange('fromLocation', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="To Location"
                    value={editingRequest.toLocation}
                    onChange={(e) => handleEditChange('toLocation', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pickup Date & Time"
                    type="datetime-local"
                    value={editingRequest.pickupDateTime.slice(0, 16)}
                    onChange={(e) => handleEditChange('pickupDateTime', e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Passenger Count"
                    type="number"
                    value={editingRequest.passengerCount}
                    onChange={(e) => handleEditChange('passengerCount', parseInt(e.target.value))}
                    margin="normal"
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Luggage Count"
                    type="number"
                    value={editingRequest.luggageCount}
                    onChange={(e) => handleEditChange('luggageCount', parseInt(e.target.value))}
                    margin="normal"
                    inputProps={{ min: 0, max: 50 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Preference"
                    value={editingRequest.vehiclePreference}
                    onChange={(e) => handleEditChange('vehiclePreference', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Budget"
                    type="number"
                    value={editingRequest.maxBudget}
                    onChange={(e) => handleEditChange('maxBudget', parseFloat(e.target.value))}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={editingRequest.priority}
                      label="Priority"
                      onChange={(e) => handleEditChange('priority', e.target.value)}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editingRequest.status}
                      label="Status"
                      onChange={(e) => handleEditChange('status', e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="auction_created">Auction Created</MenuItem>
                      <MenuItem value="auction_active">Auction Active</MenuItem>
                      <MenuItem value="auction_won">Auction Won</MenuItem>
                      <MenuItem value="auction_lost">Auction Lost</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Special Requirements"
                    multiline
                    rows={3}
                    value={editingRequest.specialRequirements}
                    onChange={(e) => handleEditChange('specialRequirements', e.target.value)}
                    margin="normal"
                    placeholder="Enter any special requirements..."
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} startIcon={<Close />}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRequest} 
              variant="contained" 
              startIcon={<Save />}
              color="primary"
              disabled={submitLoading}
            >
              {submitLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}

export default BookingRequestsTable