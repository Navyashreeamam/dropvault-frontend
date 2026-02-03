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
  timeout: 300000,
  withCredentials: true,
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && token !== 'session-based-auth' && token !== 'session-based') {
      config.headers.Authorization = `Token ${token}`;
    }
    
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

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      success: response.data?.success
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    const { response } = error;
    
    if (!response) {
      console.error('🔴 Network Error - Cannot connect to server');
      toast.error('Cannot connect to server. Please check your connection.');
      return Promise.reject(error);
    }
    
    if (response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/login') || 
                             error.config?.url?.includes('/signup') ||
                             error.config?.url?.includes('/auth/check');
      
      if (!isAuthEndpoint) {
        console.warn('⚠️ 401 - Session expired or not authenticated');
      }
    }
    
    if (response?.status === 403) {
      console.warn('⚠️ 403 - Access denied');
    }
    
    if (response?.status === 404) {
      console.warn('⚠️ 404 - Resource not found:', error.config?.url);
    }
    
    if (response?.status >= 500) {
      console.error('🔴 500 - Server error');
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================

  export const authAPI = FINAL_USE_MOCK ? mockAuthAPI : {
    login: async (credentials) => {
      console.log('🔐 Attempting login to:', `${API_BASE_URL}/api/login/`);
      const response = await api.post('/api/login/', credentials);
      
      if (response.data.success) {
        const { token, sessionid } = response.data;
        if (token) localStorage.setItem('token', token);
        if (sessionid) localStorage.setItem('sessionid', sessionid);
      }
      
      return response;
    },
    
  
    register: async (userData) => {
      console.log('📝 Attempting registration to:', `${API_BASE_URL}/api/signup/`);
      const response = await api.post('/api/signup/', userData);
      
      if (response.data.success) {
        const { token, sessionid } = response.data;
        if (token) localStorage.setItem('token', token);
        if (sessionid) localStorage.setItem('sessionid', sessionid);
      }
      
      return response;
    },
    
    googleLogin: async (code, redirect_uri) => {
      console.log('🔐 Google OAuth to:', `${API_BASE_URL}/api/auth/google/`);
      const response = await api.post('/api/auth/google/', { code, redirect_uri });
      
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
        await api.post('/api/logout/');
      } catch (e) {
        console.log('Logout API call failed');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('sessionid');
    },
    
    checkAuth: () => {
      return api.get('/api/auth/check/');
    },
    
    verifyEmail: async (token) => {
      console.log('🔐 Verifying email token');
      return api.post('/api/verify-email-token/', { token });
    },

    resendVerification: async (email) => {
      console.log('📧 Resending verification');
      return api.post('/api/resend-verification/', { email });
    },
    
    getProfile: () => {
      return api.get('/api/user/');
    },
  };

// ==================== FILE API ====================
export const fileAPI = FINAL_USE_MOCK ? mockFileAPI : {
  getAllFiles: () => {
    console.log('📁 Getting all files');
    return api.get('/api/list/');
  },
  
  uploadFile: (formData, onUploadProgress) => {
    console.log('📤 Uploading file');
    return api.post('/api/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
  
  deleteFile: (fileId) => {
    console.log('🗑️ Deleting file:', fileId);
    return api.delete(`/api/delete/${fileId}/`);
  },
  
  getTrash: () => {
    console.log('🗑️ Getting trash');
    return api.get('/api/trash/');
  },
  
  restoreFile: (fileId) => {
    console.log('♻️ Restoring file:', fileId);
    return api.post(`/api/restore/${fileId}/`);
  },
  
  permanentDelete: (fileId) => {
    console.log('🗑️ Permanently deleting file:', fileId);
    return api.delete(`/api/trash/permanent/${fileId}/`);
  },
  
  emptyTrash: () => {
    console.log('🗑️ Emptying trash');
    return api.delete('/api/trash/empty/');
  },
  
  shareFile: (fileId, data) => {
    console.log('🔗 Creating share link:', fileId);
    return api.post(`/api/share/${fileId}/`, data);
  },
  
  shareViaEmail: (fileId, data) => {
    console.log('📧 Sharing via email:', fileId);
    return api.post(`/api/share/${fileId}/email/`, data);
  },
  
  getSharedFiles: () => {
    console.log('🔗 Getting shared files');
    return api.get('/api/shared/');
  },
  
  downloadFile: (fileId) => {
    console.log('📥 Downloading file:', fileId);
    return api.get(`/api/download/${fileId}/`, { responseType: 'blob' });
  },
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = FINAL_USE_MOCK ? mockDashboardAPI : {
  getStats: () => {
    console.log('📊 Getting dashboard stats');
    return api.get('/api/dashboard/');
  },
};

// ==================== NOTIFICATION API ====================
export const notificationAPI = FINAL_USE_MOCK ? {
  getAll: () => Promise.resolve({ 
    data: { 
      success: true, 
      notifications: [], 
      unread_count: 0 
    } 
  }),
  markAsRead: (id) => Promise.resolve({ data: { success: true } }),
  markAllAsRead: () => Promise.resolve({ data: { success: true } }),
  delete: (id) => Promise.resolve({ data: { success: true } }),
} : {
  getAll: () => {
    console.log('🔔 Getting notifications');
    return api.get('/api/notifications/');
  },
  
  markAsRead: (notificationId) => {
    console.log('🔔 Marking notification as read:', notificationId);
    return api.post(`/api/notifications/${notificationId}/read/`);
  },
  
  markAllAsRead: () => {
    console.log('🔔 Marking all notifications as read');
    return api.post('/api/notifications/read-all/');
  },
  
  delete: (notificationId) => {
    console.log('🔔 Deleting notification:', notificationId);
    return api.delete(`/api/notifications/${notificationId}/delete/`);
  },
};

// ==================== SETTINGS API ====================
export const userAPI = {
  getStorage: () => {
    console.log('💾 Getting storage info');
    return api.get('/api/user/storage/');
  },
};

export const settingsAPI = FINAL_USE_MOCK ? mockSettingsAPI : {
  updateProfile: (data) => {
    console.log('👤 Updating profile');
    return api.put('/api/user/profile/', data);
  },
  updatePassword: (data) => {
    console.log('🔒 Updating password');
    return api.put('/api/user/password/', data);
  },
  getPreferences: () => {
    console.log('⚙️ Getting preferences');
    return api.get('/api/user/preferences/');
  },
  updatePreferences: (data) => {
    console.log('⚙️ Updating preferences');
    return api.put('/api/user/preferences/', data);
  },
    getStorage: () => {
    console.log('💾 Getting storage info');
    return api.get('/api/user/storage/');
  },
};

export const uploadFile = async (formData, onProgress) => {
  try {
    const response = await api.post('/api/upload/', formData, {
      timeout: 600000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export default api;