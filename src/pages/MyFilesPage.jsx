// src/pages/MyFilesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { fileAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/files.css';
import ShareModal from '../components/Modals/ShareModal';

const MyFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fileAPI.getAllFiles();
      setFiles(response.data.your_files || []);
      setSharedLinks(response.data.shared_files || []);
    } catch (error) {
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId, filename) => {
    if (!window.confirm(`Move "${filename}" to trash?`)) return;
    
    try {
      await fileAPI.deleteFile(fileId);
      toast.success(`"${filename}" moved to trash`);
      fetchFiles();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleShare = (fileId, filename) => {
    const file = files.find(f => f.id === fileId);
    setSelectedFile(file || { id: fileId, filename });
    setShareModalOpen(true);
  };

  const handleDownload = async (fileId, filename) => {
    try {
      toast.loading('Preparing download...', { id: 'download' });
      const response = await fileAPI.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download started!', { id: 'download' });
    } catch (error) {
      toast.error('Failed to download file', { id: 'download' });
    }
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'],
      pdf: ['pdf'],
      document: ['doc', 'docx', 'txt', 'rtf', 'odt'],
      spreadsheet: ['xls', 'xlsx', 'csv'],
      video: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      audio: ['mp3', 'wav', 'flac', 'aac'],
      archive: ['zip', 'rar', '7z', 'tar'],
      code: ['js', 'jsx', 'ts', 'html', 'css', 'py', 'java']
    };
    
    for (const [type, extensions] of Object.entries(types)) {
      if (extensions.includes(ext)) return type;
    }
    return 'file';
  };

  const getFileIcon = (filename) => {
    const type = getFileType(filename);
    const icons = {
      image: '🖼️',
      pdf: '📕',
      document: '📘',
      spreadsheet: '📊',
      video: '🎬',
      audio: '🎵',
      archive: '📦',
      code: '💻',
      file: '📄'
    };
    return icons[type] || '📄';
  };

  const getFileColorClass = (filename) => {
    const type = getFileType(filename);
    const colors = {
      image: 'green',
      pdf: 'red',
      document: 'blue',
      spreadsheet: 'emerald',
      video: 'purple',
      audio: 'pink',
      archive: 'yellow',
      code: 'cyan',
      file: 'gray'
    };
    return colors[type] || 'gray';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter and sort files
  const processedFiles = files
    .filter(file => {
      const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || getFileType(file.filename) === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.uploaded_at) - new Date(a.uploaded_at);
      if (sortBy === 'name') return a.filename.localeCompare(b.filename);
      if (sortBy === 'size') return (b.size_bytes || 0) - (a.size_bytes || 0);
      return 0;
    });

  // Get file type counts
  const typeCounts = files.reduce((acc, file) => {
    const type = getFileType(file.filename);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your files...</p>
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
            <h1>My Files</h1>
            <p>Manage and organize all your uploaded files</p>
          </div>
          <button className="btn-upload" onClick={() => navigate('/upload')}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Files
          </button>
        </div>

        {/* Stats Bar */}
        <div className="files-stats-bar">
          <div className="stat-item">
            <span className="stat-number">{files.length}</span>
            <span className="stat-label">Total Files</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">{typeCounts.image || 0}</span>
            <span className="stat-label">Images</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{typeCounts.document || 0}</span>
            <span className="stat-label">Documents</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{typeCounts.video || 0}</span>
            <span className="stat-label">Videos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{sharedLinks.length}</span>
            <span className="stat-label">Shared</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="files-toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear" onClick={() => setSearchTerm('')}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="toolbar-right">
            {/* Filter */}
            <select 
              className="toolbar-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="pdf">PDFs</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="archive">Archives</option>
            </select>

            {/* Sort */}
            <select 
              className="toolbar-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date (Newest)</option>
              <option value="name">Name (A-Z)</option>
              <option value="size">Size (Largest)</option>
            </select>

            {/* View Toggle */}
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Files Content */}
        <div className="files-content">
          {processedFiles.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="files-grid">
                {processedFiles.map(file => (
                  <div key={file.id} className="file-card">
                    <div className={`file-card-icon ${getFileColorClass(file.filename)}`}>
                      <span>{getFileIcon(file.filename)}</span>
                    </div>
                    <div className="file-card-info">
                      <h4 className="file-card-name" title={file.filename}>
                        {file.filename}
                      </h4>
                      <div className="file-card-meta">
                        <span>{file.size || 'Unknown size'}</span>
                        <span>•</span>
                        <span>{formatDate(file.uploaded_at)}</span>
                      </div>
                    </div>
                    <div className="file-card-actions">
                      <button 
                        className="action-btn download"
                        onClick={() => handleDownload(file.id, file.filename)}
                        title="Download"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button 
                        className="action-btn share"
                        onClick={() => handleShare(file.id, file.filename)}
                        title="Share"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(file.id, file.filename)}
                        title="Delete"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="files-list">
                <table className="files-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Modified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedFiles.map(file => (
                      <tr key={file.id}>
                        <td>
                          <div className="table-file-info">
                            <span className={`table-file-icon ${getFileColorClass(file.filename)}`}>
                              {getFileIcon(file.filename)}
                            </span>
                            <span className="table-file-name">{file.filename}</span>
                          </div>
                        </td>
                        <td className="table-file-size">{file.size || '-'}</td>
                        <td className="table-file-date">{formatDate(file.uploaded_at)}</td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="table-action-btn"
                              onClick={() => handleDownload(file.id, file.filename)}
                              title="Download"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button 
                              className="table-action-btn"
                              onClick={() => handleShare(file.id, file.filename)}
                              title="Share"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                            <button 
                              className="table-action-btn delete"
                              onClick={() => handleDelete(file.id, file.filename)}
                              title="Delete"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="files-empty">
              <div className="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3>{searchTerm || filterType !== 'all' ? 'No files found' : 'No files yet'}</h3>
              <p>
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first file to get started'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <button className="btn-upload-empty" onClick={() => navigate('/upload')}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Files
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedFile(null);
          fetchFiles();
        }}
        file={selectedFile}
      />
    </MainLayout>
  );
};

export default MyFilesPage;