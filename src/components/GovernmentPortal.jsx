import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Landmark, ShieldAlert, CheckCircle, FileText, XCircle, ToggleLeft, ToggleRight, Scale, ShieldCheck, RefreshCw, TrendingUp, DollarSign, Award } from 'lucide-react'

export default function GovernmentPortal() {
  const { vehicles, verifyDocumentDirectly, toggleVehicleStolen, adminMetrics } = useApp()
  const [selectedVin, setSelectedVin] = useState(vehicles[0]?.vin || '')
  const [loading, setLoading] = useState(false)
  const [tariffRate, setTariffRate] = useState(40) // Default 40% import duty tariff rate

  const activeVehicle = vehicles.find(v => v.vin === selectedVin)
  if (!activeVehicle) return null

  const docs = [
    { key: 'zimra', label: 'ZIMRA Customs Ingestion (Form 21)' },
    { key: 'bluebook', label: 'CVR Blue Book Deed' },
    { key: 'cid', label: 'CID Theft Clearance' },
    { key: 'vid', label: 'VID Fitness Certificate' },
    { key: 'zinara', label: 'ZINARA License Disk' },
    { key: 'insurance', label: 'Active Insurance Cover' },
    { key: 'invoices', label: 'Receipts / Invoice Logs' }
  ]

  const handleVerifyDoc = async (docType) => {
    setLoading(true)
    try {
      await verifyDocumentDirectly(selectedVin, docType)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStolen = async () => {
    setLoading(true)
    try {
      await toggleVehicleStolen(selectedVin, !activeVehicle.stolen)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Customs calculations
  const dutyPayable = Math.round(activeVehicle.price * (tariffRate / 100))
  const exciseShare = Math.round(dutyPayable * 0.35)
  const infrastructureSplit = Math.round(dutyPayable * 0.15)
  const treasurySplit = Math.round(dutyPayable * 0.50)

  // ZIMRA customs duty yield from verified documents
  const zimraYield = vehicles.reduce((acc, v) => acc + (v.documents.zimra === 'verified' ? v.price * 0.15 : 0), 0)

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Live System Telemetry Metrics */}
      <div className="glass-card" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        border: '1px solid rgba(239, 68, 68, 0.25)', 
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.05)',
        padding: '20px'
      }}>
        {/* Active sequential Block Heights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} style={{ color: '#fca5a5' }} /> Blockchain Block Height
          </span>
          <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
            #{adminMetrics?.blockchainBlocks || 0}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--emerald-light)' }}>
            Notary registry validated
          </span>
        </div>

        {/* SafePay Escrow transaction volumes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={14} style={{ color: '#fca5a5' }} /> SafePay Escrow Volume
          </span>
          <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
            {adminMetrics?.escrows || 0} Tx
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Active contracts held
          </span>
        </div>

        {/* Split commissions pools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={14} style={{ color: '#fca5a5' }} /> Split Commissions Pool
          </span>
          <h4 style={{ fontSize: '24px', color: 'var(--gold-light)', fontWeight: 800 }}>
            USD ${(adminMetrics?.totalCommissions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            1.2% banking splits
          </span>
        </div>

        {/* ZIMRA custom splitter yields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Landmark size={14} style={{ color: '#fca5a5' }} /> ZIMRA Splitter Yields
          </span>
          <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
            USD ${zimraYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Custom import split yields
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '32px' }}>
        
        {/* CVR Registry Document Deed Signer */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(239, 68, 68, 0.25)', boxShadow: '0 0 20px rgba(239, 68, 68, 0.05)' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5' }}>
              <Landmark size={22} /> CVR Registry Deed Signer
            </h3>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              Inspect digital vehicle passports and directly authorize deed titles or registration clearances.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Select In-Review Passport:</label>
            <select 
              value={selectedVin} 
              onChange={(e) => setSelectedVin(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            >
              {vehicles.map(v => (
                <option key={v.vin} value={v.vin}>
                  {v.year} {v.make} {v.model} ({v.licensePlate || 'No License'}) — VIN: {v.vin.substring(0, 8)}...
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Verification Signer Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="text-muted" style={{ fontSize: '13px' }}>Verify Registry Documents:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {docs.map(doc => {
                const status = activeVehicle.documents[doc.key]
                return (
                  <div key={doc.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{doc.label}</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Status: {status.toUpperCase()}</p>
                    </div>
                    {status === 'verified' ? (
                      <span style={{ fontSize: '12px', color: 'var(--emerald-light)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle size={14} /> Signed
                      </span>
                    ) : (
                      <button 
                        disabled={loading}
                        onClick={() => handleVerifyDoc(doc.key)}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        Verify / Sign
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Police Recovery & Customs splitting */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* ZRP Police Stolen recovery desk */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(239, 68, 68, 0.25)', boxShadow: '0 0 20px rgba(239, 68, 68, 0.05)' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5' }}>
                <ShieldAlert size={22} /> ZRP Anti-Theft Command
              </h3>
              <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                Flag stolen vehicles, freeze escrow safe-payments, and drop digital trust profiles.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: activeVehicle.stolen ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.05)', border: activeVehicle.stolen ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '12px' }}>Active Security Status</span>
                <h4 style={{ color: activeVehicle.stolen ? 'var(--red-primary)' : 'var(--emerald-light)', marginTop: '4px' }}>
                  {activeVehicle.stolen ? 'FLAGGED AS STOLEN' : 'SECURE / CLEAR'}
                </h4>
              </div>

              <button 
                disabled={loading}
                onClick={handleToggleStolen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: activeVehicle.stolen ? 'var(--emerald-primary)' : 'var(--red-primary)',
                  color: activeVehicle.stolen ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  minHeight: '40px'
                }}
              >
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : activeVehicle.stolen ? (
                  <>Clear Police Flag</>
                ) : (
                  <>Flag As Stolen</>
                )}
              </button>
            </div>
          </div>

          {/* ZIMRA Custom Duties split admin */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(239, 68, 68, 0.25)', boxShadow: '0 0 20px rgba(239, 68, 68, 0.05)' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5' }}>
                <Scale size={22} /> ZIMRA Import Tariff Splitter
              </h3>
              <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                Audit structured custom import duty splits mapped to Zimbabwean Treasury ledgers.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Import Tariff Rate:</span>
                <span style={{ color: '#fca5a5' }}>{tariffRate}%</span>
              </label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={tariffRate}
                onChange={(e) => setTariffRate(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--red-primary)' }}
              />
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span className="text-muted">Vehicle Base Value:</span>
                <span style={{ fontWeight: 600 }}>USD ${activeVehicle.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                <span className="text-muted">Total Customs Duty:</span>
                <span style={{ fontWeight: 600, color: 'var(--red-primary)' }}>USD ${dutyPayable.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="text-muted">ZIMRA Treasury Split (50%):</span>
                <span style={{ color: '#fca5a5' }}>USD ${treasurySplit.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="text-muted">Excise Custom Reserve (35%):</span>
                <span style={{ color: '#fca5a5' }}>USD ${exciseShare.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="text-muted">National Infrastructure Deed (15%):</span>
                <span style={{ color: '#fca5a5' }}>USD ${infrastructureSplit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
