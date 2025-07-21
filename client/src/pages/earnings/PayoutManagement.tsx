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
  Fab,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Check as CheckIcon,
  PlayArrow as PlayArrowIcon,
  Done as DoneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { usePayouts, usePayoutStats } from '../../hooks/usePayouts';
import { useAuth } from '../../hooks/useAuth';
import { Payout } from '../../api/earnings';
import RequestPayoutDialog from './RequestPayoutDialog';

const PayoutManagement: React.FC = () => {
  const { getCurrentUserCompanyId, isAdminUser } = useAuth();
  const companyId = getCurrentUserCompanyId();
  const isAdmin = isAdminUser();

  const [filters, setFilters] = useState({
    status: '',
    date_from: '',
    date_to: '',
    page: 1,
    limit: 10,
  });

  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [requestPayoutOpen, setRequestPayoutOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'process' | 'complete' | 'fail'>('approve');
  const [actionData, setActionData] = useState('');

  const {
    payouts,
    loading,
    error,
    pagination,
    fetchPayouts,
    approvePayout,
    processPayout,
    completePayout,
    failPayout,
  } = usePayouts(companyId ? { company_id: companyId } : {});

  const {
    stats,
  } = usePayoutStats(companyId);

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const handleSearch = () => {
    fetchPayouts(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      date_from: '',
      date_to: '',
      page: 1,
      limit: 10,
    };
    setFilters(resetFilters);
    fetchPayouts(resetFilters);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    const updatedFilters = { ...filters, page: newPage + 1 };
    setFilters(updatedFilters);
    fetchPayouts(updatedFilters);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = { ...filters, limit: parseInt(event.target.value, 10), page: 1 };
    setFilters(updatedFilters);
    fetchPayouts(updatedFilters);
  };

  const handleAction = async () => {
    if (!selectedPayout) return;

    try {
      switch (actionType) {
        case 'approve':
          await approvePayout(selectedPayout.id);
          break;
        case 'process':
          await processPayout(selectedPayout.id, actionData);
          break;
        case 'complete':
          await completePayout(selectedPayout.id);
          break;
        case 'fail':
          await failPayout(selectedPayout.id, actionData);
          break;
      }
      setActionDialogOpen(false);
      setActionData('');
    } catch (error: any) {
      console.error('Action failed:', error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'processing': return 'info';
      case 'approved': return 'primary';
      case 'requested': return 'secondary';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPayoutMethodColor = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'primary';
      case 'paypal': return 'secondary';
      case 'stripe': return 'info';
      case 'wire_transfer': return 'success';
      case 'check': return 'warning';
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

  const canPerformAction = (payout: Payout, action: string) => {
    if (!isAdmin) return false;
    
    switch (action) {
      case 'approve':
        return payout.status === 'requested';
      case 'process':
        return payout.status === 'approved';
      case 'complete':
        return payout.status === 'processing';
      case 'fail':
        return ['requested', 'approved', 'processing'].includes(payout.status);
      default:
        return false;
    }
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
          Payout Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchPayouts(filters)}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => console.log('Export payouts')}
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
                  Total Payouts
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(stats.totalAmount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.totalPayouts} requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Paid Out
                </Typography>
                <Typography variant="h5" color="success.main">
                  {formatCurrency(stats.byStatus.paid.amount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.byStatus.paid.count} completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Approval
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {formatCurrency(stats.byStatus.requested.amount + stats.byStatus.pending.amount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.byStatus.requested.count + stats.byStatus.pending.count} requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Fees
                </Typography>
                <Typography variant="h5" color="info.main">
                  {formatCurrency(stats.totalFees)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Platform fees
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="requested">Requested</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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

      {/* Payouts Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payout Requests
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
                      {isAdmin && <TableCell>Company</TableCell>}
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Period</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Requested</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {payout.payout_reference}
                          </Typography>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Typography variant="body2">
                              {payout.company?.company_name || '-'}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(payout.net_amount)}
                          </Typography>
                          <Typography variant="caption" display="block" color="textSecondary">
                            Fee: {formatCurrency(payout.fee_amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payout.payout_method.replace('_', ' ').toUpperCase()}
                            color={getPayoutMethodColor(payout.payout_method) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(payout.period_start)} - {formatDate(payout.period_end)}
                          </Typography>
                          <Typography variant="caption" display="block" color="textSecondary">
                            {payout.earnings_count} earnings
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payout.status.toUpperCase()}
                            color={getStatusColor(payout.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {payout.requested_at ? formatDate(payout.requested_at) : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedPayout(payout);
                                  setDetailsOpen(true);
                                }}
                              >
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                            {canPerformAction(payout, 'approve') && (
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedPayout(payout);
                                    setActionType('approve');
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canPerformAction(payout, 'process') && (
                              <Tooltip title="Process">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => {
                                    setSelectedPayout(payout);
                                    setActionType('process');
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  <PlayArrowIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canPerformAction(payout, 'complete') && (
                              <Tooltip title="Complete">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => {
                                    setSelectedPayout(payout);
                                    setActionType('complete');
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  <DoneIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canPerformAction(payout, 'fail') && (
                              <Tooltip title="Mark as Failed">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setSelectedPayout(payout);
                                    setActionType('fail');
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  <CloseIcon />
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

      {/* Request Payout FAB */}
      {!isAdmin && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setRequestPayoutOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Payout Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Payout Details</DialogTitle>
        <DialogContent>
          {selectedPayout && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Reference</Typography>
                <Typography variant="body2">{selectedPayout.payout_reference}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Status</Typography>
                <Chip
                  label={selectedPayout.status.toUpperCase()}
                  color={getStatusColor(selectedPayout.status) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Total Amount</Typography>
                <Typography variant="body2">{formatCurrency(selectedPayout.total_amount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Fee Amount</Typography>
                <Typography variant="body2">{formatCurrency(selectedPayout.fee_amount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Net Amount</Typography>
                <Typography variant="h6" color="primary.main">{formatCurrency(selectedPayout.net_amount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Payout Method</Typography>
                <Chip
                  label={selectedPayout.payout_method.replace('_', ' ').toUpperCase()}
                  color={getPayoutMethodColor(selectedPayout.payout_method) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Period Start</Typography>
                <Typography variant="body2">{formatDate(selectedPayout.period_start)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Period End</Typography>
                <Typography variant="body2">{formatDate(selectedPayout.period_end)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Earnings Count</Typography>
                <Typography variant="body2">{selectedPayout.earnings_count} transactions</Typography>
              </Grid>
              {selectedPayout.external_transaction_id && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Transaction ID</Typography>
                  <Typography variant="body2">{selectedPayout.external_transaction_id}</Typography>
                </Grid>
              )}
              {selectedPayout.bank_account_details && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Bank Account Details</Typography>
                  <Typography variant="body2">{selectedPayout.bank_account_details}</Typography>
                </Grid>
              )}
              {selectedPayout.admin_notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Admin Notes</Typography>
                  <Typography variant="body2">{selectedPayout.admin_notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' && 'Approve Payout'}
          {actionType === 'process' && 'Process Payout'}
          {actionType === 'complete' && 'Complete Payout'}
          {actionType === 'fail' && 'Mark Payout as Failed'}
        </DialogTitle>
        <DialogContent>
          {(actionType === 'process' || actionType === 'fail') && (
            <TextField
              fullWidth
              margin="normal"
              label={actionType === 'process' ? 'External Transaction ID' : 'Failure Reason'}
              value={actionData}
              onChange={(e) => setActionData(e.target.value)}
              required
              multiline={actionType === 'fail'}
              rows={actionType === 'fail' ? 3 : 1}
            />
          )}
          <Typography variant="body2" color="textSecondary" mt={2}>
            Are you sure you want to {actionType} this payout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAction}
            variant="contained"
            disabled={(actionType === 'process' || actionType === 'fail') && !actionData.trim()}
          >
            {actionType === 'approve' && 'Approve'}
            {actionType === 'process' && 'Process'}
            {actionType === 'complete' && 'Complete'}
            {actionType === 'fail' && 'Mark as Failed'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Payout Dialog */}
      <RequestPayoutDialog
        open={requestPayoutOpen}
        onClose={() => setRequestPayoutOpen(false)}
        companyId={companyId}
        onSuccess={() => {
          fetchPayouts(filters);
          setRequestPayoutOpen(false);
        }}
      />
    </Box>
  );
};

export default PayoutManagement;