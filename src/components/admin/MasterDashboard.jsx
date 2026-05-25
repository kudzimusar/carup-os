import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, ShieldAlert, DollarSign, Database, 
  Terminal, Globe, ShieldCheck, AlertTriangle, 
  Unlock, RefreshCcw, Cpu, Fingerprint
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

export default function MasterDashboard() {
  const { 
    vehicles, 
    escrows, 
    adminMetrics, 
    updateEscrowStatus, 
    toggleVehicleStolen,
    verifyDocumentDirectly
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute platform yields and stats
  const activeEscrows = escrows.filter(e => e.status !== 'Settled to Seller' && e.status !== 'Refunded');
  const totalEscrowValue = escrows.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const activeEscrowValue = activeEscrows.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const disputedEscrows = escrows.filter(e => e.status === 'Disputed' || e.status === 'Fraud Flag');

  // Fraud alerts: stolen vehicles, forged docs, disputed escrows
  const stolenVehicles = vehicles.filter(v => v.stolenStatus === true);
  
  const handleForceSettle = (id) => {
    if(window.confirm("WARNING: Force settle will release funds immediately. Proceed?")) {
      updateEscrowStatus(id, 'Settled to Seller');
    }
  };

  const handleResolveDispute = (id) => {
    updateEscrowStatus(id, 'Secured (Resolved)');
  };

  const handleToggleStolen = (vin, currentStatus) => {
    toggleVehicleStolen(vin, !currentStatus);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', color: 'var(--text-white)' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--theme-border)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--theme-accent)' }}>
            <Globe className="pulse-glow" size={28} />
            Global Command Center
          </h1>
          <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '12px', fontFamily: 'monospace' }}>
            CAR-UP OS / ADMIN ROOT / {currentTime}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', opacity: 0.6, textTransform: 'uppercase' }}>System Status</div>
            <div style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} className="pulse-glow" />
              OPERATIONAL
            </div>
          </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <GlassCard style={{ padding: '20px', borderLeft: '4px solid var(--theme-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Platform Yield (Fees)</div>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px', fontFamily: 'monospace' }}>
                ${adminMetrics.totalCommissions?.toLocaleString() || '0'}
              </div>
            </div>
            <DollarSign color="var(--theme-accent)" size={24} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} /> +12% from yesterday
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Escrow Value</div>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px', fontFamily: 'monospace' }}>
                ${activeEscrowValue.toLocaleString()}
              </div>
            </div>
            <Database color="#f59e0b" size={24} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.7 }}>
            Across {activeEscrows.length} pending transactions
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Fraud & Disputes</div>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px', fontFamily: 'monospace', color: (disputedEscrows.length > 0 || stolenVehicles.length > 0) ? '#ef4444' : 'inherit' }}>
                {disputedEscrows.length + stolenVehicles.length}
              </div>
            </div>
            <ShieldAlert color="#ef4444" size={24} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.7 }}>
            Requires immediate attention
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Blockchain Nodes</div>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px', fontFamily: 'monospace' }}>
                {adminMetrics.blockchainBlocks || 0}
              </div>
            </div>
            <Cpu color="#8b5cf6" size={24} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="spin-loader"><RefreshCcw size={12} /></span> Syncing ledger
          </div>
        </GlassCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* ESCROW OPERATIONS TERMINAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Terminal size={18} /> Escrow Command Terminal
          </h2>
          <GlassCard style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--theme-border)', display: 'flex', gap: '16px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--theme-accent)' }}>
              <span>USER: root</span>
              <span>ACCESS: Level 9</span>
              <span>ENCRYPTION: AES-256</span>
            </div>
            <div style={{ padding: '16px', overflowY: 'auto', maxHeight: '500px' }}>
              {escrows.length === 0 ? (
                <div style={{ opacity: 0.5, textAlign: 'center', padding: '40px 0', fontFamily: 'monospace' }}>
                  No escrow transactions found in database.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--theme-border)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <th style={{ padding: '12px 8px', textAlign: 'left' }}>TX Ref</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left' }}>Asset (VIN)</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left' }}>Amount</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Directives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escrows.map(escrow => (
                      <tr key={escrow.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover-offset">
                        <td style={{ padding: '16px 8px', fontFamily: 'monospace' }}>{escrow.id.substring(0,8)}...</td>
                        <td style={{ padding: '16px 8px', fontFamily: 'monospace', color: 'var(--theme-accent)' }}>{escrow.vin}</td>
                        <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>${escrow.amount.toLocaleString()}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <Badge variant={
                            escrow.status === 'Settled to Seller' ? 'success' : 
                            (escrow.status === 'Disputed' || escrow.status === 'Fraud Flag') ? 'danger' : 'accent'
                          }>
                            {escrow.status}
                          </Badge>
                        </td>
                        <td style={{ padding: '16px 8px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {(escrow.status === 'Disputed' || escrow.status === 'Fraud Flag') && (
                            <button 
                              onClick={() => handleResolveDispute(escrow.id)}
                              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <ShieldCheck size={12} /> Resolve
                            </button>
                          )}
                          {escrow.status !== 'Settled to Seller' && (
                            <button 
                              onClick={() => handleForceSettle(escrow.id)}
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Unlock size={12} /> Force Settle
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </GlassCard>
        </div>

        {/* FRAUD & RISK RADAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: '#ef4444' }}>
            <Fingerprint size={18} /> Threat Intelligence
          </h2>
          
          <GlassCard style={{ padding: '20px', borderTop: '2px solid #ef4444', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '550px', overflowY: 'auto' }}>
            <h3 style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '1px' }}>Flagged Assets (Stolen/Watchlist)</h3>
            
            {stolenVehicles.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                <ShieldCheck size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <div style={{ fontSize: '13px' }}>No active threat signatures detected.</div>
              </div>
            ) : (
              stolenVehicles.map(v => (
                <div key={v.vin} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} /> STOLEN FLAG ACTIVE
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '12px', marginTop: '4px' }}>{v.vin}</div>
                    </div>
                    <Badge variant="danger">INTERPOL SYNC</Badge>
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '12px' }}>
                    Asset matches active police registry theft report. Escrow locks engaged.
                  </div>
                  <button 
                    onClick={() => handleToggleStolen(v.vin, v.stolenStatus)}
                    style={{ width: '100%', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', transition: 'all 0.2s' }}
                    className="hover-offset"
                  >
                    Override / Clear Flag
                  </button>
                </div>
              ))
            )}
            
            <h3 style={{ margin: '16px 0 0', fontSize: '12px', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '1px' }}>System Diagnostics</h3>
            <div style={{ fontSize: '12px', fontFamily: 'monospace', background: '#000', padding: '12px', borderRadius: '6px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>API Gateway:</span>
                <span style={{ color: '#10b981' }}>99.9% Uptime</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>AI Inspector:</span>
                <span style={{ color: '#10b981' }}>Active (12ms latency)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>DB Sync:</span>
                <span style={{ color: '#10b981' }}>Synchronized</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
