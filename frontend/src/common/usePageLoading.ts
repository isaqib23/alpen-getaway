import { useEffect, useRef } from 'react';
import { useLoading } from '../context/LoadingContext';

interface UsePageLoadingOptions {
  taskId?: string;
  dependencies?: any[];
  timeout?: number;
}

/**
 * Hook to manage page-level loading state
 * Call this hook in page components to indicate when they're done loading
 */
export const usePageLoading = (options: UsePageLoadingOptions = {}) => {
  const { 
    taskId = 'page-content', 
    dependencies = [], 
    timeout = 10000 // Failsafe timeout increased to 10 seconds
  } = options;
  
  const { addLoadingTask, removeLoadingTask } = useLoading();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;
    
    // Add loading task when component mounts
    addLoadingTask(taskId);
    
    // Set a failsafe timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      if (!isUnmountedRef.current) {
        console.warn(`Loading task ${taskId} timed out after ${timeout}ms`);
        removeLoadingTask(taskId);
      }
    }, timeout);

    return () => {
      isUnmountedRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      removeLoadingTask(taskId);
    };
  }, [taskId]); // Only depend on taskId to prevent re-renders

  // Handle dependencies separately with a simpler approach
  useEffect(() => {
    if (dependencies.length > 0) {
      const allReady = dependencies.every(dep => dep !== null && dep !== undefined && dep !== false);
      if (allReady && !isUnmountedRef.current) {
        removeLoadingTask(taskId);
      }
    }
  }, dependencies); // This will only run when actual dependencies change

  return {
    markAsLoaded: () => {
      if (!isUnmountedRef.current) {
        removeLoadingTask(taskId);
      }
    },
    markAsLoading: () => {
      if (!isUnmountedRef.current) {
        addLoadingTask(taskId);
      }
    },
  };
};
