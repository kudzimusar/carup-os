import React from 'react';

export default function Badge({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = 'trust-score-badge';
  
  const variantClasses = {
    primary: 'trust-mid', // fallback
    high: 'trust-high', 
    mid: 'trust-mid',
    low: 'trust-low',
    alert: 'trust-low', // map alert to low
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`} {...props}>
      {children}
    </span>
  );
}
