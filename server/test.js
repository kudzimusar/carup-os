const http = require('http');
const { spawn } = require('child_process');

const PORT = Number(process.env.PORT || 5000);

function request(method, path, body = null, token = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function waitForServer(maxMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const r = await request('GET', '/health');
      if (r.status === 200) return;
    } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error('Server did not become healthy in time');
}

async function runTests() {
  console.log('Starting backend REST API verification tests...');
  const login = await request('POST', '/api/auth/login', { username: 'tester', role: 'admin' });
  const token = login.data.token;

  const vehiclesRes = await request('GET', '/api/vehicles', null, token);
  if (vehiclesRes.status !== 200) throw new Error('GET /api/vehicles failed');

  const testVin = `TESTVIN${Date.now()}`;
  const regRes = await request('POST', '/api/vehicles', {
    vin: testVin, make: 'Toyota', model: 'Corolla', year: 2020, price: 15000, mileage: 10000,
    licensePlate: 'ABC-1234', engineNo: '2ZR-1234567', ecuSerial: 'DENSO-TEST-123', gearboxSerial: 'GB-COROLLA-123', transmission: 'Automatic', fuel: 'Petrol', color: 'Silver', sellerType: 'Private Seller', sellerName: 'John Doe'
  }, token);
  if (regRes.status !== 201) throw new Error('POST /api/vehicles failed');

  const escrowRes = await request('POST', '/api/escrows/create', {
    vin: testVin, amount: 15000, paymentMethod: 'Diaspora Split (Mukuru + InnBucks)', buyerName: 'Jane Smith'
  }, token, { 'Idempotency-Key': `escrow-create-${Date.now()}` });
  if (escrowRes.status !== 201) throw new Error('POST /api/escrows/create failed');

  const escrowId = escrowRes.data.id;
  if ((await request('POST', '/api/paynow/simulate-payment', { escrowId, mobileNumber: '+263772111222', provider: 'EcoCash', amount: 15000 }, token)).status !== 200) throw new Error('paynow simulate failed');
  if ((await request('POST', '/api/paynow/hook', { reference: escrowId, status: 'paid', paynowreference: 'paynow-ref-12345', amount: 15000 }, token)).status !== 200) throw new Error('paynow hook failed');
  if ((await request('POST', `/api/escrows/${escrowId}/settle`, null, token, { 'Idempotency-Key': `escrow-settle-${Date.now()}` })).status !== 200) throw new Error('settle failed');

  if ((await request('GET', '/api/blockchain', null, token)).status !== 200) throw new Error('blockchain failed');
  if ((await request('GET', '/api/commissions', null, token)).status !== 200) throw new Error('commissions failed');
  if ((await request('GET', '/api/admin/metrics', null, token)).status !== 200) throw new Error('metrics failed');

  console.log('ALL TESTS COMPLETED SUCCESSFULLY WITH ZERO ERRORS.');
}

async function main() {
  const child = spawn(process.execPath, ['server.js'], { stdio: 'inherit', env: process.env });
  try {
    await waitForServer();
    await runTests();
    child.kill('SIGTERM');
    process.exit(0);
  } catch (err) {
    console.error('Test execution failed:', err.message || err);
    child.kill('SIGTERM');
    process.exit(1);
  }
}

main();
