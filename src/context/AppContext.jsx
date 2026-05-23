import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

// Mock data representing a diverse set of vehicles in Zimbabwe
const initialVehicles = [
  {
    vin: "AHTGD6120J7892110",
    licensePlate: "AGE-4521",
    make: "Toyota",
    model: "Hilux GD-6 Double Cab",
    year: 2018,
    price: 32500, // in USD
    mileage: 94200,
    engineNo: "1GD-7892341",
    ecuSerial: "DENSO-8921-X99",
    gearboxSerial: "GB-52A-9901",
    transmission: "Automatic",
    fuel: "Diesel",
    color: "Granite Grey",
    sellerType: "Verified Dealer",
    sellerName: "Harare Motors Elite",
    trustIndex: 55, // Out of 100
    documents: {
      zimra: "missing", // ZIMRA Form 21 (Customs clearance)
      bluebook: "uploaded", // CVR Blue Book (Ownership)
      cid: "missing", // CID Clearance (Theft verification)
      vid: "verified", // VID Certificate (Roadworthiness)
      zinara: "verified", // ZINARA Road tax
      insurance: "uploaded", // Active Insurance note
      invoices: "uploaded" // Garage service invoices
    },
    historyLogs: [
      { date: "2018-04-12", type: "import", desc: "Imported via Beitbridge Port of Entry. Custom duties processed.", source: "ZIMRA", verified: false },
      { date: "2018-05-02", type: "mileage", desc: "First registration. Odometer reading: 12 km.", source: "CVR", verified: true },
      { date: "2020-08-15", type: "service", desc: "Scheduled service at 45,000 km. Engine oil, filters replaced.", source: "Croco Motors", verified: true },
      { date: "2023-11-20", type: "mileage", desc: "VID roadworthiness certificate issued. Odometer: 82,100 km.", source: "VID Department", verified: true },
      { date: "2025-02-18", type: "insurance", desc: "Third-party insurance coverage updated.", source: "Old Mutual Zimbabwe", verified: true }
    ],
    parts: [
      { id: "1", name: "Engine Block", serial: "1GD-7892341", status: "verified", dateInstalled: "2018-03-01", workshop: "Toyota Factory", hash: "8d9e2a1b5c3f" },
      { id: "2", name: "ECU (Main Unit)", serial: "DENSO-8921-X99", status: "verified", dateInstalled: "2018-03-01", workshop: "Toyota Factory", hash: "9f8c7b6a5d4e" },
      { id: "3", name: "Transmission / Gearbox", serial: "GB-52A-9901", status: "verified", dateInstalled: "2018-03-01", workshop: "Toyota Factory", hash: "0a1b2c3d4e5f" },
      { id: "4", name: "Turbocharger Unit", serial: "TB-HILUX-33", status: "verified", dateInstalled: "2022-09-14", workshop: "Croco Motors", hash: "a3b4c5d6e7f8" }
    ]
  },
  {
    vin: "JAPFIT1500GD88219",
    licensePlate: "AFH-8921",
    make: "Honda",
    model: "Fit Hybrid",
    year: 2016,
    price: 6800, // in USD
    mileage: 145000,
    engineNo: "L15B-3382104",
    ecuSerial: "KEIHIN-FIT-22",
    gearboxSerial: "CVT-HN-882",
    transmission: "CVT Auto",
    fuel: "Hybrid/Petrol",
    color: "Pearl White",
    sellerType: "Private Seller",
    sellerName: "Tendai Mukarati",
    trustIndex: 35,
    documents: {
      zimra: "missing",
      bluebook: "missing",
      cid: "missing",
      vid: "missing",
      zinara: "uploaded",
      insurance: "missing",
      invoices: "missing"
    },
    historyLogs: [
      { date: "2021-09-02", type: "mileage", desc: "First recorded Zimbabwean odometer entry. Odometer: 110,000 km.", source: "ZINARA Tollgate Sync", verified: true },
      { date: "2024-05-14", type: "mileage", desc: "Second recorded entry. Odometer: 142,000 km.", source: "ZINARA Tollgate Sync", verified: true }
    ],
    parts: [
      { id: "1", name: "Engine Block", serial: "L15B-3382104", status: "unverified", dateInstalled: "Unknown", workshop: "Japanese Import", hash: "x3y2z1w0v9u8" },
      { id: "2", name: "ECU (Main Unit)", serial: "KEIHIN-FIT-22", status: "unverified", dateInstalled: "Unknown", workshop: "Japanese Import", hash: "u8v9w0x1y2z3" },
      { id: "3", name: "Transmission / Gearbox", serial: "CVT-HN-882", status: "unverified", dateInstalled: "Unknown", workshop: "Japanese Import", hash: "z3x2c1v0b9n8" }
    ]
  },
  {
    vin: "SADLC1508K0021485",
    licensePlate: "ALB-0010",
    make: "Toyota",
    model: "Land Cruiser Prado TZ-G",
    year: 2019,
    price: 49500, // in USD
    mileage: 62000,
    engineNo: "1KD-9983412",
    ecuSerial: "DENSO-LC-900",
    gearboxSerial: "GB-LC-A9",
    transmission: "Automatic",
    fuel: "Diesel",
    color: "Obsidian Black",
    sellerType: "Certified Dealer",
    sellerName: "Zim Auto Galleries",
    trustIndex: 90,
    documents: {
      zimra: "verified",
      bluebook: "verified",
      cid: "verified",
      vid: "verified",
      zinara: "verified",
      insurance: "verified",
      invoices: "verified"
    },
    historyLogs: [
      { date: "2019-09-15", type: "import", desc: "Imported via Durban Port of Entry. Fully verified customs, ZIMRA duties cleared under custom entry bill #ZIMRA-8921-99A.", source: "ZIMRA", verified: true },
      { date: "2019-10-01", type: "mileage", desc: "CVR registration Blue Book issued. Odometer: 15 km.", source: "CVR Office", verified: true },
      { date: "2021-10-05", type: "service", desc: "Service completed at 20,000 km milestone.", source: "Toyota Zimbabwe", verified: true },
      { date: "2023-04-12", type: "service", desc: "Major service completed at 40,000 km. Brakes, auxiliary belts replaced.", source: "Toyota Zimbabwe", verified: true },
      { date: "2025-06-18", type: "mileage", desc: "VID comprehensive vehicle test completed.", source: "VID Department", verified: true }
    ],
    parts: [
      { id: "1", name: "Engine Block", serial: "1KD-9983412", status: "verified", dateInstalled: "2019-08-01", workshop: "Toyota Factory", hash: "f8e7d6c5b4a3" },
      { id: "2", name: "ECU (Main Unit)", serial: "DENSO-LC-900", status: "verified", dateInstalled: "2019-08-01", workshop: "Toyota Factory", hash: "a3b4c5d6e7f8" },
      { id: "3", name: "Transmission / Gearbox", serial: "GB-LC-A9", status: "verified", dateInstalled: "2019-08-01", workshop: "Toyota Factory", hash: "9d8e7f6a5b4c" }
    ]
  }
]

