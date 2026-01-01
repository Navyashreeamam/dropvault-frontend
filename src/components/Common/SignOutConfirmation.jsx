// src/components/Common/SignOutConfirmation.jsx
import React from 'react';
import '../../styles/modal.css';

const SignOutConfirmation = ({ isOpen, onConfirm, onCancel, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content signout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </div>
        
        <h2 className="modal-title">Sign Out</h2>
        
        <p className="modal-message">
          Are you sure you want to sign out, <strong>{userName}</strong>?
        </p>
        
        <p className="modal-submessage">
          You'll need to sign in again to access your files.
        </p>
        
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutConfirmation;