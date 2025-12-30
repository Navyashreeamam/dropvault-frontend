import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    console.log('🔍 Checking auth, token exists:', !!token);
    
    if (token && token !== 'session-based' && token !== 'session-based-auth') {
      try {
        const response = await authAPI.getProfile();
        console.log('✅ Auth check response:', response.data);
        
        const userData = response.data.data || response.data.user || response.data;
        
        if (userData && (userData.id || userData.email)) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ User authenticated:', userData.email);
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        // Token invalid - clear it
        localStorage.removeItem('token');
        localStorage.removeItem('sessionid');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Calling login API');
      const response = await authAPI.login(credentials);
      console.log('✅ AuthContext: Login response:', response.data);
      
      const { success, token, sessionid, user: userData, error } = response.data;
      
      if (success && userData) {
        // Token is already stored by authAPI.login
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 AuthContext: Calling register API');
      const response = await authAPI.register(userData);
      console.log('✅ AuthContext: Register response:', response.data);
      
      const { success, user: newUser, error } = response.data;
      
      if (success && newUser) {
        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: error || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('❌ AuthContext: Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log('Logout API error (ignored):', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('sessionid');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      checkAuth,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;