const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'carup.db');

// Ensure db file directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log(`Connected to self-contained SQLite database at: ${dbPath}`);
  }
});

// Helper functions for Promise-based queries
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize schema and seed data
const initDb = async () => {
  try {
    // Enable Foreign Keys
    await run('PRAGMA foreign_keys = ON');

    // Create Vehicles Table
    await run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        vin TEXT PRIMARY KEY,
        license_plate TEXT,
        make TEXT,
        model TEXT,
        year INTEGER,
        price REAL,
        mileage INTEGER,
        engine_no TEXT,
        ecu_serial TEXT,
        gearbox_serial TEXT,
        transmission TEXT,
        fuel TEXT,
        color TEXT,
        seller_type TEXT,
        seller_name TEXT,
        trust_index INTEGER DEFAULT 20,
        zimra_status TEXT DEFAULT 'missing',
        bluebook_status TEXT DEFAULT 'missing',
        cid_status TEXT DEFAULT 'missing',
        vid_status TEXT DEFAULT 'missing',
        zinara_status TEXT DEFAULT 'missing',
        insurance_status TEXT DEFAULT 'missing',
        invoices_status TEXT DEFAULT 'missing',
        stolen INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure stolen column exists for existing databases
    try {
      await run('ALTER TABLE vehicles ADD COLUMN stolen INTEGER DEFAULT 0');
    } catch (e) {
      // Column already exists, ignore
    }

    // Create History Logs Table
    await run(`
      CREATE TABLE IF NOT EXISTS history_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vin TEXT,
        log_date TEXT,
        type TEXT,
        description TEXT,
        source TEXT,
        verified INTEGER,
        FOREIGN KEY (vin) REFERENCES vehicles (vin) ON DELETE CASCADE
      )
    `);

    // Create Parts Ledger Table
    await run(`
      CREATE TABLE IF NOT EXISTS parts_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vin TEXT,
        part_name TEXT,
        serial_number TEXT,
        status TEXT,
        date_installed TEXT,
        workshop TEXT,
        generated_hash TEXT,
        blockchain_seal TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        finalized_at TEXT,
        FOREIGN KEY (vin) REFERENCES vehicles (vin) ON DELETE CASCADE
      )
    `);

    // Create Escrow Transactions Table
    await run(`
      CREATE TABLE IF NOT EXISTS escrow_transactions (
        id TEXT PRIMARY KEY,
        vin TEXT,
        vehicle_name TEXT,
        amount REAL,
        payment_method TEXT,
        status TEXT,
        buyer TEXT,
        seller TEXT,
        date_created TEXT,
        insurance_linked INTEGER DEFAULT 0,
        FOREIGN KEY (vin) REFERENCES vehicles (vin) ON DELETE CASCADE
      )
    `);

    // Create Gutu Chats Table
    await run(`
      CREATE TABLE IF NOT EXISTS gutu_chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department TEXT,
        sender TEXT,
        message TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Blockchain Notary Ledger Table
    await run(`
      CREATE TABLE IF NOT EXISTS blockchain_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        block_height INTEGER,
        previous_hash TEXT,
        block_hash TEXT,
        payload TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Commissions Ledger Table
    await run(`
      CREATE TABLE IF NOT EXISTS commissions_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        escrow_id TEXT,
        amount REAL,
        rate REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create WhatsApp Queue Table
    await run(`
      CREATE TABLE IF NOT EXISTS whatsapp_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient TEXT,
        template_name TEXT,
        payload TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables successfully initialized.');

    // Seed database if empty
    const checkVehicles = await get('SELECT COUNT(*) as count FROM vehicles');
    if (checkVehicles.count === 0) {
      console.log('Seeding initial vehicle data into database...');
      
      const seedVehicles = [
        {
          vin: "AHTGD6120J7892110",
          license_plate: "AGE-4521",
          make: "Toyota",
          model: "Hilux GD-6 Double Cab",
          year: 2018,
          price: 32500,
          mileage: 94200,
          engine_no: "1GD-7892341",
          ecu_serial: "DENSO-8921-X99",
          gearbox_serial: "GB-52A-9901",
          transmission: "Automatic",
          fuel: "Diesel",
          color: "Granite Grey",
          seller_type: "Verified Dealer",
          seller_name: "Harare Motors Elite",
          trust_index: 55,
          zimra_status: "missing",
          bluebook_status: "uploaded",
          cid_status: "missing",
          vid_status: "verified",
          zinara_status: "verified",
          insurance_status: "uploaded",
          invoices_status: "uploaded"
        },
        {
          vin: "JAPFIT1500GD88219",
          license_plate: "AFH-8921",
          make: "Honda",
          model: "Fit Hybrid",
          year: 2016,
          price: 6800,
          mileage: 145000,
          engine_no: "L15B-3382104",
          ecu_serial: "KEIHIN-FIT-22",
          gearbox_serial: "CVT-HN-882",
          transmission: "CVT Auto",
          fuel: "Hybrid/Petrol",
          color: "Pearl White",
          seller_type: "Private Seller",
          seller_name: "Tendai Mukarati",
          trust_index: 35,
          zimra_status: "missing",
          bluebook_status: "missing",
          cid_status: "missing",
          vid_status: "missing",
          zinara_status: "uploaded",
          insurance_status: "missing",
          invoices_status: "missing"
        },
        {
          vin: "SADLC1508K0021485",
          license_plate: "ALB-0010",
          make: "Toyota",
          model: "Land Cruiser Prado TZ-G",
          year: 2019,
          price: 49500,
          mileage: 62000,
          engine_no: "1KD-9983412",
          ecu_serial: "DENSO-LC-900",
          gearbox_serial: "GB-LC-A9",
          transmission: "Automatic",
          fuel: "Diesel",
          color: "Obsidian Black",
          seller_type: "Certified Dealer",
          seller_name: "Zim Auto Galleries",
          trust_index: 90,
          zimra_status: "verified",
          bluebook_status: "verified",
          cid_status: "verified",
          vid_status: "verified",
          zinara_status: "verified",
          insurance_status: "verified",
          invoices_status: "verified"
        }
      ];

      for (const v of seedVehicles) {
        await run(`
          INSERT INTO vehicles (
            vin, license_plate, make, model, year, price, mileage, 
            engine_no, ecu_serial, gearbox_serial, transmission, fuel, color, 
            seller_type, seller_name, trust_index, zimra_status, bluebook_status, 
            cid_status, vid_status, zinara_status, insurance_status, invoices_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          v.vin, v.license_plate, v.make, v.model, v.year, v.price, v.mileage,
          v.engine_no, v.ecu_serial, v.gearbox_serial, v.transmission, v.fuel, v.color,
          v.seller_type, v.seller_name, v.trust_index, v.zimra_status, v.bluebook_status,
          v.cid_status, v.vid_status, v.zinara_status, v.insurance_status, v.invoices_status
        ]);
      }

      // Seed History Logs
      const seedHistory = [
        // Vehicle 1
        { vin: "AHTGD6120J7892110", date: "2018-04-12", type: "import", desc: "Imported via Beitbridge Port of Entry. Custom duties processed.", source: "ZIMRA", verified: 0 },
        { vin: "AHTGD6120J7892110", date: "2018-05-02", type: "mileage", desc: "First registration. Odometer reading: 12 km.", source: "CVR", verified: 1 },
        { vin: "AHTGD6120J7892110", date: "2020-08-15", type: "service", desc: "Scheduled service at 45,000 km. Engine oil, filters replaced.", source: "Croco Motors", verified: 1 },
        { vin: "AHTGD6120J7892110", date: "2023-11-20", type: "mileage", desc: "VID roadworthiness certificate issued. Odometer: 82,100 km.", source: "VID Department", verified: 1 },
        { vin: "AHTGD6120J7892110", date: "2025-02-18", type: "insurance", desc: "Third-party insurance coverage updated.", source: "Old Mutual Zimbabwe", verified: 1 },
        // Vehicle 2
        { vin: "JAPFIT1500GD88219", date: "2021-09-02", type: "mileage", desc: "First recorded Zimbabwean odometer entry. Odometer: 110,000 km.", source: "ZINARA Tollgate Sync", verified: 1 },
        { vin: "JAPFIT1500GD88219", date: "2024-05-14", type: "mileage", desc: "Second recorded entry. Odometer: 142,000 km.", source: "ZINARA Tollgate Sync", verified: 1 },
        // Vehicle 3
        { vin: "SADLC1508K0021485", date: "2019-09-15", type: "import", desc: "Imported via Durban Port of Entry. Fully verified customs, ZIMRA duties cleared under custom entry bill #ZIMRA-8921-99A.", source: "ZIMRA", verified: 1 },
        { vin: "SADLC1508K0021485", date: "2019-10-01", type: "mileage", desc: "CVR registration Blue Book issued. Odometer: 15 km.", source: "CVR Office", verified: 1 },
        { vin: "SADLC1508K0021485", date: "2021-10-05", type: "service", desc: "Service completed at 20,000 km milestone.", source: "Toyota Zimbabwe", verified: 1 },
        { vin: "SADLC1508K0021485", date: "2023-04-12", type: "service", desc: "Major service completed at 40,000 km. Brakes, auxiliary belts replaced.", source: "Toyota Zimbabwe", verified: 1 },
        { vin: "SADLC1508K0021485", date: "2025-06-18", type: "mileage", desc: "VID comprehensive vehicle test completed.", source: "VID Department", verified: 1 }
      ];

      for (const h of seedHistory) {
        await run(`
          INSERT INTO history_logs (vin, log_date, type, description, source, verified)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [h.vin, h.date, h.type, h.desc, h.source, h.verified]);
      }

      // Seed Parts
      const seedParts = [
        // Vehicle 1
        { vin: "AHTGD6120J7892110", name: "Engine Block", serial: "1GD-7892341", status: "verified", dateInstalled: "2018-03-01", workshop: "Toyota Factory", hash: "8d9e2a1b5c3f", seal: "ETH-SEAL-0x8d9e2a1b5c3f" },
        { vin: "AHTGD6120J7892110", name: "ECU (Main Unit)", serial: "DENSO-8921-X99", status: "verified", dateInstalled: "2018-03-01", workshop: "Toyota Factory", hash: "9f8c7b6a5d4e", seal: "ETH-SEAL-0x9f8c7b6a5d4e" },
        { vin: "AHTGD6120J7892110", name: "Transmission / Gearbox", serial: "GB-52A-9901", status: "verified", dateInstalled: "2018-03-01", workshop: "Toyota Factory", hash: "0a1b2c3d4e5f", seal: "ETH-SEAL-0x0a1b2c3d4e5f" },
        { vin: "AHTGD6120J7892110", name: "Turbocharger Unit", serial: "TB-HILUX-33", status: "verified", dateInstalled: "2022-09-14", workshop: "Croco Motors", hash: "a3b4c5d6e7f8", seal: "ETH-SEAL-0xa3b4c5d6e7f8" },
        // Vehicle 2
        { vin: "JAPFIT1500GD88219", name: "Engine Block", serial: "L15B-3382104", status: "unverified", dateInstalled: "Unknown", workshop: "Japanese Import", hash: "x3y2z1w0v9u8", seal: "ETH-SEAL-0xx3y2z1w0v9u8" },
        { vin: "JAPFIT1500GD88219", name: "ECU (Main Unit)", serial: "KEIHIN-FIT-22", status: "unverified", dateInstalled: "Unknown", workshop: "Japanese Import", hash: "u8v9w0x1y2z3", seal: "ETH-SEAL-0xu8v9w0x1y2z3" },
        { vin: "JAPFIT1500GD88219", name: "Transmission / Gearbox", serial: "CVT-HN-882", status: "unverified", dateInstalled: "Unknown", workshop: "Japanese Import", hash: "z3x2c1v0b9n8", seal: "ETH-SEAL-0xz3x2c1v0b9n8" },
        // Vehicle 3
        { vin: "SADLC1508K0021485", name: "Engine Block", serial: "1KD-9983412", status: "verified", dateInstalled: "2019-08-01", workshop: "Toyota Factory", hash: "f8e7d6c5b4a3", seal: "ETH-SEAL-0xf8e7d6c5b4a3" },
        { vin: "SADLC1508K0021485", name: "ECU (Main Unit)", serial: "DENSO-LC-900", status: "verified", dateInstalled: "2019-08-01", workshop: "Toyota Factory", hash: "a3b4c5d6e7f8", seal: "ETH-SEAL-0xa3b4c5d6e7f8" },
        { vin: "SADLC1508K0021485", name: "Transmission / Gearbox", serial: "GB-LC-A9", status: "verified", dateInstalled: "2019-08-01", workshop: "Toyota Factory", hash: "9d8e7f6a5b4c", seal: "ETH-SEAL-0x9d8e7f6a5b4c" }
      ];

      for (const p of seedParts) {
        await run(`
          INSERT INTO parts_ledger (vin, part_name, serial_number, status, date_installed, workshop, generated_hash, blockchain_seal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [p.vin, p.name, p.serial, p.status, p.dateInstalled, p.workshop, p.hash, p.seal]);
      }

      // Seed Notifications (which are pending PartSentry swaps in the db!)
      // One active handshake: swapped serial DENSO-8921-X99 with DENSO-CYBER-99G on Toy Hilux
      await run(`
        INSERT INTO parts_ledger (vin, part_name, serial_number, status, date_installed, workshop, generated_hash, blockchain_seal)
        VALUES ('AHTGD6120J7892110', 'ECU (Main Unit)', 'DENSO-CYBER-99G', 'pending_approval', 'Pending Owner Signoff', 'Chikwanha Auto Clinic (Verified Workshop #GR-9921)', NULL, NULL)
      `);

      // Seed Escrows
      const seedEscrows = [
        {
          id: "esc-102",
          vin: "AHTGD6120J7892110",
          vehicle_name: "2018 Toyota Hilux",
          amount: 32500,
          payment_method: "Diaspora Split (Mukuru + InnBucks)",
          status: "Verified",
          buyer: "Simba Choga (UK Diaspora)",
          seller: "Harare Motors Elite",
          date_created: "2026-05-18",
          insurance_linked: 1
        }
      ];

      for (const e of seedEscrows) {
        await run(`
          INSERT INTO escrow_transactions (id, vin, vehicle_name, amount, payment_method, status, buyer, seller, date_created, insurance_linked)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [e.id, e.vin, e.vehicle_name, e.amount, e.payment_method, e.status, e.buyer, e.seller, e.date_created, e.insurance_linked]);
      }
      // Seed Genesis block if empty
      const checkBlocks = await get('SELECT COUNT(*) as count FROM blockchain_ledger');
      if (checkBlocks.count === 0) {
        await run(`
          INSERT INTO blockchain_ledger (block_height, previous_hash, block_hash, payload)
          VALUES (0, '0000000000000000000000000000000000000000000000000000000000000000', '000000000000000000008d9e2a1b5c3f9f8c7b6a5d4e0a1b2c3d4e5f6g7h8i9j', 'Genesis Block — CarUp National Automotive Trust Ledger Initialized.')
        `);
      }

      console.log('Database successfully seeded with realistic Zimbabwe data.');
    }
  } catch (err) {
    console.error('Initialization error during schema build/seed:', err);
  }
};

module.exports = {
  db,
  run,
  get,
  all,
  initDb
};
