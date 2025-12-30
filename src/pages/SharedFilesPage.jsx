// src/pages/SharedFilesPage.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { fileAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/files.css';

const SharedFilesPage = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const fetchSharedFiles = async () => {
    try {
      const response = await fileAPI.getSharedFiles();
      console.log('📤 Shared files response:', response.data);
      setSharedFiles(response.data || []);
    } catch (error) {
      console.error('❌ Failed to load shared files:', error);
      toast.error('Failed to load shared files');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Share link copied!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading shared files...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="files-page">
        {/* Header */}
        <div className="files-header">
          <div className="files-header-content">
            <h1>Shared Files</h1>
            <p>Files you've shared with others</p>
          </div>
        </div>

        {/* Stats */}
        <div className="files-stats-bar">
          <div className="stat-item">
            <span className="stat-number">{sharedFiles.length}</span>
            <span className="stat-label">Total Shared</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">
              {sharedFiles.filter(f => f.download_count > 0).length}
            </span>
            <span className="stat-label">Downloaded</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {sharedFiles.reduce((sum, f) => sum + (f.download_count || 0), 0)}
            </span>
            <span className="stat-label">Total Downloads</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {sharedFiles.reduce((sum, f) => sum + (f.view_count || 0), 0)}
            </span>
            <span className="stat-label">Total Views</span>
          </div>
        </div>

        {/* Shared Files List */}
        <div className="files-content">
          {sharedFiles.length > 0 ? (
            <div className="files-list">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Size</th>
                    <th>Downloads</th>
                    <th>Views</th>
                    <th>Created</th>
                    <th>Expires</th>
                    <th>Share Link</th>
                  </tr>
                </thead>
                <tbody>
                  {sharedFiles.map(file => (
                    <tr key={file.id}>
                      <td>
                        <div className="table-file-info">
                          <span className="table-file-icon">📄</span>
                          <span className="table-file-name">{file.filename}</span>
                        </div>
                      </td>
                      <td className="table-file-size">{file.file_size || '-'}</td>
                      <td>
                        <span className="badge">
                          {file.download_count} / {file.max_downloads}
                        </span>
                      </td>
                      <td>
                        <span className="badge">{file.view_count || 0}</span>
                      </td>
                      <td className="table-file-date">
                        {formatDate(file.created_at)}
                      </td>
                      <td className="table-file-date">
                        {file.expires_at ? formatDate(file.expires_at) : 'Never'}
                      </td>
                      <td>
                        <button
                          className="btn-copy-link"
                          onClick={() => copyShareLink(file.share_url)}
                          title="Copy share link"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="files-empty">
              <div className="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3>No shared files yet</h3>
              <p>Share files from "My Files" page to see them here</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .btn-copy-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .btn-copy-link:hover {
          background: #5568d3;
          transform: translateY(-1px);
        }
        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #e0e7ff;
          color: #4f46e5;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </MainLayout>
  );
};

export default SharedFilesPage;