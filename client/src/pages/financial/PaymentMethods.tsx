import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { CreditCard } from '@mui/icons-material'

const PaymentMethods = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Payment Methods
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CreditCard sx={{ fontSize: 80, color: 'info.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Payment Methods Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will configure and manage available payment methods.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Configure payment gateways
              <br />
              • Enable/disable payment methods
              <br />
              • Payment method preferences
              <br />
              • Gateway fee management
              <br />
              • Payment security settings
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default PaymentMethods