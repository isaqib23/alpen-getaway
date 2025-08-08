import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Cancel } from '@mui/icons-material'

const RejectedReviews = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Rejected Reviews
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Rejected Reviews Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage reviews that have been rejected or flagged.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • View all rejected reviews
              <br />
              • Review rejection reasons
              <br />
              • Appeal process management
              <br />
              • Pattern analysis for violations
              <br />
              • Review policy enforcement
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default RejectedReviews