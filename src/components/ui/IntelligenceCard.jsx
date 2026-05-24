import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import GlassCard from './GlassCard';
import Badge from './Badge';
import { Shield, Gauge, Fuel, CheckCircle, ShoppingCart, Zap, ShieldAlert, Activity, Cpu } from 'lucide-react';

export default function IntelligenceCard({ vehicle }) {
  const navigate = useNavigate();
  const { cartItems, globalLocks, addToCart, removeFromCart, comparedVins, addToCompare, removeFromCompare } = useApp();

  const isLocked = globalLocks?.some(l => l.vin === vehicle.vin);
  const isReserved = cartItems?.includes(vehicle.vin);
  const isCompared = comparedVins?.includes(vehicle.vin);

  const getTrustColor = (score) => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 50) return '#fbbf24'; // amber
    return '#ef4444'; // red
  };

  const trustColor = getTrustColor(vehicle.trustIndex);
  
  // SVG Gauge Calculations
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (vehicle.trustIndex / 100) * circumference;

  // AI Summary generation based on trust index
  const getAiSummary = (score) => {
    if (score >= 80) return "Low maintenance risk • Strong resale confidence";
    if (score >= 50) return "Moderate risk • Standard maintenance expected";
    return "High risk • Extensive inspection required";
  };

  const renderVehicleImage = () => {
    if (vehicle.image) {
      return (
        <div style={{
          height: '180px',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.03)'
        }}>
          <img src={vehicle.image} alt={`${vehicle.year} ${vehicle.make}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Quick Telemetry Hover Overlay */}
          <div className="telemetry-overlay" style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            opacity: 0, transition: 'opacity 0.3s ease', zIndex: 10
          }}>
            <Activity size={24} color={trustColor} style={{ marginBottom: '8px' }} />
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Live Telemetry Active</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Engine Health: Optimal</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Transmission: Verified</span>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        background: `linear-gradient(135deg, rgba(22, 31, 48, 0.9), rgba(11, 15, 25, 0.95))`,
        height: '180px',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.03)'
      }}>
        <svg width="220" height="90" viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
        {/* Quick Telemetry Hover Overlay */}
        <div className="telemetry-overlay" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          opacity: 0, transition: 'opacity 0.3s ease', zIndex: 10
        }}>
          <Activity size={24} color={trustColor} style={{ marginBottom: '8px' }} />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Live Telemetry Active</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Chassis Scan: Clear</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .intelligence-card {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            background: linear-gradient(145deg, rgba(22, 27, 46, 0.4), rgba(11, 16, 32, 0.6)) !important;
          }
          .intelligence-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 40px rgba(14, 165, 233, 0.15), 0 0 0 1px rgba(14, 165, 233, 0.3) !important;
          }
          .trust-score-ring {
            stroke-dasharray: 100;
            stroke-dashoffset: ${100 - (vehicle.trustIndex || 0)};
            transition: stroke-dashoffset 1s ease-out;
          }
          .card-action-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 8px;
            color: var(--text-muted);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .card-action-btn:hover {
            background: rgba(14, 165, 233, 0.1);
            color: var(--cyan-primary);
            border-color: rgba(14, 165, 233, 0.3);
          }
          .intelligence-card:focus-visible,
          .btn-secondary:focus-visible {
            outline: 2px solid var(--cyan-primary, #0ea5e9) !important;
            outline-offset: 2px !important;
          }
        `}
      </style>

      <GlassCard 
        className="intelligence-card" 
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer', padding: '16px' }} 
        onClick={() => navigate('/passport', { state: { vin: vehicle.vin } })}
        aria-label={`View intelligence report for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      >
        {renderVehicleImage()}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '4px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              {vehicle.year} {vehicle.make}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{vehicle.model}</p>
          </div>
          
          {/* Telemetry Trust Ring */}
          <div 
            style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            role="img"
            aria-label={`Trust index score: ${vehicle.trustIndex} out of 100`}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 6px ${trustColor}40)` }} aria-hidden="true">
              <circle cx="24" cy="24" r={radius} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <circle 
                cx="24" cy="24" r={radius} 
                fill="transparent" 
                stroke={trustColor} 
                strokeWidth="4" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{vehicle.trustIndex}</span>
            </div>
          </div>
        </div>

        {/* AI Summary Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px' }}>
          <Cpu size={16} color="var(--cyan-primary)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-white)' }}>AI Analysis:</span> {getAiSummary(vehicle.trustIndex)}
          </span>
        </div>

        {/* Badges: SafePay & Mechanic Verified */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {vehicle.trustIndex >= 50 && ( // Simulating SafePay applicable
            <Badge variant="primary" style={{ padding: '4px 8px', fontSize: '12px', gap: '4px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--cyan-primary)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <Shield size={12} /> SafePay Shielded
            </Badge>
          )}
          {vehicle.documents?.vid === 'verified' && ( // Simulating Mechanic Verified from VID docs
            <Badge variant="high" style={{ padding: '4px 8px', fontSize: '12px', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-primary)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <CheckCircle size={12} /> Mechanic Verified
            </Badge>
          )}
        </div>

        {/* Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Gauge size={14} color="var(--cyan-primary)" /> <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Fuel size={14} color="var(--cyan-primary)" /> <span>{vehicle.fuel}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.05em' }}>USD PRICE</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-white)' }}>${vehicle.price.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-secondary" 
              style={{ padding: '8px', fontSize: '12px', borderRadius: '8px' }}
              onClick={(e) => {
                e.stopPropagation();
                isCompared ? removeFromCompare(vehicle.vin) : addToCompare(vehicle.vin);
              }}
              title={isCompared ? "Remove from Compare" : "Add to Compare"}
              aria-label={isCompared ? `Remove ${vehicle.year} ${vehicle.make} from comparison` : `Add ${vehicle.year} ${vehicle.make} to comparison`}
            >
              <Zap size={14} color={isCompared ? 'var(--cyan-primary)' : 'currentColor'} aria-hidden="true" />
            </button>
            <button 
              className="btn-secondary" 
              disabled={isLocked}
              style={{ 
                padding: '8px 12px', 
                fontSize: '12px', 
                borderRadius: '8px',
                gap: '6px',
                color: isLocked ? '#ef4444' : undefined,
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isLocked) return;
                isReserved ? removeFromCart(vehicle.vin) : addToCart(vehicle.vin);
              }}
              aria-label={isLocked ? `${vehicle.year} ${vehicle.make} is currently locked` : isReserved ? `Remove ${vehicle.year} ${vehicle.make} from cart` : `Reserve ${vehicle.year} ${vehicle.make} for checkout`}
            >
              {isLocked ? <ShieldAlert size={14} aria-hidden="true" /> : <ShoppingCart size={14} aria-hidden="true" />} 
              {isLocked ? 'Locked' : (isReserved ? 'Reserved' : 'Reserve')}
            </button>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
