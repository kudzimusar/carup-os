const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup file uploads directory
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Helper to mine a blockchain notary block
async function mineNotaryBlock(payloadString) {
  try {
    const lastBlock = await db.get('SELECT * FROM blockchain_ledger ORDER BY block_height DESC LIMIT 1');
    const height = lastBlock ? (lastBlock.block_height + 1) : 1;
    const prevHash = lastBlock ? lastBlock.block_hash : '000000000000000000008d9e2a1b5c3f9f8c7b6a5d4e0a1b2c3d4e5f6g7h8i9j';
    const uniqueInput = `${height}-${prevHash}-${payloadString}-${Date.now()}`;
    const hash = crypto.createHash('sha256').update(uniqueInput).digest('hex');
    await db.run('INSERT INTO blockchain_ledger (block_height, previous_hash, block_hash, payload) VALUES (?, ?, ?, ?)', [height, prevHash, hash, payloadString]);
    return { height, hash };
  } catch (err) {
    console.error('Failed to mine notary block:', err);
    return null;
  }
}

// Helper to queue a simulated WhatsApp alert
async function queueWhatsAppAlert(recipient, templateName, payload) {
  try {
    await db.run('INSERT INTO whatsapp_queue (recipient, template_name, payload) VALUES (?, ?, ?)', [recipient, templateName, JSON.stringify(payload)]);
  } catch (err) {
    console.error('Failed to queue WhatsApp alert:', err);
  }
}

// Helper to compute and update vehicle trust score
async function updateVehicleTrustScore(vin) {
  const v = await db.get('SELECT * FROM vehicles WHERE vin = ?', [vin]);
  if (!v) return;

  if (v.stolen === 1) {
    await db.run('UPDATE vehicles SET trust_index = 0 WHERE vin = ?', [vin]);
    return 0;
  }

  const parts = await db.all('SELECT * FROM parts_ledger WHERE vin = ?', [vin]);
  
  let score = 20; // Base score for profile
  const docWeights = {
    zimra: 15,
    bluebook: 15,
    cid: 15,
    vid: 10,
    zinara: 5,
    insurance: 10,
    invoices: 10
  };

  if (v.zimra_status === 'verified') score += docWeights.zimra;
  else if (v.zimra_status === 'uploaded') score += docWeights.zimra * 0.5;

  if (v.bluebook_status === 'verified') score += docWeights.bluebook;
  else if (v.bluebook_status === 'uploaded') score += docWeights.bluebook * 0.5;

  if (v.cid_status === 'verified') score += docWeights.cid;
  else if (v.cid_status === 'uploaded') score += docWeights.cid * 0.5;

  if (v.vid_status === 'verified') score += docWeights.vid;
  else if (v.vid_status === 'uploaded') score += docWeights.vid * 0.5;

  if (v.zinara_status === 'verified') score += docWeights.zinara;
  else if (v.zinara_status === 'uploaded') score += docWeights.zinara * 0.5;

  if (v.insurance_status === 'verified') score += docWeights.insurance;
  else if (v.insurance_status === 'uploaded') score += docWeights.insurance * 0.5;

  if (v.invoices_status === 'verified') score += docWeights.invoices;
  else if (v.invoices_status === 'uploaded') score += docWeights.invoices * 0.5;

  if (parts && parts.length > 0) {
    const verifiedPartsCount = parts.filter(p => p.status === 'verified').length;
    // Only count active parts, not pending or rejected ones
    const activeParts = parts.filter(p => p.status !== 'pending_approval' && p.status !== 'rejected');
    const totalActive = activeParts.length || parts.length;
    const partRatio = verifiedPartsCount / totalActive;
    score += Math.round(partRatio * 10);
  }

  // Deduct penalty for rejected parts in PartSentry log
  const hasRejected = parts.some(p => p.status === 'rejected');
  if (hasRejected) {
    score = Math.max(0, score - 20);
  }

  const finalScore = Math.min(score, 100);
  await db.run('UPDATE vehicles SET trust_index = ? WHERE vin = ?', [finalScore, vin]);
  return finalScore;
}

