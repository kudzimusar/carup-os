const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make request
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Starting backend REST API verification tests...');

  try {
    // 1. Get vehicles
    console.log('Testing GET /api/vehicles...');
    const vehiclesRes = await request('GET', '/api/vehicles');
    if (vehiclesRes.status !== 200) throw new Error('GET /api/vehicles failed');
    console.log(`Successfully retrieved ${vehiclesRes.data.length} vehicles.`);

    // 2. Register a new vehicle
    console.log('Testing POST /api/vehicles...');
    const testVin = `TESTVIN${Date.now()}`;
    const newVehicle = {
      vin: testVin,
      licensePlate: 'ABC-1234',
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      price: 15000,
      mileage: 10000,
      engineNo: '2ZR-1234567',
      ecuSerial: 'DENSO-TEST-123',
      gearboxSerial: 'GB-COROLLA-123',
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'Silver',
      sellerType: 'Private Seller',
      sellerName: 'John Doe'
    };
    const regRes = await request('POST', '/api/vehicles', newVehicle);
    if (regRes.status !== 201) throw new Error('POST /api/vehicles failed: ' + JSON.stringify(regRes.data));
    console.log(`Successfully registered new vehicle. VIN: ${regRes.data.vin}`);

    // 3. Create Escrow
    console.log('Testing POST /api/escrows/create...');
    const escrowPayload = {
      vin: testVin,
      amount: 15000,
      paymentMethod: 'Diaspora Split (Mukuru + InnBucks)',
      buyerName: 'Jane Smith'
    };
    const escrowRes = await request('POST', '/api/escrows/create', escrowPayload);
    if (escrowRes.status !== 201) throw new Error('POST /api/escrows/create failed');
    const escrowId = escrowRes.data.id;
    console.log(`Successfully created escrow transaction. ID: ${escrowId}, Status: ${escrowRes.data.status}`);

    // 4. Simulate mobile payment USSD push
    console.log('Testing POST /api/paynow/simulate-payment...');
    const paynowPayload = {
      escrowId: escrowId,
      mobileNumber: '+263772111222',
      provider: 'EcoCash',
      amount: 15000
    };
    const paynowRes = await request('POST', '/api/paynow/simulate-payment', paynowPayload);
    if (paynowRes.status !== 200) throw new Error('POST /api/paynow/simulate-payment failed');
    console.log(`Successfully simulated Paynow USSD push. Status: ${paynowRes.data.status}`);

    // 5. Simulate Paynow Webhook Hook callback (PAID)
    console.log('Testing POST /api/paynow/hook...');
    const hookPayload = {
      reference: escrowId,
      status: 'paid',
      paynowreference: 'paynow-ref-12345',
      amount: 15000
    };
    const hookRes = await request('POST', '/api/paynow/hook', hookPayload);
    if (hookRes.status !== 200) throw new Error('POST /api/paynow/hook failed');
    console.log(`Successfully simulated Paynow Webhook callback. New escrow status: ${hookRes.data.status}`);

    // 6. Settle escrow transaction
    console.log(`Testing POST /api/escrows/${escrowId}/settle...`);
    const settleRes = await request('POST', `/api/escrows/${escrowId}/settle`);
    if (settleRes.status !== 200) throw new Error(`POST /api/escrows/${escrowId}/settle failed`);
    console.log(`Successfully settled escrow transaction. Status: ${settleRes.data.status}`);

    // 7. Verify Blockchain ledger entries
    console.log('Testing GET /api/blockchain...');
    const blockRes = await request('GET', '/api/blockchain');
    if (blockRes.status !== 200) throw new Error('GET /api/blockchain failed');
    console.log(`Successfully retrieved blockchain notary blocks. Total height: ${blockRes.data.length}`);
    const lastBlock = blockRes.data[blockRes.data.length - 1];
    console.log(`Last Block Hash: ${lastBlock.blockHash}`);
    console.log(`Last Block Payload: ${lastBlock.payload}`);

    // 8. Verify Commissions Ledger
    console.log('Testing GET /api/commissions...');
    const commsRes = await request('GET', '/api/commissions');
    if (commsRes.status !== 200) throw new Error('GET /api/commissions failed');
    console.log(`Successfully retrieved commissions ledger. Total count: ${commsRes.data.length}`);
    const matchedComm = commsRes.data.find(c => c.escrowId === escrowId);
    if (!matchedComm) throw new Error('Escrow commission split not logged in commissions ledger');
    console.log(`Commission split verified for escrow ${escrowId}: Rate: ${matchedComm.rate * 100}%, Amount: USD $${matchedComm.amount}`);

    // 9. Verify Admin Metrics
    console.log('Testing GET /api/admin/metrics...');
    const metricsRes = await request('GET', '/api/admin/metrics');
    if (metricsRes.status !== 200) throw new Error('GET /api/admin/metrics failed');
    console.log('Admin metrics successfully verified:');
    console.log(JSON.stringify(metricsRes.data, null, 2));

    console.log('ALL TESTS COMPLETED SUCCESSFULLY WITH ZERO ERRORS.');
    process.exit(0);
  } catch (err) {
    console.error('Test execution failed:', err.message);
    process.exit(1);
  }
}

// Simple delay before running to ensure server is fully up
setTimeout(runTests, 2000);
