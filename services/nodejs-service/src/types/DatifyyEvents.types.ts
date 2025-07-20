/**
 * DatifyyEvents Type
 * Auto-generated from TypeORM entity: DatifyyEvents
 */

import { DatifyyTicketPurchasesType } from "./DatifyyTicketPurchases.types";
import { DatifyyUsersLoginType } from "./DatifyyUsersLogin.types";
import { RoomsType } from "./Rooms.types";
import { UserEventsPasscodesType } from "./UserEventsPasscodes.types";
import { VideoChatSessionsType } from "./VideoChatSessions.types";

export interface DatifyyEventsType {
  id: number;
  eventdate: Date;
  totalmenstickets: number;
  totalfemaletickets: number;
  menticketprice: string;
  womenticketprice: string;
  currencycode: string;
  mode: string;
  title: string;
  status: string;
  duration: any;
  maxcapacity: number;
  createdby: DatifyyUsersLoginType;
  updatedby: DatifyyUsersLoginType;
  datifyyTicketPurchases: DatifyyTicketPurchasesType[];
  rooms: RoomsType[];
  userEventsPasscodes: UserEventsPasscodesType[];
  videoChatSessions: VideoChatSessionsType[];
}

// Utility types for DatifyyEvents
export type CreateDatifyyEventsInput = Omit<DatifyyEventsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDatifyyEventsInput = Partial<Omit<DatifyyEventsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type DatifyyEventsId = DatifyyEventsType['id'];
