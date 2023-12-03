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
    if (typeof (err as { message: unknown; }).message === 'string') {
      console.error('Error:', (err as { message: string; }).message);
      res.status(500).json({ message: (err as { message: string; }).message });
    } else {
      console.error('Unknown Error:', err);
      res.status(500).json({ message: 'An unknown error occured.' });
    }
  }
});

/** PATCH /api/lessons/:id
 *
 * Description:
 *    Updates specific fields of an existing lesson.
 *
 * Parameters:
 *    - id: Unique identifier of the lesson to update.
 *
 * Request Body:
 *    - Fields that need to be updated (e.g. title, content).
 *    ex. { "title": "New Title", "content": "New Content" }
 *
 * Responses:
 *    - 200 OK: Successful update.
 *    Returns the updated lesson object.
 *
 *    - 400 Bad Request: If the 'id' is invalid or request body is not as expected.
 *
 *    - 404 Not Found: If no lesson with the provided id is found.
 *
 *    - 500 Internal Server Error
*/

router.patch('/api/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // add validation

  try {
    let updateQuery = 'UPDATE lessons SET ';
    const updateValues = [];
    if (title !== undefined) {
      updateValues.push(title);
      updateQuery += `title = $${updateValues.length}`;
    }
    if (content !== undefined) {
      if (updateValues.length > 0) updateQuery += ', ';
      updateValues.push(content);
      updateQuery += `content = $${updateValues.length}`;
    }
    updateQuery += ` WHERE id = $${updateValues.length + 1} RETURNING *`;

    if (updateValues.length === 0) {
      return res
        .status(400)
        .json({ message: 'No fields to update were provided.' });
    }

    const { rows } = await pool.query(updateQuery, [...updateValues, id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/** DELETE /api/lessons/:id
 *
 * Description:
 *    Deletes an existing lesson.
 *
 * Parameters:
 *    - id: Unique identifier of the lesson to delete.
 *
 * Responses:
 *    - 200 OK: Successful deletion
 *    Returns a message confirming deletion.
 *
 *    - 400 Bad Request: If the id is not valid.
 *
 *    - 404 Not Found: If no lesson with the provided id is found.
 *
 *    - 500 Internal Server Error
*/

router.delete('/api/lessons/:id', async (req, res) => {
  const { id } = req.params;

  // validation for id?

  try {
    const deleteQuery = 'DELETE FROM lessons WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(deleteQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    res.status(200).json({ message: 'Lesson deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;