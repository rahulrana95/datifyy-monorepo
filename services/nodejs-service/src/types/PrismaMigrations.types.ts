/**
 * PrismaMigrations Type
 * Auto-generated from TypeORM entity: PrismaMigrations
 */

export interface PrismaMigrationsType {
  id: string;
  checksum: string;
  migrationName: string;
  startedAt: Date;
  appliedStepsCount: number;
}

// Utility types for PrismaMigrations
export type CreatePrismaMigrationsInput = Omit<PrismaMigrationsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePrismaMigrationsInput = Partial<Omit<PrismaMigrationsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type PrismaMigrationsId = PrismaMigrationsType['id'];
