import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { AccountBalance } from '@mui/icons-material'

const Commissions = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Commissions
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <AccountBalance sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Commissions Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage commission structures and payouts for drivers and partners.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Commission rate configuration
              <br />
              • Driver earnings tracking
              <br />
              • Partner commission management
              <br />
              • Payout scheduling and processing
              <br />
              • Commission analytics and reports
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default Commissions