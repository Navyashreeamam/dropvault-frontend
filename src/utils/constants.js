// src/utils/constants.js

// ==================== API CONFIGURATION ====================
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dropvault-2.onrender.com/api';

// ==================== GOOGLE OAUTH ====================
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '592860790164-r76kpcug5q3qfm5ugg2apcchmqjs9mkl.apps.googleusercontent.com';
export const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:3000/google-callback';

// Validate Google Client ID
if (!GOOGLE_CLIENT_ID && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ WARNING: Google Client ID not configured');
}

// ==================== FILE CONFIGURATION ====================
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILE_SIZE_MB = 100;

export const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  
  // Text
  'text/plain',
  'text/csv',
  'text/html',
  
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  
  // Video
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
];

export const FILE_TYPE_CATEGORIES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  text: ['txt', 'csv', 'html', 'json'],
  archive: ['zip', 'rar', '7z'],
  video: ['mp4', 'mpeg', 'mov', 'avi'],
  audio: ['mp3', 'wav', 'ogg'],
};

// ==================== STORAGE CONFIGURATION ====================
export const DEFAULT_STORAGE_QUOTA = 10 * 1024; // 10GB in MB
export const STORAGE_WARNING_THRESHOLD = 70; // 70%
export const STORAGE_DANGER_THRESHOLD = 90; // 90%

// ==================== SHARE CONFIGURATION ====================
export const DEFAULT_SHARE_EXPIRY_DAYS = 7;
export const MAX_SHARE_EXPIRY_DAYS = 30;

// ==================== PAGINATION ====================
export const DEFAULT_PAGE_SIZE = 20;
export const FILES_PER_PAGE = 20;

// ==================== TOAST CONFIGURATION ====================
export const TOAST_DURATION = 3000;
export const TOAST_ERROR_DURATION = 5000;

// ==================== APP METADATA ====================
export const APP_NAME = 'DropVault';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Secure cloud storage solution';