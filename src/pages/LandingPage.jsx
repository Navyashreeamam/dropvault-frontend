import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="navbar-logo-text">DropVault</span>
          </Link>
          
          <div className="navbar-actions">
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content animate-fade-in-up">
            <h1 className="hero-title">
              Secure File Storage
              <span className="hero-title-highlight">in the Cloud</span>
            </h1>
            <p className="hero-description">
              Store, share, and manage your files securely with military-grade encryption. 
              Access your files from anywhere, anytime.
            </p>
            
            <div className="hero-buttons">
              <Link to="/register" className="hero-btn-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="hero-btn-secondary">
                Learn More
              </Link>
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <svg className="hero-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>10GB Free Storage</span>
              </div>
              <div className="hero-feature">
                <svg className="hero-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No Credit Card</span>
              </div>
            </div>
          </div>

          <div className="hero-visual animate-fade-in stagger-2">
            <div className="hero-visual-blur-1"></div>
            <div className="hero-visual-blur-2"></div>
            <div className="hero-card">
              <div className="hero-file-list">
                <div className="hero-file-item">
                  <div className="hero-file-icon blue">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="hero-file-info">
                    <h4>Project_Final.pdf</h4>
                    <p>2.4 MB • Uploaded just now</p>
                  </div>
                </div>
                <div className="hero-file-item">
                  <div className="hero-file-icon green">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="hero-file-info">
                    <h4>Vacation_Photos.zip</h4>
                    <p>156 MB • Shared with 3</p>
                  </div>
                </div>
                <div className="hero-file-item">
                  <div className="hero-file-icon purple">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div className="hero-file-info">
                    <h4>Presentation.mp4</h4>
                    <p>420 MB • Private</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header animate-fade-in-up">
            <h2 className="features-title">Everything you need for secure storage</h2>
            <p className="features-subtitle">Powerful features to keep your files safe and accessible</p>
          </div>

          <div className="features-grid">
            <div className="feature-card animate-fade-in-up stagger-1">
              <div className="feature-icon primary">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="feature-title">End-to-End Encryption</h3>
              <p className="feature-description">Your files are encrypted before leaving your device. Only you have the keys.</p>
            </div>

            <div className="feature-card animate-fade-in-up stagger-2">
              <div className="feature-icon cyan">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Access Anywhere</h3>
              <p className="feature-description">View your files from any device, anywhere in the world with internet.</p>
            </div>

            <div className="feature-card animate-fade-in-up stagger-3">
              <div className="feature-icon emerald">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Sharing</h3>
              <p className="feature-description">Share files securely with time-limited links and download restrictions.</p>
            </div>

            <div className="feature-card animate-fade-in-up stagger-4">
              <div className="feature-icon orange">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="feature-title">Trash & Recovery</h3>
              <p className="feature-description">Recover deleted files from trash within 30 days. Never lose anything.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="footer-logo-text">DropVault</span>
          </div>
          <p className="footer-copyright">© 2025 DropVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;