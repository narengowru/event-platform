import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check and update user from localStorage
  const checkAndUpdateUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user1');

    // First, try to use stored user from localStorage (faster)
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);

        // Then verify with API in background
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
          // Update localStorage with fresh data
          localStorage.setItem('user1', JSON.stringify(response.data.user));
        } catch (err) {
          // If API fails, keep using localStorage user
          console.warn('Failed to verify user with API:', err);
        }
        return;
      } catch (err) {
        // If parsing fails, continue to API check
      }
    }

    // If no stored user, check with API
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
        localStorage.setItem('user1', JSON.stringify(response.data.user));
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user1');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAndUpdateUser();
  }, [checkAndUpdateUser]);

  // Listen to storage changes (for when login happens in another component)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAndUpdateUser();
      }
    };

    // Listen to storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);

    // Also listen to custom event for same-tab updates
    window.addEventListener('auth-storage-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-storage-change', handleStorageChange);
    };
  }, [checkAndUpdateUser]);

  // Register new user
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      // API wraps response in data.data
      const responseData = response.data.data || response.data;
      const token = responseData.token;
      const user = {
        _id: responseData._id,
        name: responseData.name,
        email: responseData.email
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user1', JSON.stringify(user));
      setUser(user);
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('auth-storage-change'));
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      // API wraps response in data.data
      const responseData = response.data.data || response.data;
      const token = responseData.token;
      const user = {
        _id: responseData._id,
        name: responseData.name,
        email: responseData.email
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user1', JSON.stringify(user));
      setUser(user);
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('auth-storage-change'));
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user1');
    setUser(null);
    setError(null);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('auth-storage-change'));
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updateData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/auth/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh user from localStorage (useful after login)
  const refreshUser = useCallback(() => {
    // Trigger storage check
    checkAndUpdateUser();
    // Also dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('auth-storage-change'));
  }, [checkAndUpdateUser]);

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    clearError,
    refreshUser,
    isAuthenticated: !!user
  };
};

