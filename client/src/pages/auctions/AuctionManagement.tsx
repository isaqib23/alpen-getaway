import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
  CircularProgress,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
  Gavel,
  Timer,
  Assignment,
  LocalOffer,
  PlayArrow,
  Stop,
  Cancel,
  Schedule,
  Refresh,
} from '@mui/icons-material'
import { useAuctions, useAuctionStats, useAuctionActions } from '../../hooks/useAuctions'
import { useToast } from '../../hooks/useToast'
import { Auction, AuctionFilters } from '../../api/auctions'


const AuctionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openBidsDialog, setOpenBidsDialog] = useState(false)
  const [openAwardDialog, setOpenAwardDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  
  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minimum_bid_amount: '',
    reserve_price: '',
    auction_start_time: '',
    auction_end_time: '',
    booking_id: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formLoading, setFormLoading] = useState(false)
  
  // API integration
  const [filters, setFilters] = useState<AuctionFilters>({
    page: 1,
    limit: 50 // Show more results by default
  })
  
  const { auctions, loading, error, refetch } = useAuctions(filters)
  const { stats, loading: statsLoading } = useAuctionStats()
  const { 
    loading: actionLoading, 
    startAuction, 
    closeAuction, 
    cancelAuction, 
    deleteAuction,
    createAuction,
    updateAuction
  } = useAuctionActions()
  const { success, error: showError } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default'
      case 'active':
        return 'success'
      case 'closed':
        return 'warning'
      case 'awarded':
        return 'info'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatTimeRemaining = (auction: Auction) => {
    if (auction.status !== 'active') return 'Ended'
    
    const now = new Date()
    const endTime = new Date(auction.auction_end_time)
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getTimeProgress = (auction: Auction) => {
    const start = new Date(auction.auction_start_time).getTime()
    const end = new Date(auction.auction_end_time).getTime()
    const now = new Date().getTime()
    
    if (now < start) return 0
    if (now > end) return 100
    
    return ((now - start) / (end - start)) * 100
  }

  const handleActionClick = async (action: string, auction: Auction) => {
    try {
      switch (action) {
        case 'start':
          await startAuction(auction.id)
          success('Auction started successfully')
          break
        case 'close':
          await closeAuction(auction.id)
          success('Auction closed successfully')
          break
        case 'cancel':
          await cancelAuction(auction.id, 'Cancelled by admin')
          success('Auction cancelled successfully')
          break
        case 'delete':
          await deleteAuction(auction.id)
          success('Auction deleted successfully')
          break
      }
      refetch() // Refresh the list
    } catch (error: any) {
      showError(error.message || `Failed to ${action} auction`)
    }
  }

  // Update filters when search term or status changes
  useEffect(() => {
    const newFilters: AuctionFilters = {
      page: 1,
      limit: 50
    }
    
    if (searchTerm.trim()) {
      newFilters.search = searchTerm.trim()
    }
    
    if (statusFilter !== 'all') {
      newFilters.status = statusFilter
    }
    
    setFilters(newFilters)
  }, [searchTerm, statusFilter])

  const handleViewAuction = (auction: Auction) => {
    setSelectedAuction(auction)
    setOpenViewDialog(true)
  }

  const handleViewBids = (auction: Auction) => {
    setSelectedAuction(auction)
    setOpenBidsDialog(true)
  }

  const handleAwardAuction = (auction: Auction) => {
    setSelectedAuction(auction)
    setOpenAwardDialog(true)
  }

  const handleEditAuction = (auction: Auction) => {
    setSelectedAuction(auction)
    setFormData({
      title: auction.title,
      description: auction.description || '',
      minimum_bid_amount: auction.minimum_bid_amount.toString(),
      reserve_price: auction.reserve_price?.toString() || '',
      auction_start_time: auction.auction_start_time.slice(0, 16), // Format for datetime-local input
      auction_end_time: auction.auction_end_time.slice(0, 16),
      booking_id: auction.booking_id || ''
    })
    setFormErrors({})
    setOpenEditDialog(true)
  }

  const handleDeleteAuction = (auction: Auction) => {
    setSelectedAuction(auction)
    setOpenDeleteDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenCreateDialog(false)
    setOpenEditDialog(false)
    setOpenDeleteDialog(false)
    setSelectedAuction(null)
    setFormData({
      title: '',
      description: '',
      minimum_bid_amount: '',
      reserve_price: '',
      auction_start_time: '',
      auction_end_time: '',
      booking_id: ''
    })
    setFormErrors({})
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!formData.minimum_bid_amount || parseFloat(formData.minimum_bid_amount) <= 0) {
      errors.minimum_bid_amount = 'Minimum bid amount must be greater than 0'
    }

    if (formData.reserve_price && parseFloat(formData.reserve_price) <= parseFloat(formData.minimum_bid_amount)) {
      errors.reserve_price = 'Reserve price must be greater than minimum bid amount'
    }

    if (!formData.auction_start_time) {
      errors.auction_start_time = 'Start time is required'
    }

    if (!formData.auction_end_time) {
      errors.auction_end_time = 'End time is required'
    }

    if (formData.auction_start_time && formData.auction_end_time) {
      const startTime = new Date(formData.auction_start_time)
      const endTime = new Date(formData.auction_end_time)
      
      if (startTime >= endTime) {
        errors.auction_end_time = 'End time must be after start time'
      }

      if (startTime < new Date()) {
        errors.auction_start_time = 'Start time must be in the future'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateAuction = async () => {
    if (!validateForm()) return

    setFormLoading(true)
    try {
      await createAuction({
        title: formData.title,
        description: formData.description || undefined,
        minimum_bid_amount: parseFloat(formData.minimum_bid_amount),
        reserve_price: formData.reserve_price ? parseFloat(formData.reserve_price) : undefined,
        auction_start_time: new Date(formData.auction_start_time).toISOString(),
        auction_end_time: new Date(formData.auction_end_time).toISOString(),
        booking_id: formData.booking_id || 'temp-booking-id' // This should come from booking selection
      })
      success('Auction created successfully')
      handleCloseDialog()
      refetch()
    } catch (error: any) {
      showError(error.message || 'Failed to create auction')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateAuction = async () => {
    if (!selectedAuction || !validateForm()) return

    setFormLoading(true)
    try {
      await updateAuction(selectedAuction.id, {
        title: formData.title,
        description: formData.description || undefined,
        minimum_bid_amount: parseFloat(formData.minimum_bid_amount),
        reserve_price: formData.reserve_price ? parseFloat(formData.reserve_price) : undefined,
        auction_start_time: new Date(formData.auction_start_time).toISOString(),
        auction_end_time: new Date(formData.auction_end_time).toISOString()
      })
      success('Auction updated successfully')
      handleCloseDialog()
      refetch()
    } catch (error: any) {
      showError(error.message || 'Failed to update auction')
    } finally {
      setFormLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedAuction) return

    try {
      await handleActionClick('delete', selectedAuction)
      handleCloseDialog()
    } catch (error: any) {
      showError(error.message || 'Failed to delete auction')
    }
  }

  // Filtering is now handled by the API, so we use auctions directly
  const filteredAuctions = auctions

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Auction Management</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refetch}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Create Auction
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {statsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  <Typography variant="h4" color="success.main">
                    {stats?.active_auctions || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Active Auctions</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {statsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  <Typography variant="h4" color="info.main">
                    {stats?.total_bids || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Total Bids</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {statsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  <Typography variant="h4" color="warning.main">
                    €{stats?.average_bid_amount || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Average Bid</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {statsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  <Typography variant="h4" color="primary.main">
                    {stats?.success_rate || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Success Rate</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="awarded">Awarded</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Auctions Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Auction Details</TableCell>
                <TableCell>Route & Customer</TableCell>
                <TableCell>Timing</TableCell>
                <TableCell>Bidding Status</TableCell>
                <TableCell>Time Remaining</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {auction.auction_reference}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {auction.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Min: €{auction.minimum_bid_amount}
                        {auction.reserve_price && ` | Reserve: €${auction.reserve_price}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {auction.booking?.customer_name || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {auction.booking?.pickup_location} → {auction.booking?.dropoff_location}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {auction.booking?.vehicle_category}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" display="flex" alignItems="center">
                        <Schedule fontSize="small" sx={{ mr: 1 }} />
                        {new Date(auction.auction_start_time).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" display="flex" alignItems="center">
                        <Timer fontSize="small" sx={{ mr: 1 }} />
                        {new Date(auction.auction_end_time).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <Badge badgeContent={auction.bid_count || 0} color="primary">
                          <Gavel fontSize="small" />
                        </Badge>
                        <span style={{ marginLeft: 8 }}>{auction.bid_count || 0} bids</span>
                      </Typography>
                      {auction.highest_bid_amount && (
                        <Typography variant="caption" color="textSecondary">
                          Highest: €{auction.highest_bid_amount}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {auction.status === 'active' ? (
                      <Box>
                        <Typography variant="body2" color="warning.main" fontWeight="bold">
                          {formatTimeRemaining(auction)}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={getTimeProgress(auction)} 
                          color="warning"
                          sx={{ mt: 1, width: 80 }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        {auction.status === 'draft' ? 'Not started' : 'Ended'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                      color={getStatusColor(auction.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewAuction(auction)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      {(auction.status === 'draft') && (
                        <Tooltip title="Edit Auction">
                          <IconButton size="small" color="primary" onClick={() => handleEditAuction(auction)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="View Bids">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleViewBids(auction)}
                          disabled={!auction.bid_count}
                        >
                          <Badge badgeContent={auction.bid_count} color="secondary">
                            <LocalOffer />
                          </Badge>
                        </IconButton>
                      </Tooltip>

                      {auction.status === 'draft' && (
                        <Tooltip title="Start Auction">
                          <IconButton 
                            size="small" 
                            color="success" 
                            onClick={() => handleActionClick('start', auction)}
                            disabled={actionLoading}
                          >
                            <PlayArrow />
                          </IconButton>
                        </Tooltip>
                      )}

                      {auction.status === 'active' && (
                        <Tooltip title="Close Auction">
                          <IconButton 
                            size="small" 
                            color="warning" 
                            onClick={() => handleActionClick('close', auction)}
                            disabled={actionLoading}
                          >
                            <Stop />
                          </IconButton>
                        </Tooltip>
                      )}

                      {auction.status === 'closed' && auction.bid_count && (
                        <Tooltip title="Award Winner">
                          <IconButton 
                            size="small" 
                            color="success" 
                            onClick={() => handleAwardAuction(auction)}
                          >
                            <Assignment />
                          </IconButton>
                        </Tooltip>
                      )}

                      {(auction.status === 'draft' || auction.status === 'active') && (
                        <Tooltip title="Cancel Auction">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleActionClick('cancel', auction)}
                            disabled={actionLoading}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      )}

                      {(auction.status === 'draft' || auction.status === 'cancelled') && (
                        <Tooltip title="Delete Auction">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteAuction(auction)}
                            disabled={actionLoading}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Auction Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Auction</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Auction Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Bid Amount (€)"
                type="number"
                value={formData.minimum_bid_amount}
                onChange={(e) => setFormData({ ...formData, minimum_bid_amount: e.target.value })}
                error={!!formErrors.minimum_bid_amount}
                helperText={formErrors.minimum_bid_amount}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reserve Price (€)"
                type="number"
                value={formData.reserve_price}
                onChange={(e) => setFormData({ ...formData, reserve_price: e.target.value })}
                error={!!formErrors.reserve_price}
                helperText={formErrors.reserve_price}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Auction Start Time"
                type="datetime-local"
                value={formData.auction_start_time}
                onChange={(e) => setFormData({ ...formData, auction_start_time: e.target.value })}
                error={!!formErrors.auction_start_time}
                helperText={formErrors.auction_start_time}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Auction End Time"
                type="datetime-local"
                value={formData.auction_end_time}
                onChange={(e) => setFormData({ ...formData, auction_end_time: e.target.value })}
                error={!!formErrors.auction_end_time}
                helperText={formErrors.auction_end_time}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Note: Booking ID will be automatically assigned when creating auctions from bookings.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={formLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateAuction}
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Create Auction'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Auction Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Auction</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Auction Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Bid Amount (€)"
                type="number"
                value={formData.minimum_bid_amount}
                onChange={(e) => setFormData({ ...formData, minimum_bid_amount: e.target.value })}
                error={!!formErrors.minimum_bid_amount}
                helperText={formErrors.minimum_bid_amount}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reserve Price (€)"
                type="number"
                value={formData.reserve_price}
                onChange={(e) => setFormData({ ...formData, reserve_price: e.target.value })}
                error={!!formErrors.reserve_price}
                helperText={formErrors.reserve_price}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Auction Start Time"
                type="datetime-local"
                value={formData.auction_start_time}
                onChange={(e) => setFormData({ ...formData, auction_start_time: e.target.value })}
                error={!!formErrors.auction_start_time}
                helperText={formErrors.auction_start_time}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Auction End Time"
                type="datetime-local"
                value={formData.auction_end_time}
                onChange={(e) => setFormData({ ...formData, auction_end_time: e.target.value })}
                error={!!formErrors.auction_end_time}
                helperText={formErrors.auction_end_time}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={formLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateAuction}
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Update Auction'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Auction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the auction "{selectedAuction?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDelete}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Auction Dialog - Placeholder */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Auction Details</DialogTitle>
        <DialogContent>
          {selectedAuction && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedAuction.title}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {selectedAuction.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Reference:</strong> {selectedAuction.auction_reference}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Status:</strong> {selectedAuction.status}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Minimum Bid:</strong> €{selectedAuction.minimum_bid_amount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Reserve Price:</strong> €{selectedAuction.reserve_price || 'None'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Start Time:</strong> {new Date(selectedAuction.auction_start_time).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>End Time:</strong> {new Date(selectedAuction.auction_end_time).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bids Dialog - Placeholder */}
      <Dialog open={openBidsDialog} onClose={() => setOpenBidsDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Auction Bids</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            Bid management interface will be implemented in the next phase.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBidsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Award Dialog - Placeholder */}
      <Dialog open={openAwardDialog} onClose={() => setOpenAwardDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Award Auction</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            Auction awarding interface will be implemented in the next phase.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAwardDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AuctionManagement