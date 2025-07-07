import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import AuthLayout from '../../components/layout/AuthLayout'

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be at least 6 characters')
    .required('Password is required'),
})

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, clearError } = useAuth()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      clearError()
      
      const result = await login({
        email: values.email,
        password: values.password,
      })
      
      if (result.success) {
        // Navigate to dashboard on successful login
        navigate('/dashboard')
      }
      // Error handling is done by the useAuth hook
    },
  })

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your Alpen Getaway admin account"
    >
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
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
                  onClick={handleTogglePassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                color="primary"
              />
            }
            label="Remember me"
          />
          
          <Link
            component={RouterLink}
            to="/auth/forgot-password"
            variant="body2"
            sx={{ textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </Box>

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
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Admin Credentials:</strong><br />
            Email: admin@ridebooking.com<br />
            Password: password123
          </Alert>
        </Box>
      </Box>
    </AuthLayout>
  )
}

export default Login