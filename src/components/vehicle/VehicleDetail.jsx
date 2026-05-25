import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import { 
  Shield, CheckCircle, AlertTriangle, Play, ChevronLeft, ChevronRight, 
  Rotate3d, Maximize2, ShieldCheck, Activity, Award, Gauge, Fuel, Wrench, 
  Zap, Calendar, Lock, Image as ImageIcon
} from 'lucide-react';

export default function VehicleDetail({ defaultVin = null }) {
  const { vin: paramVin } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicles, getHistoryReportByVin, getReportSnapshot } = useApp();

  const vin = paramVin || location.state?.vin || defaultVin;
  const vehicle = vehicles.find(v => v.vin === vin) || vehicles[0]; // fallback

  const [activeTab, setActiveTab] = useState('gallery'); // gallery, 360, damage
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock multi-images based on make/model
  const images = [
    `/vehicles/${vehicle?.make?.toLowerCase()}_${vehicle?.model?.toLowerCase().replace(' ', '_')}.jpg`,
    `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200`,
    `https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200`,
    `https://images.unsplash.com/photo-1503376713444-245f448c484b?auto=format&fit=crop&q=80&w=1200`
  ];

  if (!vehicle) return <div className="p-8 text-center text-white">Vehicle not found</div>;

  const reportSnapshot = getReportSnapshot ? getReportSnapshot(vehicle.vin) : {};
  const trustColor = vehicle.trustIndex >= 80 ? '#10b981' : vehicle.trustIndex >= 60 ? '#f59e0b' : '#ef4444';

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--theme-bg, #070a13)',
      color: 'var(--text-white, #fff)',
      fontFamily: 'var(--font-primary, system-ui, sans-serif)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(7, 10, 19, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '8px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted, #9ca3af)', fontSize: '14px', marginTop: '4px' }}>
              VIN: <span style={{ fontFamily: 'monospace', color: 'var(--cyan-primary, #0ea5e9)' }}>{vehicle.vin}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted, #9ca3af)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dealership Price</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-white, #fff)', lineHeight: 1 }}>${vehicle.price.toLocaleString()}</span>
          </div>
          <button style={{
            background: 'var(--cyan-primary, #0ea5e9)',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)'
          }}>
            <Lock size={18} /> Reserve & Lock
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', flex: 1 }}>
        {/* Left: Immersive Media */}
        <div style={{ position: 'relative', background: '#000', display: 'flex', flexDirection: 'column' }}>
          
          {/* Media Viewport */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '60vh' }}>
            {activeTab === 'gallery' && (
              <>
                <img 
                  src={images[currentImageIndex]} 
                  alt="Vehicle view" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200'; }}
                />
                
                <div style={{ position: 'absolute', top: '50%', left: '24px', transform: 'translateY(-50%)' }}>
                  <button onClick={prevImage} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                    <ChevronLeft size={24} />
                  </button>
                </div>
                <div style={{ position: 'absolute', top: '50%', right: '24px', transform: 'translateY(-50%)' }}>
                  <button onClick={nextImage} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                    <ChevronRight size={24} />
                  </button>
                </div>
              </>
            )}

            {activeTab === '360' && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #1a1f35 0%, #000 100%)' }}>
                <div style={{ textAlign: 'center' }}>
                  <Rotate3d size={64} color="rgba(255,255,255,0.2)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '24px', fontWeight: 600 }}>Interactive 360° Preview</h3>
                  <p style={{ color: 'var(--text-muted, #9ca3af)', marginTop: '8px' }}>Drag to rotate the vehicle exterior</p>
                  <img src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800" alt="360 placeholder" style={{ width: '100%', maxWidth: '600px', opacity: 0.5, mixBlendMode: 'screen', filter: 'blur(2px)' }} />
                </div>
              </div>
            )}

            {activeTab === 'damage' && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', position: 'relative' }}>
                <img src={images[0]} alt="Damage map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'grayscale(100%)' }} />
                
                {/* Damage hotspots */}
                <div style={{ position: 'absolute', top: '40%', left: '30%', cursor: 'pointer' }} title="Minor scratch on front left fender">
                  <span className="pulse-glow" style={{ width: '24px', height: '24px', background: 'rgba(239, 68, 68, 0.8)', border: '2px solid #ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <AlertTriangle size={12} />
                  </span>
                </div>
                
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(8px)' }}>
                  <h4 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} color="#ef4444" /> AI Damage Analysis</h4>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-muted, #9ca3af)', fontSize: '13px' }}>1 minor scratch detected. 0 structural issues.</p>
                </div>
              </div>
            )}
            
            {/* Viewport Overlay Controls */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', display: 'flex', gap: '12px', zIndex: 10 }}>
              <button 
                onClick={() => setActiveTab('gallery')}
                style={{ background: activeTab === 'gallery' ? 'var(--cyan-primary, #0ea5e9)' : 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}
              >
                <ImageIcon size={16} /> Gallery
              </button>
              <button 
                onClick={() => setActiveTab('360')}
                style={{ background: activeTab === '360' ? 'var(--cyan-primary, #0ea5e9)' : 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}
              >
                <Rotate3d size={16} /> 360° View
              </button>
              <button 
                onClick={() => setActiveTab('damage')}
                style={{ background: activeTab === 'damage' ? '#ef4444' : 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}
              >
                <AlertTriangle size={16} /> Damage Map
              </button>
            </div>
            
            <button style={{ position: 'absolute', bottom: '24px', right: '24px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
              <Maximize2 size={20} />
            </button>
          </div>
          
          {/* Thumbnails (Only in Gallery mode) */}
          {activeTab === 'gallery' && (
            <div style={{ display: 'flex', gap: '12px', padding: '24px', background: 'linear-gradient(to top, #000 0%, transparent 100%)', position: 'absolute', bottom: 0, left: 0, right: 0, pointerEvents: 'none' }}>
              <div style={{ flex: 1 }} /> {/* Spacer */}
              <div style={{ display: 'flex', gap: '12px', pointerEvents: 'auto', overflowX: 'auto', paddingBottom: '8px', className: 'hide-scrollbar' }}>
                {images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{ 
                      width: '80px', 
                      height: '60px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      border: currentImageIndex === idx ? '2px solid var(--cyan-primary, #0ea5e9)' : '2px solid transparent',
                      opacity: currentImageIndex === idx ? 1 : 0.6,
                      transition: 'all 0.2s'
                    }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200'; }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Deep Trust Layers & Telemetry */}
        <div style={{ background: 'rgba(11, 16, 32, 0.95)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          <div style={{ padding: '32px 24px' }}>
            {/* Trust Ring Hero */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle 
                    cx="40" cy="40" r="36" 
                    fill="transparent" 
                    stroke={trustColor} 
                    strokeWidth="6" 
                    strokeDasharray={2 * Math.PI * 36} 
                    strokeDashoffset={(2 * Math.PI * 36) * (1 - (vehicle.trustIndex / 100))} 
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{vehicle.trustIndex}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted, #9ca3af)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Trust</span>
                </div>
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600, color: '#fff' }}>CarUp AI Verdict</h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted, #9ca3af)' }}>
                  {vehicle.trustIndex >= 80 ? 'Highly recommended. Impeccable history.' : vehicle.trustIndex >= 60 ? 'Standard condition. Minor flags to review.' : 'Caution advised. Significant flags present.'}
                </p>
              </div>
            </div>

            {/* Quick Badges */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {vehicle.trustIndex >= 50 && (
                <Badge variant="primary" style={{ padding: '8px 12px', fontSize: '13px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--cyan-primary, #0ea5e9)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                  <Shield size={14} /> SafePay Eligible
                </Badge>
              )}
              {vehicle.documents?.vid === 'verified' && (
                <Badge variant="high" style={{ padding: '8px 12px', fontSize: '13px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <Award size={14} /> VID Verified
                </Badge>
              )}
            </div>

            {/* Specs Grid */}
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted, #9ca3af)', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Core Specifications</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #9ca3af)', marginBottom: '8px' }}>
                  <Gauge size={16} /> <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Mileage</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{vehicle.mileage.toLocaleString()} km</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #9ca3af)', marginBottom: '8px' }}>
                  <Fuel size={16} /> <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Fuel Type</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{vehicle.fuel}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #9ca3af)', marginBottom: '8px' }}>
                  <Calendar size={16} /> <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Year</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{vehicle.year}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #9ca3af)', marginBottom: '8px' }}>
                  <Wrench size={16} /> <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Condition</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>Used</div>
              </div>
            </div>

            {/* Security & History Block */}
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted, #9ca3af)', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>CarUp Passport Summary</h4>
            
            <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ background: reportSnapshot?.theftStatus === 'flagged' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '8px' }}>
                  <ShieldCheck size={20} color={reportSnapshot?.theftStatus === 'flagged' ? '#ef4444' : '#10b981'} />
                </div>
                <div>
                  <h5 style={{ margin: '0 0 4px', fontSize: '15px', color: '#fff' }}>Theft & Title Check</h5>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted, #9ca3af)' }}>
                    {reportSnapshot?.theftStatus === 'flagged' ? 'Warning: Interpol/ZRP flag detected.' : 'Clear. No active police reports.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ background: reportSnapshot?.mileageStatus === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '8px' }}>
                  <Activity size={20} color={reportSnapshot?.mileageStatus === 'warning' ? '#f59e0b' : '#10b981'} />
                </div>
                <div>
                  <h5 style={{ margin: '0 0 4px', fontSize: '15px', color: '#fff' }}>Odometer Integrity</h5>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted, #9ca3af)' }}>
                    {reportSnapshot?.mileageStatus === 'warning' ? 'Anomaly detected across records.' : 'Consistent mileage progression.'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/passport', { state: { vin: vehicle.vin } })}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                View Full Digital Passport <ChevronRight size={16} />
              </button>
            </GlassCard>

          </div>
        </div>
      </div>
    </div>
  );
}
