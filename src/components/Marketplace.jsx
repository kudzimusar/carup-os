import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Shield, MapPin, Gauge, Fuel, CheckCircle, AlertTriangle, X, DollarSign, ExternalLink, ShieldAlert, ShieldCheck, MessageSquare, ShoppingCart, Trash2 } from 'lucide-react'
import { ReservationLedger } from './ui/ReservationLedger'

export default function Marketplace() {
  const navigate = useNavigate()
  const { vehicles, cartItems, globalLocks, addToCart, removeFromCart, clearCart } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [minTrust, setMinTrust] = useState(0)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [animatedTrust, setAnimatedTrust] = useState(0)
  const [comparedVins, setComparedVins] = useState([])
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)



  const handleToggleCompare = (vin) => {
    setComparedVins(prev => {
      if (prev.includes(vin)) {
        return prev.filter(v => v !== vin)
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 vehicles side by side.')
          return prev
        }
        return [...prev, vin]
      }
    })
  }

  useEffect(() => {
    if (selectedVehicle) {
      setAnimatedTrust(0)
      const timer = setTimeout(() => {
        setAnimatedTrust(selectedVehicle.trustIndex)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setAnimatedTrust(0)
    }
  }, [selectedVehicle])

  // Filtering logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.vin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTrust = v.trustIndex >= minTrust
    return matchesSearch && matchesTrust
  })

  const getTrustBadgeClass = (score) => {
    if (score >= 80) return 'trust-high'
    if (score >= 50) return 'trust-mid'
    return 'trust-low'
  }

  // Beautiful responsive custom vehicle SVG card image helper
  const renderVehicleImage = (color, make) => {
    return (
      <div style={{
        background: `linear-gradient(135deg, rgba(22, 31, 48, 0.9), rgba(11, 15, 25, 0.95))`,
        height: '160px',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.03)'
      }}>
        {/* Glow effect matching make color */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '60px',
          background: color.toLowerCase().includes('black') ? 'rgba(59,130,246,0.1)' : color.toLowerCase().includes('grey') ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
          filter: 'blur(30px)',
          borderRadius: '50%'
        }}></div>
        
        {/* Sleek SVG Car Outline */}
        <svg width="220" height="90" viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 55 C 30 52, 45 40, 60 38 C 75 36, 110 36, 125 36 C 140 36, 155 35, 170 42 C 185 46, 200 52, 205 58 C 210 62, 212 66, 208 72 C 200 75, 20 75, 12 72 C 8 68, 10 58, 20 55 Z" 
                fill="none" 
                stroke={color.toLowerCase().includes('black') ? '#475569' : color.toLowerCase().includes('grey') ? '#94a3b8' : '#cbd5e1'} 
                strokeWidth="2.5" 
                strokeLinecap="round" />
          <path d="M68 38 L 85 24 C 90 20, 140 20, 145 24 L 165 40" 
                stroke="#10b981" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeDasharray="4 2" />
          {/* Wheels */}
          <circle cx="50" cy="70" r="14" fill="#070a13" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="50" cy="70" r="6" fill="#10b981" />
          <circle cx="165" cy="70" r="14" fill="#070a13" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="165" cy="70" r="6" fill="#10b981" />
          {/* Lights */}
          <path d="M202 58 L 208 61" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 62 L 10 64" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>{color}</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Header Banners */}
      <div className="glass-card glow-emerald" style={{
        padding: '48px 32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(17, 24, 43, 0.8) 0%, rgba(7, 10, 19, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div className="logo-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Trust-First Portal</div>
        <h1 style={{ fontSize: '38px', lineHeight: '1.2' }}>Zimbabwe's Automotive Operating System</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '16px', lineHeight: '1.5' }}>
          Explore premium vehicles backed by the <strong style={{ color: 'var(--emerald-primary)' }}>CarUp Passport</strong>. 
          Every listing is backed by verified customs clearance, CVR registrations, and blockchain-integrated parts telemetry.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <input 
            type="text" 
            placeholder="Search by VIN, Plate, Make or Model (e.g. Hilux, Honda Fit)..." 
            className="form-input" 
            style={{ width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="form-label" style={{ margin: 0 }}>Min Trust Index:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 50, 80].map(val => (
              <button 
                key={val} 
                className={`btn-secondary ${minTrust === val ? 'glow-emerald' : ''}`}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  borderColor: minTrust === val ? 'var(--emerald-primary)' : 'var(--border-glass)',
                  background: minTrust === val ? 'var(--emerald-glow)' : 'transparent',
                  color: minTrust === val ? 'var(--emerald-light)' : 'var(--text-muted)'
                }}
                onClick={() => setMinTrust(val)}
              >
                {val === 0 ? 'All' : val === 50 ? '50%+' : '80%+ Secure'}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }}></div>

          <button 
            className={`btn-gold ${cartItems.length > 0 ? 'glow-gold' : ''}`}
            style={{
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              position: 'relative',
              background: cartItems.length > 0 ? 'var(--gold-primary)' : 'transparent',
              color: cartItems.length > 0 ? '#000' : 'var(--gold-light)',
              borderColor: 'var(--gold-primary)'
            }}
            onClick={() => setShowCartModal(true)}
          >
            <ShoppingCart size={16} />
            Reserve Cart
            {cartItems.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
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
      </div>

      {/* Vehicle Grid */}
      <div className="grid-3">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.vin} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer' }} onClick={() => setSelectedVehicle(vehicle)}>
            {renderVehicleImage(vehicle.color, vehicle.make)}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{vehicle.year} {vehicle.make}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{vehicle.model}</p>
              </div>
              <span className={`trust-score-badge ${getTrustBadgeClass(vehicle.trustIndex)}`}>
                <Shield size={14} />
                {vehicle.trustIndex}% Trust
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Gauge size={14} />
                <span>{vehicle.mileage.toLocaleString()} km</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Fuel size={14} />
                <span>{vehicle.fuel}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <MapPin size={14} />
                <span>{vehicle.sellerType}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <span style={{ fontWeight: 800, fontSize: '10px', color: 'var(--emerald-primary)' }}>PLATE</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{vehicle.licensePlate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>USD PRICE</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-white)' }}>${vehicle.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button 
                  className={`btn-secondary ${comparedVins.includes(vehicle.vin) ? 'glow-emerald' : ''}`}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderColor: comparedVins.includes(vehicle.vin) ? 'var(--emerald-primary)' : 'var(--border-glass)',
                    background: comparedVins.includes(vehicle.vin) ? 'var(--emerald-glow)' : 'transparent',
                    color: comparedVins.includes(vehicle.vin) ? 'var(--emerald-light)' : 'var(--text-muted)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleCompare(vehicle.vin)
                  }}
                >
                  {comparedVins.includes(vehicle.vin) ? 'Compared' : 'Compare'}
                </button>
                <button 
                  className={`btn-secondary ${cartItems.includes(vehicle.vin) ? 'glow-gold' : ''}`}
                  disabled={globalLocks.some(l => l.vin === vehicle.vin)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderColor: cartItems.includes(vehicle.vin) ? 'var(--gold-primary)' : 'var(--border-glass)',
                    background: cartItems.includes(vehicle.vin) ? 'var(--gold-glow)' : 'transparent',
                    color: cartItems.includes(vehicle.vin) ? 'var(--gold-light)' : (globalLocks.some(l => l.vin === vehicle.vin) ? '#ef4444' : 'var(--text-muted)'),
                    opacity: globalLocks.some(l => l.vin === vehicle.vin) ? 0.5 : 1,
                    cursor: globalLocks.some(l => l.vin === vehicle.vin) ? 'not-allowed' : 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (globalLocks.some(l => l.vin === vehicle.vin)) return;
                    if (cartItems.includes(vehicle.vin)) {
                      removeFromCart(vehicle.vin)
                    } else {
                      addToCart(vehicle.vin)
                    }
                  }}
                >
                  {globalLocks.some(l => l.vin === vehicle.vin) ? <ShieldAlert size={14} /> : <ShoppingCart size={14} />}
                  {globalLocks.some(l => l.vin === vehicle.vin) ? 'Locked' : (cartItems.includes(vehicle.vin) ? 'Reserved' : 'Reserve')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Passport Detailed Modal overlay */}
      {selectedVehicle && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content glass-card animate-scan passport-modal-content" style={{
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-solid-card)',
            padding: '32px',
            position: 'relative'
          }}>
            <button className="modal-close-btn" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-white)'
            }} onClick={() => setSelectedVehicle(null)}>
              <X size={18} />
            </button>

            {/* Passport Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield size={20} className="glow-emerald" style={{ color: 'var(--emerald-primary)' }} />
                  <span className="logo-badge" style={{ fontSize: '12px' }}>CarUp Digital Passport</span>
                </div>
                <h2 style={{ fontSize: '28px' }}>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'monospace', marginTop: '4px' }}>VIN: {selectedVehicle.vin}</p>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Passport Trust Score:</span>
                  <span className={`trust-score-badge ${getTrustBadgeClass(selectedVehicle.trustIndex)}`} style={{ fontSize: '16px', padding: '6px 12px' }}>
                    {selectedVehicle.trustIndex}%
                  </span>
                </div>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-white)' }}>${selectedVehicle.price.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Content Splits */}
            <div className="grid-2" style={{ gap: '32px' }}>
              
              {/* Document Registry Audit */}
              <div>
                {/* SVG Telemetry Dial Gauge */}
                <div className="glass-card active-neon-sweep" style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '24px',
                  borderRadius: '16px',
                  marginBottom: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div className="telemetry-grid" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, pointerEvents: 'none' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', zIndex: 1 }}>
                    <span className="circuit-dot"></span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Telemetry Trust Core
                    </span>
                  </div>
                  
                  <svg width="220" height="130" viewBox="0 0 200 120" style={{ zIndex: 1, overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="gauge-gradient-marketplace" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--red-primary)" />
                        <stop offset="50%" stopColor="var(--gold-primary)" />
                        <stop offset="100%" stopColor="var(--emerald-primary)" />
                      </linearGradient>
                      <filter id="needle-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    {/* Background tick details */}
                    <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" strokeDasharray="3 3" />
                    
                    {/* Colored Trust Arc */}
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge-gradient-marketplace)" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
                    
                    {/* Outer glow aura for the arc */}
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge-gradient-marketplace)" strokeWidth="20" strokeLinecap="round" opacity="0.15" filter="url(#needle-glow)" />
                    
                    {/* Inner dash grid track */}
                    <path d="M 32 100 A 68 68 0 0 1 168 100" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" strokeDasharray="4 4" />
                    
                    {/* Needle wrapped in a g element centered at bottom center */}
                    <g style={{
                      transform: `rotate(${ (animatedTrust / 100) * 180 - 90 }deg)`,
                      transformOrigin: 'bottom center',
                      transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                      {/* Speedometer Needle */}
                      <line x1="100" y1="100" x2="100" y2="22" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }} />
                      <polygon points="97,100 100,18 103,100" fill="var(--emerald-light)" opacity="0.3" />
                    </g>
                    
                    {/* Pivot point */}
                    <circle cx="100" cy="100" r="10" fill="#070a13" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="2" />
                    <circle cx="100" cy="100" r="4" fill="var(--emerald-light)" />
                    
                    {/* Tick endpoints */}
                    <line x1="20" y1="100" x2="10" y2="100" stroke="var(--text-muted)" strokeWidth="1.5" />
                    <line x1="180" y1="100" x2="190" y2="100" stroke="var(--text-muted)" strokeWidth="1.5" />
                    <line x1="100" y1="20" x2="100" y2="10" stroke="var(--text-muted)" strokeWidth="1.5" />
                  </svg>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-15px', zIndex: 1 }}>
                    <span style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #ffffff 40%, var(--emerald-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3))' }}>
                      {selectedVehicle.trustIndex}%
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      color: selectedVehicle.trustIndex >= 80 ? 'var(--emerald-light)' : selectedVehicle.trustIndex >= 50 ? 'var(--gold-light)' : '#fca5a5', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      marginTop: '2px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {selectedVehicle.trustIndex >= 80 ? (
                        <>
                          <ShieldCheck size={12} className="pulse-icon animate-pulse" style={{ animation: 'pulse-dot 1.5s infinite ease-in-out' }} />
                          <span>highly verified</span>
                        </>
                      ) : selectedVehicle.trustIndex >= 50 ? (
                        <>
                          <AlertTriangle size={12} className="pulse-icon animate-pulse" style={{ animation: 'pulse-dot 1.5s infinite ease-in-out' }} />
                          <span>moderate safety</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert size={12} className="pulse-icon animate-pulse" style={{ animation: 'pulse-dot 1.5s infinite ease-in-out' }} />
                          <span>risk advisory</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} style={{ color: 'var(--emerald-primary)' }} />
                  Zimbabwean Document Registry
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.keys(selectedVehicle.documents).map(doc => {
                    const status = selectedVehicle.documents[doc]
                    return (
                      <div key={doc} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-glass)'
                      }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 700 }}>
                          {doc === "zimra" ? "ZIMRA Form 21 (Customs)" :
                           doc === "bluebook" ? "CVR Blue Book (Title)" :
                           doc === "cid" ? "CID Clearance (Stolen Check)" :
                           doc === "vid" ? "VID Inspection Cert" :
                           doc === "zinara" ? "ZINARA Toll/Road Tax" :
                           doc === "insurance" ? "Active Insurance Note" : "Garage Invoices"}
                        </span>
                        
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          background: status === 'verified' ? 'var(--emerald-glow)' : status === 'uploaded' ? 'var(--gold-glow)' : 'var(--red-glow)',
                          color: status === 'verified' ? 'var(--emerald-light)' : status === 'uploaded' ? 'var(--gold-light)' : '#fca5a5',
                          border: `1px solid ${status === 'verified' ? 'var(--emerald-primary)' : status === 'uploaded' ? 'var(--gold-primary)' : 'var(--red-primary)'}`
                        }}>
                          {status}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Asset Technical Specs & Detailed Mechanical Specs */}
                <div className="glass-card" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)' }}>
                  <h3 style={{ fontSize: '16px', color: 'var(--emerald-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} /> Asset Technical Blueprint
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Engine Block SN</span>
                      <p style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--text-white)' }}>{selectedVehicle.engineNo || '1GD-7892341'}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>ECU Chip Serial</span>
                      <p style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--text-white)' }}>{selectedVehicle.ecuSerial || 'DENSO-8921-X99'}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Gearbox Ledger SN</span>
                      <p style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--text-white)' }}>{selectedVehicle.gearboxSerial || 'GB-52A-9901'}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Transmission System</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--text-white)' }}>{selectedVehicle.transmission || 'Automatic'}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Primary Fuel Class</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--text-white)' }}>{selectedVehicle.fuel || 'Diesel'}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Odometer Distance</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--emerald-light)' }}>{(selectedVehicle.mileage || 0).toLocaleString()} km</p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    <span className="text-muted" style={{ fontSize: '11px' }}>Asset Description & Registry Audit</span>
                    <p style={{ fontSize: '13px', lineHeight: '1.4', marginTop: '4px', color: 'var(--text-light)' }}>
                      High-end {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year}) in pristine {selectedVehicle.color} finish. 
                      Equipped with physical anti-theft tracking, central CVR deed registrations, and active roadworthiness certificates. 
                      Fully cleared via Beitbridge customs matching all component hash signatures. Verified split customs duty active.
                    </p>
                  </div>
                </div>
                
                {/* SafePay & Cart Buttons */}
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    className="btn-gold glow-gold" 
                    style={{ width: '100%', padding: '14px', gap: '8px' }}
                    onClick={() => {
                      setSelectedVehicle(null)
                      navigate('/safepay', { state: { selectedVins: [selectedVehicle.vin] } })
                    }}
                  >
                    <DollarSign size={18} />
                    Secure Purchase via SafePay Escrow
                  </button>
                  <button 
                    className="btn-secondary" 
                    disabled={globalLocks.some(l => l.vin === selectedVehicle.vin)}
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      gap: '8px',
                      borderColor: cartItems.includes(selectedVehicle.vin) ? 'var(--gold-primary)' : 'var(--border-glass)',
                      color: cartItems.includes(selectedVehicle.vin) ? 'var(--gold-light)' : (globalLocks.some(l => l.vin === selectedVehicle.vin) ? '#ef4444' : 'var(--text-muted)'),
                      opacity: globalLocks.some(l => l.vin === selectedVehicle.vin) ? 0.5 : 1,
                      cursor: globalLocks.some(l => l.vin === selectedVehicle.vin) ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => {
                      if (globalLocks.some(l => l.vin === selectedVehicle.vin)) return;
                      if (cartItems.includes(selectedVehicle.vin)) {
                        removeFromCart(selectedVehicle.vin)
                      } else {
                        addToCart(selectedVehicle.vin)
                      }
                    }}
                  >
                    {globalLocks.some(l => l.vin === selectedVehicle.vin) ? <ShieldAlert size={18} /> : <ShoppingCart size={18} />}
                    {globalLocks.some(l => l.vin === selectedVehicle.vin) ? 'Globally Locked by Another Buyer' : (cartItems.includes(selectedVehicle.vin) ? 'Remove from Cart / Reserve Ledger' : 'Add to Cart / Reserve Ledger')}
                  </button>
                  <a 
                    href={`https://wa.me/263771234567?text=Mhoroi!%20I%20am%20interested%20in%20your%20verified%20${selectedVehicle.year}%20${selectedVehicle.make}%20${selectedVehicle.model}%20listed%20on%20CarUp%20Automotive%20OS.%20Trust%20Score:%20${selectedVehicle.trustIndex}%.%20VIN:%20${selectedVehicle.vin}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary whatsapp-btn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#25D366',
                      borderColor: '#25D366',
                      background: 'rgba(37, 211, 102, 0.05)',
                      fontWeight: 700,
                      textDecoration: 'none',
                      marginTop: '12px',
                      minHeight: '48px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <MessageSquare size={16} className="whatsapp-icon" style={{ transition: 'transform 0.3s ease' }} />
                    <span>Chat with Seller via WhatsApp</span>
                  </a>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
                    EcoCash, InnBucks, Zipit, and Diaspora remittance routes fully supported.
                  </p>
                </div>
              </div>

              {/* PartSentry ledger & History timeline */}
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} style={{ color: 'var(--emerald-primary)' }} />
                  PartSentry Cryptographic Ledger
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {selectedVehicle.parts.map(part => (
                    <div key={part.id} style={{
                      padding: '12px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${part.status === 'verified' ? 'var(--emerald-primary)' : 'var(--gold-primary)'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{part.name}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                          Hash: {part.hash}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span>S/N: {part.serial}</span>
                        <span>{part.workshop}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* History Timeline */}
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Verified Registry Milestones</h3>
                <div style={{ position: 'relative', paddingLeft: '18px', borderLeft: '2px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedVehicle.historyLogs.map((log, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-24px',
                        top: '4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: log.verified ? 'var(--emerald-primary)' : 'var(--red-primary)',
                        border: '2px solid var(--bg-solid-card)'
                      }}></div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.date} — {log.source}</span>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-white)', marginTop: '2px' }}>{log.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Floating Comparison Tray Bar */}
      {comparedVins.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(7, 10, 19, 0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--emerald-primary)',
          boxShadow: '0 0 30px var(--theme-glow), 0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          padding: '16px 24px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          zIndex: 999,
          justifyContent: 'space-between',
          maxWidth: '520px',
          width: '90%'
        }}>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--emerald-light)', display: 'block' }}>Asset Comparison Active</strong>
            <span className="text-muted" style={{ fontSize: '12px' }}>{comparedVins.length} of 3 vehicles loaded for comparison.</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-secondary" 
              style={{ padding: '8px 12px', fontSize: '12px', minHeight: '40px' }}
              onClick={() => setComparedVins([])}
            >
              Clear
            </button>
            <button 
              className="btn-primary glow-emerald" 
              style={{ padding: '8px 16px', fontSize: '12px', background: 'var(--emerald-primary)', color: '#000', minHeight: '40px', fontWeight: 'bold' }}
              onClick={() => setShowComparisonModal(true)}
              disabled={comparedVins.length < 2}
            >
              Compare ({comparedVins.length})
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal Overlay */}
      {showComparisonModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content glass-card animate-scan" style={{
            maxWidth: '1000px',
            width: '95%',
            maxHeight: '92vh',
            overflowY: 'auto',
            background: 'var(--bg-solid-card)',
            padding: '32px',
            position: 'relative',
            border: '1px solid var(--emerald-primary)',
            boxShadow: '0 0 30px var(--theme-glow)'
          }}>
            <button className="modal-close-btn" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-white)'
            }} onClick={() => setShowComparisonModal(false)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--emerald-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={24} /> Asset Spec Comparison Matrix
            </h2>

            <div style={{ overflowX: 'auto', width: '100%', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-glass)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Specifications</th>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <th key={vin} style={{ padding: '14px', width: `${80 / comparedVins.length}%`, borderLeft: '1px solid var(--border-glass)' }}>
                          <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-white)' }}>{veh.year} {veh.make}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>{veh.model}</div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.005)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>USD Value</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', fontWeight: '800', fontSize: '16px', color: 'var(--emerald-light)', borderLeft: '1px solid var(--border-glass)' }}>
                          ${veh.price.toLocaleString()}
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Trust scoring</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', borderLeft: '1px solid var(--border-glass)' }}>
                          <span className={`trust-score-badge ${getTrustBadgeClass(veh.trustIndex)}`}>
                            {veh.trustIndex}% Trust
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.005)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Odometer / Mileage</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', fontWeight: 'bold', borderLeft: '1px solid var(--border-glass)' }}>
                          {veh.mileage.toLocaleString()} km
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Engine Serial</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', fontFamily: 'monospace', borderLeft: '1px solid var(--border-glass)', color: 'var(--text-white)' }}>
                          {veh.engineNo}
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.005)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>ECU Serial Key</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', fontFamily: 'monospace', borderLeft: '1px solid var(--border-glass)', color: 'var(--text-white)' }}>
                          {veh.ecuSerial}
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Gearbox Serial</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', fontFamily: 'monospace', borderLeft: '1px solid var(--border-glass)', color: 'var(--text-white)' }}>
                          {veh.gearboxSerial}
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.005)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Fuel / Transmission</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', borderLeft: '1px solid var(--border-glass)' }}>
                          {veh.fuel} | {veh.transmission}
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>ZIMRA customs status</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', borderLeft: '1px solid var(--border-glass)' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: veh.documents.zimra === 'verified' ? 'var(--emerald-glow)' : 'var(--red-glow)',
                            color: veh.documents.zimra === 'verified' ? 'var(--emerald-light)' : '#fca5a5',
                            border: `1px solid ${veh.documents.zimra === 'verified' ? 'var(--emerald-primary)' : 'var(--red-primary)'}`
                          }}>
                            {veh.documents.zimra.toUpperCase()}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.005)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>CVR Deed blue book</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', borderLeft: '1px solid var(--border-glass)' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: veh.documents.bluebook === 'verified' ? 'var(--emerald-glow)' : 'var(--red-glow)',
                            color: veh.documents.bluebook === 'verified' ? 'var(--emerald-light)' : '#fca5a5',
                            border: `1px solid ${veh.documents.bluebook === 'verified' ? 'var(--emerald-primary)' : 'var(--red-primary)'}`
                          }}>
                            {veh.documents.bluebook.toUpperCase()}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Police stolen flag</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', borderLeft: '1px solid var(--border-glass)' }}>
                          {veh.stolen ? (
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red-primary)', background: 'var(--red-glow)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--red-primary)' }}>
                              STOLEN
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--emerald-light)', background: 'var(--emerald-glow)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--emerald-primary)' }}>
                              SECURE
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  <tr style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Checkout action</td>
                    {comparedVins.map(vin => {
                      const veh = vehicles.find(v => v.vin === vin)
                      return (
                        <td key={vin} style={{ padding: '14px', borderLeft: '1px solid var(--border-glass)' }}>
                          <button 
                            className="btn-gold glow-gold" 
                            style={{ padding: '10px 14px', fontSize: '12px', width: '100%', minHeight: '40px', fontWeight: 'bold' }}
                            onClick={() => {
                              setSelectedVinForSafePay(veh.vin)
                              setShowComparisonModal(false)
                              setActiveTab('safepay')
                            }}
                          >
                            Buy via SafePay
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cart / Reservation Ledger Modal Overlay */}
      <ReservationLedger 
        isOpen={showCartModal} 
        onClose={() => setShowCartModal(false)} 
        onCheckout={() => {
          setSelectedVinsForSafePay(cartItems);
          setShowCartModal(false);
          setActiveTab('safepay');
        }}
      />

    </div>
  )
}
