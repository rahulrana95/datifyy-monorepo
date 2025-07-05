import request from 'supertest';
import { DataSource } from 'typeorm';
import { setupTestDatabase } from '../helpers/setupTestDatabase';
import { createApp } from '../../src/app';
import { DatifyyUsersLogin } from '../../src/models/entities/DatifyyUsersLogin';

describe('Auth Integration Tests', () => {
  let app: any;
  let dataSource: DataSource;

  beforeAll(async () => {
    // Setup test database
    dataSource = await setupTestDatabase();
    
    // Create app instance
    app = createApp(dataSource);
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Clear users before each test
    await dataSource.getRepository(DatifyyUsersLogin).clear();
  });

  describe('POST /api/v1/auth/signup', () => {
    const validSignupData = {
      email: 'test@example.com',
      password: 'SecurePass123!'
    };

    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(validSignupData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            email: validSignupData.email,
            isAdmin: false
          },
          token: expect.any(String),
          expiresAt: expect.any(String)
        }
      });

      // Verify user was created in database
      const user = await dataSource
        .getRepository(DatifyyUsersLogin)
        .findOne({ where: { email: validSignupData.email } });
      
      expect(user).toBeTruthy();
      expect(user?.email).toBe(validSignupData.email);
      expect(user?.isactive).toBe(true);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_EMAIL');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com',
          password: '123' // Too weak
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('WEAK_PASSWORD');
    });

    it('should return 409 for duplicate email', async () => {
      // First signup
      await request(app)
        .post('/api/v1/auth/signup')
        .send(validSignupData)
        .expect(201);

      // Second signup with same email
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(validSignupData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_ALREADY_EXISTS');
    });

    it('should set secure HTTP-only cookie', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(validSignupData)
        .expect(201);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      
      const tokenCookie = cookies.find((cookie: string) => 
        cookie.startsWith('token=')
      );
      expect(tokenCookie).toContain('HttpOnly');
      expect(tokenCookie).toContain('SameSite=Strict');
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error by closing connection
      await dataSource.destroy();

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(validSignupData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });
  });
});
