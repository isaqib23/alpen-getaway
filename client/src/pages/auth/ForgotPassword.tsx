import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Box,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  Typography,
} from '@mui/material'
import { Email, ArrowBack } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import AuthLayout from '../../components/layout/AuthLayout'

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
})

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false)
  const { forgotPassword, loading, error, clearError } = useAuth()

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      clearError()
      
      const result = await forgotPassword({ email: values.email })
      
      if (result.success) {
        setSuccess(true)
      }
      // Error handling is done by the useAuth hook
    },
  })

  if (success) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent password reset instructions to your email"
      >
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body1">
              If an account with email <strong>{formik.values.email}</strong> exists, 
              you will receive password reset instructions within a few minutes.
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Didn't receive the email? Check your spam folder or try again.
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setSuccess(false)
                formik.resetForm()
              }}
              fullWidth
            >
              Try Different Email
            </Button>

            <Link
              component={RouterLink}
              to="/auth/login"
              sx={{ textDecoration: 'none' }}
            >
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                fullWidth
              >
                Back to Sign In
              </Button>
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="Enter your email to receive reset instructions"
    >
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Enter the email address associated with your Alpen Getaway admin account, 
            and we'll send you instructions to reset your password.
          </Typography>
        </Alert>

        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          loading={loading}
          disabled={loading}
          sx={{
            mt: 2,
            mb: 2,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
        >
          {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
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

        <Box sx={{ mt: 3 }}>
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Development Mode:</strong> Password reset tokens will be logged to the server console. 
              In production, these would be sent via email.
            </Typography>
          </Alert>
        </Box>
      </Box>
    </AuthLayout>
  )
}

export default ForgotPassword