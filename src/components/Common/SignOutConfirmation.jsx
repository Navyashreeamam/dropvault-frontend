// src/components/Common/SignOutConfirmation.jsx
import React from 'react';

const SignOutConfirmation = ({ isOpen, onConfirm, onCancel, userName }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onCancel}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '12px',
        }}>
          Sign Out
        </h2>
        
        <p style={{ 
          color: '#64748b', 
          marginBottom: '24px',
          fontSize: '16px',
        }}>
          Are you sure you want to sign out, <strong style={{ color: '#1e293b' }}>{userName}</strong>?
        </p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#f1f5f9',
              color: '#475569',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutConfirmation;