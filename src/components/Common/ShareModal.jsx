// src/components/Common/ShareModal.jsx
import React, { useState } from 'react';
import { fileAPI } from '../../services/api';
import toast from 'react-hot-toast';
import '../../styles/sharemodal.css';

const ShareModal = ({ file, onClose, onShareComplete }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [expiryDays, setExpiryDays] = useState(7);
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const handleEmailShare = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await fileAPI.shareFileByEmail(file.id, {
        email,
        permission,
        expiry_days: expiryDays
      });
      
      toast.success(`Shared with ${email} successfully!`);
      setEmail('');
      if (onShareComplete) onShareComplete();
    } catch (error) {
      toast.error('Failed to share file');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await fileAPI.shareFile(file.id, {
        permission,
        expiry_days: expiryDays
      });
      
      setShareLink(response.data.share_url);
      setLinkGenerated(true);
      toast.success('Share link generated!');
      if (onShareComplete) onShareComplete();
    } catch (error) {
      toast.error('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return '🖼️';
    if (['pdf'].includes(ext)) return '📕';
    if (['doc', 'docx'].includes(ext)) return '📘';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['mp4', 'mov'].includes(ext)) return '🎬';
    if (['mp3', 'wav'].includes(ext)) return '🎵';
    if (['zip', 'rar'].includes(ext)) return '📦';
    return '📄';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <div className="share-file-info">
            <span className="share-file-icon">{getFileIcon(file?.filename)}</span>
            <div>
              <h2>Share File</h2>
              <p className="share-filename">{file?.filename}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="share-tabs">
          <button 
            className={`share-tab ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Share via Email
          </button>
          <button 
            className={`share-tab ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => setActiveTab('link')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Get Link
          </button>
        </div>

        {/* Content */}
        <div className="share-modal-content">
          {activeTab === 'email' ? (
            <form onSubmit={handleEmailShare} className="share-email-form">
              {/* Email Input */}
              <div className="form-group">
                <label>Email Address</label>
                <div className="email-input-wrapper">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Permission Selection */}
              <div className="form-group">
                <label>Permission</label>
                <div className="permission-options">
                  <label className={`permission-option ${permission === 'view' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="permission"
                      value="view"
                      checked={permission === 'view'}
                      onChange={(e) => setPermission(e.target.value)}
                    />
                    <div className="permission-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="permission-info">
                      <span className="permission-title">View only</span>
                      <span className="permission-desc">Can view but not edit</span>
                    </div>
                  </label>

                  <label className={`permission-option ${permission === 'edit' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="permission"
                      value="edit"
                      checked={permission === 'edit'}
                      onChange={(e) => setPermission(e.target.value)}
                    />
                    <div className="permission-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="permission-info">
                      <span className="permission-title">Can edit</span>
                      <span className="permission-desc">Can view and edit file</span>
                    </div>
                  </label>

                  <label className={`permission-option ${permission === 'download' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="permission"
                      value="download"
                      checked={permission === 'download'}
                      onChange={(e) => setPermission(e.target.value)}
                    />
                    <div className="permission-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div className="permission-info">
                      <span className="permission-title">Can download</span>
                      <span className="permission-desc">Can view and download</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Expiry */}
              <div className="form-group">
                <label>Link expires in</label>
                <select 
                  value={expiryDays} 
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="expiry-select"
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-share-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Invite
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="share-link-section">
              {/* Permission Selection */}
              <div className="form-group">
                <label>Anyone with the link can</label>
                <select 
                  value={permission} 
                  onChange={(e) => setPermission(e.target.value)}
                  className="permission-select"
                >
                  <option value="view">View only</option>
                  <option value="edit">Edit</option>
                  <option value="download">Download</option>
                </select>
              </div>

              {/* Expiry */}
              <div className="form-group">
                <label>Link expires in</label>
                <select 
                  value={expiryDays} 
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="expiry-select"
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              {/* Generate or Copy Link */}
              {linkGenerated ? (
                <div className="link-generated">
                  <div className="link-box">
                    <input type="text" value={shareLink} readOnly />
                    <button className="btn-copy-link" onClick={handleCopyLink}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <p className="link-expiry-info">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Expires in {expiryDays} {expiryDays === 1 ? 'day' : 'days'}
                  </p>
                  <button className="btn-generate-new" onClick={handleGenerateLink}>
                    Generate New Link
                  </button>
                </div>
              ) : (
                <button 
                  className="btn-generate-link" 
                  onClick={handleGenerateLink}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Generate Share Link
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;