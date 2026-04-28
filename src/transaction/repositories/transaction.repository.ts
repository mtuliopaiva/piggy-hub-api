import { UpdateTransactionDto } from '../domain/dtos/update-transaction.dto';
import { TransactionEntity } from '../domain/entities/transaction.entity';
import { CreateTransactionData } from '../domain/types/create-transaction-data.type';

export abstract class TransactionRepository {
  abstract create(data: CreateTransactionData): Promise<TransactionEntity>;
  abstract findMany(
    search?: string,
    categoryUuid?: string,
    userUid?: string,
  ): Promise<TransactionEntity[]>;
  abstract findByUuid(uuid: string): Promise<TransactionEntity | null>;
  abstract count(
    search?: string,
    categoryUuid?: string,
    userUid?: string,
  ): Promise<number>;
  abstract updateTransaction(
    uuid: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionEntity>;
  abstract softDelete(uuid: string): Promise<TransactionEntity>;
  abstract restore(uuid: string): Promise<TransactionEntity>;
}
