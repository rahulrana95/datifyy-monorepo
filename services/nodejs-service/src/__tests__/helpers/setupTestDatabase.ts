// src/__tests__/helpers/setupTestDatabase.ts
import { DataSource } from 'typeorm';

export async function setupTestDatabase() {
  const connection = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: ['src/models/entities/**/*.ts'],
    synchronize: true,
    logging: false
  });

  await connection.initialize();
  return connection;
}