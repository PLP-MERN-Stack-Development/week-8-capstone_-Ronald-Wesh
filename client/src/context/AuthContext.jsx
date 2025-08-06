// // used to manage login, registration, user session, and authorization state globally in your frontend app.
// //  creates a global Auth context that:
// // Checks if a user is already logged in when the app starts
// //  Logs in a user and stores token + user info
// // Registers a user
// // Logs out a user
// // Shares the auth state (user, isAdmin, isAuthenticated, etc.) with the rest of your app

// // Manages login/register/logout + persists user session
// //Connected to: authAPI (API requests), localStorage, AuthContext
// //Why it's essential: Gives every component access to user data (like role, token)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Initializing auth with:', { hasToken: !!token, hasUser: !!userData });
      
      if (token && userData) {
        try {
          // Parse stored user data
          const parsedUser = JSON.parse(userData);
          console.log('Found stored user:', parsedUser);
          
          // Set user immediately for better UX
          setUser(parsedUser);
          
          // Verify token is still valid by calling backend
          const response = await authAPI.getMe();
          const currentUser = response.data;
          
          console.log('Token verified, current user:', currentUser);
          
          // Update user data with latest from backend
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          console.error('Token verification failed:', error);
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        console.log('No stored auth data found');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      // Backend should return: { token, user: { id, name, email, role, ... } }
      const { token, user: userData, ...otherData } = response.data;
      
      // Handle different response structures
      const finalUserData = userData || { ...otherData };
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(finalUserData));
      setUser(finalUserData);
      
      toast.success(`Welcome back, ${finalUserData.name || finalUserData.email}!`);
      return { success: true, user: finalUserData };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      // Backend should return: { token, user: { id, name, email, role, ... } }
      const { token, user: newUserData, ...otherData } = response.data;
      
      // Handle different response structures
      const finalUserData = newUserData || { ...otherData };
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(finalUserData));
      setUser(finalUserData);
      
      toast.success(`Welcome to Boma, ${finalUserData.name || finalUserData.email}!`);
      return { success: true, user: finalUserData };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // Helper functions for role checking
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isLandlord = user?.role === 'landlord';
  const isTenant = user?.role === 'tenant';

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Role checks
    isAdmin,
    isLandlord,
    isTenant,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};