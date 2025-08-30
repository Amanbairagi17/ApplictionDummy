import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { apiCall } from '../api/api';

const AuthContext = createContext();

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = localStorage.getItem('userData');
      
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiCall(API.LOGIN_USER, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Expect { token, user }
      const authUser = response?.user || response;
      const token = response?.token;
      if (authUser && (authUser.userId || authUser.email)) {
        if (token) {
          localStorage.setItem('authToken', token);
        }
        localStorage.setItem('userData', JSON.stringify(authUser));
        setUser(authUser);
        setIsAuthenticated(true);
        return { success: true, user: authUser };
      } else {
        throw new Error('Login failed - invalid response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiCall(API.REGISTER_USER, {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response && response.email) {
        // Registration successful, but user needs to verify email
        return { success: true, message: 'Registration successful! Please check your email for verification.' };
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const isAdmin = () => {
    if (!user) return false;
    const roleValue = user.role;
    if (!roleValue) return false;
    // Handle different possible shapes from backend: 'ADMIN', 'ROLE_ADMIN', { name: 'ADMIN' }
    if (typeof roleValue === 'string') {
      return roleValue.toUpperCase().includes('ADMIN');
    }
    if (typeof roleValue === 'object' && roleValue !== null) {
      const name = roleValue.name || roleValue.role || roleValue.value;
      return typeof name === 'string' && name.toUpperCase().includes('ADMIN');
    }
    return false;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
