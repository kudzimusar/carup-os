import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Landmark, ShieldAlert, CheckCircle, FileText, XCircle, ToggleLeft, ToggleRight, Scale, ShieldCheck, RefreshCw, TrendingUp, DollarSign, Award, BarChart2, Activity, Globe } from 'lucide-react'
import GlassCard from './ui/GlassCard'
import Badge from './ui/Badge'

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
      <GlassCard className="neon-sweep-border active-neon-sweep" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px'
      }}>
        {/* Active sequential Block Heights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <TrendingUp size={14} style={{ color: 'var(--theme-text-accent)' }} /> Blockchain Block Height
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
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <DollarSign size={14} style={{ color: 'var(--theme-text-accent)' }} /> SafePay Escrow Volume
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
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Award size={14} style={{ color: 'var(--theme-text-accent)' }} /> Split Commissions Pool
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
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Landmark size={14} style={{ color: 'var(--theme-text-accent)' }} /> ZIMRA Splitter Yields
          </span>
          <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
            USD ${zimraYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Custom import split yields
          </span>
        </div>
      </GlassCard>

      <div className="grid-2" style={{ gap: '32px' }}>
        
        {/* CVR Registry Document Deed Signer */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-accent)' }}>
              <Landmark size={22} /> CVR Registry Deed Signer
            </h3>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              Inspect digital vehicle passports and directly authorize deed titles or registration clearances.
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select In-Review Passport:</label>
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
            <span className="text-muted" style={{ fontSize: '13px', fontWeight: 600 }}>Verify Registry Documents:</span>
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
                      <Badge variant="high">
                        <CheckCircle size={12} /> Signed
                      </Badge>
                    ) : (
                      <button 
                        disabled={loading}
                        onClick={() => handleVerifyDoc(doc.key)}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--theme-glow)',
                          color: 'var(--theme-text-accent)',
                          border: '1px solid var(--theme-border)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseOver={(e) => { e.target.style.background = 'var(--theme-glow-strong)' }}
                        onMouseOut={(e) => { e.target.style.background = 'var(--theme-glow)' }}
                      >
                        Verify / Sign
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </GlassCard>

        {/* Police Recovery & Customs splitting */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* ZRP Police Stolen recovery desk */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-accent)' }}>
                <ShieldAlert size={22} /> ZRP Anti-Theft Command
              </h3>
              <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                Flag stolen vehicles, freeze escrow safe-payments, and drop digital trust profiles.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: activeVehicle.stolen ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.05)', border: activeVehicle.stolen ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>Active Security Status</span>
                <div style={{ marginTop: '6px' }}>
                  {activeVehicle.stolen ? (
                    <Badge variant="alert">FLAGGED AS STOLEN</Badge>
                  ) : (
                    <Badge variant="high">SECURE / CLEAR</Badge>
                  )}
                </div>
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
          </GlassCard>

          {/* ZIMRA Custom Duties split admin */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-accent)' }}>
                <Scale size={22} /> ZIMRA Import Tariff Splitter
              </h3>
              <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                Audit structured custom import duty splits mapped to Zimbabwean Treasury ledgers.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span className="form-label">Import Tariff Rate:</span>
                <span style={{ color: 'var(--theme-text-accent)' }}>{tariffRate}%</span>
              </label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={tariffRate}
                onChange={(e) => setTariffRate(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--theme-accent)' }}
              />
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span className="text-muted font-semibold">Vehicle Base Value:</span>
                <span style={{ fontWeight: 600 }}>USD ${activeVehicle.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                <span className="text-muted font-semibold">Total Customs Duty:</span>
                <span style={{ fontWeight: 600, color: 'var(--theme-text-accent)' }}>USD ${dutyPayable.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="text-muted">ZIMRA Treasury Split (50%):</span>
                <span style={{ color: 'var(--theme-text-accent)' }}>USD ${treasurySplit.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="text-muted">Excise Custom Reserve (35%):</span>
                <span style={{ color: 'var(--theme-text-accent)' }}>USD ${exciseShare.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="text-muted">National Infrastructure Deed (15%):</span>
                <span style={{ color: 'var(--theme-text-accent)' }}>USD ${infrastructureSplit.toLocaleString()}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ZIMRA Tax/Import Analytics Dashboard */}
      <GlassCard className="border-accent" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-accent)' }}>
              <BarChart2 size={22} /> ZIMRA Tax & Import Analytics Terminal
            </h3>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              Real-time predictive telemetry for border clearance, duty yields, and macro-economic tax structuring.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <Badge variant="high">LIVE SYNC</Badge>
             <Badge variant="low">Q3 FISCAL</Badge>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Revenue Trajectory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Projected Q3 Duty Revenue</span>
              <span style={{ fontSize: '12px', color: 'var(--emerald-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} /> +14.2% YoY
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
              USD $42.8M
            </div>
            
            {/* Mock Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '60px', gap: '4px', marginTop: '8px' }}>
              {[30, 45, 25, 60, 40, 75, 50, 85, 65, 95, 80, 100].map((h, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${h}%`,
                  background: h > 80 ? 'var(--theme-text-accent)' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px 2px 0 0',
                  transition: 'height 0.3s ease'
                }} />
              ))}
            </div>
          </div>

          {/* Port Clearance Rates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Border Port Clearances (24H)</span>
              <Activity size={14} style={{ color: 'var(--gold-light)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
               {[
                 { port: 'Beitbridge', val: 84, color: 'var(--emerald-primary)' },
                 { port: 'Chirundu', val: 62, color: 'var(--theme-text-accent)' },
                 { port: 'Plumtree', val: 45, color: 'var(--gold-light)' },
                 { port: 'Forbes', val: 28, color: 'var(--red-primary)' }
               ].map(p => (
                 <div key={p.port} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span style={{ fontSize: '11px', width: '70px', color: 'var(--text-muted)' }}>{p.port}</span>
                   <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                     <div style={{ height: '100%', width: `${p.val}%`, background: p.color }} />
                   </div>
                   <span style={{ fontSize: '11px', width: '30px', textAlign: 'right', fontFamily: 'monospace' }}>{p.val}%</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Vehicle Import Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Import Categories (By Volume)</span>
              <Globe size={14} style={{ color: 'var(--theme-text-accent)' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(var(--theme-text-accent) 0% 45%, var(--emerald-primary) 45% 75%, var(--gold-light) 75% 90%, rgba(255,255,255,0.1) 90% 100%)' }}>
                 <div style={{ position: 'absolute', inset: '8px', background: '#0a0a0a', borderRadius: '50%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--theme-text-accent)' }}>● Commercial</span> <span>45%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--emerald-primary)' }}>● Passenger</span> <span>30%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--gold-light)' }}>● Agricultural</span> <span>15%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>● Special/Other</span> <span>10%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </GlassCard>

    </div>
  )
}
