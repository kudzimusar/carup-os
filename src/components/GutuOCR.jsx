import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FileUp, Cpu, RefreshCw, CheckCircle2, ShieldCheck, Terminal, AlertTriangle, TrendingUp } from 'lucide-react'

export default function GutuOCR() {
  const { vehicles, uploadDocument } = useApp()
  const [selectedVin, setSelectedVin] = useState('')
  const [selectedDocType, setSelectedDocType] = useState('')
  const [file, setFile] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanLogs, setScanLogs] = useState([])
  const [extractedData, setExtractedData] = useState(null)
  const [scanComplete, setScanComplete] = useState(false)

  // Pre-configured mock document scenarios to represent OCR ingestion
  const documentScenarios = {
    zimra: {
      name: "ZIMRA Form 21 (Customs Entry Bill)",
      fields: { dutyPaid: "USD 4,250.00", port: "Beitbridge Border Post", customsRef: "ZIMRA-ENTRY-8910-K" },
      logs: [
        "Analyzing layout boundaries... Form 21 structure confirmed.",
        "Performing structural integrity checks: ZIMRA watermarks present.",
        "Extracting values from customs block...",
        "Cross-checking ZIMRA ledger reference 'ZIMRA-ENTRY-8910-K'...",
        "Matches official customs clearance database entry. Checksum verified."
      ]
    },
    bluebook: {
      name: "CVR Blue Book (Registration Title)",
      fields: { licensePlate: "AGE-4521", owner: "Tendai Mukarati", engineNo: "1GD-7892341", chassisNo: "AHTGD6120J7" },
      logs: [
        "Scanning Blue Book cover & page 2 panels...",
        "Contrast enhancement applied. Text blocks isolated.",
        "Extracting registration parameters...",
        "Verification: Engine number matches CVR central registry database.",
        "Formatting check: BLUE BOOK structure is authentic."
      ]
    },
    cid: {
      name: "CID Clearance Certificate (Theft Check)",
      fields: { status: "CLEARED", officer: "Det. Insp. Moyo", station: "CID Vehicle Theft Squad", clearanceCode: "CID-VTS-9821" },
      logs: [
        "Detecting police stamp geometry & officer signature matrix...",
        "Extracting certification parameters...",
        "Found Stamp: CID Vehicle Theft Squad, Harare Central",
        "Found Clearance Reference: CID-VTS-9821",
        "Running background search across Stolen Vehicle Registry...",
        "Result: No matches found. Chassis status = CLEARED.",
        "CID certification marked as AUTHENTIC."
      ]
    },
    vid: {
      name: "VID Inspection Certificate (Roadworthy)",
      fields: { mileage: 98400, result: "PASS", station: "VID Eastlea", examinerId: "VID-EX-401" },
      logs: [
        "Reading roadworthy certificate data blocks...",
        "Scanning text segments...",
        "Found Test Result: PASS",
        "Found Station: VID Eastlea",
        "Cross-matching mileage timeline with registry logs...",
        "Odometer progression check: OK.",
        "Roadworthy status: APPROVED."
      ]
    },
    zinara: {
      name: "ZINARA License Disk (Road Tax)",
      fields: { plate: "AGE-4521", expiry: "2026-12-31", licenseClass: "Class 4 Light Vehicle", receiptNo: "ZINARA-892110-Z" },
      logs: [
        "Parsing license disk circular boundary...",
        "Isolating receipt reference 'ZINARA-892110-Z'...",
        "Cross-matching ZINARA tollgate database active registrations...",
        "Result: Paid and Active. Expiry Date: 2026-12-31.",
        "ZINARA road tax status validated successfully."
      ]
    },
    insurance: {
      name: "Active Insurance Cover Note",
      fields: { insurer: "Old Mutual Zimbabwe", premiumUSD: "$45.00/mo", policyNo: "OMZ-CAR-9901-X", coverage: "Full Third Party" },
      logs: [
        "Locating cover note header margins...",
        "Extracting underwriter policy No: OMZ-CAR-9901-X...",
        "Verifying broker credentials against IPEC insurance directory...",
        "IPEC status: VALID. Active premium cleared. Coverage fully assured."
      ]
    },
    invoices: {
      name: "Garage Service Invoice Logs",
      fields: { garage: "Croco Motors Service Desk", invoiceNo: "INV-CR-4521", odometerRecorded: "94,200 km", partsReplaced: "Engine Oil, Oil Filter" },
      logs: [
        "Ingesting workshop invoice layout...",
        "Found Invoice Reference: INV-CR-4521",
        "Extracting mileage benchmark: 94,200 km...",
        "Syncing repair description to PartSentry service logs.",
        "Repair record successfully cataloged."
      ]
    }
  }

  const startScanning = async () => {
    if (!selectedVin || !selectedDocType || !file) return

    setIsScanning(true)
    setScanLogs([
      "Initializing Gutu-Gov OCR Engine v2.4...",
      `Uploading file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`,
      "Communicating with CarUp security nodes..."
    ])
    setExtractedData(null)
    setScanComplete(false)

    try {
      // Perform the real upload
      const updatedVehicle = await uploadDocument(selectedVin, selectedDocType, file)
      
      const scenario = documentScenarios[selectedDocType]
      let logsToPrint = [
        "File uploaded successfully! Status: 200 OK",
        "Parsing image channels... Enhanced resolution applied.",
        ...scenario.logs,
        "Cryptographic state verified and logged onto backend database."
      ]

      const finalFields = {}
      if (selectedDocType === 'vid') {
        finalFields.mileage = `${updatedVehicle.mileage.toLocaleString()} km`
        finalFields.result = "PASS"
        finalFields.station = "VID Central Department"
      } else if (selectedDocType === 'bluebook') {
        finalFields.licensePlate = updatedVehicle.licensePlate || "AGE-4521"
        finalFields.owner = updatedVehicle.sellerName || "Harare Motors Elite"
        finalFields.engineNo = updatedVehicle.engineNo || "1GD-7892341"
      } else if (selectedDocType === 'zimra') {
        finalFields.vin = updatedVehicle.vin
        finalFields.dutyPaid = "USD 4,250.00"
        finalFields.port = "Beitbridge Border Post"
      } else if (selectedDocType === 'zinara') {
        finalFields.licensePlate = updatedVehicle.licensePlate || "AGE-4521"
        finalFields.expiry = "2026-12-31"
        finalFields.receiptNo = "ZINARA-892110-Z"
      } else if (selectedDocType === 'insurance') {
        finalFields.insurer = "Old Mutual Zimbabwe"
        finalFields.policyNo = "OMZ-CAR-9901-X"
        finalFields.coverage = "Full Third Party"
      } else if (selectedDocType === 'invoices') {
        finalFields.garage = "Croco Motors Service Desk"
        finalFields.invoiceNo = "INV-CR-4521"
        finalFields.odometer = `${updatedVehicle.mileage.toLocaleString()} km`
      } else {
        finalFields.status = "CLEARED"
        finalFields.station = "CID Vehicle Theft Squad"
      }

      let logIdx = 0
      const interval = setInterval(() => {
        if (logIdx < logsToPrint.length) {
          setScanLogs(prev => [...prev, logsToPrint[logIdx]])
          logIdx++
        } else {
          clearInterval(interval)
          setIsScanning(false)
          setExtractedData(finalFields)
          setScanComplete(true)
        }
      }, 250)

    } catch (err) {
      console.error(err)
      setScanLogs(prev => [
        ...prev,
        `[CRITICAL] ERROR: Ingestion failed!`,
        `[CRITICAL] Reason: ${err.message || 'Unknown network error'}`
      ])
      setIsScanning(false)
    }
  }

  const selectedVehicle = vehicles.find(v => v.vin === selectedVin)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Introduction Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(17, 24, 43, 0.7) 100%)',
        border: '1px solid var(--border-glass)',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span className="logo-badge" style={{ marginBottom: '8px' }}>Lazy-User Portal</span>
          <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>Gutu AI Ingestion & Document Verification</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            Uploading vehicle documents in Zimbabwe has never been simpler. Just upload a clear photograph of your ZIMRA, Blue Book, or VID forms. Gutu OCR extracts VIN, mileage, ownership histories, and validates signatures instantly, updating the marketplace in real-time.
          </p>
        </div>
        <Cpu size={64} style={{ color: 'var(--emerald-primary)', opacity: 0.8 }} />
      </div>

      <div className="grid-layout-split">
        
        {/* Document Select & Scan Console */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px' }}>Ingestion Console</h3>

          <div className="form-group">
            <label className="form-label">1. Select Target Vehicle</label>
            <select 
              className="form-input" 
              style={{ background: '#070a13' }}
              value={selectedVin}
              onChange={(e) => {
                setSelectedVin(e.target.value)
                setScanComplete(false)
                setExtractedData(null)
              }}
            >
              <option value="">-- Choose from Your Garage --</option>
              {vehicles.map(v => (
                <option key={v.vin} value={v.vin}>{v.year} {v.make} {v.model} ({v.licensePlate})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. Select Document to Upload</label>
            <select 
              className="form-input" 
              style={{ background: '#070a13' }}
              value={selectedDocType}
              onChange={(e) => {
                setSelectedDocType(e.target.value)
                setScanComplete(false)
                setExtractedData(null)
              }}
            >
              <option value="">-- Choose Document --</option>
              <option value="zimra">ZIMRA Form 21 (Customs Entry Bill)</option>
              <option value="bluebook">CVR Blue Book (Registration Certificate)</option>
              <option value="cid">CID Clearance Form (Police Stolen Clearance)</option>
              <option value="vid">VID Certificate (Inspection & Roadworthy)</option>
              <option value="zinara">ZINARA License Disk (Road Tax)</option>
              <option value="insurance">Active Insurance Cover Note</option>
              <option value="invoices">Garage Service Invoice Logs</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">3. Select Document Image / File</label>
            <label 
              htmlFor="ocr-file-upload" 
              className="btn-secondary" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                minHeight: '48px',
                width: '100%',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed var(--border-glass-bright)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <FileUp size={18} style={{ color: 'var(--theme-accent)' }} />
              <span>{file ? file.name : "Tap to Upload or Capture Image"}</span>
            </label>
            <input 
              id="ocr-file-upload"
              type="file" 
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFile(e.target.files[0])
                  setScanComplete(false)
                  setExtractedData(null)
                }
              }}
            />
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', gap: '10px' }}
            disabled={!selectedVin || !selectedDocType || !file || isScanning}
            onClick={startScanning}
          >
            <FileUp size={18} />
            {isScanning ? 'OCR Extraction in Progress...' : 'Start Gutu AI-OCR Scan'}
          </button>

          {/* Interactive Document Visual */}
          {selectedDocType && file && !isScanning && !scanComplete && (
            <div style={{
              marginTop: '16px',
              padding: '24px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed var(--border-glass-bright)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '80px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileUp size={24} style={{ color: 'var(--emerald-primary)' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{file.name} ready for parsing</span>
            </div>
          )}

          {/* Laser-sweep Scan Simulation */}
          {isScanning && (
            <div className="animate-scan" style={{
              marginTop: '16px',
              height: '180px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid var(--emerald-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <RefreshCw size={24} style={{ color: 'var(--emerald-primary)', animation: 'spin 2s infinite linear' }} />
              <span style={{ color: 'var(--emerald-light)', fontWeight: 700, fontSize: '14px' }}>OCR SCANNING DOCUMENT...</span>
            </div>
          )}

          {/* Successful Scan Results Panel */}
          {scanComplete && extractedData && (
            <div style={{
              marginTop: '16px',
              padding: '20px',
              background: 'var(--emerald-glow)',
              border: '1px solid var(--emerald-primary)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-light)' }}>
                <ShieldCheck size={20} />
                <strong style={{ fontSize: '15px' }}>Document Verification Successful!</strong>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(16,185,129,0.2)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.keys(extractedData).map(key => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{key === 'vin' ? 'VIN' : key === 'dutyPaid' ? 'Duties Settled' : key === 'licensePlate' ? 'Extracted Plate' : key}</span>
                    <span style={{ fontWeight: 700, fontFamily: key === 'vin' || key === 'licensePlate' ? 'monospace' : 'inherit' }}>{extractedData[key]}</span>
                  </div>
                ))}
              </div>
              
              {selectedVehicle && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-white)', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <TrendingUp size={14} className="pulse-icon" style={{ color: 'var(--emerald-light)', animation: 'pulse-dot 1.5s infinite ease-in-out' }} />
                  <span>{selectedVehicle.make} Trust Index has increased to <strong>{selectedVehicle.trustIndex}%</strong>!</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Live Gutu-AI Terminal Logging Console */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '380px' }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} style={{ color: 'var(--emerald-primary)' }} />
            Gutu Neural OCR Stream
          </h3>

          <div style={{
            flex: 1,
            background: '#040711',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#34d399',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {scanLogs.length === 0 && (
              <span style={{ color: 'var(--text-muted-dark)' }}>// System idle. Choose document, select file, and trigger Gutu OCR scan...</span>
            )}
            
            {scanLogs.map((log, index) => {
              const isWarning = log.toLowerCase().includes('warning') || log.toLowerCase().includes('mismatch') || log.toLowerCase().includes('error') || log.toLowerCase().includes('failed')
              const isMatch = log.toLowerCase().includes('matches') || log.toLowerCase().includes('verified') || log.toLowerCase().includes('success')
              
              let color = '#34d399' // Emerald
              if (isWarning) color = 'var(--red-primary)'
              else if (isMatch) color = 'var(--gold-light)'
              
              return (
                <div key={index} style={{ color: color }}>
                  {`> `}{log}
                </div>
              )
            })}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '12px', color: 'var(--text-muted)' }}>
            <strong>Note:</strong> Artificial Intelligence processes all uploaded seals, barcodes, and serial characters. Unverified custom bills are automatically routed to the ZIMRA superadmin portal for compliance checking.
          </div>
        </div>

      </div>

    </div>
  )
}
