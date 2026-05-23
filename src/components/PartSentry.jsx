import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ShieldCheck, Wrench, RefreshCw, Lock, Unlock, Link2, AlertTriangle } from 'lucide-react'

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
      <div className="glass-card glow-gold" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(17, 24, 43, 0.7) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.15)',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span className="logo-badge" style={{ background: 'var(--gold-glow-strong)', color: 'var(--gold-light)', borderColor: 'var(--gold-primary)', marginBottom: '8px' }}>Cryptographic Defensibility Moat</span>
          <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>PartSentry™ Ledger</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            PartSentry is Zimbabwe's ultimate defense against chop-shops, ECU cloning, and stolen engines. 
            By locking vehicle serials (Engine, Gearbox, ECU) on a tamper-evident cryptographic ledger, parts changes cannot be forged.
            Installations require a live double-handshake approval between certified garages and vehicle owners.
          </p>
        </div>
        <Lock size={64} style={{ color: 'var(--gold-primary)', opacity: 0.8 }} />
      </div>
      {/* Dynamic TAMPER-EVIDENT PENDING HANDSHAKES BOARD */}
      {notifications.length > 0 && (
        <div className="glass-card glow-gold" style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 24, 43, 0.9) 100%)',
          border: '1px solid var(--gold-primary)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} /> PartSentry Alert — Owner Handshake Ingress
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              A workshop clinic has broadcasted a replacement parts record. Review and sign off to seal cryptographically or flag unauthorized modification:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(notif => (
              <div key={notif.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{notif.partName} Replacement</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Workshop: <strong>{notif.sender}</strong> | Target Serial: <span style={{ fontFamily: 'monospace', color: 'var(--gold-light)' }}>{notif.newSerial}</span>
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
                    style={{ background: 'var(--emerald-primary)', color: '#000', padding: '8px 16px', fontSize: '12px', minHeight: '36px', fontWeight: 'bold', cursor: 'pointer' }}
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
        
        {/* Parts DNA Bill of Materials (BOM) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '18px' }}>Active Vehicle Parts DNA (BOM)</h3>
            <select 
              className="form-input" 
              style={{ background: '#070a13', fontSize: '13px', padding: '6px 12px' }}
              value={selectedVin}
              onChange={(e) => setSelectedVin(e.target.value)}
            >
              {vehicles.map(v => (
                <option key={v.vin} value={v.vin}>{v.make} {v.model} ({v.licensePlate})</option>
              ))}
            </select>
          </div>

          {activeVehicle && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VEHICLE IDENTIFICATION</span>
                  <h4 style={{ fontSize: '15px' }}>{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>PartSentry Lock Status</span>
                  <span style={{ color: 'var(--emerald-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <ShieldCheck size={14} /> SECURED
                  </span>
                </div>
              </div>

              {/* Loop of parts BOM */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeVehicle.parts.map(part => (
                  <div key={part.id} className="glass-card" style={{
                    padding: '16px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderLeft: `4px solid ${part.status === 'verified' ? 'var(--emerald-primary)' : 'var(--gold-primary)'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', color: 'var(--text-white)' }}>{part.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>S/N: {part.serial}</span>
                      </div>
                      
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: part.status === 'verified' ? 'var(--emerald-glow)' : 'var(--gold-glow)',
                        color: part.status === 'verified' ? 'var(--emerald-light)' : 'var(--gold-light)',
                        border: `1px solid ${part.status === 'verified' ? 'var(--emerald-primary)' : 'var(--gold-primary)'}`
                      }}>
                        {part.status === 'verified' ? <Lock size={10} /> : <Unlock size={10} />}
                        {part.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px', marginTop: '8px' }}>
                      <span>Clinic: <strong>{part.workshop}</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted-dark)' }}>
                        <Link2 size={12} />
                        {part.hash}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Live Mechanic In-Field Simulator Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card glow-emerald" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={18} style={{ color: 'var(--emerald-primary)' }} />
              Live Mechanic Telemetry Simulator
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Simulate an in-field parts replacement. As a certified workshop mechanic, log a swap. The system immediately registers it on PartSentry and sends a verification request to the owner!
            </p>

            <form onSubmit={handleSimulateSwap} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Clinic / Garage Identity</label>
                <select 
                  className="form-input" 
                  style={{ background: '#070a13' }}
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                >
                  <option value="Chikwanha Auto Clinic">Chikwanha Auto Clinic (Verified #GR-9921)</option>
                  <option value="Croco Motors Service">Croco Motors Service (Authorized #CR-8810)</option>
                  <option value="Toyota Zimbabwe Bulawayo">Toyota Zimbabwe Bulawayo (#TY-3302)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Component Swapped</label>
                <select 
                  className="form-input" 
                  style={{ background: '#070a13' }}
                  value={targetPart}
                  onChange={(e) => setTargetPart(e.target.value)}
                >
                  <option value="ECU (Main Unit)">ECU (Main Unit)</option>
                  <option value="Transmission / Gearbox">Transmission / Gearbox</option>
                  <option value="Turbocharger Unit">Turbocharger Unit</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New Serial Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. DENSO-CYBER-99G..." 
                  required
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Log Swap & Generate Handshake
              </button>

            </form>

            {simulationLogged && (
              <div style={{
                padding: '12px',
                background: 'var(--emerald-glow)',
                border: '1px solid var(--emerald-primary)',
                borderRadius: '8px',
                color: 'var(--emerald-light)',
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
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>The Neural Handshake Model</h4>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</span>
                <span>Mechanic registers installation via Garage API</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</span>
                <span>Owner receives instant WhatsApp & in-app security prompt</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
                <span>Owner reviews match and signs off with cryptographic hash</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</span>
                <span style={{ color: 'var(--emerald-light)' }}>BOM updates, Trust Score improves, ledger seals permanently!</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
