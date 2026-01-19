import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'https://dropvault-2.onrender.com';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
      // Verify token is still valid
      verifyAuth(storedToken);
    } else {
      setLoading(false);
    }
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

  const verifyAuth = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Token invalid - clear auth
        logout();
      }
    } catch (error) {
      console.error('Auth verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successful login
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.sessionid) {
          localStorage.setItem('sessionid', data.sessionid);
        }
        return { success: true };
      } else if (response.status === 403 && data.requires_verification) {
        // Email not verified
        return { 
          success: false, 
          requires_verification: true,
          email: data.email,
          error: data.error || 'Please verify your email first'
        };
      } else {
        // Other errors
        return { 
          success: false, 
          error: data.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };


  const loginWithGoogle = async (code) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.sessionid) {
          localStorage.setItem('sessionid', data.sessionid);
        }
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Google login failed' 
        };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  const logout = async () => {
      try {
        if (token) {
          await fetch(`${API_URL}/api/logout/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
            },
          });
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('sessionid');
        localStorage.removeItem('pendingVerificationEmail');
      }
    };

    const value = {
      user,
      setUser,
      token,
      setToken,
      loading,
      login,
      loginWithGoogle,
      logout,
      isAuthenticated: !!token && !!user,
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export default AuthContext;