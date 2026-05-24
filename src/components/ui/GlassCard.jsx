import React from 'react';

export default function GlassCard({ children, className = '', style = {}, onClick, ...props }) {
  const isClickable = !!onClick;
  
  return (
    <>
      <style>
        {`
          .glass-card:focus-visible {
            outline: 2px solid var(--cyan-primary, #0ea5e9);
            outline-offset: 2px;
          }
        `}
      </style>
      <div 
        className={`glass-card ${className}`} 
        style={style} 
        onClick={onClick}
        role={isClickable ? 'button' : props.role}
        tabIndex={isClickable ? 0 : props.tabIndex}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(e);
          }
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
