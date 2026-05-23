import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Search, ShieldAlert, Calendar, Check, AlertOctagon, TrendingUp, HelpCircle, FileText, Shield, ShieldCheck, AlertTriangle } from 'lucide-react'

export default function HistoryChecker() {
  const { vehicles } = useApp()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [animatedTrust, setAnimatedTrust] = useState(0)

  useEffect(() => {
    if (report) {
      setAnimatedTrust(0)
      const timer = setTimeout(() => {
        setAnimatedTrust(report.trustIndex)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setAnimatedTrust(0)
    }
  }, [report])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query) return

    setLoading(true)
    setErrorMsg('')
    setReport(null)

    setTimeout(() => {
      // Find by VIN or Plate
      const found = vehicles.find(
        v => v.vin.toLowerCase() === query.toLowerCase() || 
             v.licensePlate.toLowerCase() === query.toLowerCase()
      )

      if (found) {
        setReport(found)
      } else {
        setErrorMsg('No vehicle found with this Plate Number or VIN. Please verify and try again.')
      }
      setLoading(false)
    }, 1500)
  }

  // Draw custom high-fidelity odometer line representation
  const renderOdometerChart = (logs) => {
    const mileageLogs = [...logs]
      .filter(l => l.desc.toLowerCase().includes('odometer') || l.desc.toLowerCase().includes('km'))
      .sort((a,b) => new Date(a.date) - new Date(b.date))

    if (mileageLogs.length === 0) return null

    // Check if there is an odometer rollback (mileage decreases)
    let rollbackDetected = false
    let rollbackIndex = -1
    for (let i = 1; i < mileageLogs.length; i++) {
      const prevKm = parseInt(mileageLogs[i-1].desc.replace(/[^0-9]/g, ''))
      const currKm = parseInt(mileageLogs[i].desc.replace(/[^0-9]/g, ''))
      if (currKm < prevKm) {
        rollbackDetected = true
        rollbackIndex = i
        break
      }
    }

    return (
      <div className="glass-card" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-white)' }}>
          <TrendingUp size={16} style={{ color: rollbackDetected ? 'var(--red-primary)' : 'var(--emerald-primary)' }} />
          Odometer Progression Sync
        </h4>
        
        {rollbackDetected && (
          <div style={{
            background: 'var(--red-glow)',
            border: '1px solid var(--red-primary)',
            color: '#fca5a5',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertOctagon size={16} />
            <strong>ROLLBACK DETECTED:</strong> Odometer readings showed irregular downward progression.
          </div>
        )}

        {/* Visual Line Graph Representation */}
        <div style={{ padding: '20px 10px 10px 10px', position: 'relative' }}>
          <div style={{ height: '4px', background: 'var(--border-glass)', position: 'absolute', left: 0, right: 0, top: '50%' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {mileageLogs.map((log, idx) => {
              const kmVal = log.desc.replace(/[^0-9]/g, '')
              const isRollbackPoint = rollbackDetected && idx === rollbackIndex
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isRollbackPoint ? 'var(--red-primary)' : 'var(--emerald-primary)',
                    boxShadow: `0 0 10px ${isRollbackPoint ? 'var(--red-primary)' : 'var(--emerald-primary)'}`,
                    border: '3px solid var(--bg-solid-card)'
                  }}></div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{log.date}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isRollbackPoint ? 'var(--red-primary)' : 'var(--text-white)' }}>{parseInt(kmVal).toLocaleString()} km</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Search Console Card */}
      <div className="glass-card glow-emerald" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(17,24,43,0.8) 0%, rgba(7,10,19,0.9) 100%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Global Vehicle History Registry</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
          Enter a license plate or 17-character VIN code to query ZIMRA customs databases, ownership history, and anti-theft ledgers.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ flex: '1', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="e.g. AGE-4521 or AFH-8921..." 
              className="form-input" 
              style={{ width: '100%', paddingLeft: '44px', textTransform: 'uppercase' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0 24px' }} disabled={loading}>
            {loading ? 'Searching...' : 'Scan Vehicle'}
          </button>
        </form>
        
        {errorMsg && (
          <p style={{ color: 'var(--red-primary)', fontSize: '14px', marginTop: '16px', fontWeight: 600 }}>{errorMsg}</p>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="glass-card animate-scan" style={{ padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border-glass)',
            borderTopColor: 'var(--emerald-primary)',
            borderRadius: '50%',
            animation: 'spin 1s infinite linear'
          }}></div>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <h3 style={{ fontSize: '18px' }}>Accessing Central Vehicle Registry (CVR) and ZIMRA duty logs...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Validating cryptographic PartSentry checksums</p>
        </div>
      )}

      {/* Report Summary */}
      {report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="logo-badge" style={{ fontSize: '10px' }}>Registry Audit Certified</span>
              <h2 style={{ fontSize: '24px', marginTop: '8px' }}>{report.year} {report.make} {report.model}</h2>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '13px', marginTop: '4px' }}>Plate: {report.licensePlate} | VIN: {report.vin}</p>
            </div>
            {/* SVG Telemetry Dial Gauge for History Report */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '220px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
              <div className="telemetry-grid" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, pointerEvents: 'none' }}></div>
              <svg width="180" height="110" viewBox="0 0 200 120" style={{ zIndex: 1, overflow: 'visible' }}>
                <defs>
                  <linearGradient id="gauge-gradient-history" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--red-primary)" />
                    <stop offset="50%" stopColor="var(--gold-primary)" />
                    <stop offset="100%" stopColor="var(--emerald-primary)" />
                  </linearGradient>
                  <filter id="needle-glow-history" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Arc outlines */}
                <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge-gradient-history)" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge-gradient-history)" strokeWidth="20" strokeLinecap="round" opacity="0.15" filter="url(#needle-glow-history)" />
                <path d="M 32 100 A 68 68 0 0 1 168 100" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" strokeDasharray="4 4" />
                
                {/* Dynamically Sweeping Needle */}
                <g style={{
                  transform: `rotate(${ (animatedTrust / 100) * 180 - 90 }deg)`,
                  transformOrigin: 'bottom center',
                  transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                  <line x1="100" y1="100" x2="100" y2="22" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }} />
                  <polygon points="97,100 100,18 103,100" fill="var(--emerald-light)" opacity="0.3" />
                </g>
                
                {/* Dial cap */}
                <circle cx="100" cy="100" r="10" fill="#070a13" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="2" />
                <circle cx="100" cy="100" r="4" fill="var(--emerald-light)" />
              </svg>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-15px', zIndex: 1 }}>
                <span style={{ fontSize: '26px', fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 40%, var(--emerald-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 6px rgba(16, 185, 129, 0.3))' }}>
                  {report.trustIndex}%
                </span>
                <span style={{ 
                  fontSize: '9px', 
                  fontWeight: 800, 
                  color: report.trustIndex >= 85 ? 'var(--emerald-light)' : report.trustIndex >= 60 ? 'var(--gold-light)' : '#fca5a5', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {report.trustIndex >= 85 ? (
                    <>
                      <ShieldCheck size={10} className="pulse-icon animate-pulse" style={{ animation: 'pulse-dot 1.5s infinite ease-in-out' }} />
                      <span>highly verified</span>
                    </>
                  ) : report.trustIndex >= 60 ? (
                    <>
                      <AlertTriangle size={10} className="pulse-icon animate-pulse" style={{ animation: 'pulse-dot 1.5s infinite ease-in-out' }} />
                      <span>moderate safety</span>
                    </>
                  ) : (
                    <>
                      <AlertOctagon size={10} style={{ color: 'var(--red-primary)', display: 'inline' }} />
                      risk advisory
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Odometer Progression section */}
          {renderOdometerChart(report.historyLogs)}

          {/* Warnings & Security Audits */}
          <div className="grid-2">
            
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-white)' }}>
                <ShieldAlert size={18} style={{ color: 'var(--gold-primary)' }} />
                Critical Verification Alert Log
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {report.documents.zimra !== 'verified' && (
                  <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
                    <AlertOctagon size={16} style={{ color: 'var(--red-primary)', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '13px', color: 'var(--text-white)' }}>ZIMRA Customs Ingress Missing</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Official ZIMRA Form 21 has not been verified. High risk of unpaid custom duties or gray import.</p>
                    </div>
                  </div>
                )}
                
                {report.documents.cid !== 'verified' && (
                  <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
                    <ShieldAlert size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '13px', color: 'var(--text-white)' }}>CID Clearance Pending</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Vehicle has not undergone physical CID clearance checks. Risk of salvage rebuild or cloning.</p>
                    </div>
                  </div>
                )}

                {report.documents.zimra === 'verified' && report.documents.cid === 'verified' && (
                  <div style={{ background: 'var(--emerald-glow)', border: '1px solid var(--emerald-primary)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Check size={16} style={{ color: 'var(--emerald-light)', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'var(--emerald-light)' }}>Zero critical legal security blocks detected in government registers.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} />
                Technical Registry Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Engine Number</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{report.engineNo}</span>
                </div>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Transmission</span>
                  <span style={{ fontWeight: 600 }}>{report.transmission}</span>
                </div>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>ECU Serial Checksum</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{report.ecuSerial}</span>
                </div>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Fuel / Eco Class</span>
                  <span style={{ fontWeight: 600 }}>{report.fuel}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Chronological Event History */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Comprehensive Event Lifecycle</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {report.historyLogs.map((log, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: log.verified ? 'var(--emerald-glow)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${log.verified ? 'var(--emerald-primary)' : 'var(--border-glass)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Calendar size={16} style={{ color: log.verified ? 'var(--emerald-light)' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{log.source}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.date}</span>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '4px' }}>{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
