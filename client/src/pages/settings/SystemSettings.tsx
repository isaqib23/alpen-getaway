import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Settings } from '@mui/icons-material'

const SystemSettings = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          System Settings
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Settings sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          System Settings Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage global system configurations and preferences.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Global system configuration
              <br />
              • Application preferences
              <br />
              • Integration settings
              <br />
              • Security and access controls
              <br />
              • System maintenance tools
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default SystemSettings