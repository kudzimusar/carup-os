import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { DollarSign, ShieldAlert, CheckCircle, RefreshCw, Send, Smartphone, Landmark, HeartHandshake, AlertCircle } from 'lucide-react'
import GlassCard from './ui/GlassCard'
import Badge from './ui/Badge'

const EscrowTimeline = ({ status }) => {
  let currentStep = 1;
  if (status === 'Settled to Seller') currentStep = 4;
  else if (status === 'Vehicle Inspected') currentStep = 2; 
  else if (status === 'Title Transferred') currentStep = 3;

  const steps = [
    { label: 'Agreement' },
    { label: 'Secured' },
    { label: 'Inspection' },
    { label: 'Title' },
    { label: 'Released' }
  ];

  return (
    <div style={{ marginTop: '20px', marginBottom: '16px', position: 'relative' }}>
      {/* Background Line */}
      <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '2px', background: 'var(--border-glass)', zIndex: 0 }} />
      
      {/* Active Line */}
      <div style={{ 
        position: 'absolute', top: '10px', left: '10%', 
        width: `${(currentStep / (steps.length - 1)) * 80}%`, 
        height: '2px', background: 'var(--emerald-primary)', 
        boxShadow: '0 0 8px var(--emerald-glow)',
        transition: 'width 0.5s ease',
        zIndex: 0 
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%', gap: '8px' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: isCompleted ? 'var(--emerald-primary)' : '#111',
                border: isCompleted ? 'none' : '2px solid var(--border-glass)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isCompleted ? '#000' : 'var(--text-muted)',
                boxShadow: isCurrent ? '0 0 12px var(--emerald-glow)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? <CheckCircle size={14} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border-glass)' }} />}
              </div>
              <span style={{ 
                fontSize: '10px', 
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isCompleted ? (isCurrent ? 'var(--emerald-light)' : '#fff') : 'var(--text-muted)',
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default function SafePay() {
  const location = useLocation()
  const selectedVins = location.state?.vins || location.state?.selectedVins || []
  const { vehicles, escrows, createSafePayEscrow, updateEscrowStatus, initiatePaynowCheckoutSplit, simulatePaynowPayment, triggerPaynowWebhook } = useApp()
  const [activeSubTab, setActiveSubTab] = useState('ecocash') // ecocash, innbucks, zipit, diaspora
  
  // Transaction creation state
  const [targetVin, setTargetVin] = useState((selectedVins && selectedVins.length === 1) ? selectedVins[0] : '')
  const [buyerName, setBuyerName] = useState('Simba Choga (Diaspora)')
  const [currentEscrowId, setCurrentEscrowId] = useState(null)
  
  // EcoCash Simulator State
  const [ecocashNumber, setEcocashNumber] = useState('0771234567')
  const [showUssdPrompt, setShowUssdPrompt] = useState(false)
  const [ussdPin, setUssdPin] = useState('')
  const [ecocashSuccess, setEcocashSuccess] = useState(false)

  // InnBucks State
  const [innbucksPhone, setInnbucksPhone] = useState('0788921102')
  const [innbucksOtp, setInnbucksOtp] = useState('')
  const [innbucksSuccess, setInnbucksSuccess] = useState(false)

  // Zipit State
  const [selectedBank, setSelectedBank] = useState('Stanbic Bank')
  const [zipitSuccess, setZipitSuccess] = useState(false)

  // Diaspora state
  const [diasporaCard, setDiasporaCard] = useState('4000 1234 5678 9010')
  const [diasporaSuccess, setDiasporaSuccess] = useState(false)

  // System status
  const [processingPayment, setProcessingPayment] = useState(false)

  React.useEffect(() => {
    if ((!selectedVins || selectedVins.length === 0) && !targetVin && vehicles && vehicles.length > 0) {
      setTargetVin(vehicles[0].vin)
    }
  }, [vehicles, targetVin, selectedVins])

  const isBulk = selectedVins && selectedVins.length > 1;
  const activeVins = isBulk ? selectedVins : [targetVin];
  
  const selectedVehicles = vehicles.filter(v => activeVins.includes(v.vin));
  const totalPrice = selectedVehicles.reduce((acc, v) => acc + v.price, 0);
  
  // 1. Initiate EcoCash Payment
  const triggerEcoCashPayment = (e) => {
    e.preventDefault()
    if (selectedVehicles.length === 0) return
    setShowUssdPrompt(true)
  }

  const confirmEcoCashPin = async () => {
    if (ussdPin.length < 4 || selectedVehicles.length === 0) return
    setProcessingPayment(true)
    try {
      const id = await createSafePayEscrow(activeVins.join(', '), totalPrice, `EcoCash Push (${ecocashNumber})`, buyerName)
      setCurrentEscrowId(id)
      await simulatePaynowPayment(id, ecocashNumber, 'ecocash', totalPrice)
      setProcessingPayment(false)
      setShowUssdPrompt(false)
      setEcocashSuccess(true)
      setUssdPin('')
    } catch (err) {
      console.error(err)
      setProcessingPayment(false)
      setShowUssdPrompt(false)
    }
  }

  // 2. Initiate InnBucks Payment
  const triggerInnBucksPayment = async (e) => {
    e.preventDefault()
    if (selectedVehicles.length === 0) return
    setProcessingPayment(true)
    try {
      const id = await createSafePayEscrow(activeVins.join(', '), totalPrice, `InnBucks Wallet (${innbucksPhone})`, buyerName)
      setCurrentEscrowId(id)
      await simulatePaynowPayment(id, innbucksPhone, 'innbucks', totalPrice)
      setProcessingPayment(false)
      setInnbucksSuccess(true)
    } catch (err) {
      console.error(err)
      setProcessingPayment(false)
    }
  }

  // 3. Initiate Zipit Payment
  const triggerZipitPayment = async () => {
    if (selectedVehicles.length === 0) return
    setProcessingPayment(true)
    try {
      const id = await createSafePayEscrow(activeVins.join(', '), totalPrice, `Zipit Instant (${selectedBank})`, buyerName)
      setCurrentEscrowId(id)
      setProcessingPayment(false)
      setZipitSuccess(true)
    } catch (err) {
      console.error(err)
      setProcessingPayment(false)
    }
  }

  // 4. Initiate Diaspora Payment & Splitting (Paynow Split)
  const triggerDiasporaPayment = async (e) => {
    e.preventDefault()
    if (selectedVehicles.length === 0) return
    setProcessingPayment(true)
    try {
      const id = await initiatePaynowCheckoutSplit(activeVins.join(', '), totalPrice, 0.85)
      setCurrentEscrowId(id)
      setProcessingPayment(false)
      setDiasporaSuccess(true)
    } catch (err) {
      console.error(err)
      setProcessingPayment(false)
    }
  }

  // Release Escrow funds to seller
  const handleReleaseFunds = (escrowId) => {
    updateEscrowStatus(escrowId, 'Settled to Seller')
  }


  const pendingUssdEscrow = escrows.find(e => e.status === 'Paynow Pending (USSD Sent)')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Live USSD Push Simulation Status Bar Panel */}
      {pendingUssdEscrow && (
        <GlassCard className="glow-gold" style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 24, 43, 0.95) 100%)',
          border: '1px solid var(--gold-primary)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={20} /> Paynow Zimbabwe USSD Simulation Gate
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                A simulated mobile money push transaction has been broadcasted via Paynow Zimbabwe. Awaiting subscriber USSD action.
              </p>
            </div>
            <Badge variant="mid">
              AWAITING HANDSET PIN
            </Badge>
          </div>

          {/* Status bar */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', height: '12px', width: '100%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(90deg, var(--gold-primary) 0%, var(--gold-dark) 100%)',
              height: '100%',
              width: '65%',
              borderRadius: '9999px',
              animation: 'loadingProgress 2s infinite linear',
              position: 'absolute'
            }} />
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes loadingProgress {
              0% { width: 0%; left: 0%; }
              50% { width: 40%; left: 30%; }
              100% { width: 0%; left: 100%; }
            }
          `}} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ESCROW ID</span>
              <p style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#fff', fontSize: '14px' }}>{pendingUssdEscrow.id}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SUBSCRIBER</span>
              <p style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{pendingUssdEscrow.buyer}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>METHOD</span>
              <p style={{ fontWeight: 'bold', color: 'var(--gold-light)', fontSize: '14px' }}>{pendingUssdEscrow.paymentMethod}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AMOUNT LOCKED</span>
              <p style={{ fontWeight: 'bold', color: 'var(--emerald-light)', fontSize: '14px' }}>${pendingUssdEscrow.amount.toLocaleString()} USD</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-secondary" 
                style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'var(--red-glow)', color: '#fca5a5', padding: '8px 16px', fontSize: '12px', minHeight: '36px', cursor: 'pointer' }}
                onClick={async () => {
                  try {
                    await triggerPaynowWebhook(pendingUssdEscrow.id, 'failed')
                  } catch (err) {
                    console.error("Failed to cancel simulated transaction:", err)
                  }
                }}
              >
                Cancel / Timeout USSD
              </button>
              <button 
                className="btn-primary" 
                style={{ background: 'var(--emerald-primary)', color: '#000', padding: '8px 16px', fontSize: '12px', minHeight: '36px', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={async () => {
                  try {
                    await triggerPaynowWebhook(pendingUssdEscrow.id, 'paid')
                  } catch (err) {
                    console.error("Failed to approve simulated transaction:", err)
                  }
                }}
              >
                Simulate Approving Pin Input
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Intro section */}
      <GlassCard className="glow-gold" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(17, 24, 43, 0.7) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.15)',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <Badge variant="mid" style={{ marginBottom: '8px' }}>Ecosystem Financial Engine</Badge>
          <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>CarUp SafePay™ Escrow</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            SafePay eliminates vehicle purchase fraud in Zimbabwe by locking buyer funds in a secure escrow ledger. 
            Funds are only disbursed to the seller once the physical vehicle matches its **Digital Passport** and passes independent inspection.
            Includes automatic custom tax splitting to **ZIMRA** and safe remittance conduits for the **Diaspora**.
          </p>
        </div>
        <HeartHandshake size={64} style={{ color: 'var(--gold-primary)', opacity: 0.8 }} />
      </GlassCard>

      <div className="grid-layout-split">
        
        {/* Payment execution center */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px' }}>Escrow Payment Console</h3>

          {/* Target Vehicle Select */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">{isBulk ? 'Bulk Order' : 'Car to Purchase'}</label>
              {isBulk ? (
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '14px', color: 'var(--text-white)', fontWeight: 'bold' }}>
                  {activeVins.length} Vehicles Reserved in Cart
                </div>
              ) : (
                <select 
                  className="form-input" 
                  style={{ background: '#070a13' }}
                  value={targetVin}
                  onChange={(e) => {
                    setTargetVin(e.target.value)
                    setEcocashSuccess(false)
                    setInnbucksSuccess(false)
                    setZipitSuccess(false)
                    setDiasporaSuccess(false)
                  }}
                >
                  {vehicles.map(v => (
                    <option key={v.vin} value={v.vin}>{v.make} {v.model} (${v.price.toLocaleString()})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Buyer Profile / Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={buyerName} 
                onChange={(e) => setBuyerName(e.target.value)} 
              />
            </div>
          </div>

          {selectedVehicles.length > 0 && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span>Total Ledger Amount (USD):</span>
              <strong style={{ color: 'var(--gold-light)' }}>${totalPrice.toLocaleString()}</strong>
            </div>
          )}

          {/* Subtabs for Zimbabwe local payment networks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px' }}>
            {[
              { id: 'ecocash', label: 'EcoCash' },
              { id: 'innbucks', label: 'InnBucks' },
              { id: 'zipit', label: 'Zipit' },
              { id: 'diaspora', label: 'Diaspora' }
            ].map(tab => (
              <button
                key={tab.id}
                style={{
                  background: activeSubTab === tab.id ? 'var(--gold-dark)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: activeSubTab === tab.id ? 'var(--text-white)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '10px 4px',
                  minHeight: '48px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => setActiveSubTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* EcoCash Panel */}
          {activeSubTab === 'ecocash' && (
            <form onSubmit={triggerEcoCashPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">EcoCash Mobile Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '14px', fontWeight: 'bold' }}>+263</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ flex: 1 }}
                    value={ecocashNumber}
                    onChange={(e) => setEcocashNumber(e.target.value)}
                    placeholder="771234567" 
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                <Smartphone size={16} /> Request USSD Escrow Prompt
              </button>
            </form>
          )}

          {/* InnBucks Panel */}
          {activeSubTab === 'innbucks' && (
            <form onSubmit={triggerInnBucksPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">InnBucks Account / Mobile Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={innbucksPhone}
                  onChange={(e) => setInnbucksPhone(e.target.value)}
                  placeholder="0788921102" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">OTP Innbucks Verification Pin</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={innbucksOtp}
                  onChange={(e) => setInnbucksOtp(e.target.value)}
                  placeholder="9821" 
                  required 
                />
              </div>
              <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                Verify Balance & Pay
              </button>
            </form>
          )}

          {/* Zipit Panel */}
          {activeSubTab === 'zipit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Select Source Zimbabwean Bank</label>
                <select className="form-input" style={{ background: '#070a13' }} value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                  <option value="Stanbic Bank">Stanbic Bank Zimbabwe</option>
                  <option value="CBZ Bank">CBZ Bank</option>
                  <option value="CABS">CABS</option>
                  <option value="FBC Bank">FBC Bank</option>
                </select>
              </div>

              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed var(--gold-primary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong style={{ color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Landmark size={14} /> ZIPIT Transfer Details:
                </strong>
                <span>Bank: <strong>Stanbic Bank</strong></span>
                <span>Account Number: <strong>10023489210</strong></span>
                <span>Transfer Reference: <strong style={{ fontFamily: 'monospace' }}>ZIPIT-CARUP-ESC</strong></span>
              </div>

              <button className="btn-gold" onClick={triggerZipitPayment}>
                Confirm Zipit Transfer Made
              </button>
            </div>
          )}

          {/* Diaspora Panel */}
          {activeSubTab === 'diaspora' && (
            <form onSubmit={triggerDiasporaPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--emerald-glow)', border: '1px solid var(--emerald-primary)', padding: '12px', borderRadius: '8px', fontSize: '12px', display: 'flex', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: 'var(--emerald-light)', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--emerald-light)', display: 'block' }}>ZIMRA Automated Custom Split:</strong>
                  <span style={{ display: 'block', marginBottom: '6px' }}>
                    This portal automatically routes 15% custom duty payments directly into the ZIMRA Custom Account, and locks 85% in Secure Purchase Escrow. Real-time border clearance.
                  </span>
                  {selectedVehicles.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', marginTop: '6px', fontSize: '11px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>ZIMRA Split (15%):</span>
                        <p style={{ fontWeight: 'bold', color: '#fff' }}>USD ${(totalPrice * 0.15).toLocaleString()}</p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Escrow Split (85%):</span>
                        <p style={{ fontWeight: 'bold', color: 'var(--emerald-light)' }}>USD ${(totalPrice * 0.85).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Visa / MasterCard / Mukuru remittance card</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={diasporaCard}
                  onChange={(e) => setDiasporaCard(e.target.value)}
                  placeholder="4000 1234 5678 9010" 
                  required 
                />
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                Authorize Card & Trigger Duty Split
              </button>
            </form>
          )}

          {/* Simulated Loading Payment */}
          {processingPayment && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(7, 10, 19, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
              borderRadius: '12px',
              zIndex: 10
            }}>
              <RefreshCw size={24} style={{ color: 'var(--gold-primary)', animation: 'spin 2s infinite linear' }} />
              <strong style={{ color: 'var(--gold-light)' }}>Interfacing Zimbabwe Banking Gateway...</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Confirming double-entry ledger security</span>
            </div>
          )}

          {/* EcoCash PIN USSD Modal Overlay */}
          {showUssdPrompt && (
            <div className="modal-overlay">
              <GlassCard className="modal-content glow-gold" style={{ background: '#1c1917', border: '2px solid var(--gold-primary)', maxWidth: '320px', width: '100%', padding: '24px', textAlign: 'center' }}>
                <Smartphone size={32} style={{ color: 'var(--gold-primary)', margin: '0 auto 12px auto' }} />
                <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>EcoCash USSD Push Prompt</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Enter EcoCash PIN on your handset to approve <strong>${totalPrice.toLocaleString()} USD</strong> payment to CarUp Escrow.
                </p>
                <input 
                  type="password" 
                  maxLength={4}
                  placeholder="PIN (4 digits)" 
                  className="form-input" 
                  style={{ width: '100%', textAlign: 'center', fontSize: '20px', letterSpacing: '0.2em', marginBottom: '16px', background: '#0c0a09' }}
                  value={ussdPin}
                  onChange={(e) => setUssdPin(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => setShowUssdPrompt(false)}>Cancel</button>
                  <button className="btn-gold" style={{ flex: 1, padding: '8px' }} onClick={confirmEcoCashPin} disabled={ussdPin.length < 4}>Verify PIN</button>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Success messages per channel */}
          {(ecocashSuccess || innbucksSuccess || zipitSuccess || diasporaSuccess) && (
            <div style={{ padding: '16px', background: 'var(--emerald-glow)', border: '1px solid var(--emerald-primary)', borderRadius: '8px', color: 'var(--emerald-light)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} />
                <strong>Funds Safely Escrowed!</strong>
              </div>
              <span>Receipt ID: <strong style={{ fontFamily: 'monospace' }}>TX-ESC-{Date.now().toString().substring(6)}</strong>. Funds are locked securely in the local banking network. Release payment only after vehicle check-off.</span>
            </div>
          )}

        </GlassCard>

        {/* Active Escrow Ledger tracking */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px' }}>Active Escrow Ledger</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {escrows.map(escrow => (
              <div key={escrow.id} style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ fontSize: '15px' }}>{escrow.vehicleName}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>ID: {escrow.id} | Buyer: {escrow.buyer}</span>
                  </div>
                  <Badge variant={escrow.status === 'Settled to Seller' ? 'high' : 'mid'}>
                    {escrow.status}
                  </Badge>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px', fontSize: '13px' }}>
                  <span>Escrow Holder:</span>
                  <strong>${escrow.amount.toLocaleString()} USD</strong>
                </div>

                <EscrowTimeline status={escrow.status} />

                {escrow.status !== 'Settled to Seller' && (
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: 'var(--emerald-primary)', color: '#000' }}
                    onClick={() => handleReleaseFunds(escrow.id)}
                  >
                    Approve Inspection & Release Funds
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, color: 'var(--gold-primary)' }} />
            <span>Escrow compliance checks ZIMRA registration profiles and chassis IDs before enabling the "Release Funds" mechanic. Safety protocols conform to CVR standards.</span>
          </div>
        </GlassCard>

      </div>

    </div>
  )
}
