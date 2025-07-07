import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Help } from '@mui/icons-material'

const HelpPages = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Help Pages
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Help sx={{ fontSize: 80, color: 'info.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Help Pages Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage help documentation and support articles.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Create help articles and FAQs
              <br />
              • Knowledge base organization
              <br />
              • Search functionality
              <br />
              • User feedback on articles
              <br />
              • Multi-language support
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default HelpPages