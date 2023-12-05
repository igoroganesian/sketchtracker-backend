import request from 'supertest';
import app from '../src/app';

describe('GET /api/lessons', () => {
  it('should return all lessons', async () => {
    const response = await request(app).get('/api/lessons');
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
});