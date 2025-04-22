const request = require('supertest');
const app = require('../app');

/*describe('Ping route', () => {
  it('GET /ping should return pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });
});*/

describe('Student Profile API', () => {
  let studentId;

  it('POST /api/profiles - Create student', async () => {
    const res = await request(app).post('/api/profiles').send({
      name: 'Alice',
      favoriteColor: 'Blue',
      favoriteFood: 'Pizza'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    studentId = res.body.id;
  });

  it('GET /api/profiles - Should return list of students', async () => {
    const res = await request(app).get('/api/profiles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/profiles/:id - Should return one student', async () => {
    const res = await request(app).get(`/api/profiles/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Alice');
  });

  it('PUT /api/profiles/:id - Should update student fully', async () => {
    const res = await request(app).put(`/api/profiles/${studentId}`).send({
      name: 'Alice Updated',
      favoriteColor: 'Red',
      favoriteFood: 'Burgers',
      likes: 10
    });
    expect(res.statusCode).toBe(200);
  });

  it('PATCH /api/profiles/:id/likes - Should increment likes', async () => {
    const res = await request(app).patch(`/api/profiles/${studentId}/likes`);
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/profiles/:id - Should delete student', async () => {
    const res = await request(app).delete(`/api/profiles/${studentId}`);
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/profiles/:id - Should return 404 after delete', async () => {
    const res = await request(app).get(`/api/profiles/${studentId}`);
    expect(res.statusCode).toBe(404);
  });
}); 