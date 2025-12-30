// src/pages/TrashPage.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { fileAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/trash.css';

const TrashPage = () => {
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      const response = await fileAPI.getTrash();
      setTrashedFiles(response.data.files || []);
    } catch (error) {
      toast.error('Failed to load trash');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (fileId, filename) => {
    try {
      await fileAPI.restoreFile(fileId);
      toast.success(`"${filename}" restored successfully!`);
      fetchTrash();
    } catch (error) {
      toast.error('Failed to restore file');
    }
  };

  const handlePermanentDelete = async (fileId, filename) => {
    if (!window.confirm(`Permanently delete "${filename}"? This cannot be undone.`)) return;
    
    try {
      await fileAPI.permanentDelete(fileId);
      toast.success('File permanently deleted');
      fetchTrash();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm('Empty trash? All files will be permanently deleted.')) return;
    
    try {
      await fileAPI.emptyTrash();
      toast.success('Trash emptied successfully');
      setTrashedFiles([]);
    } catch (error) {
      toast.error('Failed to empty trash');
    }
  };

  const getDaysRemaining = (deletedAt) => {
    const deleted = new Date(deletedAt);
    const expiry = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getExpiryStatus = (days) => {
    if (days <= 3) return 'danger';
    if (days <= 7) return 'warning';
    return 'safe';
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { icon: '📕', class: 'pdf' };
    if (['doc', 'docx'].includes(ext)) return { icon: '📘', class: 'doc' };
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return { icon: '🖼️', class: 'image' };
    if (['mp4', 'mov', 'avi'].includes(ext)) return { icon: '🎬', class: 'video' };
    return { icon: '📄', class: 'default' };
  };

  const filteredFiles = trashedFiles.filter(file =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = trashedFiles.reduce((acc, file) => acc + (file.size_bytes || 0), 0);

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="trash-page">
        {/* Header */}
        <div className="trash-header">
          <div className="trash-header-left">
            <h1>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Trash
            </h1>
            <p>Files in trash will be automatically deleted after 30 days</p>
          </div>
          <div className="trash-header-actions">
            <button 
              className="btn-empty-trash"
              onClick={handleEmptyTrash}
              disabled={trashedFiles.length === 0}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Empty Trash
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="trash-info-banner">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Items in trash are automatically <strong>permanently deleted after 30 days</strong>. 
            You can restore them anytime before expiry.
          </p>
        </div>

        {/* Stats */}
        <div className="trash-stats">
          <div className="trash-stat-card">
            <div className="trash-stat-icon red">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="trash-stat-content">
              <h3>{trashedFiles.length}</h3>
              <p>Files in Trash</p>
            </div>
          </div>
          <div className="trash-stat-card">
            <div className="trash-stat-icon orange">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div className="trash-stat-content">
              <h3>{(totalSize / (1024 * 1024)).toFixed(2)} MB</h3>
              <p>Space Used</p>
            </div>
          </div>
          <div className="trash-stat-card">
            <div className="trash-stat-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="trash-stat-content">
              <h3>30 days</h3>
              <p>Retention Period</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="trash-content">
          {/* Toolbar */}
          <div className="trash-toolbar">
            <div className="trash-search">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search trash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="trash-view-options">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Files */}
          {filteredFiles.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="trash-grid">
                {filteredFiles.map(file => {
                  const daysRemaining = getDaysRemaining(file.deleted_at);
                  const status = getExpiryStatus(daysRemaining);
                  const fileIcon = getFileIcon(file.filename);

                  return (
                    <div key={file.id} className="trash-file-card">
                      <div className="trash-file-header">
                        <div className={`trash-file-icon ${fileIcon.class}`}>
                          {fileIcon.icon}
                        </div>
                        <span className={`expiry-badge ${status}`}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {daysRemaining} days left
                        </span>
                      </div>
                      <div className="trash-file-info">
                        <h4 className="trash-file-name" title={file.filename}>
                          {file.filename}
                        </h4>
                        <div className="trash-file-meta">
                          <span>{file.size || 'Unknown size'}</span>
                        </div>
                      </div>
                      <div className="deleted-date">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Deleted {new Date(file.deleted_at).toLocaleDateString()}
                      </div>
                      <div className="trash-file-actions">
                        <button 
                          className="btn-restore"
                          onClick={() => handleRestore(file.id, file.filename)}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Restore
                        </button>
                        <button 
                          className="btn-delete-permanent"
                          onClick={() => handlePermanentDelete(file.id, file.filename)}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="trash-list">
                <table className="trash-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Deleted</th>
                      <th>Expires In</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map(file => {
                      const daysRemaining = getDaysRemaining(file.deleted_at);
                      const status = getExpiryStatus(daysRemaining);
                      const fileIcon = getFileIcon(file.filename);

                      return (
                        <tr key={file.id}>
                          <td>
                            <div className="trash-table-file">
                              <div className="trash-table-icon">{fileIcon.icon}</div>
                              <div>
                                <div className="trash-table-name">{file.filename}</div>
                              </div>
                            </div>
                          </td>
                          <td className="trash-table-size">{file.size || 'Unknown'}</td>
                          <td className="trash-table-deleted">
                            {new Date(file.deleted_at).toLocaleDateString()}
                          </td>
                          <td>
                            <span className={`trash-table-expiry ${status}`}>
                              {daysRemaining} days
                            </span>
                          </td>
                          <td>
                            <div className="trash-table-actions">
                              <button 
                                className="btn-icon-restore"
                                onClick={() => handleRestore(file.id, file.filename)}
                                title="Restore"
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                              <button 
                                className="btn-icon-delete"
                                onClick={() => handlePermanentDelete(file.id, file.filename)}
                                title="Delete Permanently"
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="trash-empty">
              <div className="trash-empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3>Trash is empty</h3>
              <p>Items you delete will appear here for 30 days before being permanently removed.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TrashPage;