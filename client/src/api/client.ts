import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3010'}/api/v1`
console.log('🔧 API Base URL:', API_BASE_URL)
console.log('🔧 Environment variables:', import.meta.env)

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.config?.method?.toUpperCase(), error.config?.url, 'Status:', error.response?.status, 'Message:', error.message)
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient