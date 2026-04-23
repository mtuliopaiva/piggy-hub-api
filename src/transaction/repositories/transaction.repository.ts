import { TransactionEntity } from '../domain/entities/transaction.entity';
import { CreateTransactionData } from '../domain/types/create-transaction-data.type';

export abstract class TransactionRepository {
  abstract create(data: CreateTransactionData): Promise<TransactionEntity>;
  abstract findMany(
    search?: string,
    categoryUuid?: string,
  ): Promise<TransactionEntity[]>;
  abstract findByUuid(uuid: string): Promise<TransactionEntity | null>;
  abstract count(search?: string, categoryUuid?: string): Promise<number>;
}
