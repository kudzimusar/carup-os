import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import GlassCard from '../ui/GlassCard';
import IntelligenceCard from '../ui/IntelligenceCard';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { Shield, MapPin, Gauge, Fuel, CheckCircle, ExternalLink, ShieldCheck, ShoppingCart, Sparkles, TrendingUp, Award, Zap, ShieldAlert, Activity, Command, Search } from 'lucide-react';

export default function MarketplaceHome() {
  const navigate = useNavigate();
  const { vehicles, cartItems, globalLocks, addToCart, removeFromCart, comparedVins, addToCompare, removeFromCompare } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');

  const getBodyType = (model = '') => {
    const m = model.toLowerCase();
    if (m.includes('hilux') || m.includes('double cab')) return 'Pickup';
    if (m.includes('prado') || m.includes('cruiser')) return 'SUV';
    if (m.includes('fit')) return 'Hatchback';
    return 'Sedan';
  };

  const filteredVehicles = useMemo(() => vehicles.filter(vehicle => {
    const term = searchTerm.toLowerCase();
    const condition = vehicle.year >= 2022 ? 'Newer' : 'Used';
    const makeMatch = selectedMake === 'All' || vehicle.make === selectedMake;
    const bodyMatch = selectedBodyType === 'All' || getBodyType(vehicle.model) === selectedBodyType;
    const conditionMatch = selectedCondition === 'All' || selectedCondition === condition;
    const searchMatch = !searchTerm || (
      vehicle.make.toLowerCase().includes(term) ||
      vehicle.model.toLowerCase().includes(term) ||
      vehicle.year.toString().includes(term) ||
      vehicle.vin.toLowerCase().includes(term)
    );

    return makeMatch && bodyMatch && conditionMatch && searchMatch;
  }), [vehicles, searchTerm, selectedMake, selectedBodyType, selectedCondition]);

  const featuredDealers = useMemo(() => [...new Set(vehicles.map(v => v.sellerName))].slice(0, 4), [vehicles]);

  // Simulate loading state for skeletons
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Hero Search */}
      <GlassCard className="active-neon-sweep" style={{
        padding: '48px 32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(22, 27, 46, 0.8) 0%, rgba(11, 16, 32, 0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <Badge variant="primary" style={{ padding: '6px 12px' }}>
            <Sparkles size={14} /> AI-Powered OS
          </Badge>
          <h1 style={{ fontSize: '42px', lineHeight: '1.1', maxWidth: '800px' }}>
            Zimbabwe's First Trust-Driven Automotive Ecosystem
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '16px' }}>
            Every listing verified by blockchain telemetry and government registries. Buy with zero risk.
          </p>
        </div>

        {/* Live Intelligence Rail */}
        <div style={{
          display: 'flex',
          gap: '24px',
          padding: '12px 24px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '100px',
          border: '1px solid var(--border-glass)',
          alignItems: 'center',
          overflowX: 'auto',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          animation: 'marquee 20s linear infinite'
        }}>
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-10%); }
              }
            `}
          </style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-primary)' }}>
            <Activity size={16} /> <span style={{ fontSize: '14px', fontWeight: 600 }}>241 Verified Vehicles</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)' }}>
            <ShieldCheck size={16} /> <span style={{ fontSize: '14px', fontWeight: 600 }}>12 Fraud Attempts Blocked</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)' }}>
            <Award size={16} /> <span style={{ fontSize: '14px', fontWeight: 600 }}>45 Active Escrows</span>
          </div>
        </div>

        {/* Automotive Command Center Search */}
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
          <div className="command-center-wrapper" style={{ position: 'relative', width: '100%' }}>
            <div className="command-center-icon" style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'var(--cyan-primary)' }}>
              <Command size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Command Center: Try 'Find verified Hilux under $20k' or search by VIN..." 
              className="form-input command-center-input" 
              style={{ 
                width: '100%', 
                padding: '24px 24px 24px 60px', 
                fontSize: '18px', 
                borderRadius: '32px', 
                background: 'rgba(0,0,0,0.6)',
                border: '2px solid rgba(14, 165, 233, 0.3)',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.1)',
                color: 'white'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-primary command-center-btn" style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', padding: '0 32px', borderRadius: '24px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} /> Execute
            </button>
          </div>

          {/* AI Command Suggestion Pills */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              "Find verified Hilux under $20k",
              "Show financing eligible SUVs",
              "Compare safest family vehicles"
            ].map((cmd, i) => (
              <GlassCard 
                key={i}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.02)'
                }}
                onClick={() => setSearchTerm(cmd)}
              >
                <Sparkles size={12} style={{ color: 'var(--cyan-primary)' }} />
                {cmd}
              </GlassCard>
            ))}
          </div>
        </div>
      </GlassCard>


      {/* 1.5 Discovery Layer */}
      <GlassCard style={{ padding: '20px', display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: '12px', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Live discovery filters</div>
        <select className="form-input" value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
          <option value="All">All Makes</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Mazda">Mazda</option>
          <option value="Nissan">Nissan</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
        </select>
        <select className="form-input" value={selectedBodyType} onChange={(e) => setSelectedBodyType(e.target.value)}>
          <option value="All">All Body Types</option>
          <option value="SUV">SUV</option>
          <option value="Pickup">Pickup</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sedan">Sedan</option>
        </select>
        <select className="form-input" value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
          <option value="All">All Conditions</option>
          <option value="Used">Used</option>
          <option value="Newer">Newer (2022+)</option>
        </select>
      </GlassCard>

      {/* 1.6 Featured Ecosystem */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
        <GlassCard style={{ padding: '18px' }}>
          <h3 style={{ marginBottom: '10px' }}>Featured Dealers</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {featuredDealers.map((dealer) => (
              <button key={dealer} className="btn-secondary" style={{ fontSize: '12px', padding: '8px 12px' }} onClick={() => navigate(`/dealer/${encodeURIComponent(dealer)}`)}>{dealer}</button>
            ))}
          </div>
        </GlassCard>
        <GlassCard style={{ padding: '18px' }}>
          <h3 style={{ marginBottom: '10px' }}>Featured Financiers</h3>
          <Badge variant="mid">CBZ</Badge> <Badge variant="mid">Stanbic</Badge>
        </GlassCard>
        <GlassCard style={{ padding: '18px' }}>
          <h3 style={{ marginBottom: '10px' }}>Trending</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Hilux · Prado · Fit</p>
        </GlassCard>
      </div>

      {/* 2. Trust Categories */}
      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} className="glow-emerald" style={{ color: 'var(--emerald-primary)' }} />
          Verified Intelligence Categories
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Blockchain Verified Parts', icon: <Shield size={18} />, color: 'var(--blue-primary)' },
            { label: 'Mechanic Inspected', icon: <CheckCircle size={18} />, color: 'var(--emerald-primary)' },
            { label: 'Financing Eligible', icon: <Award size={18} />, color: 'var(--gold-primary)' },
            { label: 'Instant Duty Clearance', icon: <Zap size={18} />, color: 'var(--cyan-primary)' },
          ].map((cat, i) => (
            <GlassCard key={i} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div style={{ background: `rgba(${cat.color}, 0.1)`, padding: '10px', borderRadius: '12px', color: cat.color }}>
                {cat.icon}
              </div>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>{cat.label}</span>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* 3. Horizontal Carousels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* Helper function for rows */}
        {(() => {
          const CarouselRow = ({ title, icon, items }) => (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {icon}
                  {title}
                </h2>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>View All</button>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                paddingBottom: '16px',
                scrollbarWidth: 'none', /* Firefox */
              }} className="hide-scrollbar horizontal-carousel">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} style={{ minWidth: '340px', maxWidth: '340px', flexShrink: 0 }}>
                      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Skeleton height="160px" borderRadius="12px" />
                        <Skeleton height="24px" width="60%" />
                        <Skeleton height="16px" width="40%" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 0' }}>
                          <Skeleton height="16px" />
                          <Skeleton height="16px" />
                        </div>
                        <Skeleton height="40px" borderRadius="20px" />
                      </GlassCard>
                    </div>
                  ))
                ) : items.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', width: '100%' }}>
                    No vehicles found
                  </div>
                ) : (
                  items.map(vehicle => (
                    <div key={vehicle.vin} style={{ minWidth: '340px', maxWidth: '340px', flexShrink: 0 }}>
                      <IntelligenceCard vehicle={vehicle} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );

          // Data slices
          const mechanicCertified = [...filteredVehicles].sort((a, b) => b.trustIndex - a.trustIndex);
          const diasporaPicks = filteredVehicles.filter(v => v.price < 35000 || v.sellerType === 'Verified Dealer');
          const financingEligible = filteredVehicles.filter(v => v.year >= 2015);
          const aiRecommendations = [...vehicles].sort((a, b) => b.trustIndex - a.trustIndex).slice(0, 4); // Based on full vehicles

          return (
            <>
              {searchTerm && filteredVehicles.length > 0 && (
                <CarouselRow 
                  title={`Search Results (${filteredVehicles.length})`} 
                  icon={<Search size={20} style={{ color: 'var(--cyan-primary)' }} />} 
                  items={filteredVehicles} 
                />
              )}
              
              {(!searchTerm || filteredVehicles.length === 0) && (
                <>
                  <CarouselRow 
                    title="Mechanic Certified Intelligence" 
                    icon={<ShieldCheck size={20} style={{ color: 'var(--emerald-primary)' }} />} 
                    items={mechanicCertified} 
                  />
                  
                  <CarouselRow 
                    title="Diaspora Safe Picks" 
                    icon={<Award size={20} style={{ color: 'var(--gold-primary)' }} />} 
                    items={diasporaPicks} 
                  />
                  
                  <CarouselRow 
                    title="Financing Eligible" 
                    icon={<Activity size={20} style={{ color: 'var(--blue-primary)' }} />} 
                    items={financingEligible} 
                  />
                  
                  {/* 4. AI Recommendations */}
                  <CarouselRow 
                    title="AI Personalized Recommendations" 
                    icon={<Sparkles size={20} style={{ color: 'var(--cyan-primary)' }} />} 
                    items={aiRecommendations} 
                  />
                </>
              )}
            </>
          );
        })()}
      </div>

      {/* Floating Compare Button */}
      {comparedVins.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 100,
        }}>
          <button 
            className="btn-primary active-neon-sweep" 
            style={{ 
              padding: '16px 24px', 
              fontSize: '16px', 
              borderRadius: '30px', 
              boxShadow: '0 8px 32px rgba(14, 165, 233, 0.4)',
              gap: '12px'
            }}
            onClick={() => navigate('/compare')}
          >
            <Zap size={20} />
            Compare Intelligence ({comparedVins.length})
          </button>
        </div>
      )}

    </div>
  );
}
