// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

const ProtectedRoute = ({ children, user, loading }) => {
  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen={true} text="Checking authentication..." />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;