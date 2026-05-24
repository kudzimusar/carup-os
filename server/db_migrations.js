const fs = require('fs');
const path = require('path');
const db = require('./db');

async function ensureMigrationsTable() {
  await db.run(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE,
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function run() {
  await db.initDb();
  const dir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(dir)) {
    console.log('No migrations directory found. Skipping.');
    process.exit(0);
  }
  await ensureMigrationsTable();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const existing = await db.get('SELECT filename FROM schema_migrations WHERE filename = ?', [file]);
    if (existing) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    await db.run('BEGIN TRANSACTION');
    try {
      for (const stmt of sql.split(';').map(s => s.trim()).filter(Boolean)) {
        await db.run(stmt);
      }
      await db.run('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
      await db.run('COMMIT');
      console.log(`Applied migration: ${file}`);
    } catch (e) {
      await db.run('ROLLBACK');
      throw e;
    }
  }
  console.log('Migrations complete.');
}

run().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
