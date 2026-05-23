import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Marketplace from './components/Marketplace'
import HistoryChecker from './components/HistoryChecker'
import GutuOCR from './components/GutuOCR'
import PartSentry from './components/PartSentry'
import SafePay from './components/SafePay'
import GutuAI from './components/GutuAI'
import GaragePortal from './components/GaragePortal'
import CorporatePortal from './components/CorporatePortal'
import GovernmentPortal from './components/GovernmentPortal'
import { Shield, Sparkles, Key, FileText, CheckSquare, ShieldAlert, Users, Wrench, Briefcase, Landmark, MessageSquare, Loader2 } from 'lucide-react'

function AppContent() {
  const [portalMode, setPortalMode] = useState('consumer') // consumer, garage, corporate, government
  const [activeTab, setActiveTab] = useState('marketplace') // marketplace, history, ocr, partsentry, safepay, gutu, workorders, risk, duty
  const [selectedVinForSafePay, setSelectedVinForSafePay] = useState('')
  const [showWhatsappPanel, setShowWhatsappPanel] = useState(false)
  const { notifications, approvePartSentrySwap, rejectPartSentrySwap, whatsappQueue } = useApp()


  const handleSelectedVinForSafePay = (vin) => {
    setSelectedVinForSafePay(vin)
  }

  // Helper to change portals and reset corresponding default active tabs
  const handlePortalSwitch = (mode) => {
    setPortalMode(mode)
    if (mode === 'consumer') setActiveTab('marketplace')
    else if (mode === 'garage') setActiveTab('workorders')
    else if (mode === 'corporate') setActiveTab('risk')
    else if (mode === 'government') setActiveTab('duty')
  }

  return (
    <div className={`app-container theme-${portalMode}`}>
      
      {/* Mobile-Only Header with Portal Selector */}
      <header className="mobile-header">
        <a href="#" className="logo-container" onClick={() => handlePortalSwitch('consumer')}>
          <div className="mobile-logo-circle">CU</div>
          <span className="logo-text" style={{ fontSize: '20px' }}>CarUp</span>
        </a>
        <div className="mobile-portal-dropdown-wrapper">
          <select 
            value={portalMode} 
            onChange={(e) => handlePortalSwitch(e.target.value)}
            className="mobile-portal-select"
          >
            <option value="consumer">Consumer OS</option>
            <option value="garage">Garage OS</option>
            <option value="corporate">Corporate Desk</option>
            <option value="government">Gov Registry</option>
          </select>
        </div>
      </header>

      {/* Premium Glassmorphic Header */}
      <header className="header-glass" style={{ margin: '20px -24px 32px -24px', borderRadius: '16px' }}>
        <div className="header-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <a href="#" className="logo-container" onClick={() => handlePortalSwitch('consumer')}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--theme-accent) 0%, var(--gold-primary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: 800,
                transition: 'var(--transition-smooth)'
              }}>CU</div>
              <div>
                <span className="logo-text">CarUp</span>
                <span className="logo-badge" style={{ marginLeft: '8px' }}>OS v1.0</span>
              </div>
            </a>

            {/* Portal HUD Switcher */}
            <div className="portal-hud-switcher" style={{
              display: 'flex',
              gap: '4px',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)',
              flexWrap: 'wrap'
            }}>
              <button 
                className={`portal-hud-btn ${portalMode === 'consumer' ? 'active' : ''}`}
                style={{
                  background: portalMode === 'consumer' ? 'var(--theme-glow-strong)' : 'transparent',
                  color: portalMode === 'consumer' ? 'var(--theme-text-accent)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '40px',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => handlePortalSwitch('consumer')}
              >
                <Users size={14} /> Consumer OS
              </button>
              <button 
                className={`portal-hud-btn ${portalMode === 'garage' ? 'active' : ''}`}
                style={{
                  background: portalMode === 'garage' ? 'var(--theme-glow-strong)' : 'transparent',
                  color: portalMode === 'garage' ? 'var(--theme-text-accent)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '40px',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => handlePortalSwitch('garage')}
              >
                <Wrench size={14} /> Garage OS
              </button>
              <button 
                className={`portal-hud-btn ${portalMode === 'corporate' ? 'active' : ''}`}
                style={{
                  background: portalMode === 'corporate' ? 'var(--theme-glow-strong)' : 'transparent',
                  color: portalMode === 'corporate' ? 'var(--theme-text-accent)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '40px',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => handlePortalSwitch('corporate')}
              >
                <Briefcase size={14} /> Corporate Desk
              </button>
              <button 
                className={`portal-hud-btn ${portalMode === 'government' ? 'active' : ''}`}
                style={{
                  background: portalMode === 'government' ? 'var(--theme-glow-strong)' : 'transparent',
                  color: portalMode === 'government' ? 'var(--theme-text-accent)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '40px',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => handlePortalSwitch('government')}
              >
                <Landmark size={14} /> Gov Registry
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--theme-text-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {portalMode === 'consumer' && 'Consumer Trust & Marketplace'}
              {portalMode === 'garage' && 'Workshop Telemetry & PartSentry'}
              {portalMode === 'corporate' && 'Asset Risk Underwriting Desk'}
              {portalMode === 'government' && 'CVR Digital Deed Registry'}
            </span>

            {/* Navigation Tabs based on selected Portal Mode */}
            <nav className="nav-tabs">
              {portalMode === 'consumer' && (
                <>
                  <button className={`nav-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
                    <Sparkles size={16} /> Marketplace
                  </button>
                  <button className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    <FileText size={16} /> Registry Pass
                  </button>
                  <button className={`nav-tab-btn ${activeTab === 'ocr' ? 'active' : ''}`} onClick={() => setActiveTab('ocr')}>
                    <CheckSquare size={16} /> Gutu OCR
                  </button>
                  <button className={`nav-tab-btn ${activeTab === 'partsentry' ? 'active' : ''}`} onClick={() => setActiveTab('partsentry')}>
                    <Key size={16} /> PartSentry
                  </button>
                  <button className={`nav-tab-btn ${activeTab === 'safepay' ? 'active' : ''}`} onClick={() => setActiveTab('safepay')}>
                    <Shield size={16} /> SafePay Escrow
                  </button>
                </>
              )}

              {portalMode === 'garage' && (
                <>
                  <button className={`nav-tab-btn ${activeTab === 'workorders' ? 'active' : ''}`} onClick={() => setActiveTab('workorders')}>
                    <Wrench size={16} /> Workshop OS
                  </button>
                  <button className={`nav-tab-btn ${activeTab === 'partsentry' ? 'active' : ''}`} onClick={() => setActiveTab('partsentry')}>
                    <Key size={16} /> Ledger Sync
                  </button>
                </>
              )}

              {portalMode === 'corporate' && (
                <>
                  <button className={`nav-tab-btn ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')}>
                    <Briefcase size={16} /> Underwriting Desk
                  </button>
                </>
              )}

              {portalMode === 'government' && (
                <>
                  <button className={`nav-tab-btn ${activeTab === 'duty' ? 'active' : ''}`} onClick={() => setActiveTab('duty')}>
                    <Landmark size={16} /> Deed Approvals
                  </button>
                </>
              )}

              <button className={`nav-tab-btn ${activeTab === 'gutu' ? 'active' : ''}`} onClick={() => setActiveTab('gutu')}>
                <ShieldAlert size={16} /> Gutu AI
              </button>
            </nav>
          </div>

        </div>
      </header>

      {/* Top Bar Live Notifications (PartSentry Handshakes) */}
      {notifications.length > 0 && (
        <div className="live-notification-bar" style={{ border: '1px solid var(--theme-accent)', boxShadow: '0 0 15px var(--theme-glow)' }}>
          <div className="live-notification-content">
            <ShieldAlert size={24} style={{ color: 'var(--theme-text-accent)', flexShrink: 0 }} />
            <div>
              <strong className="live-notification-title">{notifications[0].title}</strong>
              <p className="live-notification-desc">{notifications[0].message}</p>
            </div>
          </div>
          <div className="live-notification-actions">
            <button className="btn-secondary" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'var(--red-glow)', color: '#fca5a5' }} onClick={() => rejectPartSentrySwap(notifications[0].id)}>
              Flag / Reject
            </button>
            <button className="btn-primary" style={{ background: 'var(--theme-accent)', color: '#000' }} onClick={() => approvePartSentrySwap(notifications[0].id)}>
              Verify & Approve
            </button>
          </div>
        </div>
      )}

      {/* Render Active View Tab */}
      <main style={{ flex: 1 }}>
        {activeTab === 'marketplace' && (
          <Marketplace 
            setActiveTab={setActiveTab} 
            setSelectedVinForSafePay={handleSelectedVinForSafePay} 
          />
        )}
        
        {activeTab === 'history' && (
          <HistoryChecker />
        )}

        {activeTab === 'ocr' && (
          <GutuOCR />
        )}

        {activeTab === 'partsentry' && (
          <PartSentry />
        )}

        {activeTab === 'safepay' && (
          <SafePay selectedVin={selectedVinForSafePay} />
        )}

        {activeTab === 'gutu' && (
          <GutuAI contextMode={portalMode} />
        )}

        {activeTab === 'workorders' && (
          <GaragePortal />
        )}

        {activeTab === 'risk' && (
          <CorporatePortal />
        )}

        {activeTab === 'duty' && (
          <GovernmentPortal />
        )}
      </main>

      {/* Floating WhatsApp Dispatches Telemetry Panel */}
      <div className="whatsapp-telemetry-trigger">
        {showWhatsappPanel && (
          <div 
            className="glass-card glow-emerald" 
            style={{
              width: '320px',
              maxHeight: '400px',
              overflowY: 'auto',
              background: 'rgba(7, 10, 19, 0.95)',
              border: '1px solid var(--theme-accent)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} style={{ color: 'var(--theme-text-accent)' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#fff' }}>WhatsApp Dispatch</span>
              </div>
              <span className="logo-badge" style={{ fontSize: '10px', background: 'var(--theme-glow-strong)', color: 'var(--theme-text-accent)', borderColor: 'var(--theme-accent)' }}>Live Polling</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {whatsappQueue.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted-dark)', textAlign: 'center', padding: '24px 0' }}>
                  No WhatsApp broadcasts queued yet. Trigger a parts swap or settle an escrow to dispatch alerts.
                </div>
              ) : (
                whatsappQueue.map(item => (
                  <div 
                    key={item.id} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: '#fff' }}>{item.recipient}</span>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        background: item.status === 'pending' ? 'var(--gold-glow)' : 'var(--emerald-glow)',
                        color: item.status === 'pending' ? 'var(--gold-light)' : 'var(--emerald-light)',
                        border: `1px solid ${item.status === 'pending' ? 'var(--gold-primary)' : 'var(--emerald-primary)'}`
                      }}>
                        {item.status === 'pending' ? (
                          <>
                            <Loader2 size={10} className="animate-spin" />
                            <span>Queued</span>
                          </>
                        ) : (
                          <>
                            <CheckSquare size={10} />
                            <span>Sent</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                      Template: <strong>{item.template_name}</strong>
                    </div>
                    <div style={{ color: 'var(--text-muted-dark)', fontFamily: 'monospace', fontSize: '9px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '4px', marginTop: '2px', wordBreak: 'break-all' }}>
                      {typeof item.payload === 'object' ? JSON.stringify(item.payload) : item.payload}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <button 
          className="btn-gold glow-gold" 
          style={{
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--theme-accent)',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px var(--theme-glow)'
          }}
          onClick={() => setShowWhatsappPanel(!showWhatsappPanel)}
        >
          <MessageSquare size={20} />
        </button>
      </div>

      {/* Premium Footer */}
      <footer style={{ marginTop: '64px', borderTop: '1px solid var(--border-glass)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
        <div>
          <strong>CarUp Automotive OS</strong> — Zimbabwe's Automotive Operating System & Trust Network.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>ZIMRA Custom Splitting Enabled</span>
          <span>CVR Title Sync Checked</span>
          <span>PartSentry Locked</span>
        </div>
      </footer>

      {/* Sleek Bottom Tab Navigation Bar for Mobile Viewports */}
      <nav className="mobile-bottom-nav">
        {portalMode === 'consumer' && (
          <>
            <button className={`mobile-nav-btn ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
              <div className="mobile-nav-icon-wrapper">
                <Sparkles size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">Market</span>
            </button>
            <button className={`mobile-nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              <div className="mobile-nav-icon-wrapper">
                <FileText size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">Registry</span>
            </button>
            <button className={`mobile-nav-btn ${activeTab === 'ocr' ? 'active' : ''}`} onClick={() => setActiveTab('ocr')}>
              <div className="mobile-nav-icon-wrapper">
                <CheckSquare size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">OCR</span>
            </button>
            <button className={`mobile-nav-btn ${activeTab === 'partsentry' ? 'active' : ''}`} onClick={() => setActiveTab('partsentry')}>
              <div className="mobile-nav-icon-wrapper">
                <Key size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">Sentry</span>
            </button>
            <button className={`mobile-nav-btn ${activeTab === 'safepay' ? 'active' : ''}`} onClick={() => setActiveTab('safepay')}>
              <div className="mobile-nav-icon-wrapper">
                <Shield size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">SafePay</span>
            </button>
          </>
        )}

        {portalMode === 'garage' && (
          <>
            <button className={`mobile-nav-btn ${activeTab === 'workorders' ? 'active' : ''}`} onClick={() => setActiveTab('workorders')}>
              <div className="mobile-nav-icon-wrapper">
                <Wrench size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">Workshop</span>
            </button>
            <button className={`mobile-nav-btn ${activeTab === 'partsentry' ? 'active' : ''}`} onClick={() => setActiveTab('partsentry')}>
              <div className="mobile-nav-icon-wrapper">
                <Key size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">Sentry</span>
            </button>
          </>
        )}

        {portalMode === 'corporate' && (
          <button className={`mobile-nav-btn ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')}>
            <div className="mobile-nav-icon-wrapper">
              <Briefcase size={20} className="mobile-nav-icon" />
            </div>
            <span className="mobile-nav-label">Underwrite</span>
          </button>
        )}

        {portalMode === 'government' && (
          <button className={`mobile-nav-btn ${activeTab === 'duty' ? 'active' : ''}`} onClick={() => setActiveTab('duty')}>
            <div className="mobile-nav-icon-wrapper">
              <Landmark size={20} className="mobile-nav-icon" />
            </div>
            <span className="mobile-nav-label">Deeds</span>
          </button>
        )}

        <button className={`mobile-nav-btn ${activeTab === 'gutu' ? 'active' : ''}`} onClick={() => setActiveTab('gutu')}>
          <div className="mobile-nav-icon-wrapper">
            <ShieldAlert size={20} className="mobile-nav-icon" />
          </div>
          <span className="mobile-nav-label">Gutu AI</span>
        </button>
      </nav>

    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
