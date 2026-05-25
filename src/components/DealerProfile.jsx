import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, MapPin, Gauge, Fuel, CheckCircle, ArrowLeft, Star, Phone, Mail, Award, Building, CreditCard } from 'lucide-react';

const TrustGauge = ({ score }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let color = 'var(--danger-red, #ef4444)';
  if (score >= 80) color = 'var(--emerald-primary, #10b981)';
  else if (score >= 50) color = 'var(--gold-primary, #fbbf24)';
  
  return (
    <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="90" height="90" style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 4px ${color})` }}>
        <circle
          cx="45" cy="45" r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="45" cy="45" r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff', textShadow: `0 0 10px ${color}` }}>{score}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: 600 }}>TRUST</span>
      </div>
    </div>
  );
};

export default function DealerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles } = useApp();

  // Decode dealer id if it was URL encoded
  const dealerName = decodeURIComponent(id || '');

  // Filter inventory for this specific dealer
  const dealerInventory = useMemo(() => {
    return vehicles.filter(v => v.sellerName?.toLowerCase() === dealerName.toLowerCase());
  }, [vehicles, dealerName]);

  // Calculate dealer trust score based on average trust index of their inventory
  // If no inventory, default to 0
  const trustScore = useMemo(() => {
    if (dealerInventory.length === 0) return 0;
    const totalTrust = dealerInventory.reduce((acc, v) => acc + (v.trustIndex || 0), 0);
    return Math.round(totalTrust / dealerInventory.length);
  }, [dealerInventory]);

  const getTrustBadgeClass = (score) => {
    if (score >= 80) return 'trust-high';
    if (score >= 50) return 'trust-mid';
    return 'trust-low';
  };

  const renderVehicleImage = (color, make) => {
    return (
      <div style={{
        height: '180px',
        borderRadius: '12px',
        background: `linear-gradient(45deg, ${color.split(' ')[0].toLowerCase() === 'pearl' ? '#f0f0f0' : color.split(' ')[0].toLowerCase() || '#333'}, #1a1a2e)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9))'
        }} />
        <span style={{ 
          position: 'absolute', 
          bottom: '16px', 
          left: '16px',
          fontWeight: 800, 
          fontSize: '24px', 
          color: 'rgba(255,255,255,0.95)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          {make}
        </span>
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          padding: '4px 8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-primary)', boxShadow: '0 0 8px var(--emerald-primary)' }} />
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>AVAILABLE</span>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header section */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => navigate(-1)} className="btn-secondary hover-volumetric" style={{ padding: '12px', borderRadius: '12px' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '36px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {dealerName || 'Dealer Profile'}
              {trustScore >= 80 && <Award size={28} color="var(--emerald-primary)" />}
            </h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px' }}>
                <MapPin size={18} /> Verified Dealer Location
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-white)', fontWeight: 600, fontSize: '15px' }}>
                <CheckCircle size={18} color="var(--emerald-primary)" /> {dealerInventory.length} Vehicles in Stock
              </span>
            </div>
          </div>
          <TrustGauge score={trustScore} />
        </div>
      </div>

      {/* Dealer Info Card */}
      <div className="glass-panel" style={{ marginBottom: '40px', padding: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--theme-glow)', opacity: '0.1', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
              <Star className="text-emerald" size={24} />
              About {dealerName}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px', maxWidth: '700px' }}>
              Welcome to the official CarUp dealer storefront for <strong style={{ color: '#fff' }}>{dealerName}</strong>. All vehicles listed here 
              are thoroughly vetted and come with their verified history logs via GutuAI. Connect directly 
              to negotiate and utilize SafePay for a secure and transparent transaction.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px' }}>
            <button className="btn-primary hover-volumetric" style={{ width: '100%', justifyContent: 'center', padding: '14px', display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 600 }}>
              <Phone size={20} style={{ marginRight: '10px' }}/> Contact Dealer
            </button>
            <button className="btn-secondary hover-volumetric" style={{ width: '100%', justifyContent: 'center', padding: '14px', display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 600 }}>
              <Mail size={20} style={{ marginRight: '10px' }}/> Send Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Financing Partners Section */}
      <div className="glass-panel" style={{ marginBottom: '40px', padding: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
          <Building className="text-emerald" size={24} color="var(--emerald-primary)" />
          Approved Financing Partners
        </h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { name: 'Stanbic Bank', rate: 'From 12.5% APR', desc: 'Premium Vehicle Finance' },
            { name: 'CABS', rate: 'From 14% APR', desc: 'Flexible Asset Finance' },
            { name: 'First Capital Bank', rate: 'From 13% APR', desc: 'Corporate & SME Finance' }
          ].map((partner, idx) => (
            <div key={idx} className="glass-card hover-offset" style={{ flex: '1 1 250px', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                <CreditCard size={24} color="var(--theme-accent)" />
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{partner.name}</h4>
                <p style={{ color: 'var(--emerald-primary)', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{partner.rate}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{partner.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '26px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
          Current Inventory
        </h3>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Showing all {dealerInventory.length} results
        </span>
      </div>

      {dealerInventory.length > 0 ? (
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {dealerInventory.map(vehicle => (
            <div 
              key={vehicle.vin} 
              className="glass-card hover-offset" 
              style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onClick={() => navigate('/')}
            >
              {renderVehicleImage(vehicle.color, vehicle.make)}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '6px', fontWeight: 800 }}>{vehicle.year} {vehicle.make}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{vehicle.model}</p>
                </div>
                <span className={`trust-score-badge ${getTrustBadgeClass(vehicle.trustIndex)}`} style={{ padding: '6px 12px', borderRadius: '12px', fontWeight: 700 }}>
                  <Shield size={16} />
                  {vehicle.trustIndex}% Trust
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <Gauge size={16} color="var(--theme-accent)" />
                  <span style={{ fontWeight: 500 }}>{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <Fuel size={16} color="var(--theme-accent)" />
                  <span style={{ fontWeight: 500 }}>{vehicle.fuel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <span style={{ fontWeight: 800, fontSize: '11px', color: 'var(--emerald-primary)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>PLATE</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{vehicle.licensePlate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                   <span style={{ fontWeight: 500 }}>{vehicle.transmission}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>USD PRICE</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-white)' }}>${vehicle.price.toLocaleString()}</span>
                </div>
                <button 
                  className="btn-primary hover-volumetric"
                  style={{ padding: '10px 20px', fontSize: '15px', fontWeight: 600, borderRadius: '12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/');
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '64px 24px', borderRadius: '24px' }}>
          <Shield size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-white)', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No Inventory Found</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>This dealer currently has no vehicles available.</p>
        </div>
      )}
    </div>
  );
}
