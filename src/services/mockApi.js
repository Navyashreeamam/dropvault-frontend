// src/services/mockApi.js

// ==================== SIMULATED DELAY ====================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== MOCK DATA STORAGE ====================
let mockUser = {
  id: 1,
  email: 'user@example.com',
  name: 'Test User',
  avatar: null,
  storageUsed: 2560,
  storageTotal: 10240,
  created_at: '2024-01-01T00:00:00Z',
};

let mockFiles = [
  { 
    id: 1, 
    filename: 'Project_Report.pdf', 
    size: '2.4 MB', 
    size_bytes: 2516582, 
    type: 'application/pdf',
    uploaded_at: '2024-01-15T10:30:00Z',
    is_shared: false,
  },
  { 
    id: 2, 
    filename: 'Design_Assets.zip', 
    size: '15.8 MB', 
    size_bytes: 16567091, 
    type: 'application/zip',
    uploaded_at: '2024-01-14T14:20:00Z',
    is_shared: false,
  },
  { 
    id: 3, 
    filename: 'Meeting_Notes.docx', 
    size: '156 KB', 
    size_bytes: 159744, 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploaded_at: '2024-01-13T09:15:00Z',
    is_shared: true,
  },
  { 
    id: 4, 
    filename: 'Budget_2024.xlsx', 
    size: '892 KB', 
    size_bytes: 913408, 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploaded_at: '2024-01-12T16:45:00Z',
    is_shared: false,
  },
  { 
    id: 5, 
    filename: 'Profile_Photo.png', 
    size: '1.2 MB', 
    size_bytes: 1258291, 
    type: 'image/png',
    uploaded_at: '2024-01-11T11:00:00Z',
    is_shared: false,
  },
];

let mockTrash = [
  { 
    id: 101, 
    filename: 'Old_Document.pdf', 
    size: '1.5 MB', 
    size_bytes: 1572864, 
    type: 'application/pdf',
    deleted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    days_remaining: 28,
  },
  { 
    id: 102, 
    filename: 'Backup_Files.zip', 
    size: '25 MB', 
    size_bytes: 26214400, 
    type: 'application/zip',
    deleted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    days_remaining: 25,
  },
];

let mockShared = [
  { 
    id: 3,
    file_id: 3,
    filename: 'Meeting_Notes.docx',
    size: '156 KB',
    shared_at: '2024-01-10T10:00:00Z', 
    expiry: '2024-02-10T10:00:00Z', 
    share_url: 'https://dropvault.app/s/abc123',
    access_count: 5,
  },
];

let mockPreferences = {
  emailNotifications: true,
  twoFactorAuth: false,
  darkMode: false,
  autoDelete: false,
  language: 'en',
};

// ==================== AUTH API ====================
export const mockAuthAPI = {
  login: async (credentials) => {
    await delay(800);
    if (credentials.email && credentials.password) {
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            ...mockUser,
            email: credentials.email,
          }
        }
      };
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (userData) => {
    await delay(1000);
    mockUser = {
      ...mockUser,
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
    };
    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: mockUser,
      }
    };
  },
  
  googleLogin: async () => {
    await delay(500);
    return {
      data: {
        token: 'mock-google-token-' + Date.now(),
        user: {
          ...mockUser,
          email: 'user@gmail.com',
          name: 'Google User',
        }
      }
    };
  },
  
  logout: async () => {
    await delay(300);
    return { data: { message: 'Logged out successfully' } };
  },
  
  getProfile: async () => {
    await delay(300);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token');
    }
    return { data: mockUser };
  },
  
  refreshToken: async () => {
    await delay(200);
    return {
      data: {
        token: 'mock-jwt-token-refreshed-' + Date.now(),
      }
    };
  },
};

