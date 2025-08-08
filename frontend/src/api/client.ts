import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Base URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create main API client for authenticated requests
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create public API client for unauthenticated requests
export const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token management
const getToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('jwt_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('jwt_token');
};

// Request interceptor to add JWT token to authenticated requests
apiClient.interceptors.request.use(
  (config: any) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with comprehensive error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful API calls for debugging
    if (process.env.NODE_ENV === 'development') {
      console.debug(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    
    // Store last successful API call timestamp
    localStorage.setItem('lastApiCall', new Date().toISOString());
    
    return response;
  },
  (error) => {
    // Enhanced error handling with detailed logging
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString(),
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED'
    };

    console.error('API Error:', errorDetails);

    // Handle specific error scenarios
    if (error.response?.status === 401) {
      // Token expired or invalid, clear token and redirect to login
      removeToken();
      localStorage.removeItem('bc-user'); // Remove legacy user data
      
      // Show user-friendly message
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('authError', { 
          detail: { message: 'Your session has expired. Please sign in again.' } 
        }));
      }
      
      // Check if we're not already on a public page
      const currentPath = window.location.pathname;
      const publicPaths = ['/sign-in', '/sign-up', '/forgot-password', '/', '/about', '/contact'];
      
      if (!publicPaths.includes(currentPath)) {
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 2000); // Give time for user to see the message
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('permissionError', { 
          detail: { message: 'You don\'t have permission to access this resource.' } 
        }));
      }
    } else if (error.response?.status >= 500) {
      // Server errors
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('serverError', { 
          detail: { 
            message: 'Our servers are experiencing issues. Please try again later.',
            status: error.response.status
          } 
        }));
      }
    } else if (!error.response) {
      // Network errors
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('networkError', { 
          detail: { 
            message: navigator.onLine 
              ? 'Unable to connect to our servers. Please check your internet connection.' 
              : 'You appear to be offline. Please check your internet connection.'
          } 
        }));
      }
    }

    // Store error for debugging
    try {
      const recentErrors = JSON.parse(localStorage.getItem('recent_api_errors') || '[]');
      recentErrors.push(errorDetails);
      // Keep only last 5 errors
      if (recentErrors.length > 5) {
        recentErrors.splice(0, recentErrors.length - 5);
      }
      localStorage.setItem('recent_api_errors', JSON.stringify(recentErrors));
    } catch (e) {
      console.warn('Could not store error details:', e);
    }

    return Promise.reject(error);
  }
);

// Enhanced Public API response interceptor for general error handling
publicApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful public API calls for debugging
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Public API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    
    return response;
  },
  (error) => {
    // Enhanced error handling for public API
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString(),
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED',
      isPublicApi: true
    };

    console.error('Public API Error:', errorDetails);

    // Handle specific public API errors
    if (error.response?.status >= 500) {
      // Server errors for public API
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('publicApiServerError', { 
          detail: { 
            message: 'Service temporarily unavailable. Please try again later.',
            status: error.response.status
          } 
        }));
      }
    } else if (!error.response) {
      // Network errors for public API
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('publicApiNetworkError', { 
          detail: { 
            message: 'Unable to load content. Please check your internet connection.',
            url: error.config?.url
          } 
        }));
      }
    }

    return Promise.reject(error);
  }
);

// Token management utilities
export const authUtils = {
  getToken,
  setToken,
  removeToken,
  isAuthenticated: (): boolean => {
    const token = getToken();
    return !!token;
  },
};

// Export the authenticated API client as default
export default apiClient;