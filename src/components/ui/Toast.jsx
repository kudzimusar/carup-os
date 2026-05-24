import React, { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, isRemoving: true } : t));
    
    // Allow exit animation to complete before removing from DOM
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 400); 
  }, []);

  const success = (msg, dur) => addToast(msg, 'success', dur);
  const error = (msg, dur) => addToast(msg, 'error', dur);
  const info = (msg, dur) => addToast(msg, 'info', dur);
  const warning = (msg, dur) => addToast(msg, 'warning', dur);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  const [expanded, setExpanded] = useState(false);

  // We want to calculate the stack based on visible toasts.
  // The newest toast (last in array) is at the bottom (index 0).
  const activeToasts = toasts.filter(t => !t.isRemoving);
  
  return (
    <div 
      className="toast-container"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div 
        className="toast-hover-bridge" 
        style={{ height: expanded ? `${activeToasts.length * 85}px` : '85px' }} 
      />
      {toasts.map((toast, arrayIndex) => {
        // Find index of this toast among active toasts
        const activeIndex = activeToasts.findIndex(t => t.id === toast.id);
        
        // If it's removing, we want it to gracefully exit from its approximate former position.
        const totalIndex = toasts.length - 1 - arrayIndex;
        const index = activeIndex !== -1 ? activeToasts.length - 1 - activeIndex : totalIndex;
        
        return (
          <ToastMessage 
            key={toast.id} 
            toast={toast} 
            onRemove={removeToast} 
            index={index}
            expanded={expanded}
            total={activeToasts.length}
          />
        );
      })}
    </div>
  );
};

const ToastMessage = ({ toast, onRemove, index, expanded, total }) => {
  const { id, message, type, isRemoving } = toast;
  
  const icons = {
    success: <CheckCircle size={20} className="toast-icon" />,
    error: <XCircle size={20} className="toast-icon" />,
    warning: <AlertTriangle size={20} className="toast-icon" />,
    info: <Info size={20} className="toast-icon" />
  };

  // Stack calculation
  const offset = expanded ? index * 76 : index * 14;
  const scale = expanded ? 1 : 1 - index * 0.05;
  const zIndex = total - index;
  const opacity = isRemoving ? 0 : (expanded ? 1 : (index < 3 ? 1 - index * 0.15 : 0));
  
  // Exiting toasts slide down slightly and fade out
  const exitTransform = isRemoving ? `translateY(24px) scale(0.95)` : `translateY(calc(${offset}px * -1)) scale(${scale})`;

  return (
    <div 
      className={`toast-message toast-${type} ${isRemoving ? 'toast-exit' : 'toast-enter'}`}
      style={{
        zIndex,
        opacity,
        transform: exitTransform
      }}
    >
      <div className="toast-icon-container">
        {icons[type] || icons.info}
      </div>
      <div className="toast-content">
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={() => onRemove(id)} aria-label="Close">
        <X size={16} />
      </button>
    </div>
  );
};
