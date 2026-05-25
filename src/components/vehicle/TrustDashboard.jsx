import React from 'react';
import GlassCard from '../ui/GlassCard';
import { ShieldCheck, AlertTriangle, Activity, Calendar, Wrench, CheckCircle, FileText, Search } from 'lucide-react';

export default function TrustDashboard({ 
  fraudProbability = 1.2, 
  inspectionConfidence = 98.5,
  timeline = [
    { type: 'imported', date: '2022-04-12', label: 'Imported via Authorized Channel', status: 'verified' },
    { type: 'registered', date: '2022-05-01', label: 'Registered Locally', status: 'verified' },
    { type: 'serviced', date: '2023-11-20', label: 'Full Service - Gutu Auto Garage', status: 'verified' },
    { type: 'inspected', date: '2024-01-15', label: 'AI Diagnostic Scan & Blueprinting', status: 'verified' }
  ]
}) {
  return (
    <div className="trust-dashboard animate-scan" style={{ marginTop: '32px', marginBottom: '32px' }}>
      <GlassCard className="glass-card-gold neon-sweep-border active-neon-sweep" style={{ padding: '32px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '32px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={36} color="var(--emerald-primary)" className="glow-emerald" />
              CarUp Trust OS
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '16px' }}>
              Cryptographic validation & autonomous AI inspection telemetry
            </p>
          </div>
          <div className="trust-score-badge trust-high glow-emerald" style={{ fontSize: '14px', padding: '8px 16px' }}>
            <Activity size={18} /> LIVE TELEMETRY
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid-2" style={{ marginBottom: '48px' }}>
          {/* Fraud Probability Metric */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--border-radius-md)', padding: '24px', border: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden' }}>
            <div className="tech-scanlines" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <AlertTriangle size={24} color={fraudProbability < 5 ? "var(--emerald-primary)" : "var(--gold-primary)"} />
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-light)' }}>Fraud Probability</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: fraudProbability < 5 ? "var(--emerald-light)" : "var(--gold-light)" }}>
                  {fraudProbability}%
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>risk factor</span>
              </div>
              <div style={{ marginTop: '20px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${fraudProbability}%`, 
                  height: '100%', 
                  background: fraudProbability < 5 ? 'var(--emerald-primary)' : 'var(--gold-primary)',
                  boxShadow: `0 0 10px ${fraudProbability < 5 ? 'var(--emerald-primary)' : 'var(--gold-primary)'}`
                }}></div>
              </div>
            </div>
          </div>

          {/* Inspection Confidence Metric */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--border-radius-md)', padding: '24px', border: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden' }}>
            <div className="tech-scanlines" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Search size={24} color="var(--blue-light)" />
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-light)' }}>Inspection Confidence</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--blue-light)' }}>
                  {inspectionConfidence}%
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ai validated</span>
              </div>
              <div style={{ marginTop: '20px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${inspectionConfidence}%`, 
                  height: '100%', 
                  background: 'var(--blue-primary)',
                  boxShadow: '0 0 10px var(--blue-primary)'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Immutable Trust Timeline */}
        <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--border-radius-md)', padding: '32px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '32px', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={22} color="var(--cyan-primary)" className="glow-cyan" /> 
            Immutable Trust Timeline
          </h3>
          
          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Timeline Vertical Track */}
            <div style={{ position: 'absolute', left: '11px', top: '14px', bottom: '14px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
            
            {timeline.map((event, index) => (
              <div key={index} style={{ position: 'relative', marginBottom: index === timeline.length - 1 ? 0 : '40px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                
                {/* Timeline Node */}
                <div style={{ 
                  position: 'absolute', 
                  left: '-28px', 
                  top: '4px',
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-solid-card)',
                  border: `2px solid ${event.status === 'verified' ? 'var(--emerald-primary)' : 'var(--gold-primary)'}`,
                  boxShadow: `0 0 12px ${event.status === 'verified' ? 'var(--emerald-primary)' : 'var(--gold-primary)'}`,
                  zIndex: 2
                }}></div>
                
                {/* Date */}
                <div style={{ flexShrink: 0, color: 'var(--text-muted-dark)', fontSize: '15px', fontWeight: '600', width: '110px', paddingTop: '2px', fontFamily: 'var(--font-heading)' }}>
                  {event.date}
                </div>
                
                {/* Event Card */}
                <div style={{ flexGrow: 1, background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-glass)', minWidth: '250px', transition: 'var(--transition-smooth)', cursor: 'default' }}
                     onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--theme-border)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '50%' }}>
                        {event.type === 'imported' && <FileText size={20} color="var(--cyan-light)" />}
                        {event.type === 'registered' && <CheckCircle size={20} color="var(--emerald-light)" />}
                        {event.type === 'serviced' && <Wrench size={20} color="var(--gold-light)" />}
                        {event.type === 'inspected' && <Search size={20} color="var(--blue-light)" />}
                      </div>
                      <div>
                        <div style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-light)', marginBottom: '4px' }}>{event.label}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted-dark)' }}>{event.type.toUpperCase()} RECORD</div>
                      </div>
                    </div>
                    {event.status === 'verified' && (
                      <span className="trust-score-badge trust-high" style={{ fontSize: '12px', padding: '4px 10px', letterSpacing: '0.05em' }}>
                        <ShieldCheck size={14} /> VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
