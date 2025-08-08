import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const globalContext = useGlobalContext();
  const location = useLocation();

  if (!globalContext) {
    // Context not available, redirect to sign-in
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const { isAuthenticated } = globalContext;

  if (!isAuthenticated) {
    // User is not authenticated, redirect to sign-in with return URL
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;