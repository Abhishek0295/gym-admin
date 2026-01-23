import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = ['admin']
}) => {

  console.log("I Am working");

  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Show loading while auth state is being determined
  if (isAuthenticated === undefined) {
    return <LoadingSpinner size="lg" className="h-screen" />;
  }

  if (!isAuthenticated) {
    console.log("isAuthenticated", isAuthenticated);

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && requiredRole.length > 0 && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;