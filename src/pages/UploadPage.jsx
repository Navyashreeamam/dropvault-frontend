// src/pages/UploadPage.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { fileAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/upload.css';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Process selected files
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      type: getFileType(file.name),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file type
  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'],
      pdf: ['pdf'],
      document: ['doc', 'docx', 'txt', 'rtf', 'odt'],
      spreadsheet: ['xls', 'xlsx', 'csv'],
      presentation: ['ppt', 'pptx'],
      video: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      audio: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
      archive: ['zip', 'rar', '7z', 'tar', 'gz'],
      code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp']
    };
    
    for (const [type, extensions] of Object.entries(types)) {
      if (extensions.includes(ext)) return type;
    }
    return 'file';
  };

  // Get file icon
  const getFileIcon = (type) => {
    const icons = {
      image: '🖼️',
      pdf: '📕',
      document: '📘',
      spreadsheet: '📊',
      presentation: '📽️',
      video: '🎬',
      audio: '🎵',
      archive: '📦',
      code: '💻',
      file: '📄'
    };
    return icons[type] || '📄';
  };

  // Get file color class
  const getFileColorClass = (type) => {
    const colors = {
      image: 'green',
      pdf: 'red',
      document: 'blue',
      spreadsheet: 'emerald',
      presentation: 'orange',
      video: 'purple',
      audio: 'pink',
      archive: 'yellow',
      code: 'cyan',
      file: 'gray'
    };
    return colors[type] || 'gray';
  };

  // Remove file from list
  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  // Upload all files
  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast.error('No files to upload');
      return;
    }

    setUploading(true);

    for (const fileItem of pendingFiles) {
      try {
        // Initialize progress
        setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
        
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'uploading' } : f
        ));

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[fileItem.id] || 0;
            if (current < 90) {
              return { ...prev, [fileItem.id]: current + Math.random() * 15 };
            }
            return prev;
          });
        }, 200);

        // Create form data
        const formData = new FormData();
        formData.append('file', fileItem.file);

        // Upload file
        await fileAPI.uploadFile(formData);

        // Clear interval and set to 100%
        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }));
        
        // Update status to completed
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'completed' } : f
        ));

        toast.success(`"${fileItem.name}" uploaded successfully!`);
      } catch (error) {
        // Update status to error
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error' } : f
        ));
        toast.error(`Failed to upload "${fileItem.name}"`);
      }
    }

    setUploading(false);
  };

  // Upload single file
  const uploadSingleFile = async (fileItem) => {
    try {
      setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'uploading' } : f
      ));

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[fileItem.id] || 0;
          if (current < 90) {
            return { ...prev, [fileItem.id]: current + Math.random() * 15 };
          }
          return prev;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', fileItem.file);

      await fileAPI.uploadFile(formData);

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }));
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'completed' } : f
      ));

      toast.success(`"${fileItem.name}" uploaded!`);
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'error' } : f
      ));
      toast.error(`Failed to upload "${fileItem.name}"`);
    }
  };

  // Clear completed files
  const clearCompleted = () => {
    setFiles(prev => {
      prev.filter(f => f.status === 'completed').forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      return prev.filter(f => f.status !== 'completed');
    });
  };

  // Clear all files
  const clearAll = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
    setUploadProgress({});
  };

  // Go to My Files
  const goToMyFiles = () => {
    navigate('/myfiles');
  };

  // Trigger file input
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Count files by status
  const pendingCount = files.filter(f => f.status === 'pending').length;
  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <MainLayout>
      <div className="upload-page">
        {/* Header */}
        <div className="upload-header">
          <div className="upload-header-content">
            <h1>Upload Files</h1>
            <p>Drag and drop files or click to browse from your computer</p>
          </div>
          {completedCount > 0 && (
            <button className="btn-view-files" onClick={goToMyFiles}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              View My Files
            </button>
          )}
        </div>

        {/* Upload Zone */}
        <div 
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            className="upload-input"
          />
          
          <div className="upload-zone-content">
            <div className="upload-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div className="upload-text">
              <h3>
                {dragActive ? 'Drop files here...' : 'Drop files here or click to upload'}
              </h3>
              <p>Support for images, documents, videos, and more (up to 100MB each)</p>
            </div>

            <button type="button" className="upload-browse-btn" onClick={(e) => e.stopPropagation()}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Browse Files
            </button>
          </div>

          {/* Supported formats hint */}
          <div className="upload-formats">
            <span>📷 Images</span>
            <span>📄 Documents</span>
            <span>🎬 Videos</span>
            <span>🎵 Audio</span>
            <span>📦 Archives</span>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="upload-files-section">
            {/* Files Header */}
            <div className="upload-files-header">
              <div className="files-header-left">
                <h2>Selected Files</h2>
                <div className="files-stats">
                  <span className="stat-badge total">{files.length} total</span>
                  {pendingCount > 0 && <span className="stat-badge pending">{pendingCount} pending</span>}
                  {completedCount > 0 && <span className="stat-badge completed">{completedCount} uploaded</span>}
                  {errorCount > 0 && <span className="stat-badge error">{errorCount} failed</span>}
                </div>
              </div>
              <div className="files-header-actions">
                {completedCount > 0 && (
                  <button className="btn-secondary" onClick={clearCompleted}>
                    Clear Completed
                  </button>
                )}
                {files.length > 0 && (
                  <button className="btn-secondary" onClick={clearAll}>
                    Clear All
                  </button>
                )}
                <button 
                  className="btn-primary"
                  onClick={uploadFiles}
                  disabled={uploading || pendingCount === 0}
                >
                  {uploading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload All ({pendingCount})
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Files List */}
            <div className="upload-files-list">
              {files.map(fileItem => (
                <div key={fileItem.id} className={`upload-file-item ${fileItem.status}`}>
                  {/* File Preview/Icon */}
                  <div className={`file-preview ${getFileColorClass(fileItem.type)}`}>
                    {fileItem.preview ? (
                      <img src={fileItem.preview} alt={fileItem.name} />
                    ) : (
                      <span className="file-icon">{getFileIcon(fileItem.type)}</span>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="file-info">
                    <div className="file-name" title={fileItem.name}>{fileItem.name}</div>
                    <div className="file-meta">
                      <span className="file-size">{fileItem.sizeFormatted}</span>
                      <span className="file-type">{fileItem.type.toUpperCase()}</span>
                      
                      {/* Status Badge */}
                      {fileItem.status === 'completed' && (
                        <span className="status-badge success">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Uploaded
                        </span>
                      )}
                      {fileItem.status === 'error' && (
                        <span className="status-badge error">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Failed
                        </span>
                      )}
                      {fileItem.status === 'uploading' && (
                        <span className="status-badge uploading">
                          <span className="mini-spinner"></span>
                          Uploading...
                        </span>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    {(fileItem.status === 'uploading' || uploadProgress[fileItem.id] !== undefined) && (
                      <div className="file-progress">
                        <div className="progress-track">
                          <div 
                            className="progress-fill"
                            style={{ width: `${uploadProgress[fileItem.id] || 0}%` }}
                          ></div>
                        </div>
                        <span className="progress-percent">
                          {Math.round(uploadProgress[fileItem.id] || 0)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="file-actions">
                    {fileItem.status === 'pending' && !uploading && (
                      <button 
                        className="btn-upload-single"
                        onClick={() => uploadSingleFile(fileItem)}
                        title="Upload this file"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                    )}
                    {fileItem.status === 'error' && (
                      <button 
                        className="btn-retry"
                        onClick={() => uploadSingleFile(fileItem)}
                        title="Retry upload"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                    {fileItem.status !== 'uploading' && (
                      <button 
                        className="btn-remove"
                        onClick={() => removeFile(fileItem.id)}
                        title="Remove"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="upload-tips">
          <h3>💡 Upload Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon blue">📁</div>
              <div className="tip-content">
                <h4>All Formats Supported</h4>
                <p>Upload documents, images, videos, audio files, and archives.</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon green">⚡</div>
              <div className="tip-content">
                <h4>Fast & Secure</h4>
                <p>Files are encrypted and stored securely in the cloud.</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon purple">🔗</div>
              <div className="tip-content">
                <h4>Easy Sharing</h4>
                <p>Share files instantly via link or email after upload.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadPage;