// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==================== CHECK AUTH ====================
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || token === 'session-based' || token === 'session-based-auth') {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }

      console.log('🔍 Checking authentication...');
      const response = await authAPI.checkAuth();
      
      if (response.data.authenticated) {
        console.log('✅ User authenticated:', response.data.user.email);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        console.log('❌ Not authenticated');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      
      // Clear invalid tokens
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return false;
    }
  };

  // ==================== LOGIN ====================
  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await authAPI.login(credentials);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Store auth data
        if (token) {
          localStorage.setItem('token', token);
        }
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        setIsAuthenticated(true);
        
        console.log('✅ Login successful');
        return { success: true };
      } else {
        console.log('❌ Login failed:', response.data.error);
        return {
          success: false,
          error: response.data.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      
      return {
        success: false,
        error: errorMessage,
        requires_verification: error.response?.data?.requires_verification
      };
    }
  };

  // ==================== REGISTER ====================
  const register = async (userData) => {
    try {
      console.log('📝 Registering user:', userData.email);
      
      const response = await authAPI.register(userData);
      
      console.log('📝 Registration response:', response.data);
      
      if (response.data.success) {
        if (response.data.requires_verification) {
          // Email verification required
          return {
            success: true,
            requires_verification: true,
            email: userData.email,
            message: response.data.message,
            email_sent: response.data.email_sent
          };
        } else if (response.data.token) {
          // Direct login (Google OAuth)
          const { token, user: newUser } = response.data;
          
          if (token) {
            localStorage.setItem('token', token);
          }
          if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
          }
          
          setIsAuthenticated(true);
          
          return {
            success: true,
            requires_verification: false
          };
        }
      }
      
      return {
        success: false,
        error: response.data.error || 'Registration failed'
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  // ==================== GOOGLE LOGIN ====================
  const googleLogin = async (code) => {
    try {
      console.log('🔐 Google OAuth login...');
      const response = await authAPI.googleLogin(code);
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        if (token) {
          localStorage.setItem('token', token);
        }
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        setIsAuthenticated(true);
        
        console.log('✅ Google login successful');
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.error || 'Google login failed'
        };
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed'
      };
    }
  };

  // ==================== LOGOUT ====================
  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await authAPI.logout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Always clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionid');
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logged out successfully');
    }
  };

  // ==================== RESEND VERIFICATION ====================
  const resendVerification = async (email) => {
    try {
      console.log('📧 Resending verification to:', email);
      const response = await authAPI.resendVerification(email);
      return response.data;
    } catch (error) {
      console.error('❌ Resend verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to resend verification email'
      };
    }
  };

  // ==================== VERIFY EMAIL ====================
  const verifyEmail = async (token) => {
    try {
      console.log('📧 Verifying email token...');
      const response = await authAPI.verifyEmail(token);
      
      if (response.data.success) {
        const { token: authToken, user: userData } = response.data;
        
        if (authToken) {
          localStorage.setItem('token', authToken);
        }
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return {
        success: false,
        error: response.data.error || 'Verification failed'
      };
    } catch (error) {
      console.error('❌ Email verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Verification failed'
      };
    }
  };

  // ==================== INITIAL AUTH CHECK ====================
  useEffect(() => {
    checkAuth();
  }, []);

  // ==================== CONTEXT VALUE ====================
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    googleLogin,
    logout,
    checkAuth,
    resendVerification,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;