import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Props:
 *   - children: the page component to render
 *   - role (optional): restrict to a specific role ('student', 'owner', 'admin')
 *   - skipVerification (optional): if true, allows access even if not verified
 *     (used for verification flow pages like /verify-account, /identity-verification)
 */
const ProtectedRoute = ({ children, role, skipVerification = false }) => {
  const {
    isAuthenticated, loading, user,
    isEmailVerified, isVerified, verificationStatus,
    accountStatus, hasUploadedDocs
  } = useAuth();
  const location = useLocation();

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

  // Account status checks (owner management controls)
  if (accountStatus === 'paused' || accountStatus === 'removed') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Role check — if a specific role is required and user doesn't match
  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Skip verification checks for verification flow pages and admin users
  if (skipVerification || user?.role === 'admin') {
    return children;
  }

  // ─── Verification Flow Gating ──────────────────
  // These checks redirect unverified users to the appropriate step

  // Step 1: Email not verified → go to OTP page
  if (!isEmailVerified) {
    if (location.pathname !== '/verify-account') {
      return <Navigate to="/verify-account" replace />;
    }
  }

  // Step 2: Email verified but no docs uploaded → go to document upload
  if (isEmailVerified && !hasUploadedDocs && verificationStatus !== 'verified') {
    if (location.pathname !== '/identity-verification') {
      return <Navigate to="/identity-verification" replace />;
    }
  }

  // Step 3: Docs uploaded but pending admin review → go to pending page
  if (isEmailVerified && hasUploadedDocs && verificationStatus === 'pending') {
    if (location.pathname !== '/pending-approval') {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  // Step 4: Rejected → re-upload documents
  if (verificationStatus === 'rejected') {
    if (location.pathname !== '/identity-verification') {
      return <Navigate to="/identity-verification" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
