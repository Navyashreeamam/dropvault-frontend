// src/components/Common/SignOutConfirmation.jsx
import React from 'react';

const SignOutConfirmation = ({ isOpen, onConfirm, onCancel, userName }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(4px)',
  };

  const modalStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.3s ease-out',
  };

  const iconContainerStyle = {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  };

  const messageStyle = {
    color: '#64748b',
    marginBottom: '8px',
    fontSize: '16px',
    lineHeight: '1.5',
  };

  const subMessageStyle = {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '24px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
  };

  const cancelButtonStyle = {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '10px',
    border: 'none',
    background: '#f1f5f9',
    color: '#475569',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const confirmButtonStyle = {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iconContainerStyle}>
          <svg 
            width="40" 
            height="40" 
            fill="none" 
            stroke="#6366f1" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </div>
        
        <h2 style={titleStyle}>Sign Out</h2>
        
        <p style={messageStyle}>
          Are you sure you want to sign out, <strong style={{ color: '#1e293b' }}>{userName}</strong>?
        </p>
        
        <p style={subMessageStyle}>
          You'll need to sign in again to access your files.
        </p>
        
        <div style={buttonContainerStyle}>
          <button
            style={cancelButtonStyle}
            onClick={onCancel}
            onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
            onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
          >
            Cancel
          </button>
          <button
            style={confirmButtonStyle}
            onClick={onConfirm}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutConfirmation;