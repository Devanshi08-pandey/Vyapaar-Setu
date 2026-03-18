import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-void flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    const dashboardPath = user.role === 'vendor' ? '/vendor-dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default PublicRoute;
