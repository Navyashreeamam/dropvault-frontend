// src/pages/VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://dropvault-2.onrender.com';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'expired'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/verify-email-token/?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        
        // Store auth data
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        if (data.sessionid) {
          localStorage.setItem('sessionid', data.sessionid);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
        }
        
        // Clear pending verification email
        localStorage.removeItem('pendingVerificationEmail');
        
        toast.success('Email verified! Welcome to DropVault!');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
      } else if (data.expired) {
        setStatus('expired');
        setMessage(data.error || 'Verification link has expired.');
        setEmail(data.email || '');
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Failed to verify email. Please try again.');
    }
  };

  const handleResendEmail = async () => {
    if (!email || resending) return;
    
    setResending(true);
    
    try {
      const response = await fetch(`${API_URL}/api/resend-verification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('New verification email sent!');
        navigate('/verify-pending', { state: { email } });
      } else {
        toast.error(data.error || 'Failed to resend email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-shape auth-bg-shape-1"></div>
        <div className="auth-bg-shape auth-bg-shape-2"></div>
        <div className="auth-bg-shape auth-bg-shape-3"></div>
      </div>

      <div className="verify-pending-container">
        <div className="verify-pending-card">
          {/* Status Icon */}
          {status === 'verifying' && (
            <div className="verify-icon verifying">
              <div className="verify-spinner"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="verify-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {status === 'error' && (
            <div className="verify-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {status === 'expired' && (
            <div className="verify-icon expired">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {/* Status Messages */}
          {status === 'verifying' && (
            <>
              <h1>Verifying your email...</h1>
              <p className="verify-message">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <h1>Email Verified! 🎉</h1>
              <p className="verify-message">{message}</p>
              <p className="verify-instructions">Redirecting you to your dashboard...</p>
              <Link to="/dashboard" className="auth-submit-btn" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Go to Dashboard
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <h1>Verification Failed</h1>
              <p className="verify-message error-text">{message}</p>
              <div className="verify-actions">
                <Link to="/register" className="auth-submit-btn">
                  Create New Account
                </Link>
                <Link to="/login" className="change-email-btn">
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {status === 'expired' && (
            <>
              <h1>Link Expired</h1>
              <p className="verify-message">{message}</p>
              {email && (
                <div className="verify-email-display">
                  <strong>{email}</strong>
                </div>
              )}
              <div className="verify-actions">
                <button 
                  onClick={handleResendEmail}
                  disabled={resending || !email}
                  className="auth-submit-btn"
                >
                  {resending ? (
                    <>
                      <span className="btn-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Send New Link
                    </>
                  )}
                </button>
                <Link to="/login" className="change-email-btn">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;