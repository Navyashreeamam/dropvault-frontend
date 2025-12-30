// src/components/Common/SignOutConfirmation.jsx
import React from 'react';
import '../../styles/signout-confirmation.css';

const SignOutConfirmation = ({ isOpen, onConfirm, onCancel, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="signout-overlay" onClick={onCancel}>
      <div className="signout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="signout-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        
        <h2 className="signout-title">Sign out of DropVault?</h2>
        <p className="signout-message">
          {userName}, are you sure you want to sign out? You'll need to log in again to access your files.
        </p>

        <div className="signout-actions">
          <button className="btn-cancel" onClick={onCancel}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            No, Stay
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutConfirmation;