// src/components/Auth/GoogleCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    handleGoogleCallback();
  }, []);

  const handleGoogleCallback = async () => {
    try {
      const error = searchParams.get('error');
      if (error) {
        console.error('❌ Google error:', error);
        setStatus('error');
        setErrorMessage('Google login was cancelled');
        toast.error('Google login cancelled');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const code = searchParams.get('code');
      
      if (!code) {
        console.error('❌ No code received');
        setStatus('error');
        setErrorMessage('No authorization code received');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      console.log('🔐 Exchanging code for token...');
      setStatus('authenticating');

      const response = await authAPI.googleLogin(code);
      console.log('🔐 Google response:', response.data);

      if (response.data.success) {
        // Token already stored by authAPI.googleLogin
        await checkAuth();
        toast.success(`Welcome, ${response.data.user?.name || 'User'}!`);
        navigate('/dashboard');
      } else {
        throw new Error(response.data.error || 'Google login failed');
      }

    } catch (err) {
      console.error('❌ Google callback error:', err);
      
      // Extract meaningful error message
      let errorMsg = 'Google authentication failed';
      
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      // Check for specific errors
      if (errorMsg.includes('not configured')) {
        errorMsg = 'Google login is not set up on the server. Please use email/password.';
      }
      
      console.error('Error message:', errorMsg);
      
      setStatus('error');
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {status === 'processing' || status === 'authenticating' ? (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #e2e8f0',
              borderTopColor: '#667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem'
            }}></div>
            <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
              {status === 'processing' ? 'Processing...' : 'Signing you in...'}
            </h2>
            <p style={{ color: '#64748b' }}>
              Please wait while we complete your Google login
            </p>
          </>
        ) : (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>❌</div>
            <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
              Login Failed
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {errorMessage}
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GoogleCallback;