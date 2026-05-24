import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Trash2, Clock, Lock, X, DollarSign } from 'lucide-react';

export const ReservationLedger = ({ isOpen, onClose, onCheckout }) => {
  const { vehicles, cartLocks, globalLocks, removeFromCart, extendLock } = useApp();
  
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const cartTotal = cartLocks.reduce((acc, lock) => {
    const v = vehicles.find(veh => veh.vin === lock.vin);
    return acc + (v ? v.price : 0);
  }, 0);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1300, justifyContent: 'flex-end', padding: 0 }}>
      {/* Drawer */}
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '450px',
        height: '100vh',
        background: 'var(--bg-solid-card)',
        borderLeft: '1px solid var(--gold-primary)',
        boxShadow: '-10px 0 30px rgba(245, 158, 11, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease-out',
        borderRadius: 0
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Lock size={20} /> Reservation Ledger
          </h2>
          <button 
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-white)'
            }} 
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Held Inventory</h3>
            {cartLocks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
                <ShoppingCart size={32} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No vehicles locked. Add to cart to temporarily hold inventory.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartLocks.map(lock => {
                  const veh = vehicles.find(v => v.vin === lock.vin);
                  if (!veh) return null;
                  
                  const msLeft = Math.max(0, lock.expiresAt - now);
                  const mins = Math.floor(msLeft / 60000);
                  const secs = Math.floor((msLeft % 60000) / 1000);
                  const isExpiring = msLeft < 300000; // Less than 5 mins

                  return (
                    <div key={lock.vin} style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid var(--gold-primary)', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-white)' }}>{veh.year} {veh.make} {veh.model}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'monospace' }}>VIN: {veh.vin}</div>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--emerald-light)' }}>
                          ${veh.price.toLocaleString()}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isExpiring ? '#fca5a5' : 'var(--gold-light)' }}>
                          <Clock size={14} /> 
                          {mins}:{secs.toString().padStart(2, '0')} remaining
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px', minHeight: 'auto' }}
                            onClick={() => extendLock(lock.vin)}
                          >
                            Extend
                          </button>
                          <button 
                            style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: '4px' }}
                            onClick={() => removeFromCart(lock.vin)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Network Locks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {globalLocks.map(lock => {
                const veh = vehicles.find(v => v.vin === lock.vin);
                if (!veh) return null;
                const msLeft = Math.max(0, lock.expiresAt - now);
                const mins = Math.floor(msLeft / 60000);
                
                return (
                  <div key={lock.vin} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)', opacity: 0.8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-white)', fontWeight: 'bold' }}>{veh.make} {veh.model}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <Lock size={10} /> Locked by {lock.lockedBy}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ~{mins}m left
                      </div>
                    </div>
                  </div>
                );
              })}
              {globalLocks.length === 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No other vehicles currently locked.</div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Value Locked</span>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-white)' }}>
              ${cartTotal.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'normal' }}>USD</span>
            </div>
          </div>
          <button 
            className={`btn-gold ${cartLocks.length > 0 ? 'glow-gold' : ''}`}
            style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: cartLocks.length > 0 ? 'pointer' : 'not-allowed', opacity: cartLocks.length > 0 ? 1 : 0.5 }}
            disabled={cartLocks.length === 0}
            onClick={() => {
              if (cartLocks.length > 0) {
                onCheckout();
              }
            }}
          >
            <DollarSign size={20} />
            Initialize SafePay Checkout
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
