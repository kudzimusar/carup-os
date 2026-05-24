import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ShieldCheck, Wrench, RefreshCw, Lock, Unlock, Link2, AlertTriangle, Activity, Cpu, Database, Hexagon, Server, CheckCircle2 } from 'lucide-react'

export default function PartSentry() {
  const { vehicles, triggerPartSentryChange, notifications, approvePartSentrySwap, rejectPartSentrySwap } = useApp()
  const [selectedVin, setSelectedVin] = useState('')
  const [targetPart, setTargetPart] = useState('ECU (Main Unit)')
  const [newSerial, setNewSerial] = useState('')
  const [workshopName, setWorkshopName] = useState('Chikwanha Auto Clinic')
  const [simulationLogged, setSimulationLogged] = useState(false)

  React.useEffect(() => {
    if (!selectedVin && vehicles && vehicles.length > 0) {
      setSelectedVin(vehicles[0].vin)
    }
  }, [vehicles, selectedVin])

  const activeVehicle = vehicles.find(v => v.vin === selectedVin)

  const handleSimulateSwap = async (e) => {
    e.preventDefault()
    if (!selectedVin || !targetPart || !newSerial) return

    try {
      await triggerPartSentryChange(selectedVin, targetPart, newSerial, workshopName)
      setSimulationLogged(true)
      setNewSerial('')
      
      // Clear success message after 4 seconds
      setTimeout(() => {
        setSimulationLogged(false)
      }, 4500)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Introduction Card */}
      <div className="glass-card glow-cyan" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(11, 16, 32, 0.8) 100%)',
        border: '1px solid var(--cyan-primary)',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span className="logo-badge" style={{ background: 'var(--cyan-glow-strong)', color: 'var(--cyan-light)', borderColor: 'var(--cyan-primary)', marginBottom: '8px' }}>Cryptographic Defensibility Moat</span>
          <h2 style={{ fontSize: '26px', marginBottom: '8px', color: 'var(--cyan-light)' }}>PartSentry™ Ledger</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            PartSentry is Zimbabwe's ultimate defense against chop-shops, ECU cloning, and stolen engines. 
            By locking vehicle serials (Engine, Gearbox, ECU) on a tamper-evident cryptographic ledger, parts changes cannot be forged.
            Installations require a live double-handshake approval between certified garages and vehicle owners.
          </p>
        </div>
        <Hexagon size={64} style={{ color: 'var(--cyan-primary)', opacity: 0.8 }} />
      </div>

      {/* Dynamic TAMPER-EVIDENT PENDING HANDSHAKES BOARD */}
      {notifications.length > 0 && (
        <div className="glass-card glow-cyan" style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(11, 16, 32, 0.9) 100%)',
          border: '1px solid var(--cyan-primary)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--cyan-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} /> PartSentry Alert — Owner Handshake Ingress
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              A workshop clinic has broadcasted a replacement parts record. Review and sign off to seal cryptographically or flag unauthorized modification:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(notif => (
              <div key={notif.id} style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', border: '1px solid var(--cyan-glow-strong)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{notif.partName} Replacement</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Workshop: <strong style={{ color: 'var(--cyan-light)' }}>{notif.sender}</strong> | Target Serial: <span style={{ fontFamily: 'monospace', color: 'var(--cyan-light)' }}>{notif.newSerial}</span>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'var(--red-glow)', color: '#fca5a5', padding: '8px 16px', fontSize: '12px', minHeight: '36px', cursor: 'pointer' }}
                    onClick={() => rejectPartSentrySwap(notif.id)}
                  >
                    Flag Unauthorized / Reject
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ background: 'var(--cyan-primary)', color: '#000', padding: '8px 16px', fontSize: '12px', minHeight: '36px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px var(--cyan-glow)' }}
                    onClick={() => approvePartSentrySwap(notif.id)}
                  >
                    Verify & Cryptographic Seal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid containing Parts DNA list and Mechanic Simulator */}
      <div className="grid-layout-split">
        
        {/* Parts DNA Bill of Materials (BOM) Tracker */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-solid-card)', borderColor: 'var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--cyan-light)' }}>Active Vehicle Parts DNA (BOM)</h3>
            <select 
              className="form-input" 
              style={{ background: 'rgba(0,0,0,0.5)', fontSize: '13px', padding: '6px 12px', borderColor: 'var(--cyan-glow)' }}
              value={selectedVin}
              onChange={(e) => setSelectedVin(e.target.value)}
            >
              {vehicles.map(v => (
                <option key={v.vin} value={v.vin}>{v.make} {v.model} ({v.licensePlate})</option>
              ))}
            </select>
          </div>

          {activeVehicle && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(6, 182, 212, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid var(--cyan-glow-strong)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--cyan-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>Vehicle Identity Matrix</span>
                  <h4 style={{ fontSize: '18px', color: 'var(--text-white)' }}>{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Network Consensus</span>
                  <span style={{ color: 'var(--cyan-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', background: 'rgba(6,182,212,0.1)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--cyan-primary)' }}>
                    <Server size={14} /> IMMUTABLE
                  </span>
                </div>
              </div>

              {/* Digital Twin 3D Top-Down Chassis Visualizer */}
              <div style={{
                position: 'relative',
                background: 'var(--bg-deep)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundSize: '24px 24px',
                  backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px)',
                  zIndex: 0
                }} />
                
                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '350px' }}>
                  <svg viewBox="0 0 200 400" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.2))' }}>
                    {/* Definitions for gradients and glows */}
                    <defs>
                      <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(11, 16, 32, 0.8)" />
                        <stop offset="100%" stopColor="rgba(11, 16, 32, 0.95)" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Outer Frame (Grid Context) */}
                    <rect x="10" y="10" width="180" height="380" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" strokeDasharray="4 4" rx="8" />

                    {/* Main Chassis Body */}
                    <rect x="45" y="30" width="110" height="340" rx="35" fill="url(#chassisGrad)" stroke="var(--cyan-primary)" strokeWidth="2" />
                    
                    {/* Cabin/Windshield Area */}
                    <path d="M 50 140 Q 100 120 150 140 L 145 260 Q 100 280 55 260 Z" fill="rgba(6, 182, 212, 0.05)" stroke="var(--cyan-glow-strong)" strokeWidth="1" />
                    
                    {/* Wheels */}
                    <g fill="rgba(5, 8, 16, 1)" stroke="var(--cyan-primary)" strokeWidth="1.5">
                      <rect x="30" y="65" width="18" height="45" rx="4" />
                      <rect x="152" y="65" width="18" height="45" rx="4" />
                      <rect x="30" y="285" width="18" height="45" rx="4" />
                      <rect x="152" y="285" width="18" height="45" rx="4" />
                    </g>
                    
                    {/* Part Components */}
                    
                    {/* ECU Node */}
                    <g transform="translate(65, 55)">
                      <rect width="70" height="45" rx="6" 
                        fill={activeVehicle.parts.some(p => p.name.includes('ECU') && p.status === 'verified') ? 'rgba(6, 182, 212, 0.15)' : 'rgba(234, 179, 8, 0.15)'}
                        stroke={activeVehicle.parts.some(p => p.name.includes('ECU') && p.status === 'verified') ? 'var(--cyan-light)' : 'var(--gold-light)'} 
                        strokeWidth="1.5" filter="url(#glow)" />
                      <text x="35" y="22" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" letterSpacing="1">ECU</text>
                      {activeVehicle.parts.some(p => p.name.includes('ECU') && p.status === 'pending') && (
                        <circle cx="60" cy="10" r="3" fill="var(--gold-light)" className="pulse-anim" />
                      )}
                    </g>
                    
                    {/* Transmission Node */}
                    <g transform="translate(80, 115)">
                      <rect width="40" height="60" rx="4" 
                        fill={activeVehicle.parts.some(p => p.name.includes('Transmission') && p.status === 'verified') ? 'rgba(6, 182, 212, 0.15)' : 'rgba(234, 179, 8, 0.15)'}
                        stroke={activeVehicle.parts.some(p => p.name.includes('Transmission') && p.status === 'verified') ? 'var(--cyan-light)' : 'var(--gold-light)'} 
                        strokeWidth="1.5" filter="url(#glow)" />
                      <text x="20" y="30" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform="rotate(90 20 30)" letterSpacing="1">TRANS</text>
                      {activeVehicle.parts.some(p => p.name.includes('Transmission') && p.status === 'pending') && (
                        <circle cx="30" cy="10" r="3" fill="var(--gold-light)" className="pulse-anim" />
                      )}
                    </g>
                    
                    {/* Turbocharger Node */}
                    <g transform="translate(120, 85)">
                      <circle cx="15" cy="15" r="14" 
                        fill={activeVehicle.parts.some(p => p.name.includes('Turbocharger') && p.status === 'verified') ? 'rgba(6, 182, 212, 0.15)' : 'rgba(234, 179, 8, 0.15)'}
                        stroke={activeVehicle.parts.some(p => p.name.includes('Turbocharger') && p.status === 'verified') ? 'var(--cyan-light)' : 'var(--gold-light)'} 
                        strokeWidth="1.5" filter="url(#glow)" />
                      <text x="15" y="15" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">TB</text>
                      {activeVehicle.parts.some(p => p.name.includes('Turbocharger') && p.status === 'pending') && (
                        <circle cx="25" cy="5" r="3" fill="var(--gold-light)" className="pulse-anim" />
                      )}
                    </g>

                    {/* Cryptographic Link Lines */}
                    <path d="M 100 100 L 100 115" stroke="var(--cyan-primary)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 120 100 L 110 115" stroke="var(--cyan-primary)" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    {/* Holographic Scanner Beam */}
                    <rect x="45" y="30" width="110" height="2" fill="var(--cyan-light)" className="scan-line-anim" style={{ animation: 'scan 4s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} filter="url(#glow)" />
                  </svg>
                  
                  {/* Decorative Labels */}
                  <div style={{ position: 'absolute', top: '-10px', left: '-20px', color: 'var(--cyan-primary)', fontSize: '10px', fontFamily: 'monospace' }}>Z-AXIS: TOP</div>
                  <div style={{ position: 'absolute', bottom: '-10px', right: '-20px', color: 'var(--cyan-primary)', fontSize: '10px', fontFamily: 'monospace' }}>RENDER: HW-ACCEL</div>
                  
                  <style>
                    {`
                      @keyframes scan {
                        0% { transform: translateY(0); opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { transform: translateY(340px); opacity: 0; }
                      }
                      @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.6); opacity: 0.4; }
                        100% { transform: scale(1); opacity: 1; }
                      }
                      .pulse-anim {
                        animation: pulse 1.5s ease-in-out infinite;
                      }
                    `}
                  </style>
                </div>
              </div>

              {/* Blockchain Visual Tracker */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0', paddingLeft: '24px' }}>
                {/* Connecting Line */}
                <div style={{ position: 'absolute', left: '47px', top: '24px', bottom: '24px', width: '2px', background: 'linear-gradient(to bottom, var(--cyan-primary), rgba(6,182,212,0.1))', zIndex: 0 }} />

                {activeVehicle.parts.map((part, index) => (
                  <div key={part.id} style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1, marginBottom: index === activeVehicle.parts.length - 1 ? 0 : '32px' }}>
                    {/* Node Icon */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px', 
                      background: 'var(--bg-deep)', 
                      border: `2px solid ${part.status === 'verified' ? 'var(--cyan-primary)' : 'var(--gold-primary)'}`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 15px ${part.status === 'verified' ? 'var(--cyan-glow-strong)' : 'var(--gold-glow-strong)'}`,
                      flexShrink: 0
                    }}>
                      {part.name.includes('ECU') ? <Cpu size={24} color={part.status === 'verified' ? 'var(--cyan-light)' : 'var(--gold-light)'} /> : 
                       part.name.includes('Transmission') ? <Activity size={24} color={part.status === 'verified' ? 'var(--cyan-light)' : 'var(--gold-light)'} /> :
                       <Database size={24} color={part.status === 'verified' ? 'var(--cyan-light)' : 'var(--gold-light)'} />}
                    </div>

                    {/* Block Data */}
                    <div className="glass-card" style={{
                      flex: 1, padding: '16px', 
                      background: 'linear-gradient(90deg, rgba(11, 16, 32, 0.9) 0%, rgba(22, 27, 46, 0.7) 100%)',
                      borderLeft: `4px solid ${part.status === 'verified' ? 'var(--cyan-primary)' : 'var(--gold-primary)'}`,
                      borderTop: '1px solid var(--border-glass)', borderRight: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', color: 'var(--text-white)', marginBottom: '4px' }}>{part.name}</h4>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>S/N: {part.serial}</span>
                          </div>
                        </div>
                        
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: part.status === 'verified' ? 'var(--cyan-glow)' : 'var(--gold-glow)',
                          color: part.status === 'verified' ? 'var(--cyan-light)' : 'var(--gold-light)',
                          border: `1px solid ${part.status === 'verified' ? 'var(--cyan-primary)' : 'var(--gold-primary)'}`,
                          boxShadow: `0 0 10px ${part.status === 'verified' ? 'var(--cyan-glow)' : 'var(--gold-glow)'}`
                        }}>
                          {part.status === 'verified' ? <ShieldCheck size={12} /> : <Unlock size={12} />}
                          {part.status === 'verified' ? 'SECURED' : 'PENDING'}
                        </span>
                      </div>

                      <div style={{ 
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', 
                        fontSize: '12px', color: 'var(--text-muted)', 
                        background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.02)'
                      }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', marginBottom: '2px', opacity: 0.7 }}>Origin Node</span>
                          <strong style={{ color: 'var(--text-light)' }}>{part.workshop}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', marginBottom: '2px', opacity: 0.7 }}>Cryptographic Hash</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', color: 'var(--cyan-light)' }}>
                            <Link2 size={10} />
                            {part.hash.substring(0, 16)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Live Mechanic In-Field Simulator Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card glow-cyan" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(11, 16, 32, 0.7)', borderColor: 'var(--cyan-glow-strong)' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-light)' }}>
              <Wrench size={18} style={{ color: 'var(--cyan-primary)' }} />
              Live Mechanic Telemetry Simulator
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Simulate an in-field parts replacement. As a certified workshop mechanic, log a swap. The system immediately registers it on PartSentry and sends a verification request to the owner!
            </p>

            <form onSubmit={handleSimulateSwap} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: 'var(--cyan-light)' }}>Clinic / Garage Identity</label>
                <select 
                  className="form-input" 
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                >
                  <option value="Chikwanha Auto Clinic">Chikwanha Auto Clinic (Verified #GR-9921)</option>
                  <option value="Croco Motors Service">Croco Motors Service (Authorized #CR-8810)</option>
                  <option value="Toyota Zimbabwe Bulawayo">Toyota Zimbabwe Bulawayo (#TY-3302)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: 'var(--cyan-light)' }}>Component Swapped</label>
                <select 
                  className="form-input" 
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                  value={targetPart}
                  onChange={(e) => setTargetPart(e.target.value)}
                >
                  <option value="ECU (Main Unit)">ECU (Main Unit)</option>
                  <option value="Transmission / Gearbox">Transmission / Gearbox</option>
                  <option value="Turbocharger Unit">Turbocharger Unit</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: 'var(--cyan-light)' }}>New Serial Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. DENSO-CYBER-99G..." 
                  required
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', background: 'var(--cyan-primary)', boxShadow: '0 0 10px var(--cyan-glow)' }}>
                Log Swap & Generate Handshake
              </button>

            </form>

            {simulationLogged && (
              <div style={{
                padding: '12px',
                background: 'var(--cyan-glow)',
                border: '1px solid var(--cyan-primary)',
                borderRadius: '8px',
                color: 'var(--cyan-light)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} />
                Swap logged! Check active alerts notification bar above to review!
              </div>
            )}
          </div>

          {/* Neural Handshake workflow panel */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(11, 16, 32, 0.5)', borderColor: 'var(--cyan-glow)' }}>
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cyan-light)' }}>The Neural Handshake Model</h4>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--cyan-glow)', color: 'var(--cyan-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</span>
                <span>Mechanic registers installation via Garage API</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--cyan-glow)', color: 'var(--cyan-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</span>
                <span>Owner receives instant WhatsApp & in-app security prompt</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--cyan-glow)', color: 'var(--cyan-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
                <span>Owner reviews match and signs off with cryptographic hash</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--cyan-primary)', color: '#000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</span>
                <span style={{ color: 'var(--cyan-light)' }}>BOM updates, Trust Score improves, ledger seals permanently!</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
