import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Public as PublicIcon,
  Drafts as DraftIcon,
  Archive as ArchiveIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { cmsAPI, PageStatus, type CmsPage, type CreateCmsPageRequest, type UpdateCmsPageRequest } from '../../api/cms'
import { useNotification } from '../../contexts/NotificationContext'
import ConfirmDialog from '../../components/common/ConfirmDialog'


// Define page status options for blog posts
const blogStatusOptions = [
  { value: PageStatus.DRAFT, label: 'Draft' },
  { value: PageStatus.PUBLISHED, label: 'Published' },
  { value: PageStatus.ARCHIVED, label: 'Archived' }
]

const BlogPosts = () => {
  // Hooks
  const { showNotification } = useNotification()
  
  // State management
  const [posts, setPosts] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({
    total_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    archived_posts: 0,
    posts_this_month: 0,
    total_views: 0
  })
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Dialog state
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<CmsPage | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  
  // Form state for new post
  const [newPost, setNewPost] = useState<Omit<CreateCmsPageRequest, 'page_type'>>({
    slug: '',
    title: '',
    meta_title: '',
    meta_description: '',
    content: '',
    featured_image_url: '',
    sort_order: 0
  })
  
  // Form state for edit post
  const [editPost, setEditPost] = useState<UpdateCmsPageRequest>({
    slug: '',
    title: '',
    meta_title: '',
    meta_description: '',
    content: '',
    featured_image_url: '',
    status: PageStatus.DRAFT,
    sort_order: 0
  })

  // Load data on component mount
  useEffect(() => {
    loadPosts()
    loadStats()
  }, [])

  // Load posts with current filters
  useEffect(() => {
    loadPosts()
  }, [page, rowsPerPage, searchTerm, statusFilter])

  const clearError = () => setError(null)

  const loadPosts = async () => {
    setLoading(true)
    clearError()
    try {
      const response = await cmsAPI.getBlogPosts({
        page: page + 1, // Backend uses 1-based pagination
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      })
      setPosts(response.data)
      setTotal(response.total)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load blog posts'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await cmsAPI.getStats()
      setStats({
        total_posts: response.byType.blog || 0,
        published_posts: response.byStatus.published || 0,
        draft_posts: response.byStatus.draft || 0,
        archived_posts: response.byStatus.archived || 0,
        posts_this_month: response.recentPages?.length || 0,
        total_views: 12500 // This would come from a separate analytics API
      })
    } catch (err: any) {
      console.error('Failed to load stats:', err)
    }
  }

  // Event handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value)
    setPage(0)
  }

  const handleRefresh = () => {
    loadPosts()
    loadStats()
  }

  const handleAddPost = () => {
    setNewPost({
      slug: '',
      title: '',
      meta_title: '',
      meta_description: '',
      content: '',
      featured_image_url: '',
      sort_order: 0
    })
    clearError()
    setOpenAddDialog(true)
  }

  const handleEditPost = (post: CmsPage) => {
    setSelectedPost(post)
    setEditPost({
      slug: post.slug,
      title: post.title,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      content: post.content,
      featured_image_url: post.featured_image_url || '',
      status: post.status,
      sort_order: post.sort_order
    })
    clearError()
    setOpenEditDialog(true)
  }

  const handleDeletePost = (post: CmsPage) => {
    setSelectedPost(post)
    setOpenDeleteDialog(true)
  }

  const handleViewPost = (post: CmsPage) => {
    setSelectedPost(post)
    setOpenViewDialog(true)
  }

  const handlePublishPost = async (post: CmsPage) => {
    try {
      await cmsAPI.publishPage(post.id)
      showNotification(`Blog post "${post.title}" published successfully`, 'success')
      loadPosts()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to publish blog post'
      showNotification(errorMessage, 'error')
    }
  }

  const handleUnpublishPost = async (post: CmsPage) => {
    try {
      await cmsAPI.unpublishPage(post.id)
      showNotification(`Blog post "${post.title}" unpublished successfully`, 'success')
      loadPosts()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to unpublish blog post'
      showNotification(errorMessage, 'error')
    }
  }

  const handleSubmitAddPost = async () => {
    setFormLoading(true)
    clearError()
    try {
      const createdPost = await cmsAPI.createBlogPost(newPost)
      showNotification(`Blog post "${createdPost.title}" created successfully`, 'success')
      setOpenAddDialog(false)
      loadPosts()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create blog post'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmitEditPost = async () => {
    if (!selectedPost) return
    
    setFormLoading(true)
    clearError()
    try {
      const updatedPost = await cmsAPI.updatePage(selectedPost.id, editPost)
      showNotification(`Blog post "${updatedPost.title}" updated successfully`, 'success')
      setOpenEditDialog(false)
      setSelectedPost(null)
      loadPosts()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update blog post'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedPost) return
    
    try {
      await cmsAPI.deletePage(selectedPost.id)
      showNotification(`Blog post "${selectedPost.title}" deleted successfully`, 'success')
      setOpenDeleteDialog(false)
      setSelectedPost(null)
      loadPosts()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete blog post'
      showNotification(errorMessage, 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <PublicIcon />
      case 'draft':
        return <DraftIcon />
      case 'archived':
        return <ArchiveIcon />
      default:
        return <DraftIcon />
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Blog Posts
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPost}
          >
            Add Blog Post
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ArticleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.total_posts}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Posts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PublicIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.published_posts}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Published
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DraftIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.draft_posts}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Drafts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ArchiveIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.archived_posts}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Archived
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.posts_this_month}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.total_views.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Views
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {blogStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                  {total} blog post(s) found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Blog Posts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Blog Post</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No blog posts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        {post.featured_image_url && (
                          <ImageIcon color="action" fontSize="small" />
                        )}
                        <Typography variant="subtitle2">
                          {post.title}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        /{post.slug}
                      </Typography>
                      {post.meta_description && (
                        <Typography variant="caption" color="textSecondary" display="block">
                          {post.meta_description.substring(0, 100)}...
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(post.status)}
                      label={post.status}
                      color={getStatusColor(post.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {post.creator.first_name} {post.creator.last_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(post.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(post.created_at).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(post.updated_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(post.updated_at).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPost(post)}
                        color="info"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPost(post)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {post.status === 'draft' ? (
                      <Tooltip title="Publish">
                        <IconButton
                          size="small"
                          onClick={() => handlePublishPost(post)}
                          color="success"
                        >
                          <PublicIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : post.status === 'published' ? (
                      <Tooltip title="Unpublish">
                        <IconButton
                          size="small"
                          onClick={() => handleUnpublishPost(post)}
                          color="warning"
                        >
                          <DraftIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePost(post)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add Blog Post Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Blog Post</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}
          <Box component="form" sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blog Post Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="URL Slug"
                  value={newPost.slug}
                  onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                  required
                  helperText="URL-friendly version of the title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={newPost.meta_title}
                  onChange={(e) => setNewPost({ ...newPost, meta_title: e.target.value })}
                  helperText="SEO title for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Description"
                  value={newPost.meta_description}
                  onChange={(e) => setNewPost({ ...newPost, meta_description: e.target.value })}
                  multiline
                  rows={2}
                  helperText="SEO description for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  multiline
                  rows={8}
                  required
                  helperText="HTML content of the blog post"
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Featured Image URL"
                  value={newPost.featured_image_url}
                  onChange={(e) => setNewPost({ ...newPost, featured_image_url: e.target.value })}
                  helperText="Optional featured image for the blog post"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Sort Order"
                  type="number"
                  value={newPost.sort_order}
                  onChange={(e) => setNewPost({ ...newPost, sort_order: parseInt(e.target.value) || 0 })}
                  helperText="Order for display"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} disabled={formLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitAddPost}
            disabled={formLoading || !newPost.title || !newPost.slug || !newPost.content}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Add Blog Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Blog Post Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Blog Post</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}
          <Box component="form" sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blog Post Title"
                  value={editPost.title}
                  onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="URL Slug"
                  value={editPost.slug}
                  onChange={(e) => setEditPost({ ...editPost, slug: e.target.value })}
                  required
                  helperText="URL-friendly version of the title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={editPost.meta_title}
                  onChange={(e) => setEditPost({ ...editPost, meta_title: e.target.value })}
                  helperText="SEO title for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Description"
                  value={editPost.meta_description}
                  onChange={(e) => setEditPost({ ...editPost, meta_description: e.target.value })}
                  multiline
                  rows={2}
                  helperText="SEO description for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  value={editPost.content}
                  onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                  multiline
                  rows={8}
                  required
                  helperText="HTML content of the blog post"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Featured Image URL"
                  value={editPost.featured_image_url}
                  onChange={(e) => setEditPost({ ...editPost, featured_image_url: e.target.value })}
                  helperText="Optional featured image"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editPost.status}
                    onChange={(e) => setEditPost({ ...editPost, status: e.target.value as PageStatus })}
                    label="Status"
                  >
                    {blogStatusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Sort Order"
                  type="number"
                  value={editPost.sort_order}
                  onChange={(e) => setEditPost({ ...editPost, sort_order: parseInt(e.target.value) || 0 })}
                  helperText="Display order"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} disabled={formLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitEditPost}
            disabled={formLoading || !editPost.title || !editPost.slug || !editPost.content}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Update Blog Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Blog Post Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete the blog post "${selectedPost?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
      />

      {/* View Blog Post Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <ArticleIcon />
            <Typography variant="h6">
              Blog Post Details: {selectedPost?.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <ArticleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Blog Post Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Title</Typography>
                        <Typography variant="body1">{selectedPost.title}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Slug</Typography>
                        <Typography variant="body1">/{selectedPost.slug}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Meta Title</Typography>
                        <Typography variant="body1">{selectedPost.meta_title || 'Not set'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Meta Description</Typography>
                        <Typography variant="body1">{selectedPost.meta_description || 'Not set'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Publishing Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Status</Typography>
                        <Chip
                          icon={getStatusIcon(selectedPost.status)}
                          label={selectedPost.status}
                          color={getStatusColor(selectedPost.status) as any}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Sort Order</Typography>
                        <Typography variant="body1">{selectedPost.sort_order}</Typography>
                      </Grid>
                      {selectedPost.featured_image_url && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Featured Image</Typography>
                          <Typography variant="body1" style={{ wordBreak: 'break-all' }}>
                            {selectedPost.featured_image_url}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Author & Dates
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Created By</Typography>
                        <Typography variant="body1">
                          {selectedPost.creator.first_name} {selectedPost.creator.last_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Created Date</Typography>
                        <Typography variant="body1">
                          {new Date(selectedPost.created_at).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Last Updated</Typography>
                        <Typography variant="body1">
                          {new Date(selectedPost.updated_at).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Content Preview
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: 300,
                        overflow: 'auto',
                        p: 2,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedPost.content.substring(0, 800)}
                        {selectedPost.content.length > 800 && '...'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => handleEditPost(selectedPost!)}>
            Edit Blog Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BlogPosts