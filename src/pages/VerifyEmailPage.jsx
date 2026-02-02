// src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/auth.css';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Invalid verification link');
        setVerifying(false);
        return;
      }

      try {
        console.log('🔐 Verifying email token...');
        const response = await authAPI.verifyEmail(token);
        
        if (response.data.success) {
          console.log('✅ Email verified successfully');
          
          // Store auth data
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
          setSuccess(true);
          toast.success('✅ Email verified successfully!');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setError(response.data.error || 'Verification failed');
          toast.error(response.data.error || 'Verification failed');
        }
      } catch (err) {
        console.error('❌ Verification error:', err);
        const errorMsg = err.response?.data?.error || 'Verification failed';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-shape auth-bg-shape-1"></div>
        <div className="auth-bg-shape auth-bg-shape-2"></div>
        <div className="auth-bg-shape auth-bg-shape-3"></div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          {verifying && (
            <>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>
                Verifying your email...
              </h2>
              <p style={{ color: '#6b7280' }}>Please wait while we verify your account.</p>
            </>
          )}

          {!verifying && success && (
            <>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#10b981' }}>
                Email Verified!
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Your email has been verified successfully. Redirecting to dashboard...
              </p>
              <div className="btn-spinner" style={{ margin: '0 auto' }}></div>
            </>
          )}

          {!verifying && error && (
            <>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#ef4444' }}>
                Verification Failed
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                {error}
              </p>
              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Back to Registration
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;