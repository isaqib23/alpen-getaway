import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { PendingActions } from '@mui/icons-material'

const PendingReviews = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Pending Reviews
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <PendingActions sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Pending Reviews Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage reviews that require moderation or approval.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Review moderation queue
              <br />
              • Approve or reject reviews
              <br />
              • Flag inappropriate content
              <br />
              • Automated content filtering
              <br />
              • Bulk review actions
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default PendingReviews