// ==================== FILE API ====================
export const mockFileAPI = {
  getAllFiles: async () => {
    await delay(600);
    return {
      data: {
        your_files: mockFiles,
        shared_files: mockShared,
      }
    };
  },
  
  getFile: async (fileId) => {
    await delay(300);
    const file = mockFiles.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');
    return { data: file };
  },
  
  uploadFile: async (formData) => {
    await delay(2000);
    const file = formData.get('file');
    const newFile = {
      id: Date.now(),
      filename: file?.name || 'Uploaded_File.pdf',
      size: file ? formatBytes(file.size) : '1.0 MB',
      size_bytes: file?.size || 1048576,
      type: file?.type || 'application/octet-stream',
      uploaded_at: new Date().toISOString(),
      is_shared: false,
    };
    mockFiles.unshift(newFile);
    
    // Update storage
    mockUser.storageUsed += Math.round((newFile.size_bytes / 1024 / 1024) * 100) / 100;
    
    return { data: newFile };
  },
  
  updateFile: async (fileId, data) => {
    await delay(500);
    const fileIndex = mockFiles.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      mockFiles[fileIndex] = { ...mockFiles[fileIndex], ...data };
      return { data: mockFiles[fileIndex] };
    }
    throw new Error('File not found');
  },
  
  deleteFile: async (fileId) => {
    await delay(500);
    const fileIndex = mockFiles.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      const [deletedFile] = mockFiles.splice(fileIndex, 1);
      mockTrash.unshift({
        ...deletedFile,
        deleted_at: new Date().toISOString(),
        days_remaining: 30,
      });
      return { data: { message: 'File moved to trash' } };
    }
    throw new Error('File not found');
  },
  
  shareFile: async (fileId, data) => {
    await delay(500);
    const file = mockFiles.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');
    
    const shareUrl = `https://dropvault.app/s/${Math.random().toString(36).substr(2, 9)}`;
    const expiry = new Date(Date.now() + (data.expiry_days || 7) * 24 * 60 * 60 * 1000).toISOString();
    
    const sharedFile = {
      id: fileId,
      file_id: fileId,
      filename: file.filename,
      size: file.size,
      shared_at: new Date().toISOString(),
      expiry,
      share_url: shareUrl,
      access_count: 0,
    };
    
    mockShared.push(sharedFile);
    file.is_shared = true;
    
    return {
      data: {
        share_url: shareUrl,
        expiry,
      }
    };
  },
  
  getSharedFiles: async () => {
    await delay(500);
    return { data: { shared: mockShared } };
  },
  
  revokeShare: async (fileId) => {
    await delay(400);
    mockShared = mockShared.filter(s => s.file_id !== fileId);
    const file = mockFiles.find(f => f.id === fileId);
    if (file) file.is_shared = false;
    return { data: { message: 'Share link revoked' } };
  },
  
  downloadFile: async (fileId) => {
    await delay(1000);
    const file = mockFiles.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');
    return { 
      data: new Blob(['Mock file content for ' + file.filename], { 
        type: file.type 
      }) 
    };
  },
  
  // Trash APIs
  getTrash: async () => {
    await delay(500);
    return { data: { files: mockTrash } };
  },
  
  restoreFile: async (fileId) => {
    await delay(500);
    const fileIndex = mockTrash.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      const [restoredFile] = mockTrash.splice(fileIndex, 1);
      delete restoredFile.deleted_at;
      delete restoredFile.days_remaining;
      restoredFile.uploaded_at = new Date().toISOString();
      mockFiles.unshift(restoredFile);
      return { data: { message: 'File restored successfully' } };
    }
    throw new Error('File not found in trash');
  },
  
  permanentDelete: async (fileId) => {
    await delay(500);
    const fileIndex = mockTrash.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      const [deletedFile] = mockTrash.splice(fileIndex, 1);
      // Update storage
      mockUser.storageUsed -= Math.round((deletedFile.size_bytes / 1024 / 1024) * 100) / 100;
      return { data: { message: 'File permanently deleted' } };
    }
    throw new Error('File not found in trash');
  },
  
  emptyTrash: async () => {
    await delay(1000);
    // Calculate total size
    const totalSize = mockTrash.reduce((sum, file) => sum + file.size_bytes, 0);
    mockUser.storageUsed -= Math.round((totalSize / 1024 / 1024) * 100) / 100;
    mockTrash = [];
    return { data: { message: 'Trash emptied successfully' } };
  },
  
  searchFiles: async (query) => {
    await delay(400);
    const results = mockFiles.filter(file => 
      file.filename.toLowerCase().includes(query.toLowerCase())
    );
    return { data: { files: results } };
  },
};

// ==================== DASHBOARD API ====================
export const mockDashboardAPI = {
  getStats: async () => {
    await delay(500);
    return {
      data: {
        storageUsed: mockUser.storageUsed,
        storageTotal: mockUser.storageTotal,
        totalFiles: mockFiles.length,
        sharedFiles: mockShared.length,
        recentFiles: mockFiles.slice(0, 5),
      }
    };
  },
  
  getRecentActivity: async () => {
    await delay(400);
    return {
      data: {
        activities: [
          { type: 'upload', filename: 'Project_Report.pdf', timestamp: new Date().toISOString() },
          { type: 'share', filename: 'Meeting_Notes.docx', timestamp: new Date(Date.now() - 3600000).toISOString() },
        ]
      }
    };
  },
  
  getStorageBreakdown: async () => {
    await delay(400);
    return {
      data: {
        documents: 1200,
        images: 800,
        videos: 500,
        others: 60,
      }
    };
  },
};

// ==================== SETTINGS API ====================
export const mockSettingsAPI = {
  updateProfile: async (data) => {
    await delay(800);
    // UPDATE MOCK USER - THIS IS CRITICAL FOR USERNAME SYNC
    mockUser = {
      ...mockUser,
      name: data.name || mockUser.name,
      email: data.email || mockUser.email,
      avatar: data.avatar || mockUser.avatar,
    };
    
    return { 
      data: { 
        ...mockUser,
        message: 'Profile updated successfully' 
      } 
    };
  },
  
  updatePassword: async (data) => {
    await delay(800);
    if (!data.current_password) {
      throw new Error('Current password is required');
    }
    if (data.new_password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    return { data: { message: 'Password updated successfully' } };
  },
  
  getPreferences: async () => {
    await delay(300);
    return { data: mockPreferences };
  },
  
  updatePreferences: async (data) => {
    await delay(500);
    mockPreferences = { ...mockPreferences, ...data };
    return { 
      data: { 
        ...mockPreferences, 
        message: 'Preferences saved successfully' 
      } 
    };
  },
  
  deleteAccount: async () => {
    await delay(1000);
    return { data: { message: 'Account deleted successfully' } };
  },
};

// ==================== HELPER FUNCTIONS ====================
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}