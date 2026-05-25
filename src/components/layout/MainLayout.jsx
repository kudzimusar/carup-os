import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, FileText, Shield, ShieldAlert, Bot, X, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReservationLedger } from '../ui/ReservationLedger';
import './MainLayout.css';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGutuDrawerOpen, setIsGutuDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useApp();


  const ecosystemLinks = [
    { label: 'Insurance', to: '/content/insurance' },
    { label: 'Financing', to: '/content/financing' },
    { label: 'Garages', to: '/garage' },
    { label: 'Imports', to: '/content/imports' },
    { label: 'Dealers', to: '/content/dealers' }
  ];

  const navItems = [
    { path: '/', label: 'Market', icon: <Sparkles size={20} /> },
    { path: '/passport', label: 'Registry', icon: <FileText size={20} /> },
    { path: '/safepay', label: 'SafePay', icon: <Shield size={20} /> },
    { path: '/gutu', label: 'Gutu AI', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="layout-container">
      {/* Desktop Sidebar */}
      <aside className="sidebar desktop-only">
        <div className="sidebar-header">
          <div className="logo-box">CU</div>
          <span className="logo-text">CarUp OS</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button 
              key={item.path}
              className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Sticky Topbar */}
        <header className="topbar glass-card">
          <div className="mobile-only logo-container">
            <div className="logo-box-mobile">CU</div>
            <span className="logo-text" style={{ fontSize: '18px' }}>CarUp</span>
          </div>
          
          <div className="topbar-actions">
             {/* Future: Global search, user profile, notifications */}
             <div className="search-pill hidden-mobile">
               <span style={{ color: 'var(--text-muted)' }}>Search VIN, Make, Model...</span>
               <kbd>⌘K</kbd>
             </div>
             
             {/* Global Cart / Reservation Ledger Toggle */}
             <button 
               className={`btn-gold ${cartItems.length > 0 ? 'glow-gold' : ''}`}
               style={{
                 padding: '8px 16px',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '8px',
                 fontSize: '14px',
                 position: 'relative',
                 background: cartItems.length > 0 ? 'var(--gold-primary)' : 'transparent',
                 color: cartItems.length > 0 ? '#000' : 'var(--gold-light)',
                 borderColor: 'var(--gold-primary)',
                 borderRadius: '20px'
               }}
               onClick={() => setIsCartOpen(true)}
             >
               <ShoppingCart size={18} />
               <span className="hidden-mobile">Reserve Ledger</span>
               {cartItems.length > 0 && (
                 <span style={{
                   position: 'absolute',
                   top: '-6px',
                   right: '-6px',
                   background: '#ef4444',
                   color: '#fff',
                   fontSize: '11px',
                   fontWeight: 'bold',
                   width: '20px',
                   height: '20px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   borderRadius: '50%',
                   boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                 }}>
                   {cartItems.length}
                 </span>
               )}
             </button>
          </div>
        </header>

        <div className="ecosystem-links hidden-mobile" style={{ display: 'flex', gap: '10px', padding: '0 6px 12px 6px', flexWrap: 'wrap' }}>
          {ecosystemLinks.map((link) => (
            <button
              key={link.to}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '12px' }}
              onClick={() => navigate(link.to)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <main className="content-area">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav mobile-only glass-card">
        {navItems.map((item) => (
          <button 
            key={item.path}
            className={`mobile-nav-btn ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="mobile-nav-icon-wrapper">
              {item.icon}
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Gutu AI Orb */}
      <button 
        className="gutu-orb hover-volumetric"
        onClick={() => setIsGutuDrawerOpen(true)}
      >
        <Bot size={28} />
      </button>

      {/* Gutu AI Assistant Drawer Overlay */}
      <div className={`gutu-drawer-overlay ${isGutuDrawerOpen ? 'open' : ''}`} onClick={() => setIsGutuDrawerOpen(false)}>
        <div className={`gutu-drawer glass-card ${isGutuDrawerOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="gutu-drawer-header">
            <div className="gutu-drawer-title">
              <Bot size={24} className="cyan-glow-icon" />
              <span>Gutu AI</span>
            </div>
            <button className="modal-close-btn" onClick={() => setIsGutuDrawerOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="gutu-drawer-content">
            <div className="gutu-message system">
              <Sparkles size={16} className="cyan-glow-icon" />
              <p>Hello! I am Gutu, your AI assistant. How can I help you navigate CarUp OS today?</p>
            </div>
          </div>
          <div className="gutu-drawer-input">
            <input type="text" className="form-input" placeholder="Ask Gutu..." />
            <button className="btn-primary" style={{ minWidth: '80px', padding: '12px' }}>Send</button>
          </div>
        </div>
      </div>

      {/* Global Reservation Ledger */}
      <ReservationLedger 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('/safepay', { state: { selectedVins: cartItems } });
        }}
      />
    </div>
  );
}
