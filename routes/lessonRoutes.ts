import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // const { rows } = await pool.query('SELECT * FROM lessons');
    // res.json(rows);
    res.json({ message: 'This is the lessons endpoint'});
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;