import { TransactionType } from '@prisma/client';

export type UpdateTransactionData = {
  title?: string;
  amount?: number;
  type?: TransactionType;
  date?: Date;
  categoryUuid?: string;
};
