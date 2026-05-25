import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import { Activity, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Fuel, Gauge, MapPin, Search, ShieldCheck, Sparkles, Star, TrendingUp } from 'lucide-react';

const makeOptions = ['All', 'Toyota', 'Honda', 'Mazda', 'Nissan', 'Mercedes-Benz'];
const bodyTypeOptions = ['All', 'SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van'];
const sortOptions = [
  { value: 'featured', label: 'Best Match' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'trust-desc', label: 'Trust Score' }
];

const getBodyType = (model = '') => {
  const m = model.toLowerCase();
  if (m.includes('hilux') || m.includes('double cab')) return 'Pickup';
  if (m.includes('prado') || m.includes('cruiser')) return 'SUV';
  if (m.includes('fit')) return 'Hatchback';
  return 'Sedan';
};

const buildVehicleImages = (vehicle) => vehicle.images || [vehicle.image, vehicle.image, vehicle.image].filter(Boolean);

function VehicleCard({ vehicle, onOpenDealer }) {
  const images = buildVehicleImages(vehicle);
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => setImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ position: 'relative' }}>
        <img src={images[imageIndex]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }} />
        {images.length > 1 && (
          <>
            <button className="btn-secondary" onClick={prevImage} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', minWidth: '36px', minHeight: '36px', padding: 0 }}><ChevronLeft size={16} /></button>
            <button className="btn-secondary" onClick={nextImage} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', minWidth: '36px', minHeight: '36px', padding: 0 }}><ChevronRight size={16} /></button>
          </>
        )}
        <Badge variant={vehicle.trustIndex >= 70 ? 'high' : vehicle.trustIndex >= 50 ? 'mid' : 'low'} style={{ position: 'absolute', top: '12px', left: '12px' }}>
          {vehicle.trustIndex}% Trust
        </Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ fontSize: '30px' }}>{vehicle.year} {vehicle.make}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '28px' }}>{vehicle.model}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Gauge size={16} /> {vehicle.mileage.toLocaleString()} km</span>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Fuel size={16} /> {vehicle.fuel}</span>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><MapPin size={16} /> Zimbabwe</span>
        <span>{getBodyType(vehicle.model)} • {vehicle.transmission}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Badge variant={vehicle.documents?.zimra === 'verified' ? 'high' : 'mid'}>ZIMRA {vehicle.documents?.zimra === 'verified' ? 'Verified' : 'Pending'}</Badge>
        <Badge variant={vehicle.documents?.cid === 'verified' ? 'high' : 'low'}>Theft/Title {vehicle.documents?.cid === 'verified' ? 'Clear' : 'Review'}</Badge>
        <Badge variant={vehicle.documents?.vid === 'verified' ? 'high' : 'mid'}>Mechanic {vehicle.documents?.vid === 'verified' ? 'Verified' : 'Pending'}</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>USD PRICE</p>
          <h3>${vehicle.price.toLocaleString()}</h3>
        </div>
        <button className="btn-primary" onClick={() => onOpenDealer(vehicle.sellerName)}>View Dealer</button>
      </div>
    </GlassCard>
  );
}

export default function MarketplaceHome() {
  const navigate = useNavigate();
  const { vehicles } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const featuredDealers = useMemo(() => [...new Set(vehicles.map(v => v.sellerName))].slice(0, 4), [vehicles]);

  const filteredVehicles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = vehicles.filter((vehicle) => {
      const condition = vehicle.year >= 2022 ? 'Newer' : 'Used';
      return (
        (selectedMake === 'All' || vehicle.make === selectedMake) &&
        (selectedBodyType === 'All' || getBodyType(vehicle.model) === selectedBodyType) &&
        (selectedCondition === 'All' || condition === selectedCondition) &&
        (!term || [vehicle.make, vehicle.model, vehicle.vin, String(vehicle.year)].join(' ').toLowerCase().includes(term))
      );
    });

    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'trust-desc') return list.sort((a, b) => b.trustIndex - a.trustIndex);
    return list.sort((a, b) => b.trustIndex - a.trustIndex || a.price - b.price);
  }, [searchTerm, selectedMake, selectedBodyType, selectedCondition, sortBy, vehicles]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <GlassCard style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '18px', background: 'linear-gradient(130deg, rgba(21,33,68,0.9), rgba(13,22,42,0.98))' }}>
        <Badge variant="high" style={{ width: 'fit-content' }}><ShieldCheck size={14} /> Zimbabwe Trusted Marketplace</Badge>
        <h1 style={{ fontSize: '42px', maxWidth: '920px', lineHeight: 1.1 }}>Buy & sell vehicles with verified trust scores, escrow protection and dealership-grade listings.</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '760px' }}>This marketplace protects you from scams. CarUp is the safest place in Zimbabwe to buy a car.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <GlassCard style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} /> 241 Verified Listings</GlassCard>
          <GlassCard style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={16} /> 58 Trending Today</GlassCard>
          <GlassCard style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> 45 Active Escrows</GlassCard>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: '16px', display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr)', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.35)', borderRadius: '12px', padding: '10px 12px', border: '1px solid var(--border-glass)' }}>
          <Search size={16} />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search make, model, year or VIN" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-light)' }} />
        </div>
        <select className="form-input" value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>{makeOptions.map(m => <option key={m} value={m}>{m}</option>)}</select>
        <select className="form-input" value={selectedBodyType} onChange={(e) => setSelectedBodyType(e.target.value)}>{bodyTypeOptions.map(m => <option key={m} value={m}>{m}</option>)}</select>
        <select className="form-input" value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}><option>All</option><option>Used</option><option>Newer</option></select>
        <select className="form-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>{sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <GlassCard style={{ padding: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}><Sparkles size={18} /> Featured Vehicles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredVehicles.slice(0, 6).map((vehicle) => (
              <VehicleCard key={vehicle.vin} vehicle={vehicle} onOpenDealer={(name) => navigate(`/dealer/${encodeURIComponent(name)}`)} />
            ))}
          </div>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GlassCard style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={16} /> Featured Dealers</h3>
            {featuredDealers.map((dealer) => (
              <button key={dealer} className="btn-secondary" style={{ justifyContent: 'space-between', width: '100%' }} onClick={() => navigate(`/dealer/${encodeURIComponent(dealer)}`)}>
                {dealer} <ArrowRight size={14} />
              </button>
            ))}
          </GlassCard>

          <GlassCard style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3>Featured Car Financiers</h3>
            <Badge variant="mid">CBZ Vehicle Finance</Badge>
            <Badge variant="mid">Stanbic MotorPlan</Badge>
            <Badge variant="mid">NMB Auto Credit</Badge>
          </GlassCard>

          <GlassCard style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3>Trending Discovery</h3>
            <span style={{ color: 'var(--text-muted)' }}>Toyota Hilux (Diesel, Used)</span>
            <span style={{ color: 'var(--text-muted)' }}>Honda Fit (Hybrid, City Use)</span>
            <span style={{ color: 'var(--text-muted)' }}>Prado TZ-G (Verified Dealer)</span>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
