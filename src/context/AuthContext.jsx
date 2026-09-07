import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser, getMe, updateProfile } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Derived verification helpers
  const isEmailVerified = user?.is_email_verified === true;
  const isVerified = user?.verification_status === 'verified';
  const verificationStatus = user?.verification_status || 'pending';
  const accountStatus = user?.account_status || 'active';
  const hasUploadedDocs = user?.verification_docs && user.verification_docs.length > 0;

  // On mount, check if we have a saved token and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const data = await getMe();
          setUser(data.user);
          setToken(savedToken);
        } catch (err) {
          // Token is invalid/expired — clear it
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  /**
   * Update the current user's profile via the API.
   * Refreshes the user state with the updated data from the server.
   */
  const updateUser = async (profileData) => {
    const data = await updateProfile(profileData);
    setUser(data.user);
    return data;
  };

  /**
   * Refresh user data from the server (e.g., after OTP verification or admin approval).
   */
  const refreshUser = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Failed to refresh user:", err);
      return null;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    // Verification helpers
    isEmailVerified,
    isVerified,
    verificationStatus,
    accountStatus,
    hasUploadedDocs,
    // Actions
    register,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
