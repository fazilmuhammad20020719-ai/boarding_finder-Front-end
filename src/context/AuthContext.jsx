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

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
