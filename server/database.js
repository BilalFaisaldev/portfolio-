const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portfolio.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize Tables
function initDatabase() {
  // 1. Personal Info Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS personal_info (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      role_badge TEXT,
      headline_start TEXT,
      headline_gradient TEXT,
      headline_end TEXT,
      subheadline TEXT,
      avatar_text TEXT,
      status_badge TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      email TEXT,
      phone TEXT,
      calendly_url TEXT,
      location TEXT,
      hero_stats TEXT,    -- JSON string array
      about_data TEXT     -- JSON string object
    );
  `);

  // 2. Projects Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,          -- 'client' or 'personal'
      title TEXT NOT NULL,
      subtitle TEXT,
      short_description TEXT,
      full_description TEXT,
      tags TEXT,                  -- JSON string array
      live_url TEXT,
      github_url TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Services Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      bullets TEXT,               -- JSON string array
      icon TEXT
    );
  `);

  // 4. Process Steps Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS process_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT
    );
  `);

  // 5. Testimonials Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      quote TEXT NOT NULL,
      full_quote TEXT,
      rating INTEGER DEFAULT 5
    );
  `);

  // 6. Messages / Inquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✔ SQLite Database initialized at:', dbPath);
}

initDatabase();

module.exports = db;
