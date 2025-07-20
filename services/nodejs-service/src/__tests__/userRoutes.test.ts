
// src/__tests__/routes/userRoutes.test.ts

import request from 'supertest';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { setupTestDatabase } from './helpers/setupTestDatabase';
import { UsersLogin } from '../models/entities/UsersLogin';
// @ts-ignore
import app from '../index';

describe('User Routes', () => {
  let connection: DataSource;

  beforeAll(async () => {
    // Setup test database connection
    connection = await setupTestDatabase();
  });

    afterAll(async () => {
      if (connection) {
        await connection.destroy();
      }
  });

  beforeEach(async () => {
    // Clear the users table before each test
    await connection.getRepository(UsersLogin).clear();
  });

  describe('POST /signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password'); // Password should not be returned
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        username: 'testuser'
      };

      const response = await request(app)
        .post('/signup')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123', // Too weak
        username: 'testuser'
      };

      const response = await request(app)
        .post('/signup')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('password');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        username: 'testuser'
      };

      await request(app).post('/signup').send(userData);
      
      const response = await request(app)
        .post('/signup')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        username: 'testuser'
      };
      await request(app).post('/signup').send(userData);
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should return 404 for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('User not found');
    });
  });
});