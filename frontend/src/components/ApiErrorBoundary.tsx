import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Alert, 
  Button, 
  Container, 
  Typography, 
  Box,
  Paper,
  Stack
} from '@mui/material';
import { 
  CloudOff,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isApiError: boolean;
  retryCount: number;
}

// API Error patterns to detect
const API_ERROR_PATTERNS = [
  /network error/i,
  /fetch/i,
  /xhr/i,
  /timeout/i,
  /connection/i,
  /502|503|504/,
  /bad gateway/i,
  /service unavailable/i,
  /gateway timeout/i,
];

class ApiErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isApiError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const isApiError = ApiErrorBoundary.isApiRelatedError(error);
    
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      isApiError
    };
  }

  private static isApiRelatedError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    const stackTrace = (error.stack || '').toLowerCase();
    
    return API_ERROR_PATTERNS.some(pattern => 
      pattern.test(errorMessage) || pattern.test(stackTrace)
    );
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ApiErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      isApiError: ApiErrorBoundary.isApiRelatedError(error)
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log API errors specifically
    this.logApiError(error, errorInfo);
  }

  private logApiError(error: Error, errorInfo: ErrorInfo) {
    try {
      const apiErrorData = {
        type: 'api_error',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        isApiError: this.state.isApiError,
        retryCount: this.state.retryCount,
        // Additional context for API errors
        networkStatus: navigator.onLine ? 'online' : 'offline',
        lastActivity: localStorage.getItem('lastApiCall') || 'unknown'
      };
      
      console.warn('API Error logged:', apiErrorData);
      
      // Store in localStorage for debugging
      try {
        const errorHistory = JSON.parse(localStorage.getItem('api_error_history') || '[]');
        errorHistory.push(apiErrorData);
        // Keep only last 10 errors
        if (errorHistory.length > 10) {
          errorHistory.splice(0, errorHistory.length - 10);
        }
        localStorage.setItem('api_error_history', JSON.stringify(errorHistory));
      } catch (storageError) {
        console.warn('Could not store error in localStorage:', storageError);
      }
      
    } catch (loggingError) {
      console.error('Failed to log API error:', loggingError);
    }
  }

  private handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    if (newRetryCount <= this.maxRetries) {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        retryCount: newRetryCount
      });
    } else {
      // Max retries reached, show different UI
      this.setState({
        retryCount: newRetryCount
      });
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private getErrorMessage(): string {
    if (!this.state.error) return 'Unknown error occurred';
    
    if (this.state.isApiError) {
      if (!navigator.onLine) {
        return 'You appear to be offline. Please check your internet connection.';
      }
      return 'There was a problem connecting to our servers. This might be a temporary issue.';
    }
    
    return 'An unexpected error occurred while loading this content.';
  }

  private getErrorTitle(): string {
    if (this.state.isApiError) {
      if (!navigator.onLine) {
        return 'Connection Lost';
      }
      return 'Service Temporarily Unavailable';
    }
    
    return 'Something Went Wrong';
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const errorTitle = this.getErrorTitle();
      const errorMessage = this.getErrorMessage();

      // Default error UI with API-specific messaging
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: this.state.isApiError ? '#fff3e0' : '#fafafa'
            }}
          >
            <Box sx={{ mb: 3 }}>
              {this.state.isApiError ? (
                <CloudOff 
                  sx={{ 
                    fontSize: 60, 
                    color: 'warning.main',
                    mb: 2
                  }} 
                />
              ) : (
                <WarningIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: 'error.main',
                    mb: 2
                  }} 
                />
              )}
              
              <Typography variant="h4" component="h1" gutterBottom>
                {errorTitle}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {errorMessage}
              </Typography>

              {/* Retry attempts indicator */}
              {this.state.retryCount > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Retry attempts: {this.state.retryCount} / {this.maxRetries}
                </Typography>
              )}

              {/* Network status for API errors */}
              {this.state.isApiError && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Network Status: {navigator.onLine ? '🟢 Online' : '🔴 Offline'}
                </Typography>
              )}
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              {canRetry && (
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                  color={this.state.isApiError ? "warning" : "primary"}
                >
                  Try Again {this.state.retryCount > 0 && `(${this.maxRetries - this.state.retryCount} left)`}
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            </Stack>

            {/* Max retries reached message */}
            {!canRetry && this.state.retryCount > this.maxRetries && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Maximum retry attempts reached. Please try reloading the page or contact support if the problem persists.
                </Typography>
              </Alert>
            )}

            {/* API-specific help text */}
            {this.state.isApiError && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Troubleshooting tips:</strong><br />
                  • Check your internet connection<br />
                  • Try refreshing the page<br />
                  • Clear your browser cache<br />
                  • If the problem persists, our servers might be temporarily down
                </Typography>
              </Alert>
            )}

            {/* Development mode error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert 
                severity="error" 
                sx={{ 
                  textAlign: 'left',
                  mt: 3,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  <strong>Error Details (Development Mode):</strong>
                </Typography>
                <Typography variant="body2" component="pre" sx={{ 
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  Error Type: {this.state.isApiError ? 'API Error' : 'Application Error'}
                  {'\n'}
                  Message: {this.state.error.message}
                  {'\n\n'}
                  Stack: {this.state.error.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </Typography>
              </Alert>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;