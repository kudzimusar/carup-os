import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { 
  Calculator, Landmark, Activity, MapPin, Crosshair, Terminal, Server, Gauge, AlertTriangle, Box
} from 'lucide-react'
import Badge from './ui/Badge'

export default function CorporatePortal() {
  const { vehicles = [], adminMetrics } = useApp()
  const [selectedVin, setSelectedVin] = useState(vehicles[0]?.vin || '')
  const [loanAmount, setLoanAmount] = useState('15000')
  const [loanDuration, setLoanDuration] = useState('36')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Telemetry ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeVehicle = vehicles.find(v => v.vin === selectedVin)
  const trust = activeVehicle ? activeVehicle.trustIndex : 50
  const isStolen = activeVehicle ? activeVehicle.stolen : false

  // Formulas
  const ltv = isStolen ? 0 : Math.min(85, Math.max(10, Math.round(trust * 0.95)))
  const maxAllowableLoan = activeVehicle ? Math.round((activeVehicle.price || 0) * (ltv / 100)) : 0
  const calculatedResidual = activeVehicle ? Math.round((activeVehicle.price || 0) * (trust / 120)) : 0
  const baseRate = 8.5 
  const riskPremium = Math.max(1.5, 12 - (trust / 10))
  const finalRate = isStolen ? 0 : parseFloat((baseRate + riskPremium).toFixed(2))

  const p = parseFloat(loanAmount) || 0
  const r = (finalRate / 100) / 12
  const n = parseInt(loanDuration) || 12
  const monthlyPayment = (r > 0 && n > 0) ? Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0

  const zimraYield = vehicles.reduce((acc, v) => acc + (v.documents?.zimra === 'verified' ? (v.price || 0) * 0.15 : 0), 0)

  // Fleet Metrics
  const activeFleet = vehicles.filter(v => !v.stolen && v.trustIndex > 60).length
  const stolenCount = vehicles.filter(v => v.stolen).length
  const totalValue = vehicles.reduce((acc, v) => acc + (v.price || 0), 0)
  
  // Terminal Styles
  const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", letterSpacing: '-0.5px' }
  const terminalGreen = '#00FF41'
  const teslaRed = '#E82127'
  const bloombergAmber = '#FFB000'
  const cyanNeon = '#00E5FF'

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#090a0f', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
      
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${cyanNeon}33`, paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Server size={20} color={cyanNeon} />
          <h2 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Fleet Operations Command</h2>
          <Badge variant="high" style={{ background: `${terminalGreen}22`, color: terminalGreen, border: `1px solid ${terminalGreen}55`, ...mono }}>LIVE</Badge>
        </div>
        <div style={{ ...mono, color: bloombergAmber, fontSize: '13px', display: 'flex', gap: '16px' }}>
          <span>SYS.TIME: {currentTime.toISOString().split('T')[1].slice(0,8)}</span>
          <span>LAT: -17.8248</span>
          <span>LNG: 31.0530</span>
        </div>
      </div>

      {/* TOP METRICS ROW - HIGH DENSITY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {/* Metric 1 */}
        <div style={{ background: '#11141a', border: `1px solid #1f2937`, padding: '12px', borderLeft: `3px solid ${cyanNeon}` }}>
          <div style={{ color: '#8b949e', fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Fleet NAV (USD)</span> <Activity size={12} color={cyanNeon} />
          </div>
          <div style={{ ...mono, color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            ${totalValue.toLocaleString()}
          </div>
          <div style={{ ...mono, color: terminalGreen, fontSize: '10px', marginTop: '4px' }}>
            +2.4% Δ 24H
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ background: '#11141a', border: `1px solid #1f2937`, padding: '12px', borderLeft: `3px solid ${terminalGreen}` }}>
          <div style={{ color: '#8b949e', fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Active Deployments</span> <MapPin size={12} color={terminalGreen} />
          </div>
          <div style={{ ...mono, color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            {activeFleet} / {vehicles.length}
          </div>
          <div style={{ ...mono, color: '#8b949e', fontSize: '10px', marginTop: '4px' }}>
            UTILIZATION: {vehicles.length > 0 ? Math.round((activeFleet/vehicles.length)*100) : 0}%
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{ background: '#11141a', border: `1px solid #1f2937`, padding: '12px', borderLeft: `3px solid ${bloombergAmber}` }}>
          <div style={{ color: '#8b949e', fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>ZIMRA Custom Yield</span> <Landmark size={12} color={bloombergAmber} />
          </div>
          <div style={{ ...mono, color: bloombergAmber, fontSize: '20px', fontWeight: 'bold' }}>
            ${zimraYield.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div style={{ ...mono, color: terminalGreen, fontSize: '10px', marginTop: '4px' }}>
            TARIFF SYNC ACTIVE
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{ background: '#11141a', border: `1px solid #1f2937`, padding: '12px', borderLeft: `3px solid ${stolenCount > 0 ? teslaRed : terminalGreen}` }}>
          <div style={{ color: '#8b949e', fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Security Alerts</span> <AlertTriangle size={12} color={stolenCount > 0 ? teslaRed : terminalGreen} />
          </div>
          <div style={{ ...mono, color: stolenCount > 0 ? teslaRed : '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            {stolenCount} FLAG{stolenCount !== 1 ? 'S' : ''}
          </div>
          <div style={{ ...mono, color: stolenCount > 0 ? teslaRed : terminalGreen, fontSize: '10px', marginTop: '4px' }}>
            {stolenCount > 0 ? 'CRITICAL: THEFT REPORTED' : 'ALL SYSTEMS NOMINAL'}
          </div>
        </div>

        {/* Metric 5 */}
        <div style={{ background: '#11141a', border: `1px solid #1f2937`, padding: '12px', borderLeft: `3px solid #8b5cf6` }}>
          <div style={{ color: '#8b949e', fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Escrow Ledger Vol</span> <Box size={12} color="#8b5cf6" />
          </div>
          <div style={{ ...mono, color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            {adminMetrics?.escrows || 0} TX
          </div>
          <div style={{ ...mono, color: '#8b5cf6', fontSize: '10px', marginTop: '4px' }}>
            BLOCK HEIGHT: #{adminMetrics?.blockchainBlocks || 0}
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - HIGH DENSITY TABLE & LOGS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        
        {/* Fleet Roster Table */}
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '280px' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161b22', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={14} color={cyanNeon} /> ASSET TELEMETRY GRID
            </span>
            <span style={{ ...mono, fontSize: '10px', color: '#8b949e' }}>ROWS: {vehicles.length}</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#11141a', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid #30363d', ...mono, fontSize: '10px', color: '#8b949e' }}>
                  <th style={{ padding: '8px 12px' }}>VIN/ID</th>
                  <th style={{ padding: '8px 12px' }}>MODEL</th>
                  <th style={{ padding: '8px 12px' }}>TRUST</th>
                  <th style={{ padding: '8px 12px' }}>VAL (USD)</th>
                  <th style={{ padding: '8px 12px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody style={{ ...mono, fontSize: '11px', color: '#c9d1d9' }}>
                {vehicles.map((v) => (
                  <tr key={v.vin} style={{ borderBottom: '1px solid #30363d', cursor: 'pointer', background: selectedVin === v.vin ? '#1f2937' : 'transparent', borderLeft: selectedVin === v.vin ? `2px solid ${cyanNeon}` : '2px solid transparent' }} onClick={() => setSelectedVin(v.vin)}>
                    <td style={{ padding: '8px 12px' }}>{v.vin.substring(0,8)}...</td>
                    <td style={{ padding: '8px 12px' }}>{v.year} {v.make}</td>
                    <td style={{ padding: '8px 12px', color: v.trustIndex >= 80 ? terminalGreen : v.trustIndex >= 50 ? bloombergAmber : teslaRed }}>{v.trustIndex.toFixed(1)}</td>
                    <td style={{ padding: '8px 12px' }}>${(v.price || 0).toLocaleString()}</td>
                    <td style={{ padding: '8px 12px' }}>
                      {v.stolen ? <span style={{ color: teslaRed, fontWeight: 'bold' }}>STOLEN</span> : 
                       v.trustIndex > 70 ? <span style={{ color: terminalGreen }}>ACTIVE</span> : 
                       <span style={{ color: bloombergAmber }}>MAINT</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-Time Terminal Logs */}
        <div style={{ background: '#000', border: '1px solid #30363d', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden', height: '280px' }}>
          <div style={{ ...mono, fontSize: '10px', color: '#8b949e', display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #30363d', paddingBottom: '4px' }}>
            <span><Terminal size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> SYS_LOG</span>
            <span style={{ color: terminalGreen }}>TAILING</span>
          </div>
          <div style={{ ...mono, fontSize: '10px', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '6px', opacity: 0.8, overflowY: 'auto' }}>
            <div><span style={{ color: '#8b949e' }}>[{currentTime.toISOString().split('T')[1].slice(0,8)}]</span> [INFO] Escrow block #{adminMetrics?.blockchainBlocks || 0} synchronized.</div>
            <div><span style={{ color: '#8b949e' }}>[{new Date(currentTime.getTime() - 2000).toISOString().split('T')[1].slice(0,8)}]</span> [WARN] ZIMRA tariff rates refreshed. Delta: 0.00%</div>
            {stolenCount > 0 && <div><span style={{ color: teslaRed }}>[{new Date(currentTime.getTime() - 5000).toISOString().split('T')[1].slice(0,8)}]</span> [CRIT] {stolenCount} asset(s) flagged stolen. Lockdowns active.</div>}
            <div><span style={{ color: '#8b949e' }}>[{new Date(currentTime.getTime() - 15000).toISOString().split('T')[1].slice(0,8)}]</span> [INFO] Fleet telemetry heartbeat OK.</div>
            <div><span style={{ color: '#8b949e' }}>[{new Date(currentTime.getTime() - 32000).toISOString().split('T')[1].slice(0,8)}]</span> [INFO] Comm. pool adjusted to ${(adminMetrics?.totalCommissions || 0).toLocaleString()}</div>
            <div><span style={{ color: '#8b949e' }}>[{new Date(currentTime.getTime() - 45000).toISOString().split('T')[1].slice(0,8)}]</span> [DEBUG] Vehicle state updated via OBII socket.</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, #000)' }}></div>
        </div>

      </div>

      {/* BOTTOM SECTION - RISK ANALYZER & CALCULATOR (COMPACT) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        
        {/* Underwriting Module */}
        <div style={{ background: '#11141a', border: '1px solid #30363d', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: cyanNeon, marginBottom: '16px', borderBottom: '1px solid #30363d', paddingBottom: '8px' }}>
            <Crosshair size={16} /> <span style={{ fontSize: '12px', fontWeight: 700 }}>UNDERWRITING MODULE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...mono, fontSize: '11px', color: '#8b949e' }}>SELECTED ASSET:</span>
              <span style={{ ...mono, fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>{activeVehicle?.vin.substring(0,12) || 'N/A'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#0d1117', padding: '8px', border: '1px solid #30363d', borderRadius: '4px' }}>
                <span style={{ ...mono, fontSize: '9px', color: '#8b949e', display: 'block' }}>LTV LIMIT</span>
                <span style={{ ...mono, fontSize: '16px', color: isStolen ? teslaRed : cyanNeon }}>{ltv}%</span>
              </div>
              <div style={{ background: '#0d1117', padding: '8px', border: '1px solid #30363d', borderRadius: '4px' }}>
                <span style={{ ...mono, fontSize: '9px', color: '#8b949e', display: 'block' }}>MAX CREDIT</span>
                <span style={{ ...mono, fontSize: '16px', color: '#fff' }}>${maxAllowableLoan.toLocaleString()}</span>
              </div>
              <div style={{ background: '#0d1117', padding: '8px', border: '1px solid #30363d', borderRadius: '4px' }}>
                <span style={{ ...mono, fontSize: '9px', color: '#8b949e', display: 'block' }}>BASE RATE</span>
                <span style={{ ...mono, fontSize: '16px', color: '#fff' }}>{isStolen ? 'N/A' : `${finalRate}%`}</span>
              </div>
              <div style={{ background: '#0d1117', padding: '8px', border: '1px solid #30363d', borderRadius: '4px' }}>
                <span style={{ ...mono, fontSize: '9px', color: '#8b949e', display: 'block' }}>SALVAGE EST</span>
                <span style={{ ...mono, fontSize: '16px', color: '#fff' }}>${calculatedResidual.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ background: '#0d1117', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', ...mono, fontSize: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ color: activeVehicle?.documents?.zimra === 'verified' ? terminalGreen : bloombergAmber }}>
                  [{activeVehicle?.documents?.zimra === 'verified' ? 'OK' : 'ERR'}] ZIMRA SYNC
                </div>
                <div style={{ color: activeVehicle?.documents?.bluebook === 'verified' ? terminalGreen : bloombergAmber }}>
                  [{activeVehicle?.documents?.bluebook === 'verified' ? 'OK' : 'ERR'}] CVR DEED
                </div>
                <div style={{ color: activeVehicle?.documents?.cid === 'verified' ? terminalGreen : bloombergAmber }}>
                  [{activeVehicle?.documents?.cid === 'verified' ? 'OK' : 'ERR'}] CID ANTI-THEFT
                </div>
                <div style={{ color: activeVehicle?.documents?.vid === 'verified' ? terminalGreen : bloombergAmber }}>
                  [{activeVehicle?.documents?.vid === 'verified' ? 'OK' : 'ERR'}] VID FITNESS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Calculator */}
        <div style={{ background: '#11141a', border: '1px solid #30363d', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: bloombergAmber, marginBottom: '16px', borderBottom: '1px solid #30363d', paddingBottom: '8px' }}>
            <Calculator size={16} /> <span style={{ fontSize: '12px', fontWeight: 700 }}>YIELD PROJECTION</span>
          </div>

          {isStolen ? (
            <div style={{ background: `${teslaRed}22`, border: `1px solid ${teslaRed}`, padding: '16px', borderRadius: '4px', textAlign: 'center', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <AlertTriangle size={24} color={teslaRed} style={{ margin: '0 auto 8px' }} />
              <div style={{ ...mono, color: teslaRed, fontSize: '12px', fontWeight: 'bold' }}>ASSET SEIZED/STOLEN</div>
              <div style={{ ...mono, color: teslaRed, fontSize: '10px', marginTop: '4px' }}>UNDERWRITING TERMINATED</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ ...mono, fontSize: '9px', color: '#8b949e', display: 'block', marginBottom: '4px' }}>REQUESTED PRINCIPAL (USD)</label>
                  <input 
                    type="number" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '6px 8px', borderRadius: '4px', ...mono, fontSize: '14px', outline: 'none' }}
                    max={maxAllowableLoan}
                  />
                </div>
                <div>
                  <label style={{ ...mono, fontSize: '9px', color: '#8b949e', display: 'block', marginBottom: '4px' }}>TERM (MONTHS)</label>
                  <select 
                    value={loanDuration} 
                    onChange={(e) => setLoanDuration(e.target.value)}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '6px 8px', borderRadius: '4px', ...mono, fontSize: '14px', outline: 'none' }}
                  >
                    <option value="12">12 MO</option>
                    <option value="24">24 MO</option>
                    <option value="36">36 MO</option>
                    <option value="48">48 MO</option>
                    <option value="60">60 MO</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ ...mono, fontSize: '10px', color: '#8b949e' }}>LTV RATIO</span>
                  <span style={{ ...mono, fontSize: '11px', color: bloombergAmber }}>{((parseFloat(loanAmount) || 0) / (activeVehicle?.price || 1) * 100).toFixed(1)}% / {ltv}% MAX</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #30363d', paddingBottom: '8px' }}>
                  <span style={{ ...mono, fontSize: '10px', color: '#8b949e' }}>APR (RISK ADJ)</span>
                  <span style={{ ...mono, fontSize: '11px', color: cyanNeon }}>{finalRate}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ ...mono, fontSize: '10px', color: '#8b949e' }}>EST. INSTALLMENT</span>
                  <span style={{ ...mono, fontSize: '20px', color: terminalGreen, fontWeight: 'bold' }}>${monthlyPayment.toLocaleString()} <span style={{ fontSize: '10px', color: '#8b949e' }}>/MO</span></span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

