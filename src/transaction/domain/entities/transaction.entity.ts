import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionEntity {
  uuid: string;
  title: string;
  amount: Decimal;
  type: TransactionType;
  date: Date;
  userUuid: string;
  category: {
    uuid: string;
    name: string;
  };
  categoryUuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
