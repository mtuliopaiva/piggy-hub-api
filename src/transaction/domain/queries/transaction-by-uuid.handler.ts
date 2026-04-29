import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionByUuidQuery } from './transaction-by-uuid.query';
import { TransactionService } from '../../service/transaction.service';
import { ReadTransactionDto } from '../dtos/read-transaction.dto';

@QueryHandler(TransactionByUuidQuery)
export class TransactionByUuidHandler implements IQueryHandler<TransactionByUuidQuery> {
  constructor(private readonly service: TransactionService) {}

  async execute(query: TransactionByUuidQuery): Promise<ReadTransactionDto> {
    const transaction = await this.service.findByUuid(query.uuid, query.user);

    return {
      uuid: transaction.uuid,
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category.name,
      categoryUuid: transaction.categoryUuid,
      userUuid: transaction.userUuid,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      deletedAt: transaction.deletedAt ?? null,
    };
  }
}