// Helper to format a single vehicle object matching React model
async function getFormattedVehicle(vin) {
  const v = await db.get('SELECT * FROM vehicles WHERE vin = ?', [vin]);
  if (!v) return null;

  const historyRows = await db.all('SELECT * FROM history_logs WHERE vin = ? ORDER BY log_date DESC, id DESC', [vin]);
  // Fetch active or rejected parts, not pending swaps
  const partsRows = await db.all('SELECT * FROM parts_ledger WHERE vin = ? AND status != "pending_approval" ORDER BY id ASC', [vin]);

  return {
    vin: v.vin,
    licensePlate: v.license_plate,
    make: v.make,
    model: v.model,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    engineNo: v.engine_no,
    ecuSerial: v.ecu_serial,
    gearboxSerial: v.gearbox_serial,
    transmission: v.transmission,
    fuel: v.fuel,
    color: v.color,
    sellerType: v.seller_type,
    sellerName: v.seller_name,
    trustIndex: v.trust_index,
    stolen: v.stolen === 1,
    documents: {
      zimra: v.zimra_status,
      bluebook: v.bluebook_status,
      cid: v.cid_status,
      vid: v.vid_status,
      zinara: v.zinara_status,
      insurance: v.insurance_status,
      invoices: v.invoices_status
    },
    historyLogs: historyRows.map(h => ({
      date: h.log_date,
      type: h.type,
      desc: h.description,
      source: h.source,
      verified: h.verified === 1
    })),
    parts: partsRows.map(p => ({
      id: p.id.toString(),
      name: p.part_name,
      serial: p.serial_number,
      status: p.status,
      dateInstalled: p.date_installed,
      workshop: p.workshop,
      hash: p.generated_hash || 'unverified'
    }))
  };
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// GET /api/vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const rows = await db.all('SELECT vin FROM vehicles');
    const vehiclesList = [];
    for (const r of rows) {
      const formatted = await getFormattedVehicle(r.vin);
      if (formatted) vehiclesList.push(formatted);
    }
    res.json(vehiclesList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve vehicles.' });
  }
});

// GET /api/vehicles/:vin
app.get('/api/vehicles/:vin', async (req, res) => {
  try {
    const formatted = await getFormattedVehicle(req.params.vin);
    if (!formatted) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve vehicle details.' });
  }
});

// POST /api/vehicles (Register new vehicle)
app.post('/api/vehicles', async (req, res) => {
  const {
    vin, licensePlate, make, model, year, price, mileage,
    engineNo, ecuSerial, gearboxSerial, transmission, fuel, color,
    sellerType, sellerName
  } = req.body;

  if (!vin || !make || !model || !year) {
    return res.status(400).json({ error: 'VIN, make, model, and year are required.' });
  }

  try {
    const existing = await db.get('SELECT vin FROM vehicles WHERE vin = ?', [vin]);
    if (existing) {
      return res.status(400).json({ error: 'Vehicle with this VIN already registered.' });
    }

    // Insert vehicle with default missing document statuses
    await db.run(`
      INSERT INTO vehicles (
        vin, license_plate, make, model, year, price, mileage, 
        engine_no, ecu_serial, gearbox_serial, transmission, fuel, color, 
        seller_type, seller_name, trust_index, zimra_status, bluebook_status, 
        cid_status, vid_status, zinara_status, insurance_status, invoices_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 20, 'missing', 'missing', 'missing', 'missing', 'missing', 'missing', 'missing')
    `, [
      vin, licensePlate || null, make, model, year, price || 0, mileage || 0,
      engineNo || null, ecuSerial || null, gearboxSerial || null, transmission || null,
      fuel || null, color || null, sellerType || 'Private Seller', sellerName || 'Unknown'
    ]);

    // Seed default parts ledger items (Engine Block, ECU, Transmission) with status 'unverified'
    const defaultParts = [
      { name: 'Engine Block', serial: engineNo || 'Unknown-SN' },
      { name: 'ECU (Main Unit)', serial: ecuSerial || 'Unknown-SN' },
      { name: 'Transmission / Gearbox', serial: gearboxSerial || 'Unknown-SN' }
    ];

    for (const p of defaultParts) {
      await db.run(`
        INSERT INTO parts_ledger (vin, part_name, serial_number, status, date_installed, workshop, generated_hash, blockchain_seal)
        VALUES (?, ?, ?, 'unverified', 'Unknown', 'Initial Registration', NULL, NULL)
      `, [vin, p.name, p.serial]);
    }

    // Log the registration milestone
    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, 'mileage', 'Initial registration on CarUp Passport ledger.', 'CVR Registry Sync', 1)
    `, [vin, new Date().toISOString().split('T')[0]]);

    // Calculate trust index
    await updateVehicleTrustScore(vin);

    // Mine blockchain block for new registration
    await mineNotaryBlock(`REGISTER: New vehicle passport initialized on CVR Registry. VIN: ${vin}, Make: ${make}, Model: ${model}`);

    const formatted = await getFormattedVehicle(vin);
    res.status(201).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register vehicle.' });
  }
});

// POST /api/documents/upload (OCR scanner ingestion)
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  const { vin, docType } = req.body;

  if (!vin || !docType) {
    return res.status(400).json({ error: 'VIN and docType are required parameters.' });
  }

  try {
    const vehicle = await db.get('SELECT * FROM vehicles WHERE vin = ?', [vin]);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    const docColumn = `${docType.toLowerCase()}_status`;
    // Update document verification status to verified
    await db.run(`UPDATE vehicles SET ${docColumn} = 'verified' WHERE vin = ?`, [vin]);

    // Handle OCR mileage verification updates
    let extractedLog = '';
    if (docType === 'vid') {
      const originalMileage = vehicle.mileage;
      // Simulate higher mileage reading (e.g. increase by 4200 km)
      const scannedMileage = originalMileage + 4200;
      await db.run('UPDATE vehicles SET mileage = ? WHERE vin = ?', [scannedMileage, vin]);
      extractedLog = ` (Scanned Odometer: ${scannedMileage.toLocaleString()} km. Odometer progression verified).`;
    }

    // Add a history milestone for the newly verified document
    const sourceMap = {
      zimra: 'ZIMRA Customs Ingestion',
      bluebook: 'CVR Blue Book Registry',
      cid: 'CID Theft Squad Registry',
      vid: 'VID Central Department',
      zinara: 'ZINARA Road Tax Service',
      insurance: 'Old Mutual Insurance Hub',
      invoices: 'Gutu OCR Invoice Ingestion'
    };
    const source = sourceMap[docType] || 'Gutu OCR Registry';
    const desc = `Gutu OCR scanned and verified ${docType.toUpperCase()} document.${extractedLog} Data matches registry records.`;

    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, ?, ?, ?, 1)
    `, [vin, new Date().toISOString().split('T')[0], docType, desc, source]);

    // Recompute Trust index
    await updateVehicleTrustScore(vin);

    const formatted = await getFormattedVehicle(vin);
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process document upload and OCR verification.' });
  }
});