export const AppProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [notifications, setNotifications] = useState([])
  const [escrows, setEscrows] = useState([])
  const [whatsappQueue, setWhatsappQueue] = useState([])
  const [adminMetrics, setAdminMetrics] = useState({
    vehicles: 0,
    parts: 0,
    pendingParts: 0,
    escrows: 0,
    settledEscrows: 0,
    blockchainBlocks: 0,
    totalCommissions: 0,
    whatsappMessages: 0,
    whatsappPending: 0,
    chats: 0
  })

  const fetchState = async () => {
    try {
      const [vehiclesRes, notificationsRes, escrowsRes, whatsappRes, metricsRes] = await Promise.all([
        fetch('http://localhost:5000/api/vehicles'),
        fetch('http://localhost:5000/api/notifications'),
        fetch('http://localhost:5000/api/escrows'),
        fetch('http://localhost:5000/api/whatsapp/queue'),
        fetch('http://localhost:5000/api/admin/metrics')
      ])

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData)
      }
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        setNotifications(notificationsData)
      }
      if (escrowsRes.ok) {
        const escrowsData = await escrowsRes.json()
        setEscrows(escrowsData)
      }
      if (whatsappRes.ok) {
        const whatsappData = await whatsappRes.json()
        const normalizedData = whatsappData.map(item => ({
          ...item,
          template_name: item.templateName || item.template_name,
          payload: typeof item.payload === 'object' ? JSON.stringify(item.payload) : item.payload
        }))
        setWhatsappQueue(normalizedData)
      }
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setAdminMetrics(metricsData)
      }
    } catch (err) {
      console.error("Failed to fetch state from backend:", err)
    }
  }

  // Periodic short-polling to ensure real-time reactive updates
  useEffect(() => {
    fetchState()
    const interval = setInterval(fetchState, 3000)
    return () => clearInterval(interval)
  }, [])


  // Real upload function for Gutu OCR Ingestion
  const uploadDocument = async (vin, docType, file) => {
    const formData = new FormData()
    formData.append('vin', vin)
    formData.append('docType', docType)
    formData.append('file', file)

    const response = await fetch('http://localhost:5000/api/documents/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload document')
    }

    const updatedVehicle = await response.json()
    setVehicles(prev => prev.map(v => v.vin === vin ? updatedVehicle : v))
    return updatedVehicle
  }

  // Function to simulate a parts change initiated by a mechanic posting to backend
  const triggerPartSentryChange = async (vin, partName, newSerial, workshop = "Chikwanha Auto Clinic") => {
    const response = await fetch('http://localhost:5000/api/parts/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vin, partName, newSerial, workshop })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to log parts change')
    }

    const data = await response.json()
    // Instantly append to active notifications
    setNotifications(prev => [data, ...prev])
    return data.id
  }

  // Owner approves parts installation (Handshake Complete!)
  const approvePartSentrySwap = async (notificationId) => {
    const response = await fetch('http://localhost:5000/api/parts/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: notificationId })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to approve parts swap')
    }

    const data = await response.json()
    if (data.success) {
      setVehicles(prev => prev.map(v => v.vin === data.vehicle.vin ? data.vehicle : v))
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    }
  }

  // Reject the swap
  const rejectPartSentrySwap = async (notificationId) => {
    const response = await fetch('http://localhost:5000/api/parts/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: notificationId })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to reject parts swap')
    }

    const data = await response.json()
    if (data.success) {
      setVehicles(prev => prev.map(v => v.vin === data.vehicle.vin ? data.vehicle : v))
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    }
  }

  // SafePay Transaction Creation
  const createSafePayEscrow = async (vin, amount, paymentMethod, buyerName = "Simba Choga (Diaspora)") => {
    const response = await fetch('http://localhost:5000/api/escrows/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vin, amount, paymentMethod, buyerName })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create SafePay escrow')
    }

    const data = await response.json()
    setEscrows(prev => [data, ...prev])
    return data.id
  }

  // SafePay Transaction Settle (Released to seller)
  const updateEscrowStatus = async (escrowId, newStatus) => {
    if (newStatus === 'Settled to Seller') {
      try {
        const response = await fetch(`http://localhost:5000/api/escrows/${escrowId}/settle`, {
          method: 'POST'
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to settle escrow')
        }

        const data = await response.json()
        setEscrows(prev => prev.map(e => e.id === escrowId ? data : e))
      } catch (err) {
        console.error("Failed to settle escrow:", err)
      }
    } else {
      // Direct local state sync if needed
      setEscrows(prev => prev.map(e => e.id === escrowId ? { ...e, status: newStatus } : e))
    }
  }

  // Paynow USSD push simulation helper
  const simulatePaynowPayment = async (escrowId, mobileNumber, provider, amount) => {
    const response = await fetch('http://localhost:5000/api/paynow/simulate-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ escrowId, mobileNumber, provider, amount })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to simulate Paynow payment')
    }

    const data = await response.json()
    setEscrows(prev => prev.map(e => e.id === escrowId ? { ...e, status: data.status } : e))
    return data
  }

  // Paynow IPN Webhook callback simulation helper
  const triggerPaynowWebhook = async (escrowId, status) => {
    const response = await fetch('http://localhost:5000/api/paynow/hook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference: escrowId,
        status: status, // 'paid' or 'failed'
        paynowreference: 'paynow-' + Math.random().toString(36).substring(7),
        amount: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to trigger webhook')
    }

    const data = await response.json()
    setEscrows(prev => prev.map(e => e.id === escrowId ? { ...e, status: data.status } : e))
    return data
  }

  // Direct document verification programmatically (Government Registry Portal)
  const verifyDocumentDirectly = async (vin, docType) => {
    const response = await fetch('http://localhost:5000/api/documents/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vin, docType })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to verify document')
    }

    const updatedVehicle = await response.json()
    setVehicles(prev => prev.map(v => v.vin === vin ? updatedVehicle : v))
    return updatedVehicle
  }

  // Paynow Zimbabwe Checkout Splitting helper
  const initiatePaynowCheckoutSplit = async (vin, amount, splitPercentage = 0.85, merchantEmail = "finance@carup.co.zw") => {
    const splitDesc = `Paynow Split (${(splitPercentage * 100).toFixed(0)}/${((1 - splitPercentage) * 100).toFixed(0)})`;
    const response = await fetch('http://localhost:5000/api/escrows/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vin,
        amount,
        paymentMethod: splitDesc,
        buyerName: "Diaspora Split Escrow",
        paynowSplit: {
          merchantEmail,
          amount,
          escrowSplit: amount * splitPercentage,
          dutySplit: amount * (1 - splitPercentage)
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to initiate Paynow split checkout')
    }

    const data = await response.json()
    setEscrows(prev => [data, ...prev])
    return data.id
  }

  // Toggle stolen status (Police Registry Desk)
  const toggleVehicleStolen = async (vin, stolen) => {
    const response = await fetch('http://localhost:5000/api/vehicles/stolen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vin, stolen })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to toggle stolen status')
    }

    const updatedVehicle = await response.json()
    setVehicles(prev => prev.map(v => v.vin === vin ? updatedVehicle : v))
    return updatedVehicle
  }

  return (
    <AppContext.Provider value={{
      vehicles,
      notifications,
      escrows,
      whatsappQueue,
      adminMetrics,
      uploadDocument,
      triggerPartSentryChange,
      approvePartSentrySwap,
      rejectPartSentrySwap,
      createSafePayEscrow,
      updateEscrowStatus,
      verifyDocumentDirectly,
      toggleVehicleStolen,
      initiatePaynowCheckoutSplit,
      simulatePaynowPayment,
      triggerPaynowWebhook
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

