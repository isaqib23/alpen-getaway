import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';

/**
 * Simple spinner loader
 */
interface SpinnerLoaderProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
}

export const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
  size = 40,
  color = 'primary',
  message
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
    }}
  >
    <CircularProgress size={size} color={color} />
    {message && (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: 'center' }}
      >
        {message}
      </Typography>
    )}
  </Box>
);

/**
 * Full page loader
 */
interface FullPageLoaderProps {
  message?: string;
  backdrop?: boolean;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = 'Loading...',
  backdrop = true
}) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: backdrop ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      zIndex: 9999,
    }}
  >
    <CircularProgress size={60} />
    <Typography
      variant="h6"
      color="text.primary"
      sx={{ mt: 2, textAlign: 'center' }}
    >
      {message}
    </Typography>
  </Box>
);

/**
 * Linear progress loader
 */
interface LinearLoaderProps {
  progress?: number;
  message?: string;
  variant?: 'determinate' | 'indeterminate';
}

export const LinearLoader: React.FC<LinearLoaderProps> = ({
  progress,
  message,
  variant = 'indeterminate'
}) => (
  <Box sx={{ width: '100%', p: 2 }}>
    {message && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {message}
      </Typography>
    )}
    <LinearProgress
      variant={variant}
      value={progress}
      sx={{ height: 8, borderRadius: 4 }}
    />
    {variant === 'determinate' && progress !== undefined && (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, textAlign: 'right' }}
      >
        {Math.round(progress)}%
      </Typography>
    )}
  </Box>
);

/**
 * Card skeleton loader
 */
interface CardSkeletonProps {
  count?: number;
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 1,
  showAvatar = false,
  showImage = true,
  lines = 3
}) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <Card key={index} sx={{ mb: 2 }}>
        <CardContent>
          <Stack spacing={1}>
            {showAvatar && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ ml: 1, flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            )}
            
            {showImage && (
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            )}
            
            {Array.from({ length: lines }, (_, lineIndex) => (
              <Skeleton
                key={lineIndex}
                variant="text"
                width={lineIndex === lines - 1 ? '60%' : '100%'}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    ))}
  </>
);

/**
 * Table skeleton loader
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4
}) => (
  <Box sx={{ width: '100%' }}>
    {/* Header */}
    <Box sx={{ display: 'flex', gap: 2, mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
      {Array.from({ length: columns }, (_, index) => (
        <Skeleton key={index} variant="text" width="25%" height={40} />
      ))}
    </Box>
    
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            width="25%"
            height={colIndex === 0 ? 40 : 24}
          />
        ))}
      </Box>
    ))}
  </Box>
);

/**
 * Car list skeleton (specific to the app)
 */
interface CarListSkeletonProps {
  count?: number;
}

export const CarListSkeleton: React.FC<CarListSkeletonProps> = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <Card key={index} sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Car image */}
          <Skeleton variant="rectangular" width={250} height={150} />
          
          {/* Car info */}
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Stack>
            
            {/* Features */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Array.from({ length: 6 }, (_, featIndex) => (
                <Skeleton
                  key={featIndex}
                  variant="text"
                  width={80}
                  height={20}
                />
              ))}
            </Box>
          </Box>
          
          {/* Price section */}
          <Box sx={{ textAlign: 'center', minWidth: 120 }}>
            <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={40} />
          </Box>
        </Box>
      </Card>
    ))}
  </>
);

/**
 * Booking form skeleton
 */
export const BookingFormSkeleton: React.FC = () => (
  <Card sx={{ p: 3 }}>
    <Box sx={{ mb: 3 }}>
      {/* Progress stepper skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        {Array.from({ length: 3 }, (_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="circular" width={40} height={40} />
            {index < 2 && (
              <Skeleton variant="rectangular" width={60} height={2} sx={{ mx: 1 }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
    
    {/* Form fields */}
    <Stack spacing={3}>
      <Skeleton variant="text" width="30%" height={24} />
      
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} variant="rectangular" height={56} />
      ))}
      
      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Skeleton variant="rectangular" width={100} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Box>
    </Stack>
  </Card>
);

/**
 * Combined loading states component
 */
interface LoadingStateProps {
  type: 'spinner' | 'fullPage' | 'linear' | 'cardSkeleton' | 'tableSkeleton' | 'carList' | 'bookingForm';
  message?: string;
  [key: string]: any;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ type, ...props }) => {
  switch (type) {
    case 'spinner':
      return <SpinnerLoader {...props} />;
    case 'fullPage':
      return <FullPageLoader {...props} />;
    case 'linear':
      return <LinearLoader {...props} />;
    case 'cardSkeleton':
      // @ts-ignore - Component props compatibility
      return <CardSkeleton />;
    case 'tableSkeleton':
      // @ts-ignore - Component props compatibility
      return <TableSkeleton />;
    case 'carList':
      // @ts-ignore - Component props compatibility
      return <CarListSkeleton />;
    case 'bookingForm':
      // @ts-ignore - Component props compatibility
      return <BookingFormSkeleton />;
    default:
      return <SpinnerLoader {...props} />;
  }
};