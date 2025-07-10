/**
 * DatifyyUsersLogin Type
 * Auto-generated from TypeORM entity: DatifyyUsersLogin
 */

import { DatifyyEventsType } from "./DatifyyEvents.types";
import { DatifyyTicketPurchasesType } from "./DatifyyTicketPurchases.types";
import { DatifyyTransactionsType } from "./DatifyyTransactions.types";

export interface DatifyyUsersLoginType {
  id: number;
  email: string;
  password: string;
  datifyyEvents: DatifyyEventsType[];
  datifyyEvents2: DatifyyEventsType[];
  datifyyTicketPurchases: DatifyyTicketPurchasesType[];
  datifyyTransactions: DatifyyTransactionsType[];
  datifyyTransactions2: DatifyyTransactions[];
  datifyyTransactions3: DatifyyTransactions[];
  datifyyTransactions4: DatifyyTransactions[];
  datifyyUserPartnerPreferences: DatifyyUserPartnerPreferences[];
  datifyyUsersInformations: DatifyyUsersInformation[];
}

// Utility types for DatifyyUsersLogin
export type CreateDatifyyUsersLoginInput = Omit<DatifyyUsersLoginType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDatifyyUsersLoginInput = Partial<Omit<DatifyyUsersLoginType, 'id' | 'createdAt' | 'updatedAt'>>;
export type DatifyyUsersLoginId = DatifyyUsersLoginType['id'];
