import React, { useState } from 'react';
import { UploadCloud, Wand2, FileText, CheckCircle, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function UploadUX() {
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  
  const [ocrActive, setOcrActive] = useState(false);
  const [ocrData, setOcrData] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mock loading of files
      setImages(Array.from(e.dataTransfer.files).map(file => URL.createObjectURL(file)));
    }
  };

  const enhanceImages = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setIsEnhancing(false);
      setEnhanced(true);
    }, 2000);
  };

  const simulateOCR = () => {
    setOcrActive(true);
    setTimeout(() => {
      setOcrActive(false);
      setOcrData({
        vin: 'WA1UGEBF0G104XXXX',
        make: 'Audi',
        model: 'A6',
        year: '2023',
        mileage: '12,500 km'
      });
    }, 2500);
  };

  return (
    <div className="layout-container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="gradient-text" style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 800 }}>Vehicle Ingestion & AI Processing</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '40px' }}>Upload vehicle photos and registration documents for automated enhancement and OCR data extraction.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column: Image Upload & AI Enhancement */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
              <ImageIcon size={24} color="var(--theme-accent)" />
              Vehicle Photos
            </h2>
            {images.length > 0 && !enhanced && !isEnhancing && (
              <button onClick={enhanceImages} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--purple-primary, #8b5cf6)' }}>
                <Sparkles size={16} /> Enhance with AI
              </button>
            )}
            {isEnhancing && (
              <span style={{ color: 'var(--purple-primary, #8b5cf6)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
                <Loader2 size={16} className="animate-spin" /> Enhancing...
              </span>
            )}
            {enhanced && (
              <span style={{ color: 'var(--emerald-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
                <CheckCircle size={16} /> Studio Quality
              </span>
            )}
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--theme-accent)' : 'rgba(255,255,255,0.1)'}`,
              background: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0,0,0,0.2)',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <UploadCloud size={48} color={dragActive ? 'var(--theme-accent)' : 'var(--text-muted)'} style={{ margin: '0 auto 16px auto' }} />
            <p style={{ color: 'var(--text-white)', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Drag and drop images here</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Support for JPG, PNG. High resolution preferred.</p>
          </div>

          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
              {images.map((src, i) => (
                <div key={i} style={{ 
                  position: 'relative', 
                  aspectRatio: '4/3', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  border: enhanced ? '2px solid var(--purple-primary, #8b5cf6)' : '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img src={src} alt="upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: enhanced ? 'contrast(1.1) saturate(1.2)' : 'none' }} />
                  {enhanced && (
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Wand2 size={12} color="var(--purple-primary, #8b5cf6)" />
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>AI ENHANCED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: OCR Auto-fill */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
              <FileText size={24} color="var(--emerald-primary)" />
              Document OCR Autofill
            </h2>
          </div>

          <div 
            style={{
              border: '2px dashed rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Upload registration or import documents to automatically extract vehicle details.</p>
            <button onClick={simulateOCR} disabled={ocrActive || ocrData} className="btn-secondary hover-volumetric" style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {ocrActive ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
              {ocrActive ? 'Scanning Document...' : 'Upload Document'}
            </button>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Extracted Data</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>VIN</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', color: ocrData ? '#fff' : 'var(--text-muted)', fontFamily: ocrData ? 'monospace' : 'inherit', minHeight: '44px', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {ocrData ? ocrData.vin : 'Awaiting document...'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>MAKE & MODEL</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', color: ocrData ? '#fff' : 'var(--text-muted)', minHeight: '44px', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {ocrData ? `${ocrData.make} ${ocrData.model}` : 'Awaiting document...'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>YEAR</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', color: ocrData ? '#fff' : 'var(--text-muted)', minHeight: '44px', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {ocrData ? ocrData.year : 'Awaiting document...'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>MILEAGE</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', color: ocrData ? '#fff' : 'var(--text-muted)', minHeight: '44px', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {ocrData ? ocrData.mileage : 'Awaiting document...'}
                </div>
              </div>
            </div>

            {ocrData && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={20} color="var(--emerald-primary)" />
                <span style={{ color: 'var(--emerald-primary)', fontSize: '14px', fontWeight: 600 }}>Data extracted and verified successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
