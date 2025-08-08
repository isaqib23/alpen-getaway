import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Category,
  TrendingUp,
  GetApp,
  CheckCircle,
  Block,
} from '@mui/icons-material'
import { useCarCategories } from '../../hooks/useCarCategories'
import { CarCategory, CreateCarCategoryRequest } from '../../api/carCategories'

interface CategoryFormData {
  name: string
  description: string
  base_rate: number
  per_km_rate: number
  per_minute_rate: number
  max_passengers: number
  status: 'active' | 'inactive'
}

// Helper function to convert frontend form data to backend format
const mapFormDataToBackend = (formData: CategoryFormData): CreateCarCategoryRequest => ({
  name: formData.name,
  description: formData.description,
  base_rate: formData.base_rate,
  per_km_rate: formData.per_km_rate,
  per_minute_rate: formData.per_minute_rate,
  max_passengers: formData.max_passengers
})

const CarCategories = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CarCategory | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    base_rate: 0,
    per_km_rate: 0,
    per_minute_rate: 0,
    max_passengers: 4,
    status: 'active'
  })
  const [saving, setSaving] = useState(false)
  
  const { 
    categories, 
    stats, 
    loading, 
    createCategory,
    updateCategory, 
    deleteCategory 
  } = useCarCategories()


  console.log("carCategories", categories)
  const filteredCategories = (categories || []).filter(category => {
    const matchesSearch = (category.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && category.status === 'active') ||
                         (statusFilter === 'inactive' && category.status === 'inactive')
    return matchesSearch && matchesStatus
  })

  const handleViewCategory = (category: CarCategory) => {
    setSelectedCategory(category)
    setViewDialogOpen(true)
  }

  const handleEditCategory = (category: CarCategory) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      base_rate: category.base_rate,
      per_km_rate: category.per_km_rate,
      per_minute_rate: category.per_minute_rate,
      max_passengers: category.max_passengers,
      status: category.status
    })
    setEditDialogOpen(true)
  }

  const handleAddCategory = () => {
    setFormData({
      name: '',
      description: '',
      base_rate: 0,
      per_km_rate: 0,
      per_minute_rate: 0,
      max_passengers: 4,
      status: 'active'
    })
    setAddDialogOpen(true)
  }

  const handleDeleteCategory = (category: CarCategory) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (categoryToDelete) {
      const success = await deleteCategory(categoryToDelete.id)
      if (success) {
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const backendData = mapFormDataToBackend(formData)
      if (editDialogOpen && selectedCategory) {
        const success = await updateCategory(selectedCategory.id, backendData)
        if (success) {
          setEditDialogOpen(false)
          setSelectedCategory(null)
        }
      } else if (addDialogOpen) {
        const success = await createCategory(backendData)
        if (success) {
          setAddDialogOpen(false)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    console.log('Exporting categories...')
    // Add export logic here
  }


  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Car Categories Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<GetApp />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddCategory}>
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Categories
                  </Typography>
                  <Typography variant="h4">
                    {stats?.total || 0}
                  </Typography>
                </Box>
                <Category sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Categories
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats?.active || 0}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Inactive Categories
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats?.inactive || 0}
                  </Typography>
                </Box>
                <Block sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg. Base Fare
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    €{stats?.avgBaseFare?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="active">Active Only</MenuItem>
              <MenuItem value="inactive">Inactive Only</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Base Fare</TableCell>
              <TableCell>Price/KM</TableCell>
              <TableCell>Price/Min</TableCell>
              <TableCell>Max Seats</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No categories found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Category color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      {category.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {category.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    €{category.base_rate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    €{category.per_km_rate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    €{category.per_minute_rate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {category.max_passengers}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.status === 'active' ? 'Active' : 'Inactive'}
                    color={category.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewCategory(category)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Category">
                    <IconButton onClick={() => handleEditCategory(category)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Category">
                    <IconButton onClick={() => handleDeleteCategory(category)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Category Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Category Details</DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Typography><strong>Name:</strong> {selectedCategory.name}</Typography>
                <Typography><strong>Description:</strong> {selectedCategory.description}</Typography>
                <Typography><strong>Max Passengers:</strong> {selectedCategory.max_passengers}</Typography>
                <Typography><strong>Status:</strong> {selectedCategory.status === 'active' ? 'Active' : 'Inactive'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing Information</Typography>
                <Typography><strong>Base Rate:</strong> €{selectedCategory.base_rate}</Typography>
                <Typography><strong>Per KM Rate:</strong> €{selectedCategory.per_km_rate}</Typography>
                <Typography><strong>Per Minute Rate:</strong> €{selectedCategory.per_minute_rate}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Category Dialog */}
      <Dialog 
        open={editDialogOpen || addDialogOpen} 
        onClose={() => {
          setEditDialogOpen(false)
          setAddDialogOpen(false)
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {editDialogOpen ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Max Passengers"
                type="number"
                value={formData.max_passengers}
                onChange={(e) => setFormData({...formData, max_passengers: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                sx={{ mb: 2 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Base Rate (€)"
                type="number"
                  // @ts-ignore
                step="0.01"
                value={formData.base_rate}
                onChange={(e) => setFormData({...formData, base_rate: parseFloat(e.target.value)})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Per KM Rate (€)"
                type="number"
                  // @ts-ignore
                step="0.01"
                value={formData.per_km_rate}
                onChange={(e) => setFormData({...formData, per_km_rate: parseFloat(e.target.value)})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Per Minute Rate (€)"
                type="number"
                  // @ts-ignore
                step="0.01"
                value={formData.per_minute_rate}
                onChange={(e) => setFormData({...formData, per_minute_rate: parseFloat(e.target.value)})}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false)
            setAddDialogOpen(false)
          }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : (editDialogOpen ? 'Save Changes' : 'Add Category')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CarCategories