// src/components/Layout/MainLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const MainLayout = ({ children }) => {
  const { user } = useAuth();

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
            <button className="header-btn" title="Notifications">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notification-dot"></span>
            </button>

            {/* User Profile */}
            <div className="header-user">
              <div className="header-avatar">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="header-username">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content - THIS IS THE KEY FIX */}
        <div className="page-content">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;