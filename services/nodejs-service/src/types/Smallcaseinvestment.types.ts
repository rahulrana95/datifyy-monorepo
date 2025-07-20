/**
 * Smallcaseinvestment Type
 * Auto-generated from TypeORM entity: Smallcaseinvestment
 */

export interface SmallcaseinvestmentType {
  id: number;
  precision: 53;
}

// Utility types for Smallcaseinvestment
export type CreateSmallcaseinvestmentInput = Omit<SmallcaseinvestmentType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSmallcaseinvestmentInput = Partial<Omit<SmallcaseinvestmentType, 'id' | 'createdAt' | 'updatedAt'>>;
export type SmallcaseinvestmentId = SmallcaseinvestmentType['id'];
