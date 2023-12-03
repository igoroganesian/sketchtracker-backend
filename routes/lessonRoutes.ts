import express from 'express';
import pool from '../db';

const router = express.Router();

/** GET /api/lessons
 *
 * Description:
 *    Fetches a list of all lessons from the database
 *
 * Responses:
 *    - 200 OK: Successful retrieval
 *    Returns an array of lesson objects, each containing 'id', 'title', and 'content'
 *    ex. [ {"id": 1, "title": "lesson title", "content": "lesson content" } ]
 *
 *    - 500 Internal Server Error
 */

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM lessons');
    res.json(rows);
    // res.json({ message: 'This is the lessons endpoint'});
  } catch (err) {
    res.status(500).send('Server error');
  }
});

/** POST /api/lessons
 *
 * Description:
 *    Creates a new lesson and inserts it into the database.
 *
 * Request Body:
 *    - title: string - The title of the lesson.
 *    - content: string - The content of the lesson.
 *    ex: { "title": "New Lesson Title", "content": "New Lesson Content" }
 *
 * Responses:
 *    - 201 Created: Successfully created the new lesson.
 *    Returns the new lesson object, including its id, title, and content
 *    ex. { "id": 1, "title": "New Lesson Title", "content": "New Lesson Content" }
 *
 *    - 400 Bad Reqeust: If 'title' or 'content' are missing in the request body.
 *    Returns a message indicating that both title and content are required.
 *    ex. { "message": "Title and content are required."}
 *
 *    - 500 Internal Server Error
 *    Returns a message describing the error.
 */

router.post('/', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
            .status(400)
            .json({ message: 'Title and content are required.' });
  }

  try {
    const insertQuery = `INSERT INTO lessons (title, content)
                         VALUES ($1, $2)
                         RETURNING *`;
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