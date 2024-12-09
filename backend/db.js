const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_name TEXT,
    email_address TEXT,
    num_checks INTEGER,
    date_of_emailing TEXT,
    status TEXT,
    notes TEXT,
    last_modified_by TEXT,
    last_modified_at TEXT
  )`);
});

module.exports = db;
