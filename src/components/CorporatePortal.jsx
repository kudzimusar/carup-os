import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Briefcase, ShieldAlert, TrendingUp, DollarSign, Calculator, Percent, Award, Landmark, ShieldCheck } from 'lucide-react'

export default function CorporatePortal() {
  const { vehicles, adminMetrics } = useApp()
  const [selectedVin, setSelectedVin] = useState(vehicles[0]?.vin || '')
  const [loanAmount, setLoanAmount] = useState('15000')
  const [loanDuration, setLoanDuration] = useState('36') // in months

  const activeVehicle = vehicles.find(v => v.vin === selectedVin)

  // Residual and LTV calculations based on vehicle's trust index
  const trust = activeVehicle ? activeVehicle.trustIndex : 50
  const isStolen = activeVehicle ? activeVehicle.stolen : false

  // Formulas
  const ltv = isStolen ? 0 : Math.min(85, Math.max(10, Math.round(trust * 0.95)))
  const maxAllowableLoan = activeVehicle ? Math.round(activeVehicle.price * (ltv / 100)) : 0
  const calculatedResidual = activeVehicle ? Math.round(activeVehicle.price * (trust / 120)) : 0
  const baseRate = 8.5 // 8.5% base interest rate in Zimbabwe USD loans
  const riskPremium = Math.max(1.5, 12 - (trust / 10)) // higher risk premium for lower trust index
  const finalRate = isStolen ? 0 : parseFloat((baseRate + riskPremium).toFixed(2))

  // Monthly payment calculation
  const p = parseFloat(loanAmount) || 0
  const r = (finalRate / 100) / 12
  const n = parseInt(loanDuration) || 12
  const monthlyPayment = (r > 0 && n > 0) ? Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0

  // Calculate dynamic custom yields from verified ZIMRA documents
  const zimraYield = vehicles.reduce((acc, v) => acc + (v.documents.zimra === 'verified' ? v.price * 0.15 : 0), 0)

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Live System Telemetry Metrics */}
      <div className="glass-card" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        border: '1px solid rgba(59, 130, 246, 0.25)', 
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.05)',
        padding: '20px'
      }}>
        {/* Active sequential Block Heights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} style={{ color: '#60a5fa' }} /> Blockchain Block Height
          </span>
          <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
            #{adminMetrics?.blockchainBlocks || 0}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--emerald-light)' }}>
            Sequential notarization active
          </span>
        </div>

        {/* SafePay Escrow transaction volumes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={14} style={{ color: '#60a5fa' }} /> SafePay Escrow Volume
          </span>
          <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
            {adminMetrics?.escrows || 0} Tx
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Active secure contracts
          </span>
        </div>

        {/* Split commissions pools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={14} style={{ color: '#60a5fa' }} /> Split Commissions Pool
          </span>
          <h4 style={{ fontSize: '24px', color: 'var(--gold-light)', fontWeight: 800 }}>
            USD ${(adminMetrics?.totalCommissions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Dynamic 1.2% escrow splits
          </span>
        </div>

        {/* ZIMRA custom splitter yields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Landmark size={14} style={{ color: '#60a5fa' }} /> ZIMRA Splitter Yields
          </span>
          <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
            USD ${zimraYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Dynamic custom tariff yields
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '32px' }}>
        
        {/* Risk Assessment Desk */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(59, 130, 246, 0.25)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.05)' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
              <Briefcase size={22} /> Risk Analyzer & Auditing
            </h3>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              Verify collateral assets, trust indices, and historical registry logs for financial underwriting.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Select Underwriting Asset:</label>
            <select 
              value={selectedVin} 
              onChange={(e) => setSelectedVin(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            >
              {vehicles.map(v => (
                <option key={v.vin} value={v.vin}>
                  {v.year} {v.make} {v.model} (USD ${(v.price || 0).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {activeVehicle && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Risk Tier Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <span className="text-muted" style={{ fontSize: '13px' }}>Collateral Health Rating</span>
                {isStolen ? (
                  <span className="badge-glow" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid var(--red-primary)' }}>
                    UNACCEPTABLE (STOLEN)
                  </span>
                ) : trust >= 80 ? (
                  <span className="badge-glow" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-light)', border: '1px solid var(--emerald-primary)' }}>
                    TIER 1 (AAA TRUST)
                  </span>
                ) : trust >= 50 ? (
                  <span className="badge-glow" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--gold-light)', border: '1px solid var(--gold-primary)' }}>
                    TIER 2 (STANDARD)
                  </span>
                ) : (
                  <span className="badge-glow" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid var(--red-primary)' }}>
                    TIER 3 (SUBPRIME RISK)
                  </span>
                )}
              </div>

              {/* Asset Audit Specs */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className="text-muted" style={{ fontSize: '12px' }}>LTV Limit Cap</span>
                  <h4 style={{ fontSize: '20px', color: isStolen ? 'var(--red-primary)' : '#60a5fa', marginTop: '4px' }}>
                    {ltv}%
                  </h4>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '12px' }}>Max Allowable Credit</span>
                  <h4 style={{ fontSize: '20px', color: '#e2e8f0', marginTop: '4px' }}>
                    USD ${maxAllowableLoan.toLocaleString()}
                  </h4>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '12px' }}>Underwritten Base Rate</span>
                  <h4 style={{ fontSize: '20px', color: '#e2e8f0', marginTop: '4px' }}>
                    {isStolen ? 'N/A' : `${finalRate}%`}
                  </h4>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '12px' }}>Est. Residual Salvage</span>
                  <h4 style={{ fontSize: '20px', color: '#e2e8f0', marginTop: '4px' }}>
                    USD ${calculatedResidual.toLocaleString()}
                  </h4>
                </div>
              </div>

              {/* Verification checklist summaries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="text-muted" style={{ fontSize: '13px' }}>Collateral Checklists:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: activeVehicle.documents.zimra === 'verified' ? 'var(--emerald-light)' : 'var(--text-muted)' }}>
                    {activeVehicle.documents.zimra === 'verified' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />} ZIMRA Customs Split
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: activeVehicle.documents.bluebook === 'verified' ? 'var(--emerald-light)' : 'var(--text-muted)' }}>
                    {activeVehicle.documents.bluebook === 'verified' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />} CVR Deed Certificate
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: activeVehicle.documents.cid === 'verified' ? 'var(--emerald-light)' : 'var(--text-muted)' }}>
                    {activeVehicle.documents.cid === 'verified' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />} CID Anti-Theft Status
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: activeVehicle.documents.vid === 'verified' ? 'var(--emerald-light)' : 'var(--text-muted)' }}>
                    {activeVehicle.documents.vid === 'verified' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />} VID Fitness Deed
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Residual Underwriting Calculator */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(59, 130, 246, 0.25)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.05)' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
              <Calculator size={22} /> Loan-to-Collateral Calculator
            </h3>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              Simulate credit margins, monthly repayments, and structured risk adjustments for financing.
            </p>
          </div>

          {isStolen ? (
            <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <ShieldAlert size={36} />
              <h4 style={{ color: '#fff', marginTop: '8px' }}>Asset Flagged As Stolen</h4>
              <p style={{ fontSize: '13px' }}>This asset has been flagged as stolen by law enforcement. Underwriting, escrow funding, and collateral financing are strictly frozen.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Requested Loan (USD):</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }}>$</span>
                    <input 
                      type="number" 
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '28px' }}
                      max={maxAllowableLoan}
                    />
                  </div>
                  <span className="text-muted" style={{ fontSize: '11px' }}>
                    Max allowable: USD ${maxAllowableLoan.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Duration (Months):</label>
                  <select 
                    value={loanDuration} 
                    onChange={(e) => setLoanDuration(e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  >
                    <option value="12">12 Months (1 Year)</option>
                    <option value="24">24 Months (2 Years)</option>
                    <option value="36">36 Months (3 Years)</option>
                    <option value="48">48 Months (4 Years)</option>
                    <option value="60">60 Months (5 Years)</option>
                  </select>
                </div>
              </div>

              {/* Calculation Outputs */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Collateral Value:</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>
                    USD ${(activeVehicle ? activeVehicle.price : 0).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Financing Ratio (LTV):</span>
                  <span style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                    {((parseFloat(loanAmount) || 0) / (activeVehicle ? activeVehicle.price : 1) * 100).toFixed(1)}% (LTV Limit: {ltv}%)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Risk Adjusted APR:</span>
                  <span style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                    {finalRate}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-white)' }}>Est. Monthly Installment:</span>
                  <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--blue-primary)' }}>
                    USD ${monthlyPayment.toLocaleString()} / mo
                  </span>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.25)', fontSize: '12px', color: '#93c5fd', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Percent size={14} style={{ flexShrink: 0 }} />
                <span>Underwritten via dynamic CarUp Trust Index scoring. Recomputations of parts integrity or document sync affect interest yields in real-time.</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
