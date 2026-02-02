// src/pages/VerifyPendingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/auth.css';

const VerifyPendingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resendVerification } = useAuth();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('pendingVerificationEmail', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/register');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email || countdown > 0 || resending) return;
    
    setResending(true);
    try {
      const result = await resendVerification(email);
      if (result.success) {
        toast.success('Verification email sent!');
        setCountdown(60);
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      toast.error('Failed to send email');
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

      <div className="auth-container">
        <div className="auth-branding">
          <div className="auth-branding-content">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span>DropVault</span>
            </Link>
            
            <h1 className="auth-branding-title">
              Almost There!<br />Check Your Email
            </h1>
            
            <p className="auth-branding-text">
              We've sent a verification link to your email address.
            </p>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="verify-icon-container">
              <div className="verify-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="auth-form-header">
              <h2>Check your email</h2>
              <p>We sent a verification link to</p>
            </div>

            <div className="verify-email-display">
              <span>{email}</span>
            </div>

            <p className="verify-instructions">
              Click the link in the email to verify your account. 
              If you don't see it, check your spam folder.
            </p>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={handleResend}
              disabled={resending || countdown > 0}
            >
              {resending ? (
                <>
                  <span className="btn-spinner"></span>
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend verification email'
              )}
            </button>

            <button
              type="button"
              className="verify-change-email"
              onClick={() => {
                localStorage.removeItem('pendingVerificationEmail');
                navigate('/register');
              }}
            >
              Wrong email? Sign up with a different one
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <p className="auth-footer-text">
              Already verified?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPendingPage;