const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const db = require('./db');
const router = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Helper function to convert Excel date serial to YYYY-MM-DD string
function convertExcelDateToJSDate(serial) {
  // Excel serial dates start at 1900-01-01 which is considered day 1 (with some quirks).
  // The calculation commonly used:
  // (serial - 25569) * 86400 * 1000 gives milliseconds since 1970-01-01.
  // Then we format the resulting date as YYYY-MM-DD.
  const epoch = (serial - 25569) * 86400 * 1000;
  const date = new Date(epoch);
  return date.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
}

// API routes
app.use('/api', router);

// Admin upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  jsonData.forEach(row => {
    // Extract fields, ensuring exact match with column headers.
    const supplierName = row['Supplier Name'] || '';
    const email = row['Email Address'] || '';
    const checks = row['# of Checks'] || 0;
    let dateEmailing = row['Date of Emailing'];
    const status = row['Replied?'] || '';
    const notes = row['Notes'] || '';

    // If dateEmailing is a number (Excel serial), convert it
    if (typeof dateEmailing === 'number') {
      dateEmailing = convertExcelDateToJSDate(dateEmailing);
    }
    dateEmailing = dateEmailing || '';

    // Check if supplier already exists in DB
    db.get(`SELECT id FROM suppliers WHERE supplier_name = ?`, [supplierName], (err, existing) => {
      if (existing) {
        // Update existing supplier
        db.run(`UPDATE suppliers
                SET email_address = ?, num_checks = ?, date_of_emailing = ?, status = ?, notes = ?, last_modified_by = 'admin', last_modified_at = ?
                WHERE id = ?`,
        [email, checks, dateEmailing, status, notes, new Date().toISOString(), existing.id]);
      } else {
        // Insert new supplier
        db.run(`INSERT INTO suppliers (supplier_name, email_address, num_checks, date_of_emailing, status, notes, last_modified_by, last_modified_at)
                VALUES (?, ?, ?, ?, ?, ?, 'admin', ?)`,
        [supplierName, email, checks, dateEmailing, status, notes, new Date().toISOString()]);
      }
    });
  });

  res.json({ success: true });
});

// Serve the React frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Fallback to frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
