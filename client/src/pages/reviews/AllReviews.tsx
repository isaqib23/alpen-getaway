import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Reviews } from '@mui/icons-material'

const AllReviews = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          All Reviews
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Reviews sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          All Reviews Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will display and manage all customer reviews and ratings.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • View all customer reviews
              <br />
              • Filter by rating and date
              <br />
              • Review moderation tools
              <br />
              • Driver performance insights
              <br />
              • Review analytics and trends
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default AllReviews