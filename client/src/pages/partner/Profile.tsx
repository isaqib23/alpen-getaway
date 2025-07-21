// @ts-nocheck
import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Business,
  Edit,
  Save,
  Cancel,
  Email,
  Phone,
  LocationOn,
  Language,
  Person,
  VerifiedUser,
  AttachMoney,
  DirectionsCar,
  People,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { companiesAPI } from '../../api/companies'
import { authAPI } from '../../api/auth'
import { Company } from '../../types/api'

const validationSchema = Yup.object({
  company_name: Yup.string().required('Company name is required'),
  company_email: Yup.string().email('Invalid email format').required('Company email is required'),
  company_contact_number: Yup.string().required('Contact number is required'),
  company_representative: Yup.string().required('Company representative is required'),
  address: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  postal_code: Yup.string(),
  country: Yup.string(),
  website: Yup.string().url('Invalid URL format'),
  contact_person: Yup.string(),
  tax_id: Yup.string(),
})

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
})

const PartnerProfile = () => {
  const [profile, setProfile] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  
  // Password change states
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      company_name: '',
      company_email: '',
      company_contact_number: '',
      company_representative: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      website: '',
      contact_person: '',
      tax_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSaving(true)
      setError(null)
      setSuccess(null)

      try {
        const updatedProfile = await companiesAPI.updatePartnerProfile(values)
        setProfile(updatedProfile)
        setEditMode(false)
        setSuccess('Profile updated successfully!')
        setTimeout(() => setSuccess(null), 5000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update profile')
      } finally {
        setSaving(false)
      }
    },
  })

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setPasswordLoading(true)
      setPasswordError(null)
      setPasswordSuccess(null)

      try {
        await authAPI.changePassword(values)
        setPasswordSuccess('Password changed successfully!')
        resetForm()
        setTimeout(() => setPasswordSuccess(null), 5000)
      } catch (err: any) {
        setPasswordError(err.response?.data?.message || 'Failed to change password')
      } finally {
        setPasswordLoading(false)
      }
    },
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await companiesAPI.getPartnerProfile()
      setProfile(data)
      
      // Initialize form with profile data
      formik.setValues({
        company_name: data.company_name || '',
        company_email: data.company_email || '',
        company_contact_number: data.company_contact_number || '',
        company_representative: data.company_representative || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        postal_code: data.postal_code || '',
        country: data.country || '',
        website: data.website || '',
        contact_person: data.contact_person || '',
        tax_id: data.tax_id || '',
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (editMode) {
      setConfirmDialog(true)
    } else {
      setEditMode(true)
    }
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setConfirmDialog(false)
    // Reset form to original values
    if (profile) {
      formik.setValues({
        company_name: profile.company_name || '',
        company_email: profile.company_email || '',
        company_contact_number: profile.company_contact_number || '',
        company_representative: profile.company_representative || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
        website: profile.website || '',
        contact_person: profile.contact_person || '',
        tax_id: profile.tax_id || '',
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'REJECTED':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error && !profile) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadProfile}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Partner Profile
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your company profile and business information
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 3, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    <Business fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {profile?.company_name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Chip
                        label={profile?.status || 'Unknown'}
                        color={getStatusColor(profile?.status || '')}
                        size="small"
                        icon={<VerifiedUser />}
                      />
                      <Chip
                        label={profile?.company_type || 'N/A'}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Member since {new Date(profile?.created_at || '').toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={handleEditToggle}
                    disabled={saving}
                  >
                    {editMode ? <Cancel /> : <Edit />}
                  </IconButton>
                  {editMode && (
                    <IconButton
                      color="success"
                      onClick={() => formik.handleSubmit()}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={24} /> : <Save />}
                    </IconButton>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <DirectionsCar color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {profile?.cars?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fleet Vehicles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {profile?.drivers?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Drivers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AttachMoney color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {profile?.commission_rate || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Commission Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Business color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {profile?.company_registration_number ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Registered
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Company Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="company_name"
                    value={formik.values.company_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                    helperText={formik.touched.company_name && formik.errors.company_name}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Email"
                    name="company_email"
                    type="email"
                    value={formik.values.company_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.company_email && Boolean(formik.errors.company_email)}
                    helperText={formik.touched.company_email && formik.errors.company_email}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="company_contact_number"
                    value={formik.values.company_contact_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.company_contact_number && Boolean(formik.errors.company_contact_number)}
                    helperText={formik.touched.company_contact_number && formik.errors.company_contact_number}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Representative"
                    name="company_representative"
                    value={formik.values.company_representative}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.company_representative && Boolean(formik.errors.company_representative)}
                    helperText={formik.touched.company_representative && formik.errors.company_representative}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Person"
                    name="contact_person"
                    value={formik.values.contact_person}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contact_person && Boolean(formik.errors.contact_person)}
                    helperText={formik.touched.contact_person && formik.errors.contact_person}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="website"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.website && Boolean(formik.errors.website)}
                    helperText={formik.touched.website && formik.errors.website}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="postal_code"
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                    helperText={formik.touched.postal_code && formik.errors.postal_code}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                    helperText={formik.touched.country && formik.errors.country}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tax ID"
                    name="tax_id"
                    value={formik.values.tax_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tax_id && Boolean(formik.errors.tax_id)}
                    helperText={formik.touched.tax_id && formik.errors.tax_id}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Business Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Business Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Registration Number
              </Typography>
              <Typography variant="body1">
                {profile?.company_registration_number || 'Not provided'}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Registration Country
              </Typography>
              <Typography variant="body1">
                {profile?.registration_country || 'Not provided'}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Service Area Province
              </Typography>
              <Typography variant="body1">
                {profile?.service_area_province || 'Not specified'}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Company Type
              </Typography>
              <Typography variant="body1">
                {profile?.company_type || 'Not specified'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Profile Status
              </Typography>
              <Chip
                label={profile?.status || 'Unknown'}
                color={getStatusColor(profile?.status || '')}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Change Password Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Password Success/Error Messages */}
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordSuccess}
              </Alert>
            )}
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            <form onSubmit={passwordFormik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                    helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                    disabled={passwordLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                    helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                    disabled={passwordLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                    helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                    disabled={passwordLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={passwordLoading || !passwordFormik.isValid}
                    startIcon={passwordLoading ? <CircularProgress size={20} /> : null}
                    fullWidth
                  >
                    {passwordLoading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Cancel Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your changes? All unsaved changes will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            Continue Editing
          </Button>
          <Button onClick={handleCancelEdit} color="error" variant="contained">
            Cancel Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PartnerProfile