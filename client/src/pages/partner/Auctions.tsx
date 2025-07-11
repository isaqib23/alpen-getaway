import React, { useState } from 'react'
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
} from '@mui/material'
import {
  Gavel,
  Schedule,
  Euro,
  Visibility,
  Timer,
  CheckCircle,
  Cancel,
  Warning,
} from '@mui/icons-material'

// Sample data - will be replaced with real API calls
const auctionsData = {
  available: [
    {
      id: 'A001',
      route: 'Salzburg → Munich',
      pickup: 'Salzburg Airport',
      dropoff: 'Munich Airport',
      date: '2024-01-16',
      time: '14:30',
      estimatedAmount: 180,
      currentBid: 165,
      myBid: null,
      bidCount: 3,
      timeLeft: '2h 45m',
      status: 'ACTIVE',
      distance: '140 km',
      duration: '1h 45m',
      customer: 'Business Travel GmbH',
      requirements: 'Premium vehicle, English-speaking driver',
      endTime: '2024-01-15T16:00:00Z',
    },
    {
      id: 'A002',
      route: 'Innsbruck → Zurich',
      pickup: 'Innsbruck City Center',
      dropoff: 'Zurich Airport',
      date: '2024-01-17',
      time: '09:00',
      estimatedAmount: 250,
      currentBid: 230,
      myBid: 235,
      bidCount: 5,
      timeLeft: '1d 5h',
      status: 'ACTIVE',
      distance: '280 km',
      duration: '3h 30m',
      customer: 'Alpine Tours AG',
      requirements: 'Luxury vehicle, Swiss highway vignette',
      endTime: '2024-01-16T08:00:00Z',
    },
    {
      id: 'A003',
      route: 'Vienna → Bratislava',
      pickup: 'Vienna International Airport',
      dropoff: 'Bratislava City Center',
      date: '2024-01-18',
      time: '11:00',
      estimatedAmount: 120,
      currentBid: 105,
      myBid: null,
      bidCount: 2,
      timeLeft: '6h 20m',
      status: 'ACTIVE',
      distance: '80 km',
      duration: '1h 15m',
      customer: 'Corporate Solutions Ltd',
      requirements: 'Standard vehicle, border crossing documents',
      endTime: '2024-01-15T17:00:00Z',
    },
  ],
  myBids: [
    {
      id: 'A004',
      route: 'Graz → Vienna',
      pickup: 'Graz Airport',
      dropoff: 'Vienna City Center',
      date: '2024-01-15',
      time: '16:00',
      estimatedAmount: 160,
      myBid: 145,
      currentBid: 140,
      bidCount: 4,
      status: 'LOST',
      distance: '200 km',
      duration: '2h 30m',
      customer: 'Executive Travel',
      bidTime: '2024-01-14T10:30:00Z',
      result: 'Outbid by €5',
    },
    {
      id: 'A005',
      route: 'Linz → Salzburg',
      pickup: 'Linz Hauptbahnhof',
      dropoff: 'Salzburg Airport',
      date: '2024-01-16',
      time: '12:00',
      estimatedAmount: 130,
      myBid: 120,
      currentBid: 125,
      bidCount: 3,
      status: 'PENDING',
      distance: '120 km',
      duration: '1h 30m',
      customer: 'Tourism Austria',
      bidTime: '2024-01-14T14:15:00Z',
      result: 'Awaiting auction end',
    },
  ],
  won: [
    {
      id: 'A006',
      route: 'Innsbruck → Salzburg',
      pickup: 'Innsbruck Airport',
      dropoff: 'Salzburg City Center',
      date: '2024-01-14',
      time: '18:00',
      estimatedAmount: 145,
      myBid: 130,
      finalAmount: 130,
      bidCount: 6,
      status: 'WON',
      distance: '180 km',
      duration: '2h 15m',
      customer: 'Alpine Adventures',
      bidTime: '2024-01-13T16:45:00Z',
      result: 'Won auction',
      driver: 'Klaus Weber',
      vehicle: 'Mercedes E-Class',
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'WON':
      return 'success'
    case 'LOST':
      return 'error'
    default:
      return 'default'
  }
}

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
  const [selectedAuction, setSelectedAuction] = useState<any>(null)
  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const handlePlaceBid = (auction: any) => {
    setSelectedAuction(auction)
    setBidAmount(auction.myBid?.toString() || '')
    setBidDialogOpen(true)
  }

  const handleSubmitBid = () => {
    console.log('Placing bid:', bidAmount, 'for auction:', selectedAuction.id)
    // API call would go here
    setBidDialogOpen(false)
    setBidAmount('')
    setSelectedAuction(null)
  }

  const handleCloseBidDialog = () => {
    setBidDialogOpen(false)
    setBidAmount('')
    setSelectedAuction(null)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getTimeLeftColor = (timeLeft: string) => {
    if (timeLeft.includes('h') && parseInt(timeLeft) < 3) return 'error'
    if (timeLeft.includes('d') && parseInt(timeLeft) < 1) return 'warning'
    return 'success'
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Auction Bidding
      </Typography>

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
                    {auctionsData.available.length}
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
                    {auctionsData.myBids.filter(b => b.status === 'PENDING').length}
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
                    {auctionsData.won.length}
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
                    €{auctionsData.won.reduce((sum, auction) => sum + auction.finalAmount, 0)}
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
                <Badge badgeContent={auctionsData.available.length} color="primary">
                  Available Auctions
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={auctionsData.myBids.length} color="warning">
                  My Bids
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={auctionsData.won.length} color="success">
                  Won Auctions
                </Badge>
              }
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {auctionsData.available.map((auction) => (
              <Grid item xs={12} md={6} lg={4} key={auction.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" noWrap>
                        {auction.route}
                      </Typography>
                      <Chip
                        label={auction.status}
                        color={getStatusColor(auction.status) as any}
                        size="small"
                        icon={getStatusIcon(auction.status)}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {auction.date} at {auction.time}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2">
                        <strong>Distance:</strong> {auction.distance}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {auction.duration}
                      </Typography>
                    </Box>

                    <Typography variant="body2" gutterBottom>
                      <strong>Customer:</strong> {auction.customer}
                    </Typography>

                    <Typography variant="body2" gutterBottom>
                      <strong>Requirements:</strong> {auction.requirements}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Current Bid
                        </Typography>
                        <Typography variant="h6" color="primary">
                          €{auction.currentBid}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" color="textSecondary">
                          Estimated Value
                        </Typography>
                        <Typography variant="h6">
                          €{auction.estimatedAmount}
                        </Typography>
                      </Box>
                    </Box>

                    {auction.myBid && (
                      <Box mb={2}>
                        <Typography variant="body2" color="textSecondary">
                          My Bid
                        </Typography>
                        <Typography variant="body1" color="warning.main" fontWeight="bold">
                          €{auction.myBid}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="textSecondary">
                        {auction.bidCount} bids
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={`${getTimeLeftColor(auction.timeLeft)}.main`}
                        fontWeight="bold"
                      >
                        {auction.timeLeft} left
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handlePlaceBid(auction)}
                        startIcon={<Gavel />}
                      >
                        {auction.myBid ? 'Update Bid' : 'Place Bid'}
                      </Button>
                      <IconButton>
                        <Visibility />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Auction ID</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>My Bid</TableCell>
                  <TableCell>Current Bid</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auctionsData.myBids.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>{auction.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{auction.route}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {auction.distance} • {auction.duration}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{auction.date}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {auction.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        €{auction.myBid}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="primary">
                        €{auction.currentBid}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={auction.status}
                        color={getStatusColor(auction.status) as any}
                        size="small"
                        icon={getStatusIcon(auction.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {auction.result}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Auction ID</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Winning Bid</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auctionsData.won.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>{auction.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{auction.route}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {auction.distance} • {auction.duration}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{auction.date}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {auction.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        €{auction.finalAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{auction.driver}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{auction.vehicle}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={auction.status}
                        color={getStatusColor(auction.status) as any}
                        size="small"
                        icon={getStatusIcon(auction.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Bid Dialog */}
      <Dialog open={bidDialogOpen} onClose={handleCloseBidDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Place Bid - {selectedAuction?.route}
        </DialogTitle>
        <DialogContent>
          {selectedAuction && (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedAuction.date} at {selectedAuction.time}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Distance:</strong> {selectedAuction.distance} • <strong>Duration:</strong> {selectedAuction.duration}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Customer:</strong> {selectedAuction.customer}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Requirements:</strong> {selectedAuction.requirements}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" my={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Current Bid
                  </Typography>
                  <Typography variant="h6" color="primary">
                    €{selectedAuction.currentBid}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" color="textSecondary">
                    Estimated Value
                  </Typography>
                  <Typography variant="h6">
                    €{selectedAuction.estimatedAmount}
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Your Bid Amount (€)"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                sx={{ mt: 2 }}
                inputProps={{ min: 0, step: 1 }}
                helperText={`Your bid must be competitive with the current bid of €${selectedAuction.currentBid}`}
              />

              <Box mt={2} p={2} bgcolor="warning.50" borderRadius={1}>
                <Typography variant="body2" color="warning.main">
                  <Warning sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Time remaining: {selectedAuction.timeLeft}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBidDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitBid}
            variant="contained"
            disabled={!bidAmount || parseFloat(bidAmount) <= 0}
          >
            Place Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PartnerAuctions