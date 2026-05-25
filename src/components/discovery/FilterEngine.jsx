import React, { useState } from 'react';
import { Car, Calendar, Globe, ShieldCheck, FileText, SlidersHorizontal, X } from 'lucide-react';

const MAKES = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Mercedes-Benz', 'BMW', 'Volkswagen'];
const MODELS = {
  'Toyota': ['Aqua', 'Corolla', 'Camry', 'Hilux', 'Land Cruiser', 'Fortuner'],
  'Honda': ['Fit', 'CR-V', 'Civic', 'Vezel'],
  'Nissan': ['X-Trail', 'Note', 'Navara', 'March'],
  'Mazda': ['CX-5', 'Axela', 'Demio'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC'],
  'BMW': ['3 Series', 'X5', '1 Series'],
  'Volkswagen': ['Polo', 'Golf', 'Tiguan']
};
const BODY_TYPES = ['Sedan', 'Hatchback', 'SUV', 'Bakkie', 'Wagon'];
const IMPORT_SOURCES = ['Japan', 'UK', 'South Africa', 'Local'];

export default function FilterEngine({ onFilterChange, isOpen, setIsOpen }) {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    body: '',
    importSource: '',
    zimraVerified: false,
    bondPapers: false
  });

  const availableModels = filters.make ? MODELS[filters.make] || [] : [];

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'make') {
      newFilters.model = ''; 
    }
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      make: '', model: '', yearMin: '', yearMax: '', body: '', importSource: '', zimraVerified: false, bondPapers: false
    };
    setFilters(cleared);
    if (onFilterChange) onFilterChange(cleared);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 990, display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Container */}
      <div 
        className={`glass-card ${isOpen ? 'mobile-open' : 'mobile-closed'}`}
        style={{
          position: 'sticky',
          top: '20px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 995,
          padding: 0,
          width: '100%',
          minWidth: '300px'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-solid-card)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal size={20} className="glow-emerald" style={{ color: 'var(--cyan-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>FILTER ENGINE</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={clearFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-gray)',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              className="hover-offset"
            >
              Reset
            </button>
            <button 
              className="mobile-close-btn"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="filter-content hide-scrollbar" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Make & Model */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Car size={14} style={{ color: 'var(--cyan-primary)' }} /> Make
              </label>
              <select 
                className="form-input" 
                value={filters.make} 
                onChange={(e) => updateFilter('make', e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer', width: '100%', background: 'rgba(0,0,0,0.4)' }}
              >
                <option value="">Any Make</option>
                {MAKES.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Car size={14} style={{ color: 'var(--cyan-primary)' }} /> Model
              </label>
              <select 
                className="form-input" 
                value={filters.model} 
                onChange={(e) => updateFilter('model', e.target.value)}
                disabled={!filters.make}
                style={{ 
                  appearance: 'none', 
                  cursor: filters.make ? 'pointer' : 'not-allowed',
                  opacity: filters.make ? 1 : 0.5,
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)'
                }}
              >
                <option value="">Any Model</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Range */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Calendar size={14} style={{ color: 'var(--cyan-primary)' }} /> Year Range
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input 
                type="number" 
                className="form-input" 
                placeholder="Min Year" 
                value={filters.yearMin}
                onChange={(e) => updateFilter('yearMin', e.target.value)}
                min="1990" 
                max={new Date().getFullYear()}
                style={{ background: 'rgba(0,0,0,0.4)' }} 
              />
              <input 
                type="number" 
                className="form-input" 
                placeholder="Max Year" 
                value={filters.yearMax}
                onChange={(e) => updateFilter('yearMax', e.target.value)}
                min="1990" 
                max={new Date().getFullYear()} 
                style={{ background: 'rgba(0,0,0,0.4)' }}
              />
            </div>
          </div>

          {/* Body Type */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '13px' }}>Body Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BODY_TYPES.map(body => (
                <button
                  key={body}
                  onClick={() => updateFilter('body', filters.body === body ? '' : body)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '20px',
                    background: filters.body === body ? 'var(--cyan-glow)' : 'rgba(0,0,0,0.3)',
                    color: filters.body === body ? 'var(--cyan-light)' : 'var(--text-gray)',
                    border: `1px solid ${filters.body === body ? 'var(--cyan-primary)' : 'var(--border-glass)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-offset"
                >
                  {body}
                </button>
              ))}
            </div>
          </div>

          {/* Import Source */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Globe size={14} style={{ color: 'var(--cyan-primary)' }} /> Source
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {IMPORT_SOURCES.map(source => (
                <button
                  key={source}
                  onClick={() => updateFilter('importSource', filters.importSource === source ? '' : source)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '20px',
                    background: filters.importSource === source ? 'var(--cyan-glow)' : 'rgba(0,0,0,0.3)',
                    color: filters.importSource === source ? 'var(--cyan-light)' : 'var(--text-gray)',
                    border: `1px solid ${filters.importSource === source ? 'var(--cyan-primary)' : 'var(--border-glass)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-offset"
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-glass)' }}></div>

          {/* Verification Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: filters.zimraVerified ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0,0,0,0.3)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `1px solid ${filters.zimraVerified ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-glass)'}`,
                transition: 'all 0.2s ease'
              }}
              className="hover-offset"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={18} style={{ color: filters.zimraVerified ? 'var(--emerald-primary)' : 'var(--text-gray)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: filters.zimraVerified ? 'var(--emerald-primary)' : 'var(--text-white)' }}>
                  ZIMRA Verified
                </span>
              </div>
              <div style={{
                width: '44px',
                height: '24px',
                background: filters.zimraVerified ? 'var(--emerald-primary)' : 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: filters.zimraVerified ? '22px' : '2px',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
              </div>
              <input 
                type="checkbox" 
                checked={filters.zimraVerified}
                onChange={(e) => updateFilter('zimraVerified', e.target.checked)}
                style={{ display: 'none' }}
              />
            </label>

            <label 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: filters.bondPapers ? 'rgba(6, 182, 212, 0.05)' : 'rgba(0,0,0,0.3)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `1px solid ${filters.bondPapers ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-glass)'}`,
                transition: 'all 0.2s ease'
              }}
              className="hover-offset"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={18} style={{ color: filters.bondPapers ? 'var(--cyan-primary)' : 'var(--text-gray)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: filters.bondPapers ? 'var(--cyan-primary)' : 'var(--text-white)' }}>
                  Bond Papers
                </span>
              </div>
              <div style={{
                width: '44px',
                height: '24px',
                background: filters.bondPapers ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: filters.bondPapers ? '22px' : '2px',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
              </div>
              <input 
                type="checkbox" 
                checked={filters.bondPapers}
                onChange={(e) => updateFilter('bondPapers', e.target.checked)}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          <div style={{ height: '10px' }}></div>
        </div>
      </div>
      
      {/* Mobile styles logic */}
      <style>{`
        @media (max-width: 768px) {
          .glass-card.mobile-open {
            position: fixed !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-height: 85vh !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            z-index: 1000 !important;
            transform: translateY(0) !important;
          }
          
          .glass-card.mobile-closed {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            transform: translateY(100%) !important;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
          }
          
          .mobile-close-btn {
            display: flex !important;
          }
        }
        
        /* Desktop styles to ensure it stays in document flow if not open */
        @media (min-width: 769px) {
          .glass-card.mobile-closed {
            opacity: 1;
            pointer-events: auto;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
