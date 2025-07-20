/**
 * DatifyyTicketPurchases Type
 * Auto-generated from TypeORM entity: DatifyyTicketPurchases
 */

import { DatifyyEventsType } from "./DatifyyEvents.types";
import { DatifyyUsersLoginType } from "./DatifyyUsersLogin.types";

export interface DatifyyTicketPurchasesType {
  id: number;
  ticketType: string;
  quantity: number;
  totalPrice: string;
  currencyCode: string;
  paymentStatus: string;
  event: DatifyyEventsType;
  user: DatifyyUsersLoginType;
}

// Utility types for DatifyyTicketPurchases
export type CreateDatifyyTicketPurchasesInput = Omit<DatifyyTicketPurchasesType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDatifyyTicketPurchasesInput = Partial<Omit<DatifyyTicketPurchasesType, 'id' | 'createdAt' | 'updatedAt'>>;
export type DatifyyTicketPurchasesId = DatifyyTicketPurchasesType['id'];
