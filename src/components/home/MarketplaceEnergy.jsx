import React, { useState, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import { TrendingUp, Zap, Clock, ChevronRight, Activity, DollarSign } from 'lucide-react';

export default function MarketplaceEnergy() {
  const [energyData, setEnergyData] = useState({
    recentlySold: [
      { id: 1, name: '2019 Toyota Hilux', price: '$32,000', time: '2m ago' },
      { id: 2, name: '2020 Ford Ranger', price: '$28,500', time: '15m ago' },
      { id: 3, name: '2018 Honda Fit', price: '$8,200', time: '1h ago' }
    ],
    trendingNow: [
      { id: 4, name: '2021 Toyota Fortuner', views: '1.2k', trend: '+15%' },
      { id: 5, name: '2017 VW Golf R', views: '850', trend: '+22%' },
    ],
    activeUsers: 342,
    totalVolume: '$1.2M'
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
      <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--cyan-primary)', filter: 'blur(60px)', opacity: 0.15 }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0 }}>
            <Activity size={20} className="glow-cyan" style={{ color: 'var(--cyan-primary)' }} />
            Market Pulse
          </h3>
          <Badge variant="success" style={{ animation: 'pulse 2s infinite' }}>Live</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Active Buyers</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--cyan-primary)' }}>{energyData.activeUsers}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>24h Volume</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--emerald-primary)' }}>{energyData.totalVolume}</div>
          </div>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'var(--emerald-primary)', filter: 'blur(60px)', opacity: 0.1 }} />
         <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0 }}>
            <Zap size={20} className="glow-emerald" style={{ color: 'var(--emerald-primary)' }} />
            Just Secured
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {energyData.recentlySold.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.time}
                  </div>
                </div>
                <div style={{ color: 'var(--emerald-primary)', fontWeight: '600', fontSize: '14px' }}>{item.price}</div>
              </div>
            ))}
          </div>
      </GlassCard>

      <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--gold-primary)', filter: 'blur(60px)', opacity: 0.1 }} />
         <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0 }}>
            <TrendingUp size={20} className="glow-gold" style={{ color: 'var(--gold-primary)' }} />
            Trending Now
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {energyData.trendingNow.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{item.views} views this hour</div>
                </div>
                <div style={{ color: 'var(--gold-primary)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                  {item.trend} <TrendingUp size={14} style={{marginLeft: '4px'}}/>
                </div>
              </div>
            ))}
          </div>
      </GlassCard>
    </div>
  );
}
