import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Shield, Cpu, Scale, HelpCircle, Send, Sparkles, AlertTriangle, Info } from 'lucide-react'
import GlassCard from './ui/GlassCard'
import { useApp } from '../context/AppContext'

export default function GutuAI({ contextMode }) {
  const appContext = useApp()
  const vehicles = appContext?.vehicles || []

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
      { sender: 'Gutu-Retail', text: 'Mhoroi! I am Gutu-Retail, your consumer concierge. I help you find verified vehicles, calculate trust averages, or configure SafePay escrows. What car are you looking for today?', time: '09:00', commands: ['Search Honda Fit', 'What is SafePay?', 'Check Trust Index'] }
    ],
    tech: [
      { sender: 'Gutu-Tech', text: 'Hello! Gutu-Tech active. I monitor the PartSentry ledger, cross-examine part serials (ECUs, Engine Blocks, Turbos), and verify installation signatures. Put in a VIN or query mechanical history.', time: '08:52', commands: ['Verify ECU swap', 'Check Service Logs'] },
      { sender: 'user', text: 'Check the gearbox swap logged for the Toyota Hilux AGE-4521.', time: '08:53' },
      { sender: 'Gutu-Tech', text: 'Analyzing PartSentry telemetry logs for Hilux plate AGE-4521... I see Croco Motors logged transmission serial GB-52A-9901. Cryptographic ledger hash is locked at 0a1b2c3d4e5f. Structure is authentic and matches import specifications.', time: '08:54', commands: ['View Crypto Hash', 'Check Import Specs'] }
    ],
    finance: [
      { sender: 'Gutu-Finance', text: 'Gutu-Finance online. Serving banks and insurance underwriters. I compute risk portfolios, compile market valuations, and spot odometer rollback anomalies. How can I help with asset valuation?', time: '09:02', commands: ['Calculate valuation', 'Run Risk Analysis'] }
    ],
    gov: [
      { sender: 'Gutu-Gov', text: 'Gutu-Gov interface initialized. Synchronized with ZIMRA customs portals, CVR title registrations, and VID vehicle inspection logs. Ready for compliance searches.', time: '09:05', commands: ['Audit ZIMRA customs', 'Verify VID check'] },
      { sender: 'user', text: 'Audit ZIMRA customs status on Honda Fit hybrid plate AFH-8921.', time: '09:06' },
      { sender: 'Gutu-Gov', text: 'COMPLIANCE AUDIT WARNING: Honda Fit Plate AFH-8921 is missing verified ZIMRA Form 21 customs clearance records in the registry database. Recommend requesting ZIMRA duty clearance documents from the seller before initiating SafePay escrow holding.', time: '09:07', isWarning: true, commands: ['Request Clearance Docs', 'Hold Escrow'] }
    ],
    core: [
      { sender: 'Gutu-Core', text: 'Gutu-Core administrator console. Moderating transactions, monitoring server handshakes, and reviewing fraud alerts across the network. System status: NORMAL.', time: '09:00', commands: ['Check Node Status', 'View Fraud Alerts'] }
    ]
  })

  const promptChips = {
    retail: ['Find a Toyota Corolla', 'Explain SafePay escrow', 'How is Trust Index calculated?'],
    tech: ['Verify ECU swap', 'Check recent service logs', 'Validate mileage telemetry'],
    finance: ['Estimate insurance cost', 'Calculate valuation', 'Run risk portfolio analysis'],
    gov: ['Audit ZIMRA customs', 'Check CVR registry', 'Verify police clearance'],
    core: ['System status report', 'View active network nodes', 'Check dispute queue']
  }
  
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, activeDept])

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

  const handleSendMessage = (e, textOverride = null) => {
    if (e) e.preventDefault()
    const textToUse = textOverride !== null ? textOverride : inputText
    if (!textToUse.trim()) return

    const userMsg = {
      sender: 'user',
      text: textToUse,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => ({
      ...prev,
      [activeDept]: [...prev[activeDept], userMsg]
    }))

    const queryText = textToUse
    if (textOverride === null) setInputText('')
    setIsTyping(true)

    // Dynamic, context-aware responses matching each department domain
    setTimeout(() => {
      let aiResponse = ''
      const q = queryText.toLowerCase()
      
      if (activeDept === 'retail') {
        const foundVehicle = vehicles.find(v => q.includes(v.make.toLowerCase()) || q.includes(v.model.toLowerCase()))
        if (foundVehicle) {
          aiResponse = `I found a ${foundVehicle.year} ${foundVehicle.make} ${foundVehicle.model} in our verified inventory with a ${foundVehicle.trustIndex}% trust score. SafePay escrow is fully enabled. Price is $${foundVehicle.price.toLocaleString()}.`
        } else if (q.includes('safepay') || q.includes('payment')) {
          aiResponse = 'SafePay is our premium transaction system. You can securely pay via EcoCash, InnBucks, Zipit, or Diaspora remittance. The funds will be held in our bank escrow until you physically inspect the car.'
        } else {
          aiResponse = 'I can help you search our verified marketplace or review a car’s digital passport. Feel free to ask about specific vehicle brands like Toyota, Honda, or about our trust ratings!'
        }
      } 
      else if (activeDept === 'tech') {
        const foundVehicle = vehicles.find(v => q.includes(v.licensePlate.toLowerCase()) || q.includes(v.vin.toLowerCase()))
        if (foundVehicle && (q.includes('ecu') || q.includes('parts') || q.includes('gearbox'))) {
          const partsInfo = foundVehicle.parts.map(p => `${p.name} (${p.status})`).join(', ')
          aiResponse = `Analyzing PartSentry telemetry for ${foundVehicle.licensePlate}... Logged parts: ${partsInfo}. Cryptographic ledger hashes are locked and structures are authentic.`
        } else if (foundVehicle && (q.includes('odometer') || q.includes('mileage'))) {
          aiResponse = `I monitor mileage progression metrics. For plate ${foundVehicle.licensePlate}, current recorded mileage is ${foundVehicle.mileage} km. Verify with latest service logs.`
        } else {
          aiResponse = 'Diagnostics engine online. Provide a VIN or License Plate to verify PartSentry serial keys, mechanical logs, or installation timestamps.'
        }
      }
      else if (activeDept === 'finance') {
        const foundVehicle = vehicles.find(v => q.includes(v.make.toLowerCase()) || q.includes(v.model.toLowerCase()))
        if (foundVehicle && (q.includes('valuation') || q.includes('price'))) {
          aiResponse = `Based on underwriting score analysis, the ${foundVehicle.make} ${foundVehicle.model} is valued at $${foundVehicle.price.toLocaleString()}. With a trust index of ${foundVehicle.trustIndex}%, the risk quotient is acceptable.`
        } else {
          aiResponse = 'Underwriting score analysis ready. I can compute vehicle residual values or check insurance history risk quotients. Ask me about a specific vehicle model.'
        }
      }
      else if (activeDept === 'gov') {
        const foundVehicle = vehicles.find(v => q.includes(v.licensePlate.toLowerCase()) || q.includes(v.vin.toLowerCase()))
        if (foundVehicle && (q.includes('zimra') || q.includes('customs'))) {
          if (foundVehicle.documents.zimra === 'verified') {
            aiResponse = `Customs compliance check passed for ${foundVehicle.licensePlate}. ZIMRA Form 21 clearance is fully verified.`
          } else {
            aiResponse = `COMPLIANCE AUDIT WARNING: ${foundVehicle.make} ${foundVehicle.model} (Plate ${foundVehicle.licensePlate}) is missing verified ZIMRA Form 21 customs clearance records. Recommend requesting ZIMRA duty clearance documents.`
          }
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isWarning: aiResponse.includes('WARNING')
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
    <div className="grid-layout-split gutu-chat-layout" style={{ height: 'calc(100vh - 120px)', minHeight: '600px' }}>
      
      {/* Department Selector Sidebar */}
      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
          <Sparkles className="text-theme-accent" size={24} />
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Gutu AI Agents</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
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
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: `1px solid ${isSelected ? dept.avatarColor : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? `0 8px 32px -8px ${dept.avatarColor}40` : 'none'
                }}
                onClick={() => {
                  setActiveDept(key)
                  setIsTyping(false)
                }}
                className="hover-card"
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: isSelected ? dept.avatarColor : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#000' : 'var(--text-white)',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  <IconComp size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: isSelected ? 'var(--text-white)' : 'var(--text-muted)' }}>{dept.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted-dark)', display: 'block', marginTop: '4px', lineHeight: '1.4' }}>{dept.title}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px', alignItems: 'flex-start', lineHeight: '1.5' }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--theme-accent)' }} />
          <span>Gutu is powered by high-performance Large Language models mapped directly to Zimbabwean vehicle registries, tax duties, and telemetry decoders.</span>
        </div>
      </GlassCard>

      {/* Dynamic Chat console */}
      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-solid-card)', position: 'relative', padding: '24px' }}>
        
        {/* Active Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)' }}>
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
                  gap: '8px',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    {msg.isWarning && <AlertTriangle size={18} style={{ color: 'var(--red-primary)', flexShrink: 0, marginTop: '2px' }} className="animate-pulse" />}
                    <div>{msg.text}</div>
                  </div>
                  {msg.commands && msg.commands.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', width: '100%' }}>
                      {msg.commands.map((cmd, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(null, cmd)}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-glass)',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: 'var(--theme-accent)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.05)'
                          }}
                        >
                          {cmd}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted-dark)', padding: '0 4px' }}>{msg.sender === 'user' ? 'You' : msg.sender} • {msg.time}</span>
              </div>
            )
          })}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-glass)', maxWidth: '75%' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', background: activeInfo.avatarColor, borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                <div style={{ width: '6px', height: '6px', background: activeInfo.avatarColor, borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                <div style={{ width: '6px', height: '6px', background: activeInfo.avatarColor, borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
              </div>
              <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.5; } 40% { transform: scale(1.0); opacity: 1; } }`}</style>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{activeInfo.name} is compiling telemetry...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Predictive Prompt Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {promptChips[activeDept].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(null, chip)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-glass)',
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                color: 'var(--text-light)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.08)'
                e.target.style.borderColor = activeInfo.avatarColor
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.03)'
                e.target.style.borderColor = 'var(--border-glass)'
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => handleSendMessage(e)} style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder={`Ask ${activeInfo.name} something...`} 
              className="form-input" 
              style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', fontSize: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: 'white' }}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0 24px', borderRadius: '12px', height: 'auto', background: activeInfo.avatarColor, color: '#000', border: 'none', transition: 'transform 0.2s ease', transform: inputText.trim() ? 'scale(1)' : 'scale(0.98)', opacity: inputText.trim() ? 1 : 0.7 }} disabled={isTyping || !inputText.trim()}>
            <Send size={20} />
          </button>
        </form>

      </GlassCard>

    </div>
  )
}
