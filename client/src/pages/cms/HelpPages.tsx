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
  Person as PersonIcon,
  Help as HelpIcon,
  QuestionAnswer as QAIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import { cmsAPI, PageStatus, type CmsPage, type CreateCmsPageRequest, type UpdateCmsPageRequest } from '../../api/cms'
import { useNotification } from '../../contexts/NotificationContext'
import ConfirmDialog from '../../components/common/ConfirmDialog'


// Define status options for help pages
const helpStatusOptions = [
  { value: PageStatus.DRAFT, label: 'Draft' },
  { value: PageStatus.PUBLISHED, label: 'Published' },
  { value: PageStatus.ARCHIVED, label: 'Archived' }
]

const HelpPages = () => {
  // Hooks
  const { showNotification } = useNotification()
  
  // State management
  const [pages, setPages] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({
    total_articles: 0,
    published_articles: 0,
    draft_articles: 0,
    archived_articles: 0,
    articles_in_menu: 0,
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
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  
  // Form state for new page
  const [newPage, setNewPage] = useState<Omit<CreateCmsPageRequest, 'page_type'>>({
    slug: '',
    title: '',
    meta_title: '',
    meta_description: '',
    content: '',
    featured_image_url: '',
    sort_order: 0,
    is_in_menu: false,
    menu_title: ''
  })
  
  // Form state for edit page
  const [editPage, setEditPage] = useState<UpdateCmsPageRequest>({
    slug: '',
    title: '',
    meta_title: '',
    meta_description: '',
    content: '',
    featured_image_url: '',
    status: PageStatus.DRAFT,
    sort_order: 0,
    is_in_menu: false,
    menu_title: ''
  })

  // Load data on component mount
  useEffect(() => {
    loadPages()
    loadStats()
  }, [])

  // Load pages with current filters
  useEffect(() => {
    loadPages()
  }, [page, rowsPerPage, searchTerm, statusFilter])

  const clearError = () => setError(null)

  const loadPages = async () => {
    setLoading(true)
    clearError()
    try {
      const response = await cmsAPI.getHelpPages({
        page: page + 1, // Backend uses 1-based pagination
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      })
      setPages(response.data)
      setTotal(response.total)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load help pages'
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
        total_articles: response.byType.help || 0,
        published_articles: response.byStatus.published || 0,
        draft_articles: response.byStatus.draft || 0,
        archived_articles: response.byStatus.archived || 0,
        articles_in_menu: response.recentPages?.filter(p => p.status === 'published').length || 0,
        total_views: 8750 // This would come from a separate analytics API
      })
    } catch (err: any) {
      console.error('Failed to load stats:', err)
    }
  }

  // Event handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
    // TODO: Integrate with API pagination
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
    // TODO: Integrate with API pagination
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    // TODO: Integrate with API search
  }

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value)
    // TODO: Integrate with API filtering
  }

  const handleRefresh = () => {
    loadPages()
    loadStats()
  }

  const handleAddPage = () => {
    setNewPage({
      slug: '',
      title: '',
      meta_title: '',
      meta_description: '',
      content: '',
      featured_image_url: '',
      sort_order: 0,
      is_in_menu: false,
      menu_title: ''
    })
    clearError()
    setOpenAddDialog(true)
  }

  const handleEditPage = (page: CmsPage) => {
    setSelectedPage(page)
    setEditPage({
      slug: page.slug,
      title: page.title,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      content: page.content,
      featured_image_url: page.featured_image_url || '',
      status: page.status,
      sort_order: page.sort_order,
      is_in_menu: page.is_in_menu,
      menu_title: page.menu_title || ''
    })
    clearError()
    setOpenEditDialog(true)
  }

  const handleDeletePage = (page: CmsPage) => {
    setSelectedPage(page)
    setOpenDeleteDialog(true)
  }

  const handleViewPage = (page: CmsPage) => {
    setSelectedPage(page)
    setOpenViewDialog(true)
  }

  const handlePublishPage = async (page: CmsPage) => {
    try {
      await cmsAPI.publishPage(page.id)
      showNotification(`Help article "${page.title}" published successfully`, 'success')
      loadPages()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to publish help article'
      showNotification(errorMessage, 'error')
    }
  }

  const handleUnpublishPage = async (page: CmsPage) => {
    try {
      await cmsAPI.unpublishPage(page.id)
      showNotification(`Help article "${page.title}" unpublished successfully`, 'success')
      loadPages()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to unpublish help article'
      showNotification(errorMessage, 'error')
    }
  }

  const handleSubmitAddPage = async () => {
    setFormLoading(true)
    clearError()
    try {
      const createdPage = await cmsAPI.createHelpPage(newPage)
      showNotification(`Help article "${createdPage.title}" created successfully`, 'success')
      setOpenAddDialog(false)
      loadPages()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create help article'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmitEditPage = async () => {
    if (!selectedPage) return
    
    setFormLoading(true)
    clearError()
    try {
      const updatedPage = await cmsAPI.updatePage(selectedPage.id, editPage)
      showNotification(`Help article "${updatedPage.title}" updated successfully`, 'success')
      setOpenEditDialog(false)
      setSelectedPage(null)
      loadPages()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update help article'
      setError(errorMessage)
      showNotification(errorMessage, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedPage) return
    
    try {
      await cmsAPI.deletePage(selectedPage.id)
      showNotification(`Help article "${selectedPage.title}" deleted successfully`, 'success')
      setOpenDeleteDialog(false)
      setSelectedPage(null)
      loadPages()
      loadStats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete help article'
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
          Help Pages
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
            onClick={handleAddPage}
          >
            Add Help Article
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
              <HelpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.total_articles}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Articles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PublicIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.published_articles}
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
                {stats.draft_articles}
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
                {stats.archived_articles}
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
              <CategoryIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.articles_in_menu}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                In Menu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
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
                placeholder="Search help articles..."
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
                  {helpStatusOptions.map((option) => (
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
                  {total} help article(s) found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Help Articles Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Help Article</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Menu</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No help articles found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pages.map((pageItem) => (
                <TableRow key={pageItem.id} hover>
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <QAIcon color="info" fontSize="small" />
                        <Typography variant="subtitle2">
                          {pageItem.title}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        /{pageItem.slug}
                      </Typography>
                      {pageItem.meta_description && (
                        <Typography variant="caption" color="textSecondary" display="block">
                          {pageItem.meta_description.substring(0, 80)}...
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(pageItem.status)}
                      label={pageItem.status}
                      color={getStatusColor(pageItem.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {pageItem.is_in_menu ? (
                      <Chip
                        icon={<CategoryIcon />}
                        label={pageItem.menu_title || 'Yes'}
                        color="info"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {pageItem.creator.first_name} {pageItem.creator.last_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(pageItem.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(pageItem.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPage(pageItem)}
                        color="info"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPage(pageItem)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {pageItem.status === 'draft' ? (
                      <Tooltip title="Publish">
                        <IconButton
                          size="small"
                          onClick={() => handlePublishPage(pageItem)}
                          color="success"
                        >
                          <PublicIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : pageItem.status === 'published' ? (
                      <Tooltip title="Unpublish">
                        <IconButton
                          size="small"
                          onClick={() => handleUnpublishPage(pageItem)}
                          color="warning"
                        >
                          <DraftIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePage(pageItem)}
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

      {/* Add Help Article Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Help Article</DialogTitle>
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
                  label="Article Title"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="URL Slug"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  required
                  helperText="URL-friendly version of the title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={newPage.meta_title}
                  onChange={(e) => setNewPage({ ...newPage, meta_title: e.target.value })}
                  helperText="SEO title for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Description"
                  value={newPage.meta_description}
                  onChange={(e) => setNewPage({ ...newPage, meta_description: e.target.value })}
                  multiline
                  rows={2}
                  helperText="SEO description for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  value={newPage.content}
                  onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                  multiline
                  rows={8}
                  required
                  helperText="HTML content of the help article"
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Featured Image URL"
                  value={newPage.featured_image_url}
                  onChange={(e) => setNewPage({ ...newPage, featured_image_url: e.target.value })}
                  helperText="Optional featured image for the article"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Sort Order"
                  type="number"
                  value={newPage.sort_order}
                  onChange={(e) => setNewPage({ ...newPage, sort_order: parseInt(e.target.value) || 0 })}
                  helperText="Order for display"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Show in Menu"
                  value={newPage.is_in_menu}
                  onChange={(e) => setNewPage({ ...newPage, is_in_menu: e.target.value === 'true' })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Menu Title"
                  value={newPage.menu_title}
                  onChange={(e) => setNewPage({ ...newPage, menu_title: e.target.value })}
                  helperText="Title to display in menu"
                  disabled={!newPage.is_in_menu}
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
            onClick={handleSubmitAddPage}
            disabled={formLoading || !newPage.title || !newPage.slug || !newPage.content}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Add Help Article'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Help Article Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Help Article</DialogTitle>
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
                  label="Article Title"
                  value={editPage.title}
                  onChange={(e) => setEditPage({ ...editPage, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="URL Slug"
                  value={editPage.slug}
                  onChange={(e) => setEditPage({ ...editPage, slug: e.target.value })}
                  required
                  helperText="URL-friendly version of the title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={editPage.meta_title}
                  onChange={(e) => setEditPage({ ...editPage, meta_title: e.target.value })}
                  helperText="SEO title for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Description"
                  value={editPage.meta_description}
                  onChange={(e) => setEditPage({ ...editPage, meta_description: e.target.value })}
                  multiline
                  rows={2}
                  helperText="SEO description for search engines"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  value={editPage.content}
                  onChange={(e) => setEditPage({ ...editPage, content: e.target.value })}
                  multiline
                  rows={8}
                  required
                  helperText="HTML content of the help article"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Featured Image URL"
                  value={editPage.featured_image_url}
                  onChange={(e) => setEditPage({ ...editPage, featured_image_url: e.target.value })}
                  helperText="Optional featured image"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editPage.status}
                    onChange={(e) => setEditPage({ ...editPage, status: e.target.value as PageStatus })}
                    label="Status"
                  >
                    {helpStatusOptions.map((option) => (
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
                  value={editPage.sort_order}
                  onChange={(e) => setEditPage({ ...editPage, sort_order: parseInt(e.target.value) || 0 })}
                  helperText="Display order"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Show in Menu"
                  value={editPage.is_in_menu}
                  onChange={(e) => setEditPage({ ...editPage, is_in_menu: e.target.value === 'true' })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Menu Title"
                  value={editPage.menu_title}
                  onChange={(e) => setEditPage({ ...editPage, menu_title: e.target.value })}
                  helperText="Title to display in menu"
                  disabled={!editPage.is_in_menu}
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
            onClick={handleSubmitEditPage}
            disabled={formLoading || !editPage.title || !editPage.slug || !editPage.content}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Update Help Article'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Help Article Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Help Article"
        message={`Are you sure you want to delete the help article "${selectedPage?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
      />

      {/* View Help Article Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <HelpIcon />
            <Typography variant="h6">
              Help Article Details: {selectedPage?.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPage && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <QAIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Article Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Title</Typography>
                        <Typography variant="body1">{selectedPage.title}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Slug</Typography>
                        <Typography variant="body1">/{selectedPage.slug}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Meta Title</Typography>
                        <Typography variant="body1">{selectedPage.meta_title || 'Not set'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Meta Description</Typography>
                        <Typography variant="body1">{selectedPage.meta_description || 'Not set'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      <CategoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Publishing Settings
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Status</Typography>
                        <Chip
                          icon={getStatusIcon(selectedPage.status)}
                          label={selectedPage.status}
                          color={getStatusColor(selectedPage.status) as any}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Sort Order</Typography>
                        <Typography variant="body1">{selectedPage.sort_order}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">In Menu</Typography>
                        <Typography variant="body1">
                          {selectedPage.is_in_menu ? `Yes (${selectedPage.menu_title || selectedPage.title})` : 'No'}
                        </Typography>
                      </Grid>
                      {selectedPage.featured_image_url && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Featured Image</Typography>
                          <Typography variant="body1" style={{ wordBreak: 'break-all' }}>
                            {selectedPage.featured_image_url}
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
                          {selectedPage.creator.first_name} {selectedPage.creator.last_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Created Date</Typography>
                        <Typography variant="body1">
                          {new Date(selectedPage.created_at).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Last Updated</Typography>
                        <Typography variant="body1">
                          {new Date(selectedPage.updated_at).toLocaleString()}
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
                        {selectedPage.content.substring(0, 600)}
                        {selectedPage.content.length > 600 && '...'}
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
          <Button variant="contained" onClick={() => handleEditPage(selectedPage!)}>
            Edit Help Article
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default HelpPages