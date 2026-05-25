/**
 * CarUp OS - Highly Normalized Mock Relational Schema
 * 
 * This file serves as the blueprint and mock data source for the normalized 
 * relational database structure of CarUp OS. It replaces the flat initialVehicles 
 * structure and prepares the application for a robust backend integration 
 * (e.g., PostgreSQL or heavily structured NoSQL like Firestore).
 * 
 * The schema defines the following core entities:
 * 1. Users: Base entity for all platform participants (buyers, private sellers, dealer admins).
 * 2. Dealers: Extended profile for commercial entities, linking back to a User.
 * 3. Vehicles: The core asset being transacted. Links to sellers (User or Dealer).
 * 4. Media: 1-to-N relationship with Vehicles for images, videos, and documents.
 * 5. TrustLogs: Immutable ledger entries providing a verified history for Vehicles.
 * 6. EscrowTransactions: State machine records for secure payments between Users.
 */

// ==========================================
// 1. USERS TABLE
// ==========================================
/**
 * Represents individuals on the platform. 
 * 'role' dictates their permissions and user journey.
 */
export const Users = [
  {
    id: 'u_001',
    role: 'buyer', // 'buyer', 'seller', 'dealer', 'admin'
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '+1-555-0101',
    isVerified: true,
    kycStatus: 'approved', // 'pending', 'approved', 'rejected'
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 'u_002',
    role: 'dealer',
    firstName: 'Robert',
    lastName: 'Smith',
    email: 'rob@premiummotors.com',
    phone: '+1-555-0202',
    isVerified: true,
    kycStatus: 'approved',
    createdAt: '2022-11-20T10:15:00Z',
    updatedAt: '2023-05-10T14:20:00Z'
  },
  {
    id: 'u_003',
    role: 'seller', // Private seller
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.j@example.com',
    phone: '+1-555-0303',
    isVerified: false,
    kycStatus: 'pending',
    createdAt: '2023-08-01T09:00:00Z',
    updatedAt: '2023-08-01T09:00:00Z'
  }
];


// ==========================================
// 2. DEALERS TABLE
// ==========================================
/**
 * Represents commercial entities. 
 * Requires a 1-to-1 or N-to-1 relationship with Users (e.g. u_002 is the admin for d_101).
 */
