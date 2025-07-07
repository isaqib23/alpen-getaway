import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Web } from '@mui/icons-material'

const CMSPages = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          CMS Pages
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Web sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          CMS Pages Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage website content and static pages.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Create and edit web pages
              <br />
              • Rich text editor for content
              <br />
              • Page template management
              <br />
              • SEO optimization tools
              <br />
              • Page publishing workflow
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default CMSPages