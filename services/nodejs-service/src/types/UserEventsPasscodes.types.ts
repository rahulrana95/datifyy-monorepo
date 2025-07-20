/**
 * UserEventsPasscodes Type
 * Auto-generated from TypeORM entity: UserEventsPasscodes
 */

import { DatifyyEvents } from "../models/entities/DatifyyEvents";

export interface UserEventsPasscodesType {
  id: number;
  eventId: number;
  passcode: string;
  email: string;
  event: DatifyyEvents;
}

// Utility types for UserEventsPasscodes
export type CreateUserEventsPasscodesInput = Omit<UserEventsPasscodesType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserEventsPasscodesInput = Partial<Omit<UserEventsPasscodesType, 'id' | 'createdAt' | 'updatedAt'>>;
export type UserEventsPasscodesId = UserEventsPasscodesType['id'];
