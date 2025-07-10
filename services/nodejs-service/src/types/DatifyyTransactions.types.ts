/**
 * DatifyyTransactions Type
 * Auto-generated from TypeORM entity: DatifyyTransactions
 */

import { DatifyyUsersLoginType } from "./DatifyyUsersLogin.types";

export interface DatifyyTransactionsType {
  transactionId: number;
  transactionType: string;
  amount: string;
  currency: string;
  paymentGateway: string;
  precision: 10;
  scale: 2;
  authorizedBy: DatifyyUsersLoginType;
  initiatedBy: DatifyyUsersLoginType;
  user: DatifyyUsersLoginType;
  user_2: DatifyyUsersLoginType;
}

// Utility types for DatifyyTransactions
export type CreateDatifyyTransactionsInput = Omit<DatifyyTransactionsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDatifyyTransactionsInput = Partial<Omit<DatifyyTransactionsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type DatifyyTransactionsId = DatifyyTransactionsType['transactionId'];
