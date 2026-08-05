import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Props:
 *   - children: the page component to render
 *   - role (optional): restrict to a specific role ('student', 'owner', 'admin')
 */
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // While checking auth status, show a simple loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#1952c4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="text-sm font-semibold text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check — if a specific role is required and user doesn't match
  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
