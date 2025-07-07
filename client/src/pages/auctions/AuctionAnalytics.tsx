import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import {
  Refresh,
  TrendingUp,
  Assessment,
  Gavel,
  Timer,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import { useAuctions, useAuctionStats } from '../../hooks/useAuctions'
import { AuctionFilters } from '../../api/auctions'


const AuctionAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30')
  
  // API integration
  const [filters, setFilters] = useState<AuctionFilters>({
    page: 1,
    limit: 100 // Get more data for analytics
  })
  
  const { auctions, loading, error, refetch } = useAuctions(filters)
  const { stats, loading: statsLoading } = useAuctionStats()

  // Calculate analytics data from API response
  const analytics = {
    totalAuctions: auctions.length,
    activeAuctions: auctions.filter(a => a.status === 'active').length,
    closedAuctions: auctions.filter(a => a.status === 'closed').length,
    awardedAuctions: auctions.filter(a => a.status === 'awarded').length,
    cancelledAuctions: auctions.filter(a => a.status === 'cancelled').length,
    totalBids: auctions.reduce((sum, auction) => sum + (auction.bid_count || 0), 0),
    averageBidsPerAuction: auctions.length > 0 ? auctions.reduce((sum, auction) => sum + (auction.bid_count || 0), 0) / auctions.length : 0,
    successRate: auctions.length > 0 ? (auctions.filter(a => a.status === 'awarded').length / auctions.filter(a => a.status !== 'draft').length) * 100 : 0,
    averageAuctionValue: auctions.filter(a => a.highest_bid_amount).length > 0 
      ? auctions.filter(a => a.highest_bid_amount).reduce((sum, auction) => sum + (auction.highest_bid_amount || 0), 0) / auctions.filter(a => a.highest_bid_amount).length 
      : 0,
  }

  // Performance by status
  const statusBreakdown = [
    { status: 'Active', count: analytics.activeAuctions, percentage: analytics.totalAuctions > 0 ? (analytics.activeAuctions / analytics.totalAuctions) * 100 : 0, color: 'success' },
    { status: 'Closed', count: analytics.closedAuctions, percentage: analytics.totalAuctions > 0 ? (analytics.closedAuctions / analytics.totalAuctions) * 100 : 0, color: 'warning' },
    { status: 'Awarded', count: analytics.awardedAuctions, percentage: analytics.totalAuctions > 0 ? (analytics.awardedAuctions / analytics.totalAuctions) * 100 : 0, color: 'info' },
    { status: 'Cancelled', count: analytics.cancelledAuctions, percentage: analytics.totalAuctions > 0 ? (analytics.cancelledAuctions / analytics.totalAuctions) * 100 : 0, color: 'error' },
  ]

  // Top performing auctions (by bid count)
  const topAuctions = auctions
    .filter(a => a.bid_count && a.bid_count > 0)
    .sort((a, b) => (b.bid_count || 0) - (a.bid_count || 0))
    .slice(0, 10)

  const handleRefresh = () => {
    refetch()
  }

  // Update filters when time range changes (this could be enhanced to filter by date)
  useEffect(() => {
    // For now, we'll just set the limit based on time range
    // In a real implementation, you'd filter by date range
    const limit = timeRange === '7' ? 50 : timeRange === '30' ? 100 : timeRange === '90' ? 200 : 500
    setFilters({
      page: 1,
      limit
    })
  }, [timeRange])

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
        <Typography variant="h4">Auction Analytics</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment color="primary" sx={{ fontSize: 40, mb: 1 }} />
              {statsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  <Typography variant="h4" color="primary.main">
                    {stats?.total_auctions || analytics.totalAuctions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Total Auctions</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Gavel color="info" sx={{ fontSize: 40, mb: 1 }} />
              {statsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  <Typography variant="h4" color="info.main">
                    {stats?.total_bids || analytics.totalBids}
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
              <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
              {statsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  <Typography variant="h4" color="success.main">
                    {stats?.success_rate?.toFixed(1) || analytics.successRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Success Rate</Typography>
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
                    €{stats?.average_bid_amount?.toFixed(0) || analytics.averageAuctionValue.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Avg. Value</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Analytics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Status Breakdown</Typography>
            <Divider sx={{ mb: 2 }} />
            {statusBreakdown.map((item) => (
              <Box key={item.status} mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">{item.status}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: '100%', 
                  height: 8, 
                  bgcolor: 'grey.200', 
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ 
                      width: `${item.percentage}%`, 
                      height: '100%', 
                      bgcolor: `${item.color}.main`,
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h5" color="primary.main">
                    {analytics.averageBidsPerAuction.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Bids per Auction
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h5" color="success.main">
                    {analytics.activeAuctions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Currently Active
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h5" color="info.main">
                    {analytics.awardedAuctions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Successfully Awarded
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h5" color="error.main">
                    {analytics.cancelledAuctions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cancelled
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Performing Auctions */}
      <Paper sx={{ mb: 3 }}>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>Top Performing Auctions</Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Auctions with the highest number of bids
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Auction Reference</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Bid Count</TableCell>
                <TableCell>Highest Bid</TableCell>
                <TableCell>Success</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {auction.auction_reference}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {auction.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={
                        auction.status === 'awarded' ? 'success.main' :
                        auction.status === 'active' ? 'info.main' :
                        auction.status === 'cancelled' ? 'error.main' : 'warning.main'
                      }
                      fontWeight="bold"
                    >
                      {auction.status.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {auction.bid_count}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {auction.highest_bid_amount ? `€${auction.highest_bid_amount}` : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {auction.status === 'awarded' ? (
                      <CheckCircle color="success" />
                    ) : auction.status === 'cancelled' ? (
                      <Cancel color="error" />
                    ) : auction.status === 'active' ? (
                      <Timer color="info" />
                    ) : (
                      <Typography variant="body2" color="textSecondary">Pending</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {topAuctions.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="textSecondary">
              No auction data available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Start creating auctions to see performance analytics
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default AuctionAnalytics