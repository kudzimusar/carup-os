import React, { useState, useEffect } from 'react'
import { MessageSquare, Shield, Cpu, Scale, HelpCircle, Send, Check } from 'lucide-react'

export default function GutuAI({ contextMode }) {
  const [activeDept, setActiveDept] = useState('retail') // retail, tech, finance, gov, core
  const [inputText, setInputText] = useState('')

  // Sync active department with active Portal Mode context
  useEffect(() => {
    if (contextMode === 'consumer') setActiveDept('retail')
    else if (contextMode === 'garage') setActiveDept('tech')
    else if (contextMode === 'corporate') setActiveDept('finance')
    else if (contextMode === 'government') setActiveDept('gov')
  }, [contextMode])
  const [messages, setMessages] = useState({
    retail: [
      { sender: 'Gutu-Retail', text: 'Mhoroi! I am Gutu-Retail, your consumer concierge. I help you find verified vehicles, calculate trust averages, or configure SafePay escrows. What car are you looking for today?', time: '09:00' }
    ],
    tech: [
      { sender: 'Gutu-Tech', text: 'Hello! Gutu-Tech active. I monitor the PartSentry ledger, cross-examine part serials (ECUs, Engine Blocks, Turbos), and verify installation signatures. Put in a VIN or query mechanical history.', time: '08:52' },
      { sender: 'user', text: 'Check the gearbox swap logged for the Toyota Hilux AGE-4521.', time: '08:53' },
      { sender: 'Gutu-Tech', text: 'Analyzing PartSentry telemetry logs for Hilux plate AGE-4521... I see Croco Motors logged transmission serial GB-52A-9901. Cryptographic ledger hash is locked at 0a1b2c3d4e5f. Structure is authentic and matches import specifications.', time: '08:54' }
    ],
    finance: [
      { sender: 'Gutu-Finance', text: 'Gutu-Finance online. Serving banks and insurance underwriters. I compute risk portfolios, compile market valuations, and spot odometer rollback anomalies. How can I help with asset valuation?', time: '09:02' }
    ],
    gov: [
      { sender: 'Gutu-Gov', text: 'Gutu-Gov interface initialized. Synchronized with ZIMRA customs portals, CVR title registrations, and VID vehicle inspection logs. Ready for compliance searches.', time: '09:05' },
      { sender: 'user', text: 'Audit ZIMRA customs status on Honda Fit hybrid plate AFH-8921.', time: '09:06' },
      { sender: 'Gutu-Gov', text: 'COMPLIANCE AUDIT WARNING: Honda Fit Plate AFH-8921 is missing verified ZIMRA Form 21 customs clearance records in the registry database. Recommend requesting ZIMRA duty clearance documents from the seller before initiating SafePay escrow holding.', time: '09:07', isWarning: true }
    ],
    core: [
      { sender: 'Gutu-Core', text: 'Gutu-Core administrator console. Moderating transactions, monitoring server handshakes, and reviewing fraud alerts across the network. System status: NORMAL.', time: '09:00' }
    ]
  })
  
  const [isTyping, setIsTyping] = useState(false)

  const departments = {
    retail: {
      name: 'Gutu-Retail',
      title: 'Consumer & Buyer Agent',
      desc: 'Assists consumers with marketplace search, explains trust indexes, and coordinates buyer-seller communications via WhatsApp links.',
      avatarColor: 'var(--emerald-primary)',
      icon: HelpCircle
    },
    tech: {
      name: 'Gutu-Tech',
      title: 'Workshop & Parts Telemetry',
      desc: 'Integrates with mechanic consoles, tracks physical part swaps, logs installation serial numbers, and signs PartSentry ledger entries.',
      avatarColor: 'var(--blue-primary)',
      icon: Cpu
    },
    finance: {
      name: 'Gutu-Finance',
      title: 'Underwriting & Valuations',
      desc: 'Assesses financial risk, performs algorithmic valuations, checks bank collateral registries, and evaluates insurance validity scores.',
      avatarColor: 'var(--gold-primary)',
      icon: Scale
    },
    gov: {
      name: 'Gutu-Gov',
      title: 'Customs & Title Ingress',
      desc: 'Interfaces with ZIMRA custom files, VID road safety checks, and the police anti-theft squad to verify registration legitimacy.',
      avatarColor: '#ec4899', // Pink
      icon: Shield
    },
    core: {
      name: 'Gutu-Core',
      title: 'Network Administration',
      desc: 'Supervises AI ecosystem consistency, flags fraudulent listings, moderates disputes, and handles developer telemetry feeds.',
      avatarColor: '#8b5cf6', // Purple
      icon: MessageSquare
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMsg = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => ({
      ...prev,
      [activeDept]: [...prev[activeDept], userMsg]
    }))

    const queryText = inputText
    setInputText('')
    setIsTyping(true)

    // Dynamic, context-aware responses matching each department domain
    setTimeout(() => {
      let aiResponse = ''
      
      if (activeDept === 'retail') {
        if (queryText.toLowerCase().includes('hilux') || queryText.toLowerCase().includes('toyota')) {
          aiResponse = 'I found a 2018 Toyota Hilux GD-6 double cab in our verified inventory with a 55% trust score (some documents like ZIMRA custom forms are still uploaded but not verified). SafePay escrow is fully enabled for it!'
        } else if (queryText.toLowerCase().includes('safepay') || queryText.toLowerCase().includes('payment')) {
          aiResponse = 'SafePay is our premium transaction system. You can securely pay via EcoCash, InnBucks, Zipit, or Diaspora remittance. The funds will be held in our bank escrow until you physically inspect the car.'
        } else {
          aiResponse = 'I can help you search our verified marketplace or review a car’s digital passport. Feel free to ask about specific vehicle brands or trust ratings!'
        }
      } 
      else if (activeDept === 'tech') {
        if (queryText.toLowerCase().includes('ecu') || queryText.toLowerCase().includes('parts')) {
          aiResponse = 'PartSentry locks ECU serial block values to check against cloning. When a workshop logs a new unit, we send an instant verification alert to the owner. Approving it records the new hash.'
        } else if (queryText.toLowerCase().includes('odometer') || queryText.toLowerCase().includes('mileage')) {
          aiResponse = 'I monitor mileage progression metrics. In the Honda Fit plate AFH-8921, I flag a warning: the CVR recorded mileage contradicts ZINARA toll logs. Double check before purchase!'
        } else {
          aiResponse = 'Diagnostics engine online. I can verify PartSentry serial keys, mechanical logs, or installation timestamps.'
        }
      }
      else if (activeDept === 'finance') {
        if (queryText.toLowerCase().includes('valuation') || queryText.toLowerCase().includes('price')) {
          aiResponse = 'Valuations are driven by document scoring, service consistency, and parts integrity. A 100% verified vehicle pulls a 12% pricing premium in Zimbabwe due to proof of duty payment.'
        } else {
          aiResponse = 'Underwriting score analysis ready. I can compute vehicle residual values or check insurance history risk quotients.'
        }
      }
      else if (activeDept === 'gov') {
        if (queryText.toLowerCase().includes('zimra') || queryText.toLowerCase().includes('customs')) {
          aiResponse = 'Customs compliance checks scan for matching ZIMRA Form 21 clearances. For imported vehicles, this seals the tax split records. Standard clearance time: 45 milliseconds.'
        } else {
          aiResponse = 'CVR title registries are synchronized. Ask me to audit registration plates, CID clearances, or customs entry bills.'
        }
      }
      else {
        aiResponse = 'Telemetry logs check complete. Network nodes are operating normally. SafePay contracts are sealed, and Parts Ledger checksums are securely locked.'
      }

      const aiMsg = {
        sender: departments[activeDept].name,
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => ({
        ...prev,
        [activeDept]: [...prev[activeDept], aiMsg]
      }))
      
      setIsTyping(false)
    }, 1500)
  }

  const activeInfo = departments[activeDept]
  const ActiveIcon = activeInfo.icon

  return (
    <div className="grid-layout-split gutu-chat-layout">
      
      {/* Department Selector Sidebar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>AI Departments</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {Object.keys(departments).map(key => {
            const dept = departments[key]
            const IconComp = dept.icon
            const isSelected = activeDept === key
            return (
              <div 
                key={key} 
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(255,255,255,0.03)' : 'transparent',
                  border: `1px solid ${isSelected ? dept.avatarColor : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => {
                  setActiveDept(key)
                  setIsTyping(false)
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isSelected ? dept.avatarColor : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#000' : 'var(--text-white)',
                  flexShrink: 0
                }}>
                  <IconComp size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', color: isSelected ? 'var(--text-white)' : 'var(--text-muted)' }}>{dept.name}</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted-dark)', display: 'block', marginTop: '2px' }}>{dept.title}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '11px', color: 'var(--text-muted)' }}>
          Gutu is powered by high-performance Large Language models mapped directly to Zimbabwean vehicle registries, tax duties, and telemetry decoders.
        </div>
      </div>

      {/* Dynamic Chat console */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-solid-card)', position: 'relative' }}>
        
        {/* Active Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: activeInfo.avatarColor,
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ActiveIcon size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px' }}>{activeInfo.name} — {activeInfo.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeInfo.desc}</p>
          </div>
        </div>

        {/* Chat Feed Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '400px'
        }}>
          {messages[activeDept].map((msg, idx) => {
            const isUser = msg.sender === 'user'
            return (
              <div 
                key={idx} 
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  background: isUser ? 'var(--theme-glow-strong)' : msg.isWarning ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isUser ? 'var(--theme-accent)' : msg.isWarning ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-glass)'}`,
                  color: isUser ? 'var(--text-white)' : 'var(--text-light)',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  {msg.isWarning && <Shield size={16} style={{ color: 'var(--red-primary)', flexShrink: 0, marginTop: '2px' }} className="animate-pulse" />}
                  <div>{msg.text}</div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted-dark)' }}>{msg.sender === 'user' ? 'You' : msg.sender} • {msg.time}</span>
              </div>
            )
          })}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{
                width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both'
              }}></div>
              <div style={{
                width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s'
              }}></div>
              <div style={{
                width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s'
              }}></div>
              <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }`}</style>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Gutu is compiling telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
          <input 
            type="text" 
            placeholder={`Ask ${activeInfo.name} something (e.g. "Check the gearbox swap" or "Audit plate AFH-8921")...`} 
            className="form-input" 
            style={{ flex: 1 }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 20px' }} disabled={isTyping}>
            <Send size={16} />
          </button>
        </form>

      </div>

    </div>
  )
}
