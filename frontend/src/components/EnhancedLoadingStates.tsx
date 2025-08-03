import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  Button,
  Fade,
  Backdrop,
  Chip,
} from '@mui/material';
import {
  CloudSync as SyncIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  WifiOff as OfflineIcon,
} from '@mui/icons-material';

/**
 * Enhanced spinner loader with timeout and progress indication
 */
interface EnhancedSpinnerProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
  subMessage?: string;
  timeout?: number;
  onTimeout?: () => void;
  showProgress?: boolean;
  progressValue?: number;
  variant?: 'circular' | 'linear';
}

export const EnhancedSpinner: React.FC<EnhancedSpinnerProps> = ({
  size = 40,
  color = 'primary',
  message,
  subMessage,
  timeout = 30000, // 30 seconds default
  onTimeout,
  showProgress = false,
  progressValue = 0,
  variant = 'circular'
}) => {
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1000);
    }, 1000);

    const timer = setTimeout(() => {
      setTimeoutReached(true);
      onTimeout?.();
    }, timeout);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [timeout, onTimeout]);

  const formatElapsedTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  if (timeoutReached) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Request Taking Longer Than Expected
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This is taking longer than usual. You can wait or try refreshing.
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          variant="outlined"
        >
          Refresh Page
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      {variant === 'circular' ? (
        <CircularProgress 
          size={size} 
          color={color}
          variant={showProgress ? 'determinate' : 'indeterminate'}
          value={showProgress ? progressValue : undefined}
        />
      ) : (
        <Box sx={{ width: '100%', maxWidth: 300, mb: 2 }}>
          <LinearProgress 
            color={color}
            variant={showProgress ? 'determinate' : 'indeterminate'}
            value={showProgress ? progressValue : undefined}
          />
        </Box>
      )}
      
      {message && (
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
      
      {subMessage && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, textAlign: 'center' }}
        >
          {subMessage}
        </Typography>
      )}
      
      {showProgress && progressValue > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {Math.round(progressValue)}% complete
        </Typography>
      )}
      
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {formatElapsedTime(elapsedTime)}
      </Typography>
    </Box>
  );
};

/**
 * Status indicator with different states
 */
interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'warning' | 'offline';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  persistent?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  action,
  onClose,
  persistent = false
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <CircularProgress size={20} />,
          color: 'info' as const,
          severity: 'info' as const
        };
      case 'success':
        return {
          icon: <SuccessIcon />,
          color: 'success' as const,
          severity: 'success' as const
        };
      case 'error':
        return {
          icon: <ErrorIcon />,
          color: 'error' as const,
          severity: 'error' as const
        };
      case 'warning':
        return {
          icon: <WarningIcon />,
          color: 'warning' as const,
          severity: 'warning' as const
        };
      case 'offline':
        return {
          icon: <OfflineIcon />,
          color: 'warning' as const,
          severity: 'warning' as const
        };
      default:
        return {
          icon: <SyncIcon />,
          color: 'info' as const,
          severity: 'info' as const
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Fade in>
      <Alert
        severity={config.severity}
        icon={config.icon}
        action={
          <Stack direction="row" spacing={1}>
            {action && (
              <Button
                color={config.color}
                size="small"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {!persistent && onClose && (
              <Button
                color={config.color}
                size="small"
                onClick={onClose}
              >
                Dismiss
              </Button>
            )}
          </Stack>
        }
        sx={{ mb: 2 }}
      >
        {message}
      </Alert>
    </Fade>
  );
};

/**
 * Connection status indicator
 */
export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <Chip
        icon={<OfflineIcon />}
        label="You're offline"
        color="warning"
        variant="filled"
        sx={{
          fontWeight: 500,
          '& .MuiChip-icon': {
            color: 'warning.contrastText'
          }
        }}
      />
    </Box>
  );
};

/**
 * Full page loading overlay
 */
interface LoadingOverlayProps {
  open: boolean;
  message?: string;
  subMessage?: string;
  onCancel?: () => void;
  cancelText?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Loading...',
  subMessage,
  onCancel,
  cancelText = 'Cancel'
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}
      open={open}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
      {subMessage && (
        <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
          {subMessage}
        </Typography>
      )}
      {onCancel && (
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          {cancelText}
        </Button>
      )}
    </Backdrop>
  );
};

/**
 * Booking specific loading states
 */
export const BookingLoadingState: React.FC<{ stage: 'checking' | 'booking' | 'payment' | 'confirming' }> = ({ stage }) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'checking':
        return {
          message: 'Checking availability...',
          subMessage: 'Verifying car and route availability',
          progress: 25
        };
      case 'booking':
        return {
          message: 'Creating your booking...',
          subMessage: 'Securing your reservation',
          progress: 50
        };
      case 'payment':
        return {
          message: 'Processing payment...',
          subMessage: 'Securely processing your payment information',
          progress: 75
        };
      case 'confirming':
        return {
          message: 'Confirming your booking...',
          subMessage: 'Finalizing all details',
          progress: 90
        };
      default:
        return {
          message: 'Processing...',
          subMessage: 'Please wait',
          progress: 0
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', my: 4 }}>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        <EnhancedSpinner
          size={50}
          message={stageInfo.message}
          subMessage={stageInfo.subMessage}
          showProgress={true}
          progressValue={stageInfo.progress}
          variant="circular"
        />
      </CardContent>
    </Card>
  );
};

/**
 * Data loading skeleton for lists
 */
interface DataSkeletonProps {
  rows?: number;
  columns?: number;
  height?: number;
}

export const DataSkeleton: React.FC<DataSkeletonProps> = ({
  rows = 5,
  columns = 3,
  height = 60
}) => {
  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Stack
          key={rowIndex}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ height }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rectangular"
              height={height * 0.6}
              sx={{ flex: colIndex === 0 ? '2' : '1', borderRadius: 1 }}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

/**
 * Hook for managing loading states
 */
export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setLoadingError = (errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
    setSuccess(null);
  };

  const setLoadingSuccess = (successMessage: string) => {
    setLoading(false);
    setError(null);
    setSuccess(successMessage);
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(null);
  };

  return {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    setLoadingError,
    setLoadingSuccess,
    reset
  };
};