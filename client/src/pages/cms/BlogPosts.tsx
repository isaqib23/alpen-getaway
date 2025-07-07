import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import { Article } from '@mui/icons-material'

const BlogPosts = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Blog Posts
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Article sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Blog Posts Management
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This page will manage blog articles and news content.
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon Features:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              • Create and edit blog posts
              <br />
              • Content scheduling and publishing
              <br />
              • Category and tag management
              <br />
              • Image and media uploads
              <br />
              • Blog analytics and engagement
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default BlogPosts