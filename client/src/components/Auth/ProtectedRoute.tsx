import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AuthProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  // If still loading auth state, show nothing or a loading indicator
  if (isLoading) {
    return null;
  }
  
  // If user is authenticated, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the auth page
  return <Outlet />;
};

export const PrivateRoute = () => {
  const { user, isLoading } = useAuth();
  
  // If still loading auth state, show nothing or a loading indicator
  if (isLoading) {
    return null;
  }
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Otherwise, render the protected content
  return <Outlet />;
}; 