import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useEarnings, useEarningsStats } from '../../hooks/useEarnings';
import { useAuth } from '../../hooks/useAuth';
import { Earnings } from '../../api/earnings';

const EarningsManagement: React.FC = () => {
  const { getCurrentUserCompanyId, isAdminUser } = useAuth();
  const companyId = getCurrentUserCompanyId();
  const isAdmin = isAdminUser();

  const [filters, setFilters] = useState({
    status: '',
    earnings_type: '',
    date_from: '',
    date_to: '',
    search: '',
    page: 1,
    limit: 10,
  });

  const [selectedEarnings, setSelectedEarnings] = useState<Earnings | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const {
    earnings,
    loading,
    error,
    pagination,
    fetchEarnings,
  } = useEarnings(companyId ? { company_id: companyId } : {});

  const {
    stats,
  } = useEarningsStats(companyId);

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleSearch = () => {
    fetchEarnings(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      earnings_type: '',
      date_from: '',
      date_to: '',
      search: '',
      page: 1,
      limit: 10,
    };
    setFilters(resetFilters);
    fetchEarnings(resetFilters);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    const updatedFilters = { ...filters, page: newPage + 1 };
    setFilters(updatedFilters);
    fetchEarnings(updatedFilters);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = { ...filters, limit: parseInt(event.target.value, 10), page: 1 };
    setFilters(updatedFilters);
    fetchEarnings(updatedFilters);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'processed': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getEarningsTypeColor = (type: string) => {
    switch (type) {
      case 'booking_commission': return 'primary';
      case 'auction_win': return 'secondary';
      case 'referral_bonus': return 'success';
      case 'platform_bonus': return 'info';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportData = () => {
    // Implement CSV export functionality
    console.log('Export earnings data');
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Earnings Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchEarnings(filters)}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportData}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Earnings
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(stats.totalAmount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.totalEarnings} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Paid Earnings
                </Typography>
                <Typography variant="h5" color="success.main">
                  {formatCurrency(stats.byStatus.paid.amount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.byStatus.paid.count} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Earnings
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {formatCurrency(stats.byStatus.pending.amount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.byStatus.pending.count} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Commission
                </Typography>
                <Typography variant="h5" color="info.main">
                  {formatCurrency(stats.totalCommission)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Platform commission
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processed">Processed</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.earnings_type}
                  label="Type"
                  onChange={(e) => handleFilterChange('earnings_type', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="booking_commission">Booking Commission</MenuItem>
                  <MenuItem value="auction_win">Auction Win</MenuItem>
                  <MenuItem value="referral_bonus">Referral Bonus</MenuItem>
                  <MenuItem value="platform_bonus">Platform Bonus</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="From Date"
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="To Date"
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Reference, company..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box display="flex" gap={1}>
                <Button variant="contained" onClick={handleSearch} fullWidth>
                  Search
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Earnings Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Earnings List
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Reference</TableCell>
                      <TableCell>Type</TableCell>
                      {isAdmin && <TableCell>Company</TableCell>}
                      <TableCell>Gross Amount</TableCell>
                      <TableCell>Commission</TableCell>
                      <TableCell>Net Earnings</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Earned Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earnings.map((earning) => (
                      <TableRow key={earning.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {earning.reference_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={earning.earnings_type.replace('_', ' ').toUpperCase()}
                            color={getEarningsTypeColor(earning.earnings_type) as any}
                            size="small"
                          />
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Typography variant="body2">
                              {earning.company?.company_name || '-'}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell>{formatCurrency(earning.gross_amount)}</TableCell>
                        <TableCell>
                          {formatCurrency(earning.commission_amount)}
                          <Typography variant="caption" display="block" color="textSecondary">
                            ({earning.commission_rate}%)
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(earning.net_earnings)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={earning.status.toUpperCase()}
                            color={getStatusColor(earning.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(earning.earned_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedEarnings(earning);
                                setDetailsOpen(true);
                              }}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          {earning.payout_id && (
                            <Tooltip title="View Payout">
                              <IconButton size="small">
                                <PaymentIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={pagination.total}
                rowsPerPage={pagination.limit}
                page={pagination.page - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Earnings Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Earnings Details</DialogTitle>
        <DialogContent>
          {selectedEarnings && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Reference Number</Typography>
                <Typography variant="body2" gutterBottom>{selectedEarnings.reference_number}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Type</Typography>
                <Chip
                  label={selectedEarnings.earnings_type.replace('_', ' ').toUpperCase()}
                  color={getEarningsTypeColor(selectedEarnings.earnings_type) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Gross Amount</Typography>
                <Typography variant="body2" gutterBottom>{formatCurrency(selectedEarnings.gross_amount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Commission Rate</Typography>
                <Typography variant="body2" gutterBottom>{selectedEarnings.commission_rate}%</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Commission Amount</Typography>
                <Typography variant="body2" gutterBottom>{formatCurrency(selectedEarnings.commission_amount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Platform Fee</Typography>
                <Typography variant="body2" gutterBottom>{formatCurrency(selectedEarnings.platform_fee)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Tax Amount</Typography>
                <Typography variant="body2" gutterBottom>{formatCurrency(selectedEarnings.tax_amount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Net Earnings</Typography>
                <Typography variant="h6" color="primary.main">{formatCurrency(selectedEarnings.net_earnings)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Status</Typography>
                <Chip
                  label={selectedEarnings.status.toUpperCase()}
                  color={getStatusColor(selectedEarnings.status) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Earned Date</Typography>
                <Typography variant="body2" gutterBottom>{formatDate(selectedEarnings.earned_at)}</Typography>
              </Grid>
              {selectedEarnings.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                  <Typography variant="body2">{selectedEarnings.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EarningsManagement;