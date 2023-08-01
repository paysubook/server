export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'cash' | 'card';

export enum GenderCode {
  M = 'm',
  F = 'f',
}

export interface ExpenseRecordBody {
  type: TransactionType;
  paymentMethod: PaymentMethod;
  category: string;
  amount: string;
  description: string;
}
