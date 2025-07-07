import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

const ApprovedReviews = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Approved Reviews
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Approved Reviews Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will display all approved and published reviews.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • View all approved reviews
              <br />
              • Edit or update reviews
              <br />
              • Featured reviews management
              <br />
              • Review visibility settings
              <br />
              • Export approved reviews
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default ApprovedReviews