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
  IconButton,
  TextField,
  LinearProgress,
  Tooltip,
  Badge,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import {
  Search,
  Visibility,
  Gavel,
  Stop,
  LocalOffer,
  Refresh,
  Assignment,
} from '@mui/icons-material'
import { useAuctions, useAuctionActions } from '../../hooks/useAuctions'
import { useToast } from '../../hooks/useToast'
import {AuctionFilters } from '../../api/auctions'


const ActiveAuctions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  // API integration - only fetch active auctions
  const [filters, setFilters] = useState<AuctionFilters>({
    status: 'active',
    page: 1,
    limit: 50
  })
  
  const { auctions, loading, error, refetch } = useAuctions(filters)
  const { 
    loading: actionLoading, 
    closeAuction, 
  } = useAuctionActions()
  const { success, error: showError } = useToast()

  const formatTimeRemaining = (auctionEndTime: string) => {
    const now = new Date()
    const endTime = new Date(auctionEndTime)
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getTimeProgress = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    
    if (now < start) return 0
    if (now > end) return 100
    
    return ((now - start) / (end - start)) * 100
  }

  const getUrgencyColor = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const hoursRemaining = (end.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (hoursRemaining < 1) return 'error'
    if (hoursRemaining < 6) return 'warning'
    return 'success'
  }

  const handleCloseAuction = async (auctionId: string) => {
    try {
      await closeAuction(auctionId)
      success('Auction closed successfully')
      refetch() // Refresh the list
    } catch (error: any) {
      showError(error.message || 'Failed to close auction')
    }
  }

  // const handleAwardAuction = async (auctionId: string, bidId: string) => {
  //   try {
  //     await awardAuction(auctionId, bidId)
  //     success('Auction awarded successfully')
  //     refetch() // Refresh the list
  //   } catch (error: any) {
  //     showError(error.message || 'Failed to award auction')
  //   }
  // }

  // Update filters when search term changes
  useEffect(() => {
    const newFilters: AuctionFilters = {
      status: 'active',
      page: 1,
      limit: 50
    }
    
    if (searchTerm.trim()) {
      newFilters.search = searchTerm.trim()
    }
    
    setFilters(newFilters)
  }, [searchTerm])

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
        <Typography variant="h4">Active Auctions</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refetch}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {filteredAuctions.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">Active Auctions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {filteredAuctions.filter(a => {
                  const hoursRemaining = (new Date(a.auction_end_time).getTime() - new Date().getTime()) / (1000 * 60 * 60)
                  return hoursRemaining < 6
                }).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">Ending Soon</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {filteredAuctions.reduce((sum, auction) => sum + (auction.bid_count || 0), 0)}
              </Typography>
              <Typography variant="body2" color="textSecondary">Total Bids</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                €{filteredAuctions
                  .filter(a => a.highest_bid_amount)
                  .reduce((sum, auction, _, arr) => sum + (auction.highest_bid_amount || 0) / arr.length, 0)
                  .toFixed(0)}
              </Typography>
              <Typography variant="body2" color="textSecondary">Avg Highest Bid</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search active auctions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      {/* Active Auctions Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Auction Details</TableCell>
                <TableCell>Customer & Route</TableCell>
                <TableCell>Bidding Activity</TableCell>
                <TableCell>Time Remaining</TableCell>
                <TableCell>Progress</TableCell>
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
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          Highest: €{auction.highest_bid_amount}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color={`${getUrgencyColor(auction.auction_end_time)}.main`}
                        fontWeight="bold"
                      >
                        {formatTimeRemaining(auction.auction_end_time)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Ends: {new Date(auction.auction_end_time).toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box width={100}>
                      <LinearProgress 
                        variant="determinate" 
                        value={getTimeProgress(auction.auction_start_time, auction.auction_end_time)} 
                        color={getUrgencyColor(auction.auction_end_time)}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {getTimeProgress(auction.auction_start_time, auction.auction_end_time).toFixed(0)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="View Bids">
                        <IconButton 
                          size="small" 
                          color="primary"
                          disabled={!auction.bid_count}
                        >
                          <Badge badgeContent={auction.bid_count} color="secondary">
                            <LocalOffer />
                          </Badge>
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Close Auction">
                        <IconButton 
                          size="small" 
                          color="warning" 
                          onClick={() => handleCloseAuction(auction.id)}
                          disabled={actionLoading}
                        >
                          <Stop />
                        </IconButton>
                      </Tooltip>

                      {auction.bid_count && (
                        <Tooltip title="Award Winner">
                          <IconButton 
                            size="small" 
                            color="success"
                          >
                            <Assignment />
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
        
        {filteredAuctions.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="textSecondary">
              No active auctions found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {searchTerm ? 'Try adjusting your search terms' : 'All auctions have ended or are in draft status'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ActiveAuctions