export const Dealers = [
  {
    id: 'd_101',
    userId: 'u_002', // Foreign Key -> Users.id
    dealershipName: 'Premium Motors LLC',
    licenseNumber: 'DL-987654321',
    taxId: 'TX-1234567',
    address: {
      street: '123 Auto Row',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    rating: 4.8, // Aggregate rating out of 5.0
    reviewCount: 124,
    isAuthorized: true,
    createdAt: '2022-11-21T09:00:00Z'
  }
];


// ==========================================
// 3. VEHICLES TABLE
// ==========================================
/**
 * Core inventory entity. 
 * A vehicle can be sold by a private user (sellerId) or a dealership (dealerId).
 */
export const Vehicles = [
  {
    id: 'v_1001',
    ownerId: 'u_002',     // Foreign Key -> Users.id (Current legal owner)
    dealerId: 'd_101',    // Foreign Key -> Dealers.id (Optional, if sold by dealer)
    make: 'Tesla',
    model: 'Model S',
    trim: 'Plaid',
    year: 2022,
    vin: '5YJSA1E21NF000001',
    mileage: 15200,
    price: 85000,
    currency: 'USD',
    status: 'available',  // 'available', 'pending_escrow', 'sold', 'delisted'
    condition: 'used',    // 'new', 'used', 'cpo' (Certified Pre-Owned)
    location: {
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      latitude: 30.2672,
      longitude: -97.7431
    },
    specs: {
      transmission: 'Automatic',
      drivetrain: 'AWD',
      exteriorColor: 'Midnight Silver Metallic',
      interiorColor: 'Black',
      engineType: 'Electric',
      batteryCapacity: '100 kWh'
    },
    description: 'Immaculate condition Model S Plaid. Full self-driving capability included.',
    createdAt: '2023-09-10T12:00:00Z',
    updatedAt: '2023-09-15T08:00:00Z'
  },
  {
    id: 'v_1002',
    ownerId: 'u_003',     // Private seller
    dealerId: null,       // No dealership involved
    make: 'Porsche',
    model: '911',
    trim: 'Carrera S',
    year: 2021,
    vin: 'WP0AB2A90MS000002',
    mileage: 8500,
    price: 115000,
    currency: 'USD',
    status: 'pending_escrow',
    condition: 'used',
    location: {
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      latitude: 25.7617,
      longitude: -80.1918
    },
    specs: {
      transmission: 'PDK',
      drivetrain: 'RWD',
      exteriorColor: 'Guards Red',
      interiorColor: 'Beige',
      engineType: '3.0L Twin-Turbo Flat-6'
    },
    description: 'Weekend driver, garage kept. PPF applied on front bumper and hood.',
    createdAt: '2023-08-05T14:30:00Z',
    updatedAt: '2023-09-20T10:15:00Z'
  }
];


// ==========================================
// 4. MEDIA TABLE
// ==========================================
/**
 * 1-to-N relationship with Vehicles. 
 * Stores image URLs, video walkthroughs, and document scans (e.g. title).
 */
export const Media = [
  {
    id: 'm_5001',
    vehicleId: 'v_1001', // Foreign Key -> Vehicles.id
    type: 'image',       // 'image', 'video', 'document', '360_view'
    url: 'https://storage.carup.os/v_1001/primary_exterior.jpg',
    isPrimary: true,
    sortOrder: 1,
    uploadedAt: '2023-09-10T12:05:00Z'
  },
  {
    id: 'm_5002',
    vehicleId: 'v_1001',
    type: 'video',
    url: 'https://storage.carup.os/v_1001/walkaround.mp4',
    isPrimary: false,
    sortOrder: 2,
    uploadedAt: '2023-09-10T12:06:00Z'
  },
  {
    id: 'm_5003',
    vehicleId: 'v_1002',
    type: 'image',
    url: 'https://storage.carup.os/v_1002/primary_front.jpg',
    isPrimary: true,
    sortOrder: 1,
    uploadedAt: '2023-08-05T14:35:00Z'
  },
  {
    id: 'm_5004',
    vehicleId: 'v_1002',
    type: 'document',
    url: 'https://storage.carup.os/v_1002/clean_title_redacted.pdf',
    isPrimary: false,
    sortOrder: 3,
    uploadedAt: '2023-08-05T14:40:00Z'
  }
];


// ==========================================
// 5. TRUST LOGS TABLE
// ==========================================
/**
 * Acts as an immutable vehicle history report natively built into CarUp.
 * Integrates service records, accident reports, and CarUp-verified inspections.
 */
export const TrustLogs = [
  {
    id: 'tl_8001',
    vehicleId: 'v_1001', // Foreign Key -> Vehicles.id
    eventType: 'inspection', // 'inspection', 'service', 'accident', 'ownership_transfer', 'registration'
    title: 'CarUp 150-Point Certified Inspection',
    description: 'Passed all mechanical and electrical checks. Battery health at 98%.',
    verifiedBy: 'carup_internal', // 'carup_internal', 'third_party_mechanic', 'dmv'
    mileageAtEvent: 15150,
    eventDate: '2023-09-08T10:00:00Z',
    documentUrl: 'https://storage.carup.os/trust/tl_8001_report.pdf',
    createdAt: '2023-09-08T14:00:00Z'
  },
  {
    id: 'tl_8002',
    vehicleId: 'v_1001',
    eventType: 'service',
    title: 'Annual Maintenance',
    description: 'Cabin air filter replaced, tires rotated, brake fluid checked.',
    verifiedBy: 'third_party_mechanic',
    mileageAtEvent: 12000,
    eventDate: '2023-01-10T09:00:00Z',
    documentUrl: null,
    createdAt: '2023-01-12T11:00:00Z'
  },
  {
    id: 'tl_8003',
    vehicleId: 'v_1002',
    eventType: 'service',
    title: 'Oil Change & Fluid Check',
    description: 'Synthetic oil replacement. PDK transmission fluid inspected.',
    verifiedBy: 'third_party_mechanic',
    mileageAtEvent: 8000,
    eventDate: '2023-06-15T13:30:00Z',
    documentUrl: null,
    createdAt: '2023-06-16T09:00:00Z'
  }
];


// ==========================================
// 6. ESCROW TRANSACTIONS TABLE
// ==========================================
/**
 * Financial state machine handling secure payments.
 * Connects a buyer, a seller, and a vehicle, moving through safe transition states.
 */
export const EscrowTransactions = [
  {
    id: 'esc_9001',
    vehicleId: 'v_1002', // Foreign Key -> Vehicles.id
    buyerId: 'u_001',    // Foreign Key -> Users.id
    sellerId: 'u_003',   // Foreign Key -> Users.id
    amount: 115000,
    currency: 'USD',
    status: 'funded',    // 'initiated', 'funded', 'in_transit', 'inspection_period', 'completed', 'disputed', 'cancelled'
    escrowAgent: 'CarUp_Pay_Partner',
    timeline: {
      initiatedAt: '2023-09-18T10:00:00Z',
      fundedAt: '2023-09-19T14:25:00Z',
      shippedAt: null,
      deliveredAt: null,
      inspectionEndsAt: null,
      completedAt: null
    },
    notes: 'Buyer has wired funds. Awaiting seller to schedule transport.',
    createdAt: '2023-09-18T10:00:00Z',
    updatedAt: '2023-09-19T14:25:00Z'
  }
];

export default {
  Users,
  Dealers,
  Vehicles,
  Media,
  TrustLogs,
  EscrowTransactions
};