// POST /api/parts/swap (Mechanic logs a parts change)
app.post('/api/parts/swap', async (req, res) => {
  const { vin, partName, newSerial, workshop } = req.body;

  if (!vin || !partName || !newSerial) {
    return res.status(400).json({ error: 'VIN, partName, and newSerial are required.' });
  }

  try {
    const vehicle = await db.get('SELECT make, model FROM vehicles WHERE vin = ?', [vin]);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    const clinic = workshop || 'Chikwanha Auto Clinic';

    // Insert pending swap into parts ledger
    const result = await db.run(`
      INSERT INTO parts_ledger (vin, part_name, serial_number, status, date_installed, workshop, generated_hash, blockchain_seal)
      VALUES (?, ?, ?, 'pending_approval', 'Pending Owner Signoff', ?, NULL, NULL)
    `, [vin, partName, newSerial, clinic]);

    // Return the dynamic notification details
    const notificationId = `part-handshake-${result.id}`;
    res.status(201).json({
      id: notificationId,
      dbId: result.id,
      vin,
      type: "part_handshake",
      title: "PartSentry Alert — Owner Handshake Required",
      message: `${clinic} logged a replacement of ${partName} on your ${vehicle.make} ${vehicle.model}. Swap serial ${newSerial}. Verify install?`,
      sender: clinic,
      partName,
      newSerial,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log parts change.' });
  }
});

// GET /api/notifications (Loads dynamic PartSentry pending handshakes)
app.get('/api/notifications', async (req, res) => {
  try {
    const pending = await db.all('SELECT p.*, v.make, v.model, v.license_plate FROM parts_ledger p JOIN vehicles v ON p.vin = v.vin WHERE p.status = "pending_approval"');
    
    const notifications = pending.map(row => ({
      id: `part-handshake-${row.id}`,
      dbId: row.id,
      vin: row.vin,
      type: "part_handshake",
      title: "PartSentry Alert — Owner Handshake Required",
      message: `${row.workshop} logged a replacement of ${row.part_name} on your ${row.make} ${row.model} (${row.license_plate}). Swap serial ${row.serial_number}. Verify install?`,
      sender: row.workshop,
      partName: row.part_name,
      newSerial: row.serial_number,
      timestamp: row.created_at
    }));

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch active alerts.' });
  }
});

// POST /api/parts/approve (Owner signs off component swap)
app.post('/api/parts/approve', async (req, res) => {
  const { id } = req.body; // Can be dbId or parsed notification id

  if (!id) {
    return res.status(400).json({ error: 'Part Swap Record ID (id) is required.' });
  }

  let dbId = id;
  if (typeof id === 'string' && id.startsWith('part-handshake-')) {
    dbId = parseInt(id.replace('part-handshake-', ''), 10);
  }

  try {
    const swapRecord = await db.get('SELECT * FROM parts_ledger WHERE id = ?', [dbId]);
    if (!swapRecord) {
      return res.status(404).json({ error: 'Part swap record not found.' });
    }

    if (swapRecord.status !== 'pending_approval') {
      return res.status(400).json({ error: 'This record has already been finalized.' });
    }

    // Generate SHA-256 cryptographic hash of swap elements
    const uniqueString = `${swapRecord.vin}-${swapRecord.serial_number}-${swapRecord.workshop}-${Date.now()}`;
    const hash = crypto.createHash('sha256').update(uniqueString).digest('hex').substring(0, 12);
    const seal = `ETH-SEAL-0x${hash}`;
    const dateInstalled = new Date().toISOString().split('T')[0];

    // 1. Update the parts ledger item to approved (verified)
    await db.run(`
      UPDATE parts_ledger 
      SET status = 'verified', generated_hash = ?, blockchain_seal = ?, date_installed = ?, finalized_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [hash, seal, dateInstalled, dbId]);

    // 2. Sync the serial key onto the vehicle main columns if it matches standard fields
    const partLower = swapRecord.part_name.toLowerCase();
    if (partLower.includes('ecu')) {
      await db.run('UPDATE vehicles SET ecu_serial = ? WHERE vin = ?', [swapRecord.serial_number, swapRecord.vin]);
    } else if (partLower.includes('engine')) {
      await db.run('UPDATE vehicles SET engine_no = ? WHERE vin = ?', [swapRecord.serial_number, swapRecord.vin]);
    } else if (partLower.includes('transmission') || partLower.includes('gearbox')) {
      await db.run('UPDATE vehicles SET gearbox_serial = ? WHERE vin = ?', [swapRecord.serial_number, swapRecord.vin]);
    }

    // 3. Log milestone in vehicle history logs
    const milestoneDesc = `Tamper-evident PartSentry record created for ${swapRecord.part_name}. Serial: ${swapRecord.serial_number}. Hash: ${hash}`;
    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, 'parts', ?, 'PartSentry Ledger', 1)
    `, [swapRecord.vin, dateInstalled, milestoneDesc]);

    // 4. Update the vehicle trust score
    await updateVehicleTrustScore(swapRecord.vin);

    // Mine blockchain block for approved parts swap
    await mineNotaryBlock(`PARTS_SWAP: Verified swap of ${swapRecord.part_name} on VIN ${swapRecord.vin}. Serial ${swapRecord.serial_number} sealed with hash ${hash}.`);

    // Queue WhatsApp alert to owner confirming seal
    await queueWhatsAppAlert('+263771234567', 'parts_swap_approved', {
      vin: swapRecord.vin,
      partName: swapRecord.part_name,
      serial: swapRecord.serial_number,
      seal: seal
    });

    const formatted = await getFormattedVehicle(swapRecord.vin);
    res.json({
      success: true,
      message: 'PartSentry replacement approved and cryptographically sealed.',
      vehicle: formatted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve swap.' });
  }
});

// POST /api/parts/reject (Owner flags unauthorized parts change)
app.post('/api/parts/reject', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Part Swap Record ID (id) is required.' });
  }

  let dbId = id;
  if (typeof id === 'string' && id.startsWith('part-handshake-')) {
    dbId = parseInt(id.replace('part-handshake-', ''), 10);
  }

  try {
    const swapRecord = await db.get('SELECT * FROM parts_ledger WHERE id = ?', [dbId]);
    if (!swapRecord) {
      return res.status(404).json({ error: 'Part swap record not found.' });
    }

    if (swapRecord.status !== 'pending_approval') {
      return res.status(400).json({ error: 'This record has already been finalized.' });
    }

    const dateInstalled = new Date().toISOString().split('T')[0];

    // 1. Update the parts ledger record to rejected
    await db.run(`
      UPDATE parts_ledger 
      SET status = 'rejected', finalized_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [dbId]);

    // 2. Log severe security warning in history logs
    const warningDesc = `WARNING: Unauthorized parts modification detected. Owner rejected replacement of ${swapRecord.part_name} logged by ${swapRecord.workshop}.`;
    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, 'security', ?, 'PartSentry Security Engine', 0)
    `, [swapRecord.vin, dateInstalled, warningDesc]);

    // 3. Recompute trust score (which automatically applies the penalty)
    await updateVehicleTrustScore(swapRecord.vin);

    // Mine blockchain block for rejected parts swap (security incident)
    await mineNotaryBlock(`SECURITY_FLAG: Unauthorized swap of ${swapRecord.part_name} on VIN ${swapRecord.vin} rejected by owner. Flagged as security risk.`);

    // Queue WhatsApp alert warning about security incident
    await queueWhatsAppAlert('+263771234567', 'parts_swap_rejected_security', {
      vin: swapRecord.vin,
      partName: swapRecord.part_name,
      workshop: swapRecord.workshop
    });

    const formatted = await getFormattedVehicle(swapRecord.vin);
    res.json({
      success: true,
      message: 'PartSentry swap rejected. Severe security flag registered.',
      vehicle: formatted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reject parts swap.' });
  }
});

// GET /api/escrows (List all escrows)
app.get('/api/escrows', async (req, res) => {
  try {
    const escrows = await db.all('SELECT * FROM escrow_transactions ORDER BY date_created DESC');
    res.json(escrows.map(e => ({
      id: e.id,
      vin: e.vin,
      vehicleName: e.vehicle_name,
      amount: e.amount,
      paymentMethod: e.payment_method,
      status: e.status,
      buyer: e.buyer,
      seller: e.seller,
      dateCreated: e.date_created,
      insuranceLinked: e.insurance_linked === 1
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve escrow transactions.' });
  }
});

// POST /api/escrows/create (Create SafePay transaction)
app.post('/api/escrows/create', async (req, res) => {
  const { vin, amount, paymentMethod, buyerName } = req.body;

  if (!vin || !amount || !paymentMethod) {
    return res.status(400).json({ error: 'VIN, amount, and paymentMethod are required.' });
  }

  try {
    const vehicle = await db.get('SELECT make, model, year, seller_name FROM vehicles WHERE vin = ?', [vin]);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    const escrowId = `esc-${Date.now()}`;
    const status = paymentMethod.toLowerCase().includes('diaspora') 
      ? 'ZIMRA Duty Split Confirmed' 
      : 'Funds Escrowed';
      
    const dateCreated = new Date().toISOString().split('T')[0];

    await db.run(`
      INSERT INTO escrow_transactions (id, vin, vehicle_name, amount, payment_method, status, buyer, seller, date_created, insurance_linked)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      escrowId, vin, `${vehicle.year} ${vehicle.make} ${vehicle.model}`, amount, paymentMethod, status,
      buyerName || 'Anonymous Buyer', vehicle.seller_name, dateCreated
    ]);

    // Insert history log
    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, 'insurance', 'SafePay escrow contract initiated. Funds secured via local gateway.', 'SafePay Escrow', 1)
    `, [vin, dateCreated]);

    const created = await db.get('SELECT * FROM escrow_transactions WHERE id = ?', [escrowId]);
    res.status(201).json({
      id: created.id,
      vin: created.vin,
      vehicleName: created.vehicle_name,
      amount: created.amount,
      paymentMethod: created.payment_method,
      status: created.status,
      buyer: created.buyer,
      seller: created.seller,
      dateCreated: created.date_created,
      insuranceLinked: created.insurance_linked === 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create SafePay escrow transaction.' });
  }
});

// POST /api/escrows/:id/settle (Release SafePay funds to seller)
app.post('/api/escrows/:id/settle', async (req, res) => {
  const { id } = req.params;

  try {
    const escrow = await db.get('SELECT * FROM escrow_transactions WHERE id = ?', [id]);
    if (!escrow) {
      return res.status(404).json({ error: 'Escrow transaction not found.' });
    }

    if (escrow.status === 'Settled to Seller') {
      return res.status(400).json({ error: 'This transaction has already been settled.' });
    }

    const dateSettled = new Date().toISOString().split('T')[0];

    // Calculate dynamic 1.2% Paynow/SafePay escrow split commission
    const commissionAmount = escrow.amount * 0.012;
    const sellerDisbursed = escrow.amount - commissionAmount;

    // 1. Update escrow status
    await db.run("UPDATE escrow_transactions SET status = 'Settled to Seller' WHERE id = ?", [id]);

    // 2. Deposit commission fee split inside commissions ledger database
    await db.run("INSERT INTO commissions_ledger (escrow_id, amount, rate) VALUES (?, ?, ?)", [id, commissionAmount, 0.012]);

    // 3. Add history log indicating title change/escrow release
    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, 'parts', 'Ownership release finalized. SafePay funds paid to seller. Title deed transfer cleared.', 'SafePay Escrow', 1)
    `, [escrow.vin, dateSettled]);

    // 4. Mine block on the blockchain notary for escrow release settlement
    await mineNotaryBlock(`SETTLED: Escrow ID ${id} finalized. USD $${escrow.amount.toLocaleString()} settled. Split: Seller (98.8%) received $${sellerDisbursed.toLocaleString()}, Platform Commission (1.2%) received $${commissionAmount.toLocaleString()}`);

    // 5. Queue WhatsApp templates alert to seller confirming disbursement
    await queueWhatsAppAlert('+263771234567', 'escrow_settled_seller', {
      escrowId: id,
      amount: escrow.amount,
      commission: commissionAmount,
      disbursed: sellerDisbursed,
      seller: escrow.seller
    });

    const updated = await db.get('SELECT * FROM escrow_transactions WHERE id = ?', [id]);
    res.json({
      id: updated.id,
      vin: updated.vin,
      vehicleName: updated.vehicle_name,
      amount: updated.amount,
      paymentMethod: updated.payment_method,
      status: updated.status,
      buyer: updated.buyer,
      seller: updated.seller,
      dateCreated: updated.date_created,
      insuranceLinked: updated.insurance_linked === 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to settle escrow payment.' });
  }
});

// POST /api/chats (Save chat message)
app.post('/api/chats', async (req, res) => {
  const { department, sender, message } = req.body;
  if (!department || !sender || !message) {
    return res.status(400).json({ error: 'Department, sender, and message are required.' });
  }

  try {
    const result = await db.run(`
      INSERT INTO gutu_chats (department, sender, message)
      VALUES (?, ?, ?)
    `, [department, sender, message]);
    
    res.status(201).json({ id: result.id, department, sender, message, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save chat message.' });
  }
});

// GET /api/chats/:department (Fetch chat logs for a department)
app.get('/api/chats/:department', async (req, res) => {
  try {
    const chats = await db.all('SELECT * FROM gutu_chats WHERE department = ? ORDER BY timestamp ASC', [req.params.department]);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve chat messages.' });
  }
});

// POST /api/documents/verify (Verify document programmatically without file upload)
app.post('/api/documents/verify', async (req, res) => {
  const { vin, docType } = req.body;

  if (!vin || !docType) {
    return res.status(400).json({ error: 'VIN and docType are required.' });
  }

  try {
    const vehicle = await db.get('SELECT * FROM vehicles WHERE vin = ?', [vin]);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    const docColumn = `${docType.toLowerCase()}_status`;
    await db.run(`UPDATE vehicles SET ${docColumn} = 'verified' WHERE vin = ?`, [vin]);

    const sourceMap = {
      zimra: 'ZIMRA Customs Ingestion',
      bluebook: 'CVR Blue Book Registry',
      cid: 'CID Theft Squad Registry',
      vid: 'VID Central Department',
      zinara: 'ZINARA Road Tax Service',
      insurance: 'Old Mutual Insurance Hub',
      invoices: 'Gutu OCR Invoice Ingestion'
    };
    const source = sourceMap[docType] || 'Government Authority';
    const desc = `Government Admin programmatically verified ${docType.toUpperCase()} document directly via CVR/ZIMRA Sync.`;

    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, ?, ?, ?, 1)
    `, [vin, new Date().toISOString().split('T')[0], docType, desc, source]);

    // Recompute Trust index
    await updateVehicleTrustScore(vin);

    const formatted = await getFormattedVehicle(vin);
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to programmatically verify document.' });
  }
});

// POST /api/vehicles/stolen (Toggle vehicle's stolen status)
app.post('/api/vehicles/stolen', async (req, res) => {
  const { vin, stolen } = req.body;

  if (!vin) {
    return res.status(400).json({ error: 'VIN is required.' });
  }

  try {
    const vehicle = await db.get('SELECT * FROM vehicles WHERE vin = ?', [vin]);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    const isStolen = stolen ? 1 : 0;
    await db.run('UPDATE vehicles SET stolen = ? WHERE vin = ?', [isStolen, vin]);

    const dateLog = new Date().toISOString().split('T')[0];
    if (isStolen === 1) {
      await db.run('UPDATE vehicles SET trust_index = 0 WHERE vin = ?', [vin]);
      
      await db.run(`
        INSERT INTO history_logs (vin, log_date, type, description, source, verified)
        VALUES (?, ?, 'security', 'ALERT: Vehicle flagged as STOLEN by ZRP Police Recovery Desk. Trust Index dropped to 0%. All escrow transactions frozen.', 'ZRP Police Recovery Desk', 0)
      `, [vin, dateLog]);

      // Blockchain & WhatsApp triggers
      await mineNotaryBlock(`POLICE_ALERT: Vehicle flagged STOLEN by ZRP Anti-Theft. VIN: ${vin}. Escrow transactions frozen.`);
      await queueWhatsAppAlert('+263771234567', 'stolen_broadcast', { vin, status: 'STOLEN', agency: 'ZRP Anti-Theft Command' });
    } else {
      await db.run(`
        INSERT INTO history_logs (vin, log_date, type, description, source, verified)
        VALUES (?, ?, 'security', 'RECOVERY: Vehicle stolen flag cleared by ZRP Police Recovery Desk. Recomputing trust index.', 'ZRP Police Recovery Desk', 1)
      `, [vin, dateLog]);

      await updateVehicleTrustScore(vin);

      // Blockchain & WhatsApp triggers
      await mineNotaryBlock(`POLICE_CLEARANCE: Vehicle theft flag cleared. VIN: ${vin}. Recomputed trust registry index.`);
      await queueWhatsAppAlert('+263771234567', 'stolen_cleared', { vin, status: 'CLEARED', agency: 'ZRP Anti-Theft Command' });
    }

    const formatted = await getFormattedVehicle(vin);
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle stolen status.' });
  }
});

// GET /api/blockchain (Retrieve blockchain ledger)
app.get('/api/blockchain', async (req, res) => {
  try {
    const blocks = await db.all('SELECT * FROM blockchain_ledger ORDER BY block_height ASC');
    const formattedBlocks = blocks.map(b => ({
      id: b.id,
      blockHeight: b.block_height,
      previousHash: b.previous_hash,
      blockHash: b.block_hash,
      payload: b.payload,
      createdAt: b.created_at
    }));
    res.json(formattedBlocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve blockchain ledger.' });
  }
});

// POST /api/blockchain/mine (Manually mine a notary block)
app.post('/api/blockchain/mine', async (req, res) => {
  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Payload is required to mine a block.' });
  }

  try {
    const result = await mineNotaryBlock(payload);
    if (!result) {
      return res.status(500).json({ error: 'Block mining failed.' });
    }
    const minedBlock = await db.get('SELECT * FROM blockchain_ledger WHERE block_height = ?', [result.height]);
    res.status(201).json({
      success: true,
      message: 'Block successfully mined and notarized on CarUp Ledger.',
      block: {
        id: minedBlock.id,
        blockHeight: minedBlock.block_height,
        previousHash: minedBlock.previous_hash,
        blockHash: minedBlock.block_hash,
        payload: minedBlock.payload,
        createdAt: minedBlock.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mine block manually.' });
  }
});

// POST /api/paynow/simulate-payment (Simulate mobile money USSD push payment initiation)
app.post('/api/paynow/simulate-payment', async (req, res) => {
  const { escrowId, mobileNumber, provider, amount } = req.body;
  if (!escrowId || !mobileNumber || !provider || !amount) {
    return res.status(400).json({ error: 'escrowId, mobileNumber, provider, and amount are required.' });
  }

  try {
    const escrow = await db.get('SELECT * FROM escrow_transactions WHERE id = ?', [escrowId]);
    if (!escrow) {
      return res.status(404).json({ error: 'Escrow transaction not found.' });
    }

    // Update escrow status to pending Paynow simulation
    const status = 'Paynow Pending (USSD Sent)';
    await db.run('UPDATE escrow_transactions SET status = ? WHERE id = ?', [status, escrowId]);

    const paynowRef = 'paynow-' + crypto.randomBytes(4).toString('hex');

    // Add entry in history logs
    await db.run(`
      INSERT INTO history_logs (vin, log_date, type, description, source, verified)
      VALUES (?, ?, 'insurance', 'Paynow mobile money transaction initiated via EcoCash/OneMoney USSD push.', 'Paynow Gateway', 1)
    `, [escrow.vin, new Date().toISOString().split('T')[0]]);

    // Queue simulated WhatsApp alert
    await queueWhatsAppAlert(mobileNumber, 'paynow_ussd_push', {
      escrowId,
      amount,
      provider,
      mobileNumber
    });

    res.json({
      success: true,
      message: 'Paynow mobile money simulation initiated. USSD push notification sent.',
      escrowId,
      paynowReference: paynowRef,
      pollUrl: `/api/paynow/status/${escrowId}`,
      status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initiate Paynow mobile money simulation.' });
  }
});

// POST /api/paynow/hook (Simulated Paynow Webhook/IPN Callback)
app.post('/api/paynow/hook', async (req, res) => {
  const { reference, status, paynowreference, amount } = req.body; // reference corresponds to escrowId
  if (!reference || !status) {
    return res.status(400).json({ error: 'reference (escrowId) and status are required.' });
  }

  try {
    const escrow = await db.get('SELECT * FROM escrow_transactions WHERE id = ?', [reference]);
    if (!escrow) {
      return res.status(404).json({ error: 'Escrow transaction not found.' });
    }

    const dateLog = new Date().toISOString().split('T')[0];

    if (status.toLowerCase() === 'paid') {
      // Calculate split commission
      const commissionAmount = escrow.amount * 0.012;
      const sellerDisbursed = escrow.amount - commissionAmount;

      // 1. Update escrow status to Funds Escrowed
      await db.run("UPDATE escrow_transactions SET status = 'Funds Escrowed' WHERE id = ?", [reference]);

      // 2. Deposit commission fee split inside commissions ledger
      await db.run("INSERT INTO commissions_ledger (escrow_id, amount, rate) VALUES (?, ?, ?)", [reference, commissionAmount, 0.012]);

      // 3. Add history log indicating payment cleared
      await db.run(`
        INSERT INTO history_logs (vin, log_date, type, description, source, verified)
        VALUES (?, ?, 'insurance', 'Paynow mobile money payment cleared. Funds held in SafePay escrow contract.', 'Paynow Gateway Callback', 1)
      `, [escrow.vin, dateLog]);

      // 4. Mine block on blockchain notary ledger
      await mineNotaryBlock(`PAYNOW_PAYMENT: Escrow ID ${reference} funded via Paynow mobile money. USD $${escrow.amount.toLocaleString()} secured. Platform commission deposited.`);

      // 5. Queue WhatsApp alert to buyer/seller
      await queueWhatsAppAlert('+263771234567', 'paynow_payment_cleared', {
        escrowId: reference,
        amount: escrow.amount,
        commission: commissionAmount,
        paynowReference: paynowreference || 'unknown'
      });

      res.json({
        success: true,
        message: 'Paynow webhook processed. Payment successful, escrow updated, block mined, WhatsApp queued.',
        escrowId: reference,
        status: 'Funds Escrowed'
      });
    } else {
      // Payment failed or cancelled
      await db.run("UPDATE escrow_transactions SET status = 'Payment Failed via Paynow' WHERE id = ?", [reference]);

      await db.run(`
        INSERT INTO history_logs (vin, log_date, type, description, source, verified)
        VALUES (?, ?, 'insurance', 'Paynow mobile money transaction failed or was cancelled by user.', 'Paynow Gateway Callback', 0)
      `, [escrow.vin, dateLog]);

      await queueWhatsAppAlert('+263771234567', 'paynow_payment_failed', {
        escrowId: reference,
        amount: escrow.amount
      });

      res.json({
        success: true,
        message: 'Paynow webhook processed. Payment failed, escrow updated.',
        escrowId: reference,
        status: 'Payment Failed via Paynow'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process Paynow webhook callback.' });
  }
});

// GET /api/paynow/status/:escrowId (Poll transaction status)
app.get('/api/paynow/status/:escrowId', async (req, res) => {
  const { escrowId } = req.params;
  try {
    const escrow = await db.get('SELECT * FROM escrow_transactions WHERE id = ?', [escrowId]);
    if (!escrow) {
      return res.status(404).json({ error: 'Escrow transaction not found.' });
    }
    res.json({
      escrowId: escrow.id,
      status: escrow.status,
      amount: escrow.amount,
      paymentMethod: escrow.payment_method
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve Paynow status.' });
  }
});

// GET /api/whatsapp/queue (Fetch all queued WhatsApp alert logs)
app.get('/api/whatsapp/queue', async (req, res) => {
  try {
    const queue = await db.all('SELECT * FROM whatsapp_queue ORDER BY created_at DESC');
    const formattedQueue = queue.map(q => ({
      id: q.id,
      recipient: q.recipient,
      templateName: q.template_name,
      payload: JSON.parse(q.payload),
      status: q.status,
      createdAt: q.created_at
    }));
    res.json(formattedQueue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve WhatsApp queue.' });
  }
});

// POST /api/whatsapp/dispatch (Simulate dispatching the pending WhatsApp queue)
app.post('/api/whatsapp/dispatch', async (req, res) => {
  try {
    const pendingAlerts = await db.all('SELECT * FROM whatsapp_queue WHERE status = "pending"');
    if (pendingAlerts.length === 0) {
      return res.json({
        success: true,
        message: 'No pending WhatsApp alerts found in the dispatch queue.',
        dispatchedCount: 0
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    const details = [];

    for (const alert of pendingAlerts) {
      // Basic simulation criteria: phone number must have valid format
      const isValid = alert.recipient && (alert.recipient.includes('+') || alert.recipient.length >= 9);
      if (isValid) {
        await db.run('UPDATE whatsapp_queue SET status = "sent" WHERE id = ?', [alert.id]);
        sentCount++;
        details.push({ id: alert.id, recipient: alert.recipient, status: 'sent' });
      } else {
        await db.run('UPDATE whatsapp_queue SET status = "failed" WHERE id = ?', [alert.id]);
        failedCount++;
        details.push({ id: alert.id, recipient: alert.recipient, status: 'failed' });
      }
    }

    res.json({
      success: true,
      message: 'WhatsApp dispatch queue processed.',
      totalProcessed: pendingAlerts.length,
      sent: sentCount,
      failed: failedCount,
      details
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to dispatch WhatsApp queue.' });
  }
});

// GET /api/commissions (Fetch commissions ledger entries)
app.get('/api/commissions', async (req, res) => {
  try {
    const commissions = await db.all('SELECT * FROM commissions_ledger ORDER BY created_at DESC');
    res.json(commissions.map(c => ({
      id: c.id,
      escrowId: c.escrow_id,
      amount: c.amount,
      rate: c.rate,
      createdAt: c.created_at
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve commissions ledger.' });
  }
});

// GET /api/admin/metrics (Retrieve aggregated real-time counts)
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const vehiclesCount = await db.get('SELECT COUNT(*) as count FROM vehicles');
    const partsCount = await db.get('SELECT COUNT(*) as count FROM parts_ledger');
    const pendingPartsCount = await db.get('SELECT COUNT(*) as count FROM parts_ledger WHERE status = "pending_approval"');
    const escrowsCount = await db.get('SELECT COUNT(*) as count FROM escrow_transactions');
    const settledEscrowsCount = await db.get('SELECT COUNT(*) as count FROM escrow_transactions WHERE status = "Settled to Seller"');
    const blockchainCount = await db.get('SELECT COUNT(*) as count FROM blockchain_ledger');
    const commissionsTotal = await db.get('SELECT SUM(amount) as total FROM commissions_ledger');
    const whatsappCount = await db.get('SELECT COUNT(*) as count FROM whatsapp_queue');
    const whatsappPending = await db.get('SELECT COUNT(*) as count FROM whatsapp_queue WHERE status = "pending"');
    const chatsCount = await db.get('SELECT COUNT(*) as count FROM gutu_chats');

    res.json({
      vehicles: vehiclesCount.count,
      parts: partsCount.count,
      pendingParts: pendingPartsCount.count,
      escrows: escrowsCount.count,
      settledEscrows: settledEscrowsCount.count,
      blockchainBlocks: blockchainCount.count,
      totalCommissions: commissionsTotal.total || 0,
      whatsappMessages: whatsappCount.count,
      whatsappPending: whatsappPending.count,
      chats: chatsCount.count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve admin metrics.' });
  }
});

// Start Server after DB initialization
db.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`CarUp REST Backend API running on port ${PORT}`);
    console.log(`Server environment: Development`);
    
    // Automatically transition 'pending' WhatsApp dispatches to 'sent' after 5 seconds to simulate mobile delivery
    setInterval(async () => {
      try {
        const pendings = await db.all("SELECT id, template_name, recipient FROM whatsapp_queue WHERE status = 'pending'");
        for (const msg of pendings) {
          await db.run("UPDATE whatsapp_queue SET status = 'sent' WHERE id = ?", [msg.id]);
          console.log(`[WhatsApp Broker] Message ID ${msg.id} (${msg.template_name}) successfully dispatched to ${msg.recipient}`);
        }
      } catch (err) {
        console.error('Error during auto-whatsapp dispatch simulation:', err);
      }
    }, 5000);
  });
}).catch(err => {
  console.error('Database failed to initialize:', err);
  process.exit(1);
});
