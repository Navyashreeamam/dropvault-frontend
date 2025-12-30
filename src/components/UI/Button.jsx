// src/components/UI/Button.jsx
import React from 'react';
import '../../styles/ui-components.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  className = '',
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full' : '';
  const loadingClass = loading ? 'btn-loading' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`.trim()}
      {...props}
    >
      {loading && (
        <span className="btn-spinner"></span>
      )}
      {!loading && icon && (
        <span className="btn-icon">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;