/**
 * Waitlist Type
 * Auto-generated from TypeORM entity: Waitlist
 */

export interface WaitlistType {
  id: number;
  email: string;
}

// Utility types for Waitlist
export type CreateWaitlistInput = Omit<WaitlistType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWaitlistInput = Partial<Omit<WaitlistType, 'id' | 'createdAt' | 'updatedAt'>>;
export type WaitlistId = WaitlistType['id'];
