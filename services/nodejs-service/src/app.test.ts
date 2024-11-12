import request from 'supertest';
import app from '.';

describe('GET /api/chat/next-available-user/:eventId/:email', () => {
  it('should return next available user', async () => {
    const response = await request(app).get('/api/chat/next-available-user/1/user@example.com');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Next available user found for chat.');
  });

  it('should return 404 if no event found', async () => {
    const response = await request(app).get('/api/chat/next-available-user/999999/user@example.com');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found.');
  });
});
