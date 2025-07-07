import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Payment } from '@mui/icons-material'

const Payments = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Payments
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Payment sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Payments Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage all payment transactions and processing.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Payment transaction history
              <br />
              • Process refunds and chargebacks
              <br />
              • Payment gateway integration
              <br />
              • Transaction status tracking
              <br />
              • Financial reporting and analytics
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default Payments