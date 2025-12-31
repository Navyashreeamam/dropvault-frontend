// src/components/Modals/ShareModal.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { fileAPI } from '../../services/api';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, file }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  React.useEffect(() => {
    if (isOpen && file) {
      generateShareLink();
    }
  }, [isOpen, file]);

  const generateShareLink = async () => {
    try {
      const response = await fileAPI.shareFile(file.id, { expiry_days: 7 });
      setShareUrl(response.data.share_url || response.data.link);
    } catch (error) {
      console.error('Failed to generate share link:', error);
      toast.error('Failed to generate share link');
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) {
      toast.error('Share link not available');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

const handleEmailShare = async (e) => {
  e.preventDefault();

  if (!email.trim()) {
    toast.error('Please enter an email address');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error('Please enter a valid email address');
    return;
  }

  setSending(true);
  try {
    await fileAPI.shareViaEmail(file.id, {
      recipient_email: email,
      message: message || `I'm sharing "${file.filename}" with you via DropVault.`
    });
    
    toast.success(`File shared with ${email}! Check spam folder.`);
    setEmail('');
    setMessage('');
    onClose();
  } catch (error) {
    console.error('Email share error:', error);
    
    const errorData = error.response?.data;
    
    // ✅ Handle 403 - Email restriction
    if (error.response?.status === 403) {
      const allowedEmail = errorData?.allowed_email || 'navyashreeamam@gmail.com';
      toast.error(
        `Test Mode: Can only send to ${allowedEmail}. To enable all emails, verify a domain at resend.com/domains`,
        { duration: 6000 }
      );
    } 
    // Handle other errors
    else {
      const errorMsg = errorData?.error || errorData?.message || 'Failed to send email';
      toast.error(errorMsg);
    }
  } finally {
    setSending(false);
  }
};

  if (!isOpen || !file) return null;

  return (
    <>
      <div className="share-modal-backdrop" onClick={onClose}></div>
      <div className="share-modal">
        <div className="share-modal-header">
          <div className="share-modal-title">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <h2>Share File</h2>
          </div>
          <button className="share-modal-close" onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="share-file-info">
          <div className="share-file-icon">📄</div>
          <div className="share-file-details">
            <div className="share-file-name">{file.filename}</div>
            <div className="share-file-meta">{file.size || 'Unknown size'}</div>
          </div>
        </div>

        <div className="share-options">
          <div className="share-option">
            <div className="share-option-header">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3>Copy Link</h3>
            </div>
            <p className="share-option-description">
              Anyone with the link can view and download this file
            </p>
            <div className="share-link-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-link-input"
                placeholder="Generating link..."
              />
              <button className="btn-copy" onClick={handleCopyLink} disabled={!shareUrl}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>

          <div className="share-divider"><span>OR</span></div>

          <div className="share-option">
            <div className="share-option-header">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3>Share via Email</h3>
            </div>
            <p className="share-option-description">
              Send the share link directly to someone's email
            </p>
            <form onSubmit={handleEmailShare} className="email-share-form">
              <div className="form-group">
                <label>Recipient Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="email-input"
                  disabled={sending}
                />
              </div>
              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="message-textarea"
                  rows="3"
                  disabled={sending}
                />
              </div>
              <button type="submit" className="btn-send-email" disabled={sending}>
                {sending ? (
                  <>
                    <span className="btn-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Email
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;