// src/components/Layout/MainLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';  // ✅ ADD THIS LINE
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../services/api';
import '../../styles/layout.css';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Silently fail - don't show error to user
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      if (!notification.is_read) {
        await notificationAPI.markAsRead(notification.id);
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Navigate if file related
      if (notification.file_id) {
        setShowNotifications(false);
        navigate('/myfiles');
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoadingNotifications(true);
      await notificationAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      
      // Refresh to get updated list
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications(); // Refresh when opening
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'FILE_UPLOAD': return '📤';
      case 'FILE_SHARE': return '🔗';
      case 'FILE_DOWNLOAD': return '📥';
      case 'SHARE_ACCESSED': return '👁️';
      case 'FILE_DELETED': return '🗑️';
      case 'FILE_RESTORED': return '♻️';
      case 'STORAGE_WARNING': return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            {/* Breadcrumb or page info can go here */}
          </div>
          
          <div className="header-right">
            {/* Search Button */}
            <button className="header-btn" title="Search">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Notifications Button */}
            <div className="notification-container" ref={notificationRef}>
              <button 
                className="header-btn" 
                title="Notifications"
                onClick={toggleNotifications}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                        disabled={loadingNotifications}
                      >
                        {loadingNotifications ? 'Marking...' : 'Mark all read'}
                      </button>
                    )}
                  </div>
                  
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <span className="no-notif-icon">🔔</span>
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <span className="notif-icon">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="notif-content">
                            <p className="notif-title">{notification.title}</p>
                            <p className="notif-message">{notification.message}</p>
                            <span className="notif-time">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                          {!notification.is_read && (
                            <span className="unread-dot"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="header-user">
              <div className="header-avatar">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="header-username">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </main>

      {/* ✅ ADD CHATBOT HERE - It will appear on ALL pages */}
      <Chatbot />
    </div>
  );
};

export default MainLayout;