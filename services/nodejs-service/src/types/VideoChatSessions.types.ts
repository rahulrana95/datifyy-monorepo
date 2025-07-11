/**
 * VideoChatSessions Type
 * Auto-generated from TypeORM entity: VideoChatSessions
 */

import { DatifyyEventsType } from "./DatifyyEvents.types";

export interface VideoChatSessionsType {
  sessionId: number;
  unique: true;
  event: DatifyyEventsType;
}

// Utility types for VideoChatSessions
export type CreateVideoChatSessionsInput = Omit<VideoChatSessionsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVideoChatSessionsInput = Partial<Omit<VideoChatSessionsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type VideoChatSessionsId = VideoChatSessionsType['sessionId'];