// Seed script - run with: node scripts/seed.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { randomUUID: uuidv4 } = require('crypto');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'carmarket.db');

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    mobile TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    vin TEXT UNIQUE NOT NULL,
    make TEXT,
    model TEXT,
    year TEXT,
    accident_history TEXT,
    keys_count TEXT,
    tire_condition TEXT,
    title_status TEXT,
    damages TEXT,
    mileage TEXT,
    color TEXT,
    expected_price TEXT,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Dummy VINs with pre-populated vehicle data for testing
const dummyVehicles = [
    {
        id: uuidv4(),
        vin: '1HGCM82633A123456',
        make: 'Honda',
        model: 'Accord',
        year: '2003',
        status: 'listed',
    },
    {
        id: uuidv4(),
        vin: '2T1BURHE0JC034567',
        make: 'Toyota',
        model: 'Corolla',
        year: '2018',
        status: 'listed',
    },
    {
        id: uuidv4(),
        vin: '1FTFW1ET5DFA89012',
        make: 'Ford',
        model: 'F-150',
        year: '2013',
        status: 'listed',
    },
    {
        id: uuidv4(),
        vin: 'WDBUF56X08B234567',
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: '2008',
        status: 'listed',
    },
    {
        id: uuidv4(),
        vin: '5YJ3E1EA7JF012345',
        make: 'Tesla',
        model: 'Model 3',
        year: '2018',
        status: 'listed',
    },
];

const insertVehicle = db.prepare(`
  INSERT OR IGNORE INTO vehicles (id, vin, make, model, year, status)
  VALUES (@id, @vin, @make, @model, @year, @status)
`);

for (const v of dummyVehicles) {
    insertVehicle.run(v);
}

console.log('\n✅ Database seeded successfully!\n');
console.log('=== TEST VIN NUMBERS ===');
console.log('You can use these VINs on the landing page:\n');
for (const v of dummyVehicles) {
    console.log(`  VIN: ${v.vin}  →  ${v.year} ${v.make} ${v.model}`);
}
console.log('\n=== NEW VIN (to test blank flow) ===');
console.log('  VIN: NEWVIN0000000001  →  (no data — will be created fresh)\n');
db.close();
