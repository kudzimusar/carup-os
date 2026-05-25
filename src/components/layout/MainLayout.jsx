import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, FileText, Shield, ShieldAlert, Bot, X, ShoppingCart, Upload, LineChart, Scan, Fingerprint, Activity, ChevronDown, Grid, CarFront, Landmark, Building2, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReservationLedger } from '../ui/ReservationLedger';
import './MainLayout.css';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGutuDrawerOpen, setIsGutuDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const { cartItems } = useApp();

  const megaMenus = {
    markets: {
      label: 'Markets & Trading',
      items: [
        { path: '/', label: 'Global Terminal', desc: 'Real-time vehicle marketplace', icon: <Grid size={18} /> },
        { path: '/sell', label: 'Asset Upload', desc: 'List new inventory', icon: <Upload size={18} /> },
        { path: '/compare', label: 'Yield Analytics', desc: 'Compare market values', icon: <LineChart size={18} /> },
        { path: '/safepay', label: 'SafePay Escrow', desc: 'Secure transactions', icon: <Shield size={18} /> }
      ]
    },
    intelligence: {
      label: 'Intelligence',
      items: [
        { path: '/passport', label: 'Registry Passport', desc: 'Vehicle history & specs', icon: <FileText size={18} /> },
        { path: '/ocr', label: 'Vision OCR', desc: 'Document digitizer', icon: <Scan size={18} /> },
        { path: '/partsentry', label: 'PartSentry', desc: 'Component verification', icon: <Fingerprint size={18} /> },
        { path: '/gutu', label: 'Gutu Oracle', desc: 'AI assistant', icon: <Bot size={18} /> }
      ]
    },
    workspaces: {
      label: 'Workspaces',
      items: [
        { path: '/garage', label: 'Garage Portal', desc: 'Consumer dashboard', icon: <Wrench size={18} /> },
        { path: '/corporate', label: 'Corporate Desk', desc: 'Enterprise management', icon: <Building2 size={18} /> },
        { path: '/government', label: 'Gov Gateway', desc: 'Regulatory compliance', icon: <Landmark size={18} /> },
        { path: '/admin', label: 'Command Center', desc: 'System administration', icon: <Activity size={18} /> }
      ]
    }
  };

  const closeMenu = () => setActiveMegaMenu(null);

  const handleNavigate = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="layout-container" style={{ flexDirection: 'column' }}>
      {/* Enterprise Top Navigation */}
      <header className="enterprise-topbar" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 24px', 
        height: '60px', 
        background: '#0a0a0a', 
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="logo-box" style={{ 
          background: '#fff', 
          color: '#000', 
          borderRadius: '4px', 
          padding: '4px 8px', 
          fontWeight: 'bold', 
          marginRight: '12px',
          fontSize: '14px',
          width: 'auto',
          height: 'auto'
        }}>CU</div>
        <span className="logo-text desktop-only" style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          letterSpacing: '1px', 
          textTransform: 'uppercase',
          marginRight: '32px'
        }}>CarUp OS</span>

        {/* Mega Menu Triggers */}
        <nav className="desktop-only" style={{ display: 'flex', gap: '8px', height: '100%' }}>
          {Object.entries(megaMenus).map(([key, menu]) => (
            <div 
              key={key}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setActiveMegaMenu(key)}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button style={{
                background: 'transparent',
                border: 'none',
                color: activeMegaMenu === key ? '#fff' : '#888',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                padding: '0 16px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}>
                {menu.label}
                <ChevronDown size={14} style={{ 
                  transform: activeMegaMenu === key ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s'
                }}/>
              </button>

              {/* Mega Menu Dropdown */}
              {activeMegaMenu === key && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '400px',
                  background: '#111',
                  border: '1px solid #222',
                  borderTop: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  padding: '16px',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                  zIndex: 200
                }}>
                  {menu.items.map((item) => (
                    <button 
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        background: 'transparent',
                        border: '1px solid transparent',
                        borderRadius: '6px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: '#ddd'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1a1a1a';
                        e.currentTarget.style.borderColor = '#333';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <div style={{ color: '#fff', marginTop: '2px' }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Global Search and Actions */}
        <div className="topbar-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
           <div className="search-pill hidden-mobile" style={{
             display: 'flex',
             alignItems: 'center',
             background: '#1a1a1a',
             border: '1px solid #333',
             padding: '6px 12px',
             borderRadius: '4px',
             width: '240px',
             justifyContent: 'space-between',
             height: '32px'
           }}>
             <span style={{ color: '#666', fontSize: '12px' }}>Search VIN, Asset, User...</span>
             <kbd style={{ background: '#333', color: '#aaa', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>⌘K</kbd>
           </div>
           
           <button 
             className={`btn-gold ${cartItems.length > 0 ? 'glow-gold' : ''}`}
             style={{
               padding: '6px 12px',
               display: 'flex',
               alignItems: 'center',
               gap: '8px',
               fontSize: '12px',
               fontWeight: '600',
               position: 'relative',
               background: cartItems.length > 0 ? 'var(--gold-primary)' : 'transparent',
               color: cartItems.length > 0 ? '#000' : 'var(--gold-light)',
               border: '1px solid var(--gold-primary)',
               borderRadius: '4px',
               cursor: 'pointer',
               height: '32px'
             }}
             onClick={() => setIsCartOpen(true)}
           >
             <ShoppingCart size={16} />
             <span className="hidden-mobile">Ledger</span>
             {cartItems.length > 0 && (
               <span style={{
                 position: 'absolute',
                 top: '-6px',
                 right: '-6px',
                 background: '#ef4444',
                 color: '#fff',
                 fontSize: '10px',
                 fontWeight: 'bold',
                 width: '16px',
                 height: '16px',
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

      {/* Main Content Area */}
      <main className="content-area" style={{ flex: 1, padding: '24px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (simplified for ecosystem) */}
      <nav className="mobile-bottom-nav mobile-only glass-card" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: '12px', background: '#0a0a0a', borderTop: '1px solid #222', zIndex: 90
      }}>
        <button className="mobile-nav-btn" onClick={() => navigate('/')}><Grid size={20} /></button>
        <button className="mobile-nav-btn" onClick={() => navigate('/passport')}><FileText size={20} /></button>
        <button className="mobile-nav-btn" onClick={() => navigate('/safepay')}><Shield size={20} /></button>
        <button className="mobile-nav-btn" onClick={() => navigate('/garage')}><Wrench size={20} /></button>
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
              <p>System Online. I am Gutu, your enterprise AI assistant. Ready to query CarUp OS.</p>
            </div>
          </div>
          <div className="gutu-drawer-input">
            <input type="text" className="form-input" placeholder="Execute command..." />
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
