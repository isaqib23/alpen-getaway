import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
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
  CardMedia,
  CardActions,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  Edit,
  Delete,
  Visibility,
  PhotoCamera,
  CloudUpload,
  GetApp,
  CheckCircle,
  Warning,
  Image,
  Collections,
} from '@mui/icons-material'
import { useCarImages } from '../../hooks/useCarImages'
import { CarImage as CarImageType } from '../../api/carImages'

interface ImageFormData {
  carId: string
  image_type: 'exterior' | 'interior' | 'features'
  alt_text: string
  is_primary: boolean
  file: File | null
}

const CarImages = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [carFilter, setCarFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState<CarImageType | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<CarImageType | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<ImageFormData>({
    carId: '',
    image_type: 'exterior',
    alt_text: '',
    is_primary: false,
    file: null
  })

  const {
    images,
    stats,
    cars,
    loading
  } = useCarImages()

  // Constants
  const imageTypes = ['exterior', 'interior', 'features']
  
  // Mock data for cars dropdown (replace with actual cars from hook)
  const mockCars = cars.length > 0 ? cars : [
    { id: '1', make: 'BMW', model: 'X5', licensePlate: 'ABC123' },
    { id: '2', make: 'Mercedes', model: 'E-Class', licensePlate: 'DEF456' },
    { id: '3', make: 'Audi', model: 'A6', licensePlate: 'GHI789' }
  ]
  
  // Filter images based on search and filter criteria
  const filteredImages = images.filter(image => {
    const matchesSearch = searchTerm === '' || 
      (image.alt_text && image.alt_text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (image.carDetails?.make?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (image.carDetails?.model?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || (image.status && image.status === statusFilter)
    const matchesType = typeFilter === 'all' || image.image_type === typeFilter
    const matchesCar = carFilter === 'all' || image.car_id === carFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesCar
  })

  const handleViewImage = (image: CarImageType) => {
    setSelectedImage(image)
    setViewDialogOpen(true)
  }

  const handleEditImage = (image: CarImageType) => {
    setSelectedImage(image)
    setFormData({
      carId: image.car_id,
      image_type: image.image_type,
      alt_text: image.alt_text || '',
      is_primary: image.is_primary,
      file: null
    })
    setEditDialogOpen(true)
  }

  const handleUploadImage = () => {
    setFormData({
      carId: '',
      image_type: 'exterior',
      alt_text: '',
      is_primary: false,
      file: null
    })
    setUploadDialogOpen(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData({ ...formData, file })
    }
  }

  const handleUpload = async () => {
    if (!formData.file || !formData.carId) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadDialogOpen(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    console.log('Uploading image:', formData)
    // Add actual upload logic here
  }

  const handleDelete = (image: CarImageType) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (imageToDelete) {
      console.log('Deleting image:', imageToDelete.id)
      // Add API call here
      setDeleteDialogOpen(false)
      setImageToDelete(null)
    }
  }

  const handleBulkUpload = () => {
    setBulkUploadOpen(true)
  }

  const handleExport = () => {
    console.log('Exporting image data...')
    // Add export logic here
  }

  const handleApprove = (id: string) => {
    console.log('Approving image:', id)
    // Add API call here
  }

  const handleReject = (id: string) => {
    console.log('Rejecting image:', id)
    // Add API call here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Car Images Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<GetApp />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<Collections />} onClick={handleBulkUpload}>
            Bulk Upload
          </Button>
          <Button variant="contained" startIcon={<CloudUpload />} onClick={handleUploadImage}>
            Upload Image
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
                    Total Images
                  </Typography>
                  <Typography variant="h4">
                    {stats?.total || 0}
                  </Typography>
                </Box>
                <Image sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
                    Approved
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats?.approved || 0}
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
                    Pending Review
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats?.pending || 0}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
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
                    Total Storage
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {formatFileSize(stats?.totalSize || 0)}
                  </Typography>
                </Box>
                <PhotoCamera sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search images..."
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
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              {imageTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Car"
              value={carFilter}
              onChange={(e) => setCarFilter(e.target.value)}
            >
              <MenuItem value="all">All Cars</MenuItem>
              {mockCars.map((car) => (
                <MenuItem key={car.id} value={car.id}>
                  {car.make} {car.model} - {car.licensePlate}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setTypeFilter('all')
                setCarFilter('all')
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Images Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredImages.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No images found
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.image_url}
                alt={image.alt_text || 'Car image'}
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6" component="div" noWrap>
                    {image.carDetails?.make || 'Unknown'} {image.carDetails?.model || 'Model'}
                  </Typography>
                  {image.is_primary && (
                    <Chip label="Primary" size="small" color="primary" />
                  )}
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {image.carDetails?.licensePlate || 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom noWrap>
                  {image.alt_text || 'No description'}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Chip 
                    label={image.image_type} 
                    size="small" 
                    variant="outlined"
                  />
                  {image.status && (
                    <Chip
                      label={image.status}
                      size="small"
                      color={getStatusColor(image.status) as any}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {image.fileSize ? formatFileSize(image.fileSize) : 'Unknown size'} • {image.dimensions ? `${image.dimensions.width}x${image.dimensions.height}` : 'Unknown dimensions'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleViewImage(image)}>
                  <Visibility />
                </IconButton>
                <IconButton size="small" onClick={() => handleEditImage(image)}>
                  <Edit />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(image)}>
                  <Delete />
                </IconButton>
                {image.status === 'pending' && (
                  <>
                    <IconButton size="small" color="success" onClick={() => handleApprove(image.id)}>
                      <CheckCircle />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleReject(image.id)}>
                      <Warning />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
            </Grid>
            ))
          )}
        </Grid>
      )}

      {/* View Image Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Image Details</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.alt_text || 'Car image'}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Image Information</Typography>
                <Typography><strong>Car:</strong> {selectedImage.carDetails?.make || 'Unknown'} {selectedImage.carDetails?.model || 'Model'}</Typography>
                <Typography><strong>License Plate:</strong> {selectedImage.carDetails?.licensePlate || 'N/A'}</Typography>
                <Typography><strong>Type:</strong> {selectedImage.image_type}</Typography>
                <Typography><strong>Description:</strong> {selectedImage.alt_text || 'No description'}</Typography>
                {selectedImage.status && <Typography><strong>Status:</strong> {selectedImage.status}</Typography>}
                <Typography><strong>Primary Image:</strong> {selectedImage.is_primary ? 'Yes' : 'No'}</Typography>
                {selectedImage.fileSize && <Typography><strong>File Size:</strong> {formatFileSize(selectedImage.fileSize)}</Typography>}
                {selectedImage.dimensions && <Typography><strong>Dimensions:</strong> {selectedImage.dimensions.width}x{selectedImage.dimensions.height}</Typography>}
                <Typography><strong>Created:</strong> {new Date(selectedImage.created_at).toLocaleString()}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Image Dialog */}
      <Dialog open={uploadDialogOpen || editDialogOpen} onClose={() => {
        setUploadDialogOpen(false)
        setEditDialogOpen(false)
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editDialogOpen ? 'Edit Image' : 'Upload New Image'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Car"
                value={formData.carId}
                onChange={(e) => setFormData({...formData, carId: e.target.value})}
                sx={{ mb: 2 }}
              >
                {mockCars.map((car) => (
                  <MenuItem key={car.id} value={car.id}>
                    {car.make} {car.model} - {car.licensePlate}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Image Type"
                value={formData.image_type}
                onChange={(e) => setFormData({...formData, image_type: e.target.value as any})}
                sx={{ mb: 2 }}
              >
                {imageTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.alt_text}
                onChange={(e) => setFormData({...formData, alt_text: e.target.value})}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                    Select Image
                  </Button>
                </label>
                {formData.file && (
                  <Typography variant="body2">
                    {formData.file.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            {uploading && (
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="textSecondary" align="center">
                  Uploading... {uploadProgress}%
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setUploadDialogOpen(false)
            setEditDialogOpen(false)
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpload} disabled={uploading || !formData.file || !formData.carId}>
            {editDialogOpen ? 'Update' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadOpen} onClose={() => setBulkUploadOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Image Upload</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Select multiple images to upload. Make sure each image is named with the car ID and image type (e.g., car-1-exterior.jpg).
          </Alert>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="bulk-upload"
            type="file"
            multiple
          />
          <label htmlFor="bulk-upload">
            <Button variant="outlined" component="span" startIcon={<Collections />} fullWidth>
              Select Multiple Images
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkUploadOpen(false)}>Cancel</Button>
          <Button variant="contained">Start Bulk Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image for "{imageToDelete?.carDetails?.make || 'Unknown'} {imageToDelete?.carDetails?.model || 'Model'}"? This action cannot be undone.
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

export default CarImages