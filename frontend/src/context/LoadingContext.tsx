import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  addLoadingTask: (taskId: string) => void;
  removeLoadingTask: (taskId: string) => void;
  isPageLoading: boolean;
  setIsPageLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  // Start with initial loading task active
  const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set(['app-initial']));
  const [isPageLoading, setIsPageLoading] = useState(true);

  const addLoadingTask = useCallback((taskId: string) => {
    setLoadingTasks(prev => new Set(prev).add(taskId));
  }, []);

  const removeLoadingTask = useCallback((taskId: string) => {
    setLoadingTasks(prev => {
      const newTasks = new Set(prev);
      newTasks.delete(taskId);
      return newTasks;
    });
  }, []);
  
  // Remove initial loading task after a very short delay to allow React to mount
  useEffect(() => {
    const timer = setTimeout(() => {
      removeLoadingTask('app-initial');
    }, 50); // Very short delay to ensure proper mounting
    
    return () => clearTimeout(timer);
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    if (loading) {
      addLoadingTask('global');
    } else {
      removeLoadingTask('global');
    }
  }, [addLoadingTask, removeLoadingTask]);

  // Show loading when we have active tasks
  const isLoading = loadingTasks.size > 0;

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        addLoadingTask,
        removeLoadingTask,
        isPageLoading,
        setIsPageLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
