/**
 * Rooms Type
 * Auto-generated from TypeORM entity: Rooms
 */

export interface RoomsType {
  id: number;
  roomId: string;
  unique: true;
  userEmail: string;
  eventId: number;
  event: DatifyyEvents;
}

// Utility types for Rooms
export type CreateRoomsInput = Omit<RoomsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoomsInput = Partial<Omit<RoomsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type RoomsId = RoomsType['id'];
