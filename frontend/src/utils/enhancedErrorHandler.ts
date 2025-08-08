import { toast } from 'react-toastify';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  PERMISSION = 'permission',
  SERVER = 'server',
  CLIENT = 'client',
  PAYMENT = 'payment',
  BOOKING = 'booking',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

export interface ErrorDetails {
  type: ErrorType;
  message: string;
  originalError?: any;
  context?: string;
  statusCode?: number;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
}

// Error messages for different types
const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: 'Connection problem. Please check your internet connection.',
  [ErrorType.AUTH]: 'Authentication required. Please sign in again.',
  [ErrorType.PERMISSION]: 'You don\'t have permission to perform this action.',
  [ErrorType.SERVER]: 'Server error. Please try again later.',
  [ErrorType.CLIENT]: 'Something went wrong. Please refresh the page.',
  [ErrorType.PAYMENT]: 'Payment processing failed. Please try again.',
  [ErrorType.BOOKING]: 'Booking operation failed. Please try again.',
  [ErrorType.VALIDATION]: 'Please check your input and try again.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

// User-friendly messages for specific scenarios
const FRIENDLY_MESSAGES = {
  offline: 'You appear to be offline. Please check your internet connection.',
  timeout: 'Request took too long. Please try again.',
  serverDown: 'Our servers are currently unavailable. Please try again in a few minutes.',
  sessionExpired: 'Your session has expired. Please sign in again.',
  rateLimited: 'Too many requests. Please wait a moment and try again.',
  maintenance: 'System maintenance in progress. Please try again later.'
};

class EnhancedErrorHandler {
  private errorHistory: ErrorDetails[] = [];
  private maxHistorySize = 10;

  constructor() {
    // Load error history from localStorage
    try {
      const stored = localStorage.getItem('error_history');
      if (stored) {
        this.errorHistory = JSON.parse(stored).map((error: any) => ({
          ...error,
          timestamp: new Date(error.timestamp)
        }));
      }
    } catch (e) {
      console.warn('Could not load error history:', e);
    }
  }

  /**
   * Main error handling method
   */
  public handleError(error: any, context?: string, showToast: boolean = true): ErrorDetails {
    const errorDetails = this.analyzeError(error, context);
    
    // Log error
    console.error('Enhanced Error Handler:', errorDetails);
    
    // Store in history
    this.addToHistory(errorDetails);
    
    // Show user notification if requested
    if (showToast) {
      this.showUserNotification(errorDetails);
    }
    
    // Report to monitoring service (if available)
    this.reportError(errorDetails);
    
    return errorDetails;
  }

  /**
   * Analyze error and determine type
   */
  private analyzeError(error: any, context?: string): ErrorDetails {
    let type = ErrorType.UNKNOWN;
    let message = ERROR_MESSAGES[ErrorType.UNKNOWN];
    let statusCode: number | undefined;

    // Check if it's an axios error
    if (error.response) {
      statusCode = error.response.status;
      
      switch (statusCode) {
        case 401:
          type = ErrorType.AUTH;
          message = FRIENDLY_MESSAGES.sessionExpired;
          break;
        case 403:
          type = ErrorType.PERMISSION;
          message = ERROR_MESSAGES[ErrorType.PERMISSION];
          break;
        case 429:
          type = ErrorType.CLIENT;
          message = FRIENDLY_MESSAGES.rateLimited;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          type = ErrorType.SERVER;
          message = statusCode === 503 ? FRIENDLY_MESSAGES.maintenance : FRIENDLY_MESSAGES.serverDown;
          break;
        default:
          type = ErrorType.CLIENT;
          message = error.response.data?.message || ERROR_MESSAGES[ErrorType.CLIENT];
      }
    } else if (error.request) {
      // Network error
      type = ErrorType.NETWORK;
      message = navigator.onLine ? ERROR_MESSAGES[ErrorType.NETWORK] : FRIENDLY_MESSAGES.offline;
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      type = ErrorType.NETWORK;
      message = FRIENDLY_MESSAGES.timeout;
    } else {
      // JavaScript error or other
      type = this.categorizeByContext(error, context);
      message = this.getContextualMessage(error, context);
    }

    return {
      type,
      message,
      originalError: error,
      context,
      statusCode,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };
  }

  /**
   * Categorize error by context
   */
  private categorizeByContext(error: any, context?: string): ErrorType {
    if (!context) return ErrorType.UNKNOWN;
    
    if (context.toLowerCase().includes('payment')) return ErrorType.PAYMENT;
    if (context.toLowerCase().includes('booking')) return ErrorType.BOOKING;
    if (context.toLowerCase().includes('auth')) return ErrorType.AUTH;
    if (context.toLowerCase().includes('validation')) return ErrorType.VALIDATION;
    
    return ErrorType.CLIENT;
  }

