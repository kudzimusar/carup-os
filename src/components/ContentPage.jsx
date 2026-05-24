import React from 'react';
import { ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';

export default function ContentPage({ topic, goBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', minHeight: '60vh' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="btn-secondary" 
          onClick={goBack}
          style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: '28px', margin: 0 }}>{topic}</h1>
      </div>

      <div className="glass-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px', background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--border-glass)' }}>
        <BookOpen size={48} style={{ color: 'var(--theme-text-accent)', opacity: 0.5 }} />
        <h2 style={{ fontSize: '20px', color: 'var(--text-white)' }}>Content for "{topic}" is under construction.</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.5' }}>
          This page is dynamically routed via the CarUp OS portal system. In a future update, this will contain the detailed guide, listing, or application form for {topic}.
        </p>
        
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left', maxWidth: '500px' }}>
          <AlertTriangle size={20} style={{ color: 'var(--red-primary)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '13px', color: '#fca5a5', margin: 0 }}>
            <strong>System Router Notice:</strong> You have been successfully routed from the Global Footer. The session state is maintained securely within the OS.
          </p>
        </div>
      </div>
    </div>
  );
}
