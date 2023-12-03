import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM lessons');
    res.json(rows);
    res.json({ message: 'This is the lessons endpoint'});
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
            .status(400)
            .json({ message: 'Title and content are required.' });
  }

  try {
    const insertQuery = 'INSERT INTO lessons (title, content) VALUES ($1, $2) RETURNING *';
    const values = [title, content];

    const { rows } = await pool.query(insertQuery, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    if (typeof (err as { message: unknown }).message === 'string') {
      console.error('Error:', (err as { message: string }).message);
      res.status(500).json({ message: (err as { message: string }).message});
    } else {
      console.error('Unknown Error:', err);
      res.status(500).json({ message: 'An unknown error occured.' });
    }
  }
})

export default router;