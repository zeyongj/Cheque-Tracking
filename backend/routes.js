const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all suppliers
router.get('/suppliers', (req, res) => {
  db.all(`SELECT * FROM suppliers`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const totalSuppliers = rows.length;
    const totalChecks = rows.reduce((sum, row) => sum + (row.num_checks || 0), 0);
    res.json({ suppliers: rows, totalSuppliers, totalChecks });
  });
});

// Update supplier with concurrency check
router.put('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const { supplier_name, email_address, num_checks, date_of_emailing, status, notes, userName, currentLastModifiedAt } = req.body;
  db.get(`SELECT last_modified_at FROM suppliers WHERE id=?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Supplier not found' });

    const dbLastModifiedAt = row.last_modified_at;
    if (dbLastModifiedAt !== currentLastModifiedAt) {
      return res.status(409).json({ error: 'Record has been modified by another user.' });
    }

    const now = new Date().toISOString();
    db.run(`UPDATE suppliers 
            SET supplier_name=?, email_address=?, num_checks=?, date_of_emailing=?, status=?, notes=?, last_modified_by=?, last_modified_at=? 
            WHERE id=?`,
      [supplier_name, email_address, num_checks, date_of_emailing, status, notes, userName, now, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, last_modified_at: now });
      }
    );
  });
});

// Add new supplier with duplicate check
router.post('/suppliers', (req, res) => {
  const { supplier_name, email_address, num_checks, date_of_emailing, status, notes, userName } = req.body;
  const now = new Date().toISOString();
  db.get(`SELECT id FROM suppliers WHERE supplier_name = ?`, [supplier_name], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ error: 'Supplier already exists.' });

    db.run(`INSERT INTO suppliers (supplier_name, email_address, num_checks, date_of_emailing, status, notes, last_modified_by, last_modified_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [supplier_name, email_address, num_checks, date_of_emailing, status, notes, userName, now],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  });
});

// Export suppliers as CSV
router.get('/export', (req, res) => {
  db.all(`SELECT * FROM suppliers`, [], (err, rows) => {
    if (err) return res.status(500).send('Error exporting data.');

    const headers = ['supplier_name', 'email_address', 'num_checks', 'date_of_emailing', 'status', 'notes', 'last_modified_by', 'last_modified_at'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    rows.forEach(row => {
      const values = headers.map(h => {
        const val = row[h] != null ? String(row[h]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="suppliers.csv"');
    res.send(csvContent);
  });
});

module.exports = router;
