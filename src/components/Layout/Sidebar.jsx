// src/components/Layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
import SignOutConfirmation from '../Common/SignOutConfirmation';
import toast from 'react-hot-toast';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ storageUsed: 0, storageTotal: 10737418240 });
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      const statsData = response.data.data || response.data;
      setStats({
        storageUsed: statsData.storageUsed || statsData.storage_used || 0,
        storageTotal: statsData.storageTotal || statsData.storage_total || 10737418240
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({ storageUsed: 0, storageTotal: 10737418240 });
    }
  };

  const handleLogoutClick = () => {
    console.log('🚪 Sign out button clicked');
    setShowSignOutModal(true);
  };

  const handleConfirmLogout = async () => {
    console.log('🚪 Confirming logout...');
    setIsLoggingOut(true);
    
    try {
      await logout();
      console.log('✅ Logout function completed');
      setShowSignOutModal(false);
      toast.success('Signed out successfully!');
      console.log('🏠 Navigating to home page...');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('sessionid');
      setShowSignOutModal(false);
      toast.success('Signed out');
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    console.log('❌ Logout cancelled');
    setShowSignOutModal(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Calculate storage
  const storageInGB = stats.storageUsed / (1024 * 1024 * 1024);
  const totalInGB = stats.storageTotal / (1024 * 1024 * 1024);
  const storagePercent = totalInGB > 0 ? ((storageInGB / totalInGB) * 100).toFixed(1) : 0;
  const storageClass = storagePercent > 90 ? 'danger' : storagePercent > 70 ? 'warning' : '';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo Header */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo" onClick={closeSidebar}>
            <div className="logo-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="logo-text">DropVault</span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Main Section */}
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            <div className="nav-items">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                <span className="nav-label">Home</span>
              </NavLink>

              <NavLink 
                to="/upload" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </span>
                <span className="nav-label">Upload</span>
              </NavLink>
            </div>
          </div>

          {/* Files Section */}
          <div className="nav-section">
            <div className="nav-section-title">Files</div>
            <div className="nav-items">
              <NavLink 
                to="/myfiles" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </span>
                <span className="nav-label">My Files</span>
              </NavLink>

              <NavLink 
                to="/shared" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </span>
                <span className="nav-label">Shared</span>
              </NavLink>

              <NavLink 
                to="/trash" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </span>
                <span className="nav-label">Trash</span>
              </NavLink>
            </div>
          </div>

          {/* Account Section */}
          <div className="nav-section">
            <div className="nav-section-title">Account</div>
            <div className="nav-items">
              <NavLink 
                to="/settings" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="nav-label">Settings</span>
              </NavLink>

              {/* ✅ NEW: Pricing/Upgrade Link - Below Settings */}
              <NavLink 
                to="/pricing" 
                className={({ isActive }) => `nav-link pricing-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
                <span className="nav-label">Upgrade Storage</span>
                <span className="pro-badge">PRO</span>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Storage Info */}
        <div className="sidebar-storage">
          <div className="storage-header">
            <span className="storage-label">Storage</span>
            <span className="storage-value">
              {storageInGB.toFixed(2)} / {totalInGB.toFixed(0)} GB
            </span>
          </div>
          <div className="storage-bar">
            <div 
              className={`storage-bar-fill ${storageClass}`}
              style={{ width: `${Math.min(storagePercent, 100)}%` }}
            />
          </div>
          <div className="storage-footer">
            <span className="storage-percent">{storagePercent}% used</span>
          </div>
          {storagePercent > 50 && (
            <NavLink to="/pricing" className="storage-upgrade-hint" onClick={closeSidebar}>
              Need more space? Upgrade now →
            </NavLink>
          )}
        </div>

        {/* User Footer */}
        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || 'user@email.com'}</div>
            </div>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            type="button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <SignOutConfirmation 
          isOpen={showSignOutModal}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          userName={user?.name || user?.email?.split('@')[0] || 'User'}
        />
      )}
    </>
  );
};

export default Sidebar;