// src/__tests__/setup.ts
import { DataSource } from 'typeorm';
import { setupTestDatabase } from './helpers/setupTestDatabase';

let connection: DataSource;

beforeAll(async () => {
  connection = await setupTestDatabase();
});

afterAll(async () => {
  if (connection) {
    await connection.destroy();
  }
});