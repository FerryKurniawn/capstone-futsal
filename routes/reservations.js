const router = require('express').Router();
const pool = require('../db');

// Endpoint ringan (Read)
router.get('/api/fields', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fields ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint berat (Write + cek bentrok jadwal)
router.post('/api/reservations', async (req, res) => {
  try {
    const { field_id, customer_name, start_time, end_time } = req.body;

    if (!field_id || !customer_name || !start_time || !end_time ||
        new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({ error: 'Data tidak valid' });
    }

    // Query OVERLAPS memindai banyak baris -> lebih lambat dari GET
    const conflict = await pool.query(
      `SELECT 1 FROM reservations
       WHERE field_id = $1
         AND (start_time, end_time) OVERLAPS ($2::timestamp, $3::timestamp)`,
      [field_id, start_time, end_time]
    );
    if (conflict.rowCount > 0) {
      return res.status(409).json({ error: 'Jadwal bentrok' });
    }

    const { rows } = await pool.query(
      `INSERT INTO reservations (field_id, customer_name, start_time, end_time)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [field_id, customer_name, start_time, end_time]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Permintaan gagal diproses' });
  }
});

module.exports = router;
