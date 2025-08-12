// @ts-nocheck
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
  Close,
  Person,
  DirectionsCar,
  AccessTime,
  Email,
  Star,
  EmojiEvents,
} from '@mui/icons-material'
import { useAuctions, useAuctionStats, useAuctionActions } from '../../hooks/useAuctions'
import { useGlobalToast } from '../../contexts/ToastContext'
import { Auction, AuctionFilters, AuctionBid, auctionsApi } from '../../api/auctions'
import { bookingsAPI, Booking } from '../../api/bookings'


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
  const [openBidDetailDialog, setOpenBidDetailDialog] = useState(false)
  
  // Bid management state
  const [bids, setBids] = useState<AuctionBid[]>([])
  const [bidsLoading, setBidsLoading] = useState(false)
  const [selectedBid, setSelectedBid] = useState<AuctionBid | null>(null)
  const [awardingBid, setAwardingBid] = useState(false)
  
  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    booking_id: ''
  })
  
  // Selected booking state to show pricing info
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formLoading, setFormLoading] = useState(false)
  
  // Bookings state for dropdown
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  
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
  const { success, error: showError } = useGlobalToast()

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

  // Fetch bookings for dropdown
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true)
      const response = await bookingsAPI.getBookings({ 
        booking_status: 'confirmed', // Only show confirmed bookings
        limit: 100 
      })
      setBookings(response.data || [])
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      setBookings([])
      showError('Failed to load bookings')
    } finally {
      setBookingsLoading(false)
    }
  }

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings()
  }, [])

  const handleViewAuction = (auction: Auction) => {
    setSelectedAuction(auction)
    setOpenViewDialog(true)
  }

  const handleViewBids = async (auction: Auction) => {
    setSelectedAuction(auction)
    setOpenBidsDialog(true)
    await fetchAuctionBids(auction.id)
  }
  
  // Fetch bids for a specific auction
  const fetchAuctionBids = async (auctionId: string) => {
    setBidsLoading(true)
    try {
      const response = await auctionsApi.getAuctionBids(auctionId, { limit: 100 })
      setBids(response.data || [])
    } catch (error: any) {
      console.error('Failed to fetch bids:', error)
      showError('Failed to load bids')
      setBids([])
    } finally {
      setBidsLoading(false)
    }
  }

  const handleAwardAuction = async (auction: Auction) => {
    setSelectedAuction(auction)
    setOpenAwardDialog(true)
    await fetchAuctionBids(auction.id)
  }
  
  // Award auction to a specific bid
  const awardAuctionToBid = async (bid: AuctionBid) => {
    if (!selectedAuction) return
    
    setAwardingBid(true)
    try {
      await auctionsApi.awardAuction(selectedAuction.id, {
        winning_bid_id: bid.id,
        notes: `Auction awarded to ${bid.company?.name || 'company'} with bid amount €${bid.bid_amount}`
      })
      success('Auction awarded successfully!')
      setOpenAwardDialog(false)
      setOpenBidsDialog(false)
      refetch() // Refresh auctions list
    } catch (error: any) {
      showError(error.message || 'Failed to award auction')
    } finally {
      setAwardingBid(false)
    }
  }

  const handleEditAuction = (auction: Auction) => {
    setSelectedAuction(auction)
    setFormData({
      title: auction.title,
      description: auction.description || '',
      booking_id: auction.booking_id || ''
    })
    
    // Set the selected booking to show pricing info
    if (auction.booking) {
      setSelectedBooking(auction.booking)
    }
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
      booking_id: ''
    })
    setSelectedBooking(null)
    setFormErrors({})
  }

  const handleBookingSelection = async (bookingId: string) => {
    if (bookingId) {
      const booking = bookings.find(b => b.id === bookingId)
      if (booking) {
        setSelectedBooking(booking)
        setFormData({ ...formData, booking_id: bookingId })
      }
    } else {
      setSelectedBooking(null)
      setFormData({ ...formData, booking_id: '' })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!formData.booking_id) {
      errors.booking_id = 'Please select a booking for this auction'
    }

    if (!selectedBooking) {
      errors.booking_id = 'Please select a booking first to determine pricing'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateAuction = async () => {
    if (!validateForm()) return

    setFormLoading(true)
    try {
      // Auto-start auction immediately and set 24-hour duration
      const now = new Date()
      const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

      await createAuction({
        title: formData.title,
        description: formData.description || undefined,
        auction_start_time: now.toISOString(),
        auction_end_time: endTime.toISOString(),
        booking_id: formData.booking_id
      })
      success('Auction created and started successfully')
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
        description: formData.description || undefined
        // Note: We don't update auction times for existing auctions
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
                        Min: €{auction.minimum_bid_amount} (Base)
                        {auction.reserve_price && ` | Reserve: €${auction.reserve_price} (Total)`}
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
              <FormControl fullWidth error={!!formErrors.booking_id}>
                <InputLabel>Select Booking</InputLabel>
                <Select
                  value={formData.booking_id}
                  onChange={(e) => handleBookingSelection(e.target.value)}
                  label="Select Booking"
                  disabled={bookingsLoading}
                >
                  {Array.isArray(bookings) && bookings.map((booking) => (
                    <MenuItem key={booking.id} value={booking.id}>
                      {booking.booking_reference} - {booking.passenger_name} ({booking.pickup_address} → {booking.dropoff_address})
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.booking_id && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {formErrors.booking_id}
                  </Typography>
                )}
                {bookingsLoading && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                    Loading bookings...
                  </Typography>
                )}
              </FormControl>
            </Grid>
            {/* Show selected booking pricing information */}
            {selectedBooking && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="subtitle2" gutterBottom>
                    Booking Amount: €{selectedBooking.total_amount}
                  </Typography>
                </Alert>
              </Grid>
            )}
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
            {/* Show selected booking pricing information */}
            {selectedBooking && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="subtitle2" gutterBottom>
                    Booking Amount: €{selectedBooking.total_amount}
                  </Typography>
                </Alert>
              </Grid>
            )}
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
                  <Typography variant="body2"><strong>Minimum Bid:</strong> €{selectedAuction.minimum_bid_amount} (Booking Base)</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Reserve Price:</strong> €{selectedAuction.reserve_price || 'None'} (Booking Total)</Typography>
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

      {/* Bids Dialog - Full Implementation */}
      <Dialog open={openBidsDialog} onClose={() => setOpenBidsDialog(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Auction Bids - {selectedAuction?.auction_reference}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="textSecondary">
                {bids.length} bids received
              </Typography>
              <IconButton onClick={() => setOpenBidsDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAuction && (
            <Box mb={3}>
              {/* Auction Summary */}
              <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">Route</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedAuction.booking?.pickup_location} → {selectedAuction.booking?.dropoff_location}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">Customer</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedAuction.booking?.customer_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">Minimum Bid (Base Amount)</Typography>
                      <Typography variant="body1" fontWeight="medium" color="primary">
                        €{selectedAuction.minimum_bid_amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">Status</Typography>
                      <Chip 
                        label={selectedAuction.status.charAt(0).toUpperCase() + selectedAuction.status.slice(1)}
                        color={getStatusColor(selectedAuction.status) as any}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Bids Table */}
              {bidsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : bids.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No bids have been placed for this auction yet.
                </Alert>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Company & Bidder</TableCell>
                        <TableCell>Bid Amount</TableCell>
                        <TableCell>Proposed Resources</TableCell>
                        <TableCell>Additional Services</TableCell>
                        <TableCell>Completion Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bids.map((bid) => (
                        <TableRow 
                          key={bid.id}
                          sx={{ 
                            bgcolor: bid.bid_amount === Math.max(...bids.map(b => b.bid_amount)) 
                              ? 'success.50' 
                              : 'inherit' 
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {/* @ts-ignore */}
                                {bid.company?.company_name || 'Unknown Company'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" display="flex" alignItems="center">
                                <Person fontSize="small" sx={{ mr: 0.5 }} />
                                {/* @ts-ignore */}
                                {bid.bidder?.first_name} {bid.bidder?.last_name || bid.bidder?.email}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" display="flex" alignItems="center">
                                <Email fontSize="small" sx={{ mr: 0.5 }} />
                                {bid.bidder?.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography 
                                variant="h6" 
                                color={bid.bid_amount === Math.max(...bids.map(b => b.bid_amount)) ? 'success.main' : 'primary'}
                                fontWeight="bold"
                              >
                                €{bid.bid_amount}
                              </Typography>
                              {bid.bid_amount === Math.max(...bids.map(b => b.bid_amount)) && (
                                <Chip label="Highest" color="success" size="small" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              {bid.proposed_driver && (
                                <Typography variant="body2" display="flex" alignItems="center" mb={0.5}>
                                  <Person fontSize="small" sx={{ mr: 0.5 }} />
                                  {bid.proposed_driver.user?.first_name} {bid.proposed_driver.user?.last_name}
                                  {bid.proposed_driver.average_rating && (
                                    <Box display="flex" alignItems="center" ml={1}>
                                      <Star fontSize="small" color="warning" />
                                      <Typography variant="caption">{bid.proposed_driver.average_rating}</Typography>
                                    </Box>
                                  )}
                                </Typography>
                              )}
                              {bid.proposed_car && (
                                <Typography variant="body2" display="flex" alignItems="center">
                                  <DirectionsCar fontSize="small" sx={{ mr: 0.5 }} />
                                  {bid.proposed_car.make} {bid.proposed_car.model}
                                  <Typography variant="caption" color="textSecondary" ml={1}>
                                    ({bid.proposed_car.license_plate})
                                  </Typography>
                                </Typography>
                              )}
                              {!bid.proposed_driver && !bid.proposed_car && (
                                <Typography variant="caption" color="textSecondary">
                                  No specific resources proposed
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              {bid.additional_services && Array.isArray(bid.additional_services) && bid.additional_services.length > 0 ? (
                                <Box>
                                  {bid.additional_services.map((service, index) => (
                                    <Chip 
                                      key={index} 
                                      label={service} 
                                      size="small" 
                                      variant="outlined" 
                                      sx={{ mr: 0.5, mb: 0.5 }}
                                    />
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="caption" color="textSecondary">
                                  No additional services
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {bid.estimated_completion_time ? (
                              <Typography variant="body2" display="flex" alignItems="center">
                                <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                                {new Date(bid.estimated_completion_time).toLocaleString()}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="textSecondary">
                                Not specified
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                              color={
                                bid.status === 'active' ? 'primary' :
                                bid.status === 'accepted' ? 'success' :
                                bid.status === 'rejected' ? 'error' : 'warning'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              {selectedAuction.status === 'closed' && bid.status === 'active' && (
                                <Tooltip title="Award to this bidder">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => awardAuctionToBid(bid)}
                                    disabled={awardingBid}
                                  >
                                    <EmojiEvents />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="View bid details">
                                <IconButton size="small" onClick={() => {
                                  setSelectedBid(bid)
                                  setOpenBidDetailDialog(true)
                                }}>
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box>
              {selectedAuction?.status === 'closed' && bids.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  Select "Award" next to a bid to award the auction to that company
                </Typography>
              )}
            </Box>
            <Button onClick={() => setOpenBidsDialog(false)}>
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Award Dialog - Full Implementation */}
      <Dialog open={openAwardDialog} onClose={() => setOpenAwardDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Award Auction - {selectedAuction?.auction_reference}
            </Typography>
            <IconButton onClick={() => setOpenAwardDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAuction && (
            <Box>
              {/* Auction Summary */}
              <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Route</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedAuction.booking?.pickup_location} → {selectedAuction.booking?.dropoff_location}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Customer</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedAuction.booking?.customer_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Total Bids</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {bids.length} companies participated
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Award Candidates */}
              {bidsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : bids.length === 0 ? (
                <Alert severity="warning">
                  No bids available for this auction. Cannot award without bids.
                </Alert>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Select Winning Bid
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Click "Award" next to the bid you want to select as the winner. This will close the auction and notify the winning company.
                  </Alert>
                  
                  <Grid container spacing={2}>
                    {bids
                      .filter(bid => bid.status === 'active')
                      .sort((a, b) => b.bid_amount - a.bid_amount)
                      .map((bid, index) => (
                        <Grid item xs={12} key={bid.id}>
                          <Card 
                            sx={{ 
                              border: index === 0 ? '2px solid' : '1px solid',
                              borderColor: index === 0 ? 'success.main' : 'grey.300',
                              bgcolor: index === 0 ? 'success.50' : 'inherit'
                            }}
                          >
                            <CardContent>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box flex={1}>
                                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                                    <Typography variant="h6">
                                      {bid.company?.company_name || 'Unknown Company'}
                                    </Typography>
                                    {index === 0 && (
                                      <Chip label="Highest Bid" color="success" size="small" />
                                    )}
                                    <Typography variant="h5" color="primary" fontWeight="bold">
                                      €{bid.bid_amount}
                                    </Typography>
                                  </Box>
                                  
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="body2" color="textSecondary">Proposed Resources:</Typography>
                                      {bid.proposed_driver && (
                                        <Typography variant="body2">
                                          Driver: {bid.proposed_driver.user?.first_name} {bid.proposed_driver.user?.last_name}
                                          {bid.proposed_driver.average_rating && ` (⭐ ${bid.proposed_driver.average_rating})`}
                                        </Typography>
                                      )}
                                      {bid.proposed_car && (
                                        <Typography variant="body2">
                                          Vehicle: {bid.proposed_car.make} {bid.proposed_car.model} ({bid.proposed_car.license_plate})
                                        </Typography>
                                      )}
                                      {!bid.proposed_driver && !bid.proposed_car && (
                                        <Typography variant="body2" color="textSecondary">
                                          No specific resources proposed
                                        </Typography>
                                      )}
                                    </Grid>
                                    
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="body2" color="textSecondary">Additional Services:</Typography>
                                      {bid.additional_services && Array.isArray(bid.additional_services) && bid.additional_services.length > 0 ? (
                                        <Box>
                                          {bid.additional_services.map((service, idx) => (
                                            <Chip key={idx} label={service} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                          ))}
                                        </Box>
                                      ) : (
                                        <Typography variant="body2" color="textSecondary">
                                          None specified
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                  
                                  {bid.notes && (
                                    <Box mt={1}>
                                      <Typography variant="body2" color="textSecondary">Notes:</Typography>
                                      <Typography variant="body2">{bid.notes}</Typography>
                                    </Box>
                                  )}
                                </Box>
                                
                                <Box ml={2}>
                                  <Button
                                    variant={index === 0 ? "contained" : "outlined"}
                                    color="success"
                                    size="large"
                                    startIcon={<EmojiEvents />}
                                    onClick={() => awardAuctionToBid(bid)}
                                    disabled={awardingBid}
                                    sx={{ minWidth: 120 }}
                                  >
                                    {awardingBid ? <CircularProgress size={20} /> : 'Award'}
                                  </Button>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAwardDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bid Detail Dialog */}
      <Dialog open={openBidDetailDialog} onClose={() => setOpenBidDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Bid Details
            </Typography>
            <IconButton onClick={() => setOpenBidDetailDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBid && (
            <Box>
              {/* Company Information */}
              <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Company Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Company</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedBid.company?.company_name || 'Unknown Company'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Bidder Name</Typography>
                      <Typography variant="body1">
                        {selectedBid.bidder?.first_name} {selectedBid.bidder?.last_name || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Contact Email</Typography>
                      <Typography variant="body1">
                        {selectedBid.bidder?.email || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Bid Information */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Bid Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Bid Amount</Typography>
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        €{selectedBid.bid_amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Bid Status</Typography>
                      <Chip
                        label={selectedBid.status.charAt(0).toUpperCase() + selectedBid.status.slice(1)}
                        color={
                          selectedBid.status === 'active' ? 'primary' :
                          selectedBid.status === 'accepted' ? 'success' :
                          selectedBid.status === 'rejected' ? 'error' : 'warning'
                        }
                        size="medium"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Bid Reference</Typography>
                      <Typography variant="body1">
                        {selectedBid.bid_reference}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Submitted On</Typography>
                      <Typography variant="body1">
                        {new Date(selectedBid.created_at).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Proposed Resources */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Proposed Resources</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Proposed Driver</Typography>
                      {selectedBid.proposed_driver ? (
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedBid.proposed_driver.user?.first_name} {selectedBid.proposed_driver.user?.last_name}
                          </Typography>
                          {selectedBid.proposed_driver.average_rating && (
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <Star fontSize="small" color="warning" />
                              <Typography variant="body2" ml={0.5}>
                                {selectedBid.proposed_driver.average_rating} rating
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          No specific driver proposed
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Proposed Vehicle</Typography>
                      {selectedBid.proposed_car ? (
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedBid.proposed_car.make} {selectedBid.proposed_car.model}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            License Plate: {selectedBid.proposed_car.license_plate}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          No specific vehicle proposed
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Estimated Completion Time</Typography>
                      {selectedBid.estimated_completion_time ? (
                        <Typography variant="body1">
                          {new Date(selectedBid.estimated_completion_time).toLocaleString()}
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          Not specified
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Additional Services & Notes */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Additional Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Additional Services</Typography>
                      {selectedBid.additional_services && Array.isArray(selectedBid.additional_services) && selectedBid.additional_services.length > 0 ? (
                        <Box mt={1}>
                          {selectedBid.additional_services.map((service, index) => (
                            <Chip 
                              key={index} 
                              label={service} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          No additional services specified
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Notes</Typography>
                      {selectedBid.notes ? (
                        <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          {selectedBid.notes}
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          No notes provided
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBidDetailDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AuctionManagement