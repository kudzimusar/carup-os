import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Wrench, Shield, ShieldCheck, ShieldAlert, Cpu, Layers, RefreshCw, Send, CheckCircle } from 'lucide-react'

export default function GaragePortal() {
  const { vehicles, triggerPartSentryChange } = useApp()
  const [selectedVin, setSelectedVin] = useState(vehicles[0]?.vin || '')
  const [partName, setPartName] = useState('ECU (Main Unit)')
  const [newSerial, setNewSerial] = useState('')
  const [workshop, setWorkshop] = useState('Chikwanha Auto Clinic (Verified #GR-9921)')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const activeVehicle = vehicles.find(v => v.vin === selectedVin)

  const handleSwapSubmit = async (e) => {
    e.preventDefault()
    if (!newSerial.trim()) {
      setErrorMsg('Please enter a valid part serial number.')
      return
    }
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await triggerPartSentryChange(selectedVin, partName, newSerial, workshop)
      setSuccessMsg(`PartSentry swap initialized successfully! Handshake request sent to owner for verification.`)
      setNewSerial('')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to log parts change.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid-2 animate-fade-in" style={{ gap: '32px' }}>
      
      {/* Diagnostics and Parts Ledger */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)' }}>
              <Cpu size={22} /> PartSentry Ledger
            </h3>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              Cryptographically seal vehicle component serial keys inside the tamper-proof ledger.
            </p>
          </div>
          <span className="badge-glow" style={{ background: 'var(--gold-glow-strong)', color: 'var(--gold-light)', border: '1px solid var(--gold-primary)' }}>
            Active Session
          </span>
        </div>

        {/* Selected Vehicle details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-light)' }}>
            Select Active Workshop Vehicle:
          </label>
          <select 
            value={selectedVin} 
            onChange={(e) => {
              setSelectedVin(e.target.value)
              setSuccessMsg('')
              setErrorMsg('')
            }}
            className="form-input"
            style={{ width: '100%', cursor: 'pointer' }}
          >
            {vehicles.map(v => (
              <option key={v.vin} value={v.vin}>
                {v.year} {v.make} {v.model} ({v.licensePlate || 'No Plate'}) — VIN: {v.vin.substring(0, 8)}...
              </option>
            ))}
          </select>
        </div>

        {activeVehicle && (
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span className="text-muted">License Plate:</span>
                <p style={{ fontWeight: 600, color: 'var(--text-white)' }}>{activeVehicle.licensePlate || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted">Trust Index Score:</span>
                <p style={{ fontWeight: 600, color: activeVehicle.trustIndex > 70 ? 'var(--emerald-light)' : 'var(--gold-light)' }}>
                  {activeVehicle.trustIndex}%
                </p>
              </div>
              <div>
                <span className="text-muted">ECU Serial:</span>
                <p style={{ fontFamily: 'monospace', color: 'var(--text-light)' }}>{activeVehicle.ecuSerial || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-muted">Engine Serial:</span>
                <p style={{ fontFamily: 'monospace', color: 'var(--text-light)' }}>{activeVehicle.engineNo || 'Unknown'}</p>
              </div>
            </div>

            {/* List active parts on vehicle */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--text-white)' }}>Registered Core Components</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeVehicle.parts && activeVehicle.parts.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.name}</span>
                      <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '2px' }}>SN: {p.serial}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {p.status === 'verified' && (
                        <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald-light)' }}>
                          <ShieldCheck size={14} /> Sealed
                        </span>
                      )}
                      {p.status === 'unverified' && (
                        <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold-light)' }}>
                          <Shield size={14} /> Unverified
                        </span>
                      )}
                      {p.status === 'pending_approval' && (
                        <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: '#60a5fa' }}>
                          <RefreshCw size={12} className="animate-spin" /> Pending Signoff
                        </span>
                      )}
                      {p.status === 'rejected' && (
                        <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--red-primary)' }}>
                          <ShieldAlert size={14} /> Tampered / Flagged
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PartSentry Replacement & Handshake Simulator */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)' }}>
            <Wrench size={22} /> Initiate Part Swap
          </h3>
          <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
            Install a replacement component and trigger a secure owner handshake verification.
          </p>
        </div>

        <form onSubmit={handleSwapSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Select Component to Swap:</label>
            <select 
              value={partName} 
              onChange={(e) => setPartName(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            >
              <option value="ECU (Main Unit)">ECU (Main Unit)</option>
              <option value="Engine Block">Engine Block</option>
              <option value="Transmission / Gearbox">Transmission / Gearbox</option>
              <option value="Turbocharger Unit">Turbocharger Unit</option>
              <option value="Catalytic Converter">Catalytic Converter</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>New Component Serial Number:</label>
            <input 
              type="text" 
              placeholder="e.g. DENSO-CYBER-889X" 
              value={newSerial}
              onChange={(e) => setNewSerial(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Logging Workshop / Clinic:</label>
            <input 
              type="text" 
              value={workshop}
              onChange={(e) => setWorkshop(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          {successMsg && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--emerald-glow-strong)', color: 'var(--emerald-light)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-gold" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '48px', background: 'linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-light) 100%)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer' }}
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <>
                <Send size={16} /> Broadcast Handshake Alert
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  )
}
