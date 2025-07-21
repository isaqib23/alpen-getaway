// @ts-nocheck
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Divider,
  Alert,
  LinearProgress,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material'
import {
  Gavel,
  Schedule,
  Euro,
  Visibility,
  Timer,
  CheckCircle,
  Cancel,
  Refresh,
  LocalShipping,
  Person,
  AttachMoney,
} from '@mui/icons-material'
import { auctionsApi, Auction, AuctionBid, CreateBidData } from '../../api/auctions'
import { useCars } from '../../hooks/useCars'
import { useDrivers } from '../../hooks/useDrivers'



const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <Timer />
    case 'PENDING':
      return <Schedule />
    case 'WON':
      return <CheckCircle />
    case 'LOST':
      return <Cancel />
    default:
      return <Gavel />
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auction-tabpanel-${index}`}
      aria-labelledby={`auction-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const PartnerAuctions = () => {
  // State management
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  
  // Form state for bidding
  const [bidFormData, setBidFormData] = useState<CreateBidData>({
    auction_id: '',
    bid_amount: 0,
    estimated_completion_time: '',
    additional_services: '',
    notes: '',
    proposed_driver_id: '',
    proposed_car_id: ''
  })
  
  // Data state
  const [availableAuctions, setAvailableAuctions] = useState<Auction[]>([])
  const [myBids, setMyBids] = useState<AuctionBid[]>([])
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([])
  
  // Use the drivers hook
  const { data: driversData, loading: driversLoading, refetch: refetchDrivers, updateFilters } = useDrivers()
  
  // Handle different response structures for drivers data
  const drivers = (() => {
    if (driversData?.data?.data && Array.isArray(driversData.data.data)) {
      return driversData.data.data
    } else if (driversData?.data && Array.isArray(driversData.data)) {
      return driversData.data
    } else if (Array.isArray(driversData)) {
      return driversData
    }
    return []
  })()
  
  // Use the cars hook
  const { cars, loading: carsLoading, fetchCars } = useCars()
  
  // Debug drivers data
  console.log('Drivers data from hook:', driversData)
  console.log('Drivers array:', drivers)
  console.log('Drivers array length:', drivers.length)
  console.log('Drivers loading:', driversLoading)
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [bidLoading, setBidLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  // Error and success handling
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Get current user's company ID from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
  
  const user = getCurrentUser()
  // Use same company ID extraction as FleetDrivers page
  const companyId = user?.company_id || user?.company?.id
  
  // Debug company ID extraction
  console.log('Auctions - user:', user)
  console.log('Auctions - companyId:', companyId)
  console.log('Available user properties:', user ? Object.keys(user) : 'No user')
  
  // Debug logging
  console.log('Current user:', user)
  console.log('Company ID found:', companyId)

  // Data fetching functions
  const fetchAvailableAuctions = async () => {
    try {
      console.log('Fetching available auctions...')
      const response = await auctionsApi.getAuctions({ status: 'active', limit: 50 })
      console.log('Available auctions response:', response)
      setAvailableAuctions(response.data || [])
    } catch (err: any) {
      console.error('Failed to fetch available auctions:', err)
      setAvailableAuctions([])
      setError('Failed to fetch available auctions: ' + (err.message || 'Unknown error'))
    }
  }
  
  const fetchMyBids = async () => {
    if (!companyId) {
      console.log('No company ID, skipping fetchMyBids')
      return
    }
    try {
      console.log('Fetching company bids for companyId:', companyId)
      const response = await auctionsApi.getCompanyBids(companyId, { limit: 50 })
      console.log('Company bids response:', response)
      setMyBids(response.data || [])
    } catch (err: any) {
      console.error('Failed to fetch company bids:', err)
      setMyBids([])
      setError('Failed to fetch your bids: ' + (err.message || 'Unknown error'))
    }
  }
  
  const fetchWonAuctions = async () => {
    if (!companyId) return
    try {
      const response = await auctionsApi.getAuctions({ 
        status: 'awarded', 
        limit: 50 
      })
      // Handle both old and new response structures
      const auctionsData = response.data || []
      // Filter to only show auctions won by this company
      const wonByCompany = auctionsData.filter(auction => auction.winner_company_id === companyId)
      setWonAuctions(wonByCompany)
    } catch (err: any) {
      setWonAuctions([])
      setError('Failed to fetch won auctions')
    }
  }
  
  const fetchCompanyResources = async () => {
    if (!companyId) {
      console.log('No companyId found, skipping resource fetch')
      return
    }
    try {
      console.log('Fetching company resources for companyId:', companyId)
      
      // Fetch cars with company filter using the same hook as FleetCars page
      await fetchCars({ status: 'active', limit: 100, companyId })
      
      // Drivers are fetched by the useDrivers hook
      refetchDrivers()
    } catch (err: any) {
      console.error('Failed to fetch company resources:', err)
      setError('Failed to fetch company resources')
    }
  }
  
  const loadAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Trigger drivers fetch
      refetchDrivers()
      
      await Promise.all([
        fetchAvailableAuctions(),
        fetchMyBids(),
        fetchWonAuctions(),
        fetchCompanyResources()
      ])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const refreshData = async () => {
    setRefreshing(true)
    try {
      // Refresh all data sources
      refetchDrivers()
      fetchCars({ status: 'active', limit: 100, companyId })
      
      await Promise.all([
        fetchAvailableAuctions(),
        fetchMyBids(),
        fetchWonAuctions()
      ])
    } catch (err) {
      console.error('Error refreshing data:', err)
    } finally {
      setRefreshing(false)
    }
  }
  

  // Effect to load initial data when companyId changes
  useEffect(() => {
    console.log('useEffect triggered, companyId:', companyId)
    console.log('User object:', user)
    
    if (companyId) {
      setLoading(true)
      setError(null)
      
      // Load auction data
      Promise.all([
        fetchAvailableAuctions(),
        fetchMyBids(),
        fetchWonAuctions()
      ]).finally(() => setLoading(false))
      
      // Load company resources separately
      if (updateFilters) {
        updateFilters({
          status: 'active',
          limit: 100,
          companyId: companyId
        })
      }
      fetchCars({ status: 'active', limit: 100, companyId })
    } else {
      // For now, let's still load available auctions even without company ID
      // and show a warning instead of blocking everything
      console.warn('No company ID found, loading available auctions only')
      setLoading(true)
      fetchAvailableAuctions().finally(() => setLoading(false))
      
      if (!user) {
        setError('User not logged in. Please log in again.')
      } else {
        console.log('User structure:', JSON.stringify(user, null, 2))
        setError('Company information not found in user profile. Available user properties: ' + Object.keys(user).join(', '))
      }
    }
  }, [companyId]) // Only depend on companyId to avoid infinite loops
  
  // Auto-refresh every 30 seconds for active auctions
  useEffect(() => {
    const interval = setInterval(() => {
      if (tabValue === 0) { // Only refresh if on available auctions tab
        fetchAvailableAuctions()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [tabValue])
  
  // Bid management functions
  const getMyBidForAuction = (auctionId: string) => {
    return myBids.find(bid => bid.auction_id === auctionId && bid.status === 'active')
  }
  
  const handlePlaceBid = (auction: Auction) => {
    const existingBid = getMyBidForAuction(auction.id)
    setSelectedAuction(auction)
    setBidFormData({
      auction_id: auction.id,
      bid_amount: existingBid?.bid_amount || auction.minimum_bid_amount,
      estimated_completion_time: existingBid?.estimated_completion_time || '',
      // Convert array back to comma-separated string for form display
      additional_services: existingBid?.additional_services 
        ? (Array.isArray(existingBid.additional_services) 
           ? existingBid.additional_services.join(', ') 
           : existingBid.additional_services) 
        : '',
      notes: existingBid?.notes || '',
      proposed_driver_id: existingBid?.proposed_driver_id || '',
      proposed_car_id: existingBid?.proposed_car_id || ''
    })
    setBidDialogOpen(true)
  }
  
  const handleSubmitBid = async () => {
    if (!selectedAuction) return
    
    if (!companyId) {
      setError('Company information is required to place bids. Please contact support.')
      return
    }
    
    setBidLoading(true)
    setError(null)
    
    try {
      const existingBid = getMyBidForAuction(selectedAuction.id)
      
      // Transform the form data to match server expectations
      const submitData = {
        ...bidFormData,
        // Convert additional_services from string to array of strings
        additional_services: bidFormData.additional_services 
          ? bidFormData.additional_services.split(',').map(service => service.trim()).filter(service => service.length > 0)
          : []
      }
      
      if (existingBid) {
        // Update existing bid
        await auctionsApi.updateBid(existingBid.id, submitData)
        setSuccess('Bid updated successfully!')
      } else {
        // Create new bid
        await auctionsApi.createBid(submitData)
        setSuccess('Bid placed successfully!')
      }
      
      // Refresh data
      await Promise.all([fetchMyBids(), fetchAvailableAuctions()])
      
      handleCloseBidDialog()
    } catch (err: any) {
      console.error('Bid submission error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to place bid')
    } finally {
      setBidLoading(false)
    }
  }
  
  const handleWithdrawBid = async (bidId: string) => {
    try {
      await auctionsApi.withdrawBid(bidId)
      setSuccess('Bid withdrawn successfully!')
      await fetchMyBids()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to withdraw bid')
    }
  }
  
  const handleCloseBidDialog = () => {
    setBidDialogOpen(false)
    setSelectedAuction(null)
    setBidFormData({
      auction_id: '',
      bid_amount: 0,
      estimated_completion_time: '',
      additional_services: '',
      notes: '',
      proposed_driver_id: '',
      proposed_car_id: ''
    })
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Helper functions
  const formatTimeRemaining = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
  
  const getTimeLeftColor = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    const hours = diff / (1000 * 60 * 60)
    
    if (hours <= 2) return 'error'
    if (hours <= 6) return 'warning'
    return 'success'
  }
  
  const getTimeProgress = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    
    if (now < start) return 0
    if (now > end) return 100
    
    return ((now - start) / (end - start)) * 100
  }
  
  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary'
      case 'accepted': return 'success'
      case 'rejected': return 'error'
      case 'withdrawn': return 'warning'
      default: return 'default'
    }
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }
  
  // Close alerts after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Auction Bidding
        </Typography>
        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
          onClick={refreshData}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {/* Error and Success Alerts */}
      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={5000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Available Auctions
                  </Typography>
                  <Typography variant="h4">
                    {availableAuctions.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Gavel />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    My Active Bids
                  </Typography>
                  <Typography variant="h4">
                    {myBids.filter(b => b.status === 'active').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Won Auctions
                  </Typography>
                  <Typography variant="h4">
                    {wonAuctions.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(wonAuctions.reduce((sum, auction) => 
                      sum + (auction.highest_bid_amount || 0), 0))}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Euro />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Auction Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="auction tabs">
            <Tab
              label={
                <Badge badgeContent={availableAuctions.length} color="primary">
                  Available Auctions
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={myBids.length} color="warning">
                  My Bids
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={wonAuctions.length} color="success">
                  Won Auctions
                </Badge>
              }
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {availableAuctions.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Active Auctions Available
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Check back later for new bidding opportunities.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {availableAuctions.map((auction) => {
                const myBid = getMyBidForAuction(auction.id)
                const timeLeft = formatTimeRemaining(auction.auction_end_time)
                const timeColor = getTimeLeftColor(auction.auction_end_time)
                
                return (
                  <Grid item xs={12} md={6} lg={4} key={auction.id}>
                    <Card sx={{ height: '100%', position: 'relative' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" noWrap>
                            {auction.booking?.pickup_location} → {auction.booking?.dropoff_location}
                          </Typography>
                          <Chip
                            label={auction.status.toUpperCase()}
                            color="success"
                            size="small"
                            icon={<Timer />}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Ref:</strong> {auction.auction_reference}
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Pickup:</strong> {new Date(auction.booking?.pickup_time || '').toLocaleString()}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Customer:</strong> {auction.booking?.customer_name || 'N/A'}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Passengers:</strong> {auction.booking?.passenger_count || 1}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Vehicle:</strong> {auction.booking?.vehicle_category || 'Standard'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Current Highest
                            </Typography>
                            <Typography variant="h6" color="primary">
                              {auction.highest_bid_amount ? formatCurrency(auction.highest_bid_amount) : 'No bids'}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="body2" color="textSecondary">
                              Minimum Bid
                            </Typography>
                            <Typography variant="h6">
                              {formatCurrency(auction.minimum_bid_amount)}
                            </Typography>
                          </Box>
                        </Box>

                        {myBid && (
                          <Box mb={2}>
                            <Typography variant="body2" color="textSecondary">
                              My Bid
                            </Typography>
                            <Typography variant="body1" color="warning.main" fontWeight="bold">
                              {formatCurrency(myBid.bid_amount)}
                            </Typography>
                          </Box>
                        )}

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="body2" color="textSecondary">
                            {auction.bid_count || 0} bids
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color={`${timeColor}.main`}
                            fontWeight="bold"
                          >
                            {timeLeft} left
                          </Typography>
                        </Box>
                        
                        {/* Time progress bar */}
                        <LinearProgress 
                          variant="determinate" 
                          value={getTimeProgress(auction.auction_start_time, auction.auction_end_time)} 
                          color={timeColor as any}
                          sx={{ mb: 2 }}
                        />

                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handlePlaceBid(auction)}
                            startIcon={<Gavel />}
                            disabled={timeLeft === 'Expired'}
                          >
                            {myBid ? 'Update Bid' : 'Place Bid'}
                          </Button>
                          <Tooltip title="View Details">
                            <IconButton onClick={() => setSelectedAuction(auction)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {myBids.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Bids Placed Yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Start bidding on available auctions to see your bids here.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Auction</TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>My Bid</TableCell>
                    <TableCell>Current Highest</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Proposed Resources</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myBids.map((bid) => {
                    const auction = availableAuctions.find(a => a.id === bid.auction_id) ||
                                   wonAuctions.find(a => a.id === bid.auction_id)
                    if (!auction) return null
                    
                    return (
                      <TableRow key={bid.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {auction.auction_reference}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {auction.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {auction.booking?.pickup_location} → {auction.booking?.dropoff_location}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {auction.booking?.vehicle_category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(auction.booking?.pickup_time || '').toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(auction.booking?.pickup_time || '').toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {formatCurrency(bid.bid_amount)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(bid.created_at).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {auction.highest_bid_amount ? formatCurrency(auction.highest_bid_amount) : 'No bids'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {auction.bid_count || 0} total bids
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bid.status.toUpperCase()}
                            color={getBidStatusColor(bid.status) as any}
                            size="small"
                            icon={getStatusIcon(bid.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            {bid.proposed_driver && (
                              <Typography variant="caption" display="block">
                                <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {bid.proposed_driver.name}
                              </Typography>
                            )}
                            {bid.proposed_car && (
                              <Typography variant="caption" display="block">
                                <LocalShipping fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {bid.proposed_car.make} {bid.proposed_car.model}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" gap={1}>
                            {bid.status === 'active' && auction.status === 'active' && (
                              <>
                                <Tooltip title="Update Bid">
                                  <IconButton size="small" onClick={() => handlePlaceBid(auction)}>
                                    <Gavel />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Withdraw Bid">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleWithdrawBid(bid.id)}
                                  >
                                    <Cancel />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {wonAuctions.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Won Auctions Yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Keep bidding to win your first auction!
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Auction</TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Service Date</TableCell>
                    <TableCell>Winning Bid</TableCell>
                    <TableCell>Assigned Resources</TableCell>
                    <TableCell>Awarded Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wonAuctions.map((auction) => {
                    const winningBid = myBids.find(bid => 
                      bid.auction_id === auction.id && bid.status === 'accepted'
                    )
                    
                    return (
                      <TableRow key={auction.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {auction.auction_reference}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {auction.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {auction.booking?.pickup_location} → {auction.booking?.dropoff_location}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {auction.booking?.customer_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(auction.booking?.pickup_time || '').toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(auction.booking?.pickup_time || '').toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {winningBid ? formatCurrency(winningBid.bid_amount) : 
                             (auction.highest_bid_amount ? formatCurrency(auction.highest_bid_amount) : 'N/A')}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Final amount
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            {winningBid?.proposed_driver && (
                              <Typography variant="body2">
                                <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {winningBid.proposed_driver.name}
                              </Typography>
                            )}
                            {winningBid?.proposed_car && (
                              <Typography variant="caption" color="textSecondary" display="block">
                                <LocalShipping fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {winningBid.proposed_car.make} {winningBid.proposed_car.model}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {auction.awarded_at ? new Date(auction.awarded_at).toLocaleDateString() : 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {auction.awarded_at ? new Date(auction.awarded_at).toLocaleTimeString() : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="WON"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Card>

      {/* Enhanced Bid Dialog */}
      <Dialog open={bidDialogOpen} onClose={handleCloseBidDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {getMyBidForAuction(selectedAuction?.id || '') ? 'Update Bid' : 'Place Bid'} - {selectedAuction?.auction_reference}
        </DialogTitle>
        <DialogContent>
          {selectedAuction && (
            <Box>
              {/* Auction Info Section */}
              <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Route Details
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>From:</strong> {selectedAuction.booking?.pickup_location}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>To:</strong> {selectedAuction.booking?.dropoff_location}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Pickup:</strong> {new Date(selectedAuction.booking?.pickup_time || '').toLocaleString()}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Passengers:</strong> {selectedAuction.booking?.passenger_count || 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Bidding Info
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Current Highest:</strong> {selectedAuction.highest_bid_amount ? formatCurrency(selectedAuction.highest_bid_amount) : 'No bids'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Minimum Bid:</strong> {formatCurrency(selectedAuction.minimum_bid_amount)}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Total Bids:</strong> {selectedAuction.bid_count || 0}
                      </Typography>
                      <Typography variant="body2" gutterBottom color="warning.main">
                        <strong>Time Left:</strong> {formatTimeRemaining(selectedAuction.auction_end_time)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Bid Form */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bid Amount (€)"
                    type="number"
                    value={bidFormData.bid_amount}
                    onChange={(e) => setBidFormData({...bidFormData, bid_amount: parseFloat(e.target.value) || 0})}
                    inputProps={{ min: selectedAuction.minimum_bid_amount, step: 1 }}
                    error={bidFormData.bid_amount < selectedAuction.minimum_bid_amount}
                    helperText={bidFormData.bid_amount < selectedAuction.minimum_bid_amount ? 
                      `Minimum bid is ${formatCurrency(selectedAuction.minimum_bid_amount)}` : 
                      'Enter your competitive bid amount'}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Estimated Completion Time"
                    type="datetime-local"
                    value={bidFormData.estimated_completion_time}
                    onChange={(e) => setBidFormData({...bidFormData, estimated_completion_time: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    helperText="When you estimate to complete the service"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Proposed Driver</InputLabel>
                    <Select
                      value={bidFormData.proposed_driver_id}
                      onChange={(e) => setBidFormData({...bidFormData, proposed_driver_id: e.target.value})}
                      label="Proposed Driver"
                    >
                      <MenuItem value="">No specific driver</MenuItem>
                      {Array.isArray(drivers) && drivers.map((driver) => (
                        <MenuItem key={driver.id} value={driver.id}>
                          {driver.user?.first_name} {driver.user?.last_name} {driver.average_rating && `(⭐ ${driver.average_rating})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Proposed Vehicle</InputLabel>
                    <Select
                      value={bidFormData.proposed_car_id}
                      onChange={(e) => setBidFormData({...bidFormData, proposed_car_id: e.target.value})}
                      label="Proposed Vehicle"
                    >
                      <MenuItem value="">No specific vehicle</MenuItem>
                      {Array.isArray(cars) && cars.map((car) => (
                        <MenuItem key={car.id} value={car.id}>
                          {car.make} {car.model} ({car.license_plate})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Services"
                    multiline
                    rows={2}
                    value={bidFormData.additional_services}
                    onChange={(e) => setBidFormData({...bidFormData, additional_services: e.target.value})}
                    placeholder="e.g., Child seats, Wi-Fi, refreshments, airport meet & greet"
                    helperText="Separate multiple services with commas (e.g., Child seats, Wi-Fi, refreshments)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={bidFormData.notes}
                    onChange={(e) => setBidFormData({...bidFormData, notes: e.target.value})}
                    placeholder="Any special notes or comments about your bid"
                    helperText="Optional notes for the customer or auction administrator"
                  />
                </Grid>
              </Grid>

              {/* Warning for time */}
              {formatTimeRemaining(selectedAuction.auction_end_time) !== 'Expired' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <Timer sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Time remaining: {formatTimeRemaining(selectedAuction.auction_end_time)}
                  </Typography>
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBidDialog} disabled={bidLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitBid}
            variant="contained"
            disabled={bidLoading || !bidFormData.bid_amount || bidFormData.bid_amount < (selectedAuction?.minimum_bid_amount || 0)}
            startIcon={bidLoading ? <CircularProgress size={16} /> : <AttachMoney />}
          >
            {bidLoading ? 'Processing...' : (getMyBidForAuction(selectedAuction?.id || '') ? 'Update Bid' : 'Place Bid')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PartnerAuctions