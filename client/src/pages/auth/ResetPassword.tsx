import { useState } from 'react'
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff, Lock, ArrowBack } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import AuthLayout from '../../components/layout/AuthLayout'
import { useAuth } from '../../hooks/useAuth'

const validationSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'Password should be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
})

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const { resetPassword, loading, error, clearError } = useAuth()

  const token = searchParams.get('token')

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!token) {
        return
      }

      clearError()
      
      const result = await resetPassword({
        token,
        newPassword: values.newPassword,
      })
      
      if (result.success) {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login')
        }, 3000)
      }
    },
  })

  // If no token provided
  if (!token) {
    return (
      <AuthLayout 
        title="Invalid Reset Link" 
        subtitle="The password reset link appears to be invalid"
      >
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            This password reset link is invalid or has expired. Please request a new password reset.
          </Alert>

          <Link
            component={RouterLink}
            to="/auth/forgot-password"
            sx={{ textDecoration: 'none' }}
          >
            <Button variant="contained" fullWidth>
              Request New Reset Link
            </Button>
          </Link>

          <Box sx={{ mt: 2 }}>
            <Link
              component={RouterLink}
              to="/auth/login"
              variant="body2"
              sx={{ 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ArrowBack fontSize="small" />
              Back to Sign In
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    )
  }

  // Success state
  if (success) {
    return (
      <AuthLayout 
        title="Password Reset Successful" 
        subtitle="Your password has been successfully reset"
      >
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Your password has been successfully reset. You can now sign in with your new password.
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Alert severity="info">
              You will be automatically redirected to the sign in page in a few seconds...
            </Alert>
          </Box>

          <Link
            component={RouterLink}
            to="/auth/login"
            sx={{ textDecoration: 'none' }}
          >
            <Button variant="contained" fullWidth>
              Sign In Now
            </Button>
          </Link>
        </Box>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Reset Your Password" 
      subtitle="Enter your new password below"
    >
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          id="newPassword"
          name="newPassword"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 2,
            mb: 2,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link
            component={RouterLink}
            to="/auth/login"
            variant="body2"
            sx={{ 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ArrowBack fontSize="small" />
            Back to Sign In
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  )
}

export default ResetPassword