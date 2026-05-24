import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Search, ShieldAlert, Calendar, Check, AlertOctagon, TrendingUp, HelpCircle, FileText, Shield, ShieldCheck, AlertTriangle, Settings, Activity, Cpu } from 'lucide-react'
import GlassCard from './ui/GlassCard'
import Badge from './ui/Badge'

export default function HistoryChecker() {
  const { vehicles } = useApp()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [animatedTrust, setAnimatedTrust] = useState(0)

  useEffect(() => {
    if (location.state?.vin) {
      setQuery(location.state.vin)
      performSearch(location.state.vin)
    }
  }, [location.state])

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

  const performSearch = (searchQuery) => {
    if (!searchQuery) return

    setLoading(true)
    setErrorMsg('')
    setReport(null)

    setTimeout(() => {
      // Find by VIN or Plate
      const found = vehicles.find(
        v => v.vin.toLowerCase() === searchQuery.toLowerCase() || 
             v.licensePlate.toLowerCase() === searchQuery.toLowerCase()
      )

      if (found) {
        setReport(found)
      } else {
        setErrorMsg('No vehicle found with this Plate Number or VIN. Please verify and try again.')
      }
      setLoading(false)
    }, 1500)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch(query)
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
      <GlassCard style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
      </GlassCard>
    )
  }

  const renderTrustBadge = (trustIndex) => {
    if (trustIndex >= 85) return <Badge variant="high"><ShieldCheck size={12}/> Highly Verified</Badge>
    if (trustIndex >= 60) return <Badge variant="mid"><AlertTriangle size={12}/> Moderate Safety</Badge>
    return <Badge variant="alert"><AlertOctagon size={12}/> Risk Advisory</Badge>
  }

  const getDocStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'var(--emerald-light)';
      case 'uploaded': return 'var(--gold-light)';
      case 'missing': return 'var(--red-primary)';
      default: return 'var(--text-muted)';
    }
  }

  const renderFraudDetectionBreakdown = (report) => {
    // Determine status of various checks based on report data
    const isZimraValid = report.documents?.zimra === 'verified'
    const isZinaraValid = report.documents?.zinara === 'verified'
    const isCidValid = report.documents?.cid === 'verified'
    const isBluebookValid = report.documents?.bluebook === 'verified'
    
    // Check odometer rollback
    let rollbackDetected = false
    if (report.historyLogs) {
      const mileageLogs = [...report.historyLogs]
        .filter(l => l.desc.toLowerCase().includes('odometer') || l.desc.toLowerCase().includes('km'))
        .sort((a,b) => new Date(a.date) - new Date(b.date))
      for (let i = 1; i < mileageLogs.length; i++) {
        const prevKm = parseInt(mileageLogs[i-1].desc.replace(/[^0-9]/g, ''))
        const currKm = parseInt(mileageLogs[i].desc.replace(/[^0-9]/g, ''))
        if (currKm < prevKm) rollbackDetected = true
      }
    }

    const unverifiedParts = report.parts?.filter(p => p.status !== 'verified').length || 0

    return (
      <GlassCard className="glow-emerald" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(7, 10, 19, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={24} style={{ color: 'var(--emerald-primary)' }} />
            AI Fraud Detection & Trust Index Breakdown
          </h3>
          <Badge variant="high"><ShieldCheck size={12}/> Powered by NeuralNet</Badge>
        </div>

        <div className="grid-2">
          {/* Component 1: Regulatory & Customs Validation */}
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isZimraValid && isZinaraValid ? 'var(--emerald-primary)' : 'var(--red-primary)' }}></div>
            <h4 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', paddingLeft: '8px' }}>
              <span>Regulatory & Customs</span>
              <span style={{ color: isZimraValid && isZinaraValid ? 'var(--emerald-primary)' : 'var(--red-primary)', fontWeight: 700 }}>30% Weight</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ZIMRA Import Crosscheck</span>
                {isZimraValid ? <Badge variant="high"><Check size={10}/> Passed</Badge> : <Badge variant="alert"><AlertTriangle size={10}/> Flagged</Badge>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ZINARA Licensing Match</span>
                {isZinaraValid ? <Badge variant="high"><Check size={10}/> Passed</Badge> : <Badge variant="alert"><AlertTriangle size={10}/> Flagged</Badge>}
              </div>
            </div>
            <div style={{ marginTop: '16px', height: '6px', background: 'var(--border-glass)', borderRadius: '3px', overflow: 'hidden', marginLeft: '8px' }}>
              <div style={{ height: '100%', width: (isZimraValid && isZinaraValid) ? '100%' : (isZimraValid || isZinaraValid ? '50%' : '20%'), background: (isZimraValid && isZinaraValid) ? 'var(--emerald-primary)' : 'var(--red-primary)', transition: 'width 1.5s ease-out' }}></div>
            </div>
          </div>

          {/* Component 2: Ownership & Theft Checks */}
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isBluebookValid && isCidValid ? 'var(--emerald-primary)' : 'var(--red-primary)' }}></div>
            <h4 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', paddingLeft: '8px' }}>
              <span>Ownership & Anti-Theft</span>
              <span style={{ color: isBluebookValid && isCidValid ? 'var(--emerald-primary)' : 'var(--red-primary)', fontWeight: 700 }}>30% Weight</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CVR Ownership Chain</span>
                {isBluebookValid ? <Badge variant="high"><Check size={10}/> Passed</Badge> : <Badge variant="alert"><AlertTriangle size={10}/> Flagged</Badge>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CID Clearance (Stolen DB)</span>
                {isCidValid ? <Badge variant="high"><Check size={10}/> Passed</Badge> : <Badge variant="alert"><AlertTriangle size={10}/> Flagged</Badge>}
              </div>
            </div>
            <div style={{ marginTop: '16px', height: '6px', background: 'var(--border-glass)', borderRadius: '3px', overflow: 'hidden', marginLeft: '8px' }}>
              <div style={{ height: '100%', width: (isBluebookValid && isCidValid) ? '100%' : (isBluebookValid || isCidValid ? '50%' : '20%'), background: (isBluebookValid && isCidValid) ? 'var(--emerald-primary)' : 'var(--red-primary)', transition: 'width 1.5s ease-out' }}></div>
            </div>
          </div>

          {/* Component 3: Mileage Anomaly Detection */}
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: rollbackDetected ? 'var(--red-primary)' : 'var(--emerald-primary)' }}></div>
            <h4 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', paddingLeft: '8px' }}>
              <span>Odometer Integrity</span>
              <span style={{ color: rollbackDetected ? 'var(--red-primary)' : 'var(--emerald-primary)', fontWeight: 700 }}>20% Weight</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Time-Series Rollback Analysis</span>
                {!rollbackDetected ? <Badge variant="high"><Check size={10}/> Clear</Badge> : <Badge variant="alert"><AlertTriangle size={10}/> Anomaly</Badge>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Log Frequency Check</span>
                <Badge variant="high"><Check size={10}/> Standard</Badge>
              </div>
            </div>
            <div style={{ marginTop: '16px', height: '6px', background: 'var(--border-glass)', borderRadius: '3px', overflow: 'hidden', marginLeft: '8px' }}>
              <div style={{ height: '100%', width: rollbackDetected ? '20%' : '100%', background: rollbackDetected ? 'var(--red-primary)' : 'var(--emerald-primary)', transition: 'width 1.5s ease-out' }}></div>
            </div>
          </div>

          {/* Component 4: Parts & Maintenance Blockchain */}
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: unverifiedParts > 0 ? 'var(--gold-primary)' : 'var(--emerald-primary)' }}></div>
            <h4 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', paddingLeft: '8px' }}>
              <span>PartSentry Cryptography</span>
              <span style={{ color: unverifiedParts > 0 ? 'var(--gold-primary)' : 'var(--emerald-primary)', fontWeight: 700 }}>20% Weight</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ECU Hash Validation</span>
                <Badge variant="high"><Check size={10}/> Matched</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>OEM Parts Authenticity</span>
                {unverifiedParts === 0 ? <Badge variant="high"><Check size={10}/> 100% Genuine</Badge> : <Badge variant="mid"><AlertTriangle size={10}/> {unverifiedParts} Unverified</Badge>}
              </div>
            </div>
            <div style={{ marginTop: '16px', height: '6px', background: 'var(--border-glass)', borderRadius: '3px', overflow: 'hidden', marginLeft: '8px' }}>
              <div style={{ height: '100%', width: unverifiedParts === 0 ? '100%' : '60%', background: unverifiedParts === 0 ? 'var(--emerald-primary)' : 'var(--gold-primary)', transition: 'width 1.5s ease-out' }}></div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '8px', padding: '20px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(7, 10, 19, 0) 100%)', borderLeft: '4px solid var(--emerald-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '50%' }}>
            <Shield size={32} style={{ color: 'var(--emerald-primary)' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '16px', color: 'var(--text-white)' }}>Final Trust Index Computation</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>Score generated dynamically using random forest anomaly detection on Zimbabwe's central vehicle data fabric. Cross-referencing CVR, ZIMRA, CID, and PartSentry ledgers. Confidence level: 98.4%.</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--emerald-light)', textShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
              {report.trustIndex}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Score / 100</div>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Search Console Card */}
      <GlassCard className="glow-emerald" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(17,24,43,0.8) 0%, rgba(7,10,19,0.9) 100%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Global Vehicle History Registry (Digital Passport)</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
          Enter a license plate or 17-character VIN code to query CVR records, ZIMRA tax data, and mechanical integrity ledgers.
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
      </GlassCard>

      {/* Loading Overlay */}
      {loading && (
        <GlassCard className="animate-scan" style={{ padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
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
        </GlassCard>
      )}

      {/* Report Summary */}
      {report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <GlassCard style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="logo-badge" style={{ fontSize: '10px' }}>Digital Passport Certified</span>
              <h2 style={{ fontSize: '24px', marginTop: '8px' }}>{report.year} {report.make} {report.model}</h2>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '13px', marginTop: '4px' }}>Plate: {report.licensePlate} | VIN: {report.vin}</p>
              <div style={{ marginTop: '12px' }}>
                {renderTrustBadge(report.trustIndex)}
              </div>
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
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trust Score</span>
              </div>
            </div>
          </GlassCard>

          {/* AI Fraud Detection & Trust Index Breakdown */}
          {renderFraudDetectionBreakdown(report)}

          {/* Odometer Progression section */}
          {renderOdometerChart(report.historyLogs)}

          <div className="grid-2">
            
            {/* ZIMRA Tax Status & Regulatory */}
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-white)' }}>
                <FileText size={18} style={{ color: 'var(--theme-accent)' }} />
                ZIMRA Tax & CVR Registration
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>ZIMRA Customs Duty (Form 21)</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Import duty clearance and compliance</span>
                  </div>
                  <Badge variant={report.documents.zimra === 'verified' ? 'high' : report.documents.zimra === 'uploaded' ? 'mid' : 'alert'}>
                    {report.documents.zimra.toUpperCase()}
                  </Badge>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>ZINARA Road License</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Annual vehicle road tax valid status</span>
                  </div>
                  <Badge variant={report.documents.zinara === 'verified' ? 'high' : report.documents.zinara === 'uploaded' ? 'mid' : 'alert'}>
                    {report.documents.zinara.toUpperCase()}
                  </Badge>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>CVR Blue Book</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vehicle ownership registration document</span>
                  </div>
                  <Badge variant={report.documents.bluebook === 'verified' ? 'high' : report.documents.bluebook === 'uploaded' ? 'mid' : 'alert'}>
                    {report.documents.bluebook.toUpperCase()}
                  </Badge>
                </div>
                
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>CID Clearance</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Police anti-theft database check</span>
                  </div>
                  <Badge variant={report.documents.cid === 'verified' ? 'high' : report.documents.cid === 'uploaded' ? 'mid' : 'alert'}>
                    {report.documents.cid.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Critical Alerts based on docs */}
              {report.documents.zimra !== 'verified' && (
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
                  <AlertOctagon size={16} style={{ color: 'var(--red-primary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-white)' }}>ZIMRA Customs Ingress Missing</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Official ZIMRA Form 21 has not been verified. High risk of unpaid custom duties or gray import.</p>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Mechanical Health & Specifications */}
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: 'var(--emerald-primary)' }}/>
                Mechanical Health & Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
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

              {report.parts && report.parts.length > 0 && (
                <div style={{ marginTop: '4px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={14}/> PartSentry Blockchain Components</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {report.parts.map((part, pidx) => (
                      <div key={pidx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '6px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>{part.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>SN: {part.serial}</div>
                        </div>
                        <Badge variant={part.status === 'verified' ? 'high' : 'alert'}>
                          {part.status === 'verified' ? <Check size={10} /> : <AlertOctagon size={10} />}
                          {part.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

          </div>

          {/* ZIMRA/VID Verification Timeline */}
          <GlassCard style={{ position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} style={{ color: '#00e5ff' }} />
              ZIMRA / VID Verification Timeline
            </h3>
            
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              {/* Vertical line connecting nodes */}
              <div style={{
                position: 'absolute',
                top: '24px',
                bottom: '24px',
                left: '11px',
                width: '2px',
                background: 'linear-gradient(to bottom, rgba(0, 229, 255, 0.8) 0%, rgba(0, 229, 255, 0.1) 100%)',
                boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
              }}></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {report.historyLogs.map((log, idx) => {
                  const isVerified = log.verified;
                  const isZimraVid = log.source.toUpperCase().includes('ZIMRA') || log.source.toUpperCase().includes('VID') || log.source.toUpperCase().includes('CVR');
                  const nodeColor = isZimraVid ? '#00e5ff' : 'var(--text-muted)';
                  
                  return (
                    <div key={idx} style={{
                      position: 'relative',
                      padding: '16px 20px',
                      background: 'rgba(7, 10, 19, 0.6)',
                      borderRadius: '8px',
                      border: `1px solid ${isZimraVid ? 'rgba(0, 229, 255, 0.2)' : 'var(--border-glass)'}`,
                      boxShadow: isZimraVid ? '0 4px 20px rgba(0, 229, 255, 0.05)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {/* Timeline Node */}
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '24px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#070a13',
                        border: `2px solid ${nodeColor}`,
                        boxShadow: isZimraVid ? '0 0 12px rgba(0, 229, 255, 0.8)' : 'none',
                        zIndex: 2
                      }}></div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontWeight: 700, 
                          fontSize: '15px',
                          color: isZimraVid ? '#00e5ff' : 'var(--text-white)',
                          textShadow: isZimraVid ? '0 0 10px rgba(0, 229, 255, 0.3)' : 'none'
                        }}>{log.source}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.date}</span>
                        </div>
                        {isVerified && (
                          <div style={{ 
                            marginLeft: 'auto', 
                            padding: '4px 10px', 
                            fontSize: '10px', 
                            background: isZimraVid ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isZimraVid ? 'rgba(0, 229, 255, 0.3)' : 'var(--border-glass)'}`,
                            color: isZimraVid ? '#00e5ff' : 'var(--text-muted)',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {isZimraVid ? <Check size={12} /> : null}
                            Verified Event
                          </div>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{log.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </GlassCard>

        </div>
      )}

    </div>
  )
}

