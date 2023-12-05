import request from 'supertest';
import app from '../src/app';
import db from '../db';

describe('Lesson Routes', () => {
  beforeEach(async () => {
    try {
      const testDb = await db.connect();

      const createTable = `
        CREATE TABLE IF NOT EXISTS lessons (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL
        );
      `;

      await testDb.query(createTable);
      await testDb.release();
    } catch (error) {
      console.error('Error initializing test database:', error);
    }
  });

  describe('GET /api/lessons', () => {
    it('should return all lessons', async () => {
      const response = await request(app).get('/api/lessons');
      console.log(response);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/lessons', () => {
    it('should create a new lesson', async () => {
      const newLesson = {
        title: "Test Lesson",
        content: "Test Lesson Content"
      };

      const response = await request(app)
        .post('/api/lessons')
        .send(newLesson);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newLesson.title);
      expect(response.body.content).toBe(newLesson.content);
    });

    it('should throw a 400 error without title or content', async () => {
      const newLesson = {
        title: "Test Lesson"
      };

      const response = await request(app)
        .post('/api/lessons')
        .send(newLesson);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/lessons', () => {
    it('should create a new lesson', async () => {
      const lessonId = 1;
      const updatedLesson = {
        title: "Updated Test Lesson",
        content: "Updated Test Lesson Content"
      };

      const response = await request(app)
        .patch(`/api/lessons/${lessonId}`)
        .send(updatedLesson);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(updatedLesson.title);
      expect(response.body.content).toBe(updatedLesson.content);
    });

    it('should throw a 404 error if lesson id not found', async () => {
      const lessonId = 999;
      const updatedLesson = {
        title: "Updated Test Lesson",
        content: "Updated Test Lesson Content"
      };

      const response = await request(app)
        .patch(`/api/lessons/${lessonId}`)
        .send(updatedLesson);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/lessons/:id', () => {
    it('should delete an existing lesson', async () => {
      const lessonId = 1;

      const response = await request(app)
        .delete(`/api/lessons/${lessonId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Lesson deleted successfully.' });
    });

    it('should throw a 404 error if lesson id not found', async () => {
      const lessonId = 999;

      const response = await request(app)
        .delete(`/api/lessons/${lessonId}`);

      expect(response.statusCode).toBe(404);
    });
  });
});

afterAll(async () => {
  try {
    const testDb = await db.connect();
    await testDb.query('DROP TABLE IF EXISTS lessons CASCADE');
    await testDb.release();
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
});