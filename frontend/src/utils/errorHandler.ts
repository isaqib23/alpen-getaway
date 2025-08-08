import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string | number;
  statusCode?: number;
  details?: any;
  timestamp: string;
  context?: string;
}

/**
 * API Error types
 */
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Create standardized error object
 */
export const createAppError = (
  message: string,
  code?: string | number,
  statusCode?: number,
  details?: any,
  context?: string
): AppError => ({
  message,
  code,
  statusCode,
  details,
  context,
  timestamp: new Date().toISOString(),
});

/**
 * Parse and standardize different types of errors
 */
export const parseError = (error: any, context?: string): AppError => {
  // Axios error
  if (error?.isAxiosError) {
    const axiosError = error as AxiosError;
    
    if (!axiosError.response) {
      // Network error
      return createAppError(
        'Unable to connect to the server. Please check your internet connection.',
        ApiErrorType.NETWORK_ERROR,
        0,
        { originalError: axiosError.message },
        context
      );
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data as any;

    switch (status) {
      case 400:
        return createAppError(
          data?.message || 'Invalid request. Please check your input.',
          ApiErrorType.VALIDATION_ERROR,
          status,
          data,
          context
        );
      
      case 401:
        return createAppError(
          'Your session has expired. Please sign in again.',
          ApiErrorType.AUTHENTICATION_ERROR,
          status,
          data,
          context
        );
      
      case 403:
        return createAppError(
          'You do not have permission to perform this action.',
          ApiErrorType.AUTHORIZATION_ERROR,
          status,
          data,
          context
        );
      
      case 404:
        return createAppError(
          data?.message || 'The requested resource was not found.',
          ApiErrorType.NOT_FOUND_ERROR,
          status,
          data,
          context
        );
      
      case 422:
        return createAppError(
          data?.message || 'Validation failed. Please check your input.',
          ApiErrorType.VALIDATION_ERROR,
          status,
          data,
          context
        );
      
      case 500:
      case 502:
      case 503:
      case 504:
        return createAppError(
          'Server error. Please try again later.',
          ApiErrorType.SERVER_ERROR,
          status,
          data,
          context
        );
      
      default:
        return createAppError(
          data?.message || `HTTP Error ${status}`,
          ApiErrorType.UNKNOWN_ERROR,
          status,
          data,
          context
        );
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return createAppError(
      error.message,
      ApiErrorType.UNKNOWN_ERROR,
      undefined,
      { stack: error.stack },
      context
    );
  }

  // String error
  if (typeof error === 'string') {
    return createAppError(
      error,
      ApiErrorType.UNKNOWN_ERROR,
      undefined,
      undefined,
      context
    );
  }

  // Object with message
  if (error?.message) {
    return createAppError(
      error.message,
      error.code || ApiErrorType.UNKNOWN_ERROR,
      error.statusCode,
      error,
      context
    );
  }

  // Fallback for unknown error types
  return createAppError(
    'An unexpected error occurred.',
    ApiErrorType.UNKNOWN_ERROR,
    undefined,
    error,
    context
  );
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: AppError): string => {
  // Check if it's a common error that needs a friendlier message
  switch (error.code) {
    case ApiErrorType.NETWORK_ERROR:
      return 'Please check your internet connection and try again.';
    
    case ApiErrorType.TIMEOUT_ERROR:
      return 'The request is taking longer than expected. Please try again.';
    
    case ApiErrorType.AUTHENTICATION_ERROR:
      return 'Your session has expired. Please sign in again.';
    
    case ApiErrorType.AUTHORIZATION_ERROR:
      return 'You do not have permission to perform this action.';
    
    case ApiErrorType.VALIDATION_ERROR:
      // Try to extract field-specific errors
      if (error.details?.errors && Array.isArray(error.details.errors)) {
        return error.details.errors.map((err: any) => err.message).join(', ');
      }
      return error.message;
    
    case ApiErrorType.NOT_FOUND_ERROR:
      return 'The requested information could not be found.';
    
    case ApiErrorType.SERVER_ERROR:
      return 'We are experiencing technical difficulties. Please try again later.';
    
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: AppError): boolean => {
  return [
    ApiErrorType.NETWORK_ERROR,
    ApiErrorType.TIMEOUT_ERROR,
    ApiErrorType.SERVER_ERROR
  ].includes(error.code as ApiErrorType);
};

/**
 * Log error to console with context
 */
export const logError = (error: AppError, additionalContext?: any) => {
  console.group(`🚨 App Error [${error.code}]`);
  console.error('Message:', error.message);
  console.error('Status Code:', error.statusCode);
  console.error('Timestamp:', error.timestamp);
  console.error('Context:', error.context);
  console.error('Details:', error.details);
  if (additionalContext) {
    console.error('Additional Context:', additionalContext);
  }
  console.groupEnd();
};

/**
 * React hook for error handling
 */
import { useState, useCallback } from 'react';

export interface UseErrorHandlerReturn {
  error: AppError | null;
  clearError: () => void;
  handleError: (error: any, context?: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any, context?: string) => {
    const parsedError = parseError(error, context);
    setError(parsedError);
    logError(parsedError);
    setLoading(false);
  }, []);

  return {
    error,
    clearError,
    handleError,
    isLoading,
    setLoading,
  };
};

/**
 * Error toast notification utility
 */
export const showErrorToast = (error: AppError | any, toastFunction?: (message: string) => void) => {
  const parsedError = error.message ? error : parseError(error);
  const message = getUserFriendlyMessage(parsedError);
  
  if (toastFunction) {
    toastFunction(message);
  } else {
    // Fallback to console if no toast function provided
    console.error('Error Toast:', message);
  }
};