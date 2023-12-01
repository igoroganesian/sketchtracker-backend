import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/lessons', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM lessons');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;