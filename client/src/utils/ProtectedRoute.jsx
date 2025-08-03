//	Can restrict routes to authenticated users
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  // const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-purple-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

// Role-based protected route - requires specific role(s)
export const RoleProtectedRoute = ({ children, allowedRoles = [], redirectTo = "/listings" }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-purple-300 font-medium">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Admin only route
export const AdminRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['admin']}>
    {children}
  </RoleProtectedRoute>
);

// Landlord only route
export const LandlordRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['landlord']}>
    {children}
  </RoleProtectedRoute>
);

// Tenant only route
export const TenantRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['tenant']}>
    {children}
  </RoleProtectedRoute>
);

// Landlord or Admin route
export const LandlordOrAdminRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['landlord', 'admin']}>
    {children}
  </RoleProtectedRoute>
);

export default ProtectedRoute;