  /**
   * Get contextual error message
   */
  private getContextualMessage(error: any, context?: string): string {
    if (error.message && typeof error.message === 'string') {
      // Try to make error messages more user-friendly
      const message = error.message.toLowerCase();
      
      if (message.includes('network') || message.includes('fetch')) {
        return ERROR_MESSAGES[ErrorType.NETWORK];
      }
      if (message.includes('unauthorized') || message.includes('token')) {
        return ERROR_MESSAGES[ErrorType.AUTH];
      }
      if (message.includes('validation') || message.includes('invalid')) {
        return ERROR_MESSAGES[ErrorType.VALIDATION];
      }
    }
    
    return context ? `${context} failed. Please try again.` : ERROR_MESSAGES[ErrorType.UNKNOWN];
  }

  /**
   * Show user notification
   */
  private showUserNotification(errorDetails: ErrorDetails): void {
    const toastOptions = {
      position: 'top-right' as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (errorDetails.type) {
      case ErrorType.NETWORK:
        toast.error(errorDetails.message, {
          ...toastOptions,
          toastId: 'network-error' // Prevent duplicate network error toasts
        });
        break;
      case ErrorType.AUTH:
        toast.warn(errorDetails.message, {
          ...toastOptions,
          autoClose: 8000,
          toastId: 'auth-error'
        });
        break;
      case ErrorType.SERVER:
        toast.error(errorDetails.message, {
          ...toastOptions,
          autoClose: 8000,
          toastId: 'server-error'
        });
        break;
      case ErrorType.PAYMENT:
        toast.error(errorDetails.message, {
          ...toastOptions,
          autoClose: 8000
        });
        break;
      default:
        toast.error(errorDetails.message, toastOptions);
    }
  }

  /**
   * Add error to history
   */
  private addToHistory(errorDetails: ErrorDetails): void {
    this.errorHistory.unshift(errorDetails);
    
    // Keep only recent errors
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
    
    // Store in localStorage
    try {
      localStorage.setItem('error_history', JSON.stringify(this.errorHistory));
    } catch (e) {
      console.warn('Could not store error history:', e);
    }
  }

  /**
   * Report error to monitoring service
   */
  private reportError(errorDetails: ErrorDetails): void {
    try {
      // This would integrate with your error monitoring service
      // For now, we'll just log it
      const reportData = {
        ...errorDetails,
        environment: process.env.NODE_ENV,
        buildVersion: process.env.REACT_APP_VERSION || 'unknown'
      };
      
      // Example: Send to monitoring service
      // if (window.Sentry) {
      //   window.Sentry.captureException(errorDetails.originalError, {
      //     tags: {
      //       errorType: errorDetails.type,
      //       context: errorDetails.context
      //     },
      //     extra: reportData
      //   });
      // }
      
      console.debug('Error reported to monitoring:', reportData);
    } catch (e) {
      console.warn('Could not report error to monitoring:', e);
    }
  }

  /**
   * Get current user ID for error tracking
   */
  private getCurrentUserId(): string | undefined {
    try {
      const user = JSON.parse(localStorage.getItem('bc-user') || '{}');
      return user.id || user._id;
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Get error history
   */
  public getErrorHistory(): ErrorDetails[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  public clearHistory(): void {
    this.errorHistory = [];
    localStorage.removeItem('error_history');
  }

  /**
   * Check if there are recent similar errors (for preventing spam)
   */
  public hasRecentSimilarError(error: any, timeWindowMs: number = 10000): boolean {
    const now = new Date();
    const cutoff = new Date(now.getTime() - timeWindowMs);
    
    const errorMessage = error?.message || error?.response?.data?.message || 'unknown';
    
    return this.errorHistory.some(historical => 
      historical.timestamp > cutoff && 
      (historical.message === errorMessage || 
       historical.originalError?.message === errorMessage)
    );
  }
}

// Create singleton instance
export const errorHandler = new EnhancedErrorHandler();

// Convenience functions for different error types
export const handleNetworkError = (error: any, context?: string) => 
  errorHandler.handleError(error, context);

export const handleAuthError = (error: any, context?: string) => 
  errorHandler.handleError(error, context);

export const handlePaymentError = (error: any, context?: string) => 
  errorHandler.handleError(error, context);

export const handleBookingError = (error: any, context?: string) => 
  errorHandler.handleError(error, context);

// Silent error handling (no toast notification)
export const handleSilentError = (error: any, context?: string) => 
  errorHandler.handleError(error, context, false);