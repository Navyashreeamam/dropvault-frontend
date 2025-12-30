// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/constants';

import {
  mockAuthAPI,
  mockFileAPI,
  mockDashboardAPI,
  mockSettingsAPI
} from './mockApi';

// ==================== ENVIRONMENT CHECK ====================
const isDevelopment = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1';

const FORCE_REAL_API = process.env.NODE_ENV === 'production' || 
                        window.location.hostname.includes('onrender.com');

const FINAL_USE_MOCK = FORCE_REAL_API ? false : isDevelopment;

console.log('🌍 Environment Check:');
console.log('  - Hostname:', window.location.hostname);
console.log('  - Is Development:', isDevelopment);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - Force Real API:', FORCE_REAL_API);
console.log('  - Using Mock API:', FINAL_USE_MOCK);
console.log('  - API Base URL:', API_BASE_URL);

// ==================== AXIOS INSTANCE ====================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config) => {
    // ✅ CRITICAL FIX: Get token and add to Authorization header
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionid');
    
    // Add token to Authorization header if available
    if (token && token !== 'session-based-auth' && token !== 'session-based') {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Also add session ID as custom header (backup)
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }
    
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      hasToken: !!token,
      hasSessionId: !!sessionId
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// ==================== REQUEST INTERCEPTOR - SIMPLIFIED ====================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // ✅ ONLY add Authorization header - NO custom headers
    if (token && token !== 'session-based-auth' && token !== 'session-based') {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // ❌ REMOVED: X-Session-ID header (causes CORS issues)
    
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token && token !== 'session-based'
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = FINAL_USE_MOCK ? mockAuthAPI : {
  login: async (credentials) => {
    console.log('🔐 Attempting login to:', `${API_BASE_URL}/login/`);
    const response = await api.post('/login/', credentials);
    
    // ✅ CRITICAL: Store both token and sessionid
    if (response.data.success) {
      const { token, sessionid } = response.data;
      if (token) localStorage.setItem('token', token);
      if (sessionid) localStorage.setItem('sessionid', sessionid);
      console.log('✅ Stored auth tokens');
    }
    
    return response;
  },
  
  register: async (userData) => {
    console.log('📝 Attempting registration to:', `${API_BASE_URL}/signup/`);
    const response = await api.post('/signup/', userData);
    
    // Store tokens on successful registration
    if (response.data.success) {
      const { token, sessionid } = response.data;
      if (token) localStorage.setItem('token', token);
      if (sessionid) localStorage.setItem('sessionid', sessionid);
    }
    
    return response;
  },
  
  googleLogin: async (code) => {
    console.log('🔐 Google OAuth to:', `${API_BASE_URL}/auth/google/`);
    const response = await api.post('/auth/google/', { code });
    
    // Store tokens on successful Google login
    if (response.data.success) {
      const { token, sessionid } = response.data;
      if (token) localStorage.setItem('token', token);
      if (sessionid) localStorage.setItem('sessionid', sessionid);
    }
    
    return response;
  },
  
  logout: async () => {
    console.log('🚪 Logging out');
    try {
      await api.post('/logout/');
    } catch (e) {
      console.log('Logout API call failed, clearing local storage anyway');
    }
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('sessionid');
  },
  
  getProfile: () => {
    console.log('👤 Getting profile');
    return api.get('/user/');
  },
  
  checkAuth: () => {
    console.log('🔍 Checking auth status');
    return api.get('/auth/check/');
  },
};

// ==================== FILE API ====================

export const fileAPI = FINAL_USE_MOCK ? mockFileAPI : {
  getAllFiles: () => {
    console.log('📁 Getting all files');
    return api.get('/list/');
  },
  
  uploadFile: (formData, onUploadProgress) => {
    console.log('📤 Uploading file');
    return api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
  
  deleteFile: (fileId) => {
    console.log('🗑️ Deleting file:', fileId);
    return api.delete(`/delete/${fileId}/`);
  },
  
  getTrash: () => {
    console.log('🗑️ Getting trash');
    return api.get('/trash/');
  },
  
  restoreFile: (fileId) => {
    console.log('♻️ Restoring file:', fileId);
    return api.post(`/restore/${fileId}/`);
  },
  
  shareFile: (fileId, data) => api.post(`/share/${fileId}/`, data),
  
  // ✅ ADD THIS NEW FUNCTION
  shareViaEmail: (fileId, data) => {
    console.log('📧 Sharing via email:', fileId);
    return api.post(`/share/${fileId}/email/`, data);
  },
  
  getSharedFiles: () => api.get('/shared/'),
  downloadFile: (fileId) => api.get(`/download/${fileId}/`, { responseType: 'blob' }),
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = FINAL_USE_MOCK ? mockDashboardAPI : {
  getStats: () => {
    console.log('📊 Getting dashboard stats');
    return api.get('/dashboard/');
  },
};

// ==================== SETTINGS API ====================
export const settingsAPI = FINAL_USE_MOCK ? mockSettingsAPI : {
  updateProfile: (data) => api.put('/user/profile/', data),
  updatePassword: (data) => api.put('/user/password/', data),
  getPreferences: () => api.get('/user/preferences/'),
  updatePreferences: (data) => api.put('/user/preferences/', data),
};

export default api;