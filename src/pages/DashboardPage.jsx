import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { dashboardAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    storageUsed: 0,
    storageTotal: 10240, // 10GB in MB
    totalFiles: 0,
    recentFiles: [],
    sharedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('📊 Fetching dashboard data...');
      const response = await dashboardAPI.getStats();
      console.log('📊 Dashboard response:', response.data);
      
      // ✅ FIXED: Handle the actual response structure from backend
      // Backend returns: { success: true, data: {...}, user: {...} }
      const dashboardData = response.data;
      
      if (dashboardData.success === false) {
        throw new Error(dashboardData.error || 'Failed to load dashboard');
      }
      
      // Extract data from response
      const data = dashboardData.data || dashboardData;
      
      setStats({
        storageUsed: data.storageUsed || data.storage_used || 0,
        storageTotal: data.storageTotal || data.storage_total || 10 * 1024 * 1024 * 1024, // 10GB
        totalFiles: data.totalFiles || data.total_files || 0,
        recentFiles: data.recentFiles || data.recent_files || [],
        sharedCount: data.sharedFiles || data.shared_count || 0,
        trashFiles: data.trashFiles || data.trash_files || 0,
      });
      
      setError(null);
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      setError('Failed to load dashboard data');
      // Don't show toast for every error - might be auth issue
      if (err.response?.status !== 401) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentage safely
  const storageInMB = stats.storageUsed / (1024 * 1024); // Convert bytes to MB
  const totalInMB = stats.storageTotal / (1024 * 1024); // Convert bytes to MB
  const percentUsed = totalInMB > 0 ? ((storageInMB / totalInMB) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Welcome to DropVault</h1>
          <p className="page-subtitle">Secure. Simple. Yours.</p>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={fetchDashboardData}>Retry</button>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Storage Card */}
          <div className="dashboard-card">
            <h3>Storage Used</h3>
            <p className="storage-text">
              <strong>{(storageInMB / 1024).toFixed(2)} GB</strong> / {(totalInMB / 1024).toFixed(0)} GB used
            </p>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
            <p className="storage-percent">{percentUsed}% used</p>
          </div>

          {/* Files Count Card */}
          <div className="dashboard-card">
            <h3>Your Files</h3>
            <p className="file-count">
              <strong>{stats.totalFiles}</strong> files stored
            </p>
            {stats.trashFiles > 0 && (
              <p className="trash-count">{stats.trashFiles} in trash</p>
            )}
          </div>

          {/* Recent Uploads */}
          <div className="dashboard-card">
            <h3>Recent Uploads</h3>
            {stats.recentFiles && stats.recentFiles.length > 0 ? (
              <ul className="recent-files-list">
                {stats.recentFiles.slice(0, 5).map((file, index) => (
                  <li key={file.id || index}>
                    <span className="file-icon">📄</span>
                    <span className="file-name">{file.filename || file.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No recent uploads</p>
            )}
          </div>

          {/* Shared Files */}
          <div className="dashboard-card">
            <h3>Shared Files</h3>
            <p className="shared-count">
              <strong>{stats.sharedCount}</strong> files shared
            </p>
            <button className="btn-view-all" onClick={() => window.location.href = '/shared'}>
              View all shared files →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <a href="/upload" className="action-btn">
              <span className="action-icon">⬆️</span>
              <span>Upload File</span>
            </a>
            <a href="/myfiles" className="action-btn">
              <span className="action-icon">📁</span>
              <span>Browse Files</span>
            </a>
            <a href="/shared" className="action-btn">
              <span className="action-icon">🔗</span>
              <span>Manage Shared</span>
            </a>
            <a href="/trash" className="action-btn">
              <span className="action-icon">🗑️</span>
              <span>View Trash</span>
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;