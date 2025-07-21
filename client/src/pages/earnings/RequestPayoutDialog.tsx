import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { usePayouts } from '../../hooks/usePayouts';
import { RequestPayoutDto } from '../../api/earnings';

interface RequestPayoutDialogProps {
  open: boolean;
  onClose: () => void;
  companyId?: string;
  onSuccess: () => void;
}

const RequestPayoutDialog: React.FC<RequestPayoutDialogProps> = ({
  open,
  onClose,
  companyId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<RequestPayoutDto>({
    company_id: companyId || '',
    period_start: '',
    period_end: '',
    payout_method: 'bank_transfer',
    bank_account_details: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { requestPayout } = usePayouts();

  const handleChange = (field: keyof RequestPayoutDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyId) {
      setError('Company ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await requestPayout({
        ...formData,
        company_id: companyId,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        company_id: companyId || '',
        period_start: '',
        period_end: '',
        payout_method: 'bank_transfer',
        bank_account_details: '',
      });
      setError(null);
      onClose();
    }
  };

  const payoutMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'wire_transfer', label: 'Wire Transfer' },
    { value: 'check', label: 'Check' },
  ];

  const getPayoutMethodDescription = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Standard bank transfer (1-3 business days). Fee: 1%';
      case 'paypal':
        return 'PayPal transfer (instant). Fee: 2.5%';
      case 'stripe':
        return 'Stripe payout (1-2 business days). Fee: 2%';
      case 'wire_transfer':
        return 'International wire transfer (2-5 business days). Fee: $15';
      case 'check':
        return 'Physical check by mail (5-10 business days). Fee: $5';
      default:
        return '';
    }
  };

  const requiresBankDetails = ['bank_transfer', 'wire_transfer'].includes(formData.payout_method);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Request Payout</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Period Start Date"
                type="date"
                value={formData.period_start}
                onChange={(e) => handleChange('period_start', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                helperText="Start date for earnings to include in payout"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Period End Date"
                type="date"
                value={formData.period_end}
                onChange={(e) => handleChange('period_end', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                helperText="End date for earnings to include in payout"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Payout Method</InputLabel>
                <Select
                  value={formData.payout_method}
                  label="Payout Method"
                  onChange={(e) => handleChange('payout_method', e.target.value)}
                >
                  {payoutMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {getPayoutMethodDescription(formData.payout_method)}
              </Typography>
            </Grid>

            {requiresBankDetails && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Bank Account Details"
                  value={formData.bank_account_details}
                  onChange={(e) => handleChange('bank_account_details', e.target.value)}
                  multiline
                  rows={4}
                  required
                  placeholder="Please provide your bank account details including:
- Bank Name
- Account Number
- Routing Number (for US banks)
- SWIFT Code (for international transfers)
- Account Holder Name
- Bank Address"
                  helperText="Provide complete bank account information for the transfer"
                />
              </Grid>
            )}

            {formData.payout_method === 'paypal' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="PayPal Email"
                  type="email"
                  value={formData.bank_account_details}
                  onChange={(e) => handleChange('bank_account_details', e.target.value)}
                  required
                  placeholder="your-paypal-email@example.com"
                  helperText="Enter the email address associated with your PayPal account"
                />
              </Grid>
            )}

            {formData.payout_method === 'check' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Mailing Address"
                  value={formData.bank_account_details}
                  onChange={(e) => handleChange('bank_account_details', e.target.value)}
                  multiline
                  rows={3}
                  required
                  placeholder="Full mailing address where the check should be sent"
                  helperText="Provide complete mailing address for check delivery"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Important:</strong>
                  <br />
                  • Only processed earnings from the selected period will be included
                  <br />
                  • Payout requests require admin approval before processing
                  <br />
                  • Processing fees will be deducted from the payout amount
                  <br />
                  • You will receive email notifications about the payout status
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.period_start || !formData.period_end}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} />
                Requesting...
              </Box>
            ) : (
              'Request Payout'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RequestPayoutDialog;