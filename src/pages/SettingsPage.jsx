// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { settingsAPI, dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/settings.css';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 10240 });
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    darkMode: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
    fetchStorageInfo();
  }, [user]);

  const fetchStorageInfo = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStorageInfo({
        used: response.data.storageUsed || 0,
        total: response.data.storageTotal || 10240,
      });
    } catch (error) {
      console.error('Failed to fetch storage info');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setLoading(true);
    try {
      await settingsAPI.updateProfile(profileData);
      
      // Update the user in context
      if (updateUser) {
        updateUser({ ...user, ...profileData });
      }
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await settingsAPI.updatePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    try {
      await settingsAPI.updatePreferences(newPreferences);
      toast.success('Preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
      setPreferences(preferences); // Revert
    }
  };

  const storagePercent = ((storageInfo.used / storageInfo.total) * 100).toFixed(1);
  const storageUsedGB = (storageInfo.used / 1024).toFixed(2);
  const storageTotalGB = (storageInfo.total / 1024).toFixed(0);

  return (
    <MainLayout>
      <div className="settings-page">
        <div className="page-header">
          <h1>Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>

        <div className="settings-grid">
          {/* Profile Settings */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2>Profile Information</h2>
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2>Change Password</h2>
            </div>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" className="btn-save" disabled={loading}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Update Password
              </button>
            </form>
          </div>

          {/* Storage Info */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon purple">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h2>Storage</h2>
            </div>
            <div className="storage-info">
              <div className="storage-visual">
                <div className="storage-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="url(#gradient)" 
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${storagePercent * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="storage-percent">{storagePercent}%</div>
                </div>
              </div>
              <div className="storage-details">
                <p className="storage-used">
                  <strong>{storageUsedGB} GB</strong> of <strong>{storageTotalGB} GB</strong> used
                </p>
                <div className="storage-breakdown">
                  <div className="breakdown-item">
                    <span className="dot blue"></span>
                    <span>Documents</span>
                    <span className="breakdown-size">1.2 GB</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="dot green"></span>
                    <span>Images</span>
                    <span className="breakdown-size">800 MB</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="dot purple"></span>
                    <span>Videos</span>
                    <span className="breakdown-size">500 MB</span>
                  </div>
                </div>
              </div>
            </div>
            <a href="/myfiles" className="btn-manage">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Manage Files
            </a>
          </div>

          {/* Preferences */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon orange">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2>Preferences</h2>
            </div>
            <div className="preference-list">
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Email Notifications</h4>
                  <p>Receive emails about file sharing and updates</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={preferences.twoFactorAuth}
                    onChange={(e) => handlePreferenceChange('twoFactorAuth', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Dark Mode</h4>
                  <p>Switch to dark theme for better visibility at night</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={preferences.darkMode}
                    onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;