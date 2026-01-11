// src/pages/PricingPage.jsx

import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/pricing.css';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const navigate = useNavigate();

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      storage: '10 GB',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        '10 GB Storage',
        'Basic file sharing',
        'Upload up to 100 MB per file',
        'Email support',
        'Mobile access',
        'Standard security'
      ],
      highlighted: false,
      buttonText: 'Current Plan',
      disabled: true
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Best for personal use',
      storage: '15 GB',
      priceMonthly: 99,
      priceYearly: 999,
      features: [
        '15 GB Storage',
        'Advanced file sharing',
        'Upload up to 500 MB per file',
        'Priority email support',
        'Mobile & desktop sync',
        'Enhanced security',
        'File version history',
        'Shared folders'
      ],
      highlighted: true,
      popular: true,
      buttonText: 'Upgrade to Pro',
      disabled: false
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For power users & teams',
      storage: '20 GB',
      priceMonthly: 199,
      priceYearly: 1999,
      features: [
        '20 GB Storage',
        'Unlimited file sharing',
        'Upload up to 2 GB per file',
        '24/7 Priority support',
        'All device sync',
        'Advanced encryption',
        'Extended version history',
        'Team collaboration',
        'Admin controls',
        'API access'
      ],
      highlighted: false,
      buttonText: 'Upgrade to Business',
      disabled: false
    }
  ];

  const handleUpgrade = (plan) => {
    if (plan.disabled) return;
    
    // Here you would integrate with your payment gateway
    toast.success(`Redirecting to payment for ${plan.name} plan...`);
    
    // For now, show a coming soon message
    setTimeout(() => {
      toast('Payment integration coming soon!', {
        icon: '🚀',
        duration: 3000
      });
    }, 1000);
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const calculateSavings = (monthly, yearly) => {
    const yearlyIfMonthly = monthly * 12;
    const savings = yearlyIfMonthly - yearly;
    const percentage = Math.round((savings / yearlyIfMonthly) * 100);
    return { savings, percentage };
  };

  return (
    <MainLayout>
      <div className="pricing-page">
        {/* Page Header */}
        <div className="pricing-header">
          <h1>Upgrade Your Storage</h1>
          <p className="pricing-subtitle">
            Choose the perfect plan for your needs. Store more, share more, do more.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
          <button 
            className="toggle-switch"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          >
            <div className={`toggle-slider ${billingCycle === 'yearly' ? 'yearly' : ''}`}></div>
          </button>
          <span className={billingCycle === 'yearly' ? 'active' : ''}>
            Yearly
            <span className="save-badge">Save up to 17%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {pricingPlans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
            const { savings, percentage } = calculateSavings(plan.priceMonthly, plan.priceYearly);
            
            return (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-badge">
                    <span>⭐ Most Popular</span>
                  </div>
                )}
                
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">
                    {price === 0 ? '0' : price.toLocaleString('en-IN')}
                  </span>
                  {price > 0 && (
                    <span className="period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  )}
                </div>

                {billingCycle === 'yearly' && plan.priceMonthly > 0 && (
                  <div className="yearly-savings">
                    Save ₹{savings.toLocaleString('en-IN')}/year ({percentage}% off)
                  </div>
                )}

                <div className="plan-storage">
                  <div className="storage-icon">💾</div>
                  <span className="storage-amount">{plan.storage}</span>
                  <span className="storage-label">Storage</span>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  className={`plan-button ${plan.highlighted ? 'primary' : ''} ${plan.disabled ? 'disabled' : ''}`}
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.disabled}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="pricing-footer">
          <div className="guarantee-section">
            <div className="guarantee-icon">🛡️</div>
            <div className="guarantee-content">
              <h4>30-Day Money Back Guarantee</h4>
              <p>Not satisfied? Get a full refund within 30 days, no questions asked.</p>
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">🔒</span>
              <h5>Secure Payments</h5>
              <p>256-bit SSL encryption</p>
            </div>
            <div className="info-card">
              <span className="info-icon">📱</span>
              <h5>Access Anywhere</h5>
              <p>Web, mobile & desktop</p>
            </div>
            <div className="info-card">
              <span className="info-icon">💬</span>
              <h5>24/7 Support</h5>
              <p>We're here to help</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I upgrade or downgrade anytime?</h4>
              <p>Yes! You can change your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit/debit cards, UPI, and net banking.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a limit on file uploads?</h4>
              <p>File size limits vary by plan. Free allows 100MB, Pro 500MB, and Business 2GB per file.</p>
            </div>
            <div className="faq-item">
              <h4>What happens if I exceed my storage?</h4>
              <p>You'll be notified when approaching your limit. Upgrade anytime for more space.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PricingPage;