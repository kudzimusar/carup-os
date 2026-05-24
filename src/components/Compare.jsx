import React from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from './ui/GlassCard';
import Badge from './ui/Badge';
import { Shield, Gauge, Fuel, CheckCircle, XCircle, ArrowLeft, Trash2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Compare() {
  const { vehicles, comparedVins, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  const comparedVehicles = vehicles.filter(v => comparedVins.includes(v.vin));



  const calculateDutyEstimate = (price) => {
    // Rough estimate: 40% of value for duty + VAT
    return Math.round(price * 0.4);
  };

  const getTelemetry = (vin) => {
    // Deterministic pseudo-random based on VIN
    let hash = 0;
    for (let i = 0; i < vin.length; i++) {
      hash = vin.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    
    return {
      engineHealth: 75 + (seed % 25), // 75-99
      batteryStatus: 60 + ((seed >> 2) % 40), // 60-99
      transmissionHealth: 80 + ((seed >> 4) % 20), // 80-99
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--emerald-primary)';
    if (score >= 50) return 'var(--gold-primary)';
    return 'var(--red-primary)';
  };

  const ProgressBar = ({ label, value, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>{label}</span>
        <span style={{ color: color, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ 
        height: '6px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '3px', 
        overflow: 'hidden' 
      }}>
        <div style={{ 
          width: `${value}%`, 
          height: '100%', 
          background: color,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 1s ease-in-out'
        }} />
      </div>
    </div>
  );

  if (comparedVehicles.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <h2 style={{ fontSize: '24px' }}>No vehicles selected for comparison</h2>
        <p style={{ color: 'var(--text-muted)' }}>Go to the marketplace to add vehicles to compare.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Marketplace</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Compare Intelligence</h1>
        </div>
        <button className="btn-secondary" onClick={clearCompare} style={{ gap: '8px' }}>
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${comparedVehicles.length}, 1fr)`, 
        gap: '24px',
        overflowX: 'auto',
        paddingBottom: '16px'
      }}>
        {comparedVehicles.map(vehicle => (
          <GlassCard key={vehicle.vin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '280px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                height: '140px', 
                background: `linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`, 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '16px'
              }}>
                <svg width="120" height="50" viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 55 C 30 52, 45 40, 60 38 C 75 36, 110 36, 125 36 C 140 36, 155 35, 170 42 C 185 46, 200 52, 205 58 C 210 62, 212 66, 208 72 C 200 75, 20 75, 12 72 C 8 68, 10 58, 20 55 Z" 
                        fill="none" 
                        stroke="#475569" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" />
                  <path d="M68 38 L 85 24 C 90 20, 140 20, 145 24 L 165 40" 
                        stroke="var(--theme-accent)" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeDasharray="4 2" />
                  <circle cx="50" cy="70" r="14" fill="#070a13" stroke="#94a3b8" strokeWidth="3" />
                  <circle cx="165" cy="70" r="14" fill="#070a13" stroke="#94a3b8" strokeWidth="3" />
                </svg>
              </div>
              <button 
                className="btn-icon" 
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)' }}
                onClick={() => removeFromCompare(vehicle.vin)}
              >
                <XCircle size={18} color="var(--red-primary)" />
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{vehicle.year} {vehicle.make}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{vehicle.model}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Price</span>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>${vehicle.price.toLocaleString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Est. Import Duty</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cyan-primary)' }}>+${calculateDutyEstimate(vehicle.price).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Mileage</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                  <Gauge size={16} /> {vehicle.mileage.toLocaleString()} km
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Fuel Type</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                  <Fuel size={16} /> {vehicle.fuel}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Engine No</span>
                <span style={{ fontWeight: 500 }}>{vehicle.engineNo}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Transmission</span>
                <span style={{ fontWeight: 500 }}>{vehicle.transmission}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Seller Type</span>
                <span style={{ fontWeight: 500, textAlign: 'right' }}>{vehicle.sellerType}</span>
              </div>

              <div style={{ 
                marginTop: '8px', 
                paddingTop: '16px', 
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Activity size={16} color="var(--cyan-primary)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnostics & Trust</span>
                </div>
                
                {(() => {
                  const telemetry = getTelemetry(vehicle.vin);
                  return (
                    <>
                      <ProgressBar label="Trust Index" value={vehicle.trustIndex} color={getScoreColor(vehicle.trustIndex)} />
                      <ProgressBar label="Engine Health" value={telemetry.engineHealth} color={getScoreColor(telemetry.engineHealth)} />
                      <ProgressBar label="Transmission" value={telemetry.transmissionHealth} color={getScoreColor(telemetry.transmissionHealth)} />
                      <ProgressBar label="Battery Status" value={telemetry.batteryStatus} color={getScoreColor(telemetry.batteryStatus)} />
                    </>
                  );
                })()}
              </div>

            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/passport', { state: { vin: vehicle.vin } })}
              >
                View Digital Passport
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
