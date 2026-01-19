// src/pages/VerifyPendingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://dropvault-2.onrender.com';

const VerifyPendingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get email from navigation state or localStorage
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('pendingVerificationEmail', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email found, redirect to register
      navigate('/register');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0 || resending) return;
    
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
        toast.success('Verification email sent! Check your inbox.');
        setCountdown(60); // 60 second cooldown
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

  const handleChangeEmail = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/register');
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-bg">
        <div className="auth-bg-shape auth-bg-shape-1"></div>
        <div className="auth-bg-shape auth-bg-shape-2"></div>
        <div className="auth-bg-shape auth-bg-shape-3"></div>
      </div>

      <div className="verify-pending-container">
        <div className="verify-pending-card">
          {/* Email Icon */}
          <div className="verify-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="verify-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1>Check your email</h1>
          
          <p className="verify-message">
            We've sent a verification link to:
          </p>
          
          <div className="verify-email-display">
            <strong>{email}</strong>
          </div>

          <p className="verify-instructions">
            Click the link in the email to verify your account. 
            The link will expire in <strong>24 hours</strong>.
          </p>

          <div className="verify-actions">
            <button 
              onClick={handleResendEmail}
              disabled={resending || countdown > 0}
              className="resend-btn"
            >
              {resending ? (
                <>
                  <span className="btn-spinner"></span>
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend Email
                </>
              )}
            </button>

            <button 
              onClick={handleChangeEmail}
              className="change-email-btn"
            >
              Use different email
            </button>
          </div>

          <div className="verify-help">
            <h4>Didn't receive the email?</h4>
            <ul>
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          <div className="verify-footer">
            <Link to="/login" className="back-to-login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPendingPage;