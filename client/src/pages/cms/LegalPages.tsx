import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Gavel } from '@mui/icons-material'

const LegalPages = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Legal Pages
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Gavel sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Legal Pages Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage legal documents and compliance pages.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Terms of service management
              <br />
              • Privacy policy updates
              <br />
              • Cookie policy configuration
              <br />
              • Legal compliance tracking
              <br />
              • Document version control
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default LegalPages