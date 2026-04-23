import { TransactionType } from '@prisma/client';

export type CreateTransactionData = {
  title: string;
  amount: number;
  type: TransactionType;
  date: Date;
  userUuid: string;
  categoryUuid: string;